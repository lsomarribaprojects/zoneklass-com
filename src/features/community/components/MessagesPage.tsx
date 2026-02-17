'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft, MessageCircle, Search } from 'lucide-react'
import { getConversations, getMessages, sendMessage } from '@/actions/community'
import type { Conversation, DirectMessageWithUser } from '@/types/database'
import { timeAgo } from '@/lib/utils/time'

export function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<DirectMessageWithUser[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      const result = await getConversations()
      if (result.data) {
        setConversations(result.data)
      }
      setLoading(false)
    }
    loadConversations()
  }, [])

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId)
    }
  }, [selectedUserId])

  async function loadMessages(userId: string) {
    setLoadingMessages(true)
    const result = await getMessages(userId)
    if (result.data) {
      setMessages(result.data)
    }
    setLoadingMessages(false)
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUserId || sending) return

    setSending(true)
    const messageContent = newMessage.trim()
    setNewMessage('')

    const result = await sendMessage(selectedUserId, messageContent)

    if (result.error) {
      console.error('Error sending message:', result.error)
      setNewMessage(messageContent)
    } else {
      // Refresh conversations and messages
      const conversationsResult = await getConversations()
      if (conversationsResult.data) {
        setConversations(conversationsResult.data)
      }
      await loadMessages(selectedUserId)
    }

    setSending(false)
  }

  const selectedConversation = conversations.find(c => c.user.id === selectedUserId)
  const filteredConversations = conversations.filter(conv =>
    conv.user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group messages by day
  const messagesByDay = messages.reduce((acc, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(msg)
    return acc
  }, {} as Record<string, DirectMessageWithUser[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-foreground-secondary dark:text-slate-400">Cargando mensajes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card overflow-hidden h-[calc(100vh-160px)] flex">
        {/* Conversations List */}
        <div
          className={`${
            selectedUserId ? 'hidden lg:flex' : 'flex'
          } flex-col w-full lg:w-80 border-r border-border-light dark:border-slate-700`}
        >
          {/* Header */}
          <div className="p-4 border-b border-border-light dark:border-slate-700">
            <h1 className="text-xl font-bold text-foreground dark:text-slate-100 mb-3">
              Mensajes
            </h1>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary dark:text-slate-400" />
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-border-light dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <MessageCircle className="w-16 h-16 text-foreground-muted dark:text-slate-600 mb-3" />
                <p className="text-foreground-secondary dark:text-slate-400 font-medium">
                  {searchQuery ? 'No se encontraron conversaciones' : 'No tienes conversaciones aún'}
                </p>
                <p className="text-sm text-foreground-muted dark:text-slate-500 mt-1">
                  {searchQuery ? 'Intenta con otro término de búsqueda' : 'Envía tu primer mensaje para empezar'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.user.id}
                  onClick={() => setSelectedUserId(conversation.user.id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-[#F8FAFC] dark:hover:bg-slate-700/50 transition-colors border-b border-border-light dark:border-slate-700/50 ${
                    selectedUserId === conversation.user.id
                      ? 'bg-primary-50 dark:bg-primary-900/20'
                      : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {conversation.user.avatar_url ? (
                      <img
                        src={conversation.user.avatar_url}
                        alt={conversation.user.full_name || 'Usuario'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {(conversation.user.full_name || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-foreground dark:text-slate-100 truncate">
                        {conversation.user.full_name || 'Usuario'}
                      </p>
                      <span className="text-xs text-foreground-secondary dark:text-slate-400 flex-shrink-0 ml-2">
                        {timeAgo(conversation.last_message_at)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        conversation.unread_count > 0
                          ? 'text-foreground dark:text-slate-100 font-medium'
                          : 'text-foreground-secondary dark:text-slate-400'
                      }`}
                    >
                      {conversation.last_message}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat View */}
        <div
          className={`${
            selectedUserId ? 'flex' : 'hidden lg:flex'
          } flex-col flex-1`}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border-light dark:border-slate-700 flex items-center gap-3">
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="lg:hidden p-2 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground dark:text-slate-100" />
                </button>

                {/* Avatar */}
                {selectedConversation.user.avatar_url ? (
                  <img
                    src={selectedConversation.user.avatar_url}
                    alt={selectedConversation.user.full_name || 'Usuario'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {(selectedConversation.user.full_name || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}

                <div>
                  <p className="font-semibold text-foreground dark:text-slate-100">
                    {selectedConversation.user.full_name || 'Usuario'}
                  </p>
                  <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                    Nivel {selectedConversation.user.level}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] dark:bg-slate-900">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="w-16 h-16 text-foreground-muted dark:text-slate-600 mb-3" />
                    <p className="text-foreground-secondary dark:text-slate-400 font-medium">
                      Envía el primer mensaje
                    </p>
                    <p className="text-sm text-foreground-muted dark:text-slate-500 mt-1">
                      Comienza una conversación con {selectedConversation.user.full_name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(messagesByDay).map(([date, dayMessages]) => (
                      <div key={date}>
                        {/* Date separator */}
                        <div className="flex items-center justify-center mb-4">
                          <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-border-light dark:border-slate-700">
                            <span className="text-xs text-foreground-secondary dark:text-slate-400 font-medium">
                              {date}
                            </span>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="space-y-3">
                          {dayMessages.map((msg) => {
                            const isCurrentUser = msg.sender_id !== selectedUserId
                            return (
                              <div
                                key={msg.id}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[70%] ${
                                    isCurrentUser
                                      ? 'bg-primary-500 text-white rounded-2xl rounded-br-sm'
                                      : 'bg-white dark:bg-slate-700 text-foreground dark:text-slate-100 rounded-2xl rounded-bl-sm'
                                  } px-4 py-2.5 shadow-sm`}
                                >
                                  <p className="text-sm break-words">{msg.content}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      isCurrentUser
                                        ? 'text-primary-100'
                                        : 'text-foreground-secondary dark:text-slate-400'
                                    }`}
                                  >
                                    {new Date(msg.created_at).toLocaleTimeString('es-ES', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border-light dark:border-slate-700 bg-white dark:bg-slate-800">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                    placeholder="Escribe un mensaje..."
                    rows={1}
                    disabled={sending}
                    className="flex-1 px-4 py-2.5 bg-[#F8FAFC] dark:bg-slate-900 border border-border-light dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none dark:text-slate-100 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Enviar</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageCircle className="w-20 h-20 text-foreground-muted dark:text-slate-600 mb-4" />
              <p className="text-lg font-semibold text-foreground dark:text-slate-100 mb-2">
                Selecciona una conversación
              </p>
              <p className="text-sm text-foreground-secondary dark:text-slate-400">
                Elige una conversación de la lista para ver los mensajes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
