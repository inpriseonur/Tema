# Koleksiyon masaüstü banner denemesi — 24 Ekim 2026

Test teması: `tüm ürünler development`, ID `188839985197` (yayında değil).

## Değişiklik öncesi ölçümler

| Ekran genişliği | Görsel genişliği | Görsel yüksekliği | Banner–filtre satırı arası |
| --- | --- | --- | --- |
| 1440 px | 1290 px | 268,75 px | 0 px |
| 1920 px | 1370 px | 285,41 px | 0 px |

Test temasında görsel `%100` genişlikte, `height: auto`, `max-height: none`, yatay kenar boşluğu `0` idi.
Mobil üst banner gizliydi; ilk ürün satırı arasındaki güven görseli bu denemeye dahil değil.

## Deneme

Yalnızca 992 px ve üzerindeki ekranlarda üst görsel `%95` genişlikte ortalanır. Yüksekliği doğal oranla küçülür; kırpma yapılmaz.
Banner bulunan koleksiyonlarda filtre satırına `4 px` üst boşluk eklenir.

## Geri dönüş

`assets/collection.css` sonundaki `Desktop banner trial` yorumuyla başlayan medya bloğunu kaldırmak bu denemeyi geri alır; hızlı bağlantı ve filtre stilleri korunur.

Ek yerel yedek: `/tmp/primegurme-collection-banner-20261024/local-collection-before.css`.
Ölçüm kaydı: `/tmp/primegurme-collection-banner-20261024/measurements-before.json`.

Canlı temaya bu deneme kapsamında deploy yapılmaz.
