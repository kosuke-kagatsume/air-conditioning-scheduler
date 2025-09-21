import { cardStyle, sectionHeaderStyle, inputStyle, buttonStyles } from '@/utils/settingsHelpers';

interface BusinessHours {
  weekdayStart: string;
  weekdayEnd: string;
  lunchStart: string;
  lunchEnd: string;
  saturdayEnabled: boolean;
  sundayEnabled: boolean;
  holidayEnabled: boolean;
}

interface CalendarConfigTabProps {
  businessHours: BusinessHours;
  setBusinessHours: (hours: BusinessHours) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function CalendarConfigTab({
  businessHours,
  setBusinessHours,
  showToast
}: CalendarConfigTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600' }}>営業日設定</h2>

      {/* Calendar Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>22</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>今月営業日</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>6</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>休日数</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>3</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>特別営業日</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>176</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>年間営業時間</div>
        </div>
      </div>

      {/* Basic Working Hours */}
      <div style={cardStyle}>
        <h3 style={sectionHeaderStyle}>基本営業時間</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              平日営業時間
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', minWidth: '60px' }}>開始:</label>
              <input
                type="time"
                value={businessHours.weekdayStart}
                onChange={(e) => setBusinessHours({...businessHours, weekdayStart: e.target.value})}
                style={inputStyle}
              />
              <label style={{ fontSize: '13px', marginLeft: '16px', minWidth: '60px' }}>終了:</label>
              <input
                type="time"
                value={businessHours.weekdayEnd}
                onChange={(e) => setBusinessHours({...businessHours, weekdayEnd: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', minWidth: '60px' }}>昼休み:</label>
              <input
                type="time"
                value={businessHours.lunchStart}
                onChange={(e) => setBusinessHours({...businessHours, lunchStart: e.target.value})}
                style={inputStyle}
              />
              <span style={{ fontSize: '13px' }}>〜</span>
              <input
                type="time"
                value={businessHours.lunchEnd}
                onChange={(e) => setBusinessHours({...businessHours, lunchEnd: e.target.value})}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              週末営業設定
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={businessHours.saturdayEnabled}
                  onChange={(e) => {
                    setBusinessHours({...businessHours, saturdayEnabled: e.target.checked})
                    showToast(e.target.checked ? '土曜日営業を有効にしました' : '土曜日営業を無効にしました', 'success')
                  }}
                />
                <span style={{ fontSize: '13px' }}>土曜日営業（9:00-15:00）</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={businessHours.sundayEnabled}
                  onChange={(e) => {
                    setBusinessHours({...businessHours, sundayEnabled: e.target.checked})
                    showToast(e.target.checked ? '日曜日営業を有効にしました' : '日曜日営業を無効にしました', 'success')
                  }}
                />
                <span style={{ fontSize: '13px' }}>日曜日営業（緊急対応のみ）</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={businessHours.holidayEnabled}
                  onChange={(e) => {
                    setBusinessHours({...businessHours, holidayEnabled: e.target.checked})
                    showToast(e.target.checked ? '祝日営業を有効にしました' : '祝日営業を無効にしました', 'success')
                  }}
                />
                <span style={{ fontSize: '13px' }}>祝日営業（要相談）</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Holiday Management */}
      <div style={cardStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>休日・特別営業日管理</h3>
          <button
            onClick={() => showToast('休日・特別営業日の新規追加機能を実装中です', 'info')}
            style={buttonStyles.primary}>
            + 新規追加
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <HolidaySettings />
          <SpecialSchedules />
        </div>
      </div>

      {/* Seasonal Schedule */}
      <SeasonalSchedule />

      {/* Emergency Settings */}
      <EmergencySettings />

      {/* Mobile App Integration */}
      <div style={{
        ...cardStyle,
        border: '1px solid #16a34a',
        background: '#f0fdf4'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#15803d' }}>
          📱 アプリカレンダー連携
        </h3>
        <div style={{ fontSize: '14px', color: '#166534', marginBottom: '12px' }}>
          営業時間・休日設定が職人アプリに自動で反映されます
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            ...buttonStyles.primary,
            background: '#16a34a'
          }}>
            アプリに設定を同期
          </button>
          <button style={{
            ...buttonStyles.secondary,
            color: '#16a34a',
            border: '1px solid #16a34a'
          }}>
            カレンダー出力
          </button>
          <button style={{
            ...buttonStyles.secondary,
            color: '#16a34a',
            border: '1px solid #16a34a'
          }}>
            Google Calendar連携
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function HolidaySettings() {
  const days = [
    { day: '日曜日', enabled: true, color: '#ef4444' },
    { day: '月曜日', enabled: false, color: '#6b7280' },
    { day: '火曜日', enabled: false, color: '#6b7280' },
    { day: '水曜日', enabled: false, color: '#6b7280' },
    { day: '木曜日', enabled: false, color: '#6b7280' },
    { day: '金曜日', enabled: false, color: '#6b7280' },
    { day: '土曜日', enabled: false, color: '#6b7280' }
  ];

  return (
    <div>
      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
        定期休日
      </h4>
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#f9fafb',
          padding: '8px',
          fontSize: '13px',
          fontWeight: '600',
          borderBottom: '1px solid #e5e7eb'
        }}>
          曜日設定
        </div>
        {days.map((dayConfig, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            fontSize: '13px',
            borderBottom: idx < 6 ? '1px solid #f3f4f6' : 'none'
          }}>
            <span>{dayConfig.day}</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                defaultChecked={dayConfig.enabled}
                style={{ transform: 'scale(0.9)' }}
              />
              <span style={{
                fontSize: '12px',
                color: dayConfig.enabled ? '#ef4444' : '#6b7280'
              }}>
                {dayConfig.enabled ? '休日' : '営業日'}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpecialSchedules() {
  const schedules = [
    { date: '8/24(土)', type: '特別営業', note: '大型案件対応', color: '#10b981' },
    { date: '8/30(金)', type: '休業', note: '社員研修', color: '#ef4444' },
    { date: '9/2(月)', type: '短縮営業', note: '9:00-15:00', color: '#f59e0b' },
    { date: '9/23(月)', type: '祝日休業', note: '秋分の日', color: '#6b7280' }
  ];

  return (
    <div>
      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
        特別日程（今月）
      </h4>
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#f9fafb',
          padding: '8px',
          fontSize: '13px',
          fontWeight: '600',
          borderBottom: '1px solid #e5e7eb'
        }}>
          日付・種別
        </div>
        {schedules.map((special, idx) => (
          <div key={idx} style={{
            padding: '8px',
            fontSize: '12px',
            borderBottom: idx < 3 ? '1px solid #f3f4f6' : 'none'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <span style={{ fontWeight: '500' }}>{special.date}</span>
              <span style={{
                color: special.color,
                background: `${special.color}20`,
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '11px'
              }}>
                {special.type}
              </span>
            </div>
            <div style={{ color: '#6b7280', fontSize: '11px' }}>
              {special.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeasonalSchedule() {
  const seasons = [
    {
      season: '夏季（6-8月）',
      schedule: '6:00-15:00',
      note: '暑さ対策で早朝開始',
      active: true,
      color: '#ef4444'
    },
    {
      season: '冬季（12-2月）',
      schedule: '9:00-18:00',
      note: '暖房需要により延長',
      active: true,
      color: '#3b82f6'
    },
    {
      season: '春季（3-5月）',
      schedule: '8:00-17:00',
      note: '通常営業時間',
      active: false,
      color: '#10b981'
    },
    {
      season: '秋季（9-11月）',
      schedule: '8:00-17:00',
      note: '通常営業時間',
      active: false,
      color: '#f59e0b'
    }
  ];

  return (
    <div style={cardStyle}>
      <h3 style={sectionHeaderStyle}>季節別営業スケジュール</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {seasons.map((season, idx) => (
          <div key={idx} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px',
            background: season.active ? '#f0f9ff' : '#f9fafb'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: season.color,
                  borderRadius: '50%'
                }}></div>
                <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{season.season}</h4>
              </div>
              <div style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                background: season.active ? '#dcfce7' : '#f3f4f6',
                color: season.active ? '#166534' : '#6b7280'
              }}>
                {season.active ? '適用中' : '停止中'}
              </div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              🕐 {season.schedule}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              {season.note}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{
                padding: '4px 8px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px'
              }}>
                編集
              </button>
              <button style={{
                padding: '4px 8px',
                background: season.active ? '#fef2f2' : '#dcfce7',
                color: season.active ? '#dc2626' : '#166534',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px'
              }}>
                {season.active ? '無効化' : '有効化'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmergencySettings() {
  return (
    <div style={cardStyle}>
      <h3 style={sectionHeaderStyle}>緊急対応設定</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            24時間対応
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '13px' }}>緊急修理（エアコン故障）</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '13px' }}>水漏れ・電気トラブル</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" />
              <span style={{ fontSize: '13px' }}>定期メンテナンス</span>
            </label>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            割増料金設定
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', minWidth: '80px' }}>夜間:</span>
              <input
                type="number"
                defaultValue="150"
                style={{
                  width: '60px',
                  ...inputStyle
                }}
              />
              <span style={{ fontSize: '13px' }}>%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', minWidth: '80px' }}>休日:</span>
              <input
                type="number"
                defaultValue="200"
                style={{
                  width: '60px',
                  ...inputStyle
                }}
              />
              <span style={{ fontSize: '13px' }}>%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', minWidth: '80px' }}>緊急:</span>
              <input
                type="number"
                defaultValue="300"
                style={{
                  width: '60px',
                  ...inputStyle
                }}
              />
              <span style={{ fontSize: '13px' }}>%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}