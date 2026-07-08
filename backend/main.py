import sqlite3
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS Ayarları: OPTIONS isteklerini ve tüm metodları kabul eder
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Veri Modelleri
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# Veritabanı Başlatma
def init_db():
    conn = sqlite3.connect("kullanicilar.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

# 1. GİRİŞ İŞLEMİ (Login)
@app.api_route("/api/login", methods=["POST", "OPTIONS"])
async def login(request: Request, user: UserLogin = None):
    # Tarayıcının gönderdiği OPTIONS isteğini karşıla
    if request.method == "OPTIONS":
        return {"status": "ok"}
    
    # POST isteği gelirse çalışacak mantık
    print(f"Giriş isteği alındı: {user.email}")
    
    conn = sqlite3.connect("kullanicilar.db")
    cursor = conn.cursor()
    cursor.execute("SELECT username FROM users WHERE email = ? AND password = ?", 
                   (user.email, user.password))
    user_data = cursor.fetchone()
    conn.close()
    
    if user_data:
        return {"status": "success", "username": user_data[0]}
    else:
        return {"status": "error", "detail": "E-posta veya şifre hatalı!"}

# 2. KAYIT İŞLEMİ (Register)
@app.post("/api/register")
async def register(user: UserRegister):
    conn = sqlite3.connect("kullanicilar.db")
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
                       (user.username, user.email, user.password))
        conn.commit()
        return {"status": "success"}
    except sqlite3.IntegrityError:
        return {"status": "error", "detail": "Bu e-posta zaten kayıtlı!"}
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    # 8000 portunda çalıştır
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)