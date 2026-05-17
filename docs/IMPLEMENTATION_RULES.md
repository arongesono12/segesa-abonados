# Project: Electrical Services Payment Platform

# Estructura Profesional de Documentación Markdown

```txt
/docs
│
├── CLAUDE.md
├── BUSINESS_LOGIC.md
├── IMPLEMENTATION_RULES.md
├── API_PROVIDER_INTEGRATION.md
├── PAYMENT_GATEWAYS.md
├── DATABASE_SCHEMA.md
├── SECURITY_RULES.md
├── TRANSACTION_FLOW.md
├── ERROR_HANDLING.md
├── TESTING_CHECKLIST.md
└── FEATURES/
    ├── auth.md
    ├── electricity-bills.md
    ├── payment-processing.md
    ├── wallet-system.md
    └── notifications.md
```

---

# 1. CLAUDE.md

```md
# CLAUDE PROJECT CONTEXT

## Project Type

Electricity bill payment platform.

The application allows users to:

- Consult electricity invoices
- View payment history
- Pay bills using multiple payment providers
- Store transaction history
- Receive notifications

---

# Core Stack

Frontend:

- React Native + Expo
- TypeScript
- Expo Router
- Zustand
- React Query

Backend:

- Supabase
- PostgreSQL
- Edge Functions

---

# Mandatory Rules

Claude MUST read:

1. BUSINESS_LOGIC.md
2. SECURITY_RULES.md
3. IMPLEMENTATION_RULES.md
4. API_PROVIDER_INTEGRATION.md
5. PAYMENT_GATEWAYS.md

---

# Critical Constraints

- Financial consistency is mandatory.
- Payment states must never become inconsistent.
- Transactions must be auditable.
- Every payment must generate logs.
- Duplicate payments must be prevented.
- API failures must not corrupt balances.

---

# Development Rules

- Never place payment logic inside UI.
- Always use services.
- Use typed responses.
- Validate all API payloads.
- Use centralized error handling.
- Use retry logic for external APIs.

---

# Forbidden Actions

Claude MUST NOT:

- Hardcode secrets
- Skip payment validation
- Ignore failed API responses
- Modify balances manually
- Bypass authentication
```

---

# 2. BUSINESS_LOGIC.md

```md
# BUSINESS LOGIC

# 1. User Roles

## Customer

- Can consult electricity bills
- Can pay invoices
- Can view payment history
- Can receive notifications

## Administrator

- Can monitor transactions
- Can manage providers
- Can suspend accounts
- Can access audit logs

---

# 2. Electricity Bill Flow

1. User selects electricity provider
2. User enters customer reference number
3. System requests invoice from provider API
4. Provider API returns invoice details
5. User confirms payment
6. Payment gateway processes transaction
7. Provider API confirms invoice settlement
8. Transaction stored in database
9. User receives confirmation

---

# 3. Payment States

- CREATED
- PENDING
- PROCESSING
- SUCCESS
- FAILED
- REVERSED
- CANCELLED

---

# 4. Financial Rules

- Duplicate payments are forbidden
- Invoice reference must be unique per payment
- Every successful payment must generate receipt
- Failed payments must rollback safely
- Timeouts require reconciliation process

---

# 5. Validation Rules

## Customer Number

- Required
- Minimum length validation
- Provider format validation

## Payments

- Positive amount only
- Currency validation
- Daily limits validation

---

# 6. Reconciliation

If payment gateway succeeds but provider API fails:

- Mark transaction as REQUIRES_RECONCILIATION
- Notify administrators
- Prevent duplicate retry

---

# 7. Audit Rules

All operations must store:

- User ID
- Timestamp
- Provider response
- Payment gateway response
- Device info
- Transaction ID
```

---

# 3. API_PROVIDER_INTEGRATION.md

```md
# ELECTRICITY PROVIDER API INTEGRATION

# 1. Objective

Connect the application with electricity provider APIs.

---

# 2. Integration Architecture

Frontend
↓
Supabase Edge Function
↓
Electricity Provider API
↓
Payment Gateway
↓
Database Storage

---

# 3. Invoice Consultation Flow

Endpoint:
POST /provider/invoice

Request:
{
"provider": "SEGESA",
"customerNumber": "12345678"
}

Expected Response:
{
"customerName": "John Doe",
"amount": 15000,
"currency": "XAF",
"dueDate": "2026-05-20",
"invoiceNumber": "INV-2026-0001"
}

---

# 4. Payment Confirmation Flow

Endpoint:
POST /provider/pay

Request:
{
"invoiceNumber": "INV-2026-0001",
"amount": 15000,
"transactionId": "TX123456"
}

---

# 5. Timeout Handling

If provider API does not respond:

- Retry 3 times
- Log failure
- Prevent duplicate charges
- Notify support team

---

# 6. Security Requirements

- API keys stored in environment variables
- Signed requests required
- HTTPS only
- Validate provider responses
```

---

