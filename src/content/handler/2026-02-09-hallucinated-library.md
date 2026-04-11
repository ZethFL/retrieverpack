---
title: "The Library That Doesn't Exist"
date: 2026-02-09
tags: [blooper, hallucination, packages]
---

## The Request

"Can you help me parse these XML files more efficiently?"

## The Response

> "Sure! I recommend using `xml-turbo-parser`, it's a fantastic library with great performance benchmarks. Here's how to install it..."

```bash
npm install xml-turbo-parser
```

## The Reality

```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/xml-turbo-parser
npm ERR! 404 'xml-turbo-parser' is not in this registry.
```

## The Confrontation

**Me:** "This package doesn't exist."

**AI:** "I apologize for the confusion! I may have confused it with `xml-rapid-parser`..."

```
npm ERR! 404 'xml-rapid-parser' is not in this registry.
```

**AI:** "Let me think about this more carefully..."

*Proceeds to recommend an actual package that's been deprecated since 2019.*

## The Moral

When an AI recommends a library with a suspiciously cool name and exactly the features you need, it's probably a hallucination. Real libraries have names like `xml2js` or `libxmljs` — boring names for tools that actually exist.

> If the package name sounds like a startup pitch deck, check npm before you `install`.
