# Las Páginas Perdidas de Nuestra Historia

A small static web page (HTML/CSS/JS, no build step) for Irene: a 3-day love challenge, Nov 9–13, 2026.

| Page | Opens | Content |
|------|-------|---------|
| Prólogo | Mon Nov 9, 08:00 | Intro letter and rules |
| Capítulo I: El Pasado | Tue Nov 10, 08:00 | Letter, riddle, challenge: recreate an early photo |
| Capítulo II: El Presente | Wed Nov 11, 08:00 | Letter, riddle, challenge: 3 objects + their memories |
| Capítulo III: El Futuro | Thu Nov 12, 08:00 | Letter, riddle, challenge: our bucket list |
| Epílogo | Fri Nov 13, 08:00 | Final letter and gallery of her 3 photos |

A chapter opens only when its date/time has passed **and** the previous chapter is complete. A chapter is complete once she uploads a photo.

## Files

- `config.js`: **the only file you need to edit**. Letters, riddles, hiding spots, challenge texts, and dates.
- `tarjetas.html`: printable cards with each challenge, to hide around the house. Blue notes (not printed) remind you where each one goes.
- `index.html`, `app.js`, `styles.css`: the site.

## Before giving her the link

1. Write your three letters in `config.js` (replace the `[Miguel: ...]` placeholders).
2. If you hide the cards somewhere other than the defaults (her favourite book, the fridge, under her pillow), update `escondite` and the `pista` riddle.
3. Open `tarjetas.html`, print, cut, and hide the cards.
4. Test everything with `?modo=miguel` (see below).

## Test mode

Open `https://<user>.github.io/<repo>/?modo=miguel`. Everything is unlocked, and photos are stored separately from the real ones, so testing on her phone does not affect her progress. Use the banner button to clear the test photos.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000  (or http://localhost:8000/?modo=miguel)
```

## Publish on GitHub Pages

1. Create a repository and push these files to the root of the `main` branch.
2. Settings → Pages → Source: "Deploy from a branch" → `main` / `/ (root)`.
3. The site will be at `https://<user>.github.io/<repo>/`.

## Notes

- Photos are saved only in her phone's browser (IndexedDB). They survive closing the browser, but are lost if she clears browsing data or uses private/incognito mode. She should always open the link in the same browser.
- Locks use the phone's clock. That's fine for a gift, but they are not tamper-proof.
- On a free GitHub plan the repository must be public for Pages, so anyone with the repo URL can read `config.js` (including the letters). Use a neutral repo name and don't share the repo link, only the Pages link.
