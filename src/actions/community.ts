'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { awardXP, checkAndAwardBadges } from './gamification'
import type {
  PostCategory,
  NotificationType,
  PostWithAuthor,
  CommentWithAuthor,
  Conversation,
  DirectMessageWithUser,
  Notification,
} from '@/types/database'

// ============================================
// HELPERS
// ============================================

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado', supabase: null, user: null }
  return { error: null, supabase, user }
}

async function createNotification(
  supabase: any,
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string
) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      link: link || null,
    })

  if (error) {
    console.error('Error creating notification:', error)
  }
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

const postSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200, 'El título no puede exceder 200 caracteres'),
  content: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
  category: z.enum(['general', 'pregunta', 'recurso', 'logro', 'presentacion']),
})

// ============================================
// POSTS
// ============================================

export async function getPosts(category?: PostCategory) {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', data: null }
  }

  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(id, full_name, avatar_url, level),
      post_likes!left(user_id)
    `)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message, data: null }
  }

  // Transform data to include has_liked
  const posts: PostWithAuthor[] = data.map((post: any) => ({
    id: post.id,
    author_id: post.author_id,
    title: post.title,
    content: post.content,
    category: post.category,
    likes_count: post.likes_count,
    comments_count: post.comments_count,
    is_pinned: post.is_pinned,
    created_at: post.created_at,
    updated_at: post.updated_at,
    author: post.author,
    has_liked: post.post_likes.some((like: any) => like.user_id === user.id),
  }))

  return { error: null, data: posts }
}

export async function getPostById(postId: string) {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', data: null }
  }

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(id, full_name, avatar_url, level),
      post_likes!left(user_id)
    `)
    .eq('id', postId)
    .single()

  if (error) {
    return { error: error.message, data: null }
  }

  const post: PostWithAuthor = {
    id: data.id,
    author_id: data.author_id,
    title: data.title,
    content: data.content,
    category: data.category,
    likes_count: data.likes_count,
    comments_count: data.comments_count,
    is_pinned: data.is_pinned,
    created_at: data.created_at,
    updated_at: data.updated_at,
    author: data.author,
    has_liked: data.post_likes.some((like: any) => like.user_id === user.id),
  }

  return { error: null, data: post }
}

export async function createPost(formData: FormData) {
  // 1. Verificar autenticación
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado' }
  }

  // 2. Validar datos
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    category: formData.get('category'),
  }

  const parsed = postSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // 3. Insertar post
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      title: parsed.data.title,
      content: parsed.data.content,
      category: parsed.data.category,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // 4. Otorgar XP y verificar badges
  await awardXP(user.id, 5, 'post_create', 'Post creado en la comunidad')
  await checkAndAwardBadges(user.id)

  // 5. Revalidar y retornar
  revalidatePath('/comunidad')
  return { error: null, data }
}

export async function deletePost(postId: string) {
  // 1. Verificar autenticación
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado' }
  }

  // 2. Verificar que el usuario es el autor
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single()

  if (fetchError || !post) {
    return { error: fetchError?.message || 'Post no encontrado' }
  }

  if (post.author_id !== user.id) {
    return { error: 'No autorizado para eliminar este post' }
  }

  // 3. Eliminar post
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) {
    return { error: error.message }
  }

  // 4. Revalidar
  revalidatePath('/comunidad')
  return { error: null }
}

// ============================================
// LIKES
// ============================================

