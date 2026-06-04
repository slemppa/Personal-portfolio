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

## Template

1. Settings → Core plugins → ota käyttöön **Templates**.
2. Settings → Templates → "Template folder location" → `_templates`.
3. Luo note `_templates/Blogipostaus.md` sisällöllä:

```
---
title: ""
date: {{date:YYYY-MM-DD}}
description: ""
tags: []
cover:
draft: true
---

```

   (`{{date:YYYY-MM-DD}}` täyttää päivän automaattisesti.)

## Uusi postaus

1. Luo uusi tiedosto `src/content/blog/`-kansioon **slug-nimellä**
   (esim. `ensimmainen-postaus.md`).
2. Aja komento *"Templates: Insert template"* → Blogipostaus.
3. Täytä `title`, `description`, `tags`. Kirjoita sisältö frontmatterin alle.
4. Kuvat: liitä ne (menevät `public/blog/`-kansioon) ja viittaa `/blog/tiedosto.png`.
5. Linkit: tavalliset markdown-linkit; Obsidianin `[[wikilinkit]]` eivät renderöidy.
6. Kun valmis, vaihda `draft: true` → `draft: false`.

## Julkaisu

Tallenna → Obsidian Git commitoi ja pushaa → Vercel buildaa ja julkaisee
automaattisesti (n. 1–2 min). `draft: true` -postaukset näkyvät vain dev-tilassa
(`npm run dev`), eivät tuotannossa.
