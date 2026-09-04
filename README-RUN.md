# ANGEL DALE 2.0 (static site) – How to run

This folder contains a plain static multi-page website. There is no package.json/build step.

## Easiest way (VS Code) – press F5

1. Open this folder in VS Code and press **F5** (Run & Debug).
   - VS Code automatically starts the local server (`node server.js`, port 8080) and then opens
     **http://localhost:8080/index.html** in Chrome (or Edge – pick it in the debug dropdown).
   - The server task also auto-starts whenever the folder is opened, so `http://localhost:8080`
     keeps working while the workspace is open.

## From a terminal (without VS Code)

```
node server.js
```

Then open **http://localhost:8080** in your browser. (Python alternative: `python -m http.server 8080`)

## Without any server

Double-click `index.html` – the site also works directly from `file://` (no modules or fetch calls used).

## Troubleshooting

- **"localhost refused to connect"** – the server isn't running. Press F5 in VS Code, or run `node server.js`.
- **"Port 8080 already in use"** – a server is already running; just open http://localhost:8080.
- If the page is blank:
  - Open DevTools (F12) -> Console and check for JS errors.
  - Check the Network tab for 404s (css/style.css, js/script.js, images/*).
- If styling is missing:
  - Open DevTools -> Console and check for CSS parse errors.

## Main known external dependency

- Google Fonts import in css/style.css (fonts.googleapis.com).
- Phosphor Icons via https://unpkg.com (loaded with defer).


