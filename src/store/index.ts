// AMMA Healthcare Platform - Zustand State Management

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  User,
  UserRole,
  PatientProfile,
  DoctorProfile,
  ResearcherProfile,
  FamilyMember,
  MedicalRecord,
  TrustedDoctor,
  Appointment,
  HealthPrediction,
  DoctorAvailability,
  ResearchQuery,
  ChatMessage,
  Notification,
  ResearchResult,
  AuditLog,
} from '@/types';

import { apiClient } from '@/services/apiClient';
import * as Mocks from '@/services/mockData';

// ==================== AUTH STORE ====================

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: Partial<User>) => void;
  registeredUsers: User[];
  addUserToRegistry: (user: User) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password, role) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.login(email, password, role);
          set({ user: response.user as User, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Invalid credentials', isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.register(data);
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Registration failed', isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
        // Reset user-specific stores
        usePatientStore.getState().reset();
        useDoctorStore.getState().reset();
        useResearcherStore.getState().reset();
      },

      clearError: () => set({ error: null }),

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updated = { ...currentUser, ...userData };
          set({
            user: updated,
            registeredUsers: get().registeredUsers.map(u => u.id === updated.id ? updated : u)
          });
        }
      },

      registeredUsers: Mocks.mockUsers,

      addUserToRegistry: (user) => {
        set(state => {
          if (state.registeredUsers.some(u => u.id === user.id || u.email === user.email)) {
            return state;
          }
          return { registeredUsers: [...state.registeredUsers, user] };
        });
      },
    }),
    {
      name: 'amma-auth',
      storage: createJSONStorage(() => localStorage),
      version: 5,
    }
  )
);

// ==================== PATIENT STORE ====================

interface PatientState {
  profile: PatientProfile | null;
  familyMembers: FamilyMember[];
  medicalRecords: MedicalRecord[];
  trustedDoctors: TrustedDoctor[];
  appointments: Appointment[];
  predictions: HealthPrediction[];
  notifications: Notification[];
  isLoading: boolean;

