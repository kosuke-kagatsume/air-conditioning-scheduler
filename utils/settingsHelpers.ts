// 設定ページ用のヘルパー関数

export interface SettingsHelpers {
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  openEditModal: (item: any, type: string) => void;
  openDeleteModal: (item: any) => void;
  toggleTemplateStatus: (id: number, type: string) => void;
  setAutoAssignmentModalOpen: (open: boolean) => void;
  setAppSyncModalOpen: (open: boolean) => void;
  setReportModalOpen: (open: boolean) => void;
  setWorkerModalOpen: (open: boolean) => void;
  setQrModalOpen: (open: boolean) => void;
}

// 汎用的なボタンスタイル
export const buttonStyles = {
  primary: {
    padding: '6px 12px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  secondary: {
    padding: '6px 12px',
    background: '#f3f4f6',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  danger: {
    padding: '6px 12px',
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  success: {
    padding: '6px 12px',
    background: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px'
  }
};

// カードコンテナのスタイル
export const cardStyle = {
  padding: '16px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px'
};

// セクションヘッダーのスタイル
export const sectionHeaderStyle = {
  fontSize: '16px',
  fontWeight: '600',
  marginBottom: '12px'
};

// ラベルのスタイル
export const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px'
};

// インプットフィールドのスタイル
export const inputStyle = {
  padding: '4px 8px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '13px'
};

// ステータスバッジのスタイル
export const badgeStyle = (active: boolean) => ({
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '11px',
  background: active ? '#dcfce7' : '#f3f4f6',
  color: active ? '#166534' : '#6b7280'
});

// タブで共通利用される定数
export const TIMING_OPTIONS = [
  { value: 15, label: '15分前' },
  { value: 30, label: '30分前' },
  { value: 60, label: '1時間前' },
  { value: 120, label: '2時間前' }
];

export const WORKDAY_LIMIT_OPTIONS = [
  { value: 5, label: '5日' },
  { value: 6, label: '6日' },
  { value: 7, label: '7日' }
];

export const OVERTIME_LIMIT_OPTIONS = [
  { value: 2, label: '2時間' },
  { value: 4, label: '4時間' },
  { value: 0, label: '制限なし' }
];

// Toast通知のダミー実装（実際の実装はSettingsClientから渡される）
export const createToastHandler = (setToasts: any) => {
  let toastId = 0;

  return (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = `toast-${++toastId}`;
    setToasts((prev: any) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev: any) => prev.filter((t: any) => t.id !== id));
    }, 3000);
  };
};