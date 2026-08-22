/* odas.github.io — visitor counting + the "what brought you here?" signal.
 *
 * WHY (2026-08-22): this site had GSC but no analytics, so referrals were invisible.
 * ⚠ Google Search Console reports GOOGLE SEARCH ONLY. It cannot see a referral from
 * catadoption.in, from Instagram, or from anywhere else. The banner link on
 * catadoption.in/adoptable.html carries ?utm_source=catadoption&utm_campaign=services,
 * and until this file was added nothing at this end read that tag — it arrived and
 * was thrown away. This is the far end of that link.
 *
 * ONE FILE ON PURPOSE, matching catadoption.in's setup: the site code and the tool
 * choice live here only, so swapping tools later is a one-file edit.
 *
 * GoatCounter: no cookies, no personal data, no consent banner, ~3.5KB. It reads
 * utm_source / utm_campaign off the URL into a Campaigns dashboard with no config.
 *
 * ⚙ SETUP — this needs its OWN GoatCounter site, separate from catadoption's, so the
 * two sets of stats don't mix. In GoatCounter: Settings → Sites → "Add new site",
 * pick a code (e.g. "odas"), then put it below. Until then this file does nothing.
 */

(function () {
  var SITE_CODE = "odas";

  // Where the one-line answers should go. Leave "" to use email (works with no setup
  // at all); paste a Google Form URL to switch to a form — nothing else needs changing.
  // A form is the better mobile experience, since mailto: is unreliable in the
  // Instagram in-app browser, which is where a lot of this traffic arrives from.
  var FORM_URL = "";
  var EMAIL = "orpita.d@gmail.com";

  var configured = SITE_CODE !== "REPLACE_ME";
  var local = ["localhost", "127.0.0.1", ""].indexOf(location.hostname) > -1 ||
              location.protocol === "file:";

  if (configured && !local) {
    window.goatcounter = { endpoint: "https://" + SITE_CODE + ".goatcounter.com/count" };
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    document.head.appendChild(s);
  }

  /* Record one "what brought you here" answer.
   *
   * ⚠ This fires on the CHIP TAP, not on the message being sent — deliberately.
   * The whole point is to learn what people want even when they never write to me,
   * and most people never will. A funnel that only measures completions measures
   * the small tail and calls it the population. */
  function track(key) {
    if (!window.goatcounter || !window.goatcounter.count) return;
    try {
      window.goatcounter.count({
        path: "why/" + key,
        title: "What brought you here: " + key,
        event: true
      });
    } catch (e) { /* counting must never break the page */ }
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* localStorage is per-browser and can throw outright in private mode, so every
     read and write is guarded and the page must behave correctly with no stored
     value at all. A visitor who cleared their data simply gets asked once more. */
  var REMEMBER = "odas.ask.v1";
  function seen() {
    try { return localStorage.getItem(REMEMBER); } catch (e) { return null; }
  }
  function remember(v) {
    try { localStorage.setItem(REMEMBER, v); } catch (e) { /* nothing to do */ }
  }

  ready(function () {
    /* ---- the panel: open/close, and the one gentle auto-open ---- */
    var ask = document.getElementById("ask");
    var pill = document.getElementById("ask-pill");
    var panelEl = document.getElementById("ask-panel");
    var closeBtn = document.getElementById("ask-close");

    if (ask && pill && panelEl) {
      var opened = false;

      function openAsk(auto) {
        if (ask.classList.contains("is-open")) return;
        panelEl.hidden = false;
        // let the browser paint hidden=false before transitioning, or there is no animation
        requestAnimationFrame(function () { ask.classList.add("is-open"); });
        pill.setAttribute("aria-expanded", "true");
        opened = true;
        if (auto) track("panel/auto-shown");
      }

      function closeAsk(permanent) {
        ask.classList.remove("is-open");
        pill.setAttribute("aria-expanded", "false");
        var done = function () { panelEl.hidden = true; };
        setTimeout(done, 220);
        if (permanent) remember("dismissed");
        try { pill.focus(); } catch (e) {}
      }

      pill.addEventListener("click", function () { openAsk(false); });
      if (closeBtn) closeBtn.addEventListener("click", function () { closeAsk(true); });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && ask.classList.contains("is-open")) closeAsk(true);
      });

      /* ⚠ NEVER on load. It waits for a reason to believe the visitor is engaged:
         half the page scrolled, or 30 seconds. Whichever comes first, once only,
         and never if they have already dismissed or answered. */
      if (!seen()) {
        var fired = false;
        var maybe = function () {
          if (fired || opened || seen()) return;
          fired = true;
          openAsk(true);
        };
        var onScroll = function () {
          var h = document.documentElement;
          var max = h.scrollHeight - h.clientHeight;
          if (max > 0 && (h.scrollTop || document.body.scrollTop) / max > 0.5) {
            window.removeEventListener("scroll", onScroll);
            maybe();
          }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        setTimeout(maybe, 30000);
      }
    }

    var chips = [].slice.call(document.querySelectorAll("[data-why]"));
    var panel = document.getElementById("why-followup");
    var box = document.getElementById("why-line");
    var send = document.getElementById("why-send");
    var copy = document.getElementById("why-copy");
    var done = document.getElementById("why-done");
    if (!chips.length || !panel) return;

    var chosen = "";
    var chosenLabel = "";

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-on"); });
        chip.classList.add("is-on");
        chosen = chip.getAttribute("data-why");
        chosenLabel = chip.textContent.trim();
        track(chosen);
        remember("answered");

        if (FORM_URL) {
          window.open(FORM_URL + (FORM_URL.indexOf("?") > -1 ? "&" : "?") +
                      "usp=pp_url&entry.reason=" + encodeURIComponent(chosenLabel), "_blank");
          return;
        }
        panel.hidden = false;
        if (box) box.focus();
      });
    });

    function line() { return (box && box.value.trim()) || ""; }

    if (send) {
      send.addEventListener("click", function () {
        track(chosen + "/sent");
        var subject = "From odas.github.io — " + (chosenLabel || "hello");
        var body = (line() || "(no note)") + "\n\n— sent from odas.github.io";
        location.href = "mailto:" + EMAIL +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
      });
    }

    // Mail clients don't always open, especially inside the Instagram browser.
    // Copying is the fallback that always works.
    if (copy) {
      copy.addEventListener("click", function () {
        var text = chosenLabel + (line() ? " — " + line() : "") + "\n" + EMAIL;
        var show = function () {
          track(chosen + "/copied");
          if (done) { done.hidden = false; }
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(show, show);
        } else {
          var t = document.createElement("textarea");
          t.value = text; document.body.appendChild(t); t.select();
          try { document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(t);
          show();
        }
      });
    }
  });
})();
