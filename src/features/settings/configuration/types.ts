export interface CompanyInfo {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyWebsite: string;
  taxId: string;
  industry: string;
  regulatoryBody: string;
}

export interface BackupSettings {
  enableAutoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupTime: string;
  retentionDays: number;
  backupLocation: 'local' | 'cloud' | 's3';
  notifyOnBackupFailure: boolean;
}

export interface GeneralConfig {
  systemName: string;
  systemDisplayName: string;
  systemLogo: string;
  systemFavicon: string;
  adminEmail: string;
  maintenanceMode: boolean;
  dateTimeFormat: string;
  timeZone: string;
  companyInfo: CompanyInfo;
  backupSettings: BackupSettings;
}

export interface IpSecurity {
  enableIpWhitelisting: boolean;
  whitelistedIps: string[];
  enableGeoBlocking: boolean;
  blockedCountries: string[];
  allowVpnConnections: boolean;
}

export interface AuditSettings {
  enableDetailedAuditLog: boolean;
  logLevel: 'minimal' | 'standard' | 'detailed';
  retainLogsForDays: number;
  logSensitiveData: boolean;
  enableRealTimeAlerts: boolean;
  alertOnSuspiciousActivity: boolean;
}

export interface SecurityConfig {
  passwordMinLength: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
  requireLowercase: boolean;
  passwordExpiryDays: number;
  enablePasswordExpiry: boolean;
  preventPasswordReuse: boolean;
  passwordHistoryCount: number;
  sessionTimeoutMinutes: number;
  enable2FA: boolean;
  enableAutoLogout: boolean;
  autoLogoutMinutes: number;
  enableAccountLockout: boolean;
  maxLoginAttempts: number;
  ipSecurity: IpSecurity;
  auditSettings: AuditSettings;
}

export interface VersionControl {
  enableAutoVersioning: boolean;
  maxVersionsToKeep: number;
  compareVersionsEnabled: boolean;
  requireVersionNotes: boolean;
  majorMinorVersioning: boolean;
}

export interface ESignatureSettings {
  enableESignature: boolean;
  requirePasswordForSigning: boolean;
  allowDigitalCertificates: boolean;
  signingMethods: ('password' | 'otp' | 'biometric' | 'certificate')[];
  enforceSigningOrder: boolean;
  signatureValidityDays: number;
}

export interface DocumentConfig {
  defaultRetentionPeriodDays: number;
  enableWatermark: boolean;
  allowDownload: boolean;
  maxFileSizeMB: number;
  versionControl: VersionControl;
  eSignature: ESignatureSettings;
}

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  senderEmail: string;
  senderName: string;
  useSSL: boolean;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
}

export interface SmsConfig {
  enableSms: boolean;
  provider: 'twilio' | 'vonage' | 'aws-sns';
  accountSid: string;
  authToken: string;
  fromNumber: string;
  rateLimitPerHour: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  event: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface NotificationConfig {
  enableEmailNotifications: boolean;
  enableInAppNotifications: boolean;
  enableTelegramNotifications: boolean;
  enableWhatsAppNotifications: boolean;
  emailDigestFrequency: 'daily' | 'weekly' | 'instant';
  emailConfig: EmailConfig;
  telegramConfig: TelegramConfig;
  whatsappConfig: WhatsAppConfig;
  smsConfig: SmsConfig;
  enableCustomTemplates: boolean;
  templates: NotificationTemplate[];
  triggers: {
    documentApproval: boolean;
    taskAssignment: boolean;
    systemAlerts: boolean;
    capaDue: boolean;
  };
}

export interface SystemConfig {
  general: GeneralConfig;
  security: SecurityConfig;
  documents: DocumentConfig;
  notifications: NotificationConfig;
}