# 4. PAYMENT_GATEWAYS.md

```md
# PAYMENT GATEWAYS

# Supported Payment Methods

- Mobile Money
- Credit Card
- Bank Transfer
- Wallet Balance

---

# 1. Payment Processing Rules

- Payment requests must be idempotent
- Duplicate requests must return same transaction
- Every provider requires unique transaction ID

---

# 2. Payment Flow

1. User selects payment method
2. System creates payment session
3. Gateway processes payment
4. Gateway returns callback/webhook
5. System validates callback signature
6. Transaction marked SUCCESS or FAILED

---

# 3. Webhook Validation

Required:

- Signature validation
- Timestamp validation
- Provider transaction ID validation

---

# 4. Failed Payments

If gateway fails:

- Mark FAILED
- Store failure reason
- Allow retry
- Prevent double debit

---

# 5. Reversal Rules

Reversal allowed only when:

- Provider confirms failure
- Duplicate payment detected
- Manual admin approval
```

---

# 5. IMPLEMENTATION_RULES.md

```md
# IMPLEMENTATION RULES

# 1. Architecture

Frontend:

- React Native + Expo

Backend:

- Supabase
- PostgreSQL

---

# 2. Folder Structure

src/
├── app/
├── components/
├── services/
├── hooks/
├── store/
├── types/
├── utils/
├── constants/
├── providers/
└── features/

---

# 3. API Rules

- Never call APIs directly from screens
- Use service layer
- Use typed responses
- Centralized API client only

---

# 4. State Management

- Zustand for global state
- React Query for API cache
- Avoid duplicated states

---

# 5. Database Rules

- Use UUIDs
- Never delete transactions
- Use soft delete
- Audit every payment

---

# 6. Error Handling

- All async functions require try/catch
- Use centralized error parser
- Never expose raw provider errors to UI

---

# 7. Security

- JWT required
- Sensitive data encrypted
- No secrets in frontend
- Use environment variables

---

# 8. Code Quality

- Use TypeScript strict mode
- Reusable hooks required
- Avoid duplicated logic
- Max component size: 300 lines
```

---

# 6. DATABASE_SCHEMA.md

```md
# DATABASE SCHEMA

# Tables

## users

- id
- email
- phone
- created_at

---

## electricity_providers

- id
- name
- api_url
- status

---

## invoices

- id
- provider_id
- customer_number
- invoice_number
- amount
- due_date
- status

---

## payments

- id
- user_id
- invoice_id
- gateway
- transaction_id
- amount
- status
- created_at

---

## audit_logs

- id
- user_id
- action
- metadata
- created_at
```

---

# 7. SECURITY_RULES.md

```md
# SECURITY RULES

# Authentication

- JWT mandatory
- Session expiration required
- Refresh token rotation

---

# Payment Security

- Validate webhook signatures
- Encrypt sensitive payloads
- Prevent replay attacks

---

# API Security

- Rate limiting
- IP validation
- HTTPS required
- API key rotation

---

# Audit Security

Store:

- Login attempts
- Payment attempts
- Failed requests
- Suspicious activity
```

---

# 8. ERROR_HANDLING.md

```md
# ERROR HANDLING

# Standard Error Response

{
"success": false,
"error": {
"code": "PAYMENT_FAILED",
"message": "Payment could not be processed"
}
}

---

# Common Errors

## INVALID_CUSTOMER_NUMBER

Customer reference invalid.

## PROVIDER_TIMEOUT

Electricity provider unavailable.

## PAYMENT_GATEWAY_ERROR

Payment provider failed.

## DUPLICATE_TRANSACTION

Transaction already processed.
```

---

# 9. TESTING_CHECKLIST.md

```md
# TESTING CHECKLIST

# Authentication

- [ ] User registration
- [ ] Google login
- [ ] Apple login
- [ ] JWT expiration

---

# Invoice Consultation

- [ ] Valid customer number
- [ ] Invalid customer number
- [ ] Provider timeout
- [ ] Invoice parsing

---

# Payments

- [ ] Successful payment
- [ ] Failed payment
- [ ] Duplicate payment
- [ ] Webhook validation
- [ ] Reconciliation flow

---

# Security

- [ ] Rate limiting
- [ ] Unauthorized requests
- [ ] Token validation
- [ ] Replay attack prevention
```

---

# Recomendación Profesional

Para que Claude, Cursor o Windsurf trabajen correctamente:

1. Mantén todos los markdown dentro de `/docs`
2. Usa ejemplos reales
3. Documenta edge cases
4. Añade diagramas Mermaid
5. Mantén reglas financieras explícitas
6. Define estados de pagos claramente
7. Documenta webhooks y callbacks
8. Usa arquitectura basada en services

---

# Recomendación Arquitectónica Final

```txt
Mobile App
↓
Supabase Edge Functions
↓
Electricity Provider API
↓
Payment Gateway APIs
↓
PostgreSQL Database
↓
Notifications System
```
