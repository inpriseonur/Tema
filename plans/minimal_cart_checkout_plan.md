# Sepet Sayfası Minimalist Tasarım (Minimal Cart Header & Footer) Planı

## 1. Hedef ve E-Ticaret Yaklaşımı
Kullanıcının sepet sayfasına ulaştığı an, satın alma kararını verdiği veya vermek üzere olduğu andır. Bu aşamada kullanıcıya sitede gezinmesi için sunulan ek seçenekler (arama çubuğu, üst menüler, bannerlar, devasa footer bağlantıları) dikkati dağıtır ve sepeti terk etme (cart abandonment) oranını artırır. 

**Amaç:** Amazon, Trendyol, Apple Store gibi devlerin uyguladığı "Minimalist Checkout" konseptini sepet sayfasına uygulayarak kullanıcının tek bir hedefe odaklanmasını sağlamak: **Ödemeye Geç.**

## 2. Ne Kalacak, Ne Gidecek?

### Üst Alan (Header)
- ❌ **Kaldırılacaklar:** En üst bilgi barı (Premium markalar, WhatsApp vs.), Arama çubuğu, Kullanıcı hesabı ikonları (opsiyonel), Ana Menü (Ana Sayfa, Ürünler, İletişim), Mobildeki sticky navigasyon.
- ✅ **Kalacaklar:** Sadece Logo (güven ve marka için) ve Sepet İkonu + Ürün Sayısı (kullanıcının sepette kaç ürün olduğunu görebilmesi için).

### Alt Alan (Footer)
- ❌ **Kaldırılacaklar:** Bülten aboneliği formları, Bizi Takip Edin (Sosyal Medya ikonları), Tüm geniş Kurumsal menüler ve link listeleri.
- ✅ **Kalacaklar:** Minimalist, tek satırlık yasal ve güven veren linkler: İade Politikası | Gizlilik Sözleşmesi | İletişim | Güvenli Ödeme İkonları | Copyright yazısı.

## 3. Teknik Uygulama Yöntemi

Bu işlemin temanın diğer sayfalarını **kesinlikle bozmaması** gerekir. Sadece `/cart` sayfasında çalışması için CSS temelli gizleme (body class bazlı) veya Liquid koşulları (`{% if template == 'cart' %}`) kullanılacaktır.

### Adım 1: Body Template Sınıfı ile CSS Gizleme
`theme.liquid` dosyasında body etiketinde `template-cart` class'ı halihazırda bulunmaktadır. Özel bir CSS yazılarak gereksiz alanlar **sadece sepet sayfasında** gizlenecektir.
Örnek mantık:
```css
/* SADECE SEPET SAYFASINDA GİZLE */
.template-cart .top-nocification-bar,
.template-cart .header-navigation,
.template-cart .header-search,
.template-cart .mobile-bottom-menu { /* Mobil sticky menü */
  display: none !important;
}
```

### Adım 2: Minimalist Header Düzenlemesi
Gereksiz alanlar gizlendiğinde, Logo ve Sepet ikonunun düzgün hizalanması (örneğin logoyu ortalama, sepeti sağda tutma veya ikisini yan yana şık bir şekilde ortalama) için özel CSS düzenlemesi yapılacaktır.

### Adım 3: Footer Yönetimi
Mevcut büyük footer bloğunu CSS ile tamamen gizleyeceğiz (`.template-cart .footer-group { display: none; }`).
Bunun yerine `cart-section.liquid` dosyasının en altına sadece sepet sayfasında görünecek **"Minimalist Trust Footer"** bloğu (İade/Gizlilik linkleri + Kredi Kartı ikonları) eklenecektir.

### Adım 4: Boş Sepette Footer'ın Yukarı Kayması Sorunu
Bu sorun, sayfanın içerik boyutu kısa olduğunda alt alanın ekranın ortasına çıkması durumudur. `cart-section.liquid` ana kapsayıcısına CSS flexbox ve viewport height (vh) hesaplaması eklenerek, içerik boş olsa bile footer'ın her zaman ekranın en altında (bottom) durması sağlanacaktır. (Örn: `min-height: calc(100vh - header_height - footer_height);`)

---

## 4. Onay ve Açıklığa Kavuşturulması Gereken Açık Sorular (Q&A)

> [!IMPORTANT]
> Geliştirmeye başlamadan önce lütfen aşağıdaki konularda tercihinizi belirtin:

1. **Hesap (User/Profile) İkonu:** Sağ üstte Sepet ikonunun yanında bulunan hesap ikonunu da kaldıralım mı? (Genelde misafir alışverişini teşvik etmek için sadece sepet bırakılır, kullanıcı hesabı ödeme adımında sorulur).
2. **Minimal Footer İçeriği:** Yeni eklenecek tek satırlık minimalist footer'da tam olarak hangi linkler bulunsun? Önerim: `İade Politikası | Gizlilik Sözleşmesi | İletişim` + `Kredi Kartı Logoları`. Başka bir link isterseniz lütfen belirtin.
3. **Masaüstü Header Hizalaması:** Menüler ve arama kalktığında, Logoyu sayfanın tam ortasına alıp, Sepet ikonunu sağ tarafta bırakmak şık bir "Checkout" hissiyatı verir. Bu hizalama sizin için uygun mudur?
4. **Logonun Tıklanabilirliği:** Sepet sayfasında Logoya tıklandığında anasayfaya dönme işlevi aktif kalmalı mı? Yoksa kullanıcının sepetten kaçmasını tamamen engellemek adına link özelliğini pasif mi bırakalım? (Genelde anasayfaya dönüş aktif bırakılır ancak pek vurgulanmaz).

Cevaplarınıza göre kodlamaya başlayabiliriz.
