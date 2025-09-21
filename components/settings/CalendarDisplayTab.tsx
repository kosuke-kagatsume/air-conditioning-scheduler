import ColorPicker from '@/components/ColorPicker';

interface CalendarSettings {
  defaultView: string;
  includeWeekends: boolean;
  hideCompleted: boolean;
  colorRules: {
    installation: string;
    maintenance: string;
    repair: string;
    emergency: string;
  };
}

interface CalendarDisplayTabProps {
  calendarSettings: CalendarSettings;
  setCalendarSettings: (settings: CalendarSettings) => void;
}

export default function CalendarDisplayTab({ calendarSettings, setCalendarSettings }: CalendarDisplayTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600' }}>カレンダー表示設定</h2>

      {/* Default View */}
      <div style={{
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          デフォルト表示
        </h3>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          {['day', 'week', 'month'].map(view => (
            <label key={view} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="radio"
                name="defaultView"
                checked={calendarSettings.defaultView === view}
                onChange={() => setCalendarSettings({...calendarSettings, defaultView: view})}
              />
              <span>{view === 'day' ? '日' : view === 'week' ? '週' : '月'}表示</span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={calendarSettings.includeWeekends}
              onChange={(e) => setCalendarSettings({...calendarSettings, includeWeekends: e.target.checked})}
            />
            <span style={{ fontSize: '14px' }}>週末を表示</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={calendarSettings.hideCompleted}
              onChange={(e) => setCalendarSettings({...calendarSettings, hideCompleted: e.target.checked})}
            />
            <span style={{ fontSize: '14px' }}>完了した予定を隠す</span>
          </label>
        </div>
      </div>

      {/* Color Rules */}
      <div style={{
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          色分けルール
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(calendarSettings.colorRules).map(([type, color]) => (
            <ColorPicker
              key={type}
              color={color}
              onChange={(newColor) => setCalendarSettings({
                ...calendarSettings,
                colorRules: {...calendarSettings.colorRules, [type]: newColor}
              })}
              label={
                type === 'installation' ? '設置工事' :
                type === 'maintenance' ? 'メンテナンス' :
                type === 'repair' ? '修理' : '緊急対応'
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}