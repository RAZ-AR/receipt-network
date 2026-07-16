# @beleg/mobile

Expo (React Native) app for Beleg. Implements the soft-glass design from [DESIGN_DIRECTION.md](../../DESIGN_DIRECTION.md); the approved layouts and flow are in the clickable prototype.

> **Status:** first screens written, **not yet installed or built** (no `pnpm install`, no simulator run). The stack (Expo) is recommended in [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) but not yet fixed in an ADR. Treat as a reviewable starting slice, not a running app.

## What's here

- `src/theme/tokens.ts` — design tokens (colors, aura, gradients, radii, typography, shadow/glass notes). Start here.
- `src/theme/index.ts` — token re-export + `raisedShadow` and `fontFamily` helpers.
- `src/components/` — `Aura`, `NeoSurface`, `GlassButton`, `ProgressRing`, `Dock` (soft-glass building blocks).
- `src/screens/` — `Onboarding`, `Auth`, `Scanner`, `Result` (state-driven), `Home`, `Wallet`, `Rewards` (two tabs), `History`, `Profile`.
- `src/screens/index.ts` — screen registry mirroring the prototype (tabs = dock, rest stacked).
- `App.tsx` — native-stack navigator: flow (Onboarding → Scanner → Result → Home + Auth) and dock tabs (Home / Wallet / Rewards / History / Profile). Loads Manrope via `@expo-google-fonts/manrope`.

`ResultScreen` renders any `ReceiptResultState` (SUCCESS + the 4 error states) from `@beleg/shared-types`. `RewardsScreen` has the two tabs (catalog + srećke) and star-to-track, using `MAX_ACTIVE_GOALS`.

Next screens to build: Lottery, RewardDetails, Review, Redemption, Notifications, Batch — plus real `expo-camera` in Scanner and the TaxCore journal parser in Recognition.

## Soft-glass in React Native

CSS effects from the mockups map to RN libraries:

| Mockup effect | RN approach |
| --- | --- |
| Neumorphic double shadow | `react-native-shadow-2` (two shadows) or pre-rendered images |
| Liquid-glass dock / CTA | `expo-blur` BlurView + translucent overlay + hairline border |
| Holographic aura | `expo-linear-gradient` (masked) or a blurred gradient image |
| Progress ring gradient | `react-native-svg` + gradient stroke |
| Manrope font | `expo-font`, bundle the latin-ext variable file |

## Getting started (once the stack is confirmed)

```bash
pnpm install
pnpm mobile:dev
```

Screens to build (Sprint 1 first): Onboarding, Auth, Home, Scanner, Result + states.
