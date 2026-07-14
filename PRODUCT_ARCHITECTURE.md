# Product Architecture

**Статус:** Product-level architecture  
**Принцип:** модульные домены с событийным взаимодействием

# 1. Центральный объект

Центральный объект системы — подтвержденный чек.

```text
Receipt Uploaded
  -> Recognized
  -> Verified
  -> Points
  -> Ticket
  -> Goal Progress
  -> Review Eligibility
  -> Partner Attribution
  -> Analytics
```

# 2. Product Domains

## Identity
Регистрация, сессии, роли, согласия и приватность.

## Receipt Capture
Камера, галерея, пакетное сканирование, quality check и очередь загрузки.

## Receipt Recognition
OCR, продавец, дата, сумма, номер, QR, позиции и confidence score.

## Receipt Verification
Обязательные поля, срок, уникальность, фискальная проверка, допустимость и ручная проверка.

## Fraud & Risk
Image fingerprint, device risk, duplicate detection, лимиты, risk score и блокировки.

## Points
Базовое начисление, партнерский multiplier, списание, отмена, expiration и ledger.

## Goal Engine
Выбранная награда, целевое количество баллов, текущий прогресс и уведомления.

## Lottery
Билеты, розыгрыши, lock участников, выбор победителя, получение приза и аудит.

## Daily Opportunity
Предложение дня, срок, условие, партнер, лимиты, атрибуция и результат.

## Rewards
Каталог, inventory, стоимость, доступность, резерв и redemption.

## Reviews
Eligibility по чеку, оценка, атрибуты, комментарий, ответ бизнеса и модерация.

## Business Directory
Организация, филиалы, категории, партнерский статус и карточка.

## Campaigns & Attribution
Охват, повышенные баллы, promoted placement, подтвержденная покупка, новый или повторный клиент и ROI.

## Business Portal
Карточка, награды, кампании, отзывы, аналитика и сотрудники.

## Notifications
Goal progress, lottery, daily opportunity, reward expiration и receipt result.

## Analytics
Уникальные сканирующие пользователи, подтвержденные чеки, retention, reward conversion, partner attribution, fraud и unit economics.

## Admin & Operations
Ручная проверка, пользователи, партнеры, розыгрыши, корректировки, жалобы и аудит.

# 3. Main Events

- `UserRegistered`
- `ReceiptUploaded`
- `ReceiptRecognized`
- `ReceiptVerified`
- `ReceiptRejected`
- `ReceiptFlagged`
- `PointsGranted`
- `PointsRevoked`
- `GoalSelected`
- `GoalProgressUpdated`
- `TicketIssued`
- `DailyOpportunityViewed`
- `CampaignAttributed`
- `RewardReserved`
- `RewardRedeemed`
- `ReviewSubmitted`
- `WinnerSelected`

# 4. Event Flow

```text
ReceiptVerified
  |
  +--> PointsGranted
  |      |
  |      +--> GoalProgressUpdated
  |
  +--> TicketIssued
  +--> ReviewEligibilityCreated
  +--> CampaignAttributed
  +--> AnalyticsUpdated
  +--> NotificationScheduled
```

# 5. MVP Boundary

В MVP обязательны:

- Identity;
- Receipt Capture;
- Recognition;
- Verification;
- basic Fraud;
- Points;
- Goal Engine;
- Lottery;
- Rewards;
- Daily Opportunity;
- Reviews;
- Business Directory;
- basic Campaign Attribution;
- Business Portal;
- Notifications;
- Admin;
- Analytics.

Не входят:

- Family;
- Teams;
- Reputation graph;
- Social feed;
- City quests;
- AI recommendations;
- complex POS integrations.

# 6. Implementation Principle

Для MVP рекомендуется модульный монолит:

- единый backend;
- четкие доменные границы;
- единый transactional core;
- внутренние domain events;
- отдельные workers для OCR и уведомлений;
- ledger для баллов;
- audit log для критических операций.

Микросервисы не являются целью первого этапа.
