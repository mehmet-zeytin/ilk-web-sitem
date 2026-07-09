import { useState, useEffect } from 'react';

const KATEGORILER = [
  'alles', 'natuur', 'wetenschap', 'ruimte', 'technologie', 
  'gezondheid', 'geschiedenis', 'reizen', 'kunst', 'sport', 'voeding'
];

const ILK_ICERIKLER = [
  { id: 1, kategori: 'natuur', baslik: 'Regenwouden', ozet: 'Alles wat je moet weten over de longen van onze planeet.', detay: 'Regenwouden produceren een groot deel van de zuurstof op aarde en zijn de thuisbasis van miljoenen diersoorten.', sure: '3 min', begeni: 12, yorumlar: [{ isim: 'Ahmet', metin: 'Heerlijk artikel!' }] },
  { id: 2, kategori: 'wetenschap', baslik: 'AI en de Toekomst', ozet: 'Analyses over hoe technologie ons leven zal vormgeven.', detay: 'Kunstmatige intelligentie analyseert niet alleen data, maar creëert nu ook kunst en schrijft code.', sure: '2 min', begeni: 24, yorumlar: [] },
  { id: 3, kategori: 'ruimte', baslik: 'Reis naar Mars', ozet: 'De stappen van de mensheid richting kolonisatie van de rode planeet.', detay: 'Mars is de belangrijkste kandidaat voor de eerste menselijke basis buiten de aarde. De atmosfeer wordt onderzocht.', sure: '1 min', begeni: 8, yorumlar: [] },
  { id: 4, kategori: 'technologie', baslik: 'Quantum Computers', ozet: 'De volgende stap in supercomputers.', detay: 'Quantummechanica verandert de manier waarop we data verwerken volledig. Dit is de toekomst of tech.', sure: '3 min', begeni: 19, yorumlar: [] },
  { id: 5, kategori: 'gezondheid', baslik: 'Gezond Slaapritme', ozet: 'Waarom slaap belangrijker is dan je denkt.', detay: 'Een goede nachtrust verbetert je immuunsysteem, focus en algehele mentale gezondheid.', sure: '2 min', begeni: 15, yorumlar: [] },
  { id: 6, kategori: 'geschiedenis', baslik: 'Het Romeinse Rijk', ozet: 'Hoe een kleine stad een wereldrijk werd.', detay: 'De Romeinen stonden bekend om hun wetten, architectuur en militaire kracht. Hun invloed is vandaag de dag nog steeds zichtbaar.', sure: '4 min', begeni: 31, yorumlar: [] },
  { id: 7, kategori: 'reizen', baslik: 'Ontdek Kyoto', ozet: 'De culturele hoofdstad van Japan vol tradities.', detay: 'Kyoto staat bekend om zijn prachtige tempels, traditionele houten huizen en adembenemende bamboebossen.', sure: '3 min', begeni: 22, yorumlar: [] },
  { id: 8, kategori: 'kunst', baslik: 'Het Geheim van Da Vinci', ozet: 'Een blik op de meesterwerken van de Renaissance.', detay: 'Leonardo da Vinci was niet alleen een schilder, maar ook een uitvinder en wetenschapper. Zijn technieken veranderden de kunstwereld.', sure: '2 min', begeni: 17, yorumlar: [] },
  { id: 9, kategori: 'sport', baslik: 'Marathon Training', ozet: 'Goud waardevolle tips voor beginnende hardlopers.', detay: 'Een marathon lopen vereist niet alleen fysieke kracht, maar ook mentale discipline en een strikt voedingsschema.', sure: '3 min', begeni: 14, yorumlar: [] },
  { id: 10, kategori: 'voeding', baslik: 'Het Mediterrane Dieet', ozet: 'Waarom dit het gezondste dieet ter wereld is.', detay: 'Dit dieet is rijk aan olijfolie, vis, groenten en volkoren producten. Het vermindert de kans op hart- en vaatziekten.', sure: '2 min', begeni: 26, yorumlar: [] }
];