  // Actions
  fetchInitialData: (userId: string) => Promise<void>;
  setProfile: (profile: PatientProfile) => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, data: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  addMedicalRecord: (record: MedicalRecord) => void;
  removeMedicalRecord: (id: string) => void;
  addTrustedDoctor: (doctor: TrustedDoctor) => void;
  updateTrustedDoctor: (id: string, data: Partial<TrustedDoctor>) => void;
  removeTrustedDoctor: (id: string) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  addPrediction: (prediction: HealthPrediction) => void;
  markPredictionRead: (id: string) => void;
  markPredictionActioned: (id: string, appointmentId?: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  reset: () => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set) => ({
      profile: null,
      familyMembers: [],
      medicalRecords: [],
      trustedDoctors: [],
      appointments: [],
      predictions: [],
      notifications: [],
      isLoading: false,

      fetchInitialData: async (userId: string) => {
        set({ isLoading: true });
        try {
          const profile = await apiClient.getPatientProfile(userId);
          const notifications = await apiClient.getNotifications(userId);

          if (profile) {
            const familyMembers = await apiClient.getFamilyMembers(profile.id);
            set({ profile, notifications, familyMembers, isLoading: false });
          } else {
            set({ profile, notifications, isLoading: false });
          }
        } catch (e) {
          console.error("Failed to fetch patient data", e);
          set({ isLoading: false });
        }
      },

      setProfile: (profile) => set({ profile }),

      addFamilyMember: (member) => {
        set(state => ({
          familyMembers: [...state.familyMembers, member]
        }));
      },

      updateFamilyMember: (id, data) => {
        set(state => ({
          familyMembers: state.familyMembers.map(m =>
            m.id === id ? { ...m, ...data } : m
          )
        }));
      },

      removeFamilyMember: (id) => {
        set(state => ({
          familyMembers: state.familyMembers.filter(m => m.id !== id)
        }));
      },

      addMedicalRecord: (record) => {
        set(state => ({
          medicalRecords: [record, ...state.medicalRecords]
        }));
      },

      removeMedicalRecord: (id) => {
        set(state => ({
          medicalRecords: state.medicalRecords.filter(r => r.id !== id)
        }));
      },

      addTrustedDoctor: (doctor) => {
        set(state => ({
          trustedDoctors: [...state.trustedDoctors, doctor]
        }));
      },

      updateTrustedDoctor: (id, data) => {
        set(state => ({
          trustedDoctors: state.trustedDoctors.map(d =>
            d.id === id ? { ...d, ...data } : d
          )
        }));
      },

      removeTrustedDoctor: (id) => {
        set(state => ({
          trustedDoctors: state.trustedDoctors.filter(d => d.id !== id)
        }));
      },

      addAppointment: (appointment) => {
        set(state => ({
          appointments: [...state.appointments, appointment]
        }));
      },

      updateAppointment: (id, data) => {
        set(state => ({
          appointments: state.appointments.map(a =>
            a.id === id ? { ...a, ...data } : a
          )
        }));
      },

      addPrediction: (prediction) => {
        set(state => ({
          predictions: [prediction, ...state.predictions]
        }));
      },

      markPredictionRead: (id) => {
        set(state => ({
          predictions: state.predictions.map(p =>
            p.id === id ? { ...p, isRead: true } : p
          )
        }));
      },

      markPredictionActioned: (id, appointmentId) => {
        set(state => ({
          predictions: state.predictions.map(p =>
            p.id === id
              ? { ...p, isActioned: true, appointmentBooked: !!appointmentId, appointmentId }
              : p
          )
        }));
      },

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
          )
        }));
      },

      clearAllNotifications: () => {
        set({ notifications: [] });
      },

      reset: () => {
        set({
          profile: null,
          familyMembers: [],
          medicalRecords: [],
          trustedDoctors: [],
          appointments: [],
          predictions: [],
          notifications: [],
          isLoading: false
        });
      },
    }),
    {
      name: 'amma-patient',
      storage: createJSONStorage(() => localStorage),
      version: 5,
    }
  )
);

// ==================== DOCTOR STORE ====================

interface DoctorState {
  profile: DoctorProfile | null;
  appointments: Appointment[];
  availability: DoctorAvailability[];
  notifications: Notification[];
  isLoading: boolean;

  // Actions
  fetchInitialData: (userId: string) => Promise<void>;
  setProfile: (profile: DoctorProfile) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  updateAvailability: (availability: DoctorAvailability[]) => void;
  markNotificationRead: (id: string) => void;
  reset: () => void;
}

export const useDoctorStore = create<DoctorState>()(
  persist(
    (set) => ({
      profile: null,
      appointments: [],
      availability: [],
      notifications: [],
      isLoading: false,

      fetchInitialData: async (userId: string) => {
        set({ isLoading: true });
        try {
          const profile = await apiClient.getDoctorProfile(userId);
          const notifications = await apiClient.getNotifications(userId);

          if (profile) {
            const appointments = await apiClient.getDoctorAppointments(profile.id);
            set({ profile, notifications, appointments, isLoading: false });
          } else {
            set({ profile, notifications, isLoading: false });
          }
        } catch (e) {
          console.error("Failed to fetch doctor data", e);
          set({ isLoading: false });
        }
      },

      setProfile: (profile) => set({ profile }),

      addAppointment: (appointment) => {
        set(state => ({
          appointments: [...state.appointments, appointment]
        }));
      },

      updateAppointment: (id, data) => {
        set(state => ({
          appointments: state.appointments.map(a =>
            a.id === id ? { ...a, ...data } : a
          )
        }));
      },

      updateAvailability: (availability) => {
        set({ availability });
      },

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
          )
        }));
      },

      reset: () => {
        set({
          profile: null,
          appointments: [],
          availability: [],
          notifications: [],
          isLoading: false
        });
      },
    }),
    {
      name: 'amma-doctor',
      storage: createJSONStorage(() => localStorage),
      version: 5,
    }
  )
);

