import fs from 'fs';
import path from 'path';
import SettingsClient from './SettingsClient';

type SettingsData = {
  COLORS: {
    INSTALLATION: string;
    MAINTENANCE: string;
    REPAIR: string;
    EMERGENCY: string;
  };
  DEFAULT_SKILLS: string[];
  DEFAULT_CERTIFICATIONS: string[];
  DEFAULT_BUSINESS_HOURS: {
    WEEKDAY_START: string;
    WEEKDAY_END: string;
    LUNCH_START: string;
    LUNCH_END: string;
  };
  SHIFT_PATTERNS: Record<string, string>;
  APPROVAL_ROLES: Record<string, string>;
  REPORT_TYPES: Record<string, string>;
  REPORT_FORMATS: Record<string, string>;
  USER_ROLES: Record<string, string>;
  TAB_LABELS: Record<string, string>;
  NOTIFICATION_TIMINGS: Array<{ value: number; label: string }>;
  HOLIDAY_TYPES: Record<string, string>;
};

export default async function SettingsPage() {
  // サーバーサイドでJSONを直接読み込み（webpackを経由しない）
  const jsonPath = path.join(process.cwd(), 'constants/settings.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as SettingsData;

  // 非決定値はサーバーで生成して固定
  const serverTimestamp = new Date().toISOString();

  return (
    <SettingsClient
      colors={data.COLORS}
      defaultSkills={data.DEFAULT_SKILLS}
      defaultCertifications={data.DEFAULT_CERTIFICATIONS}
      businessHours={data.DEFAULT_BUSINESS_HOURS}
      shiftPatterns={data.SHIFT_PATTERNS}
      approvalRoles={data.APPROVAL_ROLES}
      reportTypes={data.REPORT_TYPES}
      reportFormats={data.REPORT_FORMATS}
      userRoles={data.USER_ROLES}
      tabLabels={data.TAB_LABELS}
      notificationTimings={data.NOTIFICATION_TIMINGS}
      holidayTypes={data.HOLIDAY_TYPES}
      serverTimestamp={serverTimestamp}
    />
  );
}