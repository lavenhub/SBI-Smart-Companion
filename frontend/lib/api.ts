// ─── API Client for YONO Smart Companion ─────────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// For demo purposes, we will use a hardcoded user token or intercept it.
// In a real app, this comes from a context or cookie.
const DEMO_TOKEN = "demo-user-token";

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${DEMO_TOKEN}`,
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "API request failed");
    return data.data;
  } catch {
    // Backend not available (e.g. Vercel deployment) — return empty data gracefully
    return [] as unknown as T;
  }
}

// ─── Applications API (Smart Forms) ──────────────────────────────────────────

export interface Application {
  id: string;
  applicationType: string;
  status: string;
  title: string;
  currentStep: number;
  totalSteps: number;
  completionPercent: number;
  formData: string;
  completedFields: string;
  steps: string;
  updatedAt: string;
}

export const api = {
  applications: {
    getAll: (type?: string) => 
      fetchAPI<Application[]>(`/applications${type ? `?applicationType=${type}` : ''}`),
    
    getById: (id: string) => 
      fetchAPI<Application & { stepDefinitions: any[] }>(`/applications/${id}`),
    
    start: (applicationType: string, title?: string) => 
      fetchAPI<Application>(`/applications/start`, {
        method: "POST",
        body: JSON.stringify({ applicationType, title }),
      }),
    
    saveDraft: (id: string, stepIndex: number, fieldData: Record<string, any>) => 
      fetchAPI<Application>(`/applications/${id}/save`, {
        method: "PATCH",
        body: JSON.stringify({ stepIndex, fieldData }),
      }),
      
    submit: (id: string) => 
      fetchAPI<Application>(`/applications/${id}/submit`, {
        method: "POST",
      }),
  },

  vault: {
    getFolders: () => fetchAPI<any[]>(`/vault/folders`),
    getDocuments: (folderId?: string) => 
      fetchAPI<any[]>(`/vault/documents${folderId ? `?folderId=${folderId}` : ''}`),
  }
};
