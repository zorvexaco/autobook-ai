AUTOBOOK AI STATIC DEMO DEPLOY PACKAGE

This package is for getting the website live smoothly on Netlify without backend functions.

Deploy settings:
- Build command: leave blank
- Publish directory: .
- Environment variables: none needed for this static demo

Main routes:
/            -> index.html
/app         -> autobook-production.html
/demo        -> salon-demo.html
/analytics   -> analytics-dashboard.html
/settings    -> settings-admin.html
/billing     -> autobook-billing.html

If using manual deploy:
1. Unzip this folder.
2. Drag the unzipped folder into Netlify manual deploy.
3. Do not upload the ZIP itself unless Netlify specifically asks for a ZIP.
