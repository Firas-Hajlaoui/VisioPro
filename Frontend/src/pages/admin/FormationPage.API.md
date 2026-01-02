# API Documentation - Formation Management (FormationPage)

## Overview
Training and development management system for planning, tracking, and managing training sessions, participants, and trainer assignments.

## Required APIs

### 1. Get All Training Sessions
**Endpoint:** `GET /api/admin/formation/sessions`

**Description:** Fetch list of all training sessions with filtering

**Query Parameters:**
- `page` (optional): Pagination page (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by code, titre, or formateur
- `statut` (optional): Filter by status ("Planifiée", "En cours", "Terminée")
- `formateur` (optional): Filter by trainer
- `date_from` (optional): Filter from date (YYYY-MM-DD)
- `date_to` (optional): Filter to date (YYYY-MM-DD)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "code": "FOR-SES-2024-0012",
      "titre": "Sécurité au travail",
      "formateur": "Dr. Hassan",
      "date": "2024-12-15",
      "participants": 12,
      "duree": "8h",
      "description": "Formation sur les normes de sécurité",
      "statut": "Terminée",
      "localisation": "Salle de formation A",
      "capaciteMax": 20,
      "tauxPresence": 95
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

### 2. Get Training Session by ID
**Endpoint:** `GET /api/admin/formation/sessions/{id}`

**Description:** Fetch detailed training session information

**Response:** Returns single session object with full details and participant list

### 3. Create Training Session
**Endpoint:** `POST /api/admin/formation/sessions`

**Request Body:**
```json
{
  "titre": "string",
  "formateur": "string",
  "date": "YYYY-MM-DD",
  "duree": "string (e.g., '8h' or '16h')",
  "description": "string",
  "localisation": "string",
  "capaciteMax": "number"
}
```

**Response:** Returns created session with auto-generated code (FOR-SES-YYYY-XXXX)

### 4. Update Training Session
**Endpoint:** `PUT /api/admin/formation/sessions/{id}`

**Request Body:** Same as Create Training Session

**Response:** Returns updated session object

### 5. Delete Training Session
**Endpoint:** `DELETE /api/admin/formation/sessions/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Session de formation supprimée avec succès"
}
```

### 6. Update Session Status
**Endpoint:** `PATCH /api/admin/formation/sessions/{id}/status`

**Request Body:**
```json
{
  "statut": "Planifiée" | "En cours" | "Terminée"
}
```

**Response:** Returns updated session

### 7. Get Session Participants
**Endpoint:** `GET /api/admin/formation/sessions/{id}/participants`

**Description:** Fetch list of participants for a training session

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nom": "Ahmed Bennani",
      "email": "ahmed.bennani@company.com",
      "poste": "Développeur Senior",
      "departement": "IT",
      "statut": "Confirmé",
      "dateInscription": "2024-11-20",
      "present": true,
      "notes": "Très actif pendant la formation"
    }
  ],
  "total": 12
}
```

### 8. Add Participant to Session
**Endpoint:** `POST /api/admin/formation/sessions/{id}/participants`

**Request Body:**
```json
{
  "employeId": "number",
  "email": "string"
}
```

**Response:** Returns updated session with new participant

### 9. Remove Participant from Session
**Endpoint:** `DELETE /api/admin/formation/sessions/{id}/participants/{participantId}`

**Response:**
```json
{
  "success": true,
  "message": "Participant retiré de la session"
}
```

### 10. Mark Attendance
**Endpoint:** `PATCH /api/admin/formation/sessions/{id}/participants/{participantId}/attendance`

**Request Body:**
```json
{
  "present": true | false,
  "notes": "optional string"
}
```

**Response:** Returns updated participant record

### 11. Generate Training Certificate
**Endpoint:** `POST /api/admin/formation/sessions/{id}/certificate/{participantId}`

**Description:** Generate training completion certificate

**Response:**
```json
{
  "id": 1,
  "code": "CERT-2024-001",
  "employe": "Ahmed Bennani",
  "session": "Sécurité au travail",
  "dateCompletion": "2024-12-15",
  "duree": "8h",
  "certificateUrl": "/certificates/cert-2024-001.pdf"
}
```

### 12. Download Training Materials
**Endpoint:** `GET /api/admin/formation/sessions/{id}/materials`

**Description:** Fetch training materials for a session

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nom": "Slides de présentation",
      "type": "PDF",
      "url": "/materials/slides.pdf",
      "dateCreation": "2024-12-01",
      "taille": "5.2 MB"
    }
  ]
}
```

### 13. Upload Training Material
**Endpoint:** `POST /api/admin/formation/sessions/{id}/materials`

**Request:**
- Content-Type: multipart/form-data
- Field `file`: File to upload
- Field `nom`: Material name
- Field `type`: Material type

**Response:** Returns created material object

### 14. Get Training Statistics
**Endpoint:** `GET /api/admin/formation/statistics`

**Description:** Fetch training program statistics

**Response:**
```json
{
  "sessionsPlanifiees": 8,
  "sessionsEnCours": 2,
  "sessionsTerminees": 35,
  "participantsTotal": 450,
  "moyenneTauxPresence": 92,
  "domainesFormation": [
    {
      "domaine": "Sécurité",
      "sessions": 5,
      "participants": 85
    },
    {
      "domaine": "Technique",
      "sessions": 10,
      "participants": 180
    }
  ]
}
```

### 15. Export Attendance Report
**Endpoint:** `GET /api/admin/formation/sessions/{id}/attendance-report`

**Description:** Export attendance report as CSV or PDF

**Query Parameters:**
- `format`: "csv" | "pdf" (default: "csv")

**Response:** File download

## Key Data Models

### Training Session Object
- `id`: number
- `code`: string (FOR-SES-YYYY-XXXX)
- `titre`: string
- `formateur`: string
- `date`: string (YYYY-MM-DD)
- `duree`: string (e.g., "8h")
- `description`: string
- `localisation`: string
- `capaciteMax`: number
- `participants`: number
- `tauxPresence`: number (0-100)
- `statut`: "Planifiée" | "En cours" | "Terminée"

### Participant Object
- `id`: number
- `nom`: string
- `email`: string
- `poste`: string
- `departement`: string
- `statut`: "Confirmé" | "En attente" | "Annulé"
- `dateInscription`: string (YYYY-MM-DD)
- `present`: boolean
- `notes`: string (optional)

### Certificate Object
- `id`: number
- `code`: string (CERT-YYYY-XXX)
- `employe`: string
- `session`: string
- `dateCompletion`: string (YYYY-MM-DD)
- `duree`: string
- `certificateUrl`: string

### Training Material Object
- `id`: number
- `nom`: string
- `type`: string (PDF, PPTX, DOC, VIDEO, etc.)
- `url`: string
- `dateCreation`: string (YYYY-MM-DD)
- `taille`: string (e.g., "5.2 MB")

## Training Status Workflow
1. **Planifiée** - Initial status when session is created
2. **En cours** - Status updated when session starts
3. **Terminée** - Status updated when session concludes

## Notes
- All dates should be in ISO 8601 format (YYYY-MM-DD)
- Duration should be formatted as "Xh" (e.g., "8h", "16h")
- Participant capacity limits should be enforced on the backend
- Auto-generate training codes as FOR-SES-YYYY-XXXX
- Attendance tracking should be recorded with timestamps
- Certificate generation should be automatic upon session completion
- Training materials should support versioning
- Implement notification system for session updates to participants
- Consider implementing learning management system (LMS) features
- Track training hours per employee for compliance reporting
