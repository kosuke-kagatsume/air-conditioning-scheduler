'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import PageHeader from '@/components/LogoHeader'

interface Message {
  id: string
  channelId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: Date
  attachments?: { type: 'image' | 'file'; url: string; name: string }[]
  reactions?: { emoji: string; users: string[] }[]
  isEdited?: boolean
  replyTo?: string
}

interface Channel {
  id: string
  name: string
  type: 'public' | 'private' | 'direct'
  members: string[]
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  avatar?: string
}

function ChatContent() {
  const { user } = useAuth()
  const [activeChannel, setActiveChannel] = useState<string>('general')
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMemberList, setShowMemberList] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // チャンネルデータ
  const [channels] = useState<Channel[]>([
    {
      id: 'general',
      name: '一般',
      type: 'public',
      members: ['all'],
      lastMessage: '明日の現場よろしくお願いします',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
      unreadCount: 0
    },
    {
      id: 'emergency',
      name: '緊急連絡',
      type: 'public',
      members: ['all'],
      lastMessage: '本日の作業は予定通り実施します',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 2
    },
    {
      id: 'team-a',
      name: 'チームA',
      type: 'private',
      members: ['user1', 'user2', 'user3'],
      lastMessage: '資材の手配完了しました',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
      unreadCount: 0
    },
    {
      id: 'dm-tanaka',
      name: '田中太郎',
      type: 'direct',
      members: ['user1', 'user2'],
      lastMessage: 'お疲れ様でした！',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 1,
      avatar: '田'
    }
  ])

  // メッセージデータ
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      channelId: 'general',
      userId: 'user1',
      userName: '山田次郎',
      userAvatar: '山',
      content: 'おはようございます！本日もよろしくお願いします。',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      reactions: [{ emoji: '👍', users: ['user2', 'user3'] }]
    },
    {
      id: '2',
      channelId: 'general',
      userId: 'user2',
      userName: '田中太郎',
      userAvatar: '田',
      content: 'おはようございます！\n渋谷の現場、9時から開始予定です。',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      attachments: [
        { type: 'image', url: '/sample.jpg', name: '現場写真.jpg' }
      ]
    },
    {
      id: '3',
      channelId: 'general',
      userId: 'user3',
      userName: '鈴木三郎',
      userAvatar: '鈴',
      content: '了解しました。機材の準備はできています。',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      replyTo: '2'
    },
    {
      id: '4',
      channelId: 'general',
      userId: 'user1',
      userName: '山田次郎',
      userAvatar: '山',
      content: '明日の現場よろしくお願いします',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isEdited: true
    }
  ])

  // オンラインユーザー
  const [onlineUsers] = useState([
    { id: 'user1', name: '山田次郎', avatar: '山', status: 'online' },
    { id: 'user2', name: '田中太郎', avatar: '田', status: 'online' },
    { id: 'user3', name: '鈴木三郎', avatar: '鈴', status: 'away' },
    { id: 'user4', name: '佐藤四郎', avatar: '佐', status: 'offline' }
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        channelId: activeChannel,
        userId: user?.id || 'current-user',
        userName: user?.name || '現在のユーザー',
        userAvatar: user?.name?.[0] || 'U',
        content: message,
        timestamp: new Date()
      }
      setMessages([...messages, newMessage])
      setMessage('')
      
      // 相手がタイピング中の表示（デモ用）
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }, 1000)
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji)
        if (existingReaction) {
          // 既存のリアクションに追加
          existingReaction.users.push(user?.id || 'current-user')
        } else {
          // 新しいリアクション
          msg.reactions = [...(msg.reactions || []), {
            emoji,
            users: [user?.id || 'current-user']
          }]
        }
      }
      return msg
    }))
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const currentChannel = channels.find(ch => ch.id === activeChannel)
  const channelMessages = messages.filter(msg => msg.channelId === activeChannel)

  const emojis = ['👍', '❤️', '😊', '🎉', '🙏', '💪', '✅', '🔥']

  return (
    <div style={{ minHeight: '100vh', background: '#1a1d21', display: 'flex' }}>
      {/* サイドバー */}
      <div style={{
        width: '260px',
        background: '#0e1012',
        borderRight: '1px solid #2a2d31',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* ワークスペース */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #2a2d31'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{ color: 'white' }}>
              <PageHeader href="/demo" size={36} />
            </div>
            <div style={{ color: '#b0b3b8', fontSize: '12px', marginLeft: '48px' }}>
              12人がオンライン
            </div>
          </div>

          {/* 検索 */}
          <input
            type="text"
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 12px',
              background: '#1a1d21',
              border: '1px solid #2a2d31',
              borderRadius: '6px',
              color: 'white',
              fontSize: '13px'
            }}
          />
        </div>

        {/* チャンネルリスト */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '11px',
              color: '#b0b3b8',
              fontWeight: '600',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}>
              チャンネル
            </div>
            {channels.filter(ch => ch.type !== 'direct').map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  background: activeChannel === channel.id ? '#3b82f6' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: activeChannel === channel.id ? 'white' : '#b0b3b8',
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2px'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {channel.type === 'private' ? '🔒' : '#'} {channel.name}
                </span>
                {channel.unreadCount > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '11px'
                  }}>
                    {channel.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div>
            <div style={{
              fontSize: '11px',
              color: '#b0b3b8',
              fontWeight: '600',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}>
              ダイレクトメッセージ
            </div>
            {channels.filter(ch => ch.type === 'direct').map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  background: activeChannel === channel.id ? '#3b82f6' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: activeChannel === channel.id ? 'white' : '#b0b3b8',
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2px'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    background: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: 'white'
                  }}>
                    {channel.avatar}
                  </span>
                  {channel.name}
                </span>
                {channel.unreadCount > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '11px'
                  }}>
                    {channel.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* メインチャット */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#1a1d21'
      }}>
        {/* ヘッダー */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #2a2d31',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'white',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {currentChannel?.type === 'private' && '🔒'}
              {currentChannel?.type === 'direct' && (
                <span style={{
                  width: '24px',
                  height: '24px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: 'white'
                }}>
                  {currentChannel.avatar}
                </span>
              )}
              {currentChannel?.type !== 'direct' && '#'} {currentChannel?.name}
            </h2>
            <div style={{ fontSize: '12px', color: '#b0b3b8', marginTop: '4px' }}>
              {currentChannel?.members.length}人のメンバー
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowMemberList(!showMemberList)}
              style={{
                padding: '6px 12px',
                background: showMemberList ? '#3b82f6' : 'transparent',
                border: '1px solid #2a2d31',
                borderRadius: '6px',
                color: showMemberList ? 'white' : '#b0b3b8',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              👥 メンバー
            </button>
            <button style={{
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid #2a2d31',
              borderRadius: '6px',
              color: '#b0b3b8',
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              📞 通話
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* メッセージエリア */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* メッセージリスト */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px'
            }}>
              {channelMessages.map((msg, index) => {
                const replyToMessage = msg.replyTo ? messages.find(m => m.id === msg.replyTo) : null
                const showAvatar = index === 0 || channelMessages[index - 1]?.userId !== msg.userId

                return (
                  <div key={msg.id} style={{
                    marginBottom: showAvatar ? '16px' : '4px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    {showAvatar ? (
                      <div style={{
                        width: '36px',
                        height: '36px',
                        background: '#3b82f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        {msg.userAvatar}
                      </div>
                    ) : (
                      <div style={{ width: '36px' }} />
                    )}

                    <div style={{ flex: 1 }}>
                      {showAvatar && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <span style={{
                            fontWeight: '600',
                            color: 'white',
                            fontSize: '14px'
                          }}>
                            {msg.userName}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            color: '#b0b3b8'
                          }}>
                            {formatTime(msg.timestamp)}
                          </span>
                          {msg.isEdited && (
                            <span style={{
                              fontSize: '11px',
                              color: '#b0b3b8'
                            }}>
                              (編集済み)
                            </span>
                          )}
                        </div>
                      )}

                      {replyToMessage && (
                        <div style={{
                          borderLeft: '2px solid #3b82f6',
                          paddingLeft: '12px',
                          marginBottom: '8px',
                          fontSize: '13px',
                          color: '#b0b3b8'
                        }}>
                          <div style={{ fontWeight: '500' }}>
                            {replyToMessage.userName}
                          </div>
                          <div style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {replyToMessage.content}
                          </div>
                        </div>
                      )}

                      <div style={{
                        color: '#e3e5e8',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {msg.content}
                      </div>

                      {msg.attachments && msg.attachments.map((attachment, i) => (
                        <div key={i} style={{
                          marginTop: '8px',
                          padding: '8px',
                          background: '#0e1012',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {attachment.type === 'image' ? '🖼️' : '📎'}
                          <span style={{ fontSize: '13px', color: '#3b82f6' }}>
                            {attachment.name}
                          </span>
                        </div>
                      ))}

                      {msg.reactions && msg.reactions.length > 0 && (
                        <div style={{
                          display: 'flex',
                          gap: '4px',
                          marginTop: '8px'
                        }}>
                          {msg.reactions.map((reaction, i) => (
                            <button
                              key={i}
                              onClick={() => handleAddReaction(msg.id, reaction.emoji)}
                              style={{
                                padding: '2px 8px',
                                background: '#2a2d31',
                                border: '1px solid #3a3d41',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* メッセージアクション */}
                    <div style={{
                      opacity: 0,
                      display: 'flex',
                      gap: '4px',
                      transition: 'opacity 0.2s'
                    }}
                    className="message-actions">
                      {emojis.slice(0, 3).map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleAddReaction(msg.id, emoji)}
                          style={{
                            padding: '4px',
                            background: '#2a2d31',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}

              {isTyping && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#b0b3b8',
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}>
                  <span>誰かが入力中...</span>
                  <span style={{ animation: 'pulse 1.5s infinite' }}>...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* メッセージ入力 */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #2a2d31'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end'
              }}>
                <button
                  onClick={handleFileUpload}
                  style={{
                    padding: '8px',
                    background: '#2a2d31',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#b0b3b8',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  📎
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => console.log('File selected:', e.target.files)}
                />

                <div style={{
                  flex: 1,
                  background: '#2a2d31',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  minHeight: '40px',
                  maxHeight: '120px'
                }}>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder={`#${currentChannel?.name} にメッセージを送信`}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      fontSize: '14px',
                      resize: 'none',
                      outline: 'none'
                    }}
                    rows={1}
                  />
                </div>

                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  style={{
                    padding: '8px',
                    background: '#2a2d31',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#b0b3b8',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  😊
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  style={{
                    padding: '8px 16px',
                    background: message.trim() ? '#3b82f6' : '#2a2d31',
                    border: 'none',
                    borderRadius: '6px',
                    color: message.trim() ? 'white' : '#6b7280',
                    cursor: message.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  送信
                </button>
              </div>

              {/* 絵文字ピッカー */}
              {showEmojiPicker && (
                <div style={{
                  position: 'absolute',
                  bottom: '70px',
                  right: '80px',
                  background: '#0e1012',
                  border: '1px solid #2a2d31',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(8, 1fr)',
                  gap: '4px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                }}>
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setMessage(message + emoji)
                        setShowEmojiPicker(false)
                      }}
                      style={{
                        padding: '8px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '20px',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#2a2d31'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* メンバーリスト */}
          {showMemberList && (
            <div style={{
              width: '240px',
              background: '#0e1012',
              borderLeft: '1px solid #2a2d31',
              padding: '16px'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '16px'
              }}>
                メンバー
              </h3>
              {onlineUsers.map(user => (
                <div key={user.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: '#3b82f6',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: 'white'
                    }}>
                      {user.avatar}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: '2px solid #0e1012',
                      background: user.status === 'online' ? '#22c55e' :
                        user.status === 'away' ? '#eab308' : '#6b7280'
                    }} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '13px',
                      color: 'white',
                      fontWeight: '500'
                    }}>
                      {user.name}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#b0b3b8'
                    }}>
                      {user.status === 'online' ? 'オンライン' :
                        user.status === 'away' ? '離席中' : 'オフライン'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .message-actions {
          opacity: 0 !important;
        }
        div:hover .message-actions {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  )
}

export default function ChatPage() {
  return (
    <AuthProvider>
      <ChatContent />
    </AuthProvider>
  )
}