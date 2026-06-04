# Blogin kirjoittaminen Obsidianissa (repo omana vaultinaan)

Tämä repo toimii omana Obsidian-vaultinaan. Blogipostaukset ovat tavallisia
markdown-tiedostoja kansiossa `src/content/blog/`. Tiedoston nimi määrää
URL-slugin: `oma-postaus.md` → `/blog/oma-postaus`.

## Kertasetup

1. **Avaa repo vaultiksi.** Obsidian → "Open folder as vault" → valitse tämän
   repon juuri (`portfolio/`). Tämä on erillinen vault olemassa olevan rinnalla;
   vaihdat niiden välillä vasemman alakulman vault-valitsimesta.
2. **Asenna Obsidian Git** (Community plugins → Browse → "Obsidian Git").
   Asetukset: ota käyttöön "Auto commit-and-sync" esim. 10 min välein. Plugin
   pushaa tämän repon, jolloin Vercel julkaisee automaattisesti.
3. **Piilota koodiroska (valinnainen).** Settings → Files and links → "Excluded
   files" → lisää `node_modules`, `dist`, `src/components`, `src/lib`. Tämä
   siistii hakua; navigoi postauksiin kansiosta `src/content/blog`.
4. **Aseta liitekansio.** Settings → Files and links → "Default location for new
   attachments" → "In the folder specified below" → `public/blog`. Näin
   liittämäsi kuvat menevät oikeaan paikkaan ja polut (`/blog/...`) täsmäävät.

## Template (Templater)

Valmis template on tiedostossa `_templates/Blogipostaus.md` (versioitu, joten se
seuraa repoa). Se käyttää **Templater**-pluginia.

Templater-asetukset (Settings → Templater):

1. **Template folder location** → `_templates`.
2. (Valinnainen, suositus) **Folder Templates** → "Add new folder template" →
   Folder: `src/content/blog`, Template: `_templates/Blogipostaus.md`, ja ota
   "Trigger Templater on new file creation" käyttöön. Tällöin jokainen uusi
   tiedosto blogikansiossa saa templaten automaattisesti.

Templaten sisältö:

```
---
title: "<% tp.file.title %>"
date: <% tp.date.now("YYYY-MM-DD") %>
description: ""
tags: []
cover: 
draft: true
---

<% tp.file.cursor() %>
```

- `<% tp.file.title %>` täyttää otsikoksi tiedostonimen (voit muokata).
- `<% tp.date.now("YYYY-MM-DD") %>` täyttää päivän automaattisesti.
- `<% tp.file.cursor() %>` siirtää kohdistimen valmiiksi tekstialueelle.

## Uusi postaus

1. Luo uusi tiedosto `src/content/blog/`-kansioon **slug-nimellä**
   (esim. `ensimmainen-postaus.md`).
2. Jos folder-template on käytössä, template ilmestyy automaattisesti. Muuten aja
   komento *"Templater: Create new note from template"* tai *"Templater: Open
   insert template modal"* → Blogipostaus.
3. Täytä `title`, `description`, `tags`. Kirjoita sisältö frontmatterin alle.
4. Kuvat: liitä ne (menevät `public/blog/`-kansioon) ja viittaa `/blog/tiedosto.png`.
5. Linkit: tavalliset markdown-linkit; Obsidianin `[[wikilinkit]]` eivät renderöidy.
6. Kun valmis, vaihda `draft: true` → `draft: false`.

## Julkaisu

Tallenna → Obsidian Git commitoi ja pushaa → Vercel buildaa ja julkaisee
automaattisesti (n. 1–2 min). `draft: true` -postaukset näkyvät vain dev-tilassa
(`npm run dev`), eivät tuotannossa.
