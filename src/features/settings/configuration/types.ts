export interface GeneralConfig {
  systemName: string;
  systemDisplayName: string;
  systemLogo: string;
  systemFavicon: string;
  adminEmail: string;
  maintenanceMode: boolean;
  dateTimeFormat: string;
  timeZone: string;
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
}

export interface DocumentConfig {
  defaultRetentionPeriodDays: number;
  enableWatermark: boolean;
  allowDownload: boolean;
  maxFileSizeMB: number;
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

export interface NotificationConfig {
  enableEmailNotifications: boolean;
  enableInAppNotifications: boolean;
  enableTelegramNotifications: boolean;
  enableWhatsAppNotifications: boolean;
  emailDigestFrequency: 'daily' | 'weekly' | 'instant';
  emailConfig: EmailConfig;
  telegramConfig: TelegramConfig;
  whatsappConfig: WhatsAppConfig;
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
