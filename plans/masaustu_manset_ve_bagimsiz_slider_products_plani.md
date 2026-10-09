# Masaüstü Manşet ve Bağımsız Slider Products Geliştirme Planı

Tarih: 7 Ekim 2026
Durum: `manset_gelistirmesi` branch’inde uygulandı. Önizleme HTML’i ve yeni Liquid bölümlerinden oluşturulan tarayıcı örneğiyle kontroller yapıldı. Shopify temasına yükleme ve tema editöründeki son kabul bekleniyor.

## Amaç ve kabul edilen kapsam

Masaüstü ana sayfadaki ana manşeti daha alçak hâle getirmek, sağındaki ürün alanının yerine ikinci bir manşet görseli koymak ve mevcut Slider products alanını bağımsız, tema editöründen sırası değiştirilebilir bir bölüme taşımak.

- İlk etapta bağımsız Slider products bölümünün masaüstündeki mevcut dar sütun ve üç dikey ürün düzeni korunacak. Tam genişlikte yatay düzene geçilmeyecek.
- Mobilde ürün bölümünün ana Slider bölümünden ayrılması dışında mevcut tasarım korunacak. Yeni ürün bölümü başlangıçta manşetin hemen arkasına yerleştirilecek.
- İkinci manşet mobilde gösterilmeyecek ve görsel dosyası mobilde indirilmeyecek. Yalnızca CSS ile gizlemek bu şartı karşılamaz.
- Ana manşetin çoklu görsel, loop, otomatik geçiş, süre, hız, ok, nokta ve hedef bağlantı işlevleri korunacak.
- Sağdaki ikinci manşet ilk etapta tek görsel ve hedef bağlantı olarak yönetilecek.
- Geliştirme adımları sırayla uygulanacak. Bu dokümanın oluşturulması uygulama veya yayınlama onayı değildir.

## Mevcut yapı ve sorun analizi

`sections/slider.liquid`, ana manşet ile Slider products alanını aynı bölümde oluşturuyor. Ana manşet ve ürün listesi iki ayrı Swiper örneği kullanıyor.

Masaüstünde ana manşet yaklaşık yüzde 75, ürün alanı yüzde 25 genişlikte. Ürün alanı manşetin yüksekliğine bağlı; üç kart bu yüksekliği paylaşıyor. Mevcut kart yüksekliği bağımsız bir sabit olmadığı için yeni manşeti ürün yüksekliğine, ürünleri tekrar manşete bağlayan bir hesap kurulmayacak. Önce mevcut görünüm ölçülüp yeni düzenin referans ölçüleri belirlenecek.

Mobilde ürünler yatayda 1,5 kart ve 12 px aralıkla gösteriliyor. Bu bölüm için daha önce uygulanan başlangıç boyutlandırması, fontlar, kampanya metni, kompakt iç boşluklar ve gizli yön okları korunacak.

`#home-slider` ve `#slider-pro` kimlikleri mevcut bölümde sabit. Bağımsız ve tekrar eklenebilir bölümde kimlikler ile kontrol hedefleri bölüm kimliğine göre oluşturulmalı. Mevcut `DOMContentLoaded` başlatması da tema editöründe bölümün yeniden yüklenmesini kapsayacak şekilde ele alınmalı.

Yerel `templates/index.json`, canlı tema editöründeki son düzen ve görsellerden farklı olabilir. Taşıma öncesinde uygulamanın yapılacağı temanın güncel bölüm ayarları ve sırası esas alınmalı.

## 1. Masaüstü ölçülerini kesinleştirme

