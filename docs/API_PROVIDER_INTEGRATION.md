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

- Validate provider responses
