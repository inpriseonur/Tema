# Masaüstü Manşet ve Bağımsız Slider Products Geliştirme Planı

Tarih: 7 Ekim 2026
Durum: Plan oluşturuldu. Uygulama başlamadı.

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
