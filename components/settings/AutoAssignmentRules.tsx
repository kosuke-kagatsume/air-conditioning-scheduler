import { cardStyle, sectionHeaderStyle, inputStyle } from '@/utils/settingsHelpers';

interface AutoAssignmentRulesProps {
  onOpenAutoAssignmentModal?: () => void;
  onOpenAppSyncModal?: () => void;
}

export default function AutoAssignmentRules({
  onOpenAutoAssignmentModal,
  onOpenAppSyncModal
}: AutoAssignmentRulesProps) {
  // ローカルで管理するシンプルなstate
  const assignmentRules = [
    { rule: 'スキルマッチング', priority: 1, enabled: true },
    { rule: '距離（近い順）', priority: 2, enabled: true },
    { rule: '空き時間', priority: 3, enabled: true },
    { rule: '作業負荷バランス', priority: 4, enabled: false },
    { rule: 'コスト最適化', priority: 5, enabled: false }
  ];

  return (
    <>
      {/* Auto Assignment Rules */}
      <div style={cardStyle}>
        <h3 style={sectionHeaderStyle}>
          自動割当ルール
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              優先順位設定
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {assignmentRules.map((rule, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  background: rule.enabled ? '#f0f9ff' : '#f9fafb'
                }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>
                      {rule.priority}. {rule.rule}
                    </span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="checkbox"
                      defaultChecked={rule.enabled}
                      style={{ transform: 'scale(0.9)' }}
                    />
                    <span style={{ fontSize: '12px' }}>有効</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              制約条件
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', minWidth: '120px' }}>連続勤務上限:</label>
                <select style={inputStyle}>
                  <option>5日</option>
                  <option>6日</option>
                  <option>7日</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', minWidth: '120px' }}>移動時間考慮:</label>
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: '12px' }}>30分以上は警告</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', minWidth: '120px' }}>残業時間上限:</label>
                <select style={inputStyle}>
                  <option>2時間</option>
                  <option>4時間</option>
                  <option>制限なし</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', minWidth: '120px' }}>緊急時対応:</label>
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: '12px' }}>自動で待機者を割当</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Preview */}
      <div style={cardStyle}>
        <h3 style={sectionHeaderStyle}>
          自動割当プレビュー
        </h3>
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          現在の設定で明日のスケジュールを自動割当した場合の結果を確認できます
        </div>

        <button
          onClick={onOpenAutoAssignmentModal}
          style={{
            width: '100%',
            padding: '12px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          📊 自動割当結果を詳しく見る
        </button>
      </div>

      {/* Mobile App Integration */}
      <div style={{
        ...cardStyle,
        border: '1px solid #10b981',
        background: '#ecfdf5'
      }}>
        <h3 style={{ ...sectionHeaderStyle, color: '#047857' }}>
          📱 アプリ連携機能
        </h3>
        <div style={{ fontSize: '14px', color: '#065f46', marginBottom: '12px' }}>
          職人アプリに自動で新しいスケジュールが通知されます
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onOpenAppSyncModal}
            style={{
              padding: '8px 16px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px'
            }}>
            アプリに自動通知ON
          </button>
          <button
            onClick={onOpenAppSyncModal}
            style={{
              padding: '8px 16px',
              background: 'white',
              color: '#10b981',
              border: '1px solid #10b981',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px'
            }}>
            手動確認後に通知
          </button>
        </div>
      </div>
    </>
  );
}