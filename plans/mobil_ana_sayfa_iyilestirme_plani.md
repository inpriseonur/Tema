# Mobil Ana Sayfa İyileştirme Planı

Tarih: 6 Ekim 2026
Durum: 1. madde kullanıcı tarafından görsel olarak kabul edildi. 2. madde uygulandı. Kullanıcının isteğiyle 3. madde kodlandı; mobil header önizleme değerlendirmesi bekleniyor.

## Amaç

Prime Gurme'nin mobil ana sayfasında katalog erişimini kolaylaştırmak, manşet ve tanıtım alanlarının yüksekliğini azaltmak, ürünleri ve fiyatlarını daha erken göstermek. Referanslar: kullanıcının Trendyol/Hepsiburada uygulama görüntüleri ve `mobil_görünümler` klasöründeki Prime Gurme ana sayfa görüntüleri.

## Çalışma kuralları

- Maddeler sırayla, ayrı geliştirmeler olarak uygulanacak. Bu plan tüm maddelerin tek seferde uygulanması için onay değildir.
- Her aşamada kapsam ve ilgili dosyalar incelenecek; kullanıcı o aşamayı istediğinde uygulanacak. Sonraki maddeye kendiliğinden geçilmeyecek.
- Yalnızca mobil ana sayfa hedefleniyor. Masaüstü görünümü değiştirilmeyecek. Ortak header, kart veya stil değişikliği başka sayfaları etkileyecekse kapsam önceden kullanıcıya açıklanacak ve onay alınacak.
- Ürün detayı, sepet, drawer ve satın alma işlevleri korunacak.
- Metinler, bağlantılar ve ürün seçimleri mümkün olduğunda mevcut tema ayarlarından yönetilecek. Koleksiyon adresleri tahmin edilmeyecek.
- Mevcut Liquid/CSS/JS yapısı korunacak; yeni kütüphane veya uygulama eklenmeyecek.
- Boyutlar başlangıç tasarım önerileridir; telefondaki görünümle netleştirilecek. Ekran görüntüsü pikseli ile CSS pikseli aynı kabul edilmeyecek.
- Her aşamanın sonunda değişen dosyalar ve yapılan/yapılmayan kontroller belirtilecek.
- Test istenirse Shopify preview kullanılacak; açık talep olmadan canlı sitede test çalıştırılmayacak.

## 1. Mobil manşet oranı ve içeriği

Son karar: Kullanıcı 900×300 (3:1) mobil görseli yükledi ve görünümü kabul etti. Manşetin bu hali korunacak. Otomatik geçiş mevcut tema ayarından yönetiliyor; davranış değişikliği yapılmayacak. Aşağıdaki maddeler ilk tasarım önerilerinin kaydıdır.

- [ ] Mevcut slider section'ı, mobil/masaüstü görsel ayarları ve görsel yükleme davranışı incelensin.
- [ ] Mobil için yaklaşık **2,5:1** genişlik/yükseklik oranı başlangıç olarak değerlendirilsin. Örnek: 360 px genişlikte yaklaşık 144 px yükseklik.
- [ ] Kare görsel sıkıştırılmasın veya önemli metinleri kesilecek şekilde kırpılmasın; yatay mobil kompozisyon hazırlansın. Görsel üretimi ayrı kapsam olarak netleştirilsin.
- [ ] İçerik kısa kampanya başlığı, net ürün/paket bilgisi, gerekli eşikler ve belirgin bir inceleme aksiyonundan oluşsun.
- [ ] Manşette yinelenen uzun kargo/açıklama metinleri sadeleştirilsin. Gerçek kampanya koşulları korunarak içerik kullanıcıyla netleştirilsin.
- [ ] Farklı slaytlar aynı yükseklikte olsun; tıklama hedefi kampanyayla uyumlu olsun.
- [ ] Mobil otomatik geçişin kapatılması, kullanıcı kaydırmasının korunması bu aşamada kullanıcıyla netleştirilsin.