export async function toggleLike(postId: string) {
  // 1. Verificar autenticación
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado' }
  }

  // 2. Verificar si ya existe el like
  const { data: existingLike } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  // 3. Obtener información del post para notificación
  const { data: post } = await supabase
    .from('posts')
    .select('author_id, title')
    .eq('id', postId)
    .single()

  if (existingLike) {
    // Unlike: eliminar like y decrementar contador
    const { error: deleteError } = await supabase
      .from('post_likes')
      .delete()
      .eq('id', existingLike.id)

    if (deleteError) {
      return { error: deleteError.message }
    }

    const { error: updateError } = await supabase.rpc('decrement_post_likes', {
      post_id: postId,
    })

    if (updateError) {
      console.error('Error decrementing likes:', updateError)
    }
  } else {
    // Like: insertar like e incrementar contador
    const { error: insertError } = await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_id: user.id,
      })

    if (insertError) {
      return { error: insertError.message }
    }

    const { error: updateError } = await supabase.rpc('increment_post_likes', {
      post_id: postId,
    })

    if (updateError) {
      console.error('Error incrementing likes:', updateError)
    }

    // Crear notificación para el autor (solo si no es el mismo usuario)
    if (post && post.author_id !== user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      await createNotification(
        supabase,
        post.author_id,
        'like',
        'Le gustó tu publicación',
        `A ${profile?.full_name || 'Alguien'} le gustó tu post: "${post.title}"`,
        `/comunidad/${postId}`
      )
    }
  }

  // 4. Revalidar
  revalidatePath('/comunidad')
  return { error: null }
}

// ============================================
// COMMENTS
// ============================================

export async function getComments(postId: string) {
  const { error: authError, supabase } = await requireAuth()
  if (authError || !supabase) {
    return { error: authError || 'No autenticado', data: null }
  }

  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles!comments_author_id_fkey(id, full_name, avatar_url, level)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    return { error: error.message, data: null }
  }

  // Organizar comentarios en estructura con respuestas
  const topLevelComments: CommentWithAuthor[] = []
  const repliesMap = new Map<string, CommentWithAuthor[]>()

  data.forEach((comment: any) => {
    const commentWithAuthor: CommentWithAuthor = {
      id: comment.id,
      post_id: comment.post_id,
      author_id: comment.author_id,
      content: comment.content,
      parent_id: comment.parent_id,
      created_at: comment.created_at,
      author: comment.author,
      replies: [],
    }

    if (comment.parent_id === null) {
      topLevelComments.push(commentWithAuthor)
    } else {
      if (!repliesMap.has(comment.parent_id)) {
        repliesMap.set(comment.parent_id, [])
      }
      repliesMap.get(comment.parent_id)!.push(commentWithAuthor)
    }
  })

  // Asignar respuestas a comentarios padre
  topLevelComments.forEach(comment => {
    comment.replies = repliesMap.get(comment.id) || []
  })

  return { error: null, data: topLevelComments }
}

export async function createComment(postId: string, content: string, parentId?: string) {
  // 1. Verificar autenticación
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado' }
  }

  // 2. Validar contenido
  if (!content || content.trim().length < 2) {
    return { error: 'El comentario debe tener al menos 2 caracteres' }
  }

  // 3. Insertar comentario
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      author_id: user.id,
      content: content.trim(),
      parent_id: parentId || null,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // 4. Incrementar contador de comentarios en el post
  const { error: updateError } = await supabase.rpc('increment_post_comments', {
    post_id: postId,
  })

  if (updateError) {
    console.error('Error incrementing comments:', updateError)
  }

  // 5. Crear notificación
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  if (parentId) {
    // Es una respuesta - notificar al autor del comentario padre
    const { data: parentComment } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', parentId)
      .single()

    if (parentComment && parentComment.author_id !== user.id) {
      await createNotification(
        supabase,
        parentComment.author_id,
        'reply',
        'Nueva respuesta',
        `${profile?.full_name || 'Alguien'} respondió a tu comentario`,
        `/comunidad/${postId}`
      )
    }
  } else {
    // Es un comentario nuevo - notificar al autor del post
    const { data: post } = await supabase
      .from('posts')
      .select('author_id, title')
      .eq('id', postId)
      .single()

    if (post && post.author_id !== user.id) {
      await createNotification(
        supabase,
        post.author_id,
        'comment',
        'Nuevo comentario',
        `${profile?.full_name || 'Alguien'} comentó en tu post: "${post.title}"`,
        `/comunidad/${postId}`
      )
    }
  }

  // 6. Otorgar XP y verificar badges
  await awardXP(user.id, 2, 'comment_create', 'Comentario en la comunidad')
  await checkAndAwardBadges(user.id)

  // 7. Revalidar
  revalidatePath('/comunidad')
  return { error: null, data }
}

// ============================================
// DIRECT MESSAGES
// ============================================

