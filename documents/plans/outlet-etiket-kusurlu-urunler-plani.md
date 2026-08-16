# Outlet Etiket Kusurlu Urunler Gelistirme Plani

## Amac

Bu dokumanin amaci, Prime Gurme'de kargo surecinde ayni koli icindeki kirilan siselerden akan su nedeniyle etiketi zarar gormus ama icerigi saglam ve orijinal olan cam sise urunlerin nasil satisa sunulacagini tarif etmektir.

Bu plan ileride bir AI ya da gelistiriciye verilip tema uzerinde kodlatilmak uzere hazirlanmistir. Bu nedenle yalnizca pazarlama metinlerini degil, urun konumlandirmasini, tema davranisini, metafield ihtiyaclarini ve riskleri de kapsar.

## Genel Degerlendirme

Etiketi zarar gormus ama urunun kendisi saglam olan San Pellegrino gibi cam sise urunleri satisa sunmak mantiklidir. Bu urunler normalde fire maliyeti olarak kenarda beklemektedir. Dogru konumlandirma ile fiyat hassasiyeti olan bireysel musterilere uygun fiyatli bir alternatif sunulabilir.

Ancak bu urunler ana urunlerle ayni algida satilmamalidir. Kullanici bu urunlerin neden indirimli oldugunu daha urun detayina girmeden anlayabilmelidir. Ana mesaj su olmalidir:

**Urun orijinal ve tuketime uygundur; yalnizca etiketinde kozmetik deformasyon vardir.**

## Konumlandirma

Bu urunler icin onerilen ana kategori/etiket dili:

- Outlet Urunler
- Etiket Kusurlu Urunler
- Uygun Fiyatli Outlet
- Kozmetik Kusurlu Urunler

En dengeli ana kullanim:

**Outlet Urunler**

Destekleyici aciklama:

**Etiket kusurlu, orijinal urunler**

"Hasarli urun", "kirik urun", "defolu urun" gibi ifadeler ana gorunumlerde kullanilmamalidir. Bu ifadeler premium algiyi zedeleyebilir ve urunun icinde sorun varmis gibi algilanabilir.

## Urun Adi Onerileri

Urun basliginda outlet durumu net gorunmelidir.

Onerilen formatlar:

- `San Pellegrino Soda 250 ml Cam Sise - Outlet Etiket Kusurlu`
- `San Pellegrino 250 ml Cam Sise - Etiket Kusurlu Outlet Urun`
- `San Pellegrino 250 ml Cam Sise Tek Sise - Etiket Kusurlu Outlet`

Urun tek sise olarak satilacaksa baslikta `Tek Sise` ifadesi kullanilmalidir.

## Urun Detay Sayfasi Deneyimi

Outlet urunler normal PDP deneyiminden ayrismalidir. Urune `outlet` etiketi veya ilgili metafield eklendiginde urun detay sayfasinda fiyat/CTA alanina yakin, kompakt ama dikkat ceken bir bilgilendirme blogu gosterilmelidir.

Onerilen blok basligi:

**Bu urun neden indirimli?**

Onerilen metin:

```text
Bu urun, kargo sirasinda ayni koli icerisindeki kirilan bir siseden akan su nedeniyle etiketinde kozmetik deformasyon olusmus orijinal San Pellegrino urunudur.

Urun orijinaldir.
Son kullanma tarihi normaldir.
Gazli yapisi korunmustur.
Iceriginde hicbir farklilik yoktur.
Yalnizca etiketi zarar gormustur.

Restoran ve kafeler icin etiket gorunumu onemli olabileceginden bu urun uygun fiyatla satisa sunulmaktadir.
```

UI tarafinda bu metin uzun gorunurse madde isaretli, kompakt bir kart icinde gosterilmelidir:

- Orijinal urun
- SKT normal
- Icerik ayni
- Gazli yapi korunmus
- Yalnizca etiket kusuru

## Urun Karti Deneyimi

Koleksiyon ve urun listeleme kartlarinda uzun aciklama verilmemelidir. Bunun yerine kisa bir rozet yeterlidir:

- Outlet
- Etiket Kusurlu
- Uygun Fiyat

Rozet urunun indirim rozetleriyle karismayacak sekilde tasarlanmalidir. Renk olarak koyu lacivert/altin veya daha notr bir premium ton tercih edilmeli, cok agresif kirmizi kullanilmamalidir.

## Gorsel Sunum

