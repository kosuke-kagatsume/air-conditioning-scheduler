// 純データ化したconstants - HMR/循環/サーバ境界汚染を完全排除
// ❶ 純データ(JSON)を読み込む
// ❷ exportは"namedのみ"。defaultは使わない
// ❸ 関数・env参照・他ファイルimport・'use client' は一切なし

import raw from './settings.json';

// 型定義
type Settings = {
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
  SHIFT_PATTERNS: {
    FIXED: string;
    ROTATING: string;
    FLEXIBLE: string;
  };
  APPROVAL_ROLES: {
    MANAGER: string;
    SUPERVISOR: string;
    DIRECTOR: string;
  };
  REPORT_TYPES: {
    DAILY: string;
    WEEKLY: string;
    MONTHLY: string;
    CUSTOM: string;
  };
  REPORT_FORMATS: {
    PDF: string;
    EXCEL: string;
    EMAIL: string;
  };
  USER_ROLES: {
    ADMIN: string;
    MANAGER: string;
    SUPERVISOR: string;
    WORKER: string;
    VIEWER: string;
  };
  TAB_LABELS: {
    calendar: string;
    workers: string;
    shifts: string;
    notifications: string;
    approvals: string;
    reports: string;
    permissions: string;
    'business-hours': string;
  };
  NOTIFICATION_TIMINGS: Array<{
    value: number;
    label: string;
  }>;
  HOLIDAY_TYPES: {
    NATIONAL: string;
    COMPANY: string;
    REGIONAL: string;
  };
};

const data = raw as Settings;

// Object.freezeで実行時の書き換えを防ぐ（安全性向上）
export const COLORS = Object.freeze({ ...data.COLORS });
export const DEFAULT_SKILLS = Object.freeze([...data.DEFAULT_SKILLS]);
export const DEFAULT_CERTIFICATIONS = Object.freeze([...data.DEFAULT_CERTIFICATIONS]);
export const DEFAULT_BUSINESS_HOURS = Object.freeze({ ...data.DEFAULT_BUSINESS_HOURS });
export const SHIFT_PATTERNS = Object.freeze({ ...data.SHIFT_PATTERNS });
export const APPROVAL_ROLES = Object.freeze({ ...data.APPROVAL_ROLES });
export const REPORT_TYPES = Object.freeze({ ...data.REPORT_TYPES });
export const REPORT_FORMATS = Object.freeze({ ...data.REPORT_FORMATS });
export const USER_ROLES = Object.freeze({ ...data.USER_ROLES });
export const TAB_LABELS = Object.freeze({ ...data.TAB_LABELS });
export const NOTIFICATION_TIMINGS = Object.freeze([...data.NOTIFICATION_TIMINGS]);
export const HOLIDAY_TYPES = Object.freeze({ ...data.HOLIDAY_TYPES });