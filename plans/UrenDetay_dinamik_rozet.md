# Ürün Sayfası Dinamik Rozet (Badge) Geliştirme Planı

Bu plan, ürün görsellerinin üzerine (görseli bozmayacak şekilde) dinamik olarak çalışan, Shopify etiketleri (tag) ile tetiklenen rozetlerin (Orijinal Ürün, Hızlı Kargo, Güvenli Paketleme vb.) eklenmesi sürecini açıklamaktadır.

## Hedef
Kullanıcının yazılım bilgisine ihtiyaç duymadan, Shopify Tema Özelleştirme paneli üzerinden rozet görsellerini yükleyebileceği, hangi etiketlerde görüneceğini belirleyebileceği ve ürün resminin üzerinde konumlandırabileceği esnek bir sistem kurmak.

## Önerilen Çözüm ve Mimari

Kod tarafında "Custom Liquid" kullanıp içine karmaşık HTML kodları yazmanızı istemek yerine, temanıza özel bir **"Dinamik Rozet Bloğu (Custom Badge Block)"** ekleyeceğim. Bu yöntem çok daha yönetilebilir ve güvenlidir.

### Nasıl Çalışacak? (Kullanım Senaryosu)

1. **Etiketleme (Admin Paneli):** Shopify panelinden bir ürüne `Orijinal` veya `Hızlı Kargo` gibi bir etiket (tag) eklersiniz.
2. **Tema Ayarları (Customize):** Shopify "Temayı Özelleştir" (Customize) paneline girip Ürün Sayfasına (Default Product) geçersiniz.
3. **Blok Ekleme:** Sol menüden "Blok Ekle" (Add Block) diyerek **"Özel Ürün Rozeti (Custom Badge)"** seçersiniz.
4. **Ayarları Yapılandırma:** Eklediğiniz bloğun içine girip şu ayarları yaparsınız:
   - **Tetikleyici Etiket:** `Orijinal` (Üründeki etiketle tam eşleşmeli)
   - **Rozet Görseli:** Bilgisayarınızdan "%100 Orijinal" görselini (PNG/SVG) yüklersiniz.
   - **Konum:** "Sol Üst", "Sağ Üst", "Sol Alt", "Sağ Alt" gibi bir pozisyon seçersiniz.
   - **Genişlik:** Rozetin masaüstünde ve mobilde ne kadar büyük görüneceğini (örn: 60px) ayarlarsınız.

Sistem, ürünün etiketlerini arka planda okur, panele eklediğiniz bloklardaki etiketlerle eşleştirir ve eşleşme varsa görseli ürün resminin üzerine yerleştirir. Birden fazla rozet eklerseniz (örn: hem orijinal hem hızlı kargo), ikisi de seçtiğiniz farklı konumlarda aynı anda çıkabilir.

---

## Yapılacak Değişiklikler

### 1. `sections/product-template.liquid`
Bu dosya ürün sayfasının ana iskeletidir. Aşağıdaki değişiklikler yapılacaktır:

#### Schema (Ayarlar) Güncellemesi
Dosyanın en altındaki `blocks` dizisine `custom_badge` adında yeni bir JSON blok yapısı eklenecek. Bu blok; görsel seçici (image_picker), etiket adı (text), konum seçici (select) ve boyut (range) ayarlarını içerecek.

#### HTML/Liquid Entegrasyonu
Dosyanın başlarındaki `<div class="product_detail_img">` (ürün görsellerinin olduğu alan) içerisine, eklenen `custom_badge` bloklarını okuyan ve ürün etiketleriyle (`product.tags`) karşılaştıran bir `for` döngüsü yazılacak. Eşleşen görseller `position: absolute` mantığıyla ana görselin üzerine basılacak.

#### CSS Stilleri
Görsellerin ana resmi bozmaması ve duyarlı (responsive) olması için gerekli olan CSS kodları eklenecek (`.custom-badge-overlay`, `z-index` ayarları, flexbox/absolute ile köşe konumlandırmaları vb.).
