import axios from 'axios';

// --- Types ---

export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    tech: string[];
    link: string;
    github?: string;
    showLink: boolean;
    showGithub: boolean;
    featured?: boolean;
    category?: string;
    views?: number;
}

export interface Quote {
    id: string;
    text: string;
    author?: string;
    visible: boolean;
}

export interface Visitor {
    id: string;
    email: string;
    date: string;
    page: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface HomePageData {
    heroTagline: string;
    heroDescription: string;
    showProjects: boolean;
    [key: string]: any;
}

export interface AboutPageData {
    profileImage: string;
    tagline: string;
    bio?: string;
    techStack: { name: string; icon: string }[];
}

export interface ContactPageData {
    email: string;
    phone: string;
    location: string;
    formEnabled: boolean;
}

export interface GlobalSettings {
    siteTitle: string;
    metaDescription: string;
    [key: string]: any;
}

// --- API Service ---

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Generic Fetcher
const fetcher = async <T>(url: string): Promise<T> => {
    const res = await api.get<T>(url);
    return res.data;
};

// Generic Poster
const poster = async <T>(url: string, data: any): Promise<T> => {
    const res = await api.post<T>(url, data);
    return res.data;
};

// API Endpoints Functions

// Projects
export const getProjects = () => fetcher<Project[]>('/projects');
export const saveProject = (data: Partial<Project>) => poster<Project>('/projects', data);
export const incrementProjectView = (id: string) => poster(`/projects?id=${id}&action=view`, {});

// Contact
export const getContactData = () => fetcher<ContactPageData>('/contact');
export const sendContactMessage = (data: { name: string; email: string; message: string }) =>
    poster('/contact', data);

// Visitors
export const getVisitors = () => fetcher<Visitor[]>('/visitors');
export const trackVisitor = (data: Partial<Visitor>) => poster('/visitors', data);

// Home
export const getHomeData = () => fetcher<HomePageData>('/home');
export const updateHomeData = (data: Partial<HomePageData>) => poster('/home', data);

// About
export const getAboutData = () => fetcher<AboutPageData>('/about');
export const updateAboutData = (data: Partial<AboutPageData>) => poster('/about', data);

// Quotes
export const getQuotes = () => fetcher<Quote[]>('/quotes');
export const updateQuotes = (quotes: Quote[]) => poster<Quote[]>('/quotes', quotes);

// Settings
export const getSettings = () => fetcher<GlobalSettings>('/settings');
export const updateSettings = (data: Partial<GlobalSettings>) => poster('/settings', data);

// Admin (Login and Specialized Actions)
export const login = (credentials: any) => poster('/admin?action=login', credentials);
export const getAnalytics = () => fetcher('/admin?action=analytics');
export const getSecuritySettings = () => fetcher('/admin?action=security-settings');
export const updateSecuritySettings = (data: any) => poster('/admin?action=security-settings', data);

export default api;
