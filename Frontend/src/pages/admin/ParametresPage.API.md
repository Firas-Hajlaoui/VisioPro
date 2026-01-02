# API Documentation - System Parameters (ParametresPage)

## Overview
System configuration and settings management for VisioPro, including general settings, company information, user management, security settings, and notification preferences.

## Required APIs

### 1. Get All Settings
**Endpoint:** `GET /api/admin/parametres`

**Description:** Fetch all system settings

**Response:**
```json
{
  "general": {
    "nomEntreprise": "VisioPro Inc.",
    "timezone": "Africa/Casablanca",
    "langue": "fr",
    "dateFormat": "DD/MM/YYYY",
    "devise": "MAD",
    "heuresTravail": {
      "debut": "08:00",
      "fin": "17:00",
      "joursTravail": [1, 2, 3, 4, 5]
    }
  },
  "entreprise": {
    "nomComplet": "VisioPro Maroc SARL",
    "sigle": "VPM",
    "numeroSiret": "123456789000",
    "numeroSiren": "123456789",
    "adresse": "123 Rue de la Liberté, Casablanca",
    "codePostal": "20000",
    "telephone": "+212 5 22 XX XX XX",
    "email": "contact@visiopro.ma",
    "siteWeb": "https://visiopro.ma",
    "dateCreation": "2020-01-15",
    "logo": "/images/logo.png"
  },
  "securite": {
    "motDePasseMinCaracteres": 8,
    "motDePasseExigences": {
      "majuscules": true,
      "minuscules": true,
      "chiffres": true,
      "caractereSpeciaux": true
    },
    "expirationMotDePasse": 90,
    "twoFactorAuth": true,
    "sessionTimeout": 30,
    "tentativesLogin": 5,
    "blocageApres": 15
  },
  "notifications": {
    "emailNotifications": true,
    "smsNotifications": false,
    "pushNotifications": true,
    "typeNotifications": {
      "conges": true,
      "interventions": true,
      "formations": true,
      "documents": true,
      "rapports": true
    }
  }
}
```

### 2. Update General Settings
**Endpoint:** `PUT /api/admin/parametres/general`

**Request Body:**
```json
{
  "nomEntreprise": "string",
  "timezone": "string",
  "langue": "string",
  "dateFormat": "string",
  "devise": "string",
  "heuresTravail": {
    "debut": "HH:MM",
    "fin": "HH:MM",
    "joursTravail": [1, 2, 3, 4, 5]
  }
}
```

**Response:** Returns updated general settings

### 3. Update Company Information
**Endpoint:** `PUT /api/admin/parametres/entreprise`

**Request Body:**
```json
{
  "nomComplet": "string",
  "sigle": "string",
  "numeroSiret": "string",
  "numeroSiren": "string",
  "adresse": "string",
  "codePostal": "string",
  "telephone": "string",
  "email": "string",
  "siteWeb": "string",
  "logo": "file"
}
```

**Response:** Returns updated company information

### 4. Update Security Settings
**Endpoint:** `PUT /api/admin/parametres/securite`

**Request Body:**
```json
{
  "motDePasseMinCaracteres": "number",
  "motDePasseExigences": {
    "majuscules": "boolean",
    "minuscules": "boolean",
    "chiffres": "boolean",
    "caractereSpeciaux": "boolean"
  },
  "expirationMotDePasse": "number (days)",
  "twoFactorAuth": "boolean",
  "sessionTimeout": "number (minutes)",
  "tentativesLogin": "number",
  "blocageApres": "number (minutes)"
}
```

**Response:** Returns updated security settings

### 5. Update Notification Settings
**Endpoint:** `PUT /api/admin/parametres/notifications`

**Request Body:**
```json
{
  "emailNotifications": "boolean",
  "smsNotifications": "boolean",
  "pushNotifications": "boolean",
  "typeNotifications": {
    "conges": "boolean",
    "interventions": "boolean",
    "formations": "boolean",
    "documents": "boolean",
    "rapports": "boolean"
  }
}
```

**Response:** Returns updated notification settings

### 6. Get User Management Settings
**Endpoint:** `GET /api/admin/parametres/utilisateurs`

**Description:** Fetch user management configuration

**Response:**
```json
{
  "rolesAvailables": [
    {
      "id": 1,
      "nom": "Admin",
      "description": "Accès complet au système",
      "permissions": ["lecture", "creation", "modification", "suppression"]
    },
    {
      "id": 2,
      "nom": "Manager",
      "description": "Gestion des employés et des interventions"
    }
  ],
  "departements": [
    {
      "id": 1,
      "nom": "IT",
      "chef": "Ahmed Bennani",
      "nombreEmployes": 12
    }
  ]
}
```

### 7. Create New Role
**Endpoint:** `POST /api/admin/parametres/roles`

**Request Body:**
```json
{
  "nom": "string",
  "description": "string",
  "permissions": ["string"]
}
```

**Response:** Returns created role object

### 8. Update Role Permissions
**Endpoint:** `PUT /api/admin/parametres/roles/{id}`

**Request Body:**
```json
{
  "nom": "string",
  "description": "string",
  "permissions": ["string"]
}
```

**Response:** Returns updated role

### 9. Delete Role
**Endpoint:** `DELETE /api/admin/parametres/roles/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Rôle supprimé avec succès"
}
```

