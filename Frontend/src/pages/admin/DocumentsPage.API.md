# API Documentation - Documents Management Center (DocumentsPage)

## Overview
Centralized document management system for all departments with document search, filtering, versioning, and compliance tracking. Supports documents from Projets, Ingénierie, Formation, and RH departments.

## Required APIs

### 1. Get All Documents
**Endpoint:** `GET /api/admin/documents`

**Description:** Fetch all documents with filtering and pagination

**Query Parameters:**
- `page` (optional): Pagination page (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by code, nom, or content
- `type` (optional): Filter by type ("Devis", "Rapport", "Formation", "Technique", "Backup", "RH")
- `departement` (optional): Filter by department ("Projets", "Ingénierie", "Formation", "RH")
- `dateCreation_from` (optional): From date (YYYY-MM-DD)
- `dateCreation_to` (optional): To date (YYYY-MM-DD)
- `conformite` (optional): Filter by ISO compliance ("Conforme", "Non conforme")

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "code": "PRJ-DEV-2024-0034",
      "nom": "Devis automatisation COSUMAR",
      "type": "Devis",
      "departement": "Projets",
      "dateCreation": "2024-10-15",
      "dateModification": "2024-12-18",
      "taille": "2.4 MB",
      "url": "/documents/devis-123.pdf",
      "conformiteISO": true,
      "auteur": "Sara Fassi",
      "version": 1
    }
  ],
  "total": 1245,
  "page": 1,
  "limit": 20
}
```

### 2. Get Document Statistics
**Endpoint:** `GET /api/admin/documents/statistics`

**Description:** Fetch dashboard statistics for documents

**Response:**
```json
{
  "totalDocuments": 1245,
  "documentsThisMois": 89,
  "stockageUtilise": "12.4 GB",
  "stockageTotal": "50 GB",
  "conformiteISO": 100,
  "departementBreakdown": [
    {
      "nom": "Projets",
      "count": 450,
      "taille": "4.5 GB"
    },
    {
      "nom": "Ingénierie",
      "count": 320,
      "taille": "3.2 GB"
    }
  ]
}
```

### 3. Get Document by ID
**Endpoint:** `GET /api/admin/documents/{id}`

**Description:** Fetch detailed document information

**Response:** Returns single document object with full details including metadata

### 4. Download Document
**Endpoint:** `GET /api/admin/documents/{id}/download`

**Description:** Download document file

**Response:** File download (binary)

### 5. Upload Document
**Endpoint:** `POST /api/admin/documents`

**Description:** Upload a new document

**Request:**
- Content-Type: multipart/form-data
- Field `file`: File to upload
- Field `code`: Document code (e.g., PRJ-DEV-2024-0034)
- Field `nom`: Document name
- Field `type`: Document type
- Field `departement`: Department
- Field `conformiteISO` (optional): Boolean, default true

**Response:** Returns created document object

### 6. Update Document Metadata
**Endpoint:** `PUT /api/admin/documents/{id}`

**Request Body:**
```json
{
  "nom": "string",
  "description": "string",
  "conformiteISO": boolean,
  "tags": ["string"]
}
```

**Response:** Returns updated document object

### 7. Delete Document
**Endpoint:** `DELETE /api/admin/documents/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Document supprimé avec succès"
}
```

### 8. Get Document Versions
**Endpoint:** `GET /api/admin/documents/{id}/versions`

**Description:** Fetch version history of a document

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "version": 2,
      "dateCreation": "2024-12-18T10:30:00Z",
      "auteur": "Admin",
      "changements": "Mise à jour des spécifications",
      "taille": "2.5 MB"
    },
    {
      "id": 2,
      "version": 1,
      "dateCreation": "2024-10-15T14:20:00Z",
      "auteur": "Sara Fassi",
      "changements": "Version initiale",
      "taille": "2.4 MB"
    }
  ]
}
```

### 9. Restore Document Version
**Endpoint:** `PATCH /api/admin/documents/{id}/restore-version`

**Request Body:**
```json
{
  "version": 1
}
```

**Response:** Returns document with restored version

### 10. Export All Documents
**Endpoint:** `GET /api/admin/documents/export`

**Description:** Export documents as CSV or Excel

**Query Parameters:**
- `format`: "csv" | "xlsx" (default: "csv")
- `departement` (optional): Filter export
- `type` (optional): Filter export

**Response:** File download (CSV or XLSX)

### 11. Search Documents (Full-text)
**Endpoint:** `GET /api/admin/documents/search`

**Description:** Full-text search across documents

**Query Parameters:**
- `q`: Search query (required)
- `limit` (optional): Results limit (default: 20)

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "code": "PRJ-DEV-2024-0034",
      "nom": "Devis automatisation COSUMAR",
      "excerpt": "...automatisation complète de la ligne A...",
      "relevance": 0.95
    }
  ],
  "total": 15
}
```

### 12. Get Document by Department
**Endpoint:** `GET /api/admin/documents/department/{departement}`

**Description:** Fetch documents grouped by department

**Response:**
```json
{
  "departement": "Projets",
  "totalDocuments": 450,
  "taille": "4.5 GB",
  "documents": []
}
```

## Key Data Models

### Document Object
- `id`: number
- `code`: string (Department specific code)
- `nom`: string
- `type`: string
- `departement`: "Projets" | "Ingénierie" | "Formation" | "RH"
- `dateCreation`: string (YYYY-MM-DD)
- `dateModification`: string (YYYY-MM-DD)
- `taille`: string (e.g., "2.4 MB")
- `url`: string
- `conformiteISO`: boolean
- `auteur`: string
- `version`: number
- `tags`: string[] (optional)

### Document Type
- "Devis" - Quotations
- "Rapport" - Reports
- "Formation" - Training materials
- "Technique" - Technical documentation
- "Backup" - Backup files
- "RH" - Human resources documents

## Notes
- All dates should be in ISO 8601 format (YYYY-MM-DD)
- All timestamps should include timezone (YYYY-MM-DDTHH:MM:SSZ)
- File storage should implement versioning system (keep last 5 versions)
- Document metadata should be indexed for full-text search
- ISO 9001 compliance tracking is essential
- Implement proper access control per department
- Soft delete recommended for audit trail
- Export functionality should respect user permissions
- Document storage quota limits recommended per department
- Implement document retention policies
