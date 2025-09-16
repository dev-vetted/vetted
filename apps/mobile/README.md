# Mobile (Expo)

## Setup

Create a `.env` file in this directory and set:

```
API_URL=https://YOUR-TUNNEL-URL
```

- Use an Expo Tunnel URL so your physical device can reach your local API.
- Example: start the web API (web-bff) locally, then start Expo and choose Tunnel in Dev Tools.

## Running

- `pnpm --filter @vetted/mobile start`
- `pnpm --filter @vetted/mobile android`
- `pnpm --filter @vetted/mobile ios`

## Environment

- `API_URL` is read in `app.config.ts` via `import 'dotenv/config'` and exposed as `expoConfig.extra.apiUrl`.
- The app reads it using `expo-constants` and calls `${API_URL}/api/health`.

## Notes

- On a phone, `localhost` will not resolve to your laptop; use Tunnel.
- If you change `.env`, restart the Expo server so the config reloads.