Tamamlanma ölçütü: Daha kısa, yazıları okunabilir, ürün görseli bozulmayan bir mobil manşet. Masaüstü görseli ve düzeni aynı kalır.

## 2. Header altında katalog ve marka bağlantıları

Uygulama kaydı:

- [x] Mobil ana sayfada manşetin üstüne tek satırlık, yatay kaydırılabilir bağlantı şeridi eklendi.
- [x] Sıra: Tüm ürünler, San Pellegrino, Perrier, San Benedetto, Flavz.
- [x] `Slider → Mobil marka bağlantıları` altında aç/kapat ve beş ad/URL alanı eklendi. Boş URL, alan açıklamasında gösterilen varsayılan hedefi kullanır; boş ad kutucuğu gizler.
- [x] Kullanıcının verdiği hedefler kullanıldı; Tüm ürünler sıralama parametresi korundu. Perrier bilerek ürün sayfasına gider.
- [x] Şerit sayfayla akar. Masaüstünde gizlidir; manşet ve otomatik geçiş kodu değiştirilmedi. Ek JavaScript/kütüphane yoktur.
- [ ] Mobil önizlemede kaydırma, metinler, bağlantılar ve görünüm kullanıcı tarafından değerlendirilecek. Tarayıcı testi çalıştırılmadı; canlı URL hedefleri ayrıca doğrulanmadı.

Değişen uygulama dosyası: `sections/slider.liquid`.

İlk kullanıcı önizlemesi sonrası: Mobil kutucuk yüksekliği 36→32 px, yazı boyutu 12→11 px, yatay iç boşluk 12→10 px ve kutucuk aralığı 8→6 px olarak küçültüldü. Her bağlantıya ayrı Sade / Altın / Lacivert renk seçimi eklendi; varsayılan Sade. Yeni görünümün telefon değerlendirmesi bekleniyor.

İkinci önizleme sonrası: Kutucuklar 28 px minimum yüksekliğe, 10,5 px yazıya ve 8 px yatay iç boşluğa indirildi; harf aralığı sıfırlandı. Altın ve lacivert seçenekleri açık tonlu arka plan, ince çerçeve ve koyu yazı olarak yumuşatıldı. Bu renkler yalnızca mobil marka şeridinde geçerlidir; ortak tema renkleri değiştirilmedi.

- [ ] Tek satır yatay kaydırılabilir, sade metin kutucukları oluşturulsun.
- [ ] Başlangıç sırası değerlendirilsin: **Tüm ürünler · San Pellegrino · Perrier · San Benedetto · Flavz**.
- [] San Pellegrino :  https://primegurme.com/collections/san-pellegrino-soda-cesitleri
     San Benedetto: https://primegurme.com/collections/san-benedetto-italyan-icecekleri
     Flavz: https://primegurme.com/collections/flavz-meyve-sulari
     Tüm ürünler: https://primegurme.com/collections/all?sort_by=best-selling
     Perrier: https://primegurme.com/products/perrier-do-al-mineralli-gazl-su-200-ml-24lu-koli
- [ ] Gerçek koleksiyonlar ve hedef adresler doğrulansın; son bağlantının adı mevcut katalog yapısına göre kesinleştirilsin.
- [ ] Sağda sonraki kutucuğun bir kısmı görünerek kaydırılabilirlik anlaşılsın. Uzun marka isimleri okunabilir kalsın.
- [ ] Şerit ilk aşamada sayfayla aksın; sürekli üstte sabitlenmesin.
- [ ] Tam menü açık gösterilmesin. “Tüm ürünler” katalog erişimini karşıladığı için ayrıca aynı işlevli bir header bağlantısı eklenmesin.
- [ ] “Kampanyalar” ancak güncel ve ilgili bir hedef sayfası varsa ayrıca değerlendirilsin.

Tamamlanma ölçütü: Menü açmadan tüm kataloğa ve önemli markalara ulaşılır; yeni şerit aşırı yükseklik oluşturmaz.

## 3. Mobil ana sayfa header'ını sadeleştirme