Gorsellerde urunun gercek durumu saklanmamalidir. Sadece temiz stok gorseli kullanmak guven sorunu yaratabilir.

Onerilen gorsel sirasi:

1. Urunun genel gorunumu
2. Etiket kusurunu gosteren yakin plan
3. "Yalnizca etiket kusuru, urun orijinaldir" mesajli sade bilgilendirici gorsel

Ana urun gorselinde etiket kusuru gorulebilir olmalidir. Kullanici urunu satin almadan once ne aldigini net anlamalidir.

## Fiyatlandirma

Normal urunlere gore yaklasik `%30-35` daha uygun fiyat mantiklidir.

Dikkat edilmesi gerekenler:

- Indirim cok dusuk kalirsa outlet algisi zayiflar.
- Indirim cok yuksek olursa urunde ciddi sorun var algisi olusabilir.
- Tek sise satilacagi icin koli fiyatlariyla karsilastirma kafa karistirmamalidir.

## Teknik Plan

Outlet davranisini kontrol etmek icin urun etiketi veya metafield kullanilabilir.

Basit baslangic icin:

- Urune `outlet` tag'i eklenir.
- Tema, bu tag'i gordugunde outlet rozetini ve PDP bilgi blogunu gosterir.

Daha kontrollu yapi icin metafield onerisi:

- `custom.outlet_product`: boolean
- `custom.outlet_reason_title`: single line text
- `custom.outlet_reason_text`: multi-line text
- `custom.outlet_condition_badges`: list veya JSON

Tema davranisi:

- `custom.outlet_product == true` ise PDP'de outlet bilgi blogu gosterilir.
- Urun kartinda outlet rozeti gosterilir.
- Normal urunlerde hicbir gorunum degisikligi olmaz.
- Sepet satirinda gerekirse varyant/urun basliginin altinda kisa `Outlet - etiket kusurlu` notu gosterilebilir.

## SEO Degerlendirmesi

Bu urunler surekli ve duzenli bir outlet kategorisi olarak satilacaksa indexlenebilir.

Stoklar gecici, az adetli ve hizli tukeniyorsa noindex degerlendirilebilir. Ancak ilk etapta urunlerin organik trafik almasi isteniyorsa index acik kalabilir.

Ana urun sayfalarindan outlet urunlere agresif link verilmemelidir. Ana urunun premium algisini bozmadan, kontrollu bir baglanti kullanilabilir:

**Uygun fiyatli outlet secenekleri**

## Marka Algisi Riskleri

Riskler:

- Kullanici urunu normal urun sanabilir.
- Restoran/kafe musterisi etiket kusurunu sonradan fark edip memnuniyetsizlik yasayabilir.
- Ana urunlerin premium algisi zedelenebilir.

Azaltma yollari:

- Urun adinda outlet/etiket kusuru net yazilmali.
- Urun detayinda neden indirimli oldugu aciklanmali.
- Gercek etiket kusurunu gosteren gorseller kullanilmali.
- Sepet veya urun kartinda kisa rozet gosterilmeli.

## Ilk Faz Uygulama Plani

1. `Outlet Urunler` koleksiyonu olustur.
2. San Pellegrino 250 ml ve 750 ml icin sinirli sayida outlet urun ekle.
3. Urunlere `outlet` tag'i veya outlet metafield'i ekle.
4. Urun kartinda outlet rozeti goster.
5. Urun detayinda "Bu urun neden indirimli?" bilgi blogunu goster.
6. Gercek etiket kusurlu urun gorselleri yukle.
7. 2-3 hafta satis, iade, WhatsApp soru ve musteri geri bildirimlerini takip et.
8. Sonuclar olumluysa menude `Outlet Urunler` daha gorunur hale getir.

## Basari Kriterleri

- Outlet urunler fire maliyetini azaltmali.
- Musteri urunu yanlis anlamamali.
- Iade/sikayet orani dusuk kalmali.
- Ana San Pellegrino urunlerinin premium algisi zarar gormemeli.
- Urun detayindaki aciklama WhatsApp destek sorularini azaltmali.

## Sonuc

Bu urunleri satisa sunmak dogru bir ticari firsat olabilir. Kritik nokta, urunu "hasarli" gibi gostermek degil, "etiketinde kozmetik kusur olan orijinal outlet urun" olarak konumlandirmaktir.

Gelistirme minimum riskle baslamali, once az sayida urunle test edilmeli ve musteri davranisi gozlemlenmelidir.
