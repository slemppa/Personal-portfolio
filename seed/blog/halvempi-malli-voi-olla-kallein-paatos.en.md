---
title: 'A "95% cheaper model" is, in many agent projects, the most expensive decision you can make'
date: 2026-06-05
description: Free AI sounds great – but an agent's TCO can blow up. See the cost model, risk matrix and decision tree. Book 30 min.
tags:
  - freeai
draft: false
---
# AI, free? A cheap model can cost the most

The "free AI" idea is, in many agent projects, the most expensive assumption you can make. When an agent isn't "one prompt" but 50–200 small model calls, the price isn't formed by the token line alone but by failures, latency and maintenance. Here's a perspective on when a cheap model actually saves money – and when it eats into your sales results.

## What does "free AI" actually mean in business use? (UI vs API)

When we talk about **free AI**, many people first think of free chat interfaces, such as a ChatGPT or Google Gemini tab in the browser. With these you can try out ideas, write emails or generate marketing copy without any upfront investment. But when you move to business use – especially sales and CRM processes – "free" quickly becomes a misleading concept.

Free interfaces are designed for individual users, not for automations or agents. They're often limited to a few hundred requests per day, and they don't offer critical features such as tool use, JSON-formatted responses or custom integrations. On top of that, they can be slower, since resources are shared among millions of users. In a company's sales pipeline that handles hundreds of leads a day, for example, a free chat interface simply doesn't scale.

With API use the situation is different. Services marketed under the "free AI" keyword, such as certain open-source models or limited API tiers, can offer a lower entry price per token. But this is where the biggest stumbling block hides: **in business use the cost isn't just the price of tokens, but the agent's [total cost of ownership (TCO)](/en/blog/markkinoinnin-automaatio-30-paivan-paatospuu)**. On top of tokens, this means failures, latency, maintenance and integrations. For example, if an agent fails in 10% of cases and every failure requires a manual review, the cost climbs quickly – even if the token price were zero.

For companies it's also essential to understand where "free" ends. Usage limits, such as rate limits, can cut off a campaign midway. Availability problems, such as API outages, can slow down the sales process. And if your data is used to train the model, it can create security risks that aren't acceptable at the enterprise level. Free AI also doesn't offer the SLA guarantees, logging or data-protection policies that companies need to ensure reliable operation.


## The agent's total cost of ownership (TCO): tokens + failures + latency + maintenance

When we talk about the cost of AI in business use, the token price alone is just the tip of the iceberg. The real cost is made up of the agent's total cost of ownership (TCO), which covers four key factors: tokens, failures, latency and maintenance. Each of these can multiply your costs if it isn't managed systematically.

Token costs are straightforward: every token sent and received costs money. But in the world of agents, tokens aren't individual requests, they're chains. In lead enrichment, for example, a single agent job can require 10–20 API calls: fetching lead data, segmentation, generating the message, updating the CRM and finally a review. If each call handles 2,000 tokens and the token price is €0.50 per 1M tokens, the cost per job is already €0.01–0.02 from tokens alone. But this is only the beginning.

Failures are the hidden multiplier of costs. If an agent fails in 5% of cases – for example because of wrong information or a formatting error – every failure requires a new call. This means that out of 100 jobs, 5 fail, and each failed job can require 2–3 retry calls. So the cost is no longer 100 × €0.02, but 115–130 × €0.02. And if the number of retry calls rises, the costs follow.

Latency is another hidden cost. If the agent's p95 latency is 5 seconds, it means that in 95% of cases the response is returned in under 5 seconds. But if the latency rises to 10–15 seconds – for example because of [long context](/en/blog/sisaltomarkkinointi-ai-kayttotapaukset-pk-yritykselle) or complex routing – it slows down the entire sales process. Latency can lead to leads going stale, customers waiting or a campaign's timing going wrong. And if the agent doesn't scale, the cost materializes as lost sales opportunities.

Maintenance is the fourth, often forgotten cost factor. Building, testing, monitoring and updating agents takes time and expertise. If a company doesn't have its own AI team, maintenance can mean outsourced consulting that costs hundreds or thousands of euros a month. In addition, integrations such as CRM or email systems require ongoing upkeep. If the agent fails, someone has to figure out why – and that time is away from other work.

In agent loops, errors compound, because a single wrong assumption can lead to a chain of failures. For example, if the agent classifies a lead incorrectly, it can send the wrong message, update the CRM incorrectly and leave the follow-up undone. Each of these errors requires a manual fix, which raises costs even further. That's why it's essential to measure an agent's performance with metrics such as success rate, retry rate, p95 latency and **cost per opportunity**. These metrics tell you how effectively the agent actually performs – and where there's room for improvement.


