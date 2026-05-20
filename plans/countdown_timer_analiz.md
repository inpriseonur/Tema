# Geri Sayım Sayacı (Countdown Timer) Analiz Raporu

## 1. Mevcut Durum

Temada geri sayım ile ilgili **iki ayrı bileşen** var. Aşağıda ikisinin de nasıl çalıştığı, neden çalışmadığı ve eksikleri detaylı şekilde açıklanmıştır.

---

## 2. Product Countdown Timer (Ürün Detay Sayfası Bloğu)

### Nerede?
`sections/product-template.liquid` — Tema Özelleştirici'de ürün sayfasına eklenebilen bir blok (`Product countdown timer`).

### Nasıl Çalışıyor (Teorik)?
1. Blok eklendiğinde `{% when 'product_countdown' %}` şartı tetikleniyor.
2. Kod, ürünün `product.metafields.custom.timer` adlı **Shopify metafield** değerini okuyor.
3. Bu metafield doluysa, bir `<div class="week-countdown">` render ediliyor ve jQuery `countdown` plugin'i ile geri sayım başlatılıyor.

### Neden Çalışmıyor?

> [!CAUTION]
> **Asıl Sorun:** `product.metafields.custom.timer` metafield'ı ürünlerinizde tanımlı değil.

Kodun çalışma mantığı şu:

```liquid
{% if product.metafields.custom.timer %}
  <!-- Geri sayım gösterilir -->
{% endif %}
```

Bu `if` kontrolü, metafield boş olduğu için **her zaman false** döner ve blok hiçbir şey render etmez. Bloğu temaya ekleseniz bile ekranda hiçbir şey görmezsiniz.

### Metafield Nasıl Tanımlanmalı?

Shopify Admin'den şu adımları izlemeniz gerekiyor:

1. **Ayarlar > Özel Veriler (Custom Data) > Ürünler (Products)** bölümüne gidin.
2. "Tanım Ekle" (Add definition) ile yeni bir metafield oluşturun:
   - **Ad:** `timer` (namespace: `custom`, yani tam adı `custom.timer` olacak)
   - **Tür:** `date_and_time` veya `single_line_text` (format: `MM/DD/YYYY HH:MM:SS` veya `YYYY-MM-DD`)
3. İndirim uygulamak istediğiniz ürüne gidin ve bu metafield'a bitiş tarihini girin (ör: `05/31/2026 23:59:59`).

### Blok Ayarları (Schema)

| Ayar | Açıklama | Varsayılan |
|---|---|---|
| `hurry_up_text` | Geri sayımın yanında gösterilecek metin | "Hurry up! Sale ends in:" |

> [!WARNING]
> **Önemli Kısıtlamalar:**
> - Tarih bilgisi **blok ayarlarında yok**, her ürüne **ayrı ayrı metafield olarak** girilmek zorunda.
> - Blok ayarlarından tarih girme seçeneği mevcut değil.
> - Metin Türkçeye çevrilmeli ("Acele edin! İndirim bitiyor:" gibi).

### CSS Stili

Mevcut CSS (`product-template.css`, satır 626-645):
- Kırmızı tonlarda (`#f80013`), pembe arka planlı (`#fff4f4`), kenarlıklı bir bant tasarımı.
- İçerik `flex` ile yatay olarak diziliyor: solda metin, sağda `GÜN : SAAT : DAKİKA : SANİYE` formatında sayaç.

### JS Bağımlılığı

- `jquery.countTo.js` — Aslında **jQuery Final Countdown** plugin'i (v2.2.0). Header'da `defer` ile yükleniyor.
- Plugin çalışması jQuery'ye bağlı (`$(...).countdown(...)` şeklinde çağrılıyor).
- Script, sayfa yüklendikten 1 saniye sonra `setTimeout` içinde çalışıyor.

---

## 3. Deal Banner (Genel Sayfa Bölümü)

### Nerede?
`sections/deal-banner.liquid` — Tema Özelleştirici'de herhangi bir sayfaya eklenebilen bağımsız bir section.

### Nasıl Çalışıyor?
1. Ayarlardan **ay, gün ve yıl** seçilir (ör: May, 31, 2026).
2. Arka plan görseli ve metin tanımlanır.
3. JavaScript, `new Date('May 31, 2026 00:00:00')` ile bitiş tarihi oluşturup saniye saniye geri sayar.
4. `#days`, `#hours`, `#minutes`, `#seconds` ID'li `<span>` elementlerini günceller.

### Ayarları

| Ayar | Açıklama |
|---|---|
| `section_ttsub` | Alt başlık metni |
| `section_title` | Ana başlık metni |
| `deal_bg_img` | Arka plan görseli (1920x450px) |
| `text_color` | Metin rengi |
| `product_mont` | Geri sayım ayı (select) |
| `product_year` | Geri sayım yılı |
| `product_date` | Geri sayım günü |
| `shop_btn` | Buton metni |
| `collection_url` | Butonun yönlendireceği URL |

### Sorunlar ve Kısıtlamalar

