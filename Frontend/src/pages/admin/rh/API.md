# API Documentation - Admin RH Module

This folder contains multiple RH (Human Resources) management pages. Below are the APIs required for each page.

## Overview
The RH module handles employee management, leave requests, time tracking, authorizations, and expense reports.

---

## 1. GestionEmployee.tsx - Employee Management

### Get All Employees
**Endpoint:** `GET /api/rh/employees`

**Description:** Fetch list of all employees

**Query Parameters:**
- `page` (optional): Pagination page (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, or code
- `statut` (optional): Filter by status ("Actif", "Inactif", "En congé")
- `departement` (optional): Filter by department

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "code": "EMP-2024-0001",
      "nom": "Bennani",
      "prenom": "Ahmed",
      "email": "ahmed.bennani@company.com",
      "poste": "Développeur Senior",
      "departement": "IT",
      "dateEmbauche": "2022-03-15",
      "salaire": 45000,
      "statut": "Actif"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

### Create Employee
**Endpoint:** `POST /api/rh/employees`

**Request Body:**
```json
{
  "nom": "string",
  "prenom": "string",
  "email": "string",
  "poste": "string",
  "departement": "string",
  "dateEmbauche": "YYYY-MM-DD",
  "salaire": "number"
}
```

**Response:** Returns created employee object with generated code

### Update Employee
**Endpoint:** `PUT /api/rh/employees/{id}`

**Request Body:** Same as Create Employee

**Response:** Returns updated employee object

### Delete Employee
**Endpoint:** `DELETE /api/rh/employees/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Employé supprimé avec succès"
}
```

---

## 2. CongesPage.tsx - Leave Request Management

### Get All Leave Requests
**Endpoint:** `GET /api/rh/leave-requests`

**Description:** Fetch all leave requests with filtering

**Query Parameters:**
- `page` (optional): Pagination page
- `limit` (optional): Items per page
- `statut` (optional): "En attente", "Approuvé", "Refusé"
- `employe` (optional): Filter by employee
- `dateDebut_from` (optional): Filter from date (YYYY-MM-DD)
- `dateDebut_to` (optional): Filter to date (YYYY-MM-DD)
- `type` (optional): "Congé annuel", "Congé maladie", "Personnel"

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "code": "RH-CG-2024-0145",
      "employe": "Karim Idrissi",
      "debut": "2025-01-15",
      "fin": "2025-01-20",
      "jours": 5,
      "type": "Congé annuel",
      "motif": "Vacances familiales",
      "statut": "En attente"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

### Create Leave Request
**Endpoint:** `POST /api/rh/leave-requests`

**Request Body:**
```json
{
  "employe": "string",
  "debut": "YYYY-MM-DD",
  "fin": "YYYY-MM-DD",
  "type": "string",
  "motif": "string"
}
```

**Response:** Returns created leave request with generated code

### Update Leave Request
**Endpoint:** `PUT /api/rh/leave-requests/{id}`

**Request Body:** Same as Create

**Response:** Returns updated leave request

### Approve/Reject Leave Request
**Endpoint:** `PATCH /api/rh/leave-requests/{id}/status`

**Request Body:**
```json
{
  "statut": "Approuvé" | "Refusé",
  "notes": "optional string"
}
```

**Response:** Returns updated leave request

### Delete Leave Request
**Endpoint:** `DELETE /api/rh/leave-requests/{id}`

---

## 3. TempsPage.tsx - Time Tracking

### Get All Time Records
**Endpoint:** `GET /api/rh/time-records`

**Description:** Fetch time tracking records

**Query Parameters:**
- `page` (optional): Pagination page
- `limit` (optional): Items per page
- `employe` (optional): Filter by employee
- `date` (optional): Filter by date (YYYY-MM-DD)
- `date_from` (optional): From date
- `date_to` (optional): To date
- `lieu` (optional): Filter by location

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "code": "RH-TT-2024-0001",
      "employe": "Ahmed Bennani",
      "date": "2024-12-20",
      "heureEntree": "08:00",
      "heureSortie": "16:00",
      "lieu": "Bureau local",
      "heures": 8,
      "type": "Normal",
      "statut": "Validé",
      "hsValide": true
    }
  ],
  "total": 300,
  "page": 1,
  "limit": 10
}
```

### Create Time Record
**Endpoint:** `POST /api/rh/time-records`

**Request Body:**
```json
{
  "employe": "string",
  "date": "YYYY-MM-DD",
  "heureEntree": "HH:MM",
  "heureSortie": "HH:MM",
  "lieu": "string",
  "type": "string"
}
```

**Response:** Returns created time record with code and calculated hours

### Update Time Record
**Endpoint:** `PUT /api/rh/time-records/{id}`

**Request Body:** Same as Create

**Response:** Returns updated time record

### Validate Time Record
**Endpoint:** `PATCH /api/rh/time-records/{id}/validate`

**Request Body:**
```json
{
  "hsValide": true | false,
  "notes": "optional string"
}
```

**Response:** Returns updated time record

### Delete Time Record
**Endpoint:** `DELETE /api/rh/time-records/{id}`

---

## 4. AutorisationsPage.tsx - Authorization Management

### Get All Authorizations
**Endpoint:** `GET /api/rh/authorizations`

**Description:** Fetch authorization requests

**Query Parameters:**
- `page` (optional): Pagination page
- `limit` (optional): Items per page
- `statut` (optional): "En attente", "Approuvé", "Refusé"
- `employe` (optional): Filter by employee
- `type` (optional): Type of authorization
- `date_from` (optional): From date
- `date_to` (optional): To date

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "code": "RH-AUT-2024-0078",
      "employe": "Ahmed Bennani",
      "date": "2024-12-20",
      "duree": "2h",
      "type": "Sortie anticipée",
      "motif": "Rendez-vous médical",
      "statut": "Approuvé"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### Create Authorization
**Endpoint:** `POST /api/rh/authorizations`

**Request Body:**
```json
{
  "employe": "string",
  "date": "YYYY-MM-DD",
  "duree": "string (e.g., '2h')",
  "type": "string",
  "motif": "string"
}
```

**Response:** Returns created authorization with code

### Update Authorization
**Endpoint:** `PUT /api/rh/authorizations/{id}`

**Request Body:** Same as Create

**Response:** Returns updated authorization

### Approve/Reject Authorization
**Endpoint:** `PATCH /api/rh/authorizations/{id}/status`

**Request Body:**
```json
{
  "statut": "Approuvé" | "Refusé",
  "notes": "optional string"
}
```

**Response:** Returns updated authorization

### Delete Authorization
**Endpoint:** `DELETE /api/rh/authorizations/{id}`

---

## 5. NoteFrais.tsx - Expense Report Management

### Get All Expense Reports
**Endpoint:** `GET /api/rh/expense-reports`

**Description:** Fetch expense reports

**Query Parameters:**
- `page` (optional): Pagination page
- `limit` (optional): Items per page
- `statut` (optional): "En attente", "Validé", "Refusé"
- `employe` (optional): Filter by employee
- `date_from` (optional): From date
- `date_to` (optional): To date
- `type` (optional): Type of expense

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "code": "NDF-2024-0042",
      "employe": "Ahmed Bennani",
      "date": "2024-12-20",
      "designation": "Déjeuner client OCP",
      "montant": 450.00,
      "projet": "Installation Khouribga",
      "type": "Restauration",
      "statut": "En attente"
    }
  ],
  "total": 80,
  "page": 1,
  "limit": 10
}
```

