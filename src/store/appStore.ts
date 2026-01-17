import { create } from 'zustand';

// Types
export type UserRole = 'worker' | 'employer' | 'admin' | null;
export type SkillStatus = 'pending' | 'verified' | 'rejected';
export type JobStatus = 'open' | 'assigned' | 'completed' | 'cancelled';

export interface Skill {
  id: string;
  name: string;
  category: string;
  status: SkillStatus;
  proof?: string;
  verifiedAt?: Date;
}

export interface Worker {
  id: string;
  name: string;
  avatar: string;
  trustScore: number;
  isAvailable: boolean;
  skills: Skill[];
  completedTasks: number;
  earnings: number;
  rating: number;
  location: string;
  joinedAt: Date;
  preferredLanguage?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  employer: string;
  employerId: string;
  wage: number;
  fairWageScore: number;
  duration: string;
  distance: number;
  requiredSkills: string[];
  matchScore?: number;
  completionProbability?: number;
  status: JobStatus;
  assignedWorker?: string;
  createdAt: Date;
  deadline: Date;
}

export interface Employer {
  id: string;
  name: string;
  company: string;
  avatar: string;
  postedTasks: number;
  completedTasks: number;
  averageRating: number;
  totalSpent: number;
}

export interface Task {
  id: string;
  title: string;
  worker: string;
  workerId: string;
  status: 'pending' | 'in-progress' | 'completed';
  rating?: number;
  feedback?: string;
  completedAt?: Date;
  wage: number;
}

export interface PlatformStats {
  totalWorkers: number;
  totalEmployers: number;
  tasksCompleted: number;
  averageWage: number;
  fairnessIndex: number;
  activeJobs: number;
}

interface AppState {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  currentWorker: Worker | null;
  setCurrentWorker: (worker: Worker | null) => void;
  updateWorkerAvailability: (available: boolean) => void;

  workers: Worker[];
  jobs: Job[];
  employers: Employer[];
  tasks: Task[];
  platformStats: PlatformStats;

  // Actions
  calculateMatchScore: (workerId: string, jobId: string) => number;
  calculateCompletionProbability: (workerId: string, jobId: string) => number;
  calculateFairWage: (skills: string[], duration: string) => number;
  acceptJob: (jobId: string) => void;
  declineJob: (jobId: string) => void;
  verifySkill: (workerId: string, skillId: string, status: SkillStatus) => void;
  postTask: (task: Partial<Job>) => void;
  assignWorker: (jobId: string, workerId: string) => void;
  updateWorkerName: (name: string) => void;
}

// Mock data generators
const generateMockWorkers = (): Worker[] => [
  {
    id: 'w1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    trustScore: 92,
    isAvailable: true,
    skills: [
      { id: 's1', name: 'Housekeeping', category: 'Domestic', status: 'verified' },
      { id: 's2', name: 'Cooking', category: 'Domestic', status: 'verified' },
      { id: 's3', name: 'Childcare', category: 'Care', status: 'pending' },
    ],
    completedTasks: 127,
    earnings: 45600,
    rating: 4.8,
    location: 'Mumbai Central',
    joinedAt: new Date('2023-06-15'),
    preferredLanguage: 'Hindi',
  },
  {
    id: 'w2',
    name: 'Anita Devi',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
    trustScore: 88,
    isAvailable: true,
    skills: [
      { id: 's4', name: 'Tailoring', category: 'Skilled', status: 'verified' },
      { id: 's5', name: 'Embroidery', category: 'Skilled', status: 'verified' },
    ],
    completedTasks: 89,
    earnings: 38200,
    rating: 4.6,
    location: 'Andheri West',
    joinedAt: new Date('2023-08-22'),
    preferredLanguage: 'Marathi',
  },
  {
    id: 'w3',
    name: 'Meena Kumari',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
    trustScore: 76,
    isAvailable: false,
    skills: [
      { id: 's6', name: 'Elderly Care', category: 'Care', status: 'verified' },
      { id: 's7', name: 'First Aid', category: 'Medical', status: 'pending' },
    ],
    completedTasks: 45,
    earnings: 22800,
    rating: 4.4,
    location: 'Bandra',
    joinedAt: new Date('2024-01-10'),
  },
  {
    id: 'w4',
    name: 'Sunita Rao',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    trustScore: 95,
    isAvailable: true,
    skills: [
      { id: 's8', name: 'Office Cleaning', category: 'Commercial', status: 'verified' },
      { id: 's9', name: 'Deep Cleaning', category: 'Commercial', status: 'verified' },
      { id: 's10', name: 'Laundry', category: 'Domestic', status: 'verified' },
    ],
    completedTasks: 203,
    earnings: 72400,
    rating: 4.9,
    location: 'Powai',
    joinedAt: new Date('2022-11-05'),
  },
];