## A worked example with numbers: why a "95% cheaper model" can be the most expensive

When comparing AI models, the token price is often the first – and sometimes the only – metric. But as noted above, the token price is only one part of the total cost. Let's look at a concrete worked example comparing two options: (A) a stronger, more expensive model and (B) a cheaper but less reliable model. Our scenario is lead enrichment, message generation and CRM updating, which requires on average 80 API calls per job.

Let's start with the assumptions. The table shows the key metrics for both models:

| Metric                       | Option A (strong model)  | Option B (cheap model)   |
|------------------------------|--------------------------|--------------------------|
| Token price (€/1M tokens)    | €1.00                    | €0.05                    |
| Average token count          | 2,000                    | 2,500                    |
| Base calls per job           | 80                       | 80                       |
| Routing extra calls          | 5% (4 calls)             | 20% (16 calls)           |
| Retry %                      | 2%                       | 15%                      |
| p95 latency                  | 3 s                      | 10 s                     |
| Human review (min/job)       | 0.5 min                  | 2 min                    |

Let's first calculate the token costs. In option A, each job consumes 80 calls × 2,000 tokens = 160,000 tokens. On top of that, the routing extra calls (4) and retry calls (2% × 84 = 1.68 ≈ 2 calls) raise the total calls to 86. So the cost is 86 × 2,000 × €1.00 / 1,000,000 = €0.172 per job. In option B, the token count is higher (2,500 tokens per call), and the calls rise to 80 + 16 (routing) + 12 (15% retry) = 108. The cost is 108 × 2,500 × €0.05 / 1,000,000 = €0.0135 per job.

But token costs are only the beginning. Let's add human labor. In option A, human review takes 0.5 minutes per job, which means 0.5 × €30/h = €0.25 per job. In option B, review takes 2 minutes, i.e. 2 × €30/h = €1 per job. Now the total costs are:

- Option A: €0.172 (tokens) + €0.25 (human labor) = €0.422 per job.
- Option B: €0.0135 (tokens) + €1 (human labor) = €1.0135 per job.

Even though option B is 95% cheaper in token costs, its total cost is more than double. This is due to failures, extra work and latency. And if you also factor in the sales opportunities lost because of latency, the gap grows even wider.

The conclusion is clear: **cost per opportunity** is the only relevant metric. If a cheap model produces more errors, latency and manual work, it's ultimately more expensive – even if the token price were nearly free.


## Hidden cost #1 – Routing and a multi-model stack: classification call(s), error paths and observability

Routing and a multi-model stack are powerful tools, but they bring hidden costs that are rarely accounted for in "free AI" discussions. Routing means that the agent selects the most suitable model or tool for a task based on which task is being performed. For example, lead segmentation can use a lightweight model, while generating a proposal template requires a stronger model. But this choice doesn't happen for free.

The first hidden cost is the classification call. Before the agent can pick the right model, it first has to determine which task is at hand. This often requires a separate API call to a classifier model. If the classifier fails, the whole chain can go wrong. For example, if the classifier mislabels a lead, the agent can send it the wrong message or use the wrong model. This leads to a chain of retry calls, which raises costs and latency.

The second hidden cost is error paths. Routing isn't just a chain of successes, but also a web of contingency plans. If the primary model fails, the agent has to know how to pick a fallback model or path. This requires complex logic that is prone to errors. For example, if the fallback model doesn't support JSON-formatted responses, the agent has to know how to handle this format difference. And if the format changes, integrations can break, which requires a manual fix.

The third hidden cost is observability. When an agent uses multiple models and paths, it's essential to know what went wrong and where. This requires comprehensive logging and tracing, in which every call and response is stored. Observability isn't just about tracing errors, but also about optimizing performance. For example, if a routing choice repeatedly leads to failures on a certain path, this has to be fixed. But building and maintaining observability takes time and resources – and it costs money.

Finally, testing and regressions are critical. When you update a model or routing logic, you have to make sure the changes don't break existing functionality. This requires comprehensive tests that cover all possible paths and error situations. And if testing fails, the consequences can be expensive: errors can end up in production, which leads to manual fixes and lost sales opportunities.

Routing pays off when the tasks are clearly bounded and the quality requirements are deterministic. For example, routine tasks such as lead segmentation or generating simple messages can benefit from lighter models. But if a task requires complex decision-making or long context, routing can add more cost than benefit.


