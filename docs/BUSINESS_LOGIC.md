# BUSINESS LOGIC

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
