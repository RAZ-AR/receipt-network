# UI Component Inventory

## Principles

- Components express product states, not decoration.
- Every interactive component has loading, disabled, success and error behavior where relevant.
- Receipt, points and lottery status must never rely on color alone.
- The scan CTA remains visually dominant on consumer surfaces.

## Foundations

### App Shell

- top app bar;
- bottom navigation;
- modal sheet;
- full-screen flow container;
- safe-area wrapper.

### Typography

- display promise;
- screen title;
- section title;
- body;
- supporting text;
- numeric balance;
- status label.

### Actions

- primary button;
- secondary button;
- text button;
- icon button;
- destructive action;
- floating scan action.

### Inputs

- phone/email input;
- OTP input;
- search field;
- filter chip;
- rating selector;
- multiline review field.

## Product Components

### BalanceHeader

Shows current points and optional expiring amount.

### GoalCard

Fields:

- reward image;
- title;
- current points;
- target points;
- progress bar;
- remaining amount;
- CTA.

States:

- no goal;
- active;
- nearly complete;
- completed;
- reward unavailable.

### LotteryCard

- ticket count;
- draw date;
- prize preview;
- countdown;
- CTA.

### DailyOpportunityCard

- partner;
- benefit;
- expiry;
- eligibility;
- status.

### ScanButton

- idle;
- pressed;
- permission required;
- offline;
- uploading.

### ReceiptCaptureFrame

- edge detection;
- quality hint;
- glare warning;
- too far/too close;
- capture success.

### ScanQueueItem

- thumbnail;
- sequence number;
- upload state;
- quality state;
- retry/delete.

### ReceiptResultSummary

- merchant;
- amount;
- receipt status;
- points granted;
- tickets issued;
- goal movement.

### ReceiptStatusBadge

Values:

- processing;
- verified;
- manual review;
- rejected;
- duplicate;
- suspicious.

### RewardCard

- image;
- title;
- partner;
- points price;
- stock;
- distance;
- active-goal indicator.

### RewardRedemptionCode

- QR/code;
- expiry;
- usage instructions;
- redeemed state.

### ReviewPrompt

- verified purchase marker;
- rating;
- reason chips;
- optional comment;
- disclosure that reward does not depend on sentiment.

### PartnerCard

- logo;
- category;
- location;
- partner multiplier;
- current campaign;
- verified-review rating.

## Feedback Components

- inline error;
- toast;
- success celebration;
- empty state;
- skeleton;
- blocking error;
- confirmation dialog;
- offline banner.

## Accessibility Requirements

- minimum touch target 44x44;
- readable dynamic type;
- screen-reader labels;
- progress exposed as text and semantic value;
- error copy includes recovery action;
- motion can be reduced;
- countdowns do not update too aggressively for assistive technology.