- [ ] Shopify önizlemesinde mevcut manşetin, yan ürün kartlarının ve satır aralıklarının ölçülerini al.
- [ ] Kullanıcının “mevcut 1,5 ürün kartı yüksekliği” hedefini referans masaüstü ekranında hesapla. Kart yüksekliğinin 1,5 katını ve bu yüksekliğe karşılık gelen aralığı birlikte değerlendir.
- [ ] Ana manşetin sol başlangıcını mevcut içerik hizasında tut; sağ bitişini header'daki Instagram ikonunun başlangıcına göre belirle.
- [ ] İki manşet arasında başlangıçta 20 px boşluk değerlendir.
- [ ] Sağdaki manşeti mevcut Slider products alanının sağ bitişine kadar uzat.
- [ ] İki manşetin yüksekliğini ortak bir düzen kuralıyla eşitle; farklı görsel dosya oranlarının alanı uzatmasına izin verme.
- [ ] Dar masaüstü ve tablet geçişlerini belirle; mevcut mobil sınırını ve mobil görünümü koru.

Instagram ikonunun konumu ekran genişliği, header metinleri ve fonta göre değişebilir. İlk hizalama referans ekranda kesinleştirilecek, diğer genişliklerde CSS ile tutarlı sütun dağılımı sağlanacak. İkonun koordinatını sürekli ölçen JavaScript eklenmeyecek. Her genişlikte birebir hizalama için header düzenini değiştirmek gerekirse bu ayrı kapsam olarak kullanıcıya sunulacak.

### Görsel hazırlığı için geçici ölçüler

| Alan | Başlangıç dosya ölçüsü | Oran |
|---|---:|---:|
| Ana manşet | 1680 × 480 px | 3,5:1 |
| Sağ manşet | 720 × 480 px | 1,5:1 |

Bu ölçüler yaklaşık yüzde 70 / yüzde 30 sütun dağılımına göre öneridir. Önizleme ölçümüyle kesinleştirilmeden nihai görsel üretim ölçüsü sayılmayacak. Görseller gerilmeden veya kritik içerikleri kırpılmadan hazırlanacak. Aynı dosya yüksekliği tek başına aynı gösterim yüksekliği anlamına gelmez.

Tamamlanma ölçütü: Referans ekran için iki manşetin gösterim yüksekliği, genişlikleri, aralığı ve nihai görsel oranları belirlenmiş olur.

## 2. Slider products alanını bağımsız bölüme çıkarma

- [ ] `sections/slider-products.liquid` adlı yeni, tema editöründen eklenebilir bölüm oluştur.
- [ ] Mevcut ürün kartı için `snippets/product-list-item.liquid` kullanımını koru.
- [ ] Koleksiyon seçimi ve ürün limiti ayarlarını eski Slider bölümünden yeni bölüme taşı.
- [ ] Mevcut ürün bağlantıları, fiyatlar, kampanya hesapları ve ölçüm bilgilerini koru.
- [ ] Masaüstünde mevcut sütun genişliği ve üç dikey ürün düzenini koru; bölüm tek başına sayfada mevcut içerik sol hizasına yerleşsin.
- [ ] Eski manşete bağlı `height: 100%` zincirini kaldır. Dikey ürün slider'ına önceki ölçülere uygun bağımsız bir yükseklik düzeni ver; metin taşması veya kesilmesi oluşturmadan farklı ürünlerle değerlendir.
- [ ] Mobilde 1,5 kart, 12 px aralık, mevcut fontlar ve kompakt kart görünümünü aynen aktar.
- [ ] Bölüme özel kimlikler ve ok hedefleri kullan; bölüm tekrar eklenirse slider'lar birbirini kontrol etmesin.
- [ ] Slider başlamadan önceki kart boyutlandırmasını koru; büyük kart veya sıfır yükseklikten kaynaklanan ilk yükleme kayması oluşmasın.
- [ ] Masaüstü ve mobil bölüm boşluklarını ayrı ayarlanabilir yap; başlangıç değerleri mevcut görsel mesafeleri korusun.
- [ ] Güncel ana sayfa ayarlarından seçili koleksiyon ve ürün limitini kaybetmeden yeni bölüme aktar.
- [ ] Yeni bölümü başlangıçta Slider'ın hemen arkasına yerleştir; tema editöründen sayfadaki sırasının değiştirilebildiğini doğrula.