// ==================== RESEARCHER STORE ====================

interface ResearcherState {
  profile: ResearcherProfile | null;
  queryHistory: ResearchQuery[];
  chatSessions: ChatSession[];
  currentSession: string | null;
  auditLogs: AuditLog[];
  isLoading: boolean;

  // Actions
  fetchInitialData: (userId: string) => Promise<void>;
  setProfile: (profile: ResearcherProfile) => void;
  addQuery: (query: ResearchQuery) => void;
  createChatSession: () => string;
  addChatMessage: (sessionId: string, message: ChatMessage) => void;
  setCurrentSession: (sessionId: string | null) => void;
  clearChatHistory: (sessionId: string) => void;
  exportQueryResults: (queryId: string, format: 'csv' | 'pdf') => void;
  reset: () => void;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export const useResearcherStore = create<ResearcherState>()(
  persist(
    (set) => ({
      profile: null,
      queryHistory: [],
      chatSessions: [],
      currentSession: null,
      auditLogs: [],
      isLoading: false,

      fetchInitialData: async (userId: string) => {
        set({ isLoading: true });
        try {
          const profile = await apiClient.getResearcherProfile(userId);

          if (profile) {
            const queryHistory = await apiClient.getResearchQueries(profile.id);
            set({ profile, queryHistory, isLoading: false });
          } else {
            set({ profile, isLoading: false });
          }
        } catch (e) {
          console.error("Failed to fetch researcher data", e);
          set({ isLoading: false });
        }
      },

      setProfile: (profile) => set({ profile }),

      addQuery: (query) => {
        set(state => ({
          queryHistory: [query, ...state.queryHistory]
        }));
      },

      createChatSession: () => {
        const sessionId = `session_${Date.now()}`;
        const newSession: ChatSession = {
          id: sessionId,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set(state => ({
          chatSessions: [...state.chatSessions, newSession],
          currentSession: sessionId,
        }));
        return sessionId;
      },

      addChatMessage: (sessionId, message) => {
        set(state => ({
          chatSessions: state.chatSessions.map(session =>
            session.id === sessionId
              ? {
                ...session,
                messages: [...session.messages, message],
                updatedAt: new Date(),
              }
              : session
          )
        }));
      },

      setCurrentSession: (sessionId) => {
        set({ currentSession: sessionId });
      },

      clearChatHistory: (sessionId) => {
        set(state => ({
          chatSessions: state.chatSessions.map(session =>
            session.id === sessionId
              ? { ...session, messages: [] }
              : session
          )
        }));
      },

      exportQueryResults: (queryId, format) => {
        // Handle export logic
        console.log(`Exporting query ${queryId} as ${format}`);
      },

      reset: () => {
        set({
          profile: null,
          queryHistory: [],
          chatSessions: [],
          currentSession: null,
          auditLogs: [],
          isLoading: false
        });
      },
    }),
    {
      name: 'amma-researcher',
      storage: createJSONStorage(() => localStorage),
      version: 5,
    }
  )
);

// ==================== UI STORE ====================

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activeModal: string | null;
  toast: {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    visible: boolean;
  } | null;

  // Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,
      activeModal: null,
      toast: null,

      toggleTheme: () => set(state => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveModal: (modal) => set({ activeModal: modal }),
      showToast: (message, type) => set({ toast: { message, type, visible: true } }),
      hideToast: () => set({ toast: null }),
    }),
    {
      name: 'amma-ui',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      onRehydrateStorage: () => (state) => {
        // Apply theme immediately on load
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  )
);

// ==================== AI STORE ====================

import { aiClient } from '@/services/aiClient';

interface AIState {
  isProcessing: boolean;
  currentPrediction: HealthPrediction | null;
  matchingResults: {
    doctors: Array<{ id: string; name: string; matchScore: number }>;
    patients: Array<{ id: string; name: string; matchScore: number }>;
  };

