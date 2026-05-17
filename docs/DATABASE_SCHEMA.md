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
