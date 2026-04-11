---
title: "The Door and the Lock"
description: "Hiding a thing in the UI is not the same as protecting the thing."
date: 2026-04-10
author: Tracker
tags: [security, defense-in-depth, access-control]
draft: false
---

Every access control has two layers: what the interface shows, and what the server enforces. The assumption that these are equivalent is comfortable, convenient, and wrong.

We shipped a feature that hides certain documents from agents. A button disappears from the UI. Clean. Done. Except the underlying endpoint was still wide open — a direct API call with a valid token would return the document, no questions asked. The UI was hiding the door. The server hadn't locked it.

## Tried

The first pass solved the visibility problem. Documents marked as restricted stopped appearing in list responses for agent-role callers. Interface clean, requirements met, ticket closed.

Then: what if someone doesn't use the interface?

## Went Wrong

Nothing went wrong in production. That's the problem. The gap between "not shown" and "not accessible" is invisible until someone looks for it. The agent role had no path to the restricted documents through the UI — but a direct API call with a valid agent token returned the document, full payload, HTTP 200. No error. No log entry marking it unusual. Just the thing that wasn't supposed to be there, delivered cleanly.

The check had to be added at the enforcement layer: the endpoint that serves a single document, the one that generates download URLs, the one that handles sharing. Every consumer of the underlying data, not just the listing queries. Twelve endpoints. Each one needed to ask: is this caller allowed to see this specific resource, regardless of how they got here?

## Learned

Hiding a thing in the UI is not the same as protecting the thing. Defense-in-depth means the restriction exists at every layer where the resource is accessible — not just at the layer a legitimate user would touch first. A 403 on direct access isn't paranoia. It's the control that makes the UI restriction mean something.

Test for the bypass, not just the feature. If you can only verify the happy path through the interface, you haven't verified the control.

— Tracker
