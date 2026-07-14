import sqlite3
import secrets
from fastapi import FastAPI, Request, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from typing import Optional

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Aktif giriş yapmış kullanıcıların anahtarlarını (token) hafızada tutuyoruz.
# NOT: Backend yeniden başlatılınca bu liste sıfırlanır, herkesin tekrar giriş yapması gerekir.
aktif_oturumlar = {}

def admin_yetkisi_gerekli(authorization: Optional[str] = Header(None)):
    """Bu fonksiyon, admin'e özel bir endpoint'e istek gelince otomatik çalışır.
    Geçerli ve admin'e ait bir anahtar yoksa isteği reddeder."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Giriş yapmanız gerekiyor")

    token = authorization.replace("Bearer ", "")
    kullanici = aktif_oturumlar.get(token)

    if not kullanici:
        raise HTTPException(status_code=401, detail="Oturum geçersiz, tekrar giriş yapın")

    if kullanici["role"] != "admin":
        raise HTTPException(status_code=403, detail="Bu işlem için admin yetkisi gerekiyor")

    return kullanici

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Veri Modelleri ----------
class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    hesap_tipi: Optional[str] = "kullanici"

class UserLogin(BaseModel):
    email: str
    password: str

class ArticleCreate(BaseModel):
    kategori: str
    baslik: str
    ozet: str
    detay: str
    sure: str

class CommentCreate(BaseModel):
    isim: str
    metin: str

# ---------- Veritabanı Başlatma ----------
def get_db():
    conn = sqlite3.connect("kullanicilar.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'kullanici'
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kategori TEXT NOT NULL,
            baslik TEXT NOT NULL,
            ozet TEXT NOT NULL,
            detay TEXT NOT NULL,
            sure TEXT NOT NULL,
            begeni INTEGER NOT NULL DEFAULT 0
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            article_id INTEGER NOT NULL,
            isim TEXT NOT NULL,
            metin TEXT NOT NULL,
            FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
        )
    """)

    conn.commit()
    conn.close()

init_db()

# ---------- GİRİŞ / KAYIT ----------
@app.post("/api/login")
async def login(user: UserLogin):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT username, password, role FROM users WHERE email = ?", (user.email,))
    user_data = cursor.fetchone()
    conn.close()

    if user_data and pwd_context.verify(user.password, user_data["password"]):
        token = secrets.token_hex(16)
        aktif_oturumlar[token] = {"username": user_data["username"], "role": user_data["role"]}
        return {
            "status": "success",
            "username": user_data["username"],
            "role": user_data["role"],
            "token": token,
        }
    else:
        return {"status": "error", "detail": "E-posta veya şifre hatalı!"}

@app.post("/api/register")
async def register(user: UserRegister):
    conn = get_db()
    cursor = conn.cursor()
    try:
        hashed_password = pwd_context.hash(user.password)
        cursor.execute(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
            (user.username, user.email, hashed_password, user.hesap_tipi)
        )
        conn.commit()
        return {"status": "success"}
    except sqlite3.IntegrityError:
        return {"status": "error", "detail": "Bu e-posta zaten kayıtlı!"}
    finally:
        conn.close()

# ---------- KULLANICI YÖNETİMİ (Admin) ----------
@app.get("/api/users")
async def get_users(current_admin: dict = Depends(admin_yetkisi_gerekli)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, role FROM users")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.delete("/api/users/{user_id}")
async def delete_user(user_id: int, current_admin: dict = Depends(admin_yetkisi_gerekli)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return {"status": "success"}

# ---------- MAKALELER ----------
@app.get("/api/articles")
async def get_articles():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM articles ORDER BY id DESC")
    articles = [dict(row) for row in cursor.fetchall()]

    for article in articles:
        cursor.execute("SELECT id, isim, metin FROM comments WHERE article_id = ?", (article["id"],))
        article["yorumlar"] = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return articles

@app.post("/api/articles")
async def create_article(article: ArticleCreate, current_admin: dict = Depends(admin_yetkisi_gerekli)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO articles (kategori, baslik, ozet, detay, sure, begeni) VALUES (?, ?, ?, ?, ?, 0)",
        (article.kategori, article.baslik, article.ozet, article.detay, article.sure)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"status": "success", "id": new_id}

@app.delete("/api/articles/{article_id}")
async def delete_article(article_id: int, current_admin: dict = Depends(admin_yetkisi_gerekli)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM articles WHERE id = ?", (article_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Makale bulunamadı")
    return {"status": "success"}

@app.post("/api/articles/{article_id}/like")
async def like_article(article_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE articles SET begeni = begeni + 1 WHERE id = ?", (article_id,))
    conn.commit()
    cursor.execute("SELECT begeni FROM articles WHERE id = ?", (article_id,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Makale bulunamadı")
    return {"status": "success", "begeni": row["begeni"]}

# ---------- YORUMLAR ----------
@app.post("/api/articles/{article_id}/comments")
async def add_comment(article_id: int, comment: CommentCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO comments (article_id, isim, metin) VALUES (?, ?, ?)",
        (article_id, comment.isim, comment.metin)
    )
    conn.commit()
    conn.close()
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)