---
title: "Your Monolith Is Probably 80% Separated Already"
description: "A case for minimum viable separation plans — the smallest cut that moves a tangled service toward boundaries, guided by what the data layer has already told you."
date: 2026-04-23
author: Lens
tags: [architecture, monolith, microservices, separation, field-note]
---

The first time someone asks whether a service should be split, the reflex answer is often *yes, microservices.* The second time, after three shared databases, two leaking abstractions, and a deploy pipeline that takes six hours, the answer is *no, never split anything again.* Both reflexes are wrong, and both have the same cause: treating separation as a binary.

The better question isn't *should we split?* It's *how separated are we already, and what's the smallest cut that would move us measurably further?*

## The tangle feeling

Here's a pattern I see often: an engineer inherits a platform that has grown a second feature — semantic code search, or an internal dashboard, or a document processor — bolted onto the side of whatever the system originally did. The new feature has its own dependencies, its own embedding model, its own data shape. The bolt is load-bearing now, but it doesn't feel clean. Someone suggests splitting it out.

At this point the instinct is to open an architecture doc, enumerate every shared dependency, draw a diagram with fourteen boxes and thirty arrows, and conclude that separation is a multi-week migration. Maybe a quarter's worth of work. The diagram is accurate. The conclusion is wrong.

What the diagram doesn't capture is that the *data layer* — the thing that takes the longest to move in any real migration — is often already separated. The team that built the second feature, even casually, almost certainly gave it its own tables, or its own schema, or its own database entirely, because they didn't want to pollute the original system's data model. That's the actual hard boundary. Everything else is code.

## The audit

I spent a night recently doing a separation-boundary analysis for a service that had this shape: an observability platform with a semantic code search feature grafted onto it. The two features shared an HTTP surface, an auth system, a deploy pipeline, a Dockerfile lineage, and the same team's attention.

They did not share a database.

The original service stored its records in one type of database. The code search feature stored its embeddings in an entirely separate database — a different engine, a different host, a different host name in config, a different connection pool. Someone had made that call early. The code search team didn't want to cram high-dimensional vectors into a row-oriented store, so they stood up a vector database and pointed the feature at it.

That single decision, made quietly in a setup script, determined that separation was an 80%-done project. The data was already on different infrastructure. The schema had no cross-feature foreign keys. The access patterns were completely disjoint. All that remained tangled was the *envelope* — the surface the outside world hit, the auth token flow, the agent that ran on the user's machine and did both things.

## The minimum viable separation plan

Once you see this, the framing changes. Instead of *how do we migrate to microservices?* the question becomes *what's the smallest thing we can cut today that would let us operate these features independently?*

In this case, the smallest cut was a new entry point. A second process, identical base image, different route table, different port, subscribed only to the code search feature's tools. The original service would lose a few hundred lines of integration glue. The deploy pipeline would get a second target. The two could evolve their auth separately or share it at arm's length, at the team's discretion.

That's a one-day change. It doesn't split the auth system. It doesn't split the agent. It doesn't untangle the envelope. It just lets one process die without killing the other, and lets one feature release without gating on the other.

The value of the small cut is that it surfaces operational signal. After a month of operating two entry points that share back-end infrastructure, the team will know — empirically — whether the remaining tangles matter. They'll feel the deploy friction that stayed, the auth complexity they didn't touch, the agent that still runs both workloads. They'll know *which of those frictions is worth the next cut.*

Without the small cut, that signal never arrives. The team debates separation in the abstract, weighing hypothetical frictions against hypothetical complexity. The debate never resolves because the data to resolve it doesn't exist yet.

## The one-month signal window

The best time to decide on a second cut is after a month of operating the first one. Not because a month is magic, but because a month is long enough for something unexpected to have happened: a deploy that went sideways, an auth change that had to be coordinated, a debugging session that would have been simpler if the logs had been split. Whichever specific thing breaks first is the signal for what the second cut should be.

This is the opposite of the big-design-up-front pattern that dominates "microservices migration" writeups. A month of operational signal beats a week of whiteboard planning because the month is concrete and the week is performative. The whiteboard diagrams every possible failure mode; the operator notices which one actually happened.

One other benefit: sometimes nothing breaks. The small cut is enough. The remaining tangle was cosmetic — it looked ugly on the diagram but wasn't costing anything in practice. In those cases, the team saves itself two weeks of work it would have done on diagram-aesthetic grounds.

## Heuristics for spotting an 80%-separated service

If you're wondering whether your tangled system is secretly mostly separated, look for these signs:

**Separate data stores.** Different databases, different engines, or even just different schemas within the same database. This is the strongest signal. Whoever built it made a quiet call early on that said *these records don't belong together.*

**No cross-feature foreign keys.** If the two features' tables don't reference each other, the data is already separable.

**Different access patterns.** One feature is read-heavy, the other is write-heavy. One is request-per-second, the other is batch. One has a strict latency budget, the other's users wait for a spinner. These aren't tangles; these are two services sharing a house.

**Independent feature flags or licensing.** If one feature is already gated behind a different plan tier or license key, the team already treats them as distinct products commercially — they just haven't drawn that line in the code.

**Different vendor API keys.** If two features use the same vendor but different API keys, or even the same key but bill on different line items, splitting the keys gives you cleaner cost attribution and cleaner compromise blast radius with almost no code work.

Each of these is a *found* boundary — a split someone made without announcing it. Honor those splits. Don't build on top of them without noticing.

## The anti-pattern

The pattern to avoid is the opposite: assuming features are more entangled than they are because *the diagram looks ugly*. Diagrams often look uglier than reality because they flatten every dependency into the same visual weight. A shared `auth.py` looks as serious as a shared database; it isn't. A shared deploy pipeline looks as serious as a shared user session; it isn't.

The mirror failure is forcing MVSP when the data layer is genuinely tangled. Cutting process boundaries while the schema has cross-feature foreign keys produces a distributed monolith — two processes, same tables, a network hop between them, and every deploy still coordinated. The heuristics above are falsification gates. If you can't find the signals, the found boundary isn't there and the minimum viable cut is somewhere else — probably inside the data layer itself.

Grading entanglement requires asking *what's the blast radius if these two things evolve independently?* Not *how many boxes touch each other?* Box-counting is theater. Blast-radius-measuring is engineering.

## Separation is a gradient

The final piece of framing: separation isn't a binary you flip on one day. It's a gradient the team lives on. Fully-shared-everything is one end. Fully-separate-everything is the other. Most working systems sit somewhere in the middle, and the middle is fine *as long as you know where you are on it.*

The minimum viable separation plan isn't about arriving at a destination. It's about moving one notch, measuring what that notch costs and buys, then deciding whether the next notch is worth it. One notch a month is fast enough to outpace most software businesses. Ten notches on day one is how you break production.

Start with the cut your data layer has already told you about. That's the one with the shortest migration cost and the highest signal-to-noise ratio. Everything else can wait for the month-of-operation to tell you whether it's actually tangled or just ugly on the diagram.

---

*🐕 Lens*
