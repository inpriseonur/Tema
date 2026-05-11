# Mobil Ana Sepet Sayfası (Cart Page) Geliştirme Planı

Bu plan, ilettiğiniz `cart_final_v3.html` draft dosyası doğrultusunda mobil ana sepet sayfasının (`/cart`) kullanıcı deneyimini ve dönüşüm oranlarını artıracak şekilde modernize edilmesini amaçlamaktadır. **Not: Sağdan açılan sepet panelinde (cart drawer) hiçbir değişiklik yapılmayacaktır.**

## HTML Draft İncelemesi ve Performans Değerlendirmesi
İlettiğiniz HTML yapısı modern CSS (Flexbox, `position: sticky`) kullanılarak oluşturulmuş temiz bir tasarımdır. Temanıza uygulanmasında hiçbir teknik engel yoktur. Karmaşık JavaScript hesaplamaları veya ağır DOM elemanları içermediği için **performans sorunu yaratmaz**, aksine sayfa hızını olumsuz etkilemeden mobil uygulama hissiyatı (app-like experience) sunar. Mevcut temanın CSS yapısına kolayca entegre edilebilir.

## Hedefler
- **Sabit (Sticky) Alt Alan:** Ara toplam, güven rozetleri (Vergiler dahil, Güvenli ödeme, Ücretsiz kargo) ve "Ödemeye Geç" butonu sayfanın en altında kaydırma (scroll) sırasında sabit kalacak.
- **İstanbul'a Özel Teslimat Barı:** Draftta yer alan İstanbul ücretsiz teslimat ilerleme çubuğu sisteme entegre edilecek. Bu bar için gereken hedef tutar (örn. 5000 TL) **tema ayarlarından (Theme Settings) kolayca değiştirilebilir** bağımsız bir ayar olarak eklenecek.
- **Metin Güncellemesi:** Ödemeye geç butonunun altındaki güven rozetlerinde yer alan "Ücretsiz iade" yazısı, "Ücretsiz kargo" olarak güncellenecek.
- **Trending ve Upsell Gösterim Mantığı:**
  - **Upsell (Bunu da Ekleyin):** Sadece sepette ürün varken gösterilecek.
  - **Trending Products:** Sadece sepet **tamamen boş olduğunda** gösterilecek.

## 🚀 Önerilen Değişiklikler

### 1. Tema Ayarlarına İstanbul Teslimat Baremi Eklenmesi (`config/settings_schema.json`)
- Temanın yapılandırma dosyasına yeni bir ayar eklenecek (örn. `istanbul_free_shipping_threshold`).
- Böylece mağaza yöneticisi mevcut ücretsiz kargo ayarından bağımsız olarak İstanbul için hedef tutarı (örn. 5000 TL, 10000 TL) dilediği gibi güncelleyebilecek.

### 2. Sepet Sayfası Yapısal Düzenlemeleri (`templates/cart.liquid` veya ilgili section/snippet)
- `cart_final_v3.html` içerisindeki `.sticky` yapı sepet sayfasının mobil görünümüne entegre edilecek.
- Güven rozetlerindeki "Ücretsiz iade" metni "Ücretsiz kargo" olarak güncellenecek.
- Sepet boş/dolu durumlarına göre Liquid `{% if cart.item_count == 0 %}` kontrolleri eklenecek:
  - Trending Products section'ı sadece boş sepette görünecek şekilde kurgulanacak.
  - Upsell section'ı sadece dolu sepette görünecek şekilde ayarlanacak.

### 3. CSS Stillerinin Entegrasyonu
- Draft dosyasındaki `.sticky`, `.ship-bar-bg`, `.trust-badges` vb. class'lar temanın ana CSS dosyasına (veya sepet özelindeki CSS dosyasına) eklenecek.
- Masaüstü görünümün etkilenmemesi için yeni eklenen CSS kuralları sadece mobil medya sorguları (`@media (max-width: 767px)`) içerisine yazılacak veya uygun sınıflarla izole edilecek.

## 🧪 Doğrulama Planı (Verification Plan)
1. Ana sepet sayfasına (`/cart`) mobilden girildiğinde yeni sticky alt barın sorunsuz çalıştığının test edilmesi.
2. Tema ayarlarından (Customizer) İstanbul ücretsiz teslimat tutarının değiştirilip frontend'e anında yansıdığının görülmesi.
3. Sepette ürün varken Upsell alanının çıkması ve Trending ürünlerin gizlenmesi; sepet boşaltıldığında ise Upsell'in kaybolup Trending ürünlerin listelendiğinin test edilmesi.
4. Sağdan açılan sepet çekmecesinin (cart drawer) bu değişikliklerden etkilenmediğinin ve eski haliyle düzgün çalıştığının teyit edilmesi.

> [!NOTE]
> Önceki plandaki 1. ve 2. sorular, bu geliştirmenin sadece ana sepet sayfasını kapsaması ve kargo barının mevcut durumu nedeniyle kaldırılmıştır. Plan tamamen yeni yönlendirmelerinize göre güncellenmiştir. Herhangi bir kod değişikliği yapılmamıştır.
