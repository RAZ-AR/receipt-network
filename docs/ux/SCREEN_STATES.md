# Screen States

Every data-driven screen must define the following states when applicable.

## Global states

- initial loading;
- skeleton loading;
- empty;
- partial data;
- success;
- recoverable error;
- blocking error;
- offline;
- permission denied;
- session expired.

## Receipt states

### Captured

The image exists locally and has not been uploaded.

### Uploading

Show progress and allow safe retry.

### Processing

Explain that OCR and verification are running. Do not promise points yet.

### Needs rescan

Show the quality issue and a direct camera CTA.

### Pending manual review

Show expected next step without claiming a guaranteed outcome.

### Verified

Show extracted merchant, amount, points, tickets and goal progress.

### Duplicate

Show the previous submission date and receipt reference.

### Rejected

Show a human-readable reason and dispute path when allowed.

### Suspicious or blocked

Use neutral language and route to support; do not expose antifraud rules.

## Reward states

- available;
- almost affordable;
- goal selected;
- out of stock;
- reserved;
- issued;
- redeemed;
- expired;
- cancelled;
- disputed.

## Lottery states

- upcoming;
- open;
- locked;
- drawing;
- results published;
- winner pending claim;
- prize claimed;
- claim expired.

## Opportunity states

- scheduled;
- active;
- viewed;
- activated where required;
- completed;
- limit reached;
- expired;
- ineligible.

## Business campaign states

- draft;
- scheduled;
- active;
- paused;
- budget reached;
- completed;
- cancelled;
- under review.

## Empty-state guidance

An empty state should explain:

1. why there is no content;
2. what value becomes available later;
3. one primary next action.

Examples:

- no receipts -> Scan your first receipt;
- no tickets -> A verified receipt adds a ticket;
- no active goal -> Choose a reward to track progress;
- no campaigns -> Create the first measurable promotion.
