// Tab types
export type TabType = "application" | "server" | "database" | "api" | "features" | "license";

// Application Information
export interface ApplicationInfo {
  name: string;
  version: string;
  environment: "development" | "staging" | "production";
  buildDate: string;
  buildNumber: string;
  description: string;
}

// Server Information
export interface ServerInfo {
  os: string;
  nodeVersion: string;
  memoryTotal: string;
  memoryUsed: string;
  memoryUsagePercent: number;
  cpuCores: number;
  cpuModel: string;
  uptime: string;
}

// Database Information
export interface DatabaseInfo {
  type: string;
  version: string;
  host: string;
  port: string;
  database: string;
  connectionStatus: "connected" | "disconnected";
  lastBackup: string;
}

// API Information
export interface ApiInfo {
  baseUrl: string;
  version: string;
  status: "online" | "offline";
  lastHealthCheck: string;
  responseTime: string;
}

// Feature Flags
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

// License Information
export interface LicenseInfo {
  licenseType: string;
  companyName: string;
  issuedDate: string;
  expiryDate: string;
  daysUntilExpiry: number;
  maxUsers: number;
  activeUsers: number;
  modules: string[];
}

// Changelog Entry
export interface ChangelogEntry {
  version: string;
  releaseDate: string;
  changes: {
    features?: string[];
    improvements?: string[];
    bugFixes?: string[];
  };
}

// System Information (combined)
export interface SystemInfo {
  application: ApplicationInfo;
  server: ServerInfo;
  database: DatabaseInfo;
  api: ApiInfo;
  features: FeatureFlag[];
  license: LicenseInfo;
}