Tamamlanma ölçütü: Ürün alanı Slider ayarlarından ayrılır, tek kez gösterilir ve bağımsız bölüm olarak taşınabilir. Masaüstü dikey, mobil yatay düzen korunur.

## 3. Masaüstünde ikinci manşeti ekleme ve ana manşeti boyutlandırma

- [ ] Ürün alanını ana Slider bölümünün HTML, CSS, JavaScript ve ayar şemasından çıkar.
- [ ] Masaüstü ana manşete 1. adımda belirlenen ölçü ve oranları uygula.
- [ ] Sağ manşet için görsel, hedef bağlantı ve erişilebilir açıklama ayarları ekle.
- [ ] İkinci görsel yüklenmediğinde oluşacak düzeni açıkça belirle; büyük boş alan bırakma ve mobil görünümü etkileme.
- [ ] Ana slider'ın mevcut çoklu slide bloklarını ve kontrol ayarlarını koru; yeni bir slider kütüphanesi veya ikinci görsel için gereksiz slider örneği ekleme.
- [ ] Mevcut `grid_full` ayarının yeni iki manşet düzeniyle ilişkisini açıkça çöz; eski ayar nedeniyle sağ görselin fark edilmeden gizlenmesini önle.
- [ ] Mobil marka pilleri, mobil manşet görseli, oranı ve kontrol davranışını koru.

Tamamlanma ölçütü: Masaüstünde iki manşet eşit yükseklikte görünür; sol alanın mevcut slider işlevleri çalışır. Mobil manşet mevcut görünümünü korur.

## 4. Görsel yüklemesi ve performans

- [ ] İkinci manşeti mobilde yalnızca `display: none` ile gizleme. Masaüstü için koşullu `picture/source` kullanımı ve mobilde ağ isteği oluşturmayan fallback ile gerçek görselin mobil tarayıcı tarafından istenmesini önle.
- [ ] Masaüstü görsel URL'sini mobilde indirilebilecek bir `img src`, ek preload veya ikinci yükleme mekanizmasına koyma.
- [ ] Mobil ağ kaydında ikinci manşetin dosyasına istek olmadığını doğrula; CSS'in görseli gizlemesi tek başına yeterli kabul edilmesin.
- [ ] İkinci manşeti WebP/AVIF ve gerçek gösterim genişliğine uygun `srcset/sizes` ile sun.
- [ ] Ana manşetin görsel seçimini gerçek sütun genişliğine göre değerlendir; mobilde mevcut davranışı koru.
- [ ] Görsel ve ürün alanlarının ölçülerini içerik çizilmeden önce belirle. Stilleri HTML'den önce uygula; yükleme sırasında sıçrama oluşmasın.
- [ ] Mevcut Swiper dosyalarını kullan; yeni bağımlılık veya tekrarlı kütüphane yüklemesi ekleme.
- [ ] Ürünleri tek kez Liquid ile oluştur; taşımak için ekstra AJAX isteği veya kopya ürün slider'ı oluşturma.
- [ ] Tema editöründe bölüm yükleme/kaldırma olaylarında Swiper başlatma ve temizlemeyi yönet; gereksiz tekrar başlatma veya sürekli ölçüm döngüsü ekleme.

Mobilde ikinci banner görseli indirilmediği için bu görselin ağ yükü eklenmeyecek. Masaüstünde ikinci görselin dosya yükü kaçınılmazdır. Toplam sayfa hızının hiç değişmeyeceği ölçüm yapılmadan garanti edilmeyecek; başlangıç görünümü, ağ istekleri ve yerleşim kayması önizlemede karşılaştırılacak.

## 5. Önizleme kontrolü ve kabul