- [x] Marka logosu korundu; mobilde logo en fazla 96 px, header üst/alt boşluğu 8 px olarak ayarlandı.
- [x] Menü ve sepet erişimi korundu; son görsel değerlendirmeyle ikonlar 18 px yerleşim alanı korunarak görsel olarak 16 px'e ölçeklendi, sepet sayacı 15 px yapıldı. Header yüksekliği ve mevcut dokunma alanları korundu.
- [x] Kullanıcının son kararıyla bu aşamada arama ikonu eklenmedi.
- [ ] Yeni bağlantı şeridiyle birlikte header'ın toplam yüksekliği değerlendirilsin.
- [x] Kullanıcının ek onayıyla header küçültmesi tüm mobil sayfalara genişletildi. En fazla 767 px medya sorgusu korundu; masaüstü etkilenmez. Sepetin özel logo hizalaması ve sayfalara göre ikon görünürlüğü korunur.

Tamamlanma ölçütü: Logo görünür, temel aksiyonlar erişilebilir ve tüm mobil sayfalarda header kompakt kalır. Masaüstü değişmez.

## 4. Güven/hizmet mesajlarını kompakt şeride dönüştürme

- [x] Kullanıcı kararıyla bölüm mevcut konumunda, Slider bölümünün ürün alanından sonra tutuldu. Manşet ve ürünler aynı bölümde olduğu için aralarına taşıma yapılmadı.
- [x] Mobilde büyük ikon daireleri ve alt açıklamalar kaldırıldı; masaüstü görünümü korundu.
- [x] Küçük ikonlu, yatay kaydırılabilir tek satır uygulandı. Dokunma alanı en az 44 px; mevcut mobil başlık, ikon ve iç boşluk ayarları kullanılır.
- [x] Özelliklere “Mobilde göster” eklendi. “Kapıda ödeme” mesajı istenirse tema editöründen yalnızca mobilde gizlenebilir; mevcut seçimler otomatik değiştirilmedi.
- [x] Mevcut başlık, alt metin, renk tonu, SSS hedefi ve mobil bağlantı etkinleştirme davranışı korundu. İkon listesine “İkon yok” eklendi; artık kullanılmayan mobil ikon dairesi/alt metin boyutu kontrolleri kaldırıldı.
- [ ] Mobil önizlemede okunurluk, kaydırma ve SSS bağlantıları değerlendirilsin.
- [x] İlk mobil önizleme kullanıcı tarafından çalışır olarak doğrulandı. Görsel revizyonda ortak dış çerçeve ve ayırıcı çizgiler kaldırıldı; mesajlar 8 px aralıklı, açık gri zeminli, 10 px köşeli ayrı kartlara dönüştürüldü. Mobil başlık ağırlığı 500 yapıldı; kaydırma ve SSS davranışı korundu.

Tamamlanma ölçütü: Ürünlere ulaşmayı geciktirmeyen kısa, okunabilir hizmet özeti; koşullu hizmetler koşulsuzmuş gibi gösterilmez.

## 5. Öne çıkan üç ürünü dikey kartlarla sunma

2026-10-06 kullanıcı kararı: Mobil ve masaüstü ürün listelerindeki “Çok Al Az Öde” ve indirim yüzdesi rozetleri ortak grid/list kartlarından ve AJAX arama önerilerinden kaldırıldı. Fiyat altındaki kampanya metinleri ve eski/güncel fiyatlar korundu. Mobil Slider ürün kartında rozet için ayrılan üst padding 27 px'ten 8 px'e düşürüldü (19 px kazanç); diğer listelerde rozetler görselin üzerinde olduğundan kart yüksekliği otomatik azalmaz. Ürün detayındaki rozetler bu kapsamda değiştirilmedi.

