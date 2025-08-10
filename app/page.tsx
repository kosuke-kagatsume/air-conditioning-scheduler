'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/LogoHeader'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* Navigation */}
      <nav className="nav-modern">
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <PageHeader 
            href="/demo" 
            size={36} 
            fontSize="20px" 
            fontWeight="700" 
          />
          
          {/* Desktop menu */}
          <div className="hide-mobile" style={{ display: 'flex', gap: '8px' }}>
            <Link href="/features" className="nav-tab">
              機能
            </Link>
            <Link href="/pricing" className="nav-tab">
              料金
            </Link>
            <Link href="/about" className="nav-tab">
              会社概要
            </Link>
            <div style={{ marginLeft: '16px', display: 'flex', gap: '12px' }}>
              <Link href="/login" className="btn-secondary" style={{
                padding: '8px 20px',
                fontSize: '14px'
              }}>
                ログイン
              </Link>
              <Link href="/register" className="btn-primary" style={{
                padding: '8px 20px',
                fontSize: '14px'
              }}>
                無料で始める
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}
            className="show-mobile"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f5f6f8 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '20px',
            color: '#2c3e50'
          }}>
            工事現場の予定を
            <br />
            <span className="gradient-text">もっとシンプルに</span>
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#6c7684',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            職人さんの空き状況がひと目でわかる。<br />
            みんなで共有できるカレンダーアプリ
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demo" className="btn-primary" style={{
              padding: '16px 32px',
              fontSize: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              デモを見る
              <span>→</span>
            </Link>
            <Link href="/register" className="btn-secondary" style={{
              padding: '16px 32px',
              fontSize: '18px'
            }}>
              無料で始める
            </Link>
          </div>

          {/* App Preview */}
          <div style={{
            marginTop: '60px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            maxWidth: '800px',
            margin: '60px auto 0'
          }}>
            <div style={{
              background: '#f5f6f8',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff6b6b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffd93d' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#51cf66' }} />
            </div>
            <div style={{ padding: '40px', textAlign: 'center', color: '#6c7684' }}>
              <div className="calendar-grid" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
                  <div key={i} className="calendar-header">{day}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i} className="calendar-cell slide-in" style={{ animationDelay: `${i * 0.02}s` }}>
                    {i % 7 === 0 && i < 28 && (
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{i / 7 + 1}</div>
                    )}
                    {i === 10 && <div className="event-item event-red">設備工事 A社</div>}
                    {i === 15 && <div className="event-item event-blue">メンテナンス B社</div>}
                    {i === 22 && <div className="event-item event-green">点検作業 C社</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', background: '#f5f6f8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '60px',
            color: '#2c3e50'
          }}>
            現場に特化した機能
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {[
              {
                icon: '👷',
                title: '職人の空き状況管理',
                description: '職人さんの1日の作業可能件数を設定し、空き枠をリアルタイムで確認',
                color: '#ff6b6b'
              },
              {
                icon: '📱',
                title: 'モバイルファースト',
                description: '現場でもスマホから簡単に予定を確認・更新できる使いやすいUI',
                color: '#4ecdc4'
              },
              {
                icon: '✅',
                title: '承認フロー',
                description: '提案→承諾/拒否/保留の3択で、職人さんも簡単に返答可能',
                color: '#51cf66'
              },
              {
                icon: '🔔',
                title: 'リアルタイム通知',
                description: '新しい予定や変更があったら、すぐにプッシュ通知でお知らせ',
                color: '#ffd93d'
              },
              {
                icon: '🎨',
                title: 'カラーラベル',
                description: '工事内容ごとに色分けして、予定を見やすく整理',
                color: '#9775fa'
              },
              {
                icon: '📊',
                title: '稼働分析',
                description: '職人さんの稼働率や現場の進捗を可視化してレポート',
                color: '#74c0fc'
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card slide-in" style={{
                animationDelay: `${index * 0.1}s`
              }}>
                <div className="feature-icon" style={{
                  background: `${feature.color}20`
                }}>
                  {feature.icon}
                </div>
                <h4 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: '#2c3e50'
                }}>{feature.title}</h4>
                <p style={{
                  color: '#6c7684',
                  lineHeight: '1.6'
                }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '60px',
            color: '#2c3e50'
          }}>
            かんたん3ステップ
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px'
          }}>
            {[
              {
                step: '1',
                title: '予定を作成',
                description: '現場情報と作業内容を入力して、職人さんに提案',
                icon: '📝'
              },
              {
                step: '2',
                title: '職人が応答',
                description: '空き状況を確認して、承諾・保留・拒否で返答',
                icon: '💬'
              },
              {
                step: '3',
                title: '自動で確定',
                description: '承諾されたら自動的に予定が確定。みんなに通知',
                icon: '✨'
              }
            ].map((item, index) => (
              <div key={index} style={{ textAlign: 'center' }} className="slide-in">
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 24px',
                  background: `linear-gradient(135deg, #ff6b6b, #4ecdc4)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  color: 'white',
                  fontWeight: '700',
                  boxShadow: '0 8px 24px rgba(255, 107, 107, 0.3)'
                }}>
                  {item.step}
                </div>
                <h4 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: '#2c3e50'
                }}>{item.title}</h4>
                <p style={{
                  color: '#6c7684',
                  lineHeight: '1.6'
                }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '80px 20px', background: '#f5f6f8' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#2c3e50'
          }}>
            シンプルな料金プラン
          </h3>
          <p style={{
            textAlign: 'center',
            color: '#6c7684',
            marginBottom: '60px',
            fontSize: '18px'
          }}>
            14日間の無料トライアルから始められます
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {[
              {
                name: 'スターター',
                price: '¥0',
                period: '月額',
                features: ['5ユーザーまで', '基本カレンダー機能', 'モバイルアプリ'],
                cta: '無料で始める',
                popular: false
              },
              {
                name: 'プロ',
                price: '¥980',
                period: 'ユーザー/月',
                features: ['無制限ユーザー', '全機能利用可能', '優先サポート', '分析レポート'],
                cta: '14日間無料で試す',
                popular: true
              },
              {
                name: 'エンタープライズ',
                price: 'お見積もり',
                period: '',
                features: ['カスタマイズ対応', 'API連携', '専任サポート', 'SLA保証'],
                cta: 'お問い合わせ',
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className="card" style={{
                position: 'relative',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                border: plan.popular ? '2px solid #ff6b6b' : 'none'
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#ff6b6b',
                    color: 'white',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    人気No.1
                  </div>
                )}
                <h4 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: '#2c3e50'
                }}>{plan.name}</h4>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    color: plan.popular ? '#ff6b6b' : '#2c3e50'
                  }}>{plan.price}</span>
                  {plan.period && (
                    <span style={{
                      fontSize: '16px',
                      color: '#6c7684',
                      marginLeft: '8px'
                    }}>{plan.period}</span>
                  )}
                </div>
                <ul style={{
                  listStyle: 'none',
                  marginBottom: '32px'
                }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{
                      padding: '8px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#6c7684'
                    }}>
                      <span style={{ color: '#51cf66' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={plan.popular ? 'btn-primary' : 'btn-secondary'} style={{
                  width: '100%'
                }}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '60px 40px',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
          borderRadius: '24px',
          color: 'white'
        }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: '700',
            marginBottom: '20px'
          }}>
            今すぐ始めよう
          </h2>
          <p style={{
            fontSize: '20px',
            marginBottom: '40px',
            opacity: 0.9
          }}>
            14日間すべての機能を無料でお試しいただけます
          </p>
          <Link href="/register" style={{
            background: 'white',
            color: '#ff6b6b',
            padding: '16px 40px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '18px',
            display: 'inline-block',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease'
          }}>
            無料トライアルを始める
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#2c3e50',
        color: 'white',
        padding: '60px 20px 40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <PageHeader size={36} showText={false} />
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: 0
                }}>Dandori Scheduler</h3>
              </div>
              <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                工事現場のための<br />
                シンプルなスケジュール管理
              </p>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '16px', fontSize: '18px' }}>サービス</h4>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '8px' }}><Link href="/features" style={{ opacity: 0.8 }}>機能</Link></li>
                <li style={{ marginBottom: '8px' }}><Link href="/pricing" style={{ opacity: 0.8 }}>料金</Link></li>
                <li style={{ marginBottom: '8px' }}><Link href="/demo" style={{ opacity: 0.8 }}>デモ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '16px', fontSize: '18px' }}>会社情報</h4>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '8px' }}><Link href="/about" style={{ opacity: 0.8 }}>会社概要</Link></li>
                <li style={{ marginBottom: '8px' }}><Link href="/privacy" style={{ opacity: 0.8 }}>プライバシー</Link></li>
                <li style={{ marginBottom: '8px' }}><Link href="/terms" style={{ opacity: 0.8 }}>利用規約</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '16px', fontSize: '18px' }}>お問い合わせ</h4>
              <p style={{ opacity: 0.8, marginBottom: '8px' }}>support@dandori-scheduler.jp</p>
              <p style={{ opacity: 0.8 }}>平日 9:00-18:00</p>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            textAlign: 'center',
            opacity: 0.6
          }}>
            <p>&copy; 2025 Dandori Scheduler. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}