- [ ] Shopify preview URL'sinde kontrol yap; kullanıcı açıkça istemedikçe canlı sitede test çalıştırma.
- [ ] Referans masaüstü yanında 1200, 1440 ve 1920 px genişliklerde iki manşetin hizasını ve yüksekliğini değerlendir.
- [ ] 768–1199 px geçişlerinde taşma veya yanlış bölüm sırası olmadığını kontrol et.
- [ ] Mobilde 360, 393 ve 412 px genişliklerde marka pilleri, manşet, ürün kartları ve sonraki bölüm boşluklarını önceki görünümle karşılaştır.
- [ ] İkinci banner dosyasının mobilde indirilmediğini ağ kaydından doğrula.
- [ ] Çoklu manşet, loop, otomatik geçiş açık/kapalı, ok, nokta ve bağlantıları kontrol et.
- [ ] Bağımsız ürün bölümünü tema editöründen taşı, kaldır ve tekrar ekle; slider başlatma, koleksiyon seçimi ve ürün limiti çalışsın.
- [ ] Kısa/uzun başlıklı, kampanyalı/kampanyasız ve üstü çizili fiyatlı ürünlerle kartları kontrol et.
- [ ] İlk yüklemede büyük görsel/kart parlaması veya alttaki bölümlerin yukarı çıkıp geri inmesi olmadığını kontrol et.
- [ ] Dokunulan dosyaları ve doğrulama sınırlarını uygulama sonunda belirt.

## Beklenen dosyalar

- `sections/slider.liquid`: İki manşet düzeni; ürün alanının çıkarılması; görsel yükleme, bölüm ayarları ve slider başlatma kapsamı.
- `sections/slider-products.liquid`: Yeni bağımsız ürün bölümü, ayarlar, mevcut kart görünümü ve bölüm yaşam döngüsü.
- `templates/index.json`: Güncel ayarlar esas alınarak yeni bölümün eklenmesi ve başlangıç sırasının korunması.
- Gerekirse bölüm kodunu sade tutmak için bölüme özel küçük CSS/JS dosyaları. Ortak header ve ürün kartı stilleri sırf bu geliştirme için geniş kapsamda değiştirilmeyecek.

## Riskler ve önlemler

- **Eski ayarların kaybolması:** Güncel tema ayarları okunacak; koleksiyon ve limit yeni bölüme aktarılmadan eski ayarlar kaldırılmayacak.
- **Mobilde görsel yükü veya görünüm değişmesi:** Yeni sağ banner mobil kaynak seçiminden çıkarılacak; ürün bölümünün sırası ve boşlukları karşılaştırılacak.
- **Ürün yüksekliğinin manşete bağlı kalması:** Ürün alanına bağımsız düzen verilecek; farklı içeriklerde kesilme kontrol edilecek.
- **Instagram hizasının ekranlar arasında sapması:** Referans ölçü ve responsive sütunlar kullanılacak; header değişikliği gerekirse ayrıca değerlendirilecek.
- **İlk yükleme sıçraması ve slider çakışması:** Önceden boyutlandırma, bölüm kimliğine özel hedefler ve tema editörü temizleme akışı uygulanacak.
- **Başka kart listelerinin etkilenmesi:** Stil ve başlatma kapsamı ilgili bölümlere sınırlandırılacak; mevcut kart snippet'i kullanılacak.


## Uygulama kaydı — 7 Ekim 2026