- [ ] Mevcut geniş yatay ürün kartı yerine görsel üstte, ürün bilgisi altta olan kart düzeni hazırlansın.
- [ ] Aynı anda iki kart gösterilsin; üçüncü ürüne yatay kaydırmayla ulaşılsın. Üçüncü kart tek başına ikinci satıra düşmesin.
- [ ] Kaydırma olduğu kenardaki devam görünümü veya küçük bir göstergeyle anlaşılsın.
- [ ] Bölüm başlığının yanında “Tüm ürünler ›” bağlantısı değerlendirilsin.
- [ ] Kart içeriği: net görsel, kısa ürün adı, ayrı paket/aroma bilgisi, güncel fiyat ve varsa kısa kampanya bilgisi.
- [ ] Paket miktarı başlığın kesilmesi nedeniyle kaybolmasın. Görsel alanları gereksiz uzun olmasın.
- [ ] Fiyat, varyant, kampanya ve ürün bağlantısının mevcut doğru veri kaynakları korunsun.
- [ ] Ortak kart snippet'ı kullanılıyorsa koleksiyon ve diğer sayfa kartları etkilenmesin.

Tamamlanma ölçütü: Kullanıcı aynı anda iki ürünü ve fiyatını karşılaştırabilir; kartlar dar ekranda taşmaz ve ürün/paket bilgisi anlaşılırdır.

## 6. Ana sayfa bölüm sırası ve tekrarların azaltılması

- [ ] Hedef mobil sıra birlikte değerlendirilsin:
  1. Kompakt header
  2. Katalog/marka bağlantıları
  3. Yatay manşet
  4. Kısa hizmet şeridi
  5. İki kartlı öne çıkan ürün alanı
  6. Marka/kategori keşif alanı
  7. Diğer ürünler ve İstanbul teslimat bilgileri
- [ ] San Benedetto gibi marka banner'ları ilk ürün grubundan sonra konumlansın.
- [ ] “Öne çıkan ürünler” ile “En çok tercih edilenler” aynı ürünleri tekrarlıyorsa kullanıcıyla içerikleri ayrıştırma veya tek bölümde birleştirme kararı alınsın.
- [ ] Shopify tema editöründeki section sırasının masaüstünü de etkileyebileceği dikkate alınsın. Masaüstünü değiştirmeden çözüm karmaşıklaşırsa kullanıcıya danışılmadan uygulanmasın.

Tamamlanma ölçütü: Ürünler ve fiyatları tanıtım alanlarından daha erken görünür; gereksiz tekrar azalır.

## 7. İsteğe bağlı: mobil alt menü

- [ ] Yükseltilmiş büyük sepet ikonunun içerik alanına taşması değerlendirilsin.
- [ ] İkonların aynı hizada ve daha sakin görünmesi için ayrı bir öneri hazırlansın.
- [ ] Bu madde diğer aşamalara dahil edilmesin; kullanıcı ayrıca isterse geliştirilsin.
- [ ] Sepet sayacı, bağlantılar ve diğer sayfalardaki alt menü davranışı korunsun.

## Her aşama için değerlendirme notları

- Telefon görünümünde okunurluk, yatay taşma, kaydırma ipuçları ve dokunma alanları değerlendirilsin.
- Sabit alt menünün içeriği kapatmaması ve header'ın gereksiz alan tüketmemesi gözetilsin.
- Görseller için uygun mobil dosya boyutu ve ayrılmış boyutlar korunsun; gereksiz ek istek/kütüphane eklenmesin.
- Görsel onay alınmadan sonraki aşamaya geçilmesin.
- Pazaryeri uygulamalarında tarayıcı adres çubuğu olmadığı unutulmasın; hedef birebir aynı ekran yoğunluğu değil, Prime Gurme'de daha kolay ürün keşfidir.
- Sonuçlar uygun veri oluştuğunda katalog/ürün geçişleri, sepete ekleme ve satın alma üzerinden değerlendirilebilir; yalnızca daha az kaydırma veya uzun etkileşim başarı sayılmaz.

## Güncel aşama

**3. Kompakt mobil ana sayfa header'ının önizleme değerlendirmesi.** Sonraki maddeye kullanıcı isteğiyle geçilecek.
