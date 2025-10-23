// User types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  bio?: string;
  location?: string;
  is_active: boolean;
  is_verified: boolean;
  role: 'user' | 'researcher' | 'admin';
  created_at: string;
  updated_at?: string;
}

export interface UserCreate {
  email: string;
  username: string;
  full_name: string;
  password: string;
  bio?: string;
  location?: string;
}


export interface UserUpdate {
  full_name?: string;
  bio?: string;
  location?: string;
}

// Species types
export interface Species {
  id: number;
  scientific_name: string;
  common_name: string;
  family?: string;
  genus?: string;
  description?: string;
  habitat?: string;
  impact_level?: 'low' | 'medium' | 'high' | 'critical';
  threat_category?: 'established' | 'emerging' | 'potential';
  native_region?: string;
  first_detected_australia?: string;
  control_methods?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SpeciesCreate {
  scientific_name: string;
  common_name: string;
  family?: string;
  genus?: string;
  description?: string;
  habitat?: string;
  impact_level?: 'low' | 'medium' | 'high' | 'critical';
  threat_category?: 'established' | 'emerging' | 'potential';
  native_region?: string;
  control_methods?: string;
  image_url?: string;
}

export interface SpeciesList {
  id: number;
  scientific_name: string;
  common_name: string;
  impact_level?: 'low' | 'medium' | 'high' | 'critical';
  threat_category?: 'established' | 'emerging' | 'potential';
  image_url?: string;
}

// Report types
export interface Report {
  id: number;
  user_id: number;
  species_id: number;
  title: string;
  description?: string;
  location_name?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  report_date: string;
  image_urls?: string[];
  status: 'pending' | 'verified' | 'rejected' | 'resolved';
  verification_notes?: string;
  verified_by?: number;
  verified_at?: string;
  is_public: boolean;
  created_at: string;
  updated_at?: string;
  user?: User;
  species?: Species;
}

export interface ReportCreate {
  species_id: number;
  title: string;
  description?: string;
  location_name?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  report_date: string;
  image_urls?: string[];
  is_public: boolean;
}

export interface ReportList {
  id: number;
  title: string;
  species_id: number;
  species_name: string;
  latitude: number;
  longitude: number;
  report_date: string;
  status: 'pending' | 'verified' | 'rejected' | 'resolved';
  image_urls?: string[];
  created_at: string;
}

export interface ReportUpdate {
  title?: string;
  description?: string;
  location_name?: string;
  image_urls?: string[];
  is_public?: boolean;
}

export interface ReportVerification {
  status: 'verified' | 'rejected';
  verification_notes?: string;
}

// Analytics types
export interface DashboardStats {
  total_reports: number;
  reports_by_status: Record<string, number>;
  total_species: number;
  recent_reports: number;
  top_species: Array<{ name: string; count: number }>;
}

export interface SpeciesDistribution {
  impact_levels: Record<string, number>;
  threat_categories: Record<string, number>;
}

export interface TimelineData {
  date: string;
  count: number;
}

export interface GeographicData {
  latitude: number;
  longitude: number;
  species_id: number;
  species_name: string;
  status: string;
}

export interface UserContributions {
  total_reports: number;
  reports_by_status: Record<string, number>;
  recent_activity: number;
}

export interface SpeciesAnalytics {
  species: {
    id: number;
    scientific_name: string;
    common_name: string;
    impact_level?: string;
    threat_category?: string;
  };
  total_reports: number;
  reports_by_status: Record<string, number>;
  geographic_data: Array<{
    latitude: number;
    longitude: number;
    date: string;
  }>;
  timeline: TimelineData[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}


// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number' | 'date' | 'file';
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  validation?: any;
}

// Map types
export interface MapMarker {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  type: 'report' | 'species';
  status?: string;
}