export async function getConversations() {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', data: null }
  }

  // Obtener todos los mensajes donde el usuario está involucrado
  const { data: messages, error } = await supabase
    .from('direct_messages')
    .select(`
      *,
      sender:profiles!direct_messages_sender_id_fkey(id, full_name, avatar_url, level),
      receiver:profiles!direct_messages_receiver_id_fkey(id, full_name, avatar_url, level)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message, data: null }
  }

  // Agrupar por usuario (conversaciones)
  const conversationsMap = new Map<string, Conversation>()

  messages.forEach((msg: any) => {
    const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
    const otherUser = msg.sender_id === user.id ? msg.receiver : msg.sender

    if (!conversationsMap.has(otherUserId)) {
      conversationsMap.set(otherUserId, {
        user: otherUser,
        last_message: msg.content,
        last_message_at: msg.created_at,
        unread_count: 0,
      })
    }

    // Contar mensajes no leídos (recibidos por el usuario actual)
    if (msg.receiver_id === user.id && !msg.is_read) {
      const conversation = conversationsMap.get(otherUserId)!
      conversation.unread_count++
    }
  })

  const conversations = Array.from(conversationsMap.values())
    .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())

  return { error: null, data: conversations }
}

export async function getMessages(otherUserId: string) {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', data: null }
  }

  // Obtener todos los mensajes entre los dos usuarios
  const { data, error } = await supabase
    .from('direct_messages')
    .select(`
      *,
      sender:profiles!direct_messages_sender_id_fkey(id, full_name, avatar_url, level),
      receiver:profiles!direct_messages_receiver_id_fkey(id, full_name, avatar_url, level)
    `)
    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
    .order('created_at', { ascending: true })

  if (error) {
    return { error: error.message, data: null }
  }

  // Marcar mensajes recibidos como leídos
  const unreadMessageIds = data
    .filter((msg: any) => msg.receiver_id === user.id && !msg.is_read)
    .map((msg: any) => msg.id)

  if (unreadMessageIds.length > 0) {
    await supabase
      .from('direct_messages')
      .update({ is_read: true })
      .in('id', unreadMessageIds)
  }

  // Transformar datos
  const messages: DirectMessageWithUser[] = data.map((msg: any) => ({
    id: msg.id,
    sender_id: msg.sender_id,
    receiver_id: msg.receiver_id,
    content: msg.content,
    is_read: msg.is_read,
    created_at: msg.created_at,
    other_user: msg.sender_id === user.id ? msg.receiver : msg.sender,
  }))

  return { error: null, data: messages }
}

export async function sendMessage(receiverId: string, content: string) {
  // 1. Verificar autenticación
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado' }
  }

  // 2. Validar contenido
  if (!content || content.trim().length < 1) {
    return { error: 'El mensaje no puede estar vacío' }
  }

  // 3. Insertar mensaje
  const { data, error } = await supabase
    .from('direct_messages')
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content: content.trim(),
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // 4. Crear notificación para el receptor
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  await createNotification(
    supabase,
    receiverId,
    'dm',
    'Nuevo mensaje',
    `${profile?.full_name || 'Alguien'} te envió un mensaje`,
    `/mensajes/${user.id}`
  )

  // 5. Revalidar
  revalidatePath('/mensajes')
  return { error: null, data }
}

export async function getUnreadDMCount() {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', count: 0 }
  }

  const { count, error } = await supabase
    .from('direct_messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', user.id)
    .eq('is_read', false)

  if (error) {
    return { error: error.message, count: 0 }
  }

  return { error: null, count: count || 0 }
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function getNotifications(limit: number = 20) {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', data: null }
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: data as Notification[] }
}

export async function markNotificationRead(notificationId: string) {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado' }
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/notificaciones')
  return { error: null }
}

export async function markAllNotificationsRead() {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado' }
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/notificaciones')
  return { error: null }
}

export async function getUnreadNotificationCount() {
  const { error: authError, supabase, user } = await requireAuth()
  if (authError || !supabase || !user) {
    return { error: authError || 'No autenticado', count: 0 }
  }

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) {
    return { error: error.message, count: 0 }
  }

  return { error: null, count: count || 0 }
}
