// AMMA Healthcare Platform - Mock Data Service (CLEAN VERSION)

import type {
  User,
  PatientProfile,
  DoctorProfile,
  ResearcherProfile,
  FamilyMember,
  MedicalRecord,
  Appointment,
  HealthPrediction,
  Notification,
  ResearchQuery,
  ChatMessage,
} from '@/types';

// ==================== MOCK USERS ====================
// Keeping these minimal IDs so login flow works, but they are "empty" users
export const mockUsers: User[] = [
  {
    id: 'user_admin_1',
    email: 'admin@amma.com',
    firstName: 'System',
    lastName: 'Admin',
    role: 'admin',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
  },
];

// ==================== CLEAN STATES (ALL MOCK DATA PERMANENTLY REMOVED) ====================

export const mockPatientProfiles: PatientProfile[] = [];
export const mockDoctorProfiles: DoctorProfile[] = [];
export const mockResearcherProfiles: ResearcherProfile[] = [];
export const mockMedicalRecords: MedicalRecord[] = [];
export const mockAppointments: Appointment[] = [];
export const mockHealthPredictions: HealthPrediction[] = [];
export const mockNotifications: Notification[] = [];
export const mockResearchQueries: ResearchQuery[] = [];
export const mockChatMessages: ChatMessage[] = [];
export const mockFamilyMembers: FamilyMember[] = [];

// ==================== HELPER FUNCTIONS ====================

export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find(u => u.email === email);
}

export function getPatientProfile(_userId: string): PatientProfile | undefined {
  return undefined; // No default profiles
}

export function getDoctorProfile(_userId: string): DoctorProfile | undefined {
  return undefined; // No default profiles
}

export function getResearcherProfile(_userId: string): ResearcherProfile | undefined {
  return undefined; // No default profiles
}

export function getFamilyMembers(_profileId: string): FamilyMember[] {
  return [];
}

export function getMedicalRecords(_familyMemberId: string): MedicalRecord[] {
  return [];
}

export function getAppointmentsForDoctor(_doctorId: string): Appointment[] {
  return [];
}

export function getAppointmentsForPatient(_patientId: string): Appointment[] {
  return [];
}

export function getPredictionsForPatient(_patientId: string): HealthPrediction[] {
  return [];
}

export function getNotificationsForUser(_userId: string): Notification[] {
  return [];
}

export function getQueryHistoryForResearcher(_researcherId: string): ResearchQuery[] {
  return [];
}