> [!WARNING]
> **1. Sayfa Genelinde Tek Kullanım:** `#days`, `#hours` gibi sabit ID'ler kullanıyor. Aynı sayfada 2 kez kullanılamaz.
> 
> **2. Ürün Detay Sayfasında Kullanılamaz:** Bu bir **section**, blok değil. Ürün detay sayfasının içine (ürün bilgileri arasına) gömülemez.
> 
> **3. Ürüne Özel Değil:** Tarih bilgisi section ayarlarında. Tüm sayfalarda aynı tarihi gösterir. Belirli bir ürüne özel geri sayım yapılamaz.

### Zaman Etiketleri

`settings_schema.json`'daki global "Product Timer" ayarları deal-banner tarafından kullanılıyor:
- `day_title`: "Day" (→ "Gün" olmalı)
- `hour_title`: "Hrs" (→ "Saat" olmalı)
- `minute_title`: "Min" (→ "Dakika" olmalı)
- `second_title`: "sec" (→ "Saniye" olmalı)

---

## 4. Karşılaştırma Tablosu

| Özellik | Product Countdown (Blok) | Deal Banner (Section) |
|---|---|---|
| Kullanım Alanı | Sadece ürün detay sayfası | Herhangi bir sayfa |
| Tarih Kaynağı | Ürün metafield'ı (`custom.timer`) | Section ayarları (ay/gün/yıl) |
| Ürüne Özel mi? | ✅ Evet (metafield bazlı) | ❌ Hayır (global tarih) |
| Çalışıyor mu? | ❌ Metafield olmadan çalışmaz | ✅ Ayarlar girilirse çalışır |
| JS Bağımlılığı | jQuery Countdown Plugin | Vanilla JS (bağımsız) |
| Görsel Tasarım | Kırmızı bant (minimal) | Tam genişlik arka plan görselli banner |
| Çoklu Kullanım | ✅ Her ürün farklı tarih alabilir | ❌ Aynı sayfada tek kullanım |

---

## 5. Kullanım Senaryosu: "Bu Fiyatların Son Günü 31 Mayıs"

Bunu gerçekleştirmek için **3 farklı yol** mevcut:

### Seçenek A: Mevcut Product Countdown Bloğunu Aktifleştirmek
- **Ne yapılır:** Shopify Admin'den `custom.timer` metafield tanımlanır, ilgili ürüne tarih girilir.
- **Avantaj:** Kod zaten var, sadece veri girişi gerekli. Her ürüne farklı tarih verilebilir.
- **Dezavantaj:** Her ürüne tek tek metafield girilmeli. Toplu kampanyalarda zahmetli. Mevcut tasarım çok basit (kırmızı bant). Metin İngilizcede kalmış.
- **Tahmini Efor:** Düşük (metafield tanımı + metin çevirisi)

### Seçenek B: Product Countdown Bloğuna Tarih Ayarı Eklemek
- **Ne yapılır:** Blok şemasına (`schema`) bir tarih seçici eklenir. Böylece metafield'a ihtiyaç kalmaz, doğrudan Tema Özelleştirici'den tarih girilir.
- **Avantaj:** Kullanımı çok kolay, Shopify Admin'e girmeye gerek yok. Metafield bilgisi gerektirmez.
- **Dezavantaj:** Tüm ürünler aynı tarihi gösterir (blok ayarı global). Ürüne özel tarih verilmek istenirse metafield yine lazım olur.
- **Tahmini Efor:** Orta (şema + liquid + JS değişikliği)

### Seçenek C: Hibrit Yaklaşım (Önerilen)
- **Ne yapılır:** 
  1. Blok şemasına bir tarih alanı **ve** bir "öncelik" ayarı eklenir.
  2. Önce ürünün metafield'ına bakılır; yoksa blok ayarındaki genel tarih kullanılır.
  3. Tasarım güncellenir (PrimeGurme'nin yeşil/lacivert tonlarına uygun, modern görünüm).
  4. Türkçe etiketler ve "Bu fiyatların son günü" gibi özelleştirilebilir metin.
- **Avantaj:** Hem toplu kampanya hem ürüne özel kampanya desteklenir.
- **Dezavantaj:** En fazla geliştirme eforu gerektiren seçenek.
- **Tahmini Efor:** Orta-Yüksek

---

## 6. Özet ve Öneri

1. **Product Countdown çalışmıyor** çünkü `custom.timer` metafield'ı ürünlerde tanımlı değil. Bu bir bug değil, eksik veri girişi sorunu.
2. **Deal Banner çalışıyor** ama ürün detay sayfasının içine yerleştirilemez; genel sayfalara eklenen bağımsız bir bölüm.
3. Hedefiniz "belirli bir ürüne özel geri sayım" ise en hızlı yol **Seçenek A** (metafield tanımı). En kullanışlı yol ise **Seçenek C** (hibrit yaklaşım).

> [!IMPORTANT]
> Hangi yolu tercih ettiğinizi belirtirseniz, ona göre geliştirme planı hazırlayabilirim.
