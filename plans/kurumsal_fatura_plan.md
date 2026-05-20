# Kurumsal Fatura Bilgisi Toplama — Geliştirme Planı

**Tarih:** 2026-05-14  
**Plan:** Shopify Grow — Sepet sayfasında kurumsal fatura bilgisi toplama  
**Durum:** 🟢 Onaylandı — Faz 1 (Sadece Cart Attributes, bağımsız section)

---

## 1. Özet

Sepet sayfasında müşteriden **Firma Unvanı**, **Vergi Numarası** ve **Vergi Dairesi** bilgilerini toplayan bir modal/popup sistemi geliştirilecek. Veriler Shopify'ın native `cart attributes` sistemine yazılacak ve checkout sonrası siparişin `note_attributes` alanında kalıcı olarak saklanacak.

---

## 2. Mimari Karar: Customer Metafields Konusu

### ⚠️ KRİTİK BULGU — Metafield Yazma Frontend'den Mümkün DEĞİL

Araştırma sonucunda şu tespit yapıldı:

> **Shopify, hiçbir planda (Basic, Grow, Plus dahil) frontend/tarayıcı tarafından Customer Metafields'a doğrudan yazma işlemine izin vermez.** Ne Ajax API ne de Storefront API bu yeteneğe sahiptir. Metafield yazma işlemi yalnızca **Admin API** üzerinden, bir **sunucu tarafı (backend) aracı** ile yapılabilir.

### Metafield Yazma İçin Gerekli Mimari:

```
[Tarayıcı/Frontend]
        │
        ▼ fetch() ile JSON gönder
[Shopify App Proxy veya Harici Sunucu]
        │
        ▼ Admin API (GraphQL mutation)
[Shopify Customer Metafields]
```

### Seçenek Analizi:

| Seçenek | Açıklama | Artıları | Eksileri |
|---------|----------|----------|----------|
| **A) Sadece Cart Attributes** | Metafield'ı tamamen bırak, sadece cart attributes kullan | Sıfır ek altyapı, hemen uygulanabilir | Giriş yapmış müşterinin verileri sonraki siparişlerde tekrar kullanılamaz |
| **B) Cart Attributes + App Proxy** | Bir Shopify Custom App oluştur, App Proxy üzerinden metafield yaz | Müşteri verisi kalıcı saklanır, sonraki siparişlerde otomatik dolar | Shopify Partner hesabı + Custom App kurulumu gerekli, ek bakım maliyeti |
| **C) Cart Attributes + Harici Serverless** | Cloudflare Workers / Vercel Edge Function ile metafield yaz | Esnek, hızlı deploy | CORS yönetimi, domain yapılandırması, ayrı hosting maliyeti |

### 🟢 Önerilen Yaklaşım: **Seçenek A (Sadece Cart Attributes)** — Faz 1

**Gerekçe:**
- Muhasebe programının ihtiyacı olan 3 alan, zaten **sipariş bazında** `note_attributes`'ta saklanır
- Her sipariş kendi fatura bilgisini taşır — bu da zaten doğru iş mantığıdır (her siparişte farklı firma olabilir)
- Sıfır ek altyapı, sıfır bakım maliyeti
- Giriş yapmış kullanıcı için "verileri hatırla" özelliği istenirse Faz 2 olarak App Proxy ile eklenebilir

> **Faz 2 (Opsiyonel):** Eğer "giriş yapmış müşteri tekrar geldiğinde alanlar dolu gelsin" özelliği kesinlikle isteniyorsa, bir Shopify Custom App + App Proxy kurulumu gerekecektir. Bu ayrı bir geliştirme projesidir.

---

## 3. Veri Akışı

