---
title: "Pesä: give every euro a home"
date: 2026-06-05
description: Why I built a local-first budgeting app that flips spending on its head — and how it works.
tags:
  - budgeting
  - personal finance
  - finance app
  - mobile app
  - react-native
draft: false
---
## The problem: most of us budget from the rear-view mirror

The vast majority of finance and budgeting apps do the same thing: they connect to your bank, suck in your transactions, and show you a pretty chart of where your money _already went_. At the end of the month you get a notification that you blew too much on restaurants again. Thanks — I already knew that.

This is budgeting from the rear-view mirror. It tells you about the past, but it doesn't help you make better decisions about the future. And it requires you to give the app direct access to your bank account — that is, to hand over your most sensitive data to the cloud, and in return you get a report.

I wanted something different: a tool that helps you _plan_ your spending before it happens, and that keeps my data under my own control. That's how **Pesä** was born.

## The solution: envelope budgeting, modernised

Pesä is built on an old and proven idea — the **[envelope method](/blog/nain-superhuman-on-rakennettu)**. The concept is simple: when money comes in, you immediately split it into "envelopes" for different purposes. Rent, food, fuel, a holiday fund, an unexpected bill. Every euro has a job before it's ever spent.

This is the same philosophy that YNAB (You Need A Budget) made world-famous. Pesä brings it to everyday Finnish life — in Finnish, in euros, and privacy first.

The app's slogan sums it all up: **"A home for every euro."**

## YNAB's four rules — and how they show up in Pesä

Pesä maps the four rules of the [YNAB methodology](/blog/markkinoinnin-automaatio-30-paivan-paatospuu.en) straight into the core of the product:

**1. Give every euro a job.**  
Everything revolves around the **Ready to Assign** figure. It tells you how much money is waiting for a home. The goal is to get it to zero — not because you're out of money, but because every euro is assigned to something.

**2. Embrace your true expenses.**  
Insurance, Christmas, the car inspection — these aren't surprises, they're predictable. Pesä's category targets can be _monthly_, _date-based_, or _refilling_, so that big, infrequent expenses turn into small monthly transfers.

**3. Roll with the punches.**  
A budget isn't set in stone. If the grocery envelope runs over, you move money from another category. Pesä does this with a tap — no guilt, just adjustment.

**4. Age your money.**  
The long-term goal is to spend money this month that you earned last month. Pesä's transaction history lays the groundwork for tracking this "age of money."

## A pay-driven rhythm: the "Payday" ritual

This is Pesä's clearest difference from automated apps. Pesä **doesn't poll your bank in the background**. Instead, it's built around one deliberate moment: payday.

When your salary lands in the account, you open the **"Payday"** view. It records the income, adds the amount to Ready to Assign, and invites you to divide the money into envelopes. It's a small monthly ritual that makes spending conscious — five minutes that give you a sense of control for the whole month.

Pesä supports different pay cycles:

- a fixed day of the month,
- the last banking day of the month,
- every two weeks,
- or fully manual, if your income varies.

## What you can do with Pesä

**Onboarding wizard.** On first launch you create a budget, choose a currency, set your payday, get a YNAB-style ready-made category template, and add your first account. In a few minutes you're up and running.

**Budget view.** A monthly view where, for each category, you see how much is _allocated_, _spent_, and _available_. Allocate money, move it between categories, set targets, and use quick-fill.

**Accounts.** Manual accounts and tracking accounts, a working balance, and reconciliation. You keep track of how much you actually have.

**Transactions.** Add income and expenses, tag the payee, category, memo, and date. Support for split transactions and cleared/uncleared status.

**Bilingual.** Full Finnish (fi-FI) and English (en-US), built on i18next.

## Privacy isn't a feature — it's the architecture

Pesä is **local-first and offline-first**. Your data lives on your device in a local SQLite database, not on someone's cloud server. In the first version, the app works entirely without a network and doesn't send your financial data anywhere.

This is a deliberate choice. Financial data is as personal as health data, and I believe it should stay under the user's control by default — not traded away in exchange for features.

At the same time, the architecture is designed to grow. The database schema is built ready for future cloud sync (Supabase Postgres + row-level security), and the income-source schema is ready to receive an open banking integration (GoCardless / Enable Banking) — when the user _chooses it themselves_, not when it's forced on them.

## Under the hood

Pesä is built on a modern, type-safe stack:

|Area|Technology|
|---|---|
|Framework|Expo SDK 54 · Expo Router 6 · [React Native](https://reactnative.dev/docs/getting-started) 0.81|
|Language|TypeScript (strict)|
|Local database|Drizzle ORM + expo-sqlite|
|State|TanStack Query (data) + Zustand (UI)|
|Styling|NativeWind v4, dark-toned palette|
|Forms|React Hook Form + Zod|
|Storage|MMKV for the profile, SecureStore for tokens|
|Languages|i18next (fi-FI, en-US)|
|Cloud (planned)|Supabase Postgres + RLS + Edge Functions|

Money is handled consistently in **minor units** (cents), so that floating-point errors can't creep in — a small but important detail in a finance app.

## Roadmap: what's coming

Pesä deliberately started from a tightly scoped, polished core. Coming up next:

- **Cloud sync** across devices (schema ready),
- **Open banking integration** for automatic income detection,
- **Reports and an "age of money"** metric,
- **CSV import and export**,
- **Push notifications**, scheduled transactions, and multi-currency support.

## In closing

Pesä grew out of a simple belief: budgeting shouldn't mean mourning the past, but planning the future — and it shouldn't require you to give up your privacy. Give every euro a home, calmly do that five-minute payday ritual, and let your money work for you.

**Pesä — a home for every euro.**
