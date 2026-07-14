# Data Model

## Основные сущности

### User

- id
- status
- phone/email
- locale
- city
- created_at
- privacy_settings

### UserProfile

- user_id
- display_name
- avatar
- level
- reputation
- preferences

### Business

- id
- legal_name
- display_name
- category
- partner_status
- verification_status

### BusinessLocation

- id
- business_id
- address
- coordinates
- working_hours

### Receipt

- id
- user_id
- business_id
- location_id
- original_file
- status
- purchase_date
- total_amount
- currency
- receipt_number
- fiscal_id
- fraud_score
- created_at

### ReceiptItem

- id
- receipt_id
- name
- quantity
- amount
- category

### PointsAccount

- id
- user_id
- balance

### PointsTransaction

- id
- account_id
- type
- amount
- source_type
- source_id
- status
- created_at

### Lottery

- id
- type
- start_at
- lock_at
- draw_at
- status
- rules_version

### LotteryTicket

- id
- lottery_id
- user_id
- receipt_id
- status
- issued_at

### Reward

- id
- business_id
- title
- points_cost
- stock
- valid_from
- valid_to
- status

### RewardClaim

- id
- reward_id
- user_id
- points_transaction_id
- code
- status
- expires_at

### Review

- id
- user_id
- receipt_id
- business_id
- rating
- attributes
- comment
- status

### Notification

- id
- user_id
- type
- channel
- payload
- status

### AuditLog

- id
- actor_type
- actor_id
- action
- entity_type
- entity_id
- before
- after
- created_at

## Ключевые связи

```text
User 1---N Receipt
Business 1---N BusinessLocation
Business 1---N Receipt
Receipt 1---0..1 Review
Receipt 1---0..N LotteryTicket
User 1---1 PointsAccount
PointsAccount 1---N PointsTransaction
Reward 1---N RewardClaim
Lottery 1---N LotteryTicket
```

### UserGoal

- id
- user_id
- reward_id
- target_points
- current_points
- status
- selected_at
- completed_at

### DailyOpportunity

- id
- business_id
- campaign_id
- title
- benefit_type
- benefit_value
- starts_at
- ends_at
- eligibility
- limits
- status

### Campaign

- id
- business_id
- campaign_type
- audience
- budget
- attribution_window
- starts_at
- ends_at
- status

### CampaignAttribution

- id
- campaign_id
- user_id
- receipt_id
- attribution_type
- customer_type
- value
- created_at

### ScanSession

- id
- user_id
- receipt_count
- status
- started_at
- completed_at
