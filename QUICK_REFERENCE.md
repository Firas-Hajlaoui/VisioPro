# Quick Reference: API Hooks Usage

## Import
```typescript
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee
} from '@/hooks/useApi';
```

## Read Data
```typescript
const { data: employees, isLoading, error } = useEmployees();

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
if (!employees?.length) return <Empty />;
```

## Create Data
```typescript
const createEmployee = useCreateEmployee();

const handleCreate = (formData) => {
  createEmployee.mutate(formData, {
    onSuccess: () => {
      toast.success('Employee created!');
      // Query is automatically invalidated
    }
  });
};
```

## Update Data
```typescript
const updateEmployee = useUpdateEmployee();

const handleUpdate = (id, formData) => {
  updateEmployee.mutate({ id, data: formData }, {
    onSuccess: () => {
      toast.success('Employee updated!');
    }
  });
};
```

## Delete Data
```typescript
const deleteEmployee = useDeleteEmployee();

const handleDelete = (id) => {
  if (confirm('Delete this employee?')) {
    deleteEmployee.mutate(id, {
      onSuccess: () => {
        toast.success('Employee deleted!');
      }
    });
  }
};
```

## All Available Hooks

### Authentication
- `useCurrentUser()` - Get current authenticated user

### Users
- `useUsers()` - List all users (admin)
- `useUser(id)` - Get user by ID

### Notifications
- `useNotifications()`
- `useCreateNotification()`
- `useUpdateNotification()`
- `useDeleteNotification()`

### Employees
- `useEmployees()`
- `useCreateEmployee()`
- `useUpdateEmployee()`
- `useDeleteEmployee()`

### Leave Requests
- `useLeaveRequests()`
- `useCreateLeaveRequest()`
- `useUpdateLeaveRequest()`
- `useDeleteLeaveRequest()`

### Time Records
- `useTimeRecords()`
- `useCreateTimeRecord()`
- `useUpdateTimeRecord()`
- `useDeleteTimeRecord()`

### Expense Reports
- `useExpenseReports()`
- `useCreateExpenseReport()`
- `useUpdateExpenseReport()`
- `useDeleteExpenseReport()`

### Authorizations
- `useAuthorizations()`
- `useCreateAuthorization()`
- `useUpdateAuthorization()`
- `useDeleteAuthorization()`

### Training Sessions
- `useTrainingSessions()`
- `useCreateTrainingSession()`
- `useUpdateTrainingSession()`
- `useDeleteTrainingSession()`

### Projects
- `useProjects()`
- `useCreateProject()`
- `useUpdateProject()`
- `useDeleteProject()`

### Project Documents
- `useProjectDocs(projectId)`
- `useCreateProjectDoc()`
- `useUpdateProjectDoc()`
- `useDeleteProjectDoc()`

## Data Types

### Employee
```typescript
{
  id: number;
  code: string;
  nom: string;
  prenom: string;
  email: string;
  poste: string;
  departement: string;
  dateEmbauche: string; // YYYY-MM-DD
  salaire: number;
  statut: "Actif" | "Inactif" | "En congé";
}
```

### Leave Request
```typescript
{
  id: number;
  code: string;
  employe: string; // Employee name
  debut: string; // YYYY-MM-DD
  fin: string; // YYYY-MM-DD
  jours: number;
  type: string;
  motif?: string;
  statut: "En attente" | "Approuvé" | "Refusé";
}
```

### Time Record
```typescript
{
  id: number;
  code: string;
  employe: string;
  date: string; // YYYY-MM-DD
  heureEntree: string; // HH:MM:SS
  heureSortie: string; // HH:MM:SS
  lieu: string;
  heures: number;
  type: string;
  statut: string;
  hsValide: boolean;
}
```

### Project
```typescript
{
  id: number;
  code: string;
  intitule: string;
  client: string;
  chefProjet: string;
  dateDebut: string; // YYYY-MM-DD
  dateFin: string; // YYYY-MM-DD
  description?: string;
  progression: number;
  statut: "En cours" | "Terminé" | "En pause" | "Annulé";
  docsList?: ProjectDoc[];
}
```

