import { useState } from 'react';

const ICERIKLER = [
  { id: 1, kategori: 'doga', baslik: 'Yağmur Ormanları', ozet: 'Gezegenimizin akciğerleri hakkında bilmeniz gereken her şey.', detay: 'Yağmur ormanları, dünyadaki oksijen üretiminin büyük bir kısmını üstlenir ve milyonlarca canlı türüne ev sahipliği yapar. Ancak kereste üretimi ve tarım alanı açma faaliyetleri nedeniyle büyük tehdit altındadırlar.' },
  { id: 2, kategori: 'bilim', baslik: 'Yapay Zeka ve Gelecek', ozet: 'Teknolojinin yaşamımızı nasıl şekillendireceğine dair analizler.', detay: 'Yapay zeka modelleri artık sadece veri analizi yapmıyor, aynı zamanda sanat üretiyor, hastalıkları teşhis ediyor ve kod yazıyor. Gelecekte iş gücü piyasasını tamamen değiştireceği öngörülüyor.' },
  { id: 3, kategori: 'uzay', baslik: 'Mars Yolculuğu', ozet: 'İnsanlığın kızıl gezegendeki yeni kolonileşme adımları.', detay: 'Mars, insanlığın dünya dışındaki ilk kalıcı evi olma adayı. Atmosfer yapısı ve su kaynaklarının araştırılması, gelecekte kurulacak kolonilerin temelini oluşturuyor.' },
  { id: 4, kategori: 'doga', baslik: 'Okyanus Derinlikleri', ozet: 'Bilinmeyen canlı türleri ve su altı dünyasının gizemleri.', detay: 'Okyanusların %80inden fazlası henüz insanlar tarafından keşfedilmedi. Mariana Çukuru gibi derin noktalarda, aşırı basınca ve karanlığa uyum sağlamış büyüleyici canlılar yaşıyor.' },
  { id: 5, kategori: 'bilim', baslik: 'Kuantum Fiziği', ozet: 'Gözle görülmeyen evrenin kurallarını değiştiren teoriler.', detay: 'Kuantum dünyası, bizim makro evrende alıştığımız fizik kurallarına meydan okuyor. Süperpozisyon ve kuantum dolanıklık gibi ilkeler, geleceğin süper bilgisayarlarının temelini atıyor.' },
];

export default function App() {
  const [aktifKategori, setAktifKategori] = useState('hepsi');
  const [secilenMakale, setSecilenMakale] = useState(null);

  const filtrelenmişIcerikler = aktifKategori === 'hepsi' 
    ? ICERIKLER 
    : ICERIKLER.filter(item => item.kategori === aktifKategori);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Üst Menü / Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Yeni Tasarım Logo Bölümü */}
          <button 
            onClick={() => { setAktifKategori('hepsi'); setSecilenMakale(null); }} 
            className="flex items-center gap-3 group cursor-pointer border-none bg-transparent text-left"
          >
            {/* Logo İkon Alanı */}
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              🌍
            </div>
            {/* Logo Yazı Alanı */}
            <div>
              <span className="block text-lg font-black text-white tracking-tight group-hover:text-emerald-400 transition duration-300">
                DÜNYA <span className="text-emerald-400 font-light">&</span> YAŞAM
              </span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold -mt-1">
                Keşfet ve Koru
              </span>
            </div>
          </button>

          <nav className="flex gap-6 text-sm text-slate-400">
            <button onClick={() => alert('Keşfet sayfası: Yeni içerikler taranıyor...')} className="hover:text-emerald-400 transition cursor-pointer bg-transparent border-none text-slate-400">Keşfet</button>
            <button onClick={() => alert('Galeri sayfası: Fotoğraflar yükleniyor...')} className="hover:text-emerald-400 transition cursor-pointer bg-transparent border-none text-slate-400">Galeri</button>
            <button onClick={() => alert('Hakkımızda: Bu portal 2026 yılında React öğrenmek için kuruldu!')} className="hover:text-emerald-400 transition cursor-pointer bg-transparent border-none text-slate-400">Hakkımızda</button>
          </nav>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {!secilenMakale ? (
          <>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Portal</span>
              <h2 className="text-4xl font-extrabold mt-4 mb-4 tracking-tight">Gezegenimizi Keşfedin ve Koruyun</h2>
              <p className="text-slate-400 text-lg">Yaşamın büyüleyici dünyasına tanıklık yapın, bilimin ve doğanın kılavuzluğunda geleceğe iz bırakın.</p>
            </div>

            {/* Kategori Butonları */}
            <div className="flex justify-center gap-3 mb-12">
              {['hepsi', 'doga', 'bilim', 'uzay'].map((kat) => (
                <button
                  key={kat}
                  onClick={() => setAktifKategori(kat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 cursor-pointer ${
                    aktifKategori === kat
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {kat === 'hepsi' ? 'Tüm İçerikler' : kat}
                </button>
              ))}
            </div>

            {/* Kartlar */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrelenmişIcerikler.map((item) => (
                <article key={item.id} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 hover:border-emerald-500/30 transition duration-300 flex flex-col justify-between group">
                  <div>
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider bg-slate-800 px-2.5 py-1 rounded-md block w-fit mb-4">
                      {item.kategori}
                    </span>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-300 transition">{item.baslik}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.ozet}</p>
                  </div>
                  <button 
                    onClick={() => setSecilenMakale(item)}
                    className="mt-6 text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform w-fit cursor-pointer bg-transparent border-none"
                  >
                    Devamını Oku →
                  </button>
                </article>
              ))}
            </div>
          </>
        ) : (
          /* Detay Sayfası */
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <button 
              onClick={() => setSecilenMakale(null)} 
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 mb-6 block cursor-pointer bg-transparent border-none"
            >
              ← Listeye Geri Dön
            </button>
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider bg-slate-800 px-3 py-1 rounded-md block w-fit mb-4">
              {secilenMakale.kategori}
            </span>
            <h2 className="text-3xl font-extrabold mb-4">{secilenMakale.baslik}</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">{secilenMakale.detay}</p>
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 text-slate-400 text-sm italic">
              Bu yazı tamamen dinamik bir React bileşeni (State) kullanılarak ekrana yansıtılmıştır.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}