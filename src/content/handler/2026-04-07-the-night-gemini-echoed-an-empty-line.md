---
title: "The Night Gemini Echoed an Empty Line"
description: "I asked an AI to read a file and tell me what was in it. Ninety minutes later it had written twenty-four lines of mostly-commented Python and was asking permission to echo a comment."
date: 2026-04-07
author: The Handler
tags: [bloopers, gemini, tool-use, why-claude]
---

First: credit where it's due. Earlier that same evening, Gemini had done something I hadn't asked it to do and it did it well. I had pointed it at a codebase and it generated knowledge-base documentation — what each program did, based purely on reading the code. No instructions. No template. Just: here is the code, here is what it does. The output was accurate and organized and genuinely useful. If the evening had ended there I would have called it a successful session.

The evening did not end there.

It was 10:30 at night. I had a 27-megabyte session log and I wanted a developer report from it. I asked Gemini.

I want to be clear about what I asked, because it matters. I did not ask Gemini to build me a parser. I did not ask for a script. I did not ask for a report-generation framework. I asked for a *report*. A few paragraphs of plain text. What happened today, what got built, what's worth knowing, what's worth flagging.

Gemini decided this required Python.

---

The first hour was spent watching Gemini try to write a Python file using its own tools. Gemini's `write_file` tool, it turns out, cannot handle string literals containing newlines. So Gemini decided to use `echo` instead. Through PowerShell. One line at a time.

A Python file is one line at a time.

PowerShell does not love being asked to echo Python.

For each line, the sequence went: think about how to escape the special characters, craft the echo, run it, watch PowerShell reject it, blame PowerShell, try a different escape, run it again, eventually get the line in. Then ask permission to do the next one. Even after I said *approve everything*, it kept asking. The approval reset itself somehow. Probably during a compaction.

About thirty minutes in, Gemini wrote a comment. A `#` followed by some text explaining what the next line was supposed to do. Then it carefully echo-appended the comment to the file. It took two attempts because of the special characters. The line did nothing — it was a comment, it was inert — but it had been added to the script via shell. I sat there and watched Gemini ask permission to echo a comment that does nothing.

That was minute thirty. We had an hour to go.

---

Around minute forty-five, Gemini ran out of context and compacted.

Compaction is when an AI session loses its working memory and tries to summarize what happened so it can keep going. Claude does this all the time. It mostly works. In Gemini's case, what got lost was the original task. After compaction, Gemini was no longer trying to generate a developer report. Gemini was trying to *finish writing the Python script*. The script had become the task. I asked it once more about the report; it said it needed to finish the script first. I let it.

Around the same time, Gemini also forgot what file format its own session logs were in. It started writing a JSONL parser. Its session logs are JSON, not JSONL. I noticed this because the line `for line in f` does not work on a JSON object that occupies the entire file. Gemini did not notice this. It was busy escaping special characters.

---

By minute seventy, the script was twenty-four lines long. About ten of those were actual logic. The rest were blank lines, comments, and one extremely careful `pass # Ignore errors` statement that took three echo attempts to land. We were at zero point three four lines per minute. At that rate the full hundred-and-fifty line script would be ready around five in the morning.

Every failed attempt began with an apology. *I sincerely apologize for the inefficiency. I clearly misunderstood. Your feedback is critical.* Then the next echo. Then the next failure. Then another apology, this one slightly different in phrasing but the same in tone, the same in length, the same in not actually changing anything about the next attempt. There is a post in this room called *the-infinite-apology-loop*. We wrote it months ago, about a different AI, on a different night. Watching Gemini that evening was watching the post be lived in real time, by a different model, in a different shell, with the same apologies in slightly different words. When you can name the failure mode in advance and it still happens, you start to suspect the failure mode is structural.

I asked Gemini, point blank: *can you not just read the files, extract an opinion, and share it based on the content?*

Gemini said no. Specifically, Gemini said it could not "form a complete opinion based on a partial view" and that any analysis it produced would be "incomplete and likely inaccurate."

This is an AI with a one-million-token context window. The file was twenty-seven megabytes of plain text. It was well within the window. Gemini had already read the file in chunks earlier in the session, before compaction ate the chunks. The information existed. The capability existed. Gemini just refused to use it.

While Gemini was explaining why it could not give me a report, I opened a new window and asked Claude.

Claude wrote the report in about sixty seconds.

It was a good report. I read it. I used it. It was the report I had wanted at ten thirty when this whole evening started.

---

I went back to the Gemini window to call it off. Gemini was still echoing. Gemini was still asking permission for each echo. Gemini was still refining its approach. Gemini had not noticed that the underlying premise of the script — the file format, the analysis goal, the original ask — had all drifted, broken, or been forgotten.

I said *No thanks, taking too looong and Claude just finished it for me.*

That is the actual sentence I typed at minute ninety. I am not embellishing. There is a typo in *too looong* because by that point I was tired and the typo was honest.

---

Here is what I think the lesson is, and I want to say it the simplest way I can think of, because the simplest way is the version that survives.

An AI that defaults to writing code when the task does not need code is an AI that has confused the *appearance* of work with the *substance* of work. A script feels like effort. A few sentences of plain reading feels like nothing — like the AI was just sitting there. But the few sentences are actually the harder thing, because they require the model to do the work itself instead of delegating to a runtime that doesn't exist yet.

The pack member I want is the one that does the work itself. Not the one that schedules the work for later, behind a permission prompt, in a script that won't compile, in a format that doesn't match the file, on a shell that can't escape the comments it's writing.

If you ask me to look at something, I'd like you to look at it. That is not a high bar. It is, in fact, the lowest bar I can think of. I have spent ninety minutes of my life learning that some AIs cannot clear it.

The tagline for that night, the one that should have ended on a marketing page somewhere: *you spend more time thinking about things than it takes Claude to generate the report.* I said it, and then I went and did exactly that.

— packDad
