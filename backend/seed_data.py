import sqlite3

conn = sqlite3.connect("kullanicilar.db")
cursor = conn.cursor()

makaleler = [
    ('natuur', 'Regenwouden', 'Alles wat je moet weten over de longen van onze planeet.',
     'Regenwouden produceren een groot deel van de zuurstof op aarde en zijn de thuisbasis van miljoenen diersoorten.',
     '3 min', 12),
    ('wetenschap', 'AI en de Toekomst', 'Analyses over hoe technologie ons leven zal vormgeven.',
     'Kunstmatige intelligentie analyseert niet alleen data, maar creëert nu ook kunst en schrijft code.',
     '2 min', 24),
    ('ruimte', 'Reis naar Mars', 'De stappen van de mensheid richting kolonisatie van de rode planeet.',
     'Mars is de belangrijkste kandidaat voor de eerste menselijke basis buiten de aarde. De atmosfeer wordt onderzocht.',
     '1 min', 8),
    ('technologie', 'Quantum Computers', 'De volgende stap in supercomputers.',
     'Quantummechanica verandert de manier waarop we data verwerken volledig. Dit is de toekomst of tech.',
     '3 min', 19),
    ('gezondheid', 'Gezond Slaapritme', 'Waarom slaap belangrijker is dan je denkt.',
     'Een goede nachtrust verbetert je immuunsysteem, focus en algehele mentale gezondheid.',
     '2 min', 15),
    ('geschiedenis', 'Het Romeinse Rijk', 'Hoe een kleine stad een wereldrijk werd.',
     'De Romeinen stonden bekend om hun wetten, architectuur en militaire kracht. Hun invloed is vandaag de dag nog steeds zichtbaar.',
     '4 min', 31),
    ('reizen', 'Ontdek Kyoto', 'De culturele hoofdstad van Japan vol tradities.',
     'Kyoto staat bekend om zijn prachtige tempels, traditionele houten huizen en adembenemende bamboebossen.',
     '3 min', 22),
    ('kunst', 'Het Geheim van Da Vinci', 'Een blik op de meesterwerken van de Renaissance.',
     'Leonardo da Vinci was niet alleen een schilder, maar ook een uitvinder en wetenschapper. Zijn technieken veranderden de kunstwereld.',
     '2 min', 17),
    ('sport', 'Marathon Training', 'Goud waardevolle tips voor beginnende hardlopers.',
     'Een marathon lopen vereist niet alleen fysieke kracht, maar ook mentale discipline en een strikt voedingsschema.',
     '3 min', 14),
    ('voeding', 'Het Mediterrane Dieet', 'Waarom dit het gezondste dieet ter wereld is.',
     'Dit dieet is rijk aan olijfolie, vis, groenten en volkoren producten. Het vermindert de kans op hart- en vaatziekten.',
     '2 min', 26),
]

for kategori, baslik, ozet, detay, sure, begeni in makaleler:
    cursor.execute(
        "INSERT INTO articles (kategori, baslik, ozet, detay, sure, begeni) VALUES (?, ?, ?, ?, ?, ?)",
        (kategori, baslik, ozet, detay, sure, begeni)
    )

# İlk makaleye (Regenwouden) örnek bir yorum ekleyelim
cursor.execute("SELECT id FROM articles WHERE baslik = 'Regenwouden'")
regenwouden_id = cursor.fetchone()[0]
cursor.execute(
    "INSERT INTO comments (article_id, isim, metin) VALUES (?, ?, ?)",
    (regenwouden_id, 'Ahmet', 'Heerlijk artikel!')
)

conn.commit()
conn.close()

print("10 makale basariyla eklendi!")