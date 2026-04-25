export type SourceRecord = {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  is_active: boolean;
  last_run_at: string | null;
  created_at: string;
};

export type OpportunityRecord = {
  id: string;
  source_id: string | null;
  external_id: string | null;
  url: string | null;
  title: string;
  description: string | null;
  company_name: string | null;
  location: string | null;
  remote_mode: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  employment_type: string | null;
  skills: string[];
  posted_at: string | null;
  discovered_at: string;
  last_seen_at: string;
  canonical_hash: string | null;
  freshness_score: number;
  quality_score: number;
  is_active: boolean;
  raw_data: Record<string, unknown>;
  tech_stack: string[];
  created_at: string;
  updated_at: string;
};

export type ReviewTaskRecord = {
  id: string;
  opportunity_id: string;
  project_id: string | null;
  assigned_to: string | null;
  status: string;
  reviewer_notes: string | null;
  decision_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
};

export type DeliveryEventRecord = {
  id: string;
  opportunity_id: string;
  project_id: string;
  delivery_method: string;
  status: string;
  delivered_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type ProjectRecord = {
  id: string;
  user_id: string | null;
  client_id: string | null;
  name: string;
  status: string;
  target_keywords: string[];
  filters: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ClientRecord = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type DeliveryPreferenceRecord = {
  id: string;
  client_id: string;
  frequency: string;
  email_enabled: boolean;
  csv_enabled: boolean;
  preferred_hour: number;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type AuditLogRecord = {
  id: string;
  event_type: string;
  project_id: string | null;
  user_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
};