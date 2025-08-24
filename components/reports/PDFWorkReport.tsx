'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font, Image } from '@react-pdf/renderer'

// 日本語フォントの登録（実際の運用では適切なフォントファイルを用意）
// Font.register({
//   family: 'NotoSansJP',
//   src: '/fonts/NotoSansJP-Regular.ttf'
// })

// スタイル定義
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #333',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333',
    color: 'white',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ddd',
    padding: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
  },
  signature: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: 200,
    borderTop: '1px solid #333',
    paddingTop: 5,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
  checkBox: {
    width: 10,
    height: 10,
    border: '1px solid #333',
    marginRight: 5,
  },
  checkedBox: {
    width: 10,
    height: 10,
    border: '1px solid #333',
    backgroundColor: '#333',
    marginRight: 5,
  },
})

// 作業報告書データの型定義
interface WorkReportData {
  reportNumber: string
  date: string
  client: {
    name: string
    address: string
    phone: string
  }
  worker: {
    name: string
    company: string
    phone: string
  }
  work: {
    type: string
    location: string
    startTime: string
    endTime: string
    description: string
    items: Array<{
      name: string
      quantity: number
      unit: string
    }>
  }
  checkItems: {
    safetyCheck: boolean
    cleanupComplete: boolean
    customerExplanation: boolean
    photosTaken: boolean
  }
  notes?: string
  nextSchedule?: string
}

// PDFドキュメントコンポーネント
const WorkReportDocument = ({ data }: { data: WorkReportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>作業報告書</Text>
        <Text style={styles.subtitle}>Work Report No. {data.reportNumber}</Text>
      </View>

      {/* 基本情報 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本情報 / Basic Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>作業日 / Date:</Text>
          <Text style={styles.value}>{data.date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>作業種別 / Type:</Text>
          <Text style={styles.value}>{data.work.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>作業場所 / Location:</Text>
          <Text style={styles.value}>{data.work.location}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>作業時間 / Time:</Text>
          <Text style={styles.value}>{data.work.startTime} - {data.work.endTime}</Text>
        </View>
      </View>

      {/* 顧客情報 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>お客様情報 / Client Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>お名前 / Name:</Text>
          <Text style={styles.value}>{data.client.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ご住所 / Address:</Text>
          <Text style={styles.value}>{data.client.address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>電話番号 / Phone:</Text>
          <Text style={styles.value}>{data.client.phone}</Text>
        </View>
      </View>

      {/* 作業内容 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>作業内容 / Work Details</Text>
        <Text style={{ marginBottom: 10 }}>{data.work.description}</Text>
        
        {/* 使用部材 */}
        {data.work.items.length > 0 && (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { color: 'white' }]}>部材名 / Item</Text>
              <Text style={[styles.tableCell, { color: 'white' }]}>数量 / Qty</Text>
              <Text style={[styles.tableCell, { color: 'white' }]}>単位 / Unit</Text>
            </View>
            {data.work.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{item.unit}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* チェック項目 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>確認事項 / Check Items</Text>
        <View style={styles.row}>
          <View style={data.checkItems.safetyCheck ? styles.checkedBox : styles.checkBox} />
          <Text>安全確認完了 / Safety Check Complete</Text>
        </View>
        <View style={styles.row}>
          <View style={data.checkItems.cleanupComplete ? styles.checkedBox : styles.checkBox} />
          <Text>清掃完了 / Cleanup Complete</Text>
        </View>
        <View style={styles.row}>
          <View style={data.checkItems.customerExplanation ? styles.checkedBox : styles.checkBox} />
          <Text>お客様への説明完了 / Customer Briefing Complete</Text>
        </View>
        <View style={styles.row}>
          <View style={data.checkItems.photosTaken ? styles.checkedBox : styles.checkBox} />
          <Text>作業写真撮影完了 / Photos Taken</Text>
        </View>
      </View>

      {/* 備考 */}
      {data.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>備考 / Notes</Text>
          <Text>{data.notes}</Text>
        </View>
      )}

      {/* 次回予定 */}
      {data.nextSchedule && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>次回予定 / Next Schedule</Text>
          <Text>{data.nextSchedule}</Text>
        </View>
      )}

      {/* 署名欄 */}
      <View style={styles.signature}>
        <View style={styles.signatureBox}>
          <Text>作業者 / Worker</Text>
          <Text style={{ marginTop: 5 }}>{data.worker.name}</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text>お客様 / Customer</Text>
        </View>
      </View>

      {/* フッター */}
      <Text style={styles.footer}>
        {data.worker.company} | TEL: {data.worker.phone} | Generated by DandoriScheduler
      </Text>
    </Page>
  </Document>
)

// PDFダウンロードボタンコンポーネント
export default function PDFWorkReport({ data }: { data: WorkReportData }) {
  return (
    <PDFDownloadLink
      document={<WorkReportDocument data={data} />}
      fileName={`work-report-${data.reportNumber}.pdf`}
    >
      {({ blob, url, loading, error }) => (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'PDF生成中...' : 'PDF作業報告書をダウンロード'}
        </button>
      )}
    </PDFDownloadLink>
  )
}