# User Types and Flows

## Типы пользователей

### Guest

Может:

- увидеть onboarding;
- сканировать первый чек;
- увидеть предварительный результат.

Не может получить постоянный баланс без регистрации.

### Registered User

Может:

- загружать чеки;
- получать баллы;
- получать билеты;
- обменивать баллы;
- оставлять отзывы;
- управлять профилем.

### Business Owner

Может:

- подтверждать бизнес;
- управлять филиалами;
- создавать награды;
- видеть аналитику;
- отвечать на отзывы.

### Business Staff

Получает ограниченные права в зависимости от роли.

### Moderator

Проверяет спорные чеки, отзывы и жалобы.

### Platform Admin

Имеет полный операционный доступ.

## Flow: первый чек

```text
Landing/Onboarding
  -> Scan Receipt
  -> Image Quality Check
  -> OCR
  -> Verification
  -> Registration
  -> Receipt Linked to User
  -> Points Granted
  -> Ticket Issued
  -> Result Screen
```

## Flow: повторный чек

```text
Home
  -> Scan
  -> OCR
  -> Verification
  -> Result
  -> Optional Review
```

## Flow: обмен баллов

```text
Wallet
  -> Rewards
  -> Reward Details
  -> Confirm
  -> Reserve Points
  -> Issue QR/Promo Code
  -> Redeem
```

## Flow: розыгрыш

```text
Verified Receipt
  -> Ticket Issued
  -> Ticket Added to Draw
  -> Draw Locked
  -> Winner Selected
  -> Notification
  -> Prize Claim
```

## Flow: бизнес

```text
Business Registration
  -> Verification
  -> Add Locations
  -> Create Reward
  -> Activate Campaign
  -> View Analytics
  -> Respond to Reviews
```

## Критические edge cases

- чек не читается;
- чек уже загружен;
- сумма распознана неправильно;
- чек старше допустимого срока;
- награда закончилась;
- QR-код награды не принимается;
- победитель не отвечает;
- чек подтвержден, затем признан мошенническим;
- пользователь удаляет аккаунт.

## Flow: выбор цели

```text
Home -> Rewards -> Reward Details -> Set as Goal -> Home Progress -> Receipt Verified -> Goal Updated
```

## Flow: возможность дня

```text
Home -> Opportunity -> Conditions -> Partner Visit -> Purchase -> Scan -> Attribution -> Enhanced Benefit
```

## Flow: пакетное сканирование

```text
Scanner -> Receipt 1 -> Add Another -> Receipt 2..N -> Queue -> Results -> Session Summary
```

## Home hierarchy

Home показывает максимум три блока: награда, билеты и возможность дня.
