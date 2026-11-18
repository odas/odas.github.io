/* odas.github.io — visits and link clicks.
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
 * with the page rebuild (OD: a trial feature for a catadoption inquiry flow).
 * The ruler for this site is NAME SEARCH, not traffic — never
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

  function pageName(pathname) {
    var path = pathname.replace(/\/index\.html$/, "/").replace(/^\/|\/$/g, "");
    if (path === "Orpita_Das_Resume.pdf") return "resume";
    return path.replace(/\.html$/, "") || "home";
  }

  function linkDestination(link) {
    if (link.protocol === "mailto:") return "email";
    if (link.protocol !== "https:" && link.protocol !== "http:") return "";

    // The event name describes the destination without its query string.
    if (link.origin !== location.origin) {
      return link.hostname.replace(/^www\./, "") + link.pathname.replace(/\/$/, "");
    }
    var page = pageName(link.pathname);
    if (!link.hash) return page;
    var section = "section/" + link.hash.slice(1);
    return page === pageName(location.pathname) ? section : page + "/" + section;
  }

  // One listener per activation type also covers links rendered by the career map.
  function countLinkClick(event) {
    if (event.button !== (event.type === "auxclick" ? 1 : 0)) return;
    var link = event.target.closest?.("a[href]");
    if (!link || link.hasAttribute("data-goatcounter-click")) return;

    var destination = linkDestination(link);
    if (!destination || typeof window.goatcounter.count !== "function") return;

    window.goatcounter.count({
      path: "click/" + pageName(location.pathname) + "/" + destination,
      title: destination + " from " + pageName(location.pathname),
      event: true,
      no_session: true,
    });
  }

  document.addEventListener("click", countLinkClick, true);
  document.addEventListener("auxclick", countLinkClick, true);
})();
