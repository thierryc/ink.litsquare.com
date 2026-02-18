/* global Typed */

const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
const canAnimate = !prefersReducedMotion && typeof Typed === "function";

const FINAL_TAGLINE = "A native Markdown editor for Markdown lover.";
const DIVIDER_FOR_BLOCK = "\n\n---\n\n";
const DIVIDER_FOR_ERASE = "\n\n---\n\n";

let storyTyped = null;
let storyPaused = false;

const INTRO_STATES = [
  "A distraction-free",
  "A simple",
  "A native Markdown editor for writer",
  "A native Markdown editor for developer",
  "A native Markdown editor for student",
  // BackDelay still applies, so subtract it from the requested 2s pause.
  `${FINAL_TAGLINE}^1100`,
];

const FEATURE_BLOCKS = [
  "Open a file. Start typing.\nKeep going.",
  "Markdown stays plain text.\nNo lock-in. No weird formats.",
  "See your Markdown as you write it.\nClean typography. Subtle syntax colors.",
  "Wrap lines|Don’t wrap lines.\nReading mode|full width.\nYour call.",
  "Use headings to shape a document.\nJump with a table of contents.",
  "Preview what you’re making.\nGitHub-style Markdown, code highlighting, math, image inline preview.",
  "Copy as Rich Text when you need to paste into email|Docs|Pages.\nExport RTF when you need a file.",
  "Find in this document.\nOr keep searching across visited files.",
  "Themes are part of your workspace.\nImport|export a `litsquareink.config.json` and share it.",
  "Keyboard-first when you want it.\nMenus when you don’t.",
  "Shortcuts & Siri can drive your writing.\nSmall automations, right inside the app.",
  "Prompt (experimental): ask an AI to proofread|rewrite|summarize.\nReview a diff. Apply only when it feels right.",
  "Local-first by default.\nRemote AI only when you choose it.",
];

function splitOutsideBackticks(text, delimiter) {
  const parts = [];
  let current = "";
  let inBackticks = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === "`") inBackticks = !inBackticks;

    if (char === delimiter && !inBackticks) {
      parts.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  parts.push(current);
  return parts;
}

function extractSharedTrailingPunctuation(parts) {
  if (parts.length < 2) return { parts, suffix: "" };

  const last = parts[parts.length - 1];
  const match = last.match(/^(.*?)([.!?]+)$/);
  if (!match) return { parts, suffix: "" };

  const baseLast = match[1];
  const suffix = match[2];
  if (!baseLast) return { parts, suffix: "" };

  const earlierHaveSuffix = parts.slice(0, -1).every((part) => part.endsWith(suffix));
  if (earlierHaveSuffix) return { parts, suffix: "" };

  return { parts: [...parts.slice(0, -1), baseLast], suffix };
}

function shouldTreatAsWholeLineAlternatives(parts) {
  if (parts.length !== 2) return false;
  const first = parts[0];
  const second = parts[1];

  // Short, phrase-level toggles like "Wrap lines|don’t wrap lines." or "Reading mode|full width."
  if (!first.includes(" ")) return false;
  if (first.trim().length > 24) return false;
  if (second.trim().length > 30) return false;

  const firstWordCount = first.trim().split(/\s+/).length;
  const secondWordCount = second.trim().split(/\s+/).length;
  return firstWordCount <= 3 && secondWordCount <= 4;
}

function buildLineVariants(line) {
  const rawParts = splitOutsideBackticks(line, "|");
  if (rawParts.length < 2) return [line];

  const trimmedParts = rawParts.map((part) => part.trim());
  const { parts, suffix } = extractSharedTrailingPunctuation(trimmedParts);

  if (shouldTreatAsWholeLineAlternatives(parts)) {
    return parts.map((part) => `${part}${suffix}`);
  }

  const first = parts[0];
  const lastSpace = first.lastIndexOf(" ");

  if (lastSpace >= 0) {
    const prefix = first.slice(0, lastSpace + 1);
    const variants = [first, ...parts.slice(1).map((part) => `${prefix}${part}`)];
    return variants.map((variant) => `${variant}${suffix}`);
  }

  // Pipe group at the very start, with shared suffix (e.g. "Import|export a …").
  if (parts.length >= 2) {
    const second = parts[1];
    const match = second.match(/^(\S+)(\s+[\s\S]*)$/);
    if (match) {
      const rest = match[2];
      const variants = [parts[0] + rest, ...parts.slice(1)];
      return variants.map((variant) => `${variant}${suffix}`);
    }
  }

  return parts.map((part) => `${part}${suffix}`);
}

