'use client'

interface VideoPlayerProps {
  videoUrl: string | null
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  if (!videoUrl) return null

  // Extract video ID and create embed URL
  const getEmbedUrl = (url: string): string | null => {
    try {
      // YouTube patterns
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      const youtubeMatch = url.match(youtubeRegex)
      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1`
      }

      // Vimeo patterns
      const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/
      const vimeoMatch = url.match(vimeoRegex)
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`
      }

      // If already an embed URL, use as is
      if (url.includes('youtube.com/embed') || url.includes('player.vimeo.com')) {
        return url
      }

      return null
    } catch {
      return null
    }
  }

  const embedUrl = getEmbedUrl(videoUrl)

  if (!embedUrl) return null

  return (
    <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden">
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video de la lección"
      />
    </div>
  )
}
