# Frontend Pages Integration Guide

## Pages That Need API Integration

This guide lists all frontend pages that should be updated to use the new API hooks instead of mock data.

## Quick Reference

To integrate a page with the API:

1. Import the appropriate hook from `@/hooks/useApi`
2. Replace mock data with the hook's result
3. Handle loading, error, and empty states
4. Use mutation hooks for create/update/delete operations
5. Remove mock data arrays from the component

## Admin Pages

### 1. Dashboard (`src/pages/admin/Dashboard.tsx`)

**Required Hooks:**
- `useEmployees()` - Employee statistics
- `useProjects()` - Project statistics
- `useNotifications()` - Recent notifications
- `useLeaveRequests()` - Pending leave requests

**Changes:**
```typescript
// Replace mock employees
const { data: employees, isLoading } = useEmployees();

// Calculate stats from real data
const totalEmployees = employees?.length || 0;
const activeEmployees = employees?.filter(e => e.statut === 'Actif').length || 0;
```

---

### 2. GestionEmployee (`src/pages/admin/GestionEmployee.tsx`)

**Required Hooks:**
- `useEmployees()` - List employees
- `useCreateEmployee()` - Create new employee
- `useUpdateEmployee()` - Update existing employee
- `useDeleteEmployee()` - Delete employee

**Changes:**
```typescript
const { data: employees, isLoading, refetch } = useEmployees();
const createEmployee = useCreateEmployee();
const updateEmployee = useUpdateEmployee();
const deleteEmployee = useDeleteEmployee();

// In create handler
handleCreate = (data) => {
  createEmployee.mutate(data, {
    onSuccess: () => refetch()
  });
};
```

---

### 3. CongesPage (`src/pages/admin/CongesPage.tsx`)

**Required Hooks:**
- `useLeaveRequests()` - List leave requests
- `useUpdateLeaveRequest()` - Approve/reject requests
- `useDeleteLeaveRequest()` - Delete requests

**Changes:**
```typescript
const { data: leaves, isLoading, refetch } = useLeaveRequests();
const updateLeave = useUpdateLeaveRequest();

// In approve handler
handleApprove = (id) => {
  updateLeave.mutate({ id, data: { statut: 'Approuvé' } });
};
```

---

### 4. TempsPage (`src/pages/admin/TempsPage.tsx`)

**Required Hooks:**
- `useTimeRecords()` - List time records
- `useCreateTimeRecord()` - Create time record
- `useUpdateTimeRecord()` - Update time record
- `useDeleteTimeRecord()` - Delete time record

**Changes:**
```typescript
const { data: timeRecords, isLoading, refetch } = useTimeRecords();
const createTimeRecord = useCreateTimeRecord();
const updateTimeRecord = useUpdateTimeRecord();
const deleteTimeRecord = useDeleteTimeRecord();
```

---

### 5. NoteFrais (`src/pages/admin/NoteFrais.tsx`)

**Required Hooks:**
- `useExpenseReports()` - List expense reports
- `useCreateExpenseReport()` - Create expense report
- `useUpdateExpenseReport()` - Update expense report
- `useDeleteExpenseReport()` - Delete expense report

**Changes:**
```typescript
const { data: expenses, isLoading, refetch } = useExpenseReports();
const createExpense = useCreateExpenseReport();
const updateExpense = useUpdateExpenseReport();
const deleteExpense = useDeleteExpenseReport();
```

---

### 6. AutorisationsPage (`src/pages/admin/AutorisationsPage.tsx`)

**Required Hooks:**
- `useAuthorizations()` - List authorizations
- `useCreateAuthorization()` - Create authorization
- `useUpdateAuthorization()` - Update authorization
- `useDeleteAuthorization()` - Delete authorization

**Changes:**
```typescript
const { data: authorizations, isLoading, refetch } = useAuthorizations();
const createAuthorization = useCreateAuthorization();
const updateAuthorization = useUpdateAuthorization();
const deleteAuthorization = useDeleteAuthorization();
```

---

### 7. FormationPage (`src/pages/admin/FormationPage.tsx`)

**Required Hooks:**
- `useTrainingSessions()` - List training sessions
- `useCreateTrainingSession()` - Create training session
- `useUpdateTrainingSession()` - Update training session
- `useDeleteTrainingSession()` - Delete training session

**Changes:**
```typescript
const { data: trainingSessions, isLoading, refetch } = useTrainingSessions();
const createTrainingSession = useCreateTrainingSession();
const updateTrainingSession = useUpdateTrainingSession();
const deleteTrainingSession = useDeleteTrainingSession();
```

---

### 8. ProjetsPage (`src/pages/admin/ProjetsPage.tsx`)

**Required Hooks:**
- `useProjects()` - List projects
- `useCreateProject()` - Create project
- `useUpdateProject()` - Update project
- `useDeleteProject()` - Delete project
- `useProjectDocs()` - List project documents

**Changes:**
```typescript
const { data: projects, isLoading, refetch } = useProjects();
const createProject = useCreateProject();
const updateProject = useUpdateProject();
const deleteProject = useDeleteProject();

// For project documents
const { data: docs } = useProjectDocs(projectId);
```

---

### 9. NotificationsPage (`src/pages/admin/NotificationsPage.tsx`)

**Required Hooks:**
- `useNotifications()` - List notifications
- `useCreateNotification()` - Create notification
- `useUpdateNotification()` - Update notification (mark as read)
- `useDeleteNotification()` - Delete notification

**Changes:**
```typescript
const { data: notifications, isLoading, refetch } = useNotifications();
const createNotification = useCreateNotification();
const updateNotification = useUpdateNotification();
const deleteNotification = useDeleteNotification();

// Mark as read
handleMarkAsRead = (id) => {
  updateNotification.mutate({ id, data: { read: true } });
};
```