- `manset_gelistirmesi` branch’i temiz `main` çalışma ağacından oluşturuldu.
- Ana manşette çoklu slide, loop, otomatik geçiş, ok ve nokta ayarları korundu. Sağ manşet için görsel, bağlantı ve açıklama alanları eklendi.
- Önizlemenin 1440 px görünümünde mevcut kart yaklaşık 161 px, eski manşet yaklaşık 506 px ölçüldü. Yeni ana manşet 880 × 251 px, sağ alan 390 × 251 px olarak oluşturuldu. Sol manşet bitişi Instagram ikonunun başlangıcıyla yaklaşık 1 px içinde hizalandı.
- 1920 px ekranda ana manşet 960 × 274 px olur. 1200–1399 px aralığında header'ın daha küçük aksiyon grubuna uyum için sağ alan 40 px daralır. Bunlar header'a müdahale etmeden uygulanan başlangıç değerleridir.
- Ana manşet oranı varsayılan 3,5:1, sağ alan genişliği 390 px, aralık 20 px. Tema editöründen ayarlanabilir. Ana görsel için 1680 × 480 px, 1440 px referans ekranın sağ alanı için yaklaşık 744 × 480 px önerilir; sağ alanın oranı ekran genişliğine göre değişir ve görsel kırpılmadan sığdırılır.
- İkinci görsel seçilmezse sağda boş kolon oluşturulmaz; ana manşet mevcut içerik genişliğini kullanır. Yeni görsel dosyası eklenmedi.
- Bağımsız Slider products bölümünde üç dikey ürün ve eski sütun genişliği korundu. Kart yüksekliği içeriğe göre bir kez ve responsive yeniden boyutlandırmada ölçülür; sürekli ölçüm döngüsü kullanılmaz.
- Mobilde mevcut ürün kartı tipografisi, boyutları, 1,5 kart görünümü ve manşet sonrası 10 px aralık korundu.
- İkinci görsel yalnızca 1200 px ve üzerindeki `picture/source` tarafından seçilir. Mobil fallback satır içi veri görselidir; mobilde dış banner dosyası istenmez.
- Bölümlerin başlatma ve temizleme işlemleri `assets/pg-home-carousel.js` ile yönetilir. Bu küçük dosya yalnızca ana sayfada, mevcut Swiper'ın ardından ertelenerek yüklenir. Yeni kütüphane eklenmedi.
- Yerel `templates/index.json` içindeki koleksiyon/limit yeni ürün bölümüne aktarıldı; bölüm Slider'ın hemen arkasına eklendi.

### Kontrol kapsamı

Kontroller kullanıcının verdiği Shopify önizleme adresinin HTML’i ve gerçek ürün kartlarıyla, yeni Liquid bölüm kodunun yerel olarak render edildiği bir tarayıcı örneğinde yapıldı. Temaya dosya yüklenmedi; bunlar Shopify sunucusunda yeni kodun çalıştığının doğrulaması değildir.

- 360, 393, 412, 768, 1200, 1440 ve 1920 px: taşma, slider başlatma, sütun sayısı ve banner yüksekliği kontrolleri.
- 360, 393 ve 412 px: önceki mobil hero/kart konum ve boyutları ile başlık/fiyat/kampanya fontları karşılaştırıldı; 1 px tolerans içinde aynı.
- Mobilde ikinci banner dosyasına ağ isteği yok; masaüstünde dosya isteniyor.
- JavaScript kapalı başlangıç düzeni ile başlatılmış slider'ın ürün alanı yükseklikleri 360 ve 1440 px’de karşılaştırıldı; kayma oluşturacak fark yok.
- Bölüm kaldırılıp yeniden eklendiğinde slider temizlenip tekrar başlıyor; iki manşet görseliyle loop ve blok seçimi çalışıyor.
- JavaScript sözdizimi, section schema JSON ve diff boşluk kontrolleri yapıldı.

### Güncel tema ayarlarına taşıma — 8 Ekim 2026

İlk uygulamada eski yerel `templates/index.json` esas alındığı için dosyanın test temasına aktarılması güncel manşet seçimlerini ve bölüm yerleşimini eskiye döndürdü. Kullanıcı doğru yerleşime sahip temadan güncel `templates/index.json` dosyasını projeye kopyaladı; taşıma bu dosya üzerinden yeniden uygulandı.

