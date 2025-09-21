interface NotificationsSettings {
  newSchedule: boolean;
  scheduleChange: boolean;
  workComplete: boolean;
  problemAlert: boolean;
  reminderTiming: number;
}

interface NotificationsTabProps {
  notifications: NotificationsSettings;
  setNotifications: (notifications: NotificationsSettings) => void;
}

export default function NotificationsTab({ notifications, setNotifications }: NotificationsTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600' }}>通知設定</h2>

      <div style={{
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          通知項目
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={notifications.newSchedule}
              onChange={(e) => setNotifications({...notifications, newSchedule: e.target.checked})}
            />
            <span style={{ fontSize: '14px' }}>新しい予定の通知</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={notifications.scheduleChange}
              onChange={(e) => setNotifications({...notifications, scheduleChange: e.target.checked})}
            />
            <span style={{ fontSize: '14px' }}>予定変更の通知</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={notifications.workComplete}
              onChange={(e) => setNotifications({...notifications, workComplete: e.target.checked})}
            />
            <span style={{ fontSize: '14px' }}>作業完了の通知</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={notifications.problemAlert}
              onChange={(e) => setNotifications({...notifications, problemAlert: e.target.checked})}
            />
            <span style={{ fontSize: '14px' }}>問題報告のアラート</span>
          </label>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>
            リマインダーのタイミング:
          </label>
          <select
            value={notifications.reminderTiming}
            onChange={(e) => setNotifications({...notifications, reminderTiming: parseInt(e.target.value)})}
            style={{
              marginLeft: '8px',
              padding: '4px 8px',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          >
            <option value={15}>15分前</option>
            <option value={30}>30分前</option>
            <option value={60}>1時間前</option>
            <option value={120}>2時間前</option>
          </select>
        </div>
      </div>
    </div>
  );
}