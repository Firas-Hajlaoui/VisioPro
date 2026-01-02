# API Documentation - Engineering Interventions (IngenieriePage)

## Overview
Technical intervention management system for tracking field work, maintenance, installations, repairs, and audits across multiple client sites.

## Required APIs

### 1. Get All Interventions
**Endpoint:** `GET /api/admin/ingenierie/interventions`

**Description:** Fetch list of all technical interventions with filtering

**Query Parameters:**
- `page` (optional): Pagination page (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by code, client, or site
- `statut` (optional): Filter by status ("Planifiée", "En cours", "Terminée")
- `technicien` (optional): Filter by technician
- `type` (optional): Filter by intervention type ("Maintenance", "Installation", "Dépannage", "Audit")
- `client` (optional): Filter by client
- `date_from` (optional): Filter from date (YYYY-MM-DD)
- `date_to` (optional): Filter to date (YYYY-MM-DD)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "code": "ING-INT-2024-0089",
      "client": "ONCF",
      "site": "Rabat",
      "adresse": "Gare routière centrale",
      "technicien": "Youssef Alami",
      "date": "2024-12-22",
      "heureDebut": "08:00",
      "heureFin": "16:00",
      "type": "Maintenance",
      "description": "Maintenance préventive automate S7-1200",
      "statut": "Planifiée",
      "priorite": "Normal",
      "equipements": ["S7-1200", "Panneau de contrôle"],
      "rapport": null
    }
  ],
  "total": 120,
  "page": 1,
  "limit": 10
}
```

### 2. Get Intervention by ID
**Endpoint:** `GET /api/admin/ingenierie/interventions/{id}`

**Description:** Fetch detailed intervention information

**Response:** Returns single intervention object with full details

### 3. Create Intervention
**Endpoint:** `POST /api/admin/ingenierie/interventions`

**Request Body:**
```json
{
  "client": "string",
  "site": "string",
  "adresse": "string",
  "technicien": "string",
  "date": "YYYY-MM-DD",
  "heureDebut": "HH:MM",
  "heureFin": "HH:MM",
  "type": "Maintenance" | "Installation" | "Dépannage" | "Audit",
  "description": "string",
  "priorite": "Basse" | "Normal" | "Haute" | "Urgente",
  "equipements": ["string"]
}
```

**Response:** Returns created intervention with auto-generated code (ING-INT-YYYY-XXXX)

### 4. Update Intervention
**Endpoint:** `PUT /api/admin/ingenierie/interventions/{id}`

**Request Body:** Same as Create Intervention

**Response:** Returns updated intervention object

### 5. Delete Intervention
**Endpoint:** `DELETE /api/admin/ingenierie/interventions/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Intervention supprimée avec succès"
}
```

### 6. Update Intervention Status
**Endpoint:** `PATCH /api/admin/ingenierie/interventions/{id}/status`

**Request Body:**
```json
{
  "statut": "Planifiée" | "En cours" | "Terminée"
}
```

**Response:** Returns updated intervention

### 7. Submit Intervention Report
**Endpoint:** `POST /api/admin/ingenierie/interventions/{id}/rapport`

**Description:** Submit completion report for an intervention

**Request Body:**
```json
{
  "resultat": "Succès" | "Succès avec remarques" | "Partiellement complété" | "Problème non résolu",
  "description": "string",
  "tempsReel": "number (in minutes)",
  "coutReel": "number",
  "observations": "string",
  "prochainControle": "YYYY-MM-DD" (optional),
  "anomalies": ["string"] (optional)
}
```

**Response:**
```json
{
  "id": 1,
  "code": "ING-INT-2024-0089",
  "rapport": {
    "id": 1,
    "dateCreation": "2024-12-22T17:30:00Z",
    "resultat": "Succès",
    "description": "Intervention réalisée avec succès",
    "coutReel": 1500,
    "tempsReel": 480,
    "url": "/rapports/report-123.pdf"
  }
}
```

### 8. Get Intervention Report
**Endpoint:** `GET /api/admin/ingenierie/interventions/{id}/rapport`

**Description:** Fetch intervention completion report

**Response:** Returns report object with download URL

### 9. Upload Intervention Document
**Endpoint:** `POST /api/admin/ingenierie/interventions/{id}/documents`

**Description:** Upload supporting documents (photos, diagrams, etc.)

**Request:**
- Content-Type: multipart/form-data
- Field `file`: File to upload
- Field `type`: Document type ("Photo", "Schéma", "Certificat", "Autre")
- Field `description` (optional): Document description

**Response:** Returns created document object

### 10. Get Intervention Documents
**Endpoint:** `GET /api/admin/ingenierie/interventions/{id}/documents`

**Description:** Fetch all documents for an intervention

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nom": "Photo avant intervention",
      "type": "Photo",
      "url": "/documents/photo-123.jpg",
      "dateCreation": "2024-12-22",
      "taille": "2.1 MB"
    }
  ]
}
```

