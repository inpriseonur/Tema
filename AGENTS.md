# Prime Gurme Shopify Tema Bağlamı

## Proje

Bu repo, `primegurme.com` için kullanılan Shopify Online Store 2.0 temasıdır. Tema, Spacingtech'in **Vegist 2.4** teması üzerine kuruludur ve Prime Gurme'nin gurme gıda/içecek satışı için yoğun biçimde özelleştirilmiştir. Ana dil Türkçe, para birimi TL ve mobil alışveriş deneyimi önceliklidir.

Mağazanın öne çıkan iş kuralları:

- Türkiye geneline ücretsiz/kırılmaz paketli kargo mesajları gösterilir.
- İstanbul'da 3.000 TL üzeri siparişlerde kapıda ödeme ve `34` ile başlayan posta koduyla özel araçla ücretsiz teslimat sunulur.
- Ürünlerde Judge.me yorumları, varyant seçimi, stok, barkod ve `custom.skt` varyant metafield'ı kullanılır.
- `paketleme-video` alt metnine sahip ürün videosu, ürün detayındaki güven mesajından açılabilir.

## Yapı ve Kritik Dosyalar

- `layout/theme.liquid`: Global iskelet; mobil ürün sticky CTA/fiyat, ürün ve sepet sayfasına özel görünürlük kuralları, ajax cart bağlantıları. Büyük ve hassas bir dosyadır.
- `sections/product-template.liquid`: Ürün galerisi, varyant başlığı, paketleme videosu, güven mesajları, adet/stok ve SKU-barkod-SKT akışları.
- `snippets/product-variant-picker.liquid`, `snippets/product-variant-options.liquid`: Varyant seçimi.
- `snippets/buy-buttons.liquid`, `snippets/cart-button.liquid`: Satın alma CTA'ları.
- `snippets/ajax-cart.liquid`, `assets/ajax-cart.js`, `sections/cart-complementary.liquid`: Cart drawer ve tamamlayıcı ürün.
- `sections/cart-section.liquid`, `assets/cart.js`, `assets/cart-page.css`: Sepet sayfası ve teslimat bilgisi.
- `snippets/kurumsal-fatura-modal.liquid`: Kurumsal fatura bilgilerini cart attributes olarak yöneten modal.
- `sections/header.liquid`, `snippets/nav-trust-badge.liquid`, `sections/mobile-sticky-menu.liquid`: Navigasyon ve güven rozeti.
- `templates/*.json`, `sections/header-group.json`, `sections/footer-group.json`, `config/settings_data.json`: Aktif tema editörü yerleşimi ve mağaza ayarları.
- `config/settings_schema.json`: Global tema ayar şeması.
- `plans/`: Geçmiş geliştirme planları; çalışma zamanı kodu değildir.
- `yedek/`: Eski tema ZIP yedeği; düzenlenmemelidir.

## Aktif Sayfa Deneyimleri

- Ana sayfa: slider, “en çok tercih edilenler”, İstanbul özel teslimat anlatımı, kategori ürün tabları ve SSS.
- Ürün detay: mobil sticky satın alma çubuğu, varyanta göre başlık/görsel/fiyat, paketleme videosu, Judge.me ve ilgili ürünler.
- Koleksiyon: masaüstünde ürün kartından doğrudan ürün detay aksiyonu; responsive ürün listesi.
- Sepet: sadeleştirilmiş checkout benzeri layout, indirim kodu, opsiyonel kurumsal fatura, teslimat mesajı ve önerilen ürünler.
- Cart drawer: AJAX ile ürün ekleme, ücretsiz kargo ilerlemesi ve complementary recommendation.

## Geliştirme Kuralları

- Shopify Liquid, JSON template ve vanilla JS/jQuery karışımı mevcut yapıyı koru; ayrıca bir build pipeline yoktur.
- Mobil ve masaüstü davranışlarını birlikte kontrol et. Özellikle ürün detayındaki sticky CTA, varyant değişimi, galeri/video ve cart drawer birbirine bağlıdır.
- `templates/*.json` ve `config/settings_data.json` Shopify tema editörü tarafından yeniden yazılabilir; manuel değişiklikleri küçük ve bilinçli tut.
- Ayar eklerken ilgili section schema veya `settings_schema.json` ile Liquid kullanımını birlikte güncelle.
- Mağaza metinlerini ve eşikleri kod içine tekrar gömmek yerine mevcut tema ayarlarını tercih et.
- `yedek/`, `node_modules/`, `playwright-report/` ve `test-results/` içinde ürün kodu değiştirme.
- her gelitirmeden sonra değişiklik yaptığın dosyaları belirt.

## Test

Playwright smoke testleri ürün detayını, cart drawer'a ürün eklemeyi ve koleksiyon kartlarını doğrular.

```powershell
npm run test:smoke
npm run test:desktop
npm run test:mobile
```

Testleri canlı `https://primegurme.com` üzerinde çalıştırma. Kullanıcı açıkça canlı siteyi istemedikçe Shopify preview URL iste; test yapılandırması `BASE_URL` olmadan başlamaz.

```powershell
$env:BASE_URL="https://example.shopifypreview.com"
npm run test:smoke
```

İsteğe bağlı test değişkenleri: `PRODUCT_PATH`, `COLLECTION_PATH`, `EXPECTED_VARIANT_TITLE`.
