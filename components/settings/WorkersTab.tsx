import { cardStyle, sectionHeaderStyle, inputStyle, buttonStyles } from '@/utils/settingsHelpers';

interface Worker {
  name: string;
  status: string;
  statusColor: string;
  skills: string[];
  cert: string;
}

interface WorkersTabProps {
  skills: string[];
  certifications: string[];
  newSkill: string;
  setNewSkill: (skill: string) => void;
  newCertification: string;
  setNewCertification: (cert: string) => void;
  addSkill: () => void;
  removeSkill: (skill: string) => void;
  addCertification: () => void;
  removeCertification: (cert: string) => void;
  workers: Worker[];
  setEditingWorker: (worker: any) => void;
  setWorkerModalOpen: (open: boolean) => void;
  openDeleteModal: (item: any, type: string) => void;
  syncMobileApp: (type: string) => void;
  openQRModal: (title: string, url: string, description: string) => void;
  generateId: () => string;
}

export default function WorkersTab({
  skills,
  certifications,
  newSkill,
  setNewSkill,
  newCertification,
  setNewCertification,
  addSkill,
  removeSkill,
  addCertification,
  removeCertification,
  workers,
  setEditingWorker,
  setWorkerModalOpen,
  openDeleteModal,
  syncMobileApp,
  openQRModal,
  generateId
}: WorkersTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600' }}>職人・スキル管理</h2>

      {/* Worker Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>12</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>登録職人数</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>8</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>稼働中</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>3</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>資格期限切れ間近</div>
        </div>
      </div>

      {/* Skill Management */}
      <div style={cardStyle}>
        <h3 style={sectionHeaderStyle}>スキルマスター管理</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <SkillsSection
            title="利用可能スキル"
            items={skills}
            newItem={newSkill}
            setNewItem={setNewSkill}
            addItem={addSkill}
            removeItem={removeSkill}
            placeholder="新しいスキルを追加"
            bgColor="#f3f4f6"
            buttonColor="#3b82f6"
          />
          <SkillsSection
            title="資格マスター"
            items={certifications}
            newItem={newCertification}
            setNewItem={setNewCertification}
            addItem={addCertification}
            removeItem={removeCertification}
            placeholder="新しい資格を追加"
            bgColor="#f0f9ff"
            buttonColor="#10b981"
          />
        </div>
      </div>

      {/* Worker List */}
      <div style={cardStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>職人一覧</h3>
          <button
            onClick={() => {
              setEditingWorker(null)
              setWorkerModalOpen(true)
            }}
            style={buttonStyles.primary}>
            + 新規登録
          </button>
        </div>

        <WorkerTable
          workers={workers}
          setEditingWorker={setEditingWorker}
          setWorkerModalOpen={setWorkerModalOpen}
          openDeleteModal={openDeleteModal}
        />
      </div>

      {/* Mobile App Integration */}
      <div style={{
        ...cardStyle,
        border: '1px solid #3b82f6',
        background: '#eff6ff'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1d4ed8' }}>
          📱 モバイルアプリ連携
        </h3>
        <div style={{ fontSize: '14px', color: '#1e40af', marginBottom: '12px' }}>
          職人がアプリで更新した情報がこちらに反映されます
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => syncMobileApp('職人データ')}
            style={buttonStyles.primary}>
            アプリデータを同期
          </button>
          <button
            onClick={() => openQRModal(
              '職人登録用QRコード',
              `https://dandori-scheduler.vercel.app/register/worker?token=${generateId()}`,
              '職人にこのQRコードをスキャンしてもらって、アプリに登録してください。'
            )}
            style={{
              ...buttonStyles.secondary,
              color: '#3b82f6',
              border: '1px solid #3b82f6',
              background: 'white'
            }}>
            職人登録QRコード
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Skills/Certifications
function SkillsSection({
  title,
  items,
  newItem,
  setNewItem,
  addItem,
  removeItem,
  placeholder,
  bgColor,
  buttonColor
}: any) {
  return (
    <div>
      <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
        {title}
      </label>
      <div style={{
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        padding: '8px',
        height: '120px',
        overflowY: 'auto',
        fontSize: '13px'
      }}>
        {items.map((item: string, idx: number) => (
          <div key={idx} style={{
            padding: '4px 8px',
            margin: '2px 0',
            background: bgColor,
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{item}</span>
            <button
              onClick={() => removeItem(item)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '12px'
              }}>
              削除
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            ...inputStyle
          }}
        />
        <button
          onClick={addItem}
          style={{
            ...buttonStyles.primary,
            background: buttonColor
          }}>
          追加
        </button>
      </div>
    </div>
  );
}

// Sub-component for Worker Table
function WorkerTable({ workers, setEditingWorker, setWorkerModalOpen, openDeleteModal }: any) {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr',
        background: '#f9fafb',
        padding: '8px',
        fontSize: '13px',
        fontWeight: '600',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>名前</div>
        <div>ステータス</div>
        <div>保有スキル</div>
        <div>資格期限</div>
        <div>アクション</div>
      </div>

      {workers.map((worker: Worker, idx: number) => (
        <div key={idx} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr',
          padding: '8px',
          fontSize: '13px',
          borderBottom: idx < workers.length - 1 ? '1px solid #f3f4f6' : 'none',
          alignItems: 'center'
        }}>
          <div style={{ fontWeight: '500' }}>{worker.name}</div>
          <div>
            <span style={{
              color: worker.statusColor,
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {worker.status}
            </span>
          </div>
          <div>
            {worker.skills.map((skill, skillIdx) => (
              <span key={skillIdx} style={{
                display: 'inline-block',
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '2px 6px',
                borderRadius: '12px',
                fontSize: '11px',
                margin: '2px'
              }}>
                {skill}
              </span>
            ))}
          </div>
          <div style={{
            fontSize: '12px',
            color: worker.cert && new Date(worker.cert) < new Date(new Date().getTime() + 90*24*60*60*1000) ? '#ef4444' : '#374151'
          }}>
            {worker.cert}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => {
                setEditingWorker(worker)
                setWorkerModalOpen(true)
              }}
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
              onClick={() => openDeleteModal(worker, 'worker')}
              style={{
                padding: '4px 8px',
                background: '#fef2f2',
                color: '#dc2626',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px'
              }}>
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}