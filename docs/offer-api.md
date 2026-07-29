# Offer API — jaa tarjoukset CRM:stä

Endpoint, johon voit lähettää CRM-datan ja saada takaisin viimeistellyn,
jaettavan tarjouksen. Ajatuksena yhdistää CRM + tämä sivu: CRM (tai esim. n8n)
POSTaa liidin tiedot, endpoint kirjoittaa tarjouksen ja palauttaa jakolinkin.

## Miten se toimii

1. **`POST /api/offers`** — lähetä liidin/asiakkaan tiedot JSONina.
2. Endpoint kirjoittaa tarjouksen:
   - Jos `ANTHROPIC_API_KEY` on asetettu, **Claude** (malli `claude-opus-5`)
     kirjoittaa räätälöidyn tarjouksen.
   - Muuten käytetään laadukasta **deterministististä pohjaa** — toimii ilman
     salaisuuksia ja on testattu.
3. Vastaus sisältää tarjouksen JSONina, valmiin **markdownin** ja **jakolinkin**.
4. Tarjous on tilaton: koko tarjous on pakattu linkin `#`-tokeniin, joten
   **tietokantaa ei tarvita**. Sivu `/tarjous` purkaa tokenin selaimessa.

## Pyyntö

```bash
curl -X POST https://<sivusi>/api/offers \
  -H 'Content-Type: application/json' \
  -d '{
    "company": "Acme Oy",
    "contactName": "Liisa Virtanen",
    "contactEmail": "liisa@acme.fi",
    "industry": "Verkkokauppa",
    "services": ["asiakaspalvelun chatbot", "tilausautomaatio"],
    "painPoints": ["hidas asiakaspalvelu", "manuaalinen tilausten käsittely"],
    "goals": ["säästää 10h viikossa"],
    "budget": "5 000–10 000 €",
    "timeline": "aloitus elokuussa",
    "language": "fi"
  }'
```

### Kentät

Kaikki kentät ovat valinnaisia — endpoint täydentää puuttuvat. CRM-kenttien
yleisiä nimiä tunnistetaan automaattisesti, esimerkiksi:

| Kanoninen      | Tunnistetut aliakset                                             |
| -------------- | --------------------------------------------------------------- |
| `company`      | `companyName`, `organization`, `account`, `customer`, `client`  |
| `contactName`  | `contact`, `name`, `fullName`, `person`                         |
| `contactEmail` | `email`, `mail`                                                 |
| `industry`     | `sector`, `vertical`                                            |
| `services`     | `service`, `products`, `needs`, `interests`                     |
| `painPoints`   | `pains`, `challenges`, `problems`                              |
| `goals`        | `objectives`, `targets`, `outcomes`                            |
| `budget`       | `budgetRange`, `priceRange`                                     |
| `timeline`     | `deadline`, `timeframe`, `schedule`                            |
| `notes`        | `description`, `message`, `details`, `context`                 |
| `language`     | `lang`, `locale` (`fi` oletus, `en` tuettu)                    |

Listakentät (`services`, `painPoints`, `goals`) hyväksyvät sekä taulukon että
pilkuin/rivinvaihdoin erotellun merkkijonon. Lähettäjän voi ohittaa `from`- tai
`sender`-objektilla (`{ "name", "title", "email" }`); oletuksena Sami Kiias.

## Vastaus

```jsonc
{
  "offer":    { /* koko tarjous rakenteisena */ },
  "token":    "eyJpZCI6...",              // base64url, tarjous pakattuna
  "shareUrl": "https://<sivusi>/tarjous#eyJpZCI6...",
  "markdown": "# Tarjous – Acme Oy\n\n..."  // valmis kopioitavaksi
}
```

Jaa `shareUrl` asiakkaalle — se avaa tarjouksen sivuston tyylillä.

### Tarjouksen rakenne

`offer` on **vaiheistettu ehdotus** (kuten oikea konsulttitarjous), kentät:
`summary` (tilanteen tiivistys), `situation[]` (nimetyt ongelmat), `approach`
(lähestymistavan kehystys), `phases[]` (Vaihe 0 määrittely → toteutusvaiheet,
kukin oma `goal`/`includes[]`/`outcome`/`duration`/`price`), valinnainen
`tradeoffs[]` ("miten se rakennetaan" -taulukko: `choice`/`why`/`alternative`),
`investment` (`summary`/`total`/`paymentTerms`/`note`), `scope`
(`excludes[]` + `ownership`), `nextSteps[]`, `cta`, `validUntil`, `sender`.
Vaiheiden määrä skaalautuu kaupan kokoon — pieni toimeksianto voi olla yksi vaihe.

## Muut reitit

- **`GET /api/offers?token=<token>`** — purkaa jakotokenin takaisin JSONiksi
  (palauttaa `{ offer, markdown }`). Väärä token → `400`.

## Ympäristömuuttujat

| Muuttuja            | Vaikutus                                                        |
| ------------------- | -------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | Kytkee päälle Clauden kirjoittaman tarjouksen. Ilman → pohja.  |
| `OFFER_MODEL`       | Yliajaa mallin (oletus `claude-opus-5`).                       |
| `OFFER_API_KEY`     | Jos asetettu, POST vaatii `Authorization: Bearer <key>` tai `x-api-key`. |

## CRM- / n8n-integraatio

n8n:ssä lisää **HTTP Request** -node:
- Method `POST`, URL `https://<sivusi>/api/offers`
- Body: JSON, mäppää CRM-kentät yllä olevaan muotoon
- Jos `OFFER_API_KEY` käytössä, lisää header `Authorization: Bearer <key>`

Ota vastauksesta `shareUrl` ja lähetä se liidille (esim. sähköpostinode).

## Paikallinen kehitys

`npm run dev` tarjoilee `/api/offers`-reitin Vite-middlewaren kautta (sama
logiikka kuin tuotannon Vercel-funktiossa), joten ominaisuutta voi testata
ilman `vercel dev`iä. Aseta `ANTHROPIC_API_KEY` `.env`-tiedostoon jos haluat
Clauden kirjoittaman version paikallisesti.
