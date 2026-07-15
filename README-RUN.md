ANGEL DALE 2.0 (static site) – How to run

This folder contains a plain static multi-page website. There is no package.json/build step.

Run:
1) Open index.html in a browser.
   - C:\ANGELDALE2.0\index.html
2) Ensure relative paths work:
   - index.html loads: css/style.css and js/script.js
   - pages use: images/* and js/script.js

Troubleshooting:
- If the page is blank:
  - Open DevTools (F12) -> Console and check for JS errors.
  - Check Network tab for 404s (css/style.css or js/script.js or images/*).
- If styling is missing:
  - Open DevTools -> Console and check for CSS parse errors.

Main known external dependency:
- Google Fonts import in css/style.css (fonts.googleapis.com).
- Phosphor Icons via https://unpkg.com (loaded with defer).

