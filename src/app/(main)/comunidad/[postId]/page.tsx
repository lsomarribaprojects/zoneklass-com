import { PostDetail } from '@/features/community/components/PostDetail'

export const metadata = { title: 'Post | ZoneKlass' }

export default async function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  return <PostDetail postId={postId} />
}
