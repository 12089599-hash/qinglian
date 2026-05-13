# Cloud Account, Leaderboard, and App Store Design

## Goal

Add an account path for App Store release without blocking early play: players can start as guests, then bind an email account for cloud save, leaderboard, and cross-device recovery. Phone binding can be added later after an SMS provider is configured.

## Recommended Approach

Use Supabase as the first backend because it gives email/password auth, database, row-level security, and server functions with less custom infrastructure than building a full backend from scratch. The client must keep guest play working, but ranked/cloud accounts treat the server as the source of truth.

## Player Flow

- New players enter as guests and can play immediately with local cache.
- The account panel shows guest status, cloud status, and a clear action to register or log in by email.
- Binding an account uploads a one-time guest snapshot. That imported progress is useful for recovery, but leaderboard eligibility starts from the server-accepted snapshot time to reduce old local-save cheating.
- Logged-in players pull the cloud save first. Local storage becomes a cache and emergency export, not the ranked source of truth.
- Account deletion must be available in-app before App Store submission because the app creates accounts.

## Cloud Save Boundary

The browser currently saves serializable game state under `idle-xianxia-save-v1`. That stays for guest mode and app offline cache. Cloud mode adds a `cloudMeta` record with user id, sync time, rank eligibility, and last accepted server revision.

The client may render predictions and animations, but leaderboard-relevant state is accepted only after server validation. In the first implementation, the client submits compact action events and save snapshots. Later, the server can move more simulation rules from validation to full authority.

## Leaderboard

Leaderboards should use server-written score snapshots only:

- realm and layer
- verified depth progress
- verified boss progress
- verified combat profile score
- last accepted server time

Local guest saves are never shown on the leaderboard. Imported guest saves can keep the player's progress, but ranked rows should start from a server-tracked baseline.

## Anti-Cheat

Do not rely on local IP bans. Local bans are easy to bypass and can punish shared networks. Use server-side account bans as the primary action. IP, device id, request rate, impossible resource deltas, impossible offline time, and repeated invalid action submissions are risk signals.

The server rejects impossible changes instead of trusting uploaded resource totals. For example, the client should not submit "I now have 1,000,000 spirit stones"; it should submit "I claimed mission X at time Y", and the server calculates the reward.

## App Store Path

The Capacitor iOS shell remains the fastest route. The app bundle already uses `com.qinglan.cave` and portrait orientation. Before upload:

- build fresh web assets into `www`
- sync iOS assets
- archive with the paid Apple Developer team
- upload through Xcode Organizer or App Store Connect API credentials
- provide privacy policy, support URL, app screenshots, account deletion, and privacy nutrition answers

## First Implementation Scope

This pass should create the cloud-ready foundation without blocking the current game:

- account/cloud status UI
- cloud client module with configured and unconfigured states
- email auth UI shell wired to a provider adapter
- save export/import kept as backup
- leaderboard UI fed by server rows when configured
- Supabase schema and edge-function stubs
- App Store checklist and iOS build verification

Full phone SMS login and strict server-side simulation can follow once the email cloud path is working.

## Risks

- Real email registration cannot work until a backend project URL and public anon key are configured.
- Phone login requires SMS configuration and may add review/privacy friction.
- App Store upload may still require a manual Apple login prompt or API key.
- Existing large `browserGame.js` increases regression risk, so changes should be isolated through small adapters and tested with smoke tests.