## Hidden cost #2 – No cache: you pay for the same tokens on every run

One of the biggest hidden costs in using AI agents is that you pay for the same tokens over and over again – unless a cache is used systematically. A cache means that the agent stores previously generated responses and reuses them in similar situations. This can reduce costs by as much as 50–80%, yet many companies still leave it unused.

Agents often repeat the same things. For example, the company profile, service promise, tone-of-voice guidelines or process descriptions are sent to the agent every time it generates a message or updates the CRM. If this information isn't cached sensibly, you pay for the same tokens again and again – on every run.

A cache should be built on two levels. The first is a prompt/response cache at deterministic points: when the temperature is low and the input is the same, the response can be stored and returned directly from the cache. The cache key is formed from the model, the parameters and a hash of the prompt, so that the same query doesn't go to the model twice. The second is an embedding cache for frequently retrieved documents, such as the company introduction, service descriptions and guidelines – there's no point recomputing these every time.

The pitfall hides in the multi-model stack. If you use several providers, different parameters and different response formats, the cache often stays at the "we'll do it later" level, because a unified key and format are hard to maintain. The result is backwards: you save cents per token but burn euros on repetition. That's why response formats should be unified and the TTL and invalidation logic thought through right away, not only in the optimization phase.


## Hidden cost #3 – Long context: cost spikes and slowing performance

The third hidden cost arises from patching up a cheaper model by feeding it more context. When the model reasons less reliably, the temptation is to add instructions, examples and background information to the prompt "just to be safe." In agent work, context isn't just the chat history, but CRM notes, website copy, previous emails, competitor and industry data, plus work queues and rulebooks. Every added line costs tokens on every call.

Long context bites back in three ways. It raises the token count directly, it slows down execution (longer input = higher latency), and it also starts to cost in human time: waiting, reviewing, correcting and re-running. So the cheap model's "saving" drains away when the same information is pushed through the chain again and again.

The solution isn't to dump everything into the prompt. Use RAG (retrieval-augmented generation) to fetch only the relevant snippets, split the memory into logical parts (for example CRM, product and tone-of-voice separately) and adopt context budgeting: separately cap how many tokens are reserved for sources, instructions and the output itself. If despite this you're forced to grow the context only so that the cheap model understands the task, switching to a better model at the critical stage is usually cheaper than continually inflating the context.


## Frequently asked questions

### Is AI really free, or do you pay in hidden costs (time, errors, latency, integrations)?

Often "free" only applies to chat use or a short trial. In a company's agent you pay, on top of tokens, for failures (retry runs), latency (human waiting and review) and the maintenance of integrations and monitoring. That's why you should measure TCO per run and, ultimately, cost per opportunity, not just €/token.

### When is a "cheap model" the most expensive decision in an agent project?

When the task requires decision-making (lead prioritization, message angle, risks) and the cost of an error is high (customer messages, CRM actions). A cheap model is often "fixed" by adding context and routes, which raises the call count, retry percentage and human labor. The result: weaker reliability and nearly the same cost.

### How does routing (multiple models) affect costs and reliability in practice?

Routing usually adds 1–2 model calls for classification as well as more error paths: if the choice is wrong, the whole chain is run again. On top of that comes observability and testing load (why did the route change, where did the format break). Routing only pays off if the routine portions are clearly bounded and the metrics (success/retry/latency) guide the decision.

### How do I implement caching (prompt/response cache and embedding cache) for an agent so that the savings actually materialize?

Start with a prompt/response cache at deterministic points: keep the temperature low and build the cache key from the model, the parameters and a hash of the prompt (plus the process version). Add an embedding cache for documents you fetch often (company introduction, services, guidelines), and use TTL + invalidation when the source changes. Unify the response formats so the cache works in a multi-provider stack.

### How do I manage the cost spikes of long context (RAG, summarization, context budgeting), and when is it worth switching to a better model?

Don't dump everything into the prompt. Use RAG to fetch only the relevant snippets, split the memory (e.g. CRM vs product vs tone) and adopt context budgeting: cap the tokens for sources, instructions and output separately. If you still end up growing the context "so the cheap model understands," switching to a better model at the critical stage is often cheaper.


## Summary

"Free AI" is a good starting point for experimentation, but in the world of agents it's rarely a free end result. When you measure tokens, retries, p95 latency and human labor, you quickly see where a cheap backend is enough and where it eats into the sales pipeline's reliability. Book a 30-min consultation: let's go through your agent/automation setup and decide clearly where it's worth paying for a better model.
