# CLAUDE PROJECT CONTEXT

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