const generateMockJobs = (): Job[] => [
  {
    id: 'j1',
    title: 'Daily House Cleaning',
    description: 'Need someone for regular house cleaning, 3 hours daily. Must be punctual and thorough.',
    employer: 'Sharma Residence',
    employerId: 'e1',
    wage: 500,
    fairWageScore: 85,
    duration: '3 hours',
    distance: 2.5,
    requiredSkills: ['Housekeeping'],
    status: 'open',
    createdAt: new Date(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'j2',
    title: 'Elderly Care Support',
    description: 'Looking for compassionate caregiver for my mother. Morning shift, includes light meal prep.',
    employer: 'Gupta Family',
    employerId: 'e2',
    wage: 800,
    fairWageScore: 92,
    duration: '5 hours',
    distance: 4.2,
    requiredSkills: ['Elderly Care', 'Cooking'],
    status: 'open',
    createdAt: new Date(),
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'j3',
    title: 'Office Deep Cleaning',
    description: 'Weekend deep cleaning for a 2000 sq ft office space. Team of 2-3 preferred.',
    employer: 'TechStart Solutions',
    employerId: 'e3',
    wage: 1500,
    fairWageScore: 88,
    duration: '8 hours',
    distance: 6.8,
    requiredSkills: ['Office Cleaning', 'Deep Cleaning'],
    status: 'open',
    createdAt: new Date(),
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'j4',
    title: 'Blouse Stitching - Urgent',
    description: 'Need 5 designer blouses stitched for wedding. Embroidery work included.',
    employer: 'Mehta Boutique',
    employerId: 'e4',
    wage: 2500,
    fairWageScore: 78,
    duration: '2 days',
    distance: 3.1,
    requiredSkills: ['Tailoring', 'Embroidery'],
    status: 'open',
    createdAt: new Date(),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
];

const generateMockEmployers = (): Employer[] => [
  {
    id: 'e1',
    name: 'Rajesh Sharma',
    company: 'Sharma Residence',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    postedTasks: 45,
    completedTasks: 42,
    averageRating: 4.7,
    totalSpent: 125000,
  },
  {
    id: 'e2',
    name: 'Neha Gupta',
    company: 'Gupta Family',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    postedTasks: 28,
    completedTasks: 26,
    averageRating: 4.9,
    totalSpent: 89000,
  },
  {
    id: 'e3',
    name: 'Vikram Singh',
    company: 'TechStart Solutions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    postedTasks: 67,
    completedTasks: 65,
    averageRating: 4.6,
    totalSpent: 340000,
  },
];

const generateMockTasks = (): Task[] => [
  {
    id: 't1',
    title: 'Kitchen Deep Clean',
    worker: 'Priya Sharma',
    workerId: 'w1',
    status: 'completed',
    rating: 5,
    feedback: 'Excellent work! Very thorough.',
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    wage: 450,
  },
  {
    id: 't2',
    title: 'Weekly Housekeeping',
    worker: 'Sunita Rao',
    workerId: 'w4',
    status: 'in-progress',
    wage: 600,
  },
  {
    id: 't3',
    title: 'Saree Alteration',
    worker: 'Anita Devi',
    workerId: 'w2',
    status: 'completed',
    rating: 4,
    feedback: 'Good work, slightly delayed.',
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    wage: 350,
  },
];

const platformStats: PlatformStats = {
  totalWorkers: 12847,
  totalEmployers: 3421,
  tasksCompleted: 89234,
  averageWage: 485,
  fairnessIndex: 87,
  activeJobs: 1243,
};

export const useAppStore = create<AppState>((set, get) => ({
  currentRole: null,
  setCurrentRole: (role) => set({ currentRole: role }),

  currentWorker: generateMockWorkers()[0],
  setCurrentWorker: (worker) => set({ currentWorker: worker }),
  updateWorkerAvailability: (available) => set((state) => ({
    currentWorker: state.currentWorker
      ? { ...state.currentWorker, isAvailable: available }
      : null,
  })),

  workers: generateMockWorkers(),
  jobs: generateMockJobs(),
  employers: generateMockEmployers(),
  tasks: generateMockTasks(),
  platformStats,

  calculateMatchScore: (workerId: string, jobId: string) => {
    const { workers, jobs } = get();
    const worker = workers.find(w => w.id === workerId);
    const job = jobs.find(j => j.id === jobId);

    if (!worker || !job) return 0;

    // Skill match (40%)
    const workerSkills = worker.skills.filter(s => s.status === 'verified').map(s => s.name);
    const matchedSkills = job.requiredSkills.filter(s => workerSkills.includes(s));
    const skillScore = (matchedSkills.length / job.requiredSkills.length) * 40;

    // Trust score (25%)
    const trustScore = (worker.trustScore / 100) * 25;

    // Availability bonus (15%)
    const availabilityScore = worker.isAvailable ? 15 : 0;

    // Distance penalty (10%)
    const distanceScore = Math.max(0, 10 - job.distance);

    // Rating bonus (10%)
    const ratingScore = (worker.rating / 5) * 10;

    return Math.round(skillScore + trustScore + availabilityScore + distanceScore + ratingScore);
  },

  calculateCompletionProbability: (workerId: string, jobId: string) => {
    const { workers } = get();
    const worker = workers.find(w => w.id === workerId);

    if (!worker) return 0;

    const baseProb = 60;
    const trustBonus = (worker.trustScore / 100) * 20;
    const experienceBonus = Math.min(worker.completedTasks / 10, 15);
    const ratingBonus = (worker.rating / 5) * 5;

    return Math.min(99, Math.round(baseProb + trustBonus + experienceBonus + ratingBonus));
  },

  calculateFairWage: (skills: string[], duration: string) => {
    const baseRates: Record<string, number> = {
      'Housekeeping': 150,
      'Cooking': 180,
      'Childcare': 200,
      'Elderly Care': 220,
      'Tailoring': 250,
      'Embroidery': 280,
      'Office Cleaning': 160,
      'Deep Cleaning': 180,
      'First Aid': 200,
      'Laundry': 140,
    };

    const avgRate = skills.reduce((acc, skill) => acc + (baseRates[skill] || 150), 0) / skills.length;
    const hours = parseInt(duration) || 3;

    return Math.round(avgRate * hours);
  },

  acceptJob: (jobId: string) => set((state) => ({
    jobs: state.jobs.map(job =>
      job.id === jobId
        ? { ...job, status: 'assigned' as JobStatus, assignedWorker: state.currentWorker?.id }
        : job
    ),
  })),

  declineJob: (jobId: string) => set((state) => ({
    jobs: state.jobs.filter(job => job.id !== jobId),
  })),

  verifySkill: (workerId: string, skillId: string, status: SkillStatus) => set((state) => ({
    workers: state.workers.map(worker =>
      worker.id === workerId
        ? {
          ...worker,
          skills: worker.skills.map(skill =>
            skill.id === skillId ? { ...skill, status, verifiedAt: new Date() } : skill
          ),
        }
        : worker
    ),
  })),

  postTask: (task: Partial<Job>) => set((state) => ({
    jobs: [
      ...state.jobs,
      {
        id: `j${state.jobs.length + 1}`,
        title: task.title || 'New Task',
        description: task.description || '',
        employer: 'Current Employer',
        employerId: 'e1',
        wage: task.wage || 500,
        fairWageScore: 85,
        duration: task.duration || '3 hours',
        distance: Math.random() * 10,
        requiredSkills: task.requiredSkills || [],
        status: 'open' as JobStatus,
        createdAt: new Date(),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
  })),

  assignWorker: (jobId: string, workerId: string) => set((state) => ({
    jobs: state.jobs.map(job =>
      job.id === jobId
        ? { ...job, status: 'assigned' as JobStatus, assignedWorker: workerId }
        : job
    ),
  })),

  updateWorkerName: (name: string) => set((state) => ({
    currentWorker: state.currentWorker
      ? { ...state.currentWorker, name }
      : null,
    workers: state.workers.map(w =>
      w.id === state.currentWorker?.id ? { ...w, name } : w
    )
  })),
}));
