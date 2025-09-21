import { cardStyle, sectionHeaderStyle, inputStyle, buttonStyles } from '@/utils/settingsHelpers';

interface UserRole {
  name: string;
  color: string;
  users: number;
  active: boolean;
  permissions: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleColor: string;
  lastLogin: string;
  status: string;
}

interface PermissionsTabProps {
  userRoles: UserRole[];
  users: User[];
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  openEditModal: (item: any, type: string) => void;
  toggleUserStatus: (userId: string) => void;
  syncMobileApp: (type: string) => void;
  setQrData: (data: { title: string; data: string; description: string }) => void;
  setQrModalOpen: (open: boolean) => void;
  setAppSyncModalOpen: (open: boolean) => void;
  generateId: () => string;
}

export default function PermissionsTab({
  userRoles,
  users,
  showToast,
  openEditModal,
  toggleUserStatus,
  syncMobileApp,
  setQrData,
  setQrModalOpen,
  setAppSyncModalOpen,
  generateId
}: PermissionsTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600' }}>権限管理</h2>

      {/* Permission Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>15</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>総ユーザー数</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>3</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>管理者</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>8</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>職人</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>4</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>現場責任者</div>
        </div>
      </div>

      {/* Role Management */}
      <div style={cardStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={sectionHeaderStyle}>役割・権限設定</h3>
          <button
            onClick={() => showToast('ユーザー役割の新規作成機能を実装中です', 'info')}
            style={buttonStyles.primary}>
            + 新規役割
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {userRoles.map((role, idx) => (
            <div key={idx} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
              background: role.active ? '#f0f9ff' : '#f9fafb'
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
                    backgroundColor: role.color,
                    borderRadius: '50%'
                  }}></div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{role.name}</h4>
                  <span style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    background: '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: '8px'
                  }}>
                    {role.users}人
                  </span>
                </div>
                <div style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  background: role.active ? '#dcfce7' : '#f3f4f6',
                  color: role.active ? '#166534' : '#6b7280'
                }}>
                  {role.active ? '有効' : '無効'}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                {role.permissions.map((permission, permIdx) => (
                  <div key={permIdx} style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '2px',
                    paddingLeft: '8px',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: '0',
                      color: role.color
                    }}>•</span>
                    {permission}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => openEditModal(role, 'role')}
                  style={{
                    padding: '4px 8px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}>
                  編集
                </button>
                <button
                  onClick={() => showToast(`役割「${role.name}」の管理画面を開きます (現在${role.users}名)`, 'info')}
                  style={{
                    ...buttonStyles.primary,
                    padding: '4px 8px',
                    fontSize: '11px'
                  }}>
                  ユーザー管理
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Management */}
      <div style={cardStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={sectionHeaderStyle}>ユーザー管理</h3>
          <button
            onClick={() => showToast('ユーザーの新規登録機能を実装中です', 'info')}
            style={{
              ...buttonStyles.primary,
              background: '#10b981'
            }}>
            + 新規ユーザー
          </button>
        </div>

        <UserTable users={users} openEditModal={openEditModal} toggleUserStatus={toggleUserStatus} />
      </div>

      {/* Access Control */}
      <div style={cardStyle}>
        <h3 style={{ ...sectionHeaderStyle, marginBottom: '12px' }}>
          アクセス制御設定
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <SecuritySettings />
          <FunctionRestrictions />
        </div>
      </div>

      {/* Audit Log */}
      <div style={cardStyle}>
        <h3 style={{ ...sectionHeaderStyle, marginBottom: '12px' }}>
          操作ログ（直近）
        </h3>
        <AuditLog />
      </div>

      {/* Mobile App Integration */}
      <div style={{
        ...cardStyle,
        border: '1px solid #ef4444',
        background: '#fef2f2'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#dc2626' }}>
          📱 モバイルアプリ権限連携
        </h3>
        <div style={{ fontSize: '14px', color: '#b91c1c', marginBottom: '12px' }}>
          職人アプリの権限もWebで一元管理できます
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => syncMobileApp('権限設定')}
            style={{
              ...buttonStyles.primary,
              background: '#ef4444'
            }}>
            アプリ権限を同期
          </button>
          <button
            onClick={() => {
              setQrData({
                title: 'アプリ登録用QRコード',
                data: `https://dandori-scheduler.app/register/${generateId()}`,
                description: 'このQRコードをスキャンしてアプリに登録してください'
              })
              setQrModalOpen(true)
            }}
            style={{
              ...buttonStyles.secondary,
              color: '#ef4444',
              border: '1px solid #ef4444',
              background: 'white'
            }}>
            QRコード発行（アプリ登録用）
          </button>
          <button
            onClick={() => setAppSyncModalOpen(true)}
            style={{
              ...buttonStyles.secondary,
              color: '#ef4444',
              border: '1px solid #ef4444',
              background: 'white'
            }}>
            アプリ利用状況確認
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for User Table
function UserTable({ users, openEditModal, toggleUserStatus }: any) {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        background: '#f9fafb',
        padding: '8px',
        fontSize: '13px',
        fontWeight: '600',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>名前</div>
        <div>メール</div>
        <div>役割</div>
        <div>最終ログイン</div>
        <div>アクション</div>
      </div>

      {users.map((user: User, idx: number) => (
        <div key={idx} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
          padding: '8px',
          fontSize: '13px',
          borderBottom: idx < users.length - 1 ? '1px solid #f3f4f6' : 'none',
          alignItems: 'center'
        }}>
          <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: user.status === 'active' ? '#10b981' : '#6b7280',
              borderRadius: '50%'
            }}></div>
            {user.name}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {user.email}
          </div>
          <div>
            <span style={{
              color: user.roleColor,
              fontSize: '12px',
              fontWeight: '500',
              background: `${user.roleColor}20`,
              padding: '2px 6px',
              borderRadius: '8px'
            }}>
              {user.role}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {user.lastLogin}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => openEditModal(user, 'user')}
              style={{
                padding: '4px 8px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px'
              }}>
              編集
            </button>
            <button
              onClick={() => toggleUserStatus(user.id)}
              style={{
                padding: '4px 8px',
                background: user.status === 'active' ? '#fef2f2' : '#dcfce7',
                color: user.status === 'active' ? '#dc2626' : '#166534',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px'
              }}>
              {user.status === 'active' ? '無効化' : '有効化'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Sub-component for Security Settings
function SecuritySettings() {
  return (
    <div>
      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
        セキュリティ設定
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" defaultChecked />
          <span style={{ fontSize: '13px' }}>2段階認証を必須にする</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" defaultChecked />
          <span style={{ fontSize: '13px' }}>強力なパスワードを必須にする</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" />
          <span style={{ fontSize: '13px' }}>IP制限を有効にする</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" defaultChecked />
          <span style={{ fontSize: '13px' }}>自動ログアウト（30分）</span>
        </label>
      </div>
    </div>
  );
}

// Sub-component for Function Restrictions
function FunctionRestrictions() {
  return (
    <div>
      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
        機能制限
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', minWidth: '100px' }}>データ出力:</span>
          <select style={inputStyle}>
            <option>管理者のみ</option>
            <option>現場責任者以上</option>
            <option>全員可能</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', minWidth: '100px' }}>設定変更:</span>
          <select style={inputStyle}>
            <option>管理者のみ</option>
            <option>管理者と責任者</option>
            <option>制限なし</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', minWidth: '100px' }}>削除権限:</span>
          <select style={inputStyle}>
            <option>管理者のみ</option>
            <option>承認後のみ</option>
            <option>制限なし</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Audit Log
function AuditLog() {
  const logs = [
    {
      time: '10:30',
      action: '新規ユーザー「鈴木四郎」を追加',
      user: '田中管理者',
      result: '成功',
      resultColor: '#10b981'
    },
    {
      time: '10:15',
      action: '職人「山田太郎」の権限を現場責任者に変更',
      user: '田中管理者',
      result: '成功',
      resultColor: '#10b981'
    },
    {
      time: '09:45',
      action: 'データエクスポート実行（作業レポート）',
      user: '佐藤責任者',
      result: '成功',
      resultColor: '#10b981'
    },
    {
      time: '09:30',
      action: 'ログイン試行（無効なパスワード）',
      user: '不明ユーザー',
      result: '失敗',
      resultColor: '#ef4444'
    }
  ];

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr 1fr',
        background: '#f9fafb',
        padding: '8px',
        fontSize: '13px',
        fontWeight: '600',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>時刻</div>
        <div>操作内容</div>
        <div>ユーザー</div>
        <div>結果</div>
      </div>

      {logs.map((log, idx) => (
        <div key={idx} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr 1fr',
          padding: '8px',
          fontSize: '13px',
          borderBottom: idx < logs.length - 1 ? '1px solid #f3f4f6' : 'none',
          alignItems: 'center'
        }}>
          <div style={{ fontWeight: '500' }}>{log.time}</div>
          <div style={{ fontSize: '12px' }}>{log.action}</div>
          <div style={{ fontSize: '12px' }}>{log.user}</div>
          <div>
            <span style={{
              color: log.resultColor,
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {log.result}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}