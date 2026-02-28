// AMMA Healthcare Platform - Generic API Client
// For now, this is a clean mock client with NO hardcoded data.

import type {
    User,
    PatientProfile,
    DoctorProfile,
    ResearcherProfile,
    FamilyMember,
    MedicalRecord,
    Notification,
    Appointment,
    ResearchQuery
} from '@/types';
import * as Mocks from './mockData';
import { useAuthStore } from '@/store';

const BASE_URL = '/api/v1';

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

export const apiClient = {

    // --- AUTH ENDPOINTS ---

    async login(email: string, _password: string, role: string) {
        console.log(`[API MOCK] POST ${BASE_URL}/auth/login`, { email, role });
        await new Promise(r => setTimeout(r, 600));

        // Search in registry first (includes mockUsers by default)
        const registry = useAuthStore.getState().registeredUsers;
        const user = registry.find(u => u.email === email && u.role === role);

        if (!user) {
            // If not found, create a temporary session user and add to registry
            const newUser: User = {
                id: `user_${Date.now()}`,
                email,
                firstName: email.split('@')[0],
                lastName: '',
                role: role as any,
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLoginAt: new Date(),
            };

            if (role === 'doctor' && !newUser.doctorCode) {
                newUser.doctorCode = Math.floor(1000 + Math.random() * 9000).toString();
            }

            useAuthStore.getState().addUserToRegistry(newUser);

            return {
                token: 'mock-jwt-token-12345',
                user: newUser
            };
        }

        return {
            token: 'mock-jwt-token-12345',
            user
        };
    },

    async register(data: any) {
        console.log(`[API MOCK] POST ${BASE_URL}/auth/register`, data);
        await new Promise(r => setTimeout(r, 800));

        const newUser: User = {
            id: `user_${Date.now()}`,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        if (data.role === 'doctor') {
            const registry = useAuthStore.getState().registeredUsers;
            let code: string;
            do {
                code = Math.floor(1000 + Math.random() * 9000).toString();
            } while (registry.some(u => u.doctorCode === code));
            newUser.doctorCode = code;
        }

        // Add to global registry
        useAuthStore.getState().addUserToRegistry(newUser);

        return {
            token: 'mock-jwt-token-new',
            user: newUser
        };
    },

    // --- PATIENT ENDPOINTS ---

    async getPatientProfile(_userId: string): Promise<PatientProfile | null> {
        console.log(`[API MOCK] GET ${BASE_URL}/patients/profile`);
        await new Promise(r => setTimeout(r, 300));
        return null;
    },

    async getFamilyMembers(_profileId: string): Promise<FamilyMember[]> {
        console.log(`[API MOCK] GET ${BASE_URL}/patients/family`);
        await new Promise(r => setTimeout(r, 300));
        return [];
    },

    async getMedicalRecords(_familyMemberId?: string): Promise<MedicalRecord[]> {
        console.log(`[API MOCK] GET ${BASE_URL}/medical-records`);
        await new Promise(r => setTimeout(r, 300));
        return [];
    },

    async getNotifications(_userId: string): Promise<Notification[]> {
        console.log(`[API MOCK] GET ${BASE_URL}/notifications`);
        await new Promise(r => setTimeout(r, 300));
        return [];
    },

    // --- DOCTOR ENDPOINTS ---

    async getDoctorProfile(_userId: string): Promise<DoctorProfile | null> {
        console.log(`[API MOCK] GET ${BASE_URL}/doctors/profile`);
        await new Promise(r => setTimeout(r, 300));
        return null;
    },

    async getDoctorAppointments(_doctorId: string): Promise<Appointment[]> {
        console.log(`[API MOCK] GET ${BASE_URL}/doctors/appointments`);
        await new Promise(r => setTimeout(r, 300));
        return [];
    },

    // --- RESEARCHER ENDPOINTS ---

    async getResearcherProfile(_userId: string): Promise<ResearcherProfile | null> {
        console.log(`[API MOCK] GET ${BASE_URL}/researchers/profile`);
        await new Promise(r => setTimeout(r, 300));
        return null;
    },

    async getResearchQueries(_researcherId: string): Promise<ResearchQuery[]> {
        console.log(`[API MOCK] GET ${BASE_URL}/researchers/queries`);
        await new Promise(r => setTimeout(r, 300));
        return [];
    }

};
