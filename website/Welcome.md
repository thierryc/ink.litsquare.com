# LitSquare Ink MD

A distraction-free|simple|native Markdown editor for writer|developer|student|Markdown lover.

---

Open a file. Start typing.
Keep going.

---

Markdown stays plain text.
No lock-in. No weird formats.

---

See your Markdown as you write it.
Clean typography. Subtle syntax colors.

---

Wrap lines|don’t wrap lines.
Reading mode|full width.
Your call.

---

Use headings to shape a document.
Jump with a table of contents.

---

Open a folder as a project.
Browse files, headings, citations, and tags beside your editor.

---

Preview what you’re making.
GitHub-style Markdown, code highlighting, math.

---

Copy as Rich Text when you need to paste into email|Docs|Pages.
Export RTF when you need a file.

---

Find in this document.
Use Project Palette when the folder becomes the map.

---

Themes are part of your workspace.
Import|export a `litsquareink.config.json` and share it.

---

Keyboard-first when you want it.
Menus when you don’t.

---

AppleScript can automate Ink.
Read, append, format, and export from scripts.

---

Shortcuts and Siri can run App Intents.
Append, export, format, or search indexed projects.

---

Prompt (experimental): ask an AI to proofread|rewrite|summarize.
Review a diff. Apply only when it feels right.

---

Local-first by default.
Remote AI only when you choose it.

---

## Major features (most important → least important)

1. Distraction-free Markdown editing (plain text, fast, readable)
2. Wrap + Reading mode for long-form focus
3. TOC sidebar (jump by headings)
4. [v2] Project Palette (folder, file, heading, citation, and tag browsing)
5. Preview window (GitHub-style rendering, code highlight, math)
6. Copy as Rich Text + Export RTF
7. Find (current document)
8. Themes (import/export workspace config)
9. AppleScript automation (Ink Scripting dictionary)
10. Shortcuts & Siri actions (document and project App Intents)
11. Prompt window (experimental AI rewrite with diff + guarded apply)

---

## Features that make the difference

- [v2] Project Palette for Markdown folders, docs, notes, books, OKF bundles, and local Git clones
- Copy or drag Markdown links from project files and headings into the active editor
- [v2] Shortcuts and Siri project actions for files, headings, citations, and tags
- Preview templates (make preview/print/export match your style)
- Rich-text copy that keeps headings|emphasis|code readable
- Theme config you can commit to a repo and share with a team
- AppleScript automation for document text, selections, formatting, and export
- Shortcuts that run from Siri through App Intents
- AI with a diff + “apply only if unchanged” safety (experimental, opt-in)

---

## Automation

Automate Ink from AppleScript with the new command-only Ink Scripting dictionary. Read or update Markdown, append notes, format the current selection, and export HTML, PDF, RTF, or DOCX from scripts and automation tools.

Works from Script Editor, `osascript`, Raycast, Alfred, Keyboard Maestro, shell scripts, and other Apple Events clients. Commands can list open documents, get current document text, replace text, append text, read or replace selection, format selection, and export documents.

Build Shortcuts that act on open Ink documents, then run them from Siri. App Intents cover the current document, document text, append and replace actions, selection formatting, export, and AI command execution. Remote AI providers require explicit opt-in per Shortcut run.

Project App Intents expose folders opened in Ink. Shortcuts and Siri can list projects, find project files, headings, citations, and tags, open indexed files or headings, copy Markdown links, create project files and folders with confirmation, reveal files in Finder, and refresh the active project index.

No local server required. Ink receives user-authorized Apple Events and App Intents, keeping automation native to macOS.

```sh
osascript -e 'tell application "LitSquare MD" to get ink text'
osascript -e 'tell application "LitSquare MD" to append ink text "Next note" separator double newline'
osascript -e 'tell application "LitSquare MD" to export ink document as PDF'
```