### 10. Create New Department
**Endpoint:** `POST /api/admin/parametres/departments`

**Request Body:**
```json
{
  "nom": "string",
  "description": "string",
  "chef": "string",
  "budget": "number"
}
```

**Response:** Returns created department object

### 11. Update Department
**Endpoint:** `PUT /api/admin/parametres/departments/{id}`

**Request Body:**
```json
{
  "nom": "string",
  "description": "string",
  "chef": "string",
  "budget": "number"
}
```

**Response:** Returns updated department

### 12. Get Backup Settings
**Endpoint:** `GET /api/admin/parametres/backup`

**Description:** Fetch backup and recovery settings

**Response:**
```json
{
  "backupAutomatic": true,
  "frequenceBackup": "daily",
  "heureBackup": "02:00",
  "retentionDays": 30,
  "stockageBackup": {
    "localSize": "250 GB",
    "cloudSize": "500 GB",
    "lastBackup": "2024-12-20T02:30:00Z"
  }
}
```

### 13. Update Backup Settings
**Endpoint:** `PUT /api/admin/parametres/backup`

**Request Body:**
```json
{
  "backupAutomatic": "boolean",
  "frequenceBackup": "daily" | "weekly" | "monthly",
  "heureBackup": "HH:MM",
  "retentionDays": "number"
}
```

**Response:** Returns updated backup settings

### 14. Trigger Manual Backup
**Endpoint:** `POST /api/admin/parametres/backup/manual`

**Description:** Start manual backup process

**Response:**
```json
{
  "success": true,
  "backupId": "backup-2024-12-20-001",
  "startTime": "2024-12-20T15:30:00Z",
  "estimatedDuration": 300
}
```

### 15. Get Backup History
**Endpoint:** `GET /api/admin/parametres/backup/history`

**Description:** Fetch backup history

**Query Parameters:**
- `limit` (optional): Number of backups to return (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "backup-2024-12-20-001",
      "timestamp": "2024-12-20T02:30:00Z",
      "status": "Completed",
      "size": "5.2 GB",
      "duration": 450,
      "location": "Cloud"
    }
  ]
}
```

### 16. Get System Logs
**Endpoint:** `GET /api/admin/parametres/logs`

**Description:** Fetch system activity logs

**Query Parameters:**
- `page` (optional): Pagination page
- `limit` (optional): Items per page
- `type` (optional): Log type filter
- `from` (optional): From date (YYYY-MM-DD)
- `to` (optional): To date (YYYY-MM-DD)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "timestamp": "2024-12-20T15:30:00Z",
      "type": "user_login",
      "user": "admin@company.com",
      "action": "Connexion réussie",
      "ipAddress": "192.168.1.100",
      "status": "Success"
    }
  ],
  "total": 5420,
  "page": 1,
  "limit": 20
}
```

### 17. Export System Settings
**Endpoint:** `GET /api/admin/parametres/export`

**Description:** Export all system settings as JSON

**Response:** JSON file download

### 18. Import System Settings
**Endpoint:** `POST /api/admin/parametres/import`

**Description:** Import system settings from file

**Request:**
- Content-Type: multipart/form-data
- Field `file`: JSON settings file

**Response:** Returns import status and validation results

## Key Data Models

### General Settings Object
- `nomEntreprise`: string
- `timezone`: string
- `langue`: string
- `dateFormat`: string
- `devise`: string
- `heuresTravail`: WorkingHours object

### Company Information Object
- `nomComplet`: string
- `sigle`: string
- `numeroSiret`: string
- `numeroSiren`: string
- `adresse`: string
- `codePostal`: string
- `telephone`: string
- `email`: string
- `siteWeb`: string
- `dateCreation`: string (YYYY-MM-DD)
- `logo`: string (URL)

### Security Settings Object
- `motDePasseMinCaracteres`: number
- `motDePasseExigences`: PasswordRequirements object
- `expirationMotDePasse`: number
- `twoFactorAuth`: boolean
- `sessionTimeout`: number
- `tentativesLogin`: number
- `blocageApres`: number

### Role Object
- `id`: number
- `nom`: string
- `description`: string
- `permissions`: string[]

### Department Object
- `id`: number
- `nom`: string
- `description`: string
- `chef`: string
- `budget`: number

### Backup Object
- `id`: string
- `timestamp`: string (YYYY-MM-DDTHH:MM:SSZ)
- `status`: "Pending" | "In Progress" | "Completed" | "Failed"
- `size`: string
- `duration`: number (seconds)
- `location`: "Local" | "Cloud"

## Supported Timezones
- Africa/Casablanca
- Europe/Paris
- Europe/London
- America/New_York
- And others...

## Supported Languages
- fr (Français)
- en (English)
- ar (العربية)

## Permission Types
- lecture: Read access
- creation: Create new items
- modification: Edit items
- suppression: Delete items
- approbation: Approve/reject requests
- rapport: Generate reports

## Notes
- All changes to system settings should be logged for audit trail
- Implement role-based access control (RBAC) for parameter management
- Send notifications when security settings are changed
- Implement configuration versioning for rollback capability
- All timestamps should be in ISO 8601 format with timezone
- Backup operations should not impact system performance
- Log retention should be configurable
- Implement data encryption for sensitive configuration
- Regular security audits recommended for permission management
