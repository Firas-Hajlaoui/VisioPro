# API Documentation - Projects Management (ProjetsPage)

## Overview
This page manages projects including creation, modification, deletion, and document management (devis, intervention sheets, technical documents, backups).

## Required APIs

### 1. Get All Projects
**Endpoint:** `GET /api/admin/projets`

**Description:** Fetch list of all projects with optional filtering and pagination

**Query Parameters:**
- `page` (optional): Pagination page (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by code, intitule, or client
- `statut` (optional): Filter by status ("En cours", "Terminé", "En pause")
- `chefProjet` (optional): Filter by project manager
- `dateDebut_from` (optional): Filter from start date (YYYY-MM-DD)
- `dateDebut_to` (optional): Filter to start date (YYYY-MM-DD)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "code": "PRJ-DEV-2024-0034",
      "intitule": "Automatisation ligne de production",
      "client": "COSUMAR",
      "chefProjet": "Sara Fassi",
      "dateDebut": "2024-10-01",
      "dateFin": "2025-03-15",
      "description": "Automatisation complète de la ligne A",
      "progression": 65,
      "statut": "En cours",
      "documents": {
        "devis": 1,
        "fiches": 4,
        "technique": 3,
        "backup": 2
      }
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10
}
```

### 2. Get Project by ID
**Endpoint:** `GET /api/admin/projets/{id}`

**Description:** Fetch detailed project information

**Response:** Returns single project object with full details

### 3. Create Project
**Endpoint:** `POST /api/admin/projets`

**Request Body:**
```json
{
  "intitule": "string",
  "client": "string",
  "chefProjet": "string",
  "dateDebut": "YYYY-MM-DD",
  "dateFin": "YYYY-MM-DD",
  "description": "string",
  "statut": "En cours" | "Terminé" | "En pause"
}
```

**Response:** Returns created project object with auto-generated code (PRJ-DEV-YYYY-XXXX)

### 4. Update Project
**Endpoint:** `PUT /api/admin/projets/{id}`

**Request Body:** Same as Create Project

**Response:** Returns updated project object

### 5. Delete Project
**Endpoint:** `DELETE /api/admin/projets/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Projet supprimé avec succès"
}
```

### 6. Update Project Progress
**Endpoint:** `PATCH /api/admin/projets/{id}/progression`

**Request Body:**
```json
{
  "progression": 75
}
```

**Response:** Returns updated project with new progression value

### 7. Get Project Documents
**Endpoint:** `GET /api/admin/projets/{id}/documents`

**Description:** Fetch all documents associated with a project

**Query Parameters:**
- `type` (optional): Filter by type ("Devis", "Fiche d'intervention", "Document technique", "Backup projet")

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "code": "PRJ-DEV-2024-0034",
      "nom": "Devis automatisation COSUMAR",
      "type": "Devis",
      "url": "/documents/devis-123.pdf",
      "dateCreation": "2024-10-15",
      "taille": "2.4 MB"
    }
  ],
  "total": 10
}
```

### 8. Upload Project Document
**Endpoint:** `POST /api/admin/projets/{id}/documents`

**Description:** Upload a document for a project

**Request:**
- Content-Type: multipart/form-data
- Field `file`: File to upload
- Field `type`: Document type ("Devis", "Fiche d'intervention", "Document technique", "Backup projet")
- Field `description` (optional): Document description

**Response:**
```json
{
  "id": 1,
  "code": "PRJ-DEV-2024-0034",
  "nom": "filename.pdf",
  "type": "Devis",
  "url": "/documents/devis-123.pdf",
  "dateCreation": "2024-12-20",
  "taille": "2.4 MB"
}
```

### 9. Download Project Document
**Endpoint:** `GET /api/admin/projets/{projectId}/documents/{documentId}/download`

**Description:** Download a project document file

**Response:** File download (binary)

### 10. Delete Project Document
**Endpoint:** `DELETE /api/admin/projets/{projectId}/documents/{documentId}`

**Response:**
```json
{
  "success": true,
  "message": "Document supprimé avec succès"
}
```

### 11. Update Project Status
**Endpoint:** `PATCH /api/admin/projets/{id}/status`

**Request Body:**
```json
{
  "statut": "En cours" | "Terminé" | "En pause"
}
```

**Response:** Returns updated project

## Key Data Models

### Project Object
- `id`: number
- `code`: string (PRJ-DEV-YYYY-XXXX)
- `intitule`: string
- `client`: string
- `chefProjet`: string
- `dateDebut`: string (YYYY-MM-DD)
- `dateFin`: string (YYYY-MM-DD)
- `description`: string (optional)
- `progression`: number (0-100)
- `statut`: "En cours" | "Terminé" | "En pause"
- `documents`: DocumentCount object

### DocumentCount Object
- `devis`: number
- `fiches`: number
- `technique`: number
- `backup`: number

### Document Object
- `id`: number
- `code`: string
- `nom`: string
- `type`: "Devis" | "Fiche d'intervention" | "Document technique" | "Backup projet"
- `url`: string
- `dateCreation`: string (YYYY-MM-DD)
- `taille`: string (e.g., "2.4 MB")

## Document Types

1. **Devis** (Code: DEV) - Quotations
2. **Fiche d'intervention** (Code: FI) - Intervention sheets
3. **Document technique** (Code: DT) - Technical documentation
4. **Backup projet** (Code: BKP) - Project backups

## Notes
- All dates should be in ISO 8601 format (YYYY-MM-DD)
- Project codes are auto-generated as PRJ-DEV-YYYY-XXXX
- Progression is a percentage (0-100)
- Document uploads should have file size limits (suggest: 100 MB max)
- Document storage should support common formats: PDF, Excel, Word, Archive files
- Cascade delete: When a project is deleted, all associated documents should be deleted
- Implement soft delete for audit trail purposes
- Real-time progress tracking would be beneficial