- Güncel masaüstü/mobil manşet görselleri, hedef bağlantısı, slide blokları, mobil marka pilleri ve slider geçiş ayarları korundu.
- Güven özellikleri, yeni ürünler, koleksiyon vitrini, ürün sekmeleri ve SSS bölümlerinin bütün ayarları ve kendi aralarındaki sırası korundu.
- Eski Slider içindeki `one-cikanlar` koleksiyonu ve 3 ürün limiti yeni bağımsız Slider products bölümüne aktarıldı. Yeni bölüm manşetin hemen arkasına eklendi; mobil üst/alt boşluk 10/0 px, masaüstü üst/alt boşluk 24/0 px.
- Slider'a yalnızca yeni masaüstü düzeni için 390 px sağ alan genişliği, 3,5:1 ana manşet oranı ve 20 px aralık eklendi. Artık kullanılmayan `grid_full` ayarı çıkarıldı.
- İkinci manşet görseli ve bağlantısı atanmadı; kullanıcı tema editöründen seçecek. Görsel seçilene kadar ana manşet tam genişliği kullanır.
- `config/settings_data.json` geliştirmede değiştirilmedi. Kullanıcı bu dosyayı deploy etmediğini belirtti; bu taşıma sırasında dosyaya dokunulmadı.

Bu güncel index dosyası geliştirme kodlarıyla birlikte test temasına aktarılabilir. Aktarım öncesinde tema editöründe yeni değişiklik yapılırsa tekrar güncel dosya alınarak birleştirilmeli. Yeni Slider products bölümü dosyada zaten bulunduğundan tema editöründen ikinci bir ürün bölümü eklenmemeli.

Shopify tema editöründe gerçek bölüm taşıma/kaydetme, görsel seçimi, başlatma ve mobil ağ kontrolleri aktarım sonrasında tekrar doğrulanmalı.

### Slider products tek sıra düzeni — 8 Ekim 2026

Kullanıcı ilk etapta korunan masaüstü dikey sütunun yerine, mevcut yatay ürün kartlarının yan yana dizilmesini onayladı. Kartın içindeki bilgi, font, boyut, renk ve iç boşluklar değiştirilmedi.

- Bağımsız bölüm içerik genişliğini kullanır. 1199–1399 px ekranlarda 3, 1400 px ve üzerindeki ekranlarda 4 kart aynı sırada görünür. Tablet 2, mobil 1,5 kart düzeni korunur.
- Koleksiyondan oluşturulan toplam ürün sayısı mevcut ürün limiti ayarına bağlı kalır (1–24); görünür kart sayısıyla sınırlandırılmaz. Dosyadaki mevcut limit 3 olduğundan daha fazla ürün göstermek için test temasında Slider products > Ürün limiti artırılmalı.
- Başlangıç CSS genişlikleri Swiper'ın aralık ve sütunlarıyla eşleşir; başlatma öncesinde kartlar tek sıradadır.
- Üç satırlı Swiper grid'i ve eski yüksekliği JavaScript ile ölçme işlemi kaldırıldı. Eşit kart yüksekliği flex düzeniyle içerikten belirlenir; minimum yükseklik ayarı korunur.
- Bu adımda `templates/index.json` ve `config/settings_data.json` değiştirilmedi. Tema editöründe seçilen yeni ikinci manşet görselini korumak için bu düzenleme aktarımında JSON dosyaları yeniden gönderilmemeli.
- Değişen dosyalar: `sections/slider-products.liquid`, `assets/pg-home-carousel.js`, bu plan belgesi. Bu adımda tarayıcı testi çalıştırılmadı.

### Slider products liste başlığı — 8 Ekim 2026

- Bölüm ayarlarına kullanıcı tarafından düzenlenebilen “Liste başlığı” metin alanı eklendi. Varsayılan metin atanmadı; boş bırakıldığında başlık ve ona ait boşluk oluşturulmaz.
- Başlık kartların sol kenarıyla hizalı, masaüstünde 13 px ve mobilde 11,5 px, 600 ağırlığında ve temanın ana renginde gösterilir. Altında 8 px boşluk bulunur.
- Başlık ürün slider'ının ve okların konumlandırma alanının dışında oluşturulur; kart içerikleri ve kaydırma ayarları korunur. Metin HTML olarak yorumlanmadan escape edilerek gösterilir.
- Bu adımda değişen dosyalar: `sections/slider-products.liquid` ve bu plan belgesi. JSON ayar dosyaları değiştirilmedi; başlık tema editöründen girilecek. Tarayıcı testi çalıştırılmadı.

### Ürün listesi başlıklarını eşleştirme — 8 Ekim 2026

