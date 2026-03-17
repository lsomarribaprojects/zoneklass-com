# Course Image Generator Skill

Automated AI-powered image generation for ZoneKlass courses using Google Gemini (Nano Banana 2).

## Quick Start

### Via Admin UI
```
1. Navigate to /admin/courses/[course-id]/images
2. Click "Generar Todos los Covers" for all lesson covers
3. Click "Generar Todo el Contenido" for content images
4. Click "Generar Todas las Filminas" for summary slides
```

### Via Standalone Script
```bash
cd .claude/skills/course-image-generator/scripts
node generate_course_images.mjs <course-slug> [--type <type>]
```

**Examples:**
```bash
# Generate everything
node generate_course_images.mjs ia-para-marketing-y-negocios

# Only summary filminas
node generate_course_images.mjs domina-la-ia --type summaries

# Only content images
node generate_course_images.mjs crypto-trading --type content
```

## What Gets Generated

### 1. Lesson Covers (42 per course typically)
- Flat 2D minimalist illustrations
- Module-specific color palettes
- NO text (pure visual)
- 16:10 aspect ratio

### 2. Content Images (varies by course)
- Replaces PENDIENTE_IMG_* placeholders in lesson HTML
- Clean infographic style
- Educational illustrations
- Light backgrounds for readability

### 3. Summary Filminas (42 per course typically)
- 8 rotating styles (chalkboard, infographic, isometric, watercolor, comic, neon, notebook, 3D)
- Extracts key concepts from lesson content
- Sinsajo branding included
- 16:9 aspect ratio

### 4. Course Thumbnails (future)
- Not yet implemented

## File Structure

```
.claude/skills/course-image-generator/
├── README.md                      # This file
├── SKILL.md                       # Complete skill documentation
├── references/
│   ├── style-catalog.md          # 8 summary styles explained
│   ├── branding-guide.md         # Sinsajo brand guidelines
│   └── prompt-patterns.md        # Prompt engineering patterns
└── scripts/
    └── generate_course_images.mjs # Standalone script
```

## Documentation

### For Users
- **SKILL.md** - Complete usage guide (prerequisites, process, troubleshooting)

### For Developers
- **references/prompt-patterns.md** - How to write effective prompts
- **references/style-catalog.md** - Visual style specifications
- **references/branding-guide.md** - Brand integration rules

### For Automation
- **scripts/generate_course_images.mjs** - Standalone Node.js script

## Prerequisites

### Environment Variables (.env.local)
```bash
GOOGLE_AI_API_KEY=<your-key>
SUPABASE_URL=<project-url>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

### Database Setup
- Course with modules and lessons must exist
- Lessons must have content (HTML format)
- Storage bucket `lesson-images` must exist with public access

### API Access
- Google AI API key with Gemini access
- Free tier: $300 credits (requires activation)
- Rate limit: ~15 requests per minute

## Tech Stack

| Component | Technology |
|-----------|------------|
| AI Model | `gemini-3.1-flash-image-preview` (Nano Banana 2) |
| SDK | `@google/genai` |
| Storage | Supabase Storage |
| Format | PNG (base64 → binary upload) |
| Cost | ~$0.04 per image |

## Cost Estimation

Typical course (42 lessons):
- 42 covers @ $0.04 = $1.68
- 86 content images @ $0.04 = $3.44
- 42 summaries @ $0.04 = $1.68
- **Total: ~$6.80**

Free tier includes $300 in credits.

## Rate Limits

| Operation | Delay | Reason |
|-----------|-------|--------|
| Batch covers | 4s | Free tier ~15 RPM |
| Content images | 2s | Within single lesson |
| Batch summaries | 4s | Free tier ~15 RPM |
| Error retry | 5s | Cooldown period |

## Common Use Cases

### New Course Setup
```bash
# After seeding course to database
node generate_course_images.mjs new-course-slug --type all
```

### Update Only Summaries
```bash
# New style released, regenerate summaries
node generate_course_images.mjs existing-course --type summaries
```

### Fix Failed Content Images
```bash
# Some content images failed, retry
node generate_course_images.mjs course-slug --type content
```

## Integration Points

### Source Code
```
src/
├── lib/openai/
│   ├── image-generation.ts          # Core API client
│   ├── upload-generated-image.ts    # Storage upload
│   ├── prompt-templates.ts          # Prompt builders
│   └── extract-lesson-concepts.ts   # HTML parser
├── actions/
│   └── generate-images.ts           # Server actions
└── app/(admin)/admin/courses/[id]/images/
    └── page.tsx                      # Admin UI
```

### Database Tables
- `courses.thumbnail_url` (future)
- `lessons.cover_image_url`
- `lessons.summary_image_url`
- `lessons.content` (HTML with image URLs)

### Storage
```
lesson-images/
  {course-slug}/
    {lesson-id}/
      cover_*.png
      content_*.png
      summary_*.png
```

## Troubleshooting

### 404 Model Not Found
**Problem:** Wrong model name
**Solution:** Use `gemini-3.1-flash-image-preview` (not `gemini-2.0-flash-preview-image-generation`)

### Rate Limit Errors
**Problem:** Too many requests
**Solution:** Increase delay or activate free tier for full quota

### Upload Failures
**Problem:** Storage permissions
**Solution:** Verify `SUPABASE_SERVICE_ROLE_KEY` and bucket exists

### Generic Images
**Problem:** Repetitive AI imagery
**Solution:** Add specific visual metaphors to prompts (see prompt-patterns.md)

## Best Practices

### Before Generation
1. Test with 1-2 images first
2. Verify environment variables
3. Check storage bucket permissions
4. Backup lesson content if updating

### During Generation
1. Keep admin UI tab open
2. Monitor console for errors
3. Don't spam buttons (respect rate limits)

### After Generation
1. Visual review of generated images
2. Verify PENDIENTE_IMG_* replaced
3. Hard refresh if cache issues
4. Note total cost for budget tracking

## Version History

**v1.0.0** (2026-03-17)
- Initial skill creation
- 4 image types supported
- 8 summary styles
- 10 module color palettes
- Sinsajo branding integration
- Standalone script included

## License

Proprietary - ZoneKlass Platform / Sinsajo Creators

---

**Questions?** See SKILL.md for comprehensive documentation.
