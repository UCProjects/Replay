# Undercards Replay

The website for watching recorded [Undercards](https://undercards.net) games: browse recent games, search by player, soul or story fight, step through a replay, and keep favorites.

Games are recorded by a separate service. This repository is only the website, built with React, MUI and Vite on Firebase (Firestore, Storage, Auth, Functions and Hosting).

## Running locally

Requires Node 24.

```sh
npm ci
npm start
```

The site runs at <http://localhost:8000> and reads the live Firebase project. Sign-in and the plans list are proxied to the deployed functions by `vite.config.ts`.

To point the callable functions at a local emulator instead, set `VITE_FUNCTIONS_EMULATOR=1` in `.env.local`.

## Checks

```sh
npm run lint
npm test
npm run build
```

`npm run lint` runs ESLint and the TypeScript compiler, `npm test` runs Vitest.

## Images

Card, artifact and other game images live in `public/images`. `npm run images` downloads new or changed ones from the game. It needs `UC_USER` and `UC_PASSWORD` in `.env`.

## Deploying

Pushing to `master` builds the site and deploys it to Firebase Hosting. Pull requests get a preview channel.
