# iOS Mobil Ürün Kartı ve Video Tıklama Analizi

## Problem Analizi

iPhone 14 Pro üzerinde iki mobil davranış sorunu gözlemlendi:

- Ürün listeleme sayfalarında ürün görseline dokunulduğunda ürün detay sayfasına geçiş çoğu zaman çalışmıyor veya birkaç deneme gerektiriyor.
- Ürün detay sayfasındaki galeri içindeki video açıldığında play butonuna basmak videoyu başlatmıyor; video ancak seek bar ile ileri alındıktan sonra tekrar play yapıldığında oynuyor.

Android/Samsung cihazda aynı sorun daha az görülüyor. Bu fark, iOS Safari'nin hover, touch, medya oynatma ve carousel içi tıklama davranışlarının Chrome/Android'e göre daha hassas olmasından kaynaklanabilir.

## Ürün Listeleme Tıklama Sorunu

Ürün kartlarında ikinci görsel hover efekti için `.img2` markup'ı basılıyor:

- `snippets/product-grid-item.liquid`
- `snippets/product-list-item.liquid`
- `sections/search-ajax.liquid`

İlgili koşul:

```liquid
{%- if settings.enable_hover_product and product.media[1] != blank -%}
  <div class="img2">
```

CSS tarafında ikinci görsel başlangıçta gizli:

```css
.single-product-wrap .product-image a.pro-img .img2 {
  opacity: 0;
  position: absolute;
}
```

Hover sırasında görünür yapılıyor:

```css
.single-product-wrap .product-image:hover a.pro-img .img2 {
  opacity: 1;
}
```

iOS Safari dokunma sırasında `:hover` state'ini gerçek mouse hover gibi geçici veya kalıcı şekilde tetikleyebilir. Bu durumda ilk dokunuş link navigasyonu yerine hover state'ini aktive edebilir. İkinci görsel opacity transition ile üst katmana geldiği için ürün görseline yapılan tap davranışı güvenilmez hale gelebilir.

Bu nedenle ürün listeleme sorununun en güçlü adayı mobilde aktif kalan hover ikinci görsel davranışıdır.

## Ürün Detay Video Sorunu

Ürün detay galerisinde video doğrudan DOM'da aktif video olarak değil, deferred yapı ile `<template>` içinde tutuluyor:

- `snippets/media.liquid`

Video markup'ı:

```liquid
{{ media | video_tag: class: 'media-video', controls: true, preload: 'none', playsinline: true }}
```

Poster butonuna basıldığında `sections/product-template.liquid` içinde template klonlanıyor ve ardından video otomatik oynatılmaya çalışılıyor:

```js
player.appendChild(template.content.cloneNode(true));
media.classList.add('is-loaded');

var video = player.querySelector('video');
if (video) {
  video.muted = true;
  video.defaultMuted = true;
  var playPromise = video.play();
  if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(function() {});
}
```

iOS Safari açısından riskli noktalar:

- Video `preload: 'none'` ile geliyor; DOM'a yeni eklendiği anda metadata hazır olmayabilir.
- Video eklendikten hemen sonra `play()` çağrılıyor.
- `play()` başarısız olursa hata sessizce yutuluyor, kullanıcıya fallback davranış verilmiyor.
- Paketleme video CTA'sı varsa `playButton.click()` sentetik click kullanıyor; iOS bunu her zaman gerçek kullanıcı gesture olarak kabul etmeyebilir.
- Video, Swiper galeri slide'ı içinde bulunuyor. Swiper'ın touch/click prevention davranışı native video kontrolleriyle çakışabilir.

Seek bar ile ileri alındıktan sonra videonun çalışması, videonun ancak kullanıcı medya zaman çizelgesiyle etkileşime girince yüklenebilir/oynatılabilir hale geldiğini düşündürüyor.

## Önerilen Çözüm

### 1. Mobilde ürün kartı hover ikinci görselini devre dışı bırak

Tema ayarı kapatılmadan, yalnızca touch cihazlarda hover görseli bastırılmalı.

Önerilen yaklaşım:

- Desktop mouse cihazlarında mevcut hover efekti korunur.
- Touch/coarse pointer cihazlarda `.img2` görünmez kalır.
- `.img2` mobilde pointer event almaz.

Muhtemel CSS stratejisi:

```css
@media (hover: none), (pointer: coarse) {
  .single-product-wrap .product-image a.pro-img .img2,
  .single-product-wrap .product-image:hover a.pro-img .img2 {
    opacity: 0 !important;
    pointer-events: none;
  }
}
```

Daha yapısal alternatif:

- Mevcut hover kuralı sadece `@media (hover: hover) and (pointer: fine)` içine alınabilir.
- Bu daha temizdir ancak mevcut CSS bloğunu düzenlemeyi gerektirir.
- En küçük güvenli değişiklik override eklemektir.

### 2. Video deferred oynatma akışını iOS'a uyumlu hale getir

Video template'ten klonlandıktan sonra iOS için daha kontrollü bir başlatma akışı kullanılmalı.

Önerilen yön:

- Video DOM'a eklendikten sonra `video.load()` çağrılabilir.
- `play()` başarısız olursa hata sessizce yutulmamalı; video native kontrolleri görünür ve kullanıcı başlatabilir durumda kalmalı.
- Paketleme video CTA'sındaki sentetik `playButton.click()` yerine doğrudan aynı video yükleme fonksiyonunu çağıran ortak fonksiyon kullanılmalı.
- Video slide içinde Swiper'ın video kontrollerine müdahalesi azaltılmalı.

### 3. Swiper ve video etkileşimini ayır

Video içeren medya container'ına Swiper no-swipe sınıfı veya eşdeğer ayar verilebilir.

Muhtemel yönler:

- Video wrapper'a `swiper-no-swiping` sınıfı eklemek.
- Swiper ayarında `noSwiping: true` ve uygun `noSwipingClass` kullanmak.
- Video oynarken ilgili galeri instance'ında swipe geçici olarak kapatmak.

Bu değişiklik video kontrol tıklamalarının Swiper tarafından swipe/click prevention olarak yorumlanma riskini azaltır.

## Etkilenecek Dosyalar

Muhtemel dosyalar:

- `assets/style.css`
- `sections/product-template.liquid`
- `snippets/media.liquid`

Ürün listeleme tıklama sorunu büyük ihtimalle sadece `assets/style.css` ile çözülebilir.

Video sorunu için `sections/product-template.liquid` içindeki deferred media JS'i ve gerekirse `snippets/media.liquid` markup'ı güncellenmelidir.

## Risk Değerlendirmesi

Ürün kartı hover düzeltmesi düşük risklidir:

- Desktop hover ikinci görsel davranışı korunabilir.
- Mobilde yalnızca sorun çıkaran hover state bastırılır.
- Koleksiyon, ana sayfa ürün slider'ları, ilgili ürünler ve arama sonuçları aynı kart yapısını kullandığı için mobil genelinde olumlu etki beklenir.

Video düzeltmesi orta risklidir:

- Ürün galerisi, paketleme video CTA'sı, Swiper, Shopify video markup'ı ve native iOS medya politikaları birlikte çalışır.
- Playwright mobil emülasyonu iOS Safari medya davranışını birebir yakalamaz.
- Gerçek iPhone Safari veya BrowserStack/LambdaTest gibi gerçek iOS Safari ortamında doğrulama gerekir.

## Test Planı

Canlı `https://primegurme.com` üzerinde test yapılmamalıdır.

Preview URL ile önerilen kontroller:

```powershell
$env:BASE_URL="https://example.shopifypreview.com"
npm run test:mobile
npm run test:smoke
```

Manuel gerçek cihaz kontrolleri:

- iPhone Safari'de koleksiyon sayfasında ürün görseline tek tap ile ürün detayına gidiliyor mu?
- Ürün kartında ikinci görsel mobilde tap sırasında görünmeye çalışıyor mu?
- Ürün detay galerisinde video slide'ı açılınca poster play butonu videoyu başlatıyor mu?
- Paketleme video CTA'sı videoya geçip oynatma başlatıyor veya en azından native video kontrollerini çalışır halde bırakıyor mu?
- Video oynarken/sonrasında galeri swipe davranışı bozuluyor mu?

## Uygulama Notu

İlk fix küçük tutulmalı:

1. Önce mobil ürün kartı hover davranışı CSS ile kapatılmalı.
2. Preview ve iPhone Safari ile ürün listeleme tıklaması doğrulanmalı.
3. Ardından video deferred play akışı ayrı commit/değişiklik olarak ele alınmalı.

Bu sıralama iki farklı sorunun etkisini karıştırmadan doğrulama yapmayı kolaylaştırır.
