// AMMA Healthcare Platform - Type Definitions

// User Roles
export type UserRole = 'patient' | 'doctor' | 'researcher' | 'admin';

// Blood Groups
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

// Gender
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

// Document Types
export type DocumentType = 'prescription' | 'lab_report' | 'doctor_note' | 'vaccination' | 'imaging' | 'other';

// Appointment Status
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'urgent';

// Prediction Severity
export type PredictionSeverity = 'low' | 'medium' | 'high' | 'critical';

// ==================== USER TYPES ====================

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profile?: PatientProfile | DoctorProfile | ResearcherProfile;
  doctorCode?: string; // 4-digit unique code for doctors
}

export interface PatientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodGroup: BloodGroup;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact?: EmergencyContact;
  address?: Address;
  trustedDoctors: TrustedDoctor[];
  familyMembers: FamilyMember[];
  medicalRecords: MedicalRecord[];
  appointments: Appointment[];
  healthPredictions: HealthPrediction[];
  notifications: Notification[];
}

export interface DoctorProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialty: string;
  subSpecialty?: string;
  qualifications: string[];
  yearsOfExperience: number;
  clinicName: string;
  clinicAddress: Address;
  phone: string;
  email: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  appointments: Appointment[];
  availability: DoctorAvailability[];
  rating: number;
  reviewCount: number;
}

export interface ResearcherProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  institution: string;
  designation: string;
  researchAreas: string[];
  credentials: string;
  isVerified: boolean;
  queryHistory: ResearchQuery[];
  accessLevel: 'basic' | 'advanced' | 'full';
}

// ==================== FAMILY HEALTH VAULT TYPES ====================

export interface FamilyMember {
  id: string;
  patientProfileId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodGroup: BloodGroup;
  allergies: string[];
  chronicConditions: string[];
  medicalRecords: MedicalRecord[];
  trustedDoctors: TrustedDoctor[];
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrustedDoctor {
  id: string;
  name: string;
  specialty?: string;
  clinic?: string;
  phone?: string;
  email?: string;
  doctorId?: string; // Platform doctor ID if linked
}

export interface MedicalRecord {
  id: string;
  familyMemberId: string;
  documentType: DocumentType;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  doctorId?: string;
  diagnosis?: string;
  prescription?: string;
  labResults?: LabResult[];
  recordDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isAnonymized: boolean;
}

export interface LabResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange?: string;
  isAbnormal: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ==================== DOCTOR PORTAL TYPES ====================

/**
 * Strict data model representing a unidirectional ownership link 
 * between a Patient and a Doctor.
 */
export interface Link {
  id: string; // Determnistic UUID
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  status: 'pending' | 'accepted' | 'declined';
  requestedAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  accessLevel: 'full_access' | 'view_only';
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  familyMemberId?: string;
  scheduledAt: Date;
  duration: number; // in minutes
  status: AppointmentStatus;
  type: 'in_person' | 'video' | 'phone';
  reason?: string;
  notes?: string;
  prescription?: string;
  diagnosis?: string;
  aiPriorityScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorAvailability {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
}

// ==================== AI PREDICTION TYPES ====================

export interface HealthPrediction {
  id: string;
  patientId: string;
  familyMemberId?: string;
  predictionType: string;
  description: string;
  severity: PredictionSeverity;
  confidenceScore: number;
  riskFactors: string[];
  recommendations: string[];
  suggestedActions: string[];
  predictedAt: Date;
  validUntil: Date;
  isRead: boolean;
  isActioned: boolean;
  appointmentBooked?: boolean;
  appointmentId?: string;
}

export interface PredictionModel {
  id: string;
  name: string;
  version: string;
  description: string;
  conditions: string[];
  accuracy: number;
  isActive: boolean;
}

// ==================== RESEARCH PLATFORM TYPES ====================

export interface ResearchQuery {
  id: string;
  researcherId: string;
  query: string;
  naturalLanguageQuery: string;
  generatedSql?: string;
  filters: ResearchFilter;
  results?: ResearchResult;
  executedAt: Date;
  executionTime: number;
  recordCount: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  errorMessage?: string;
}

export interface ResearchFilter {
  ageGroup?: { min: number; max: number };
  gender?: Gender[];
  conditions?: string[];
  region?: string[];
  timePeriod?: { start: Date; end: Date };
  bloodGroup?: BloodGroup[];
}

export interface ResearchResult {
  summary: string;
  statistics: Record<string, number | string>;
  trends: TrendData[];
  patterns: PatternData[];
  rawData?: AnonymizedRecord[];
}

export interface TrendData {
  metric: string;
  dataPoints: { period: string; value: number }[];
}

export interface PatternData {
  pattern: string;
  confidence: number;
  description: string;
}

export interface AnonymizedRecord {
  id: string;
  ageGroup: string;
  gender: Gender;
  region: string;
  conditions: string[];
  recordDate: Date;
  // No PII included
}

export interface AuditLog {
  id: string;
  researcherId: string;
  action: string;
  queryId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// ==================== NOTIFICATION TYPES ====================

export interface Notification {
  id: string;
  userId: string;
  type: 'prediction' | 'appointment' | 'record_shared' | 'doctor_linked' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  sentVia: ('in_app' | 'email' | 'sms')[];
  createdAt: Date;
  readAt?: Date;
}

// ==================== DASHBOARD TYPES ====================

export interface PatientDashboardData {
  familyMembers: FamilyMember[];
  upcomingAppointments: Appointment[];
  unreadPredictions: HealthPrediction[];
  recentRecords: MedicalRecord[];
  notifications: Notification[];
  trustedDoctors: TrustedDoctor[];
}

export interface DoctorDashboardData {
  todayAppointments: Appointment[];
  pendingAppointments: Appointment[];
  totalPatients: number;
  aiPredictions: HealthPrediction[];
  notifications: Notification[];
}

export interface ResearcherDashboardData {
  queryHistory: ResearchQuery[];
  savedQueries: ResearchQuery[];
  recentInsights: ResearchResult[];
  usageStats: {
    totalQueries: number;
    recordsAccessed: number;
    lastAccessed: Date;
  };
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== FORM TYPES ====================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

export interface FamilyMemberFormData {
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  allergies: string;
  chronicConditions: string;
}

export interface DoctorRegistrationFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialty: string;
  yearsOfExperience: number;
  clinicName: string;
  clinicAddress: Address;
  phone: string;
  qualifications: string;
}

export interface AppointmentFormData {
  doctorId: string;
  familyMemberId?: string;
  scheduledAt: string;
  duration: number;
  type: 'in_person' | 'video' | 'phone';
  reason: string;
}

// ==================== CHATBOT TYPES ====================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  queryId?: string;
  results?: ResearchResult;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  researcherId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  title?: string;
}