  // Actions
  setProcessing: (processing: boolean) => void;
  generatePrediction: (patientId: string, familyMemberId?: string) => Promise<HealthPrediction | null>;
  matchDoctorByName: (name: string) => Promise<Array<{ id: string; name: string; matchScore: number }>>;
  matchDoctorByCode: (code: string) => Promise<Array<{ id: string; name: string; matchScore: number }>>;
  matchPatientByName: (name: string) => Promise<Array<{ id: string; name: string; matchScore: number }>>;
  processResearchQuery: (query: string, filters: any) => Promise<ResearchResult | null>;
}

export const useAIStore = create<AIState>()(
  (set, get) => ({
    isProcessing: false,
    currentPrediction: null,
    matchingResults: { doctors: [], patients: [] },

    setProcessing: (processing: boolean) => set({ isProcessing: processing }),

    generatePrediction: async (patientId: string, _familyMemberId?: string) => {
      set({ isProcessing: true });
      try {
        // Fetch patient context (using mock data structure for context)
        const patientContext = { id: patientId, conditions: ['Hypertension', 'Type 2 Diabetes Family History'], age: 45, recentLabResults: 'Elevated glucose' };

        const prediction = await aiClient.generateHealthPrediction(patientContext);

        if (prediction) {
          set({ currentPrediction: prediction, isProcessing: false });
          // Also push into the patient store so HealthPredictions page can render it
          usePatientStore.getState().addPrediction(prediction);
          return prediction;
        } else {
          set({ isProcessing: false });
          return null;
        }
      } catch (error) {
        set({ isProcessing: false });
        return null;
      }
    },

    matchDoctorByName: async (name: string) => {
      set({ isProcessing: true });
      try {
        // Fetch doctor candidates from the global registry in useAuthStore
        const candidates = useAuthStore.getState().registeredUsers
          .filter(u => u.role === 'doctor')
          .map(u => ({
            id: u.id,
            user: { firstName: u.firstName || '', lastName: u.lastName || '' },
            email: u.email
          }));

        const results = await aiClient.matchDoctor(name, candidates);

        set({ matchingResults: { ...get().matchingResults, doctors: results }, isProcessing: false });
        return results;
      } catch (error) {
        set({ isProcessing: false });
        return [];
      }
    },

    matchDoctorByCode: async (code: string) => {
      set({ isProcessing: true });
      try {
        const doctor = useAuthStore.getState().registeredUsers
          .find(u => u.role === 'doctor' && u.doctorCode === code);

        if (doctor) {
          const result = {
            id: doctor.id,
            name: `${doctor.firstName} ${doctor.lastName}`,
            matchScore: 1
          };
          set({ matchingResults: { ...get().matchingResults, doctors: [result] }, isProcessing: false });
          return [result];
        }

        set({ matchingResults: { ...get().matchingResults, doctors: [] }, isProcessing: false });
        return [];
      } catch (error) {
        set({ isProcessing: false });
        return [];
      }
    },

    matchPatientByName: async (name: string) => {
      set({ isProcessing: true });
      try {
        const availablePatients: any[] = [];

        const results = await aiClient.matchPatient(name, availablePatients);

        set({ matchingResults: { ...get().matchingResults, patients: results }, isProcessing: false });
        return results;
      } catch (error) {
        set({ isProcessing: false });
        return [];
      }
    },

    processResearchQuery: async (query: string, _filters: any) => {
      set({ isProcessing: true });
      try {
        const contextData = {
          datasetSize: 15420,
          demographics: { avgAge: 52, male: '48%', female: '52%' },
          keyMetrics: ['prevalence_rate', 'comorbidity_score']
        };

        const result = await aiClient.processResearchQuery(query, contextData);

        set({ isProcessing: false });
        return result;
      } catch (error) {
        set({ isProcessing: false });
        console.error('Error in processResearchQuery:', error);
        return null;
      }
    },
  })
);

export * from './linkStore';