### Create Expense Report
**Endpoint:** `POST /api/rh/expense-reports`

**Request Body:**
```json
{
  "employe": "string",
  "date": "YYYY-MM-DD",
  "designation": "string",
  "montant": "number",
  "projet": "string",
  "type": "string"
}
```

**Response:** Returns created expense report with code

### Update Expense Report
**Endpoint:** `PUT /api/rh/expense-reports/{id}`

**Request Body:** Same as Create

**Response:** Returns updated expense report

### Validate/Reject Expense Report
**Endpoint:** `PATCH /api/rh/expense-reports/{id}/status`

**Request Body:**
```json
{
  "statut": "Validé" | "Refusé",
  "notes": "optional string",
  "montantAutorise": "optional number"
}
```

**Response:** Returns updated expense report

### Delete Expense Report
**Endpoint:** `DELETE /api/rh/expense-reports/{id}`

---

## Common Data Models

### Employee Object
- `id`: number
- `code`: string (EMP-YYYY-XXXX)
- `nom`: string
- `prenom`: string
- `email`: string
- `poste`: string
- `departement`: string
- `dateEmbauche`: string (YYYY-MM-DD)
- `salaire`: number
- `statut`: "Actif" | "Inactif" | "En congé"

### Leave Request Object
- `id`: number
- `code`: string (RH-CG-YYYY-XXXX)
- `employe`: string
- `debut`: string (YYYY-MM-DD)
- `fin`: string (YYYY-MM-DD)
- `jours`: number
- `type`: string
- `motif`: string (optional)
- `statut`: "En attente" | "Approuvé" | "Refusé"

### Time Record Object
- `id`: number
- `code`: string (RH-TT-YYYY-XXXX)
- `employe`: string
- `date`: string (YYYY-MM-DD)
- `heureEntree`: string (HH:MM)
- `heureSortie`: string (HH:MM)
- `lieu`: string
- `heures`: number
- `type`: string
- `statut`: string
- `hsValide`: boolean

### Authorization Object
- `id`: number
- `code`: string (RH-AUT-YYYY-XXXX)
- `employe`: string
- `date`: string (YYYY-MM-DD)
- `duree`: string (e.g., "2h")
- `type`: string
- `motif`: string (optional)
- `statut`: "En attente" | "Approuvé" | "Refusé"

### Expense Report Object
- `id`: number
- `code`: string (NDF-YYYY-XXXX)
- `employe`: string
- `date`: string (YYYY-MM-DD)
- `designation`: string
- `montant`: number
- `projet`: string
- `type`: string
- `statut`: "En attente" | "Validé" | "Refusé"

## Notes
- All dates should be in ISO 8601 format (YYYY-MM-DD)
- All times should be in 24-hour format (HH:MM)
- All currency values are in local currency (default: MAD)
- Pagination defaults: page=1, limit=10 (max: 100)
- All endpoints should implement proper authentication and authorization
- Status codes: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
