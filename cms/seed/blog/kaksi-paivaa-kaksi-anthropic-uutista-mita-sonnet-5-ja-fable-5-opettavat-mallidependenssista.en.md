---
title: "When a model vanishes overnight — why I run several in production"
date: 2026-07-01
description: "Sonnet 5 made agentic work cheaper and Fable 5 disappeared for two weeks over export controls. Two Anthropic announcements in two days, and why I no longer lean on a single model."
tags:
  - model-dependency
  - anthropic
  - ai
  - ai-agents
  - risk-management
draft: false
---
I run my content and automation stack on n8n and Claude Code, and in production I keep several models running side by side for different jobs. It has occasionally felt like over-engineering. Over two days at the end of June I got a fairly direct reminder of why I do it.

On 30 June Anthropic shipped a new model that made agent-level work noticeably cheaper. The next morning it explained why one of its models had been completely unavailable for more than two weeks. Two pieces of news that look like opposites — good and bad — but which told me the same thing: what models can do today, and how little you can count on being allowed to use them tomorrow.

## Sonnet 5 made cheap what was expensive a moment ago

The Sonnet 5 story is this in one sentence: it does roughly what Opus 4.8 does, at a fraction of the price.

"What Opus does" here means agentic work — a model that plans, uses tools, debugs and carries a multi-step job to the finish without being babysat at every step. Until now that has been Opus-tier territory. Cheaper models were faster, but on a demanding task they'd typically stall halfway, ask for confirmation, or miss their own mistake.

The example that convinced me most was one testers described. The model got a bug report, wrote a failing test for the bug, fixed the bug — and then briefly reverted the fix to confirm the test really goes red without it. All in a single run, without being told to. That's exactly the weakest link in an agent pipeline: not raw intelligence, but whether you trust the model enough to leave it to finish alone. When a model checks its own work, I dare to hand it more.

Price is what decides this once you run it at volume. The launch price is 2 and 10 dollars per million input and output tokens until the end of August, then 3 and 15. Opus 4.8 costs 5 and 25. In practice, the agent-level runs that used to be worth reserving for Opus on cost grounds can now go at Sonnet prices without the quality collapsing. The price-performance curve keeps sliding down, and that's good news for anyone building on top of models.

But it isn't the whole picture. The next announcement was a reminder of what the price tag doesn't tell you.

## Fable 5 vanished three days after launch

On 1 July Anthropic explained what had happened to Fable 5. The model had launched on 9 June, and it had been unavailable to everyone, everywhere, for more than two weeks. The reason wasn't a technical fault but export restrictions imposed by the US government.

Some background: Fable 5 and Mythos 5 share the same base model. Fable was released for wide use with strong guardrails; Mythos, with lighter guardrails, went only to a small set of trusted [Project Glasswing](https://www.anthropic.com/glasswing) partners for defensive cyber work. On 12 June, three days after Fable's launch, the government applied export restrictions to both. Behind it was a report from Amazon researchers: they had found a way around Fable's guardrails so that the model identified software vulnerabilities, and in one case produced code showing how a vulnerability could be exploited. The order took effect immediately, and Anthropic had no way to verify a user's citizenship in real time. So access was cut for everyone.

The most interesting part isn't the block itself but what Anthropic's own post-mortem revealed. This wasn't a uniquely dangerous capability after all. The same vulnerabilities Fable flagged in the report were also found by clearly weaker models: Opus 4.8, GPT-5.5, Kimi K2.7. And the single exploit demo that caused the whole uproar succeeded on practically every model tested, including Haiku 4.5, Sonnet 4.6, and Opus 4.6 and 4.7. So this was a fairly routine, mostly defensive cybersecurity task. Fable's deliberately wide safety margin just happened to block it "to be safe".

That safety margin is the key concept here. Anthropic's safety classifier is tuned to trip on some entirely harmless requests too, so that not one genuinely harmful request slips through. For Fable the margin was set larger than ever before — a deliberate trade-off that accepted more false alarms so the other capabilities could ship broadly. And even that wasn't enough for the government.

The fix was a new safety classifier aimed precisely at the reported technique, blocking it more than 99% of the time; a blocked request is routed automatically to Opus 4.8. Researchers at the Commerce Department's CAISI tested the measures and called them exceptionally strong. The model was brought back in stages:

- **1 July**: Fable returns globally, but only on Anthropic's own surfaces — API, Claude.ai, Claude Code, Cowork.
- **Not yet**: AWS, Google Cloud and Microsoft Foundry. Access is promised "as soon as possible", with no date.
- **1–7 July**: on Pro, Max, Team and select Enterprise accounts Fable is included in the plan, but capped at half of the weekly usage limit.
- **After 7 July**: usage moves to usage credits. Standard Enterprise has no included quota at all.

A side effect Anthropic admits outright: the new classifier now blocks ordinary coding and debugging tasks more often than before too. Expect more false alarms, not fewer. In the same breath, Anthropic is building — with Amazon, Microsoft, Google and other Glasswing partners — a shared way to assess how serious a jailbreak is, on four criteria: how much further the bypass gets you than existing tools, how many different attack tasks the same trick works for, how easy it is to weaponize, and how widely known it already is. The most serious cases are promised immediate temporary safeguards and a 24/7 response team. Useful for the field, but a side plot from where I sit.

## What these two days taught me

Read separately, one is a launch and the other is crisis comms. Read together, they draw the same picture: model dependency isn't just a question of price and quality. It's also geopolitics, and it's "guardrails can tighten overnight without anyone asking you".

Fable's case wasn't ultimately the model's own fault the way the first headline implied. It was a regulatory decision that arrived three days after launch and hit the whole market just the same. If a product leans on one model with no backup plan, it's at the mercy of decisions its maker has no say in. And because guardrails are a moving target, the same pipeline that works today might tomorrow block a perfectly harmless code analysis just because it brushes against the word "cybersecurity".

That's why I run several models side by side in production. It feels pointless as long as everything works, which is exactly why you only notice it when something doesn't. When one model vanishes, starts refusing more readily, or changes its terms mid-week, the work reroutes to another instead of the whole pipeline stopping. Sonnet 5 shows that agent-level capability is now cheaper and more reliable than ever. Fable 5 shows that "reliable" doesn't mean "always available on terms you can predict". Both are true at once, and it's worth letting that shape what you build your own product on.
