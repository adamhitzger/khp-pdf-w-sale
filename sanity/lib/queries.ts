"server-only"

import { groq } from "next-sanity";

export const IG_FEED = groq`*[_type == 'igFeed' && defined(img.asset)] | order(_createdAt desc){
    _id,
    url,
    "img":img.asset->url,
}`

/**
 * Snímky horizontální galerie na homepage. `photo` je záběr na šířku (desktop),
 * `mobilePhoto` verze na výšku — když ve Studiu chybí, `lib/banner-photos.ts`
 * spadne zpět na desktopovou fotku.
 */
export const BANNER_PHOTOS = groq`*[_type == 'bannerPhotos'][0]{
    "photosUrl": photos[]{
        "src": photo.asset->url,
        "mobileSrc": mobilePhoto.asset->url,
        alt,
        cjText,
        deText,
        skText
    }
}`

export const EMPLOYEES = groq`*[_type == 'employee']{
    name,
    pos,
    email,
    tel,
    "img": image.asset->url
}`

export const FINISHED_WORK = groq`*[_type == 'finishedWork']{
        _id,
        place,
        "photosUrl": photos[].asset->url
    }`
    export const COUNT_ALL_PRODUCTS = groq`count(*[_type == 'product'])`;
    export const COUNT_FILTERED_PRODUCTS = groq`count(*[_type == 'product' && cat == $filter])`;
    export const PRODUCTS_MAIN_PAGE = groq`*[_type == 'product'][0..7]{
        nameCs,
        nameDe,
        nameSk,
        popisCs,
        popisDe,
        popisSk,
        parametry[]{
            pCs,
            pDe,
            pSk,
            csValue,
            deValue,
            skValue
        },
        "photosUrl": photos[].asset->url
    }`

    export const PRODUCT_PHOTOS_BY_CAT = groq`*[_type == 'productPhotos' && cat == $filter]{
    "banner": photo.asset->url,
    nameCs,
        nameDe,
        nameSk,
        popisCs,
    popisDe,
    popisSk,
    "okSUrl":okS[].asset->url,
    "okKUrl":okK[].asset->url,
    "okKMUrl":okKM[].asset->url,
    "p60Url":p60[].asset->url,
    "p90Url":p90[].asset->url,
    "p120Url":p120[].asset->url,
    "p150Url":p150[].asset->url,
  "tyckaUrl":tycka[].asset->url,
  "vlKomUrl":vlKom[].asset->url,
  "drevodekor": drevodekor[].asset->url,
  "tahokov": tahokov[].asset->url

    }`


    export const GET_ARTICLE_SLUG = groq`*[_type == "article" && slug.current == $slug][0] {
    _id,
    heading,
    headingSk,
    headingDe,
    slug,
    datum,
    image,
    description,
    descriptionSk,
    descriptionDe,
    content,
    contentSk,
    contentDe
  }`
    export const GET_ARTICLES = groq`*[_type == 'article'] | order(datum desc) [$start..$end] {
      _id,
      heading,
      headingSk,
      headingDe,
      slug,
      datum,
      image,
      description,
      descriptionSk,
      descriptionDe

    }`;

   export const  TOTAL_ARTICLES = groq`count(*[_type == "article"])`

    export const PRODUCTS = groq`*[_type == 'product'][$start..$end]{
        nameCs,
        nameDe,
        popisCs,
        popisDe,
        parametry[]{
            pCs,
            pDe,
            csValue,
            deValue
        },
        "photosUrl": photos[].asset->url,
        cat
    }`

    export const FILTERED_PRODUCTS = groq`*[_type == 'product'][$start..$end]{
        nameCs,
        nameDe,
        popisCs,
        popisDe,
        parametry[]{
            pCs,
            pDe,
            csValue,
            deValue
        },
        "photosUrl": photos[].asset->url,
    }`

    export const CONF_IMGS_QUERY = groq`*[_type == "confPhotos"][0]{
  "jednokridla": jednokridla[].asset->url,
  "dvoukridla": dvoukridla[].asset->url,
  "samonosna": samonosna[].asset->url,
  "poKolejnici": poKolejnici[].asset->url,
  "telPoj": telPoj[].asset->url,
  "telSam": telSam[].asset->url,
  "atypicka": atypicka[].asset->url,
  "sikma": sikma[].asset->url,
  "skladaci": skladaci[].asset->url,
  "sekcni": sekcni[].asset->url,
  "branka": branka[].asset->url,
  "ploty": ploty[].asset->url,
}`;

  // Zábradlí sdílí ilustrační fotky s plotovými dílci (`ploty`) — vlastní pole
  // v `confPhotos` nemá a e-mail z něj bere jen jednu úvodní fotku.
  export const ZAB_IMGS_QUERY = groq`*[_type == "confPhotos"][0]{
  "zabradli": ploty[].asset->url,
}`;

   export const PERG_IMGS_QUERY = groq`*[_type == "confPhotos"][0]{
  "bioklimaticka": bioklimaticka[].asset->url,
  "zahrada": zahrada[].asset->url,
  "pristresek": pristresek[].asset->url,
}`;

