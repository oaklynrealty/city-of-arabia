# Google Apps Script Blacklist Check

Files in this folder:

- `Code.gs`: Publish this as a Google Apps Script web app.

Required Google Sheet headers:

- `first_name`
- `last_name`
- `phone_number`
- `email`
- `blacklisted`
- `status`
- `date_added`
- `source`
- `reason`

Basic setup:

1. Create or open the blacklist Google Sheet.
2. Open `Extensions` -> `Apps Script`.
3. Replace the default script with the contents of `Code.gs`.
4. In Apps Script, open `Project Settings` -> `Script properties`.
5. Add:
   - `BLACKLIST_SPREADSHEET_ID`
   - `BLACKLIST_SHEET_NAME`
6. Deploy as a Web App:
   - Execute as: `Me`
   - Who has access: `Anyone`
7. Copy the `/exec` URL.
8. Paste that URL into:
   - `src/project-data.mjs`
   - `blacklistCheckUrl`

After updating the URL, rebuild and redeploy the landing page.