```
┌──────────────┐     POST /cart/update.js      ┌──────────────────┐
│   Modal'da   │  ──────────────────────────►   │  Shopify Cart    │
│   Kaydet     │   attributes[Firma Unvani]     │  Attributes      │
│   butonuna   │   attributes[Vergi Numarasi]   │                  │
│   tıklanır   │   attributes[Vergi Dairesi]    │                  │
└──────────────┘                                └────────┬─────────┘
                                                         │
                                              Checkout tamamlanınca
                                                         │
                                                         ▼
                                                ┌──────────────────┐
                                                │  Shopify Order   │
                                                │  note_attributes │
                                                │  (customAttribu- │
                                                │   tes in GraphQL)│
                                                └──────────────────┘
```

### Sayfa Yüklenme Sırası:
1. `cart-section.liquid` render edilir
2. JavaScript, `GET /cart.js` ile mevcut cart attributes'ları çeker
3. Eğer `attributes["Firma Unvani"]` vb. doluysa → buton `✅ Kurumsal fatura bilgisi eklendi ✎` olarak gösterilir
4. Popup açıldığında alanlar mevcut verilerle doldurulur

---

## 4. Dosya Yapısı ve Değişiklikler

### Yeni Dosyalar:

| Dosya | Açıklama |
|-------|----------|
| `sections/kurumsal-fatura.liquid` | Bağımsız tema section'ı — Buton + Modal HTML + CSS + JavaScript |

### Değiştirilecek Dosyalar:

