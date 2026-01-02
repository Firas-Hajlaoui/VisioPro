# API Documentation - Notifications

## Overview
Notification system supporting multiple audience types including individual employees, specific groups, and system-wide broadcasts.

## Types of Notifications

### 1. System-Wide Notifications (all)
Sent to all users in the system

### 2. Admin Notifications
Sent to all admin users only

### 3. Employee Notifications
Sent to all regular employees

### 4. Specific/Individual Notifications
Sent to specific single users or groups

---

## API Endpoints

### 1. Get User Notifications
**Endpoint:** `GET /api/notifications`

**Description:** Fetch notifications for the current logged-in user

**Query Parameters:**
- `page` (optional): Pagination page (default: 1)
- `limit` (optional): Items per page (default: 20)
- `read` (optional): Filter by read status (true/false)
- `type` (optional): Filter by type ("info", "warning", "success", "error")
- `priority` (optional): Filter by priority ("low", "normal", "high")

**Response:**
```json
{
  "data": [
    {
      "id": "notif-001",
      "subject": "Congé approuvé",
      "message": "Votre demande de congé du 15-20 janvier a été approuvée",
      "audience": "specific",
      "recipientId": "emp-123",
      "recipientEmail": "ahmed.bennani@company.com",
      "type": "success",
      "priority": "normal",
      "sentAt": "2024-12-20T10:30:00Z",
      "sender": "admin@company.com",
      "status": "sent",
      "read": true,
      "readAt": "2024-12-20T11:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

### 2. Get Single Notification
**Endpoint:** `GET /api/notifications/{id}`

**Description:** Fetch details of a specific notification

**Response:** Returns single notification object

### 3. Send Notification to Single User
**Endpoint:** `POST /api/notifications/send-single`

**Description:** Send a notification to a single employee

**Request Body:**
```json
{
  "recipientId": "string",
  "recipientEmail": "string",
  "subject": "string",
  "message": "string",
  "type": "info" | "warning" | "success" | "error",
  "priority": "low" | "normal" | "high",
  "status": "sent" | "scheduled",
  "scheduledFor": "2024-12-25T10:00:00Z" (optional)
}
```

**Response:**
```json
{
  "id": "notif-001",
  "recipientId": "emp-123",
  "recipientEmail": "ahmed.bennani@company.com",
  "subject": "Congé approuvé",
  "message": "Votre demande de congé a été approuvée",
  "type": "success",
  "priority": "normal",
  "status": "sent",
  "sentAt": "2024-12-20T10:30:00Z",
  "sender": "admin@company.com",
  "read": false
}
```

### 4. Send Notifications to Multiple Specific Users
**Endpoint:** `POST /api/notifications/send-specific`

**Description:** Send notification to specific group of users

**Request Body:**
```json
{
  "recipientIds": ["emp-123", "emp-124", "emp-125"],
  "subject": "string",
  "message": "string",
  "type": "info" | "warning" | "success" | "error",
  "priority": "low" | "normal" | "high",
  "status": "sent" | "scheduled"
}
```

**Response:** Returns array of created notifications

### 5. Send System-Wide Notification
**Endpoint:** `POST /api/notifications/send-all`

**Description:** Send notification to all users

**Request Body:**
```json
{
  "subject": "string",
  "message": "string",
  "audience": "all",
  "type": "info" | "warning" | "success" | "error",
  "priority": "low" | "normal" | "high",
  "status": "sent" | "scheduled"
}
```

**Response:** Returns created notification

### 6. Send Admin Notification
**Endpoint:** `POST /api/notifications/send-admin`

**Description:** Send notification to all admin users

**Request Body:**
```json
{
  "subject": "string",
  "message": "string",
  "audience": "admin",
  "type": "info" | "warning" | "success" | "error",
  "priority": "low" | "normal" | "high"
}
```

**Response:** Returns created notification

### 7. Send Employee Notification
**Endpoint:** `POST /api/notifications/send-employees`

**Description:** Send notification to all regular employees

**Request Body:**
```json
{
  "subject": "string",
  "message": "string",
  "audience": "employee",
  "type": "info" | "warning" | "success" | "error",
  "priority": "low" | "normal" | "high"
}
```

**Response:** Returns created notification

### 8. Mark Notification as Read
**Endpoint:** `PATCH /api/notifications/{id}/read`

**Description:** Mark a single notification as read for current user

**Request Body:**
```json
{
  "read": true
}
```

**Response:**
```json
{
  "id": "notif-001",
  "read": true,
  "readAt": "2024-12-20T11:00:00Z"
}
```

### 9. Mark All Notifications as Read
**Endpoint:** `PATCH /api/notifications/mark-all-read`

**Description:** Mark all unread notifications as read for current user

**Response:**
```json
{
  "updated": 15,
  "message": "15 notifications marked as read"
}
```

### 10. Delete Notification
**Endpoint:** `DELETE /api/notifications/{id}`

**Description:** Delete a notification for current user

**Response:**
```json
{
  "success": true,
  "message": "Notification supprimée"
}
```

### 11. Get Notification Count
**Endpoint:** `GET /api/notifications/count/unread`

**Description:** Get count of unread notifications for current user

**Response:**
```json
{
  "unread": 5,
  "total": 45
}
```

### 12. Get Notification Statistics
**Endpoint:** `GET /api/notifications/statistics`

**Description:** Fetch notification statistics

**Response:**
```json
{
  "totalSent": 1245,
  "totalRead": 980,
  "totalUnread": 265,
  "byType": {
    "info": 450,
    "warning": 300,
    "success": 350,
    "error": 145
  },
  "byPriority": {
    "low": 600,
    "normal": 500,
    "high": 145
  },
  "byAudience": {
    "all": 200,
    "admin": 150,
    "employee": 400,
    "specific": 495
  }
}
```

---

## Data Models

### Notification Object
- `id`: string (unique identifier)
- `subject`: string (notification title)
- `message`: string (notification content)
- `audience`: "all" | "admin" | "employee" | "specific"
- `recipients`: string[] (optional, for group notifications)
- `recipientId`: string (optional, for single user)
- `recipientEmail`: string (optional, for single user)
- `type`: "info" | "warning" | "success" | "error"
- `priority`: "low" | "normal" | "high"
- `sentAt`: string (ISO 8601 timestamp)
- `sender`: string (user email who sent notification)
- `status`: "sent" | "scheduled" | "draft"
- `read`: boolean (only for single user notifications)
- `readAt`: string (ISO 8601 timestamp, only for single user)

### SingleUserNotification Object
Extends Notification with:
- `recipientId`: string (required)
- `recipientEmail`: string (required)
- `read`: boolean (required)
- `readAt`: string (optional)

---

## Notification Types

### Info
- General information
- System announcements
- Updates

### Warning
- Important alerts
- Pending approvals
- Deadline reminders

### Success
- Approved requests
- Completed tasks
- Successful operations

### Error
- Failed operations
- Rejections
- System errors

---

## Priority Levels

### Low
- Non-urgent information
- General announcements
- Updates that can be reviewed later

### Normal (Default)
- Regular notifications
- Most business operations
- Standard workflow updates

### High
- Urgent matters
- Critical alerts
- Time-sensitive information

---

## Use Cases

### Single Employee Notification Examples

**1. Leave Approval**
```json
{
  "recipientId": "emp-123",
  "recipientEmail": "ahmed.bennani@company.com",
  "subject": "Votre demande de congé a été approuvée",
  "message": "Votre demande de congé du 15-20 janvier 2025 a été approuvée par RH.",
  "type": "success",
  "priority": "normal"
}
```

**2. Intervention Assignment**
```json
{
  "recipientId": "emp-456",
  "recipientEmail": "youssef.alami@company.com",
  "subject": "Nouvelle intervention assignée",
  "message": "Intervention ING-INT-2024-0090 assignée: Maintenance à ONCF Rabat",
  "type": "info",
  "priority": "high"
}
```

**3. Training Session Reminder**
```json
{
  "recipientId": "emp-789",
  "recipientEmail": "sara.fassi@company.com",
  "subject": "Rappel: Formation demain",
  "message": "N'oubliez pas votre formation 'Leadership & Management' demain à 9h00",
  "type": "warning",
  "priority": "normal"
}
```

**4. Expense Report Rejection**
```json
{
  "recipientId": "emp-234",
  "recipientEmail": "karim.idrissi@company.com",
  "subject": "Note de frais refusée",
  "message": "Votre note de frais NDF-2024-0042 a été refusée. Raison: justificatif manquant",
  "type": "error",
  "priority": "high"
}
```

---

## Notes
- All timestamps should be in ISO 8601 format with timezone (YYYY-MM-DDTHH:MM:SSZ)
- Single user notifications should include both recipientId and recipientEmail for reliability
- Real-time notifications recommended using WebSockets
- Email/SMS integration for high priority notifications
- Implement notification retention policy (e.g., keep 90 days)
- Scheduled notifications should use timezone-aware timestamps
- Read status tracking is essential for single user notifications
- Consider implementing push notifications for mobile devices
- Batch operations recommended for group notifications to reduce database load
- Implement notification templates for common scenarios
- Rate limiting recommended to prevent notification spam
