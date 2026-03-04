# CRM Module: Features & Frontend Integration Guide

This document outlines the **CRM Module** features and provides a comprehensive guide for building the **Frontend** using our "Dual-Engine" philosophy (Lite vs. Enterprise).

---

## 🚀 1. CRM Backend Features (Implemented)

The backend (`app/crm/`) provides a robust API supporting:

| Feature             | Description                                     | API Endpoint                   |
| :------------------ | :---------------------------------------------- | :----------------------------- |
| **Lead Management** | Create, Update, and Track Leads.                | `POST /crm/leads`              |
| **Status Pipeline** | Strict flow: `NEW` → `CONTACTED` → `QUALIFIED`. | `POST /crm/leads/{id}/status`  |
| **Deal Conversion** | Atomic conversion of Qualified Leads to Deals.  | `POST /crm/leads/{id}/convert` |
| **Deal Stages**     | Manage Sales Pipeline (`Discovery` → `Won`).    | `POST /crm/deals/{id}/stage`   |
| **Activity Log**    | Track Calls, Meetings, Emails (Manual + Auto).  | `POST /crm/activities`         |
| **Analytics**       | Real-time Pipeline Value & Conversion Rates.    | `GET /crm/stats`               |

---

## 🎨 2. Frontend Strategy: Lite vs. Enterprise

We do not build two apps. We build **one app** that adapts its UI based on the workspace type.

### 🟢 LITE MODE (Small Business / Solo)

**Philosophy**: "Speed & Simplicity". Minimal clicks. No complex pipelines.

#### **Key Components:**

1.  **Contact List (The Hub)**
    - **View**: A simple list of Leads.
    - **Sort**: By "Status" (Newest first).
    - **Actions**:
      - `Call` button (opens phone/skype).
      - `Convert` button (visible only if "Qualified").
    - **Data Source**: `GET /crm/leads`.

2.  **Quick Action: "Mark as Won"**
    - **UI**: Instead of a drag-and-drop pipeline, use a simple toggle or button on the deal.
    - **Action**: Calls `POST /crm/deals/{id}/stage` with `stage="WON"`.

3.  **Analytics**:
    - **UI**: A single card showing "Total Sales This Month".

---

### 🏢 ENTERPRISE MODE (Large Teams / Sales Ops)

**Philosophy**: "Visibility & Control". Deep insights. Detailed history.

#### **Key Components:**

1.  **Kanban Pipeline Board**
    - **View**: Columns for each Deal Stage (`Discovery`, `Proposal`, `Negotiation`, `Won`).
    - **Interaction**: Drag & Drop cards between columns.
    - **Action**: Calls `update_deal_stage` on drop.
    - **Data Source**: `GET /crm/deals` (grouped by stage).

2.  **Customer 360 View**
    - **View**: A detailed page for a specific Lead/Deal.
    - **Tabs**:
      - _Details_: Phone, Email, Address.
      - _Activity Timeline_: List of all Calls/Emails (`GET /crm/activities`).
      - _Action Log_: "User X changed status to Qualified".

3.  **Executive Dashboard**
    - **Charts**: Conversion Rate Funnel, Sales Forecast.
    - **Data Source**: `GET /crm/stats`.

---

## 🛠️ 3. TypeScript Interfaces (Frontend)

Use these interfaces in your React/Vue/Angular frontend to ensure type safety with the Backend.

```typescript
// Status & Stage Enums
type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
type DealStage = "DISCOVERY" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";

interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  created_at: string;
}

interface Deal {
  id: number;
  lead_id: number;
  title: string;
  value: number;
  stage: DealStage;
  created_at: string;
}

interface Activity {
  id: number;
  type: "CALL" | "EMAIL" | "MEETING" | "NOTE";
  note: string;
  performed_by: number; // User ID
  created_at: string;
}

interface PipelineStats {
  pipeline_value: number;
  deals_by_stage: Record<DealStage, number>;
  lead_stats: {
    total: number;
    converted: number;
    rate: number;
  };
}
```

## 🔗 4. API Integration Cheatsheet

| action        | method | url                      | body                                |
| :------------ | :----- | :----------------------- | :---------------------------------- |
| **New Lead**  | `POST` | `/crm/leads`             | `{ "name": "..." }`                 |
| **Qualify**   | `POST` | `/crm/leads/:id/status`  | `{ "status": "QUALIFIED" }`         |
| **Convert**   | `POST` | `/crm/leads/:id/convert` | `{ "title": "Deal", "value": 100 }` |
| **Log Call**  | `POST` | `/crm/activities`        | `{ "type": "CALL", "note": "..." }` |
| **Move Deal** | `POST` | `/crm/deals/:id/stage`   | `{ "stage": "WON" }`                |

---

### ✅ Next Steps for Frontend Dev:

1.  Setup `CRMContext` to fetch Leads/Deals.
2.  Create `LeadList` component (Lite).
3.  Create `PipelineBoard` component (Enterprise).
