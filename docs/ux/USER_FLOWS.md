# User Flows

## Flow 1 — First receipt

```text
Open app
  -> Value proposition
  -> Scan receipt
  -> Image quality check
  -> Upload
  -> OCR and verification
  -> Registration or sign-in
  -> Receipt linked to account
  -> Points granted
  -> Ticket issued
  -> Result and goal progress
```

### Failure branches

- poor image -> rescan;
- missing receipt data -> manual confirmation or review;
- duplicate -> explain previous submission;
- suspicious -> pending review without promising a reward;
- registration abandoned -> preserve temporary receipt for a limited period.

## Flow 2 — Batch scan

```text
Open scanner
  -> Capture receipt
  -> Add another
  -> Review batch
  -> Upload queue
  -> Individual processing states
  -> Session summary
```

## Flow 3 — Select a reward goal

```text
Home or Rewards
  -> Browse rewards
  -> Reward details
  -> Set as active goal
  -> Home progress card
  -> Verified receipts update progress
  -> Goal completed
  -> Claim reward
```

## Flow 4 — Redeem a reward

```text
Reward available
  -> Confirm terms
  -> Reserve points
  -> Issue QR or code
  -> Partner validates
  -> Mark redeemed
  -> Show receipt and support path
```

## Flow 5 — Lottery

```text
Receipt verified
  -> Ticket issued
  -> Ticket shown in current draw
  -> Draw locked
  -> Winner selection
  -> Notification
  -> Claim instructions
  -> Prize claimed or expired
```

## Flow 6 — Opportunity of the day

```text
Home opportunity card
  -> View conditions
  -> Visit partner
  -> Purchase
  -> Scan receipt
  -> Attribute campaign
  -> Grant enhanced benefit
```

## Flow 7 — Verified review

```text
Receipt result
  -> Review invitation
  -> Rating and attributes
  -> Optional comment
  -> Submit
  -> Moderation if required
  -> Business response
```

## Flow 8 — Business campaign

```text
Business overview
  -> Create campaign
  -> Select objective
  -> Configure benefit, audience, limits and dates
  -> Preview
  -> Activate
  -> Confirmed purchases attributed
  -> Analytics
  -> Repeat or adjust campaign
```
