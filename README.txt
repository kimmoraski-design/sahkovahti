SÄHKÖVAHTI - ASENNUSOHJE

1. Pura ZIP-tiedosto tietokoneella.
2. Luo GitHubissa uusi julkinen repository, esimerkiksi sahkovahti.
3. Lataa kaikki puretut tiedostot repositoryn juureen.
4. Avaa Settings > Pages.
5. Valitse Deploy from a branch, main ja /root.
6. Avaa GitHub Pagesin antama HTTPS-osoite Androidin Chromessa.
7. Chromen valikko > Asenna sovellus.

Sovellus hakee hinnan avattaessa, tunnin välein ollessaan avoinna ja pyytää tuetulla Android/Chrome-yhdistelmällä myös taustasynkronointia. Android päättää taustasynkronoinnin toteutumisajasta, joten täsmällistä tunnin väliä ei voida taata sovelluksen ollessa suljettuna.

Hinta: snt/kWh, sisältää ALV:n. Ei sisällä sähkönmyyjän marginaalia, perusmaksua, siirtoa eikä sähköveroa.
Rajapinta: https://api.porssisahko.net/v2/price.json
