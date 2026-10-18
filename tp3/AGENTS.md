Single Expo Router mobile app (university assignment "TP3"). No backend, no tests, no CI. Prioritize mobile-first patterns and cross-platform behavior.

## Expo has changed — do not trust your training data

1. Read the `expo` major version in `package.json` (currently SDK 57; RN 0.86, React 19.2, TS 6).
2. Fetch matching docs: `https://docs.expo.dev/versions/v57.0.0/`
3. For anything Expo/EAS/React Native, start at `https://docs.expo.dev/llms.txt` and follow its links to the specific page — never answer from memory.

## Commands

Package manager is **npm** (`package-lock.json` only).

```bash
npx expo install <pkg>   # always for deps — resolves SDK-compatible versions
npx expo start           # dev server; regenerates typed-route types
npx tsc --noEmit         # the only real verification step in this repo
npx expo-doctor          # dependency/config diagnosis
npx expo install --fix   # repair SDK-incompatible versions
```

- No ESLint, Prettier, or test setup exists. `npm run lint` (`expo lint`) fails — don't rely on it.
- Run `npx tsc --noEmit` before declaring a task done. Known gotcha: on a fresh clone it reports two unrelated errors about `*.module.css` / `@/global.css` side-effect imports. `expo-env.d.ts` (gitignored, written by the first `expo start`) supplies those declarations, so run the dev server once, then ignore/expect nothing else.
- Never run `npm run reset-project`: it deletes/moves all of `src/` and `scripts/` to `example/`.
- The repo has **no commits yet** — files are staged for an initial commit.

## Layout

- Routes live in `src/app/` (`index.tsx`, `explore.tsx`); `_layout.tsx` is the only navigator. Keep components/hooks/utils outside `src/app/`.
- Path alias `@/*` → `./src/*`, `@/assets/*` → `./assets/*` (see `tsconfig.json`). Use it instead of relative paths.
- The tab bar is platform-split: `src/components/app-tabs.tsx` uses `expo-router/unstable-native-tabs` (native), while `app-tabs.web.tsx` uses `expo-router/ui` `Tabs`. Adding or renaming a screen means editing `_layout.tsx` and **both** tab files. `*.web.ts(x)` overrides are the convention (`use-color-scheme.web.ts`, `animated-icon.web.tsx`).
- The screens, `README.md`, and `scripts/reset-project.js` are the stock SDK 57 `create-expo-app` template — the README is not a spec for this app. `TP3.pdf` in the root is the assignment brief; it's a PDF, so extract its text yourself rather than trying to read it directly.

## Config quirks (`app.json`)

- `experiments.typedRoutes: true` — `Link`/`router` hrefs are type-checked; route types are generated into gitignored `.expo/types` on `expo start`.
- `experiments.reactCompiler: true` — don't add manual `useMemo`/`useCallback`/`memo` for performance; the compiler handles it.
- `ios/` and `android/` are absent and generated (Continuous Native Generation). Never create or edit them; configure native behavior via `app.json` and config plugins.

## Building / shipping

EAS does cloud builds, submissions, and OTA updates; no local Xcode/Android Studio needed. There is no `eas` binary installed — use `npx eas-cli@latest <command>`.

- Expo Go only bundles default native modules. After adding a library with native code, a development build is required: `npx expo run:ios|android` or `eas build --profile development`.
- Prefer built-in/recommended Expo modules over third-party libraries. Docs: https://docs.expo.dev/eas/index.md