---

## Employee Pages

### 1. Employee Dashboard (`src/pages/employee/Dashboard.tsx`)

**Required Hooks:**
- `useCurrentUser()` - Current user data
- `useLeaveRequests()` - User's leave requests
- `useTimeRecords()` - User's time records
- `useExpenseReports()` - User's expense reports
- `useNotifications()` - User's notifications

**Changes:**
```typescript
const { data: user } = useCurrentUser();
const { data: leaves } = useLeaveRequests();
const { data: timeRecords } = useTimeRecords();
const { data: expenses } = useExpenseReports();
const { data: notifications } = useNotifications();

// Backend already filters by user, so no need for manual filtering
```

---

### 2. Employee Pages (Similar to Admin)

All employee pages need similar updates:
- EmployeeCongesPage → `useLeaveRequests()`, `useCreateLeaveRequest()`, etc.
- EmployeeTempsPage → `useTimeRecords()`, `useCreateTimeRecord()`, etc.
- EmployeeNoteFrais → `useExpenseReports()`, `useCreateExpenseReport()`, etc.
- EmployeeAutorisationsPage → `useAuthorizations()`, `useCreateAuthorization()`, etc.
- EmployeeProjetsPage → `useProjects()`
- EmployeeInterventionsPage → Backend API needs to be implemented for interventions

---

## Common Patterns

### Loading State
```typescript
if (isLoading) {
  return <div className="flex justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>;
}
```

### Error State
```typescript
if (error) {
  return <div className="text-red-500 p-8">
    Error loading data: {error.message}
  </div>;
}
```

### Empty State
```typescript
if (!data || data.length === 0) {
  return <div className="text-gray-500 p-8">
    No data available
  </div>;
}
```

### Create/Update/Delete Pattern
```typescript
// Create
const createMutation = useCreateXXX();

handleCreate = (formData) => {
  createMutation.mutate(formData, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xxx'] });
      // Close modal, show success message, etc.
    }
  });
};

// Update
const updateMutation = useUpdateXXX();

handleUpdate = (id, formData) => {
  updateMutation.mutate({ id, data: formData }, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xxx'] });
    }
  });
};

// Delete
const deleteMutation = useDeleteXXX();

handleDelete = (id) => {
  if (confirm('Are you sure?')) {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['xxx'] });
      }
    });
  }
};
```

### Filtering and Pagination

The backend supports filtering via query parameters:

```typescript
const { data: filteredData } = useLeaveRequests({
  statut: 'En attente',  // Filter by status
  employe: employeeId     // Filter by employee
});
```

---

## Data Format Notes

### Date Handling
Backend returns dates in ISO format (YYYY-MM-DD). Use `date-fns` for formatting:

```typescript
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const formattedDate = format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
```

### Boolean Fields
Backend returns actual boolean values (`true`/`false`), not strings:

```typescript
{item.statut === 'Actif' && <Badge>Active</Badge>}
{item.hsValide && <Check className="h-4 w-4" />}
```

### Numeric Fields
Backend returns numbers, not strings:

```typescript
<Total>{item.heures.toFixed(2)}h</Total>
<Amount>{item.montant}€</Amount>
```

---

## TypeScript Type Safety

All hooks return properly typed data:

```typescript
const { data: employees } = useEmployees();
// employees is typed as Employee[]

const { data: user } = useCurrentUser();
// user is typed as AuthUser
```

No need for type assertions or `as` casting.

---

## Example: Complete Page Integration

```typescript
import { useState } from 'react';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '@/hooks/useApi';
import { Employee } from '@/types/rh';
import { toast } from 'sonner';

export default function GestionEmployee() {
  const { data: employees, isLoading, refetch } = useEmployees();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  const handleCreate = (data: Partial<Employee>) => {
    createEmployee.mutate(data, {
      onSuccess: () => {
        refetch();
        setIsModalOpen(false);
        toast.success('Employee created successfully');
      }
    });
  };

  const handleUpdate = (id: number, data: Partial<Employee>) => {
    updateEmployee.mutate({ id, data }, {
      onSuccess: () => {
        refetch();
        toast.success('Employee updated successfully');
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee.mutate(id, {
        onSuccess: () => {
          refetch();
          toast.success('Employee deleted successfully');
        }
      });
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Add Employee</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map(emp => (
            <tr key={emp.id}>
              <td>{emp.nom} {emp.prenom}</td>
              <td>{emp.departement}</td>
              <td>{emp.statut}</td>
              <td>
                <button onClick={() => handleUpdate(emp.id, { ... })}>Edit</button>
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <EmployeeForm onSubmit={handleCreate} />
        </Modal>
      )}
    </div>
  );
}
```

---

## Backend API Implementation Needed

### Interventions Model
Create `interventions` app with:
- Intervention model matching `src/types/intervention.ts`
- InterventionSerializer
- InterventionViewSet
- API endpoints

### File Upload
Add file upload handling for:
- Project documents (actual file storage)
- Intervention photos
- Use Django's `FileField` and configure media file serving

---

## Testing

After integrating pages:

1. **Test authentication**: Login with admin/employee credentials
2. **Test CRUD operations**: Create, read, update, delete for each entity
3. **Test permissions**: Ensure employees only see their own data
4. **Test error handling**: Try invalid inputs and network errors
5. **Test loading states**: Verify UI shows loading indicators
6. **Test token refresh**: Wait for token expiration and verify auto-refresh

---

## Rollback Plan

If issues arise, you can temporarily revert to mock data by:

1. Keep mock data arrays in components
2. Conditionally use mock data if API fails:
```typescript
const { data: apiData, isLoading, error } = useEmployees();
const data = error ? mockEmployees : apiData;
```

This allows gradual migration and easy rollback.
