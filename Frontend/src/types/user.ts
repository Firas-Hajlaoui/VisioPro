export interface User {
    id: string; // API defines as string (though backend might be int, spec says string for ID in User schema? Wait. User schema says id: string readOnly. OK)
    firstName: string;
    lastName: string;
    email: string;
    role: "admin" | "employee" | "manager";
    departement?: string | null;
}

// Helper function to get full name
export const getFullName = (user: User): string => {
    return `${user.firstName} ${user.lastName}`;
};

// Mock users data
export const mockUsers: User[] = [
    { id: "emp-001", firstName: "Ahmed", lastName: "Bennani", email: "ahmed.bennani@company.com", role: "employee", departement: "IT" },
    { id: "emp-002", firstName: "Sara", lastName: "Fassi", email: "sara.fassi@company.com", role: "manager", departement: "RH" },
    { id: "emp-003", firstName: "Youssef", lastName: "Alami", email: "youssef.alami@company.com", role: "employee", departement: "Design" },
    { id: "emp-004", firstName: "Fatima", lastName: "Zohra", email: "fatima.zohra@company.com", role: "employee", departement: "Gestion de Projets" },
    { id: "emp-005", firstName: "Omar", lastName: "Benjelloun", email: "omar.benjelloun@company.com", role: "employee", departement: "IT" },
    { id: "emp-006", firstName: "Karim", lastName: "Idrissi", email: "karim.idrissi@company.com", role: "employee", departement: "Ingénierie" },
    { id: "emp-007", firstName: "Aisha", lastName: "Choudhury", email: "aisha.choudhury@company.com", role: "employee", departement: "Marketing" },
    { id: "admin-001", firstName: "Admin", lastName: "System", email: "admin@company.com", role: "admin", departement: "Administration" },
];
