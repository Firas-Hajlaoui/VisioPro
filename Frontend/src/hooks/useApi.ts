import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import { AuthUser } from "@/types/auth";
import { User } from "@/types/user";
import { Employee, LeaveRequest, TimeRecord, ExpenseReport, Authorization } from "@/types/rh";
import { Project, ProjectDoc } from "@/types/project";
import { Notification } from "@/types/notification";
import { TrainingSession } from "@/types/formation";
import { toast } from "sonner";

// ============== Users ==============
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => apiClient.get('/users/me/') as Promise<AuthUser>,
    enabled: apiClient.isAuthenticated(),
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/users/') as Promise<User[]>,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiClient.get(`/users/${id}/`) as Promise<User>,
    enabled: !!id,
  });
};

// ============== Notifications ==============
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.get('/notifications/') as Promise<Notification[]>,
  });
};

export const useNotification = (id: string) => {
  return useQuery({
    queryKey: ['notifications', id],
    queryFn: () => apiClient.get(`/notifications/${id}/`) as Promise<Notification>,
    enabled: !!id,
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Notification>) =>
      apiClient.post('/notifications/', data) as Promise<Notification>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Notification> }) =>
      apiClient.put(`/notifications/${id}/`, data) as Promise<Notification>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/notifications/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============== Employees ==============
export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => apiClient.get('/employees/') as Promise<Employee[]>,
  });
};

export const useEmployee = (id: number) => {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => apiClient.get(`/employees/${id}/`) as Promise<Employee>,
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Employee>) =>
      apiClient.post('/employees/', data) as Promise<Employee>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Employee> }) =>
      apiClient.put(`/employees/${id}/`, data) as Promise<Employee>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/employees/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============== Leave Requests ==============
export const useLeaveRequests = () => {
  return useQuery({
    queryKey: ['leaves'],
    queryFn: () => apiClient.get('/leaves/') as Promise<LeaveRequest[]>,
  });
};

export const useLeaveRequest = (id: number) => {
  return useQuery({
    queryKey: ['leaves', id],
    queryFn: () => apiClient.get(`/leaves/${id}/`) as Promise<LeaveRequest>,
    enabled: !!id,
  });
};

export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LeaveRequest>) =>
      apiClient.post('/leaves/', data) as Promise<LeaveRequest>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success('Leave request created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LeaveRequest> }) =>
      apiClient.put(`/leaves/${id}/`, data) as Promise<LeaveRequest>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success('Leave request updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/leaves/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success('Leave request deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============== Time Records ==============
export const useTimeRecords = () => {
  return useQuery({
    queryKey: ['timeRecords'],
    queryFn: () => apiClient.get('/time-records/') as Promise<TimeRecord[]>,
  });
};

export const useTimeRecord = (id: number) => {
  return useQuery({
    queryKey: ['timeRecords', id],
    queryFn: () => apiClient.get(`/time-records/${id}/`) as Promise<TimeRecord>,
    enabled: !!id,
  });
};

export const useCreateTimeRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TimeRecord>) =>
      apiClient.post('/time-records/', data) as Promise<TimeRecord>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeRecords'] });
      toast.success('Time record created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateTimeRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TimeRecord> }) =>
      apiClient.put(`/time-records/${id}/`, data) as Promise<TimeRecord>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeRecords'] });
      toast.success('Time record updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteTimeRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/time-records/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeRecords'] });
      toast.success('Time record deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============== Expense Reports ==============
export const useExpenseReports = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: () => apiClient.get('/expenses/') as Promise<ExpenseReport[]>,
  });
};

export const useExpenseReport = (id: number) => {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: () => apiClient.get(`/expenses/${id}/`) as Promise<ExpenseReport>,
    enabled: !!id,
  });
};

export const useCreateExpenseReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ExpenseReport>) =>
      apiClient.post('/expenses/', data) as Promise<ExpenseReport>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense report created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateExpenseReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ExpenseReport> }) =>
      apiClient.put(`/expenses/${id}/`, data) as Promise<ExpenseReport>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense report updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteExpenseReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/expenses/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense report deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============== Authorizations ==============
export const useAuthorizations = () => {
  return useQuery({
    queryKey: ['authorizations'],
    queryFn: () => apiClient.get('/authorizations/') as Promise<Authorization[]>,
  });
};

export const useAuthorization = (id: number) => {
  return useQuery({
    queryKey: ['authorizations', id],
    queryFn: () => apiClient.get(`/authorizations/${id}/`) as Promise<Authorization>,
    enabled: !!id,
  });
};

export const useCreateAuthorization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Authorization>) =>
      apiClient.post('/authorizations/', data) as Promise<Authorization>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authorizations'] });
      toast.success('Authorization created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateAuthorization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Authorization> }) =>
      apiClient.put(`/authorizations/${id}/`, data) as Promise<Authorization>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authorizations'] });
      toast.success('Authorization updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteAuthorization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/authorizations/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authorizations'] });
      toast.success('Authorization deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============== Projects ==============
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => apiClient.get('/projects/') as Promise<Project[]>,
  });
};

export const useProject = (id: number) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => apiClient.get(`/projects/${id}/`) as Promise<Project>,
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Project>) =>
      apiClient.post('/projects/', data) as Promise<Project>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) =>
      apiClient.put(`/projects/${id}/`, data) as Promise<Project>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/projects/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============== Project Documents ==============
export const useProjectDocs = (projectId: number) => {
  return useQuery({
    queryKey: ['projectDocs', projectId],
    queryFn: () => apiClient.get(`/projects/${projectId}/docs/`) as Promise<ProjectDoc[]>,
    enabled: !!projectId,
  });
};

export const useProjectDoc = (id: number) => {
  return useQuery({
    queryKey: ['projectDocs', id],
    queryFn: () => apiClient.get(`/project-docs/${id}/`) as Promise<ProjectDoc>,
    enabled: !!id,
  });
};

export const useCreateProjectDoc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ProjectDoc>) =>
      apiClient.post('/project-docs/', data) as Promise<ProjectDoc>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectDocs'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project document created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateProjectDoc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProjectDoc> }) =>
      apiClient.put(`/project-docs/${id}/`, data) as Promise<ProjectDoc>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectDocs'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project document updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteProjectDoc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/project-docs/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectDocs'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project document deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============== Training Sessions ==============
export const useTrainingSessions = () => {
  return useQuery({
    queryKey: ['trainingSessions'],
    queryFn: () => apiClient.get('/training-sessions/') as Promise<TrainingSession[]>,
  });
};

export const useTrainingSession = (id: number) => {
  return useQuery({
    queryKey: ['trainingSessions', id],
    queryFn: () => apiClient.get(`/training-sessions/${id}/`) as Promise<TrainingSession>,
    enabled: !!id,
  });
};

export const useCreateTrainingSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TrainingSession>) =>
      apiClient.post('/training-sessions/', data) as Promise<TrainingSession>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      toast.success('Training session created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateTrainingSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TrainingSession> }) =>
      apiClient.put(`/training-sessions/${id}/`, data) as Promise<TrainingSession>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      toast.success('Training session updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteTrainingSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/training-sessions/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      toast.success('Training session deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