## Common UI Components

### Table Row
```typescript
{employees?.map(emp => (
  <tr key={emp.id}>
    <td>{emp.prenom} {emp.nom}</td>
    <td>{emp.departement}</td>
    <td>{emp.poste}</td>
    <td>
      <Badge variant={emp.statut === 'Actif' ? 'success' : 'secondary'}>
        {emp.statut}
      </Badge>
    </td>
    <td>
      <Button onClick={() => handleUpdate(emp)}>Edit</Button>
      <Button onClick={() => handleDelete(emp.id)}>Delete</Button>
    </td>
  </tr>
))}
```

### Date Formatting
```typescript
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const formattedDate = format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
```

### Badge with Status
```typescript
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Approuvé': return 'success';
    case 'Refusé': return 'destructive';
    case 'En attente': return 'warning';
    default: return 'secondary';
  }
};

<Badge variant={getStatusVariant(item.statut)}>{item.statut}</Badge>
```

## Filtering

```typescript
// Backend supports filtering via query params
const { data: filteredLeaves } = useLeaveRequests({
  statut: 'En attente',
  // More params can be added as needed
});
```

## Toast Notifications

```typescript
import { toast } from 'sonner';

toast.success('Operation successful');
toast.error('Operation failed');
toast.info('Information message');
toast.warning('Warning message');
```

## Complete Example Component

```typescript
import { useState } from 'react';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '@/hooks/useApi';
import { Employee } from '@/types/rh';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function EmployeeList() {
  const { data: employees, isLoading, error, refetch } = useEmployees();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8">
        Error loading employees: {error.message}
      </div>
    );
  }

  const handleCreate = (data: Partial<Employee>) => {
    createEmployee.mutate(data, {
      onSuccess: () => {
        toast.success('Employee created successfully');
        setIsModalOpen(false);
        refetch();
      }
    });
  };

  const handleUpdate = (id: number, data: Partial<Employee>) => {
    updateEmployee.mutate({ id, data }, {
      onSuccess: () => {
        toast.success('Employee updated successfully');
        setSelectedEmployee(null);
        refetch();
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee.mutate(id, {
        onSuccess: () => {
          toast.success('Employee deleted successfully');
          refetch();
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Employee</Button>
      </div>

      {employees && employees.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.prenom} {emp.nom}</td>
                <td>{emp.departement}</td>
                <td>{emp.poste}</td>
                <td>{emp.statut}</td>
                <td className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-gray-500 text-center p-8">
          No employees found
        </div>
      )}

      {/* Modal for create/edit */}
      {isModalOpen && (
        <EmployeeForm
          employee={selectedEmployee}
          onSubmit={selectedEmployee ? (data) => handleUpdate(selectedEmployee.id, data) : handleCreate}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
}
```

## Tips

1. **Always handle loading and error states**
2. **Use toast notifications for user feedback**
3. **React Query automatically handles caching and refetching**
4. **Use optimistic updates for better UX**
5. **Backend auto-filters by user for employee endpoints**
6. **Dates are in ISO format (YYYY-MM-DD)**
7. **Booleans are true/false (not strings)**
8. **Numbers are numbers (not strings)**
9. **Use queryClient.invalidateQueries to refresh data**
10. **All mutation hooks include toast notifications automatically**

## Troubleshooting

### Hook returns undefined
- Check if the endpoint exists in backend
- Verify the API base URL is correct
- Check browser console for network errors

### 401 Unauthorized
- User might not be logged in
- Token might be expired (auto-refresh should handle this)
- Check token storage in localStorage

### 403 Forbidden
- User doesn't have permission for this endpoint
- Check user role and permissions in backend

### 404 Not Found
- Endpoint doesn't exist
- Resource with that ID doesn't exist
- Check URL in browser network tab

## Resources

- **Backend API Docs**: http://localhost:8000/swagger/
- **Integration Guide**: INTEGRATION.md
- **Page Integration Guide**: FRONTEND_INTEGRATION_GUIDE.md
- **Type Definitions**: src/types/
