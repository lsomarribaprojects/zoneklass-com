'use client'

import { useMemo, useEffect, useRef } from 'react'
import DOMPurify from 'isomorphic-dompurify'
import './lesson-content.css'

interface RichLessonContentProps {
  html: string
}

// Configure DOMPurify to allow safe embeds and custom attributes
const PURIFY_CONFIG = {
  ADD_TAGS: ['iframe', 'figcaption', 'figure'],
  ADD_ATTR: [
    'data-youtube-id',
    'allowfullscreen',
    'frameborder',
    'allow',
    'loading',
    'target',
    'rel',
  ],
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: ['script', 'style', 'form', 'input', 'textarea', 'select'],
}

// Only allow YouTube/Vimeo iframes
DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  if (data.tagName === 'iframe') {
    const el = node as Element
    const src = el.getAttribute?.('src') || ''
    const isYouTube =
      src.startsWith('https://www.youtube.com/embed/') ||
      src.startsWith('https://youtube.com/embed/')
    const isVimeo = src.startsWith('https://player.vimeo.com/video/')

    if (!isYouTube && !isVimeo) {
      el.remove()
    }
  }
})

export function RichLessonContent({ html }: RichLessonContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const sanitizedHtml = useMemo(() => {
    return DOMPurify.sanitize(html, PURIFY_CONFIG)
  }, [html])

  useEffect(() => {
    if (!contentRef.current) return

    // Convert data-youtube-id divs into responsive iframes
    const ytContainers = contentRef.current.querySelectorAll<HTMLElement>(
      '[data-youtube-id]'
    )
    ytContainers.forEach((container) => {
      const videoId = container.getAttribute('data-youtube-id')
      if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return

      container.classList.add('video-embed')
      container.innerHTML = ''

      const iframe = document.createElement('iframe')
      iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
      iframe.allow =
        'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      iframe.allowFullscreen = true
      iframe.loading = 'lazy'
      iframe.title = 'Video de YouTube'

      container.appendChild(iframe)
    })

    // Wrap existing YouTube iframes in responsive containers
    const iframes = contentRef.current.querySelectorAll<HTMLIFrameElement>(
      'iframe[src*="youtube.com/embed"]'
    )
    iframes.forEach((iframe) => {
      if (iframe.parentElement?.classList.contains('video-embed')) return

      const wrapper = document.createElement('div')
      wrapper.className = 'video-embed'
      iframe.parentElement?.insertBefore(wrapper, iframe)
      wrapper.appendChild(iframe)
    })

    // Add lazy loading and responsive behavior to images
    const images = contentRef.current.querySelectorAll<HTMLImageElement>('img')
    images.forEach((img) => {
      img.loading = 'lazy'
      img.decoding = 'async'
    })

    // Make external links open in new tab
    const links = contentRef.current.querySelectorAll<HTMLAnchorElement>(
      'a[href^="http"]'
    )
    links.forEach((link) => {
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
    })
  }, [sanitizedHtml])

  return (
    <div
      ref={contentRef}
      className="lesson-rich-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}
