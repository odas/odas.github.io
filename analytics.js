/* odas.github.io — visitor counting.
 *
 * WHY (2026-08-22): Google Search Console reports GOOGLE SEARCH ONLY. It cannot see
 * a referral from catadoption.in, from Instagram, or from anywhere else. Links into
 * this site carry utm_source / utm_campaign, and this file is the far end of them.
 *
 * ONE FILE ON PURPOSE, matching catadoption.in's setup: the tool choice lives here
 * only, so swapping tools later is a one-file edit.
 *
 * GoatCounter: no cookies, no personal data, no consent banner, ~3.5KB. It reads
 * utm_source / utm_campaign off the URL into a Campaigns dashboard with no config.
 * The site code "odas" is its own GoatCounter site, separate from catadoption's.
 *
 * 2026-09-15: the "what brought you here?" panel and its chip events were removed
 * with the page rebuild (OD: a trial feature for a catadoption inquiry flow). Only
 * the count remains. ⚠ The ruler for this site is NAME SEARCH, not traffic — never
 * draw a conclusion from one snapshot of these numbers.
 */

(function () {
  var SITE_CODE = "odas";
  var local = ["localhost", "127.0.0.1", ""].indexOf(location.hostname) > -1 ||
              location.protocol === "file:";
  if (local) return;
  window.goatcounter = { endpoint: "https://" + SITE_CODE + ".goatcounter.com/count" };
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  document.head.appendChild(s);
})();
