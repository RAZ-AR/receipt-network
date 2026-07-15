# Implementation Plan

**Статус:** черновик для старта разработки
**Область:** Core MVP (Phase 1 из [ROADMAP.md](ROADMAP.md))
**Опирается на:** [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md), [DATA_MODEL.md](DATA_MODEL.md), [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md), [DECISIONS.md](DECISIONS.md)

Как технически начать строить Beleg, чтобы не переделывать ядро. Документ не заменяет Discovery — часть доменов заблокирована открытыми вопросами (см. §6).

---

## 1. Рекомендуемый стек

End-to-end TypeScript — общие типы между приложением и бэкендом ускоряют итерации и убирают рассинхрон контрактов.

| Слой | Выбор | Почему |
|---|---|---|
| Мобильное приложение | **React Native + Expo** | кроссплатформа iOS/Android, быстрый цикл, достаточен для soft-glass дизайна |
| API | **tRPC** поверх модульного монолита | типобезопасные вызовы без ручного описания контрактов |
| Бэкенд | **Node.js (модульный монолит)** | ADR-P-007: единый backend, доменные границы, без ранних микросервисов |
| БД | **PostgreSQL** | транзакционное ядро, ledger баллов, audit log |
| Очереди/воркеры | **Redis + BullMQ** | отдельные воркеры для TaxCore-верификации, OCR fallback, уведомлений |
| ORM | **Prisma** | схема из DATA_MODEL.md, миграции, типы |
| Хранилище чеков | S3-совместимое (оригиналы изображений) | `original_file` из модели Receipt |

**Открытое решение:** стек не зафиксирован в ADR — нужно подтвердить (особенно RN/Expo vs нативная разработка) до старта. Всё остальное в плане от выбора стека не зависит.

## 2. Структура модульного монолита

Один процесс, чёткие доменные модули, взаимодействие через внутренние domain events (не прямые вызовы между доменами).

```
apps/
  mobile/            # Expo приложение (экраны из DESIGN_DIRECTION.md)
  api/               # модульный монолит
    modules/
      identity/          # регистрация, сессии, согласия
      receipt-capture/   # загрузка, quality check, очередь (ScanSession)
      recognition/       # QR decode + TaxCore API; OCR fallback (worker)
      verification/      # обязательные поля, дубликаты, срок 3 дня, fraud score
      fraud/             # fingerprint, device risk, лимиты, risk score
      points/            # ledger, начисление, отмена (идемпотентно)
      goal-engine/       # выбранная награда, прогресс
      lottery/           # билеты, розыгрыш  [заблокировано — §6]
      rewards/           # каталог, резерв, redemption
      daily-opportunity/ # предложение дня
      reviews/           # отзыв по чеку
      notifications/     # целевые уведомления (worker)
      analytics/         # North Star, retention, unit economics
      admin/             # ручная проверка, корректировки, аудит
    core/
      events/            # шина domain events
      ledger/            # идемпотентный ledger (общий примитив)
      audit/             # audit log критических операций
  workers/
      taxcore-verify/    # очередь верификации чеков
      ocr-fallback/      # OCR для нечитаемого QR
      notifications/
packages/
  shared-types/      # типы, общие для mobile и api (через tRPC)
```

## 3. Событийная цепочка (ядро)

Реализуется как domain events в `core/events` (из PRODUCT_ARCHITECTURE.md §4):

```
ReceiptUploaded → ReceiptRecognized → ReceiptVerified
  ├─ PointsGranted → GoalProgressUpdated
  ├─ TicketIssued
  ├─ ReviewEligibilityCreated
  ├─ CampaignAttributed
  └─ NotificationScheduled
```

Каждый обработчик идемпотентен по `source_type + source_id` — повторная доставка события не должна дублировать баллы или билеты (NFR: надёжность).

## 4. Критический путь: TaxCore/PURS

По [ADR-P-013](DECISIONS.md) распознавание — QR-first. **Это блокирует всё**, поэтому идёт первым:

1. Спайк: программный доступ к verification API (suf.purs.gov.rs / TaxCore) — условия, лимиты, регистрация ESD.
2. Клиентское декодирование QR (офлайн-поля: сумма, номер, дата).
3. Серверный запрос к verification API → авторитетные данные (продавец, позиции, налоги).
4. OCR fallback — только для нечитаемого QR и нефискальных чеков.

Пока §4.1 не закрыт — архитектура Recognition/Verification не финализируется.

## 5. Порядок спринтов

**Sprint 0 — каркас**
Репозиторий, CI, окружения, Prisma-схема из DATA_MODEL.md, шина событий, ledger + audit примитивы, локализация (сербская латиница/кириллица, RSD, форматы дат) — заложить сразу.

**Sprint 1 — вход и захват**
Identity (телефон + SMS OTP, сессии, согласия) · Receipt Capture (камера/галерея, quality check) · экраны Onboarding/Auth/Home/Scanner.

**Sprint 2 — распознавание и проверка**
TaxCore verification worker + OCR fallback · Verification (дубликаты, окно 3 дня, fraud score) · экраны Result и 5 состояний (успех + 4 ошибки).

**Sprint 3 — ценность**
Points ledger (идемпотентно) · Goal Engine · Rewards (каталог, резерв, redemption) · Wallet/Rewards/History/Profile.

Lottery, Daily Opportunity, Reviews, Notifications — после закрытия Discovery (§6) и подтверждения метрик Sprint 1–3.

## 6. Что заблокировано Discovery (не строить)

Из [RISKS_AND_CONSTRAINTS.md](RISKS_AND_CONSTRAINTS.md) и открытых вопросов PRD §16:

- **Lottery** — юридический статус розыгрышей в Сербии (могут регулироваться как азартные игры). Домен не проектировать до заключения.
- **Экономика Points** — кто финансирует базовые баллы за непартнёрские чеки. Механику ledger строить можно; коэффициенты начисления — конфиг, ждёт ответа.
- **TaxCore API на масштабе** — лимиты и условия (§4.1).
- **Партнёрская часть** (Business Portal, атрибуция) — Phase 2, после доказательства ядра.

## 7. Сквозное с первого дня

Переделывать позже дорого — закладываем сразу:

- идемпотентность Points и Tickets (ledger по `source_id`);
- audit log для админских корректировок баллов;
- fraud fingerprint + risk score, пусть в упрощённом виде;
- локализация (сербская латиница/кириллица, RSD, локальные даты);
- наблюдаемость: логи, метрики North Star, fraud monitoring, dashboard обработки чеков.