// Reálné fotky realizací pro galerii v konfigurátoru žijí v `productPhotos` — jeden
// dokument na konkrétní produkt (spárovaný přes `nameCs`, viz lib/product-photos.ts),
// s fotkami rozdělenými po jednotlivých motivech. Nesouvisí s CONF_IMGS_QUERY/PERG_IMGS_QUERY
// výše, které pořád krmí e-maily/xlsx (lib/actions.ts, ConfMail, PergMail) beze změny.
// `[0..4]` = strop 5 fotek na motiv. Bez něj query tahá i 60+ URL na jeden produkt
// (Plotové dílce, Branka), což jsou data, která galerie stejně nikdy nezobrazí najednou.
// Zvednutí stropu = změna tohohle jednoho rozsahu na všech polích.
export const PRODUCT_PHOTOS_QUERY = groq`*[_type == "productPhotos"]{
  cat,
  nameCs,
  nameSk,
  nameDe,
  popisCs,
  popisSk,
  popisDe,
  "banner": photo.asset->url,
  "okS": okS[0..4].asset->url,
  "okK": okK[0..4].asset->url,
  "okKM": okKM[0..4].asset->url,
  "p60": p60[0..4].asset->url,
  "p90": p90[0..4].asset->url,
  "p120": p120[0..4].asset->url,
  "p150": p150[0..4].asset->url,
  "tycka": tycka[0..4].asset->url,
  "vlKom": vlKom[0..4].asset->url,
  "drevodekor": drevodekor[0..4].asset->url,
  "tahokov": tahokov[0..4].asset->url,
  "sklo": sklo[0..4].asset->url
}`;

/**
 * Fotky realizací pro /realizace. Oproti PRODUCT_PHOTOS_QUERY (galerie v konfigurátoru)
 * bere víc fotek na motiv — stránka realizací je právě ta, kde je má smysl ukázat všechny —
 * a navíc pole, která konfigurátor nepotřebuje: `sklo` a `lamela` (zábradlí, pergoly)
 * a `vypalovani`. Filtrování na kategorie a slepení do skupin řeší lib/realizace.ts.
 */
export const REALIZACE_QUERY = groq`*[_type == "productPhotos" && defined(cat)]{
  _id,
  cat,
  nameCs,
  nameSk,
  nameDe,
  "banner": photo.asset->url,
  "okS": okS[].asset->url,
  "okK": okK[].asset->url,
  "okKM": okKM[].asset->url,
  "p60": p60[].asset->url,
  "p90": p90[].asset->url,
  "p120": p120[].asset->url,
  "p150": p150[].asset->url,
  "tycka": tycka[].asset->url,
  "vlKom": vlKom[].asset->url,
  "drevodekor": drevodekor[].asset->url,
  "tahokov": tahokov[].asset->url,
  "lamela": lamela[].asset->url,
  "vypalovani": vypalovani[].asset->url,
  "sklo": sklo[].asset->url
}`

/**
 * Lehká varianta REALIZACE_QUERY pro upoutávku na homepage — jen úvodní fotka
 * (`photo`) a kategorie, žádné motivy. Celý REALIZACE_QUERY by na homepage tahal
 * 170+ URL, ze kterých se zobrazí tři.
 */
export const REALIZACE_BANNERS_QUERY = groq`*[_type == "productPhotos" && defined(cat) && defined(photo.asset)]{
  _id,
  cat,
  nameCs,
  nameSk,
  nameDe,
  "banner": photo.asset->url
}`

   export const STEPS_QUERY = groq`*[_type == "steps"][0]{
  steps[]{
    "photos": photos[].asset->url,
    skHeading,
    skText,
    njHeading,
    njText,
    cjHeading,
    cjText,
  }| order(poradi asc)
}`;

 export const SECTION_QUERY = groq`*[_type == "sections"][0]{
    "oploceni": oploceni.asset->url,
     "pergola": pergola.asset->url,
      "ploty": ploty.asset->url,
       "pergoly": pergoly.asset->url,
}`;

/**
 * Certifikáty a patenty pro /o-nas. `cert` je Sanity `file`, takže se rozbaluje
 * přes `cert.asset->` — z assetu potřebujeme URL ke stažení a `originalFilename`
 * jako záložní název, když v dokumentu není vyplněný `titleCs`.
 * `size` je v bajtech, převod na MB řeší frontend.
 */
export const CERTIFICATES_QUERY = groq`*[_type == "certificate" && defined(cert.asset)] | order(coalesce(poradi, 999) asc, _createdAt asc){
  _id,
  titleCs,
  titleSk,
  titleDe,
  noteCs,
  noteSk,
  noteDe,
  "url": cert.asset->url,
  "fileName": cert.asset->originalFilename,
  "ext": cert.asset->extension,
  "size": cert.asset->size
}`

// Nejnovější recenze první. Bez `order()` je pořadí dané `_id`, takže nově přidané
// hodnocení by skončilo někde uprostřed marquee.
export const REVIEWS_QUERY = groq`*[_type == "reviews"] | order(_createdAt desc){
    _id,
    author_name,
    author_url,
    text,
    skText,
    njText,
    rating,
    "image": img.asset->url,
}`
