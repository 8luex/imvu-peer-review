// ==UserScript==
// @name         Peer Review 1.0
// @namespace    http://tampermonkey.net/
// @version      2026-11-13
// @description  按 Catalog Location 筛选商品：匹配时打开 Classic 并自动投票，否则 Skip。
// @match        https://www.imvu.com/peer_review/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imvu.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const allowedCategories =
  /\b(?:Hair|Heads|Tails|Eyebrows|Shoes|Nails|Glasses|Eyes)\b/i;

function execute() {
  const catalogLocation = document
    .querySelector("#location p")
    ?.textContent.trim();

  if (!catalogLocation) {
    console.warn("[Peer Review] Catalog Location is missing; no action taken.");
    return;
  }

  if (!allowedCategories.test(catalogLocation)) {
    const skipLink = document.querySelector(
      'a[href="javascript:skipReview();"]',
    );
    if (skipLink) {
      skipLink.click();
    } else {
      console.warn("[Peer Review] Skip link is missing; no action taken.");
    }
    return;
  }

  // The page randomizes IDs, so use the link protocol, input name and button class.
  const classicLink = document.querySelector(
    'a[href^="imvuclassic:PeerReview"]',
  );
  const noIssues = document.querySelector('input[name="no_issues"]');
  const submitButton = document.querySelector("button.submit-vote");

  if (!classicLink || !noIssues || !submitButton) {
    console.warn("[Peer Review] Review controls are missing; no action taken.");
    return;
  }

  classicLink.click();
  if (!noIssues.checked) {
    noIssues.click();
  }

  setTimeout(
    () => {
      if (!submitButton.disabled && !submitButton.classList.contains("wait")) {
        submitButton.click();
      }
    },
    rand(25000, 35000),
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", execute, { once: true });
} else {
  execute();
}