- Slider products başlığı sonraki kullanıcı onayıyla yalnızca masaüstünde (1199 px ve üzeri) 15 px, 17 px satır yüksekliğine çıkarıldı. Mobil 11,5 px ve tablet 13 px korundu.
- New product bölümünün mevcut `section_title` ayarı aynı biçimde gösterilecek şekilde düzenlendi: masaüstü 15 px / 17 px satır yüksekliği, tablet 13 px, mobil 11,5 px; 600 ağırlık, temanın ana rengi, sola hizalama ve kartların üstünde 8 px aralık.
- New product başlığında genel `.section-title` sarmalayıcısı yerine bölüme özel başlık kullanılır; boş ayarda başlık ve boşluk oluşturulmaz. Ürün kartları, slider işlevleri ve bölümün padding ayarları değiştirilmedi.
- Bu adımda değişen dosyalar: `sections/new-product.liquid` ve bu plan belgesi. JSON ayar dosyaları değiştirilmedi. Tarayıcı testi çalıştırılmadı.

### New product masaüstü grid — 8 Ekim 2026

- Kullanıcı masaüstünde carousel yerine tüm seçili ürünlerin alt alta sıralara yerleşmesini onayladı. 1400 px ve üzeri ekranlarda 5, 1199–1399 px aralığında 4 sütun; yatay ve dikey aralık 12 px. Ürün limiti tema ayarından gelmeye devam eder; 10 ürün geniş masaüstünde iki sırada görünür.
- Grid stilleri bölüm HTML'inden önce uygulanır. Masaüstünde Owl başlatılmaz; mobil ve tablette mevcut carousel ve kaydırma ayarları korunur. Ekran masaüstü sınırını geçince mevcut Owl örneği temizlenir veya tekrar başlatılır. Bölüm kaldırıldığında ilgili dinleyiciler temizlenir.
- Yalnızca masaüstü ürün adı 14 px'den 13 px'e indirildi. İki satır sınırı, fiyat boyutu/rengi, görsel oranı, kart iç boşlukları, bölüm başlığı ve mobil tipografi korundu.
- Kartlara sabit bir toplam yükseklik eklenmedi; grid satırları içerik üzerinden eşitlenir. Görsel yüksekliği daralan kart genişliğine göre azalır. Güncel/eski fiyat ve kampanyadaki tutar/birim ifadeleri masaüstünde bölünmeden gösterilir; eski fiyat gerektiğinde ayrı satıra geçebilir.
- Masaüstünde ikinci ürün sırası bulunduğundan bölümün toplam yüksekliği artar. Sonraki bölümlerin aşağıya gelmesi bu düzenin beklenen sonucudur.
- Bu adımda değişen dosyalar: `sections/new-product.liquid` ve bu plan belgesi. Ortak ürün kartı ve JSON ayar dosyaları değiştirilmedi. Shopify'a deploy yapılmadı; tarayıcı testi çalıştırılmadı.

### Masaüstü ana manşet okları — 8 Ekim 2026

- Önizlemede 1200, 1280, 1440 ve 1920 px genişlikler incelendi. Özellikle dar masaüstünde kenardan 30 px içeride duran sağ ok ana başlığın sonuna biniyordu.
- Kullanıcı yalnızca okların düzeltilmesini onayladı. 1200 px ve üzerindeki ana manşet okları kenardan 8 px içeri alındı; mevcut 30 × 30 px boyut ve ikonlar korundu.
- Bu bölümün masaüstü oklarına altın `#B8925E` ikon ve 1 px çerçeve, açık beyaz zemin eklendi. Hover durumunda altın zemin ve beyaz ikon kullanılır. Genel tema renkleri, mobil/tablet, ikinci manşet ve iki manşet aralığı değiştirilmedi.
- Değişen dosyalar: `sections/slider.liquid` ve bu plan belgesi. JSON ayar dosyaları değiştirilmedi. Yeni kodla tarayıcı testi çalıştırılmadı.