| Dosya | Değişiklik |
|-------|----------|
| `templates/cart.json` | Yeni section referansı eklenecek (Theme Editor'dan da yapılabilir) |

### Neden Bağımsız Section?
- `cart-section.liquid` dosyasına hiç dokunulmuyor — sıfır çakışma riski
- Theme Editor'da sürükle-bırak ile konum değiştirilebilir
- Buton metni section settings'ten düzenlenebilir
- İndirim kutusu açık/kapalı olsa da bağımsız çalışır
- Popup, form alanları ve validasyon kodda çakılı kalır

### Section Settings (Theme Editor'dan düzenlenebilir):
- Buton metni (varsayılan: "🧾 Kurumsal fatura bilgisi ekle")
- Onay metni (varsayılan: "✅ Kurumsal fatura bilgisi eklendi")
- Modal başlık metni

---

## 5. Buton Yerleşimi (Sepet Sayfası)

Mevcut sepet yapısı ve butonun konumu:

```
┌─────────────────────────────────────┐
│  Ürün listesi (table)               │
├─────────────────────────────────────┤
│  İndirim Kodu Kutusu               │  ← discount-content (satır 194)
├─────────────────────────────────────┤
│  🧾 Kurumsal fatura bilgisi ekle   │  ← YENİ BUTON BURAYA
├─────────────────────────────────────┤
│  Sepetini tamamla (complementary)   │  ← cart-comp-section (satır 214)
└─────────────────────────────────────┘
```

**Not:** `cart_discount_enable` ayarı şu an `false` olarak set edilmiş (`cart.json`'da). İndirim kodu kutusu görünmüyor. Buton, note alanından sonra (`{%- endif -%}` satır 210) ve `</form>` (`satır 211`) arasına veya hemen `</form>` sonrasına eklenecek.

---

## 6. Modal/Popup Tasarımı

### HTML Yapısı:
```
<div id="kurumsal-fatura-overlay"> (arka plan karartma)
  <div id="kurumsal-fatura-modal"> (modal kutu)
    <div class="kf-modal-header">
      <h3>Kurumsal Fatura Bilgileri</h3>
      <button class="kf-modal-close">&times;</button>
    </div>
    <div class="kf-modal-body">
      <label>Firma Unvanı</label>
      <input type="text" id="kf-firma-unvani">

      <label>Vergi Numarası</label>
      <input type="text" id="kf-vergi-numarasi" maxlength="10" inputmode="numeric">

      <label>Vergi Dairesi</label>
      <input type="text" id="kf-vergi-dairesi">
    </div>
    <div class="kf-modal-footer">
      <button id="kf-kaydet">Kaydet</button>
      <button id="kf-vazgec">Vazgeç</button>
    </div>
  </div>
</div>
```

### CSS Kuralları:
- Overlay: `position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999`
- Modal: `max-width: 440px; margin: auto; border-radius: 12px; background: #fff`
- Mobilde modal genişliği: `max-width: 92vw; max-height: 85vh`
- Font ve renkler: Temanın mevcut `--color-primary (#80bb01)`, `#1a2b4c` ve `#fff` renk paletine uygun
- Buton stili: Temanın `.btn-style1` sınıfına uyumlu

### JavaScript Davranışları:
1. **Vergi Numarası validasyonu:**
   ```javascript
   input.addEventListener('input', function() {
     this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
   });
   ```
2. **Kaydet işlemi:**
   ```javascript
   fetch('/cart/update.js', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       attributes: {
         'Firma Unvani': firmaUnvani,
         'Vergi Numarasi': vergiNumarasi,
         'Vergi Dairesi': vergiDairesi
       }
     })
   });
   ```
3. **Sayfa yüklenme kontrolü:**
   ```javascript
   fetch('/cart.js')
     .then(r => r.json())
     .then(cart => {
       if (cart.attributes['Firma Unvani'] || 
           cart.attributes['Vergi Numarasi'] || 
           cart.attributes['Vergi Dairesi']) {
         // Buton durumunu "✅ eklendi ✎" yap
       }
     });
   ```

---

## 7. Riskler ve Dikkat Edilmesi Gerekenler

### 🔴 Yüksek Risk

| # | Risk | Etki | Çözüm |
|---|------|------|-------|
| R1 | **Cart attributes AJAX ile güncellendikten sonra sayfa yeniden render edilirse veriler kaybolabilir** | Temanın mevcut AJAX sepet güncelleme kodu (satır 677-723) tüm `.cart-body` innerHTML'ini yeniden yazıyor. Eğer buton bu alanın **içindeyse**, buton durumu sıfırlanır. | Butonu `<ajax-items>` dışına veya `cart-comp-section` ile aynı seviyeye yerleştir. Alternatif: innerHTML yenilendiğinde buton durumunu yeniden kontrol et. |
| R2 | **Customer Metafields frontend'den yazılamaz** | İlk istekteki "metafield'a da yaz" gereksinimi doğrudan karşılanamaz | Seçenek A (sadece cart attributes) ile başla, Faz 2 için App Proxy planla |

### 🟡 Orta Risk

| # | Risk | Etki | Çözüm |
|---|------|------|-------|
| R3 | **Misafir kullanıcı tarayıcıyı kapatırsa cart attributes kaybolur** | Oturum sona ererse veriler gider | Beklenen davranış — kullanıcıya bilgi verilebilir ama teknik olarak engellenemez |
| R4 | **Aynı oturumda birden fazla sipariş verilirse eski attributes kalabilir** | Bir önceki siparişin fatura bilgisi yeni sepete taşınabilir | Sipariş tamamlandığında Shopify cart'ı zaten temizler, düşük risk |
| R5 | **Mobilde soft keyboard açılınca modal kayabilir** | UX bozulması | Modal'a `position: fixed` + `overflow-y: auto` ver, test et |

### 🟢 Düşük Risk

| # | Risk | Etki | Çözüm |
|---|------|------|-------|
| R6 | **Tema güncellemesi cart-section.liquid'i override edebilir** | render çağrısı kaybolur | Tek satır ekleme olduğu için merge kolay, git diff ile kontrol et |
| R7 | **Attribute key isimleri Türkçe karakter içermiyor** | Entegrasyon karışıklığı | Key'ler kasıtlı olarak ASCII: `Firma Unvani`, `Vergi Numarasi` — Türkçe karakter yok, entegrasyon dostu |

---

## 8. Eksiklikler ve Açık Sorular

### ❓ Karar Gerektiren Konular

| # | Soru | Etki |
|---|------|------|
| S1 | **Faz 2 (Customer Metafields) gerekli mi yoksa sadece Cart Attributes yeterli mi?** Metafield yazabilmek için bir Shopify Custom App + App Proxy kurulumu gerekiyor. Bu ayrı bir proje. | Geliştirme kapsamını belirler |
| S2 | **İndirim kodu kutusu ileride aktif edilecek mi?** Şu an `cart_discount_enable: false`. Aktif olursa buton konumu ayarlanmalı. | Yerleşim tasarımı |
| S3 | **Boş bırakılan alanlar attribute olarak kaydedilsin mi?** Örn: müşteri sadece Vergi Numarası girerse, Firma Unvanı boş string mi, yoksa hiç yazılmasın mı? | Entegrasyon mantığı |
| S4 | **Ajax cart drawer'da (mini sepet) da bu buton olmalı mı?** Şu an sadece tam sayfa sepet (`/cart`) planlanıyor. | Kapsam genişlemesi |

---

## 9. Test Planı

| # | Test Senaryosu | Beklenen Sonuç |
|---|---------------|----------------|
| T1 | Misafir kullanıcı: 3 alanı doldur, Kaydet | `/cart.js` response'unda `attributes` altında 3 alan görünmeli |
| T2 | Kaydet sonrası buton durumu | `✅ Kurumsal fatura bilgisi eklendi ✎` gösterilmeli |
| T3 | Kalem ikonuna tıkla | Modal açılmalı, alanlar dolu gelmeli |
| T4 | Düzenle ve tekrar kaydet | Yeni değerler `/cart.js`'te güncellenmiş olmalı |
| T5 | Vazgeç butonuna tıkla | Modal kapanmalı, veriler değişmemeli |
| T6 | Overlay'e (dış alana) tıkla | Modal kapanmalı |
| T7 | Vergi Numarası alanına harf gir | Harf kabul edilmemeli, sadece rakam |
| T8 | Vergi Numarası 11+ karakter gir | 10 karakterde kesilmeli |
| T9 | Mobilde (375px genişlik) modal aç | Modal ekranı tam kaplamamalı, ortada küçük modal |
| T10 | Ürün adedi değiştir (AJAX update) sonra buton durumu | Buton durumu korunmalı (`✅` kalmalı) |
| T11 | Checkout'u tamamla, sipariş detayına bak | Shopify Admin → Sipariş → "Ek ayrıntılar" bölümünde 3 alan görünmeli |
| T12 | Tüm alanları boş bırakıp Kaydet | Boş değerlerle attribute yazılmalı (veya hiç yazılmamalı — S3'e bağlı) |

---

## 10. Muhasebe Programı Entegrasyon Rehberi

> **Bu bölümü muhasebe/ERP entegrasyonunu yapan ekibe iletin.**

### Sipariş Verisi Okuma Noktaları

Kurumsal fatura bilgileri, sipariş oluşturulduktan sonra şu alanlarda bulunur:

---

### REST Admin API (Eski Yöntem)

**Endpoint:** `GET /admin/api/2024-01/orders/{order_id}.json`

**Yanıt içindeki konum:** `order.note_attributes` dizisi

```json
{
  "order": {
    "id": 123456789,
    "note_attributes": [
      { "name": "Firma Unvani", "value": "PrimeGurme Gıda A.Ş." },
      { "name": "Vergi Numarasi", "value": "1234567890" },
      { "name": "Vergi Dairesi", "value": "Kadıköy" }
    ]
  }
}
```

**Eşleştirme Tablosu:**

| Muhasebe Alanı | Shopify `note_attributes` Key | Veri Tipi | Max Uzunluk | Açıklama |
|----------------|-------------------------------|-----------|-------------|----------|
| **Firma Unvanı** | `Firma Unvani` | String | Sınırsız | Faturada görünecek firma adı. Boş olabilir. |
| **Vergi Numarası** | `Vergi Numarasi` | String (sadece rakam) | 10 karakter | Tüzel kişi vergi kimlik numarası. Boş olabilir. |
| **Vergi Dairesi** | `Vergi Dairesi` | String | Sınırsız | Firmanın bağlı olduğu vergi dairesi adı. Boş olabilir. |

> **⚠️ DİKKAT:** Key isimlerinde Türkçe karakter **yoktur** (ı→i, ü→u şeklinde ASCII). Bu kasıtlıdır, API uyumluluğu için. Tam yazımlar: `Firma Unvani`, `Vergi Numarasi`, `Vergi Dairesi`

---

### GraphQL Admin API (Yeni Yöntem)

```graphql
query {
  order(id: "gid://shopify/Order/123456789") {
    customAttributes {
      key
      value
    }
  }
}
```

**Yanıt:**
```json
{
  "data": {
    "order": {
      "customAttributes": [
        { "key": "Firma Unvani", "value": "PrimeGurme Gıda A.Ş." },
        { "key": "Vergi Numarasi", "value": "1234567890" },
        { "key": "Vergi Dairesi", "value": "Kadıköy" }
      ]
    }
  }
}
```

---

### Webhook ile Otomatik Alma

Sipariş webhook'u (`orders/create` veya `orders/paid`) payload'ında da aynı veriler gelir:

```json
{
  "id": 123456789,
  "note_attributes": [
    { "name": "Firma Unvani", "value": "PrimeGurme Gıda A.Ş." },
    { "name": "Vergi Numarasi", "value": "1234567890" },
    { "name": "Vergi Dairesi", "value": "Kadıköy" }
  ]
}
```

---

### Shopify Admin Panel'de Görünüm

Sipariş detay sayfasında, sağ taraftaki **"Ek ayrıntılar" (Additional details)** bölümünde bu 3 alan ve değerleri otomatik görünür. Manuel müdahale gerekmez.

---

### Entegrasyon Kuralları

1. **Alanlar opsiyoneldir.** Müşteri hiçbir alan doldurmadan da sipariş verebilir. `note_attributes` boş gelebilir veya sadece bazı alanlar olabilir.
2. **Key eşleştirme sabit olmalı.** Entegrasyon kodu key'leri **sabit string olarak** eşleştirmeli, dinamik arama yapmamalı:
   - `"Firma Unvani"` → Firma Unvanı
   - `"Vergi Numarasi"` → Vergi Numarası  
   - `"Vergi Dairesi"` → Vergi Dairesi
3. **Boş string kontrolü yapın.** Müşteri alanları açıp boş kaydedebilir. `value` alanı `""` (boş string) olabilir — bunu "alan yok" gibi ele alın.
4. **Encoding:** Değerler UTF-8'dir. Firma unvanında Türkçe karakter (ş, ğ, ü, ö, ç, ı) olabilir.

---

## 11. Geliştirme Takvimi (Tahmini)

| Faz | İş | Süre |
|-----|------|------|
| Faz 1 | Cart Attributes + Modal (bu plan) | ~3-4 saat geliştirme + 1 saat test |
| Faz 2 (Opsiyonel) | Custom App + App Proxy + Customer Metafields | ~1-2 gün (ayrı proje) |

---

## 12. Onay Kontrol Listesi

- [ ] Seçenek A (Sadece Cart Attributes) ile devam edilsin mi?
- [ ] Faz 2 (Customer Metafields) şimdilik ertelensin mi?
- [ ] Boş alanlar attribute olarak yazılsın mı, yoksa sadece dolu alanlar mı?
- [ ] Sadece tam sayfa sepet (`/cart`) için mi, yoksa mini cart drawer için de mi?
- [ ] Key isimleri onay: `Firma Unvani`, `Vergi Numarasi`, `Vergi Dairesi`

---

*Bu plan onaylandıktan sonra geliştirmeye başlanacaktır.*
