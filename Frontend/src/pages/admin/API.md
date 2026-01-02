# API Documentation - Admin Dashboard

## Overview
This page displays key metrics and statistics for the entire organization including active employees, working hours, ongoing projects, validated documents, monthly activity chart, and pending leave requests.

## Required APIs

### 1. Get Dashboard Statistics
**Endpoint:** `GET /api/admin/dashboard/statistics`

**Description:** Fetch key dashboard metrics

**Response:**
```json
{
  "employesActifs": 45,
  "departments": 3,
  "heuresCeMois": 3240,
  "projetsEnCours": 12,
  "projetsTerminesThisMois": 6,
  "documentsValides": 156,
  "trends": {
    "employees": { "value": 12, "isPositive": true },
    "hours": { "value": 8, "isPositive": true },
    "projects": { "value": 5, "isPositive": true },
    "documents": { "value": 23, "isPositive": true }
  }
}
```

### 2. Get Monthly Activity Data
**Endpoint:** `GET /api/admin/dashboard/monthly-activity`

**Description:** Fetch monthly statistics for projects and interventions

**Query Parameters:**
- `year` (optional): Year filter (default: current year)
- `month` (optional): Month filter (default: all months)

**Response:**
```json
[
  { "month": "Jan", "projets": 4, "interventions": 12 },
  { "month": "Fév", "projets": 3, "interventions": 15 },
  { "month": "Mar", "projets": 5, "interventions": 18 }
]
```

### 3. Get Pending Leave Requests
**Endpoint:** `GET /api/admin/dashboard/pending-leaves`

**Description:** Fetch pending leave requests for dashboard display

**Query Parameters:**
- `limit` (optional): Number of leaves to return (default: 3)
- `statut` (optional): Filter by status ("En attente", "Approuvé", "Refusé")

**Response:**
```json
[
  {
    "id": 1,
    "code": "RH-CG-2025-0001",
    "employe": "Karim Idrissi",
    "dateDebut": "2025-01-15",
    "dateFin": "2025-01-20",
    "type": "Congé annuel",
    "jours": 5
  }
]
```

### 4. Get Recent Activity
**Endpoint:** `GET /api/admin/dashboard/recent-activity`

**Description:** Fetch recent system activity for display

**Query Parameters:**
- `limit` (optional): Number of activities to return (default: 5)

**Response:**
```json
[
  {
    "id": 1,
    "type": "projet_created",
    "description": "Projet créé: Automatisation ligne de production",
    "user": "Admin",
    "timestamp": "2024-12-20T10:30:00Z"
  }
]
```

### 5. Get Department Overview
**Endpoint:** `GET /api/admin/dashboard/department-overview`

**Description:** Fetch overview data for all departments

**Response:**
```json
[
  {
    "id": 1,
    "nom": "IT",
    "employes": 12,
    "projets": 5,
    "heures": 960,
    "productivite": 85
  }
]
```

## Key Data Models

### Statistics Object
- `employesActifs`: number
- `departments`: number
- `heuresCeMois`: number
- `projetsEnCours`: number
- `projetsTerminesThisMois`: number
- `documentsValides`: number
- `trends`: object with trend data

### Trend Object
- `value`: number
- `isPositive`: boolean

### Leave Request Object
- `id`: number
- `code`: string (RH-CG-YYYY-XXXX)
- `employe`: string
- `dateDebut`: string (YYYY-MM-DD)
- `dateFin`: string (YYYY-MM-DD)
- `type`: string
- `jours`: number

## Notes
- All dates should be in ISO 8601 format (YYYY-MM-DD)
- All timestamps should be in ISO 8601 format with timezone (YYYY-MM-DDTHH:MM:SSZ)
- Statistics should be cached with a 5-minute TTL for performance
- Real-time data updates recommended for critical metrics
