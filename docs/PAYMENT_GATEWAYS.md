# PAYMENT GATEWAYS

# Supported Payment Methods

- Mobile Money
- Credit Card
- Bank Transfer
- Wallet Balance
- MuniDinero
- RosaMoney
- Ecobank Pay

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
