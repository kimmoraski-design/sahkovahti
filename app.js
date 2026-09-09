const ENDPOINT = "https://api.porssisahko.net/v2/price.json";
const CACHE_KEY = "sahkovahti-last-price-v1";
const ONE_HOUR = 60 * 60 * 1000;
let timer;

const el = id => document.getElementById(id);
const formatter = new Intl.DateTimeFormat("fi-FI", {timeZone:"Europe/Helsinki",hour:"2-digit",minute:"2-digit",day:"2-digit",month:"2-digit"});

function setStatus(text, type="") {
  el("status").textContent = text;
  el("status").className = "status " + type;
}
function quarterPeriod(date) {
  const start = new Date(date);
  start.setMinutes(Math.floor(start.getMinutes()/15)*15,0,0);
  const end = new Date(start.getTime()+15*60*1000);
  return formatter.format(start) + " - " + new Intl.DateTimeFormat("fi-FI", {timeZone:"Europe/Helsinki",hour:"2-digit",minute:"2-digit"}).format(end);
}
function show(data, offline=false) {
  el("price").textContent = Number(data.price).toLocaleString("fi-FI", {minimumFractionDigits:2,maximumFractionDigits:3});
  el("period").textContent = quarterPeriod(new Date(data.at));
  el("checked").textContent = formatter.format(new Date(data.checkedAt));
  setStatus(offline ? "Näytetään viimeksi tallennettu hinta" : "Hinta ajan tasalla", offline ? "" : "ok");
}
async function updatePrice(force=false) {
  const saved = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  if (!force && saved && Date.now() - new Date(saved.checkedAt).getTime() < ONE_HOUR) { show(saved); return; }
  setStatus("Haetaan hintaa...");
  try {
    const now = new Date();
    const response = await fetch(ENDPOINT + "?date=" + encodeURIComponent(now.toISOString()), {cache:"no-store"});
    if (!response.ok) throw new Error("HTTP " + response.status);
    const json = await response.json();
    if (typeof json.price !== "number") throw new Error("Virheellinen vastaus");
    const data = {price:json.price, at:now.toISOString(), checkedAt:new Date().toISOString()};
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    show(data);
  } catch (error) {
    if (saved) show(saved, true);
    else setStatus("Hintaa ei saatu. Tarkista verkkoyhteys.", "bad");
  }
}
async function enablePeriodicSync() {
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.register("service-worker.js");
  if ("periodicSync" in registration) {
    try { await registration.periodicSync.register("update-price", {minInterval:ONE_HOUR}); } catch (_) {}
  }
}
el("refresh").addEventListener("click", () => updatePrice(true));
document.addEventListener("visibilitychange", () => { if (!document.hidden) updatePrice(false); });
updatePrice(false);
clearInterval(timer);
timer = setInterval(() => updatePrice(true), ONE_HOUR);
enablePeriodicSync();