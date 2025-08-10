// スケジュールデータの永続化ユーティリティ

export interface HVACSchedule {
  id: string;
  name?: string;
  siteId: string;
  siteName: string;
  date: string;
  time: string;
  temperature: number;
  mode: 'cool' | 'heat' | 'dry' | 'fan' | 'auto';
  fanSpeed: 'low' | 'medium' | 'high' | 'auto';
  enabled: boolean;
  days: number[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

const STORAGE_KEY = 'dandori_hvac_schedules';

export const loadHVACSchedules = (): HVACSchedule[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const schedules = JSON.parse(stored);
    return schedules.map((s: HVACSchedule) => ({
      ...s,
      createdAt: s.createdAt || new Date().toISOString(),
      updatedAt: s.updatedAt || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Failed to load HVAC schedules:', error);
    return [];
  }
};

export const saveHVACSchedules = (schedules: HVACSchedule[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error('Failed to save HVAC schedules:', error);
  }
};

export const exportHVACSchedules = (schedules: HVACSchedule[]): void => {
  const dataStr = JSON.stringify(schedules, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `dandori-hvac-schedules-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importHVACSchedules = (file: File): Promise<HVACSchedule[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const schedules = JSON.parse(e.target?.result as string);
        resolve(schedules);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};