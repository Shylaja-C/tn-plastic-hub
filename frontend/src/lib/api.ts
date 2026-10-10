/**
 * TNPlasticHub API Client
 * Central fetch wrapper — all API calls go through here.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/v1';

// ── Token management (localStorage) ─────────────────────────────────────────

export const token = {
  get: (): string | null =>
    typeof window !== 'undefined' ? localStorage.getItem('tnp_token') : null,
  getRefresh: (): string | null =>
    typeof window !== 'undefined' ? localStorage.getItem('tnp_refresh_token') : null,
  set: (t: string, r?: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tnp_token', t);
      if (r) localStorage.setItem('tnp_refresh_token', r);
    }
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tnp_token');
      localStorage.removeItem('tnp_refresh_token');
    }
  },
};

export const userStore = {
  get: (): User | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('tnp_user');
    return raw ? JSON.parse(raw) : null;
  },
  set: (u: User) =>
    typeof window !== 'undefined' && localStorage.setItem('tnp_user', JSON.stringify(u)),
  clear: () =>
    typeof window !== 'undefined' && localStorage.removeItem('tnp_user'),
};

// ── Core fetch wrapper ────────────────────────────────────────────────────────

type FetchOpts = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
};

export async function apiFetch<T = unknown>(
  path: string,
  { method = 'GET', body, auth = true, params }: FetchOpts = {}
): Promise<T> {
  let url = `${BASE}${path}`;

  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const t = token.get();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, `Network error: failed to connect to API at ${BASE}. Please verify the backend is running.`);
  }

  if (res.status === 401 && auth && token.getRefresh()) {
    try {
      const refreshRes = await fetch(`${BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: token.getRefresh() }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        token.set(data.access_token, data.refresh_token);
        headers['Authorization'] = `Bearer ${data.access_token}`;
        res = await fetch(url, {
          method,
          headers,
          body: body !== undefined ? JSON.stringify(body) : undefined,
        });
      } else {
        token.clear();
        userStore.clear();
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    } catch {
      token.clear();
      userStore.clear();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    if (res.status === 401) {
      token.clear();
      userStore.clear();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    throw new ApiError(res.status, parseApiError(err.detail) ?? 'Request failed');
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/**
 * Parse FastAPI error detail into a readable string.
 * detail can be a string OR a Pydantic validation array like
 * [{ "msg": "...", "loc": [...] }]
 */
export function parseApiError(detail: unknown): string {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d: { msg?: string; loc?: string[] }) =>
        d.msg ? `${d.loc?.slice(-1)[0] ?? 'field'}: ${d.msg}` : JSON.stringify(d)
      )
      .join('. ');
  }
  return 'Request failed';
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'industry' | 'entrepreneur' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  is_verified: boolean;
  college_name?: string;
  department?: string;
  graduation_year?: number;
  skills?: string;
  bio?: string;
  linkedin_url?: string;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  owner_id: number;
  name: string;
  company_type: string;
  status: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  district?: string;
  state: string;
  description?: string;
  year_established?: number;
  employee_count?: number;
  logo_url?: string;
  created_at: string;
}

export interface Internship {
  id: number;
  company_id: number;
  title: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  internship_type: string;
  status: string;
  location?: string;
  duration_months?: number;
  stipend_amount?: number;
  vacancies: number;
  skills_required?: string;
  application_deadline?: string;
  created_at: string;
  company?: Pick<Company, 'id' | 'name' | 'city' | 'logo_url' | 'status' | 'company_type'>;
}

export interface Application {
  id: number;
  applicant_id: number;
  internship_id: number;
  status: string;
  cover_letter?: string;
  resume_url?: string;
  created_at: string;
  updated_at: string;
  internship?: Internship;
}

export interface IndustrialVisit {
  id: number;
  company_id: number;
  title: string;
  description?: string;
  visit_date: string;
  duration_hours?: number;
  max_participants: number;
  location?: string;
  status: string;
  target_audience?: string;
  registration_deadline?: string;
  created_at: string;
  company?: Pick<Company, 'id' | 'name' | 'city' | 'logo_url' | 'status' | 'company_type'>;
}

export interface Booking {
  id: number;
  visit_id: number;
  student_id: number;
  status: string;
  notes?: string;
  created_at: string;
  visit?: IndustrialVisit;
}

export interface Scheme {
  id: number;
  title: string;
  category: string;
  status: string;
  description?: string;
  eligibility?: string;
  benefits?: string;
  issuing_authority?: string;
  scheme_url?: string;
  application_deadline?: string;
  is_featured: boolean;
}

export interface Loan {
  id: number;
  title: string;
  provider: string;
  category: string;
  status: string;
  description?: string;
  eligibility?: string;
  interest_rate_min?: string;
  interest_rate_max?: string;
  max_amount?: number;
  collateral_required: boolean;
  is_featured: boolean;
  application_url?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  category: string;
  status: string;
  thumbnail_url?: string;
  is_featured: boolean;
  created_at: string;
}

export interface Technology {
  id: number;
  name: string;
  category: string;
  description?: string;
  applications?: string;
  advantages?: string;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
}

export interface Association {
  id: number;
  name: string;
  acronym?: string;
  description?: string;
  headquarters?: string;
  website?: string;
  contact_email?: string;
  logo_url?: string;
  is_active: boolean;
}

export interface ContactItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  created_at: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface AdminDashboard {
  users: { total: number; active: number; students: number };
  companies: { total: number; verified: number; pending_verification: number };
  internships: { active: number };
  applications: { total: number; shortlisted: number };
  industrial_visits: { total: number };
  news: { published: number };
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: {
    email: string; password: string; full_name: string;
    role: UserRole; phone?: string; college_name?: string; department?: string;
  }) => apiFetch<User>('/auth/register', { method: 'POST', body: data, auth: false }),

  login: async (email: string, password: string): Promise<User> => {
    const res = await apiFetch<{ access_token: string; refresh_token: string }>(
      '/auth/login', { method: 'POST', body: { email, password }, auth: false }
    );
    token.set(res.access_token, res.refresh_token);
    const user = await apiFetch<User>('/auth/me');
    userStore.set(user);
    return user;
  },

  me: () => apiFetch<User>('/auth/me'),

  logout: () => {
    token.clear();
    userStore.clear();
  },
};

// ── Companies API ─────────────────────────────────────────────────────────────

export const companiesApi = {
  mine: () => apiFetch<Company>('/companies/me'),
  list: (params?: { page?: number; page_size?: number; status?: string; company_type?: string; city?: string }) =>
    apiFetch<Paginated<Company>>('/companies', { auth: false, params }),
  get: (id: number) => apiFetch<Company>(`/companies/${id}`, { auth: false }),
  create: (data: Partial<Company>) => apiFetch<Company>('/companies', { method: 'POST', body: data }),
  update: (id: number, data: Partial<Company>) => apiFetch<Company>(`/companies/${id}`, { method: 'PATCH', body: data }),
  verify: (id: number, status: string) =>
    apiFetch<Company>(`/companies/${id}/verify`, { method: 'POST', body: { status } }),
};

// ── Internships API ───────────────────────────────────────────────────────────

export const internshipsApi = {
  mine: (params?: { page?: number; page_size?: number; search?: string; status?: string }) =>
    apiFetch<Paginated<Internship>>('/internships/mine', { params }),
  list: (params?: { page?: number; page_size?: number; search?: string; status?: string; company_id?: number }) =>
    apiFetch<Paginated<Internship>>('/internships', { auth: false, params }),
  get: (id: number) => apiFetch<Internship>(`/internships/${id}`, { auth: false }),
  create: (data: Partial<Internship>) => apiFetch<Internship>('/internships', { method: 'POST', body: data }),
  update: (id: number, data: Partial<Internship>) => apiFetch<Internship>(`/internships/${id}`, { method: 'PATCH', body: data }),
  delete: (id: number) => apiFetch(`/internships/${id}`, { method: 'DELETE' }),
  apply: (id: number, data?: { cover_letter?: string; resume_url?: string }) =>
    apiFetch<Application>(`/internships/${id}/apply`, { method: 'POST', body: { internship_id: id, ...data } }),
};

// ── Applications API ──────────────────────────────────────────────────────────

export const applicationsApi = {
  received: (params?: { page?: number; status?: string }) =>
    apiFetch<Paginated<Application>>('/applications/received', { params }),
  my: (params?: { page?: number; status?: string }) =>
    apiFetch<Paginated<Application>>('/applications/my', { params }),
  forInternship: (internshipId: number) =>
    apiFetch<Paginated<Application>>(`/internships/${internshipId}/applications`),
  updateStatus: (id: number, status: string) =>
    apiFetch<Application>(`/applications/${id}/status`, { method: 'PATCH', body: { status } }),
  withdraw: (id: number) =>
    apiFetch<Application>(`/applications/${id}/withdraw`, { method: 'POST' }),
};

// ── Industrial Visits API ─────────────────────────────────────────────────────

export const visitsApi = {
  mine: (params?: { page?: number; page_size?: number; status?: string }) =>
    apiFetch<Paginated<IndustrialVisit>>('/industrial-visits/mine', { params }),
  create: (data: Partial<IndustrialVisit>) => apiFetch<IndustrialVisit>('/industrial-visits', { method: 'POST', body: data }),
  list: (params?: { page?: number; page_size?: number; status?: string; company_id?: number }) =>
    apiFetch<Paginated<IndustrialVisit>>('/industrial-visits', { auth: false, params }),
  get: (id: number) => apiFetch<IndustrialVisit>(`/industrial-visits/${id}`, { auth: false }),
  book: (id: number, notes?: string) =>
    apiFetch<Booking>(`/industrial-visits/${id}/book`, { method: 'POST', body: { notes } }),
  myBookings: (params?: { page?: number }) =>
    apiFetch<Paginated<Booking>>('/industrial-visits/bookings/me', { params }),
  updateBookingStatus: (id: number, status: string) =>
    apiFetch<Booking>(`/industrial-visits/bookings/${id}/status`, { method: 'PATCH', body: { status } }),
};

export const usersApi = {
  list: (params?: { page?: number; page_size?: number; role?: string; status?: string }) =>
    apiFetch<Paginated<User>>('/users', { params }),
  updateStatus: (id: number, status: string) =>
    apiFetch<User>(`/users/${id}/status`, { method: 'PATCH', body: { status } }),
  updateMe: (data: Partial<User>) => apiFetch<User>('/users/me', { method: 'PATCH', body: data }),
  changePassword: (data: { current_password: string; new_password: string }) =>
    apiFetch<User>('/users/me/change-password', { method: 'POST', body: data }),
};

// ── Schemes / Loans / Content ─────────────────────────────────────────────────

export const schemesApi = {
  list: (params?: { page?: number; category?: string; status?: string }) =>
    apiFetch<Paginated<Scheme>>('/schemes', { auth: false, params }),
};

export const loansApi = {
  list: (params?: { page?: number; category?: string }) =>
    apiFetch<Paginated<Loan>>('/loans', { auth: false, params }),
};

export const newsApi = {
  list: (params?: { page?: number; category?: string; status?: string }) =>
    apiFetch<Paginated<NewsItem>>('/news', { auth: false, params: { status: 'published', ...params } }),
};

export const technologiesApi = {
  list: (params?: { page?: number; category?: string }) =>
    apiFetch<Paginated<Technology>>('/technologies', { auth: false, params }),
};

export const associationsApi = {
  list: (params?: { page?: number }) =>
    apiFetch<Paginated<Association>>('/associations', { auth: false, params }),
};

export const contactsApi = {
  list: (params?: { page?: number }) =>
    apiFetch<Paginated<ContactItem>>('/contacts', { auth: false, params }),
  submit: (data: { name: string; email: string; phone?: string; subject: string; message: string; category?: string }) =>
    apiFetch<ContactItem>('/contacts', { method: 'POST', body: data, auth: false }),
};

// ── Admin API ─────────────────────────────────────────────────────────────────

export const adminApi = {
  dashboard: () => apiFetch<AdminDashboard>('/admin/dashboard'),
  pendingVerifications: (params?: { page?: number }) =>
    apiFetch<Paginated<Company>>('/admin/pending-verifications', { params }),
  verifyCompany: (id: number, status: 'verified' | 'rejected', notes?: string) =>
    apiFetch<Company>(`/admin/verify/${id}`, { method: 'PUT', body: { status, notes } }),
};

// ── AI API ────────────────────────────────────────────────────────────────────

export const aiApi = {
  chat: (message: string, conversation_id?: string) =>
    apiFetch<{ answer: string; sources: { title: string; url: string }[]; confidence: string; conversation_id: string }>(
      '/ai/chat', { method: 'POST', body: { message, conversation_id }, auth: !!token.get() }
    ),
};
