# Indirim Linki Yonlendirme Plani

## Problem Analizi

Shopify admininde bir indirim kodu icin paylasilabilir URL alindiginda link su formata benzer:

```text
https://primegurme.com/discount/PRIME5
```

Bu URL acildiginda Shopify indirimi musterinin tarayici/cart oturumuna kaydeder ve varsayilan hedef olarak ana sayfaya yonlendirebilir. Bu nedenle kullanici ana sayfaya gidiyor gibi gorunur, fakat indirim sonraki sepet/checkout akisinda otomatik uygulanir.

Bu davranis tema hatasi degildir; Shopify'in paylasilabilir indirim linki davranisidir.

## Hedef

Indirim linkine tiklayan kullanicinin ana sayfaya dusmesi yerine:

- Dogrudan sepete gitmesi, veya
- Once "Indirim sepetinize uygulandi" mesajini gormesi ve butonla sepetine gitmesi.

## Cozum Secenegi 1: Dogrudan Sepete Yonlendirme

En dusuk riskli cozum, Shopify'in destekledigi `redirect` parametresini kullanmaktir.

```text
https://primegurme.com/discount/PRIME5?redirect=/cart
```

Akis:

1. Musteri linke tiklar.
2. Shopify `PRIME5` indirimini musterinin oturumuna uygular.
3. Musteri `/cart` sayfasina yonlendirilir.
4. Sepette uygun urun ve kosullar varsa indirim checkout/cart akisinda uygulanir.

Bu secenek tema kodu degisikligi gerektirmez. Kampanya linklerinin bu formatta paylasilmasi yeterlidir.

## Cozum Secenegi 2: Ara Bilgilendirme Sayfasi

Daha kontrollu bir kampanya deneyimi icin indirim linki once ozel bir bilgilendirme sayfasina yonlendirilebilir.

```text
https://primegurme.com/discount/PRIME5?redirect=/pages/indirim-uygulandi
```

Bu sayfada kisa bir mesaj ve sepet butonu gosterilir:

```text
PRIME5 indirim kodunuz tanimlandi.
Uygun urunlerde ödeme adiminda uygulanacaktir.

Sepetime Git
```

Buton hedefi:

```text
/cart
```

Bu secenek icin tema tarafinda yeni bir sayfa template'i ve section eklenebilir.

Muhtemel dosyalar:

- `templates/page.indirim-uygulandi.json`
- `sections/discount-applied.liquid`
- Gerekirse mevcut uygun CSS asset dosyasi

## Cozum Secenegi 3: Urun Ekleyip Sepete Yonlendirme

Eger kampanya linki ayni zamanda belirli bir urunu sepete eklemeli ve indirim uygulamaliysa Shopify cart permalink yapisi kullanilabilir.

```text
https://primegurme.com/cart/VARIANT_ID:1?discount=PRIME5&storefront=true
```

Burada:

- `VARIANT_ID`, Shopify urun varyant ID'sidir; product ID degildir.
- `:1`, sepete eklenecek adet bilgisidir.
- `discount=PRIME5`, indirim kodunu uygular.
- `storefront=true`, kullaniciyi checkout yerine sepet sayfasina yonlendirmek icin kullanilir.

Bu secenek urun bazli kampanyalar icin uygundur, fakat her link icin dogru varyant ID kullanilmalidir.

## Risk Degerlendirmesi

- Indirim kodu aktif degilse link beklenen etkiyi vermez.
- Sepet bossa kullanici bos sepete yonlenebilir.
- Minimum sepet tutari, musteri segmenti veya urun/koleksiyon kosulu varsa indirim hemen gorunmeyebilir.
- Shopify'in oturuma kaydettigi indirim kodunu Liquid tarafinda her sayfada guvenilir sekilde okumak mumkun degildir.
- "Indirim uygulandi" metni kesin tutar vaadi vermemelidir; kosullu dil kullanilmalidir.
- Birden fazla indirim varsa kombinasyon davranisi Shopify indirim ayarlarina baglidir.

## Onerilen Uygulama

Kisa vadede kampanya linkleri su formatta paylasilmalidir:

```text
https://primegurme.com/discount/PRIME5?redirect=/cart
```

Daha profesyonel bir deneyim istenirse ikinci asamada ozel bir `indirim-uygulandi` sayfasi eklenmelidir.

## Kaynaklar

- Shopify Help Center - Managing and editing discounts: https://help.shopify.com/en/manual/discounts/managing-discounts
- Shopify Help Center - Cart permalinks: https://help.shopify.com/en/manual/checkout-settings/cart-permalink
- Shopify Developer Docs - Create cart permalinks: https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks
