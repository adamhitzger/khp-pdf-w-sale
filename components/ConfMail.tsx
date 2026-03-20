import { ConfiguratorType } from "@/lib/conf-schema";
import { Body, Container, Head, Html, Img, Preview, Section, Text, Hr, Heading } from "@react-email/components"
  
export interface ConfPhotos {
  jednokridla: string[];
  dvoukridla: string[];
  samonosna: string[];
  poKolejnici: string[];
  telPoj: string[];
  telSam: string[];
  atypicka: string[];
  sikma: string[];
  skladaci: string[];
  sekcni: string[];
  branka: string[];
  ploty: string[];
  pristresek: string[];
  bioklimaticka: string[];
  zahrada: string[];
}

export interface KonstantaHPEmailProps {
  userName: string
  userEmail: string
  tel: string;
  address: string,
  city: string,
  photos: ConfPhotos
  data: ConfiguratorType 
  zip: string,
  msg?: string,
  company?: string,

}

export const ConfMail = ({
  userName,
  userEmail,
  tel,
  address,
  city,
  msg,
  company,
  photos,
  data,
  zip
}: KonstantaHPEmailProps) => (
    <Html>
    <Head />
    <Preview>Děkujeme za vytvoření konfigurace s Konstanta HP</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
       <Img
            src="https://cdn.sanity.io/files/a3wdqcta/production/28aefe7de25e70f91a0f788514e80d75bfd41b40.svg"
            width="280"
            height="280"
            alt="Logo Konstanta HP"
            style={image}
          />

        {/* Thank you message */}
        <Text style={text}>Vážený/á {userName},</Text>
        <Text style={text}>
          Děkujeme, že jste si vybrali Konstanta HP pro vytvoření vaší konfigurace! Jsme potěšeni, že vás můžeme přivítat mezi našimi váženými zákazníky. Vaše důvěra v naše produkty a služby pro nás znamená vše a zavazujeme se poskytnout vám zážitek nejvyšší kvality.
        </Text>
        <Text style={text}>
          Vaše konfigurace byla přijata a je zpracovávána s maximální péčí. Cenovou kalkulaci naleznete v přiloženém souboru. Vážíme si vašeho zájmu a těšíme se na další spolupráci.
        </Text>

        {/* Images Section */}
        <Section style={imageSection}>
          {!data.jednokridla && photos.jednokridla != null &&
                   <Img
                            src={photos.jednokridla[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
                    {!data.dvoukridla && photos.dvoukridla != null &&
                   <Img
                            src={photos.dvoukridla[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
                    {!data.samonosna && photos.samonosna != null &&
                   <Img
                            src={photos.samonosna[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
                    {!data.posuvna && photos.poKolejnici != null &&
                   <Img
                            src={photos.poKolejnici[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
                    {!data.telPoj && photos.telPoj != null &&
                   <Img
                            src={photos.telPoj[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
                   {!data.telSam && photos.telSam != null &&
                   <Img
                            src={photos.telSam[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
                   {!data.atypicka && photos.atypicka != null &&
                   <Img
                            src={photos.atypicka[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
                   {!data.sikma && photos.sikma != null &&
                   <Img
                            src={photos.sikma[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
                   {!data.sekcni && photos.sekcni != null &&
                   <Img
                            src={photos.sekcni[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
                   {!data.skladaci && photos.skladaci != null &&
                   <Img
                            src={photos.skladaci[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
                    {!data.branka && photos.branka != null &&
                   <Img
                            src={photos.branka[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
                    {!data.dilce && photos.ploty != null &&
                   <Img
                            src={photos.ploty[0]}
                            width="280"
                            height="280"
                            alt="Logo Konstanta HP"
                            style={image}
                          />
                  }
        </Section>

        <Hr style={hr} />

        {/* Company Information */}
        <Section style={infoSection}>
          <Heading style={h2}>Informace o společnosti</Heading>
          <Text style={infoText}>
            <strong>Konstanta HP</strong>
            <br />
            Maleč 36, 582 76 Maleč
            <br />
            Česká republika
            <br />
            IČO: 21827150
            <br/>
            Telefon: +420 770 169 411
            <br />
            Email: Sleekfence@seznam.cz
            <br />
            Web: www.konstantahp.cz
          </Text>
        </Section>

        <Hr style={hr} />

        {/* User Information */}
        <Section style={infoSection}>
          <Heading style={h2}>Vaše informace</Heading>
          <Text style={infoText}>
            <strong>Celé jméno zákazníka:</strong> {userName}
            <br />
            <strong>Email:</strong> {userEmail}
            <br />
            <strong>Telefonní číslo:</strong> {tel}
            <br />
            <strong>Adresa:</strong> {address}, {city} {zip}
            <br />
            {company && <><strong>Firma: </strong>{company}</>}
            <br />
            {msg&& <><strong>Zpráva:</strong> {msg}</>}
            <br />
            <strong>Datum:</strong> {new Date().toLocaleDateString('cs-CZ')}
          </Text>
        </Section>

        {/* Footer */}
        <Text style={footer}>
          Pokud máte jakékoli dotazy nebo připomínky, neváhejte kontaktovat náš tým zákaznické podpory. Jsme tu, abychom vám pomohli!
        </Text>

        <Text style={footerSmall}>© {new Date().getFullYear()} Konstanta HP. Všechna práva vyhrazena.</Text>
      </Container>
    </Body>
</Html>
)

export default ConfMail

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
}

const h2 = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "20px 0 10px",
}

const text = {
  color: "#484848",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  padding: "0 40px",
}

const imageSection = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  margin: "32px 0",
  padding: "0 40px",
  gap: "20px",
}

const image = {
  borderRadius: "8px",
  border: "1px solid #e6e6e6",
  display: "block", // Zajistí, že každý obrázek je na novém řádku
  margin: "20px auto",
}

const infoSection = {
  padding: "0 40px",
  margin: "20px 0",
}

const infoText = {
  color: "#484848",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
}

const hr = {
  borderColor: "#e6e6e6",
  margin: "32px 40px",
}

const footer = {
  color: "#898989",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "32px 0 16px",
  padding: "0 40px",
  textAlign: "center" as const,
}

const footerSmall = {
  color: "#b3b3b3",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0",
  padding: "0 40px",
  textAlign: "center" as const,
}