### 11. Assign Technician to Intervention
**Endpoint:** `PATCH /api/admin/ingenierie/interventions/{id}/assign`

**Request Body:**
```json
{
  "technicien": "string",
  "notes": "string" (optional)
}
```

**Response:** Returns updated intervention

### 12. Get Technician Schedule
**Endpoint:** `GET /api/admin/ingenierie/techniciens/{technicienId}/schedule`

**Description:** Fetch technician's intervention schedule

**Query Parameters:**
- `date_from` (optional): From date (YYYY-MM-DD)
- `date_to` (optional): To date (YYYY-MM-DD)

**Response:**
```json
{
  "technicien": "Youssef Alami",
  "interventions": [
    {
      "id": 1,
      "code": "ING-INT-2024-0089",
      "client": "ONCF",
      "date": "2024-12-22",
      "heure": "08:00",
      "statut": "Planifiée"
    }
  ]
}
```

### 13. Get Engineering Statistics
**Endpoint:** `GET /api/admin/ingenierie/statistics`

**Description:** Fetch engineering department statistics

**Response:**
```json
{
  "interventionsPlanifiees": 15,
  "interventionsEnCours": 8,
  "interventionsTerminees": 97,
  "tauxSucces": 94.8,
  "moyenneTempsRealisation": 450,
  "coutTotal": 45000,
  "parType": [
    {
      "type": "Maintenance",
      "count": 45,
      "tauxSucces": 98
    },
    {
      "type": "Installation",
      "count": 30,
      "tauxSucces": 90
    }
  ],
  "parTechnicien": [
    {
      "nom": "Youssef Alami",
      "interventions": 28,
      "tauxSucces": 96
    }
  ]
}
```

### 14. Generate Intervention Report (PDF)
**Endpoint:** `GET /api/admin/ingenierie/interventions/{id}/report-pdf`

**Description:** Generate intervention report as PDF

**Response:** PDF file download

### 15. Get Client Intervention History
**Endpoint:** `GET /api/admin/ingenierie/clients/{client}/history`

**Description:** Fetch all interventions for a specific client

**Query Parameters:**
- `page` (optional): Pagination page
- `limit` (optional): Items per page
- `from_date` (optional): From date (YYYY-MM-DD)
- `to_date` (optional): To date (YYYY-MM-DD)

**Response:** Returns paginated list of interventions for client

## Key Data Models

### Intervention Object
- `id`: number
- `code`: string (ING-INT-YYYY-XXXX)
- `client`: string
- `site`: string
- `adresse`: string
- `technicien`: string
- `date`: string (YYYY-MM-DD)
- `heureDebut`: string (HH:MM)
- `heureFin`: string (HH:MM)
- `type`: "Maintenance" | "Installation" | "Dépannage" | "Audit"
- `description`: string
- `priorite`: "Basse" | "Normal" | "Haute" | "Urgente"
- `statut`: "Planifiée" | "En cours" | "Terminée"
- `equipements`: string[]
- `rapport`: Report object (optional)

### Report Object
- `id`: number
- `dateCreation`: string (YYYY-MM-DDTHH:MM:SSZ)
- `resultat`: "Succès" | "Succès avec remarques" | "Partiellement complété" | "Problème non résolu"
- `description`: string
- `tempsReel`: number (minutes)
- `coutReel`: number
- `observations`: string
- `prochainControle`: string (YYYY-MM-DD) (optional)
- `anomalies`: string[] (optional)
- `url`: string

### Document Object
- `id`: number
- `nom`: string
- `type`: "Photo" | "Schéma" | "Certificat" | "Autre"
- `url`: string
- `dateCreation`: string (YYYY-MM-DD)
- `taille`: string

## Intervention Types
- **Maintenance** - Preventive or corrective maintenance
- **Installation** - Equipment installation and configuration
- **Dépannage** - Emergency repairs and troubleshooting
- **Audit** - System audits and compliance checks

## Priority Levels
- **Basse** - Low priority, can be scheduled flexibly
- **Normal** - Regular priority scheduling
- **Haute** - High priority, schedule soon
- **Urgente** - Emergency, immediate response required

## Notes
- All dates should be in ISO 8601 format (YYYY-MM-DD)
- All times should be in 24-hour format (HH:MM)
- Timestamps should include timezone (YYYY-MM-DDTHH:MM:SSZ)
- Auto-generate codes as ING-INT-YYYY-XXXX
- Time values (tempsReel) should be stored in minutes
- Currency values are in local currency (default: MAD)
- Implement GPS tracking for technicians (optional but recommended)
- Auto-calculate actual duration from heureDebut and heureFin
- Send notifications to client upon intervention completion
- Implement preventive maintenance scheduling alerts
- Track technician productivity metrics
- Support document attachments for compliance documentation
