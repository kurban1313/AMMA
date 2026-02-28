import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Link } from '@/types';

interface LinkState {
    links: Link[];

    // Actions
    createLinkRequest: (patientId: string, doctorId: string, patientName?: string, doctorName?: string) => void;
    acceptLink: (linkId: string) => void;
    declineLink: (linkId: string) => void;
    unlink: (linkId: string) => void;

    // Selectors
    getPatientDoctors: (patientId: string) => Link[];
    getDoctorPatients: (doctorId: string) => Link[];
    getPendingForDoctor: (doctorId: string) => Link[];
    reset: () => void;
}

export const useLinkStore = create<LinkState>()(
    persist(
        (set, get) => ({
            links: [],

            // ================= ACTIONS =================
            createLinkRequest: (patientId, doctorId, patientName, doctorName) => {
                const state = get();
                // Deterministic ID prevents duplicate requests in state
                const linkId = `link_${patientId}_${doctorId}`;

                // Prevent duplicate creation
                if (state.links.some(l => l.id === linkId)) {
                    console.warn(`[LinkStore] Link ${linkId} already exists.`);
                    return;
                }

                const newLink: Link = {
                    id: linkId,
                    patientId,
                    patientName,
                    doctorId,
                    doctorName,
                    status: 'pending',
                    requestedAt: Date.now(),
                    updatedAt: Date.now(),
                    accessLevel: 'view_only', // Default minimum access
                };

                set({ links: [...state.links, newLink] });
            },

            acceptLink: (linkId) => {
                set((state) => {
                    const target = state.links.find(l => l.id === linkId);
                    if (!target || target.status !== 'pending') {
                        console.warn(`[LinkStore] Guard rejected accept: Link ${linkId} is not pending or invalid.`);
                        return state;
                    }
                    return {
                        links: state.links.map(link =>
                            link.id === linkId
                                ? { ...link, status: 'accepted', accessLevel: 'full_access', updatedAt: Date.now() }
                                : link
                        )
                    };
                });
            },

            declineLink: (linkId) => {
                set((state) => {
                    const target = state.links.find(l => l.id === linkId);
                    if (!target || target.status !== 'pending') {
                        console.warn(`[LinkStore] Guard rejected decline: Link ${linkId} is not pending or invalid.`);
                        return state;
                    }
                    return {
                        links: state.links.map(link =>
                            link.id === linkId
                                ? { ...link, status: 'declined', updatedAt: Date.now() }
                                : link
                        )
                    };
                });
            },

            unlink: (linkId) => {
                set((state) => {
                    const target = state.links.find(l => l.id === linkId);
                    if (!target) return state; // Avoid state update if link doesn't exist

                    return {
                        links: state.links.filter(link => link.id !== linkId)
                    };
                });
            },

            // ================= SELECTORS =================
            getPatientDoctors: (patientId) => {
                return get().links.filter(
                    link => link.patientId === patientId && link.status === 'accepted'
                );
            },

            getDoctorPatients: (doctorId) => {
                return get().links.filter(
                    link => link.doctorId === doctorId && link.status === 'accepted'
                );
            },

            getPendingForDoctor: (doctorId) => {
                return get().links.filter(
                    link => link.doctorId === doctorId && link.status === 'pending'
                );
            },

            reset: () => {
                set({ links: [] });
            },
        }),
        {
            name: 'amma-links-storage', // Isolated local storage key
            storage: createJSONStorage(() => localStorage),
            version: 5, // Bump for clean state
        }
    )
);

// Debugging helper for window object (Phase 7/8)
if (typeof window !== 'undefined') {
    (window as any).AMMA_LINKS = useLinkStore;
    (window as any).debugLinkState = () => {
        console.table(useLinkStore.getState().links);
    };
    (window as any).runLinkingTestFlow = () => {
        console.log("🚀 Starting AMMA Linking Test Flow...");
        const store = useLinkStore.getState();
        const testPatientId = "test_patient_123";
        const testDoctorId = "test_doctor_456";

        console.log("1. Creating link request...");
        store.createLinkRequest(testPatientId, testDoctorId, "Test Patient", "Test Doctor");
        const linkId = `link_${testPatientId}_${testDoctorId}`;

        console.table(useLinkStore.getState().links.filter(l => l.id === linkId));

        setTimeout(() => {
            console.log("2. Accepting link request...");
            useLinkStore.getState().acceptLink(linkId);
            console.table(useLinkStore.getState().links.filter(l => l.id === linkId));
        }, 1000);

        setTimeout(() => {
            console.log("3. Unlinking...");
            useLinkStore.getState().unlink(linkId);
            console.log("✅ Flow complete. Links remaining:", useLinkStore.getState().links.length);
        }, 2000);
    };
}
