import { cardStyle, sectionHeaderStyle, inputStyle, buttonStyles } from '@/utils/settingsHelpers';

interface ReportTemplate {
  id: string;
  name: string;
  frequency: string;
  format: string;
  recipients: string[];
  lastSent: string;
  active: boolean;
}

interface ReportsTabProps {
  reportTemplates: ReportTemplate[];
  showToast: (message: string, type: string) => void;
  openEditModal: (item: any, type: string) => void;
  toggleTemplateStatus: (id: string, type: string) => void;
  handleReportGenerate: () => void;
  setReportModalOpen: (open: boolean) => void;
  handleExportData: (format: string) => void;
  syncMobileApp: (type: string) => void;
}

export default function ReportsTab({
  reportTemplates,
  showToast,
  openEditModal,
  toggleTemplateStatus,
  handleReportGenerate,
  setReportModalOpen,
  handleExportData,
  syncMobileApp
}: ReportsTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600' }}>レポート設定</h2>

      {/* Report Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>156</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>今月の作業件数</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>94.2%</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>完了率</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>2.1h</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>平均作業時間</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>¥2.1M</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>今月の売上</div>
        </div>
      </div>

      {/* Report Templates */}
      <div style={cardStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={sectionHeaderStyle}>定期レポート設定</h3>
          <button
            onClick={() => showToast('レポートテンプレートの新規作成機能を実装中です', 'info')}
            style={buttonStyles.primary}>
            + 新規レポート
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {reportTemplates.map((report, idx) => (
            <ReportTemplateCard
              key={idx}
              report={report}
              openEditModal={openEditModal}
              showToast={showToast}
              toggleTemplateStatus={toggleTemplateStatus}
            />
          ))}
        </div>
      </div>

      {/* Custom Report Builder */}
      <div style={cardStyle}>
        <h3 style={{ ...sectionHeaderStyle, marginBottom: '12px' }}>
          カスタムレポート作成
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <DataItemSelector />
          <FilterConditions />
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={handleReportGenerate}
            style={buttonStyles.primary}>
            レポート生成
          </button>
          <button
            onClick={() => setReportModalOpen(true)}
            style={buttonStyles.secondary}>
            プレビュー
          </button>
          <button
            onClick={() => {
              const templateName = prompt('テンプレート名を入力してください:')
              if (templateName) {
                showToast(`カスタムレポートテンプレート「${templateName}」を保存しました`, 'success')
              }
            }}
            style={{
              ...buttonStyles.primary,
              background: '#10b981'
            }}>
            テンプレート保存
          </button>
        </div>
      </div>

      {/* Export Options */}
      <div style={cardStyle}>
        <h3 style={{ ...sectionHeaderStyle, marginBottom: '12px' }}>
          データエクスポート
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <ExportOption
            icon="📊"
            title="Excel形式"
            description="表計算ソフトで編集可能"
            buttonText="Excel出力"
            buttonColor="#10b981"
            onClick={() => handleExportData('Excel')}
          />
          <ExportOption
            icon="📄"
            title="PDF形式"
            description="印刷・共有に最適"
            buttonText="PDF出力"
            buttonColor="#ef4444"
            onClick={() => handleExportData('PDF')}
          />
          <ExportOption
            icon="📈"
            title="グラフ付き"
            description="視覚的な分析レポート"
            buttonText="グラフ出力"
            buttonColor="#8b5cf6"
            onClick={() => handleExportData('グラフ付きレポート')}
          />
        </div>
      </div>

      {/* Mobile App Integration */}
      <div style={{
        ...cardStyle,
        border: '1px solid #f59e0b',
        background: '#fffbeb'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#d97706' }}>
          📱 アプリ連携レポート
        </h3>
        <div style={{ fontSize: '14px', color: '#b45309', marginBottom: '12px' }}>
          職人アプリからの作業報告データを自動でレポートに反映
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => syncMobileApp('レポートデータ')}
            style={{
              ...buttonStyles.primary,
              background: '#f59e0b'
            }}>
            アプリデータ同期
          </button>
          <button
            onClick={() => setReportModalOpen(true)}
            style={{
              ...buttonStyles.secondary,
              color: '#f59e0b',
              border: '1px solid #f59e0b',
              background: 'white'
            }}>
            写真付きレポート生成
          </button>
          <button
            onClick={() => {
              showToast('GPS位置情報を含むレポートを生成しています...', 'info')
              setTimeout(() => showToast('GPS位置データ込みレポートが完成しました', 'success'), 2000)
            }}
            style={{
              ...buttonStyles.secondary,
              color: '#f59e0b',
              border: '1px solid #f59e0b',
              background: 'white'
            }}>
            GPS位置データ込み
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Report Template Card
function ReportTemplateCard({ report, openEditModal, showToast, toggleTemplateStatus }: any) {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '12px',
      background: report.active ? '#f0f9ff' : '#f9fafb'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{report.name}</h4>
        <div style={{
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          background: report.active ? '#dcfce7' : '#f3f4f6',
          color: report.active ? '#166534' : '#6b7280'
        }}>
          {report.active ? '有効' : '無効'}
        </div>
      </div>
      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
        📅 {report.frequency} | 📄 {report.format}
      </div>
      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
        📧 {report.recipients.join(', ')}
      </div>
      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
        最終送信: {report.lastSent}
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => openEditModal(report, 'report')}
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
          onClick={() => {
            showToast(`レポート「${report.name}」を送信しています...`, 'info')
            setTimeout(() => showToast(`${report.format}形式のレポートを${report.recipients.join('、')}に送信しました`, 'success'), 1500)
          }}
          style={{
            ...buttonStyles.primary,
            padding: '4px 8px',
            fontSize: '11px'
          }}>
          今すぐ送信
        </button>
        <button
          onClick={() => toggleTemplateStatus(report.id, 'report')}
          style={{
            padding: '4px 8px',
            background: report.active ? '#fef2f2' : '#dcfce7',
            color: report.active ? '#dc2626' : '#166534',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}>
          {report.active ? '無効化' : '有効化'}
        </button>
      </div>
    </div>
  );
}

// Sub-component for Data Item Selector
function DataItemSelector() {
  const dataItems = [
    '作業日時', '現場名', '作業内容', '担当職人', '作業時間',
    '材料費', '人件費', '総費用', '顧客評価', '完了状況'
  ];

  return (
    <div>
      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
        データ項目選択
      </h4>
      <div style={{
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        padding: '8px',
        height: '120px',
        overflowY: 'auto',
        fontSize: '13px'
      }}>
        {dataItems.map((item, idx) => (
          <label key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 0'
          }}>
            <input type="checkbox" defaultChecked={idx < 5} />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// Sub-component for Filter Conditions
function FilterConditions() {
  return (
    <div>
      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
        フィルター条件
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>期間:</label>
          <select style={inputStyle}>
            <option>今月</option>
            <option>先月</option>
            <option>過去3ヶ月</option>
            <option>カスタム期間</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>職人:</label>
          <select style={inputStyle}>
            <option>全員</option>
            <option>山田太郎</option>
            <option>佐藤次郎</option>
            <option>鈴木三郎</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>作業タイプ:</label>
          <select style={inputStyle}>
            <option>すべて</option>
            <option>設置工事</option>
            <option>メンテナンス</option>
            <option>修理</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Export Option
function ExportOption({ icon, title, description, buttonText, buttonColor, onClick }: any) {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '12px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{title}</h4>
      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
        {description}
      </p>
      <button
        onClick={onClick}
        style={{
          width: '100%',
          padding: '6px 12px',
          background: buttonColor,
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
        {buttonText}
      </button>
    </div>
  );
}