import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Staff {
  id: string;
  name: string;
  title: string;
  image: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
}

export interface PreviousDirector {
  id: string;
  name: string;
  tenure: string;
  image?: string;
}

export interface SiteContent {
  mission: string;
  vision: string;
  services: string[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  bannerImage: string;
  vcImage: string;
  directorImage: string;
  logoImage: string;
  staff: Staff[];
  events: Event[];
  previousDirectors: PreviousDirector[];
}

interface AppState {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => void;
  addStaff: (staff: Staff) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addPreviousDirector: (director: PreviousDirector) => void;
  updatePreviousDirector: (id: string, director: Partial<PreviousDirector>) => void;
  deletePreviousDirector: (id: string) => void;
}

const initialContent: SiteContent = {
  mission: 'To empower students and graduates of Taraba State University with the skills, knowledge, and opportunities needed to build successful careers and contribute meaningfully to society.',
  vision: 'To be a leading center of excellence in career development, fostering a culture of employability, innovation, and lifelong learning among our students and alumni.',
  services: [
    'Career Counseling',
    'Resume & Cover Letter Review',
    'Interview Preparation',
    'Job Search Assistance',
    'Internship Placements',
    'Employer Networking Events',
    'Skills Development Workshops'
  ],
  contactEmail: 'cdes@tsuniversity.edu.ng',
  contactPhone: '+234 (0) 800 000 0000',
  contactAddress: 'Directorate of Career Development and Employability Services, Taraba State University, Jalingo',
  bannerImage: 'https://picsum.photos/seed/tsu-banner/1920/600',
  vcImage: 'https://picsum.photos/seed/vc-tsu/400/400',
  directorImage: 'https://picsum.photos/seed/director-tsu/400/400',
  logoImage: 'https://picsum.photos/seed/tsu-logo/100/100',
  staff: [
    { id: '1', name: 'Dr. A. M. Bello', title: 'Deputy Director Administration', image: 'https://picsum.photos/seed/staff1/400/400' },
    { id: '2', name: 'Dr. S. K. Ibrahim', title: 'Deputy Director Career Services', image: 'https://picsum.photos/seed/staff2/400/400' },
    { id: '3', name: 'Mr. T. O. Johnson', title: 'Industry/Linkages Liaison', image: 'https://picsum.photos/seed/staff3/400/400' },
    { id: '4', name: 'Mrs. F. A. Emmanuel', title: 'Global Linkages', image: 'https://picsum.photos/seed/staff4/400/400' },
    { id: '5', name: 'Mr. E. D. Danjuma', title: 'Internship', image: 'https://picsum.photos/seed/staff5/400/400' },
    { id: '6', name: 'Miss. G. C. Okoro', title: 'Alumni Relations', image: 'https://picsum.photos/seed/staff6/400/400' },
    { id: '7', name: 'Mr. H. B. Musa', title: 'Coordinator Tech', image: 'https://picsum.photos/seed/staff7/400/400' },
    { id: '8', name: 'Mrs. I. N. Yusuf', title: 'Admin Officer', image: 'https://picsum.photos/seed/staff8/400/400' },
  ],
  events: [
    { id: '1', title: 'Annual Career Fair 2026', date: '2026-05-15', description: 'Connect with top employers across Nigeria. Bring your resume!' },
    { id: '2', title: 'Resume Writing Workshop', date: '2026-04-10', description: 'Learn how to craft a winning resume that stands out to recruiters.' },
    { id: '3', title: 'Tech Skills Bootcamp', date: '2025-11-20', description: 'Intensive training on modern web development and data science.' },
  ],
  previousDirectors: [
    { id: '1', name: 'Prof. J. A. Ojo', tenure: '2018 - 2022', image: 'https://picsum.photos/seed/director1/400/400' }
  ]
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      content: initialContent,
      updateContent: (newContent) => set((state) => ({ content: { ...state.content, ...newContent } })),
      addStaff: (staff) => set((state) => ({ content: { ...state.content, staff: [...state.content.staff, staff] } })),
      updateStaff: (id, updatedStaff) => set((state) => ({
        content: {
          ...state.content,
          staff: state.content.staff.map(s => s.id === id ? { ...s, ...updatedStaff } : s)
        }
      })),
      deleteStaff: (id) => set((state) => ({
        content: {
          ...state.content,
          staff: state.content.staff.filter(s => s.id !== id)
        }
      })),
      addEvent: (event) => set((state) => ({ content: { ...state.content, events: [...state.content.events, event] } })),
      updateEvent: (id, updatedEvent) => set((state) => ({
        content: {
          ...state.content,
          events: state.content.events.map(e => e.id === id ? { ...e, ...updatedEvent } : e)
        }
      })),
      deleteEvent: (id) => set((state) => ({
        content: {
          ...state.content,
          events: state.content.events.filter(e => e.id !== id)
        }
      })),
      addPreviousDirector: (director) => set((state) => ({ content: { ...state.content, previousDirectors: [...(state.content.previousDirectors || []), director] } })),
      updatePreviousDirector: (id, updatedDirector) => set((state) => ({
        content: {
          ...state.content,
          previousDirectors: (state.content.previousDirectors || []).map(d => d.id === id ? { ...d, ...updatedDirector } : d)
        }
      })),
      deletePreviousDirector: (id) => set((state) => ({
        content: {
          ...state.content,
          previousDirectors: (state.content.previousDirectors || []).filter(d => d.id !== id)
        }
      })),
    }),
    {
      name: 'cdes-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          if (persistedState.content && persistedState.content.contactEmail === 'info@cdes.tsuniversity.edu.ng') {
            persistedState.content.contactEmail = 'cdes@tsuniversity.edu.ng';
          }
        }
        return persistedState as AppState;
      },
    }
  )
);
