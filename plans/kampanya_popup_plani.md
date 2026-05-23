# Ürün Sayfası Kampanya Popup Planı (En Güncel - Kısıtlanmış /cart.js)

Bu dosya, ürün detay sayfasının sağ sütununa (masaüstünde) parametrik olarak yönetilebilen Kampanya Kutusu ekleme, iki farklı stil seçeneği (Seçenek A ve C), parametrik alt mesaj kontrolü ve kısıtlanmış sepet API'si (`/cart.js`) üzerinden durum yönetimini içeren güncel planı tanımlar.

---

## 1. Tasarım Seçenekleri (Seçenek A ve C)

Tema Özelleştirici (Customizer) ekranından tamamen yönetilebilecek iki stil sunulacaktır:

* **Seçenek A (Koyu Lacivert):**
  * Koyu renk arka plan (varsayılan lacivert).
  * Sol tarafta hediye kutusu ikonu.
  * Altında geniş hediye ikonlu buton ("İndirim kodunu al").
  * **Kupon Alındı Durumu:** Buton gizlenir, sol tarafta yeşil onay ikonu belirir, metinler güncellenir.
* **Seçenek C (Minimal Kart):**
  * İnce kenarlık (border) ve sol aksan çizgisi tasarımı.
  * Sol tarafta kutu içine alınmış hediye ikonu, sağ tarafta kupon değerini gösteren küçük rozet (badge - örn. "100 TL").
  * Altında gold renkli buton ("İndirim kodunu al").
  * **Kupon Alındı Durumu:** Buton gizlenir, sol tarafta yeşil halkalı onay ikonu belirir, metinler güncellenir.

---

## 2. Alt Mesaj (Subtitle) Kontrolü

* Kampanya alt mesajı (sub-message) isteğe bağlı olacaktır. 
* Eğer tema ayarlarında boş bırakılırsa, ilgili HTML etiketi render edilmeyecek ve CSS padding/margin dengesi bozulmadan başlık alanı dikeyde ortalanacaktır.

---

## 3. Kısıtlanmış Sepet API (/cart.js) Entegrasyonu

Gereksiz isteklerin önüne geçmek ve performansı korumak için `/cart.js` sorgulaması **sadece** şu durumlarda çalışacaktır:

1. **Ürün detay sayfası ilk yüklendiğinde (Sayfa Açılışı):**
   * Kullanıcı sayfaya girdiğinde sepet durumu bir kez sorgulanır. Eğer sepette zaten indirim varsa kutu direkt yeşil "Kupon Alındı" durumunda başlar.
2. **KwikAI popup başarıyla tamamlandığında:**
   * Kullanıcı popup üzerinden kuponu aldığında/sepetine uyguladığında tetiklenen event (KwikAI/GoKwik submit/success event listener) yakalanarak `/cart.js` sorgulanır ve kutu anında yeşil onay durumuna geçer.

**Kaldırılan Durumlar:**
* Sepet sayfasındaki dinlemeler, koleksiyon sayfaları vb. diğer sayfalardaki tüm kontroller plandan kaldırılmıştır.
* Ajax sepet çekmecesindeki (Cart Drawer) sıradan ürün ekleme/çıkarma işlemleri sırasında kampanya kutusu için `/cart.js` sorgusu atılmayacaktır.

---

## 4. Tema Ayarları (Section Settings) & Dinamik Sınıf Yönetimi

Sürüklenebilir bir blok (App Block) **yerine**, yerleşimi sağ sütunda sabitlemek amacıyla bu ayarlar doğrudan `product-template` genel bölüm ayarları (Section Settings) içerisine eklenecektir.

* **Gösterim Aç/Kapat:** Kampanya kutusunu aktif/pasif yapma.
* **Tasarım Seçeneği:** Stil A (Koyu Lacivert) / Stil C (Minimal Kart).
* **Tetikleyici Sınıf Adı (Class):** KwikAI panelinde "Click Trigger" kısmına yazdığınız sınıf adı (örn. `campaign-popup-trigger`).
* **Başlık Metni (Title):** Örn: "İlk siparişine özel fırsat"
* **Alt Başlık Metni (Subtitle):** Örn: "Yeni üyelere özel — bir kez geçerli" (Boş bırakılabilir)
* **Kupon Değeri Rozet Metni (Seçenek C için):** Örn: "100 TL"
* **Buton Metni:** Örn: "İndirim kodunu al"
* **Kupon Uygulandı Başlığı:** Örn: "100 TL indiriminiz eklendi"
* **Kupon Uygulandı Alt Mesajı:** Örn: "Ödeme adımında otomatik uygulanacak"
* **Tasarım Renkleri:** Border, Sol Aksan Çizgisi, Arka Plan renk seçicileri.

---

## 5. Yapılacak Değişiklikler (Dosyalar)

1. **[product-template.liquid](file:///Users/onurcinemre/production/PrimeGurme/Tema/sections/product-template.liquid):**
   * Şema (Schema) alanlarına tasarım seçeneklerini ve metin alanlarını ayrı bir blok (blocks) olarak **değil**, doğrudan Product Section genel ayarları (settings) arasına ekleme.
   * Kampanya kutusunun HTML yapısını, sağ sütundaki kargo (Hizmetler) kutularının (`.ser-wrapper`) hemen üstüne yerleştirerek, sol taraftaki ürün başlığı çizgisiyle aynı hizadan başlamasını sağlama.
2. **[product-template.css](file:///Users/onurcinemre/production/PrimeGurme/Tema/assets/product-template.css):**
   * Stil A ve Stil C için CSS kurallarını yazma.
   * Alt mesajın girilmediği durumlar için dikey ortalama kuralları.
   * Sepet kupon uygulandığında uygulanacak `.applied` durum kuralları (buton gizleme, yeşil renk tonları).
   * Masaüstü hizalama (İstanbul Ücretsiz Teslimat kutusunun sol başlık çizgisiyle hizalanması) ve mobilde gizleme kuralları.
3. **[plugins.js](file:///Users/onurcinemre/production/PrimeGurme/Tema/assets/plugins.js):**
   * `/cart.js` entegrasyonu ile sepet durumunu okuyan ve kampanya kutusunun sınıflarını (tetikleyici sınıf dahil) ve metin durumlarını güncelleyen JS kodunu ekleme.
   * Bu fonksiyonun sayfa açılışı ve KwikAI popup'ının başarı durumuna bağlanması.
