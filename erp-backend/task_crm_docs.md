# Task: Create CRM Frontend Integration Guide

## Objective

Create comprehensive documentation (`CRM_FRONTEND_GUIDE.md`) to guide the frontend development of the CRM module, specifically addressing the "Dual-Engine" (Lite vs Enterprise) requirement.

## Scope

1.  **Architecture Overview**: Explain how the single backend supports two UI modes.
2.  **Lite Mode Spec**:
    - UI Components: Contact List, Quick Add Modal.
    - API Mapping: `/crm/leads`, `/crm/leads/{id}/convert`.
3.  **Enterprise Mode Spec**:
    - UI Components: Kanban Board, Deal Activity Timeline, Analytics Dashboard.
    - API Mapping: `/crm/deals/{id}/stage`, `/crm/activities`, `/crm/stats`.
4.  **Data Dictionary**: TypeScript interfaces for Lead, Deal, Activity.

## Rationale

The user requested "docs fromt" [docs frontend] immediately after the CRM backend expansion. This document bridges the gap between the completed API and the upcoming UI work.