export default function App() {
  const [icerikler, setIcerikler] = useState(ILK_ICERIKLER);
  const [aktifKategori, setAktifKategori] = useState('alles');
  const [secilenMakale, setSecilenMakale] = useState(null);
  const [aramaMetni, setAramaMetni] = useState('');
  const [favoriler, setFavoriler] = useState([]);
  const [alleenFavorieten, setAlleenFavorieten] = useState(false);
  const [notificatie, setNotificatie] = useState(null);

  const [rol, setRol] = useState('misafir'); 
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [aktifModal, setAktifModal] = useState(null);
  const [girisHata, setGirisHata] = useState('');

  const [formEmail, setFormEmail] = useState('');
  const [formSifre, setFormSifre] = useState('');
  const [formUsername, setFormUsername] = useState('');

  const [yeniBaslik, setYeniBaslik] = useState('');
  const [yeniOzet, setYeniOzet] = useState('');
  const [yeniDetay, setYeniDetay] = useState('');
  const [yeniKategori, setYeniKategori] = useState('natuur');
  const [yeniSure, setYeniSure] = useState('2 min');
  const [yeniYorum, setYeniYorum] = useState('');

  const toonNotificatie = (tekst, type = 'succes') => {
    setNotificatie({ tekst, type });
  };

  useEffect(() => {
    if (notificatie) {
      const timer = setTimeout(() => setNotificatie(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notificatie]);

  const formuTemizle = () => {
    setFormEmail('');
    setFormSifre('');
    setFormUsername('');
    setGirisHata('');
  };

  const handleGirisSubmit = async (e) => {
    e.preventDefault();
    setGirisHata('');

    try {
        const response = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formEmail, password: formSifre }),
        });

        const data = await response.json();

        if (data.status === 'success') {
            toonNotificatie("Welkom! 👋", "succes");
            setKullaniciAdi(data.username || "Gebruiker");
            setRol(data.username === 'admin' ? 'admin' : 'kullanici');
            setAktifModal(null);
            formuTemizle();
        } else {
            setGirisHata(data.detail || "Fout bij inloggen");
        }
    } catch (error) {
        console.error("Fetch hatası:", error);
        setGirisHata("Server niet bereikbaar!");
    }
};

  const handleKayitSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: formUsername, 
          email: formEmail, 
          password: formSifre,
          role: aktifModal === 'admin_kayit' ? 'admin' : 'kullanici' 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toonNotificatie("Registratie succesvol! Log nu in.", "succes");
        setAktifModal(aktifModal === 'admin_kayit' ? 'admin' : 'kullanici');
        formuTemizle();
      } else {
        toonNotificatie(data.detail || "Registratie mislukt", "fout");
      }
    } catch (error) {
      toonNotificatie("Server niet bereikbaar!", "fout");
    }
  };

  const handleMakaleEkle = (e) => {
    e.preventDefault();
    if (!yeniBaslik.trim() || !yeniDetay.trim()) return;
    const yeniEklenti = {
      id: Date.now(),
      kategori: yeniKategori,
      baslik: yeniBaslik,
      ozet: yeniOzet || yeniDetay.substring(0, 60) + "...",
      detay: yeniDetay,
      sure: yeniSure,
      begeni: 0,
      yorumlar: []
    };
    setIcerikler([yeniEklenti, ...icerikler]);
    setYeniBaslik('');
    setYeniOzet('');
    setYeniDetay('');
    toonNotificatie("Artikel succesvol gepubliceerd! 🚀");
  };

  const makaleSil = (id) => {
    if (confirm("Weet u zeker dat u dit artikel wilt verwijderen?")) {
      setIcerikler(icerikler.filter(item => item.id !== id));
      setSecilenMakale(null);
      toonNotificatie("Artikel succesvol verwijderd! 🗑️", "fout");
    }
  };

  const handleBegeni = (id, e) => {
    e.stopPropagation();
    setIcerikler(icerikler.map(item => item.id === id ? { ...item, begeni: item.begeni + 1 } : item));
    if (secilenMakale && secilenMakale.id === id) {
      setSecilenMakale(prev => ({ ...prev, begeni: prev.begeni + 1 }));
    }
    toonNotificatie("Artikel leuk gevonden! ❤️");
  };

  const toggleFavori = (id, e) => {
    e.stopPropagation();
    if (favoriler.includes(id)) {
      setFavoriler(favoriler.filter(favId => favId !== id));
      toonNotificatie("Verwijderd uit bladwijzers 📑", "fout");
    } else {
      setFavoriler([...favoriler, id]);
      toonNotificatie("Toegevoegd aan bladwijzers! 📑");
    }
  };

  const handleYorumEkle = (e) => {
    e.preventDefault();
    if (!yeniYorum.trim()) return;
    const aktifIsim = rol !== 'misafir' ? kullaniciAdi : 'Bezoeker';
    const guncelYorumlar = [...secilenMakale.yorumlar, { isim: aktifIsim, metin: yeniYorum }];
    setIcerikler(icerikler.map(item => item.id === secilenMakale.id ? { ...item, yorumlar: guncelYorumlar } : item));
    setSecilenMakale(prev => ({ ...prev, yorumlar: guncelYorumlar }));
    setYeniYorum('');
    toonNotificatie("Reactie succesvol geplaatst! 💬");
  };

  const totaalArtikelen = icerikler.length;
  const getTopCategorieen = () => {
    const katBegeniler = {};
    icerikler.forEach(item => { katBegeniler[item.kategori] = (katBegeniler[item.kategori] || 0) + item.begeni; });
    return Object.entries(katBegeniler).sort((a, b) => b[1] - a[1]).slice(0, 3).map(entry => entry[0]);
  };
  const top3Categorieen = getTopCategorieen();

  const filtrelenmisIcerikler = icerikler.filter(item => {
    const kategoriUyumlu = aktifKategori === 'alles' || item.kategori === aktifKategori;
    const aramaUyumlu = item.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) || item.ozet.toLowerCase().includes(aramaMetni.toLowerCase());
    const favoriUyumlu = !alleenFavorieten || favoriler.includes(item.id);
    return kategoriUyumlu && aramaUyumlu && favoriUyumlu;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
      {notificatie && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl font-bold shadow-2xl border transition-all duration-300 transform translate-y-0 text-sm flex items-center gap-2 ${notificatie.type === 'succes' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-red-500 text-white border-red-600'}`}>
          {notificatie.type === 'succes' ? '✅' : '❌'} {notificatie.tekst}
        </div>
      )}

      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          <button
            onClick={() => { setAktifKategori('alles'); setSecilenMakale(null); setAlleenFavorieten(false); }}
            className="flex items-center gap-3 group cursor-pointer border-none bg-transparent text-left"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center text-xl shadow-lg">🌍</div>
            <div><span className="block text-lg font-black text-slate-900 tracking-tight">WERELD & LEVEN</span></div>
          </button>

          <nav className="flex items-center gap-6 text-sm text-slate-600">
            <span
              onClick={() => { setSecilenMakale(null); setAlleenFavorieten(false); }}
              className="hover:text-slate-900 cursor-pointer transition font-medium"
            >
              Ontdek
            </span>

            <button
              onClick={() => { setAlleenFavorieten(!alleenFavorieten); setSecilenMakale(null); }}
              className={`bg-transparent border-none font-medium cursor-pointer transition flex items-center gap-1.5 ${alleenFavorieten ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <span>📑 Bladwijzers</span>
              <span className="bg-slate-200 text-xs px-1.5 py-0.5 rounded-md text-slate-700 font-bold">
                {favoriler?.length || 0}
              </span>
            </button>

            {rol === 'misafir' ? (
              <button
                onClick={() => setAktifModal('kullanici')}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold cursor-pointer transition shadow-sm"
              >
                Inloggen
              </button>
            ) : (
              <button
                onClick={() => { setRol('misafir'); setKullaniciAdi(''); }}
                className={`px-3 py-1.5 rounded-lg font-medium border cursor-pointer transition ${rol === 'admin' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}
              >
                {rol === 'admin' ? `🔴 Admin: ${kullaniciAdi} (Log uit)` : `👤 ${kullaniciAdi} (Log uit)`}
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {rol === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Totaal Artikelen</span>
              <span className="text-3xl font-black text-slate-800 mt-1">{totaalArtikelen} 📝</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Top 3 Populaire Categorieën</span>
              <div className="flex gap-2 mt-2">
                {top3Categorieen.map((kat, i) => (
                  <span key={kat} className="text-xs bg-emerald-50 border border-emerald-100 px-2 py-1 rounded text-emerald-600 font-bold capitalize">#{i + 1} {kat}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {!secilenMakale ? (
          <>
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <input type="text" placeholder="Zoek live in artikelen..." value={aramaMetni} onChange={(e) => setAramaMetni(e.target.value)} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition shadow-sm" />
                {aramaMetni && <button onClick={() => setAramaMetni('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">✕</button>}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-12 w-full max-w-5xl mx-auto px-2">
              {KATEGORILER.map((kat) => (
                <button key={kat} onClick={() => setAktifKategori(kat)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition cursor-pointer border ${aktifKategori === kat ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                  {kat === 'alles' ? 'Alle Artikelen 📑' : kat}
                </button>
              ))}
            </div>

            {rol === 'admin' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto mb-12 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">📝 Nieuw Artikel Toevoegen</h3>
                <form onSubmit={handleMakaleEkle} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Artikel Titel" value={yeniBaslik} onChange={(e) => setYeniBaslik(e.target.value)} className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-500" required />
                    <select value={yeniKategori} onChange={(e) => setYeniKategori(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-emerald-500 capitalize">
                      {KATEGORILER.filter(k => k !== 'alles').map(k => (<option key={k} value={k}>{k}</option>))}
                    </select>
                  </div>
                  <input type="text" placeholder="Korte Samenvatting (Optioneel)" value={yeniOzet} onChange={(e) => setYeniOzet(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-500" />
                  <textarea placeholder="Gedetailleerde Artikel Inhoud..." value={yeniDetay} onChange={(e) => setYeniDetay(e.target.value)} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-500" required></textarea>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>⏱️ Leestijd:</span>
                      {['1 min', '2 min', '3 min'].map(sure => (<button type="button" key={sure} onClick={() => setYeniSure(sure)} className={`px-2 py-1 rounded ${yeniSure === sure ? 'bg-emerald-500 text-white font-bold' : 'bg-white border border-slate-200'}`}>{sure}</button>))}
                    </div>
                    <button type="submit" className="bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-emerald-600 transition cursor-pointer">Publiceren 🚀</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrelenmisIcerikler.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
                >
                  <button onClick={(e) => toggleFavori(item.id, e)} className="self-end text-lg bg-transparent border-none cursor-pointer">
                    {favoriler.includes(item.id) ? '📑' : '🔖'}
                  </button>

                  <div className="flex flex-col mt-2">
                    <span className="text-xs font-bold text-emerald-500 uppercase mb-1">{item.kategori}</span>
                    <h3 className="text-xl font-bold text-slate-900">{item.baslik}</h3>
                    <p className="text-slate-500 text-sm mt-1">{item.ozet}</p>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                    <button onClick={() => setSecilenMakale(item)} className="text-emerald-500 font-bold text-sm bg-transparent border-none cursor-pointer">
                      Lees Meer →
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                        <span>💬</span> <span>{item.yorumlar.length}</span>
                      </span>

                      <button
                        onClick={(e) => handleBegeni(item.id, e)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 transition cursor-pointer"
                      >
                        <span>❤️</span><span>{item.begeni}</span>
                      </button>

                      {rol === 'admin' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); makaleSil(item.id); }}
                          className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition cursor-pointer"
                        >
                          Wis
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative">
            <button onClick={(e) => toggleFavori(secilenMakale.id, e)} className="absolute top-8 right-8 bg-transparent border-none cursor-pointer text-xs font-bold text-slate-400 hover:text-emerald-500 transition">{favoriler.includes(secilenMakale.id) ? '📑 In Bladwijzers' : '🔖 Voeg toe'}</button>
            <div className="flex justify-between items-center mb-6 pt-4">
              <button onClick={() => setSecilenMakale(null)} className="text-sm font-bold text-emerald-500 bg-transparent border-none cursor-pointer">← Terug</button>
              <div className="flex items-center gap-3">
                <button onClick={(e) => handleBegeni(secilenMakale.id, e)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"><span>❤️ Like</span><span>{secilenMakale.begeni}</span></button>
                {rol === 'admin' && <button onClick={() => makaleSil(secilenMakale.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">Verwijderen</button>}
              </div>
            </div>
            <h2 className="text-3xl font-black mb-4 text-slate-900">{secilenMakale.baslik}</h2>
            <p className="text-slate-600 text-lg leading-relaxed pb-8 border-b border-slate-100">{secilenMakale.detay}</p>
            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Reacties ({secilenMakale.yorumlar.length})</h3>
              <div className="space-y-4 mb-6">
                {secilenMakale.yorumlar.map((yor, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
                    <span className="font-bold text-emerald-600 block mb-1">👤 {yor.isim}</span>
                    <p className="text-slate-600">{yor.metin}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleYorumEkle} className="flex gap-2">
                <input type="text" placeholder="Schrijf een reactie..." value={yeniYorum} onChange={(e) => setYeniYorum(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500" required />
                <button type="submit" className="bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-600 transition">Verstuur</button>
              </form>
            </div>
          </div>
        )}
      </main>

      {aktifModal !== null && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative font-sans text-slate-700 border border-slate-100">
            <button onClick={() => { setAktifModal(null); formuTemizle(); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-base bg-transparent border-none cursor-pointer">✕</button>
            <div className="text-center pt-10 pb-4">
              <h2 className="text-2xl font-black text-slate-800 tracking-wide uppercase">
                {aktifModal === 'admin' && 'Admin Login'}
                {aktifModal === 'kullanici' && 'Inloggen'}
                {aktifModal === 'kullanici_kayit' && 'Registreren'}
                {aktifModal === 'admin_kayit' && 'Admin Registratie'}
              </h2>
            </div>
            {(aktifModal === 'kullanici' || aktifModal === 'admin') && (
                <form onSubmit={handleGirisSubmit} className="px-10 pb-8 space-y-6">
                  {girisHata && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-lg text-center">
                      ⚠️ {girisHata}
                    </div>
                  )}
                  <input type="email" placeholder="E-mailadres" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:outline-none focus:border-emerald-500 transition" required />
                  ...
                <input type="email" placeholder="E-mailadres" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:outline-none focus:border-emerald-500 transition" required />
                <input type="password" placeholder="Wachtwoord" value={formSifre} onChange={(e) => setFormSifre(e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:outline-none focus:border-emerald-500 transition" required />
                <button type="submit" className="w-full py-2.5 rounded-full font-bold text-white text-xs tracking-wider transition cursor-pointer bg-gradient-to-r from-emerald-400 to-teal-600 shadow-md uppercase">Inloggen</button>
                <div className="text-center pt-2 space-y-2">
                  {aktifModal === 'kullanici' ? (
                    <button type="button" onClick={() => { setAktifModal('kullanici_kayit'); formuTemizle(); }} className="text-xs text-emerald-600 font-bold hover:underline bg-transparent border-none cursor-pointer">Nieuw account aanmaken 🚀</button>
                  ) : (
                    <button type="button" onClick={() => { setAktifModal('admin_kayit'); formuTemizle(); }} className="text-xs text-red-600 font-bold hover:underline bg-transparent border-none cursor-pointer">Registreer als Admin 🔴</button>
                  )}
                </div>
              </form>
            )}
            {(aktifModal === 'kullanici_kayit' || aktifModal === 'admin_kayit') && (
              <form onSubmit={handleKayitSubmit} className="px-10 pb-8 space-y-6">
                <input type="text" placeholder="Gebruikersnaam" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:outline-none focus:border-emerald-500 transition" required />
                <input type="email" placeholder="E-mailadres" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:outline-none focus:border-emerald-500 transition" required />
                <input type="password" placeholder="Wachtwoord" value={formSifre} onChange={(e) => setFormSifre(e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:outline-none focus:border-emerald-500 transition" required />
                <button type="submit" className="w-full py-2.5 rounded-full font-bold text-white text-xs tracking-wider transition cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md uppercase">Registreren</button>
                <div className="text-center pt-2">
                  <button type="button" onClick={() => { setAktifModal(aktifModal === 'admin_kayit' ? 'admin' : 'kullanici'); formuTemizle(); }} className="text-xs text-slate-500 hover:underline bg-transparent border-none cursor-pointer">Heeft u al een account? Log hier in</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 bg-white py-8 shadow-inner mt-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            <p className="text-slate-500 font-bold">📞 Contact: +90 (555) 123 45 67</p>
            <p>©️ 2026 Wereld & Leven Portaal. Alle rechten voorbehouden.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 hover:bg-slate-100 transition shadow-sm">
            <span className="text-xs font-bold text-slate-600 select-none">Admin Login</span>
            <button onClick={() => setAktifModal('admin')} className="bg-transparent border-none cursor-pointer group flex items-center justify-center p-0" title="Admin Inloggen">
              <svg viewBox="0 0 24 24" fill="#10b981" className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300">
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}