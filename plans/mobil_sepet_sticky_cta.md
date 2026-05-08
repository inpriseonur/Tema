# Mobil Sepet (Cart Drawer) Sticky CTA Geliştirme Planı

Bu plan, Claude AI analiziniz doğrultusunda mobil alışveriş sepeti çekmecesini (cart drawer) kullanıcı deneyimini (UX) ve dönüşüm oranlarını artıracak şekilde modernize etmeyi amaçlamaktadır. Ürün detay sayfasında oluşturduğunuz sabit (sticky) yapıya benzer, aşinalık hissi yaratan ve sepette ödemeye geçişi hızlandıran bir tasarım uygulanacaktır.

## Hedefler
- **Sabit (Sticky) Sepet Alt Alanı:** Kullanıcı sayfayı/sepeti ne kadar kaydırırsa kaydırsın (scroll), ara toplam ve "Ödemeye Geç" butonu ekranın en altında sabit ve her an tıklanabilir kalacak.
- **Odaklı ve Yüksek Kontrastlı CTA:** "Ödemeye Geç" butonu tam genişlikte (full-width), koyu renkli ve net olacak. Yanındaki veya üstündeki gereksiz butonlar kaldırılacak / gizlenecek.
- **Aşinalık Hissi:** Ürün detay sayfasındaki sticky bara benzer yükseklik, arka plan ve buton stili ile kullanıcıya güven veren tutarlı bir deneyim sunulacak.
- **Güven Sinyalleri (Opsiyonel ama Önerilen):** Alt panele Visa/Mastercard logoları veya SSL Güvenli Ödeme ibareleri eklenebilecek bir alan açılacak.
- **Upsell (Tamamlayıcı Ürünler) Görünürlüğü:** Upsell (Bunu da Ekleyin) kartlarının en altta sticky barın arkasında (gizli) kalmaması için kaydırılabilir (scrollable) alanın altına doğru boşluk (padding-bottom) veya flex yapısı eklenecek.

## 🛠️ Açık Sorular (User Review Required)
> [!IMPORTANT]
> Lütfen aşağıdaki maddeleri inceleyip onay verin veya tercihlerinizi belirtin:
> 1. **Mevcut "Sepeti Gör" Butonu:** Sepet alt yapısında genelde "Sepeti Gör" (View Cart) butonu da bulunuyor. Minimalist bir yapı için "Sepeti Gör" butonunu mobilde gizleyip SADECE "Ödemeye Geç" (Checkout) butonuna mı odaklanalım? (Dönüşüm oranları için tavsiye edilen sadece Ödemeye Geç'in olmasıdır).
> 2. **Kargo Barı (Free Shipping Bar):** Şu anda sepetin en üst bölümünde (header altında) çıkıyor. Bunu mevcut yerinde tutup sadece Sepet Alt kısmını (Ara Toplam + Buton) mı sabitleyelim? Yoksa kargo ilerleme çubuğunu da sabit alt panele mi entegre edelim? (Mevcut yerinde kalması genelde daha temiz bir alan sağlar).

## 🚀 Önerilen Değişiklikler

### 1. HTML Yapısal Düzenlemeleri (`snippets/ajax-cart.liquid`)

Mevcut yapıda ürünler, upsell widget'ı ve alt bölüm (footer) birbirini iterek aşağı kaydırıyor. Bunu engellemek için Flexbox mantığı ile CSS mimarisini güncelleyeceğiz.

**[MODIFY] `snippets/ajax-cart.liquid`**
- `cart-pro` (ürün listesi) ve `#cart-complementary-slot` (Upsell alanı) etiketlerini sarmalayacak yeni bir kaydırılabilir gövde div'i (`<div class="ajax-cart-body scroll-bar">`) eklenecek.
- `.footer-mini-cart` bölümü bu kaydırılabilir gövdenin **dışında**, ancak `.drawer-inner` içinde kalarak en alt kısma sabitlenecek.
- Mobilde "Sepeti Gör" butonunu gizlemek için (eğer onaylarsanız) gerekli CSS sınıfları (örn. `d-none d-md-block`) eklenecek.
- Kredi kartı ikonları / Güvenlik metni "Ödemeye Geç" butonunun altına eklenecek.

### 2. CSS Optimizasyonları (`assets/cart-drawer.css` veya `<style>` blokları)

**[MODIFY] CSS Stilleri**
- `.drawer-inner` sınıfına `display: flex; flex-direction: column; height: 100vh;` özellikleri eklenecek.
- Yeni oluşturulacak `.ajax-cart-body` alanına `flex: 1; overflow-y: auto; padding-bottom: 30px;` (son ürünün veya upsell kartının tam görünmesi için güvenlik boşluğu) verilecek.
- `.footer-mini-cart` sınıfına `flex-shrink: 0; position: sticky; bottom: 0; background: #fff; box-shadow: 0 -4px 10px rgba(0,0,0,0.05);` gibi özellikler eklenerek ürün sayfanızdaki sticky tasarıma benzer tok ve yüksek kontrastlı bir stil giydirilecek.
- Ara Toplam metninin font büyüklüğü (font-size) artırılacak ve kalın (bold) hale getirilecek.
- "Ödemeye Geç" butonu `width: 100%` yapılarak parmakla dokunma hedefi (touch target) maksimize edilecek.

## 🧪 Doğrulama Planı (Verification Plan)
1. Mobilde ürünü sepete atarak çekmecenin (drawer) sağdan açılışında tasarımın bozulmadığını kontrol etmek.
2. Sepette 5-6 ürün (veya upsell ürünleri eklendiğinde) liste kaydırılırken (scroll edilirken) "Ödemeye Geç" butonunun ekrandan kaybolmadığını, en altta **sabit (sticky)** kaldığını test etmek.
3. Kaydırma çubuğunun (scroll) en sonuna gelindiğinde, Upsell (Bunu da Ekleyin) kartlarının yarısının buton altında kalıp kalmadığını kontrol etmek.
4. Tasarımın masaüstü görünümde mevcut davranışını koruduğundan emin olmak. (Medya sorguları `@media (max-width: 767px)` ile korunacak).

Planı inceledikten sonra onayınızı (ve açık sorulara cevaplarınızı) bekliyorum. Onayınızla birlikte kodlama aşamasına geçeceğim.