function buildBlockVariantFrames(blockText) {
  const lines = blockText.split("\n");
  const variantsByLine = lines.map(buildLineVariants);
  const indices = new Array(lines.length).fill(0);

  const frames = [];

  const renderCurrent = () =>
    variantsByLine.map((variants, i) => variants[indices[i]] ?? "").join("\n").trimEnd();

  frames.push(renderCurrent());

  for (let lineIndex = 0; lineIndex < variantsByLine.length; lineIndex += 1) {
    const variants = variantsByLine[lineIndex];
    if (!variants || variants.length < 2) continue;

    for (let variantIndex = 1; variantIndex < variants.length; variantIndex += 1) {
      indices[lineIndex] = variantIndex;
      frames.push(renderCurrent());
    }
  }

  return frames;
}

function buildStoryFrames() {
  const frames = [];
  frames.push(...INTRO_STATES);

  const prefixForBlock = `${FINAL_TAGLINE}${DIVIDER_FOR_BLOCK}`;
  const prefixForErase = `${FINAL_TAGLINE}${DIVIDER_FOR_ERASE}`;

  for (const blockText of FEATURE_BLOCKS) {
    const blockFrames = buildBlockVariantFrames(blockText);
    for (const blockFrame of blockFrames) frames.push(prefixForBlock + blockFrame);
    frames.push(prefixForErase);
  }

  // typed.js strips pause markers from display; normalize for de-dupe.
  const stripPauses = (value) => value.replace(/\^\d+/g, "");
  const deduped = [];

  for (const frame of frames) {
    const normalized = stripPauses(frame).trimEnd();
    if (deduped.length) {
      const lastNormalized = stripPauses(deduped[deduped.length - 1]).trimEnd();
      if (normalized === lastNormalized) continue;
    }
    deduped.push(frame);
  }

  return deduped;
}

function renderFallback(storyEl) {
  const firstBlock = FEATURE_BLOCKS[0];
  storyEl.textContent = `${FINAL_TAGLINE}${DIVIDER_FOR_BLOCK}${firstBlock}`;
}

function updateAnimationToggleUI(buttonEl) {
  if (!buttonEl) return;

  const state = storyPaused ? "paused" : "playing";
  buttonEl.dataset.animationState = state;

  if (!canAnimate) {
    buttonEl.disabled = true;
    buttonEl.setAttribute("aria-label", "Animation unavailable");
    buttonEl.setAttribute("aria-disabled", "true");
    return;
  }

  buttonEl.disabled = false;
  buttonEl.removeAttribute("aria-disabled");
  buttonEl.setAttribute("aria-label", storyPaused ? "Play animation" : "Pause animation");
}

function bindAnimationToggle() {
  const buttonEl = document.querySelector('[data-action="toggle-animation"]');
  if (!buttonEl) return;

  updateAnimationToggleUI(buttonEl);

  if (buttonEl.dataset.bound === "true") return;
  buttonEl.dataset.bound = "true";

  buttonEl.addEventListener("click", () => {
    if (!canAnimate || !storyTyped) return;

    storyPaused = !storyPaused;
    if (storyPaused) {
      storyTyped.stop();
    } else {
      storyTyped.start();
    }

    updateAnimationToggleUI(buttonEl);
  });
}

function initStory() {
  const storyEl = document.getElementById("storyText");
  if (!storyEl) return;

  bindAnimationToggle();

  if (!canAnimate) {
    renderFallback(storyEl);
    return;
  }

  // Ensure a clean start (Typed will append a cursor span after the element).
  storyEl.textContent = "";

  const strings = buildStoryFrames();

  // Single narrative engine: each next string represents the next "human" state.
  // smartBackspace gives us partial erases so it feels like edits, not full resets.
  storyTyped = new Typed(storyEl, {
    strings,
    typeSpeed: 34,
    backSpeed: 22,
    backDelay: 900,
    smartBackspace: true,
    loop: true,
    showCursor: true,
    cursorChar: "▌",
    contentType: "null",
  });

  storyPaused = false;
  bindAnimationToggle();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStory);
} else {
  initStory();
}
