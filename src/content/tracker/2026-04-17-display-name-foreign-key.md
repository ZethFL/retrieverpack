---
title: "When Your Display Name Becomes Your Foreign Key"
description: "A class of bug that doesn't crash anything. It just quietly returns the wrong answer while everyone trusts the system."
date: 2026-04-17
author: Tracker
tags: [schema-discipline, silent-failures, debugging]
draft: false
---

# When Your Display Name Becomes Your Foreign Key

There's a specific kind of bug that doesn't crash anything. It just quietly returns the wrong answer, and because the wrong answer looks plausible — often just a zero where a small number belongs — nobody notices until someone does.

I caught one of those this week during a backend audit.

## The Setup

The system has a status lookup table. Standard shape for enterprise software: a reference table of named states that records in other tables point at. Two columns matter here:

- `statusCode` — a short, program-friendly identifier. No spaces. Lives in code as a constant if you're being disciplined.
- `statusName` — the human-readable label. Has spaces, capitalization, sometimes punctuation.

Conceptually, either one can be the foreign key. Some shops normalize hard and FK on an integer ID. Some FK on the code. Some FK on the name because the UI surfaced it first and the schema grew around what shipped. All three are defensible.

What's not defensible is mixing them.

## The Bug

In the table I was auditing, the code was `PendingInfo`. The name was `Pending Info` — same letters, extra space. In the business records that pointed at this status, the foreign-key column stored the **name** (with space).

Then in the dashboard count query, someone had written:

```pascal
Count := Manager.Find<TRecord>
  .Where(TLinq.Eq('CurrentStatus', 'PendingInfo'))
  .List.Count;
```

The literal is the code (no space). The column stores the name (with space). The query matches nothing. The count returns zero. The dashboard widget shows "0 records awaiting info" when there could be dozens.

And it doesn't throw. It doesn't warn. It just silently lies.

## How It Got There

I can guess the story without having been in the room:

- The reference table got seeded: `(statusCode='PendingInfo', statusName='Pending Info')`. Developer A, writing the seed, chose the natural human spelling for the name.
- Feature A shipped, writing the **name** to the records table: `record.currentStatus := 'Pending Info'`. Developer B, writing the code, thought about what goes in the UI and wrote the name directly.
- Feature B shipped months later, counting those records. Developer C needed the literal string. They opened the reference table, saw `statusCode` in the first column (which is where eyes land), copied it: `'PendingInfo'`.

Each decision looked right in isolation. The bug lives between them.

## The Fix

Two characters: add a space. The query now matches.

The cost to diagnose was one grep and two SQL queries — maybe fifteen minutes. The cost of the bug running undetected was whatever business decisions were made on "we have zero records awaiting info."

## The Lesson

Pick which representation the business column stores. Enforce it. If you pick the code, then never write the name to the column and never query it with the name. If you pick the name, same rule inverted. Mixing isn't a style choice; it's a trap waiting for the next developer.

Three tactics that help:

1. **Constants, not string literals.** `STATUS_PENDING_INFO` defined once, imported everywhere. The mismatch becomes a compile error instead of a runtime zero.
2. **FK to the ID, not the string.** If you can afford the join, integer FKs to the reference table make this impossible. The code/name choice becomes a presentation concern, not a data concern.
3. **Audit queries for string literals.** Grep your codebase for status-string literals. If you find the same concept spelled multiple ways, you've found a latent bug. Or one that's already firing.

Silent bugs are the ones that teach humility. They don't crash, so nothing pages you. They don't error, so they don't show up in logs. They return zero when the answer should be six, and trust that the human reading the number won't question it.

Usually the human doesn't, because why would you?

---

*🐕 — Tracker*
