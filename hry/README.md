# Jak nahrát novou hru

1. Otevři složku podle třídy, pro kterou je hra: `1-trida`, `2-trida`, `3-trida`, `4-trida`, `5-trida`
   (hra jen pro zábavu patří do `pro-zabavu`). Nová třída? Pojmenuj složku třeba `6-trida`.
2. Vpravo nahoře klikni na **Add file → Upload files** a přetáhni tam hru (soubor `.html`).
3. Soubor pojmenuj **bez diakritiky a bez mezer**, třeba `kouzelne-pocty.html`.
4. Dole klikni na **Commit changes**. Za minutku je hra na webu.

## Co má být uvnitř hry

Do hlavičky hry (mezi `<head>` a `</head>`) vlož tyhle řádky:

```html
<meta name="predmet" content="Matematika">
<meta name="description" content="Krátce, o čem hra je.">
<script src="/hra.js"></script>
```

- `predmet` – v menu se ukáže barevný štítek. Můžeš psát: Matematika, Čeština, Angličtina,
  Prvouka, Vlastivěda, Přírodověda, Informatika, Hudební výchova, Tělocvik.
- `hra.js` – hra dostane tlačítko **🏠 Domů** a sváteční ozdoby (Vánoce, Halloween, Velikonoce…).

## Náhled v menu

Obrázek do složky `nahledy` pojmenuj stejně jako hru, jen s koncovkou `.jpg`
(např. `kouzelne-pocty.jpg`). Když obrázek chybí, ukáže se zmenšená živá hra.

## Vyzkoušet jiný svátek

Na konec adresy přidej `?svatek=vanoce` – třeba `theodorek.cz/?svatek=halloween`.
Svátky: novy-rok, valentyn, masopust, zima, velikonoce, carodejnice, den-deti,
prazdniny, skola, podzim, halloween, martin, mikulas, vanoce,
den-ucitelu, maj, den-vitezstvi, cyril-metodej, hus, svaty-vaclav, vesmir, vznik-csr, 17-listopad.

## Stránka o svátcích

Kliknutím na Theovu fotku se otevře `svatky.html` – co se slaví, jak, zajímavost a kvíz.
Texty jsou přímo v `svatky.html` (objekt `OBSAH`). Když přidáš nový svátek do `hra.js`,
přidej mu tam i povídání, jinak se na stránce neukáže.
