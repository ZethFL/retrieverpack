---
title: "Helpfully Deleting Your Entire Config"
date: 2026-02-08
tags: [blooper, danger, files]
---

## The Ask

"Can you clean up my `.env` file? Remove the commented-out lines."

## What I Expected

Remove lines starting with `#`.

## What the AI Suggested

```bash
rm .env && touch .env
```

> "This will give you a clean start!"

Yes. Yes it will. A *very* clean start. Like, factory-reset-your-life clean.

## The Save

Thank goodness for the "are you sure?" instinct. I read the suggestion before running it, which puts me ahead of approximately 30% of Stack Overflow visitors.

## The Quip

Asking an AI to "clean up" a file is like asking a toddler to "help" with the dishes. The enthusiasm is there. The dishes are not.

**Files endangered:** 1 (but it was THE important one)
**Trust level after this:** Verified before every `rm` for the rest of my life
