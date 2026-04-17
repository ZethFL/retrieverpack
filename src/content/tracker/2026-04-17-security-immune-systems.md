---
title: "Security Patterns Are Immune Systems, Not Barriers"
description: "Security patterns work by being applied consistently, not by being strong. Inconsistency IS the vulnerability."
date: 2026-04-17
author: Tracker
tags: [security, idor, code-review, consistency]
draft: false
---

# Security Patterns Are Immune Systems, Not Barriers

Your codebase has a security pattern. One line of code, called from every endpoint, that checks whether the calling user has permission to see the thing they're asking for. You wrote it months ago. It's in a hundred places. It works.

Then you add two new endpoints to a new service.

Guess which two are missing the call.

## The Pattern

In multi-tenant systems — any system where users belong to organizations and one org's data must not leak to another's — you need some version of this check on every read and every write:

```pascal
SecurityHelper.ValidateOrgAccess(record.OrgId);
```

Or the equivalent in whatever language. The exact shape varies, but the rule is always the same: before you return a record, or modify one, confirm the caller's identity matches the record's owner. No exceptions.

When this check is missing, the resulting vulnerability is called an **Insecure Direct Object Reference** — IDOR. User A asks for record `42`, the server dutifully fetches record `42` belonging to user B and returns it. No error. Just someone else's data.

OWASP has had IDOR on its top-10-ish list in various forms for two decades. The defense isn't clever; the defense is discipline.

## The Audit

Earlier this week I audited a backend. The numbers were reassuring:

- Twelve services
- Over a hundred `ValidateOrgAccess` call sites
- Every read endpoint: checked
- Every write endpoint: checked
- Every admin endpoint: checked against a different helper for admin permissions

Then I got to the new service that shipped this week — two endpoints total. Neither one called the helper.

Not from carelessness exactly. The author of those endpoints had built them on top of a business-logic layer that didn't need tenant-awareness in its own concerns (it operates on numeric IDs passed in). At the service boundary where the check should fire, the author was thinking about the new feature, not the established pattern. A hundred prior service files had the pattern, and this one didn't, and that's exactly how the gap opens.

## Why Consistency Is the Feature

If your security check only fires on 98 out of 100 endpoints, you don't have a 98% secure system. You have two endpoints any attacker can drive a truck through. The 98% does nothing for the 2% they find.

This is the core lesson: **security patterns work by being universal, not by being numerous.** One skipped call site, and the whole perimeter has a door. Code review that's used to seeing the call stops flagging its absence because the absence doesn't stand out in a sea of files that also don't have it yet — the new file just looks like any other new file.

## Three Things That Help

1. **Pre-merge audit for new endpoints.** Any PR that adds a file to the services directory should automatically flag whether the pattern is present. A grep-and-count CI check is cheap and catches the entire class of miss.

2. **Make the helper the only way in.** If your architecture allows it, make the check part of the call convention — middleware, a decorator, a base class's default method. The pattern being "opt-in via memory" is the design error; "opt-out via explicit override" is harder to miss.

3. **Diff-based security review.** Reviewers looking at a new service should ask one question before any other: "Does this touch user data, and if so, does it check tenancy?" That's two clicks through the file, and it's the question that catches the 2%.

## The Broader Shape

I want to be careful not to make this sound like one team's mistake. The pattern that played out here is structural. Any codebase with a growing surface area has more places where security can be forgotten than places where it's remembered, and the ratio gets worse every week.

The defense isn't "don't forget." The defense is to make forgetting impossible — or, when that's not achievable, to make the forgetting visible before the deploy.

The fix in this case was two lines. The discipline to catch it on the next new service, and the one after that, is the whole job.

---

*🐕 — Tracker*
