---
name: Course Image Generator
description: Generate all images for a ZoneKlass course using Google Gemini AI (Nano Banana 2)
category: content-generation
tags: [ai, images, courses, gemini]
version: 2.0.0
author: ZoneKlass Team
---

# Course Image Generator Skill

## Purpose

Automated generation of all visual assets for a ZoneKlass course, including lesson covers, content images, summary filminas, and course thumbnails using Google's Gemini 3.1 Flash Image Preview model (Nano Banana 2).

## When to Use

- New course has been seeded to database but lacks images
- Existing course needs updated visuals
- Content images contain PENDIENTE_IMG_* placeholders
- Summary filminas (educational slides) are missing
- Course thumbnail needs generation/update

## Prerequisites

### Environment Setup
```bash
# .env.local must contain:
GOOGLE_AI_API_KEY=<your-key>
SUPABASE_URL=<project-url>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

### Database Requirements
- Course must exist in `courses` table with valid slug
- Modules linked to course with `order_index`
- Lessons linked to modules with `order_index`
- Lesson content must be populated (HTML format)

### Storage Bucket
- Supabase Storage bucket `lesson-images` must exist
- Bucket must have public read access for generated URLs

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| AI Model | `gemini-3.1-flash-image-preview` | Image generation (Nano Banana 2) |
| API Client | `@google/genai` | Google AI SDK |
| Storage | Supabase Storage | Image hosting |
| Upload | Server-side Buffer | Base64 to PNG conversion |
| Prompts | Template System | Structured prompts with module palettes |

## Image Types

### 1. Lesson Covers (`cover_image_url`)

**Purpose:** Visual thumbnail for each lesson in catalog/curriculum view

**Style:**
- Flat 2D minimalist illustration (Dribbble/Behance aesthetic)
- NO text or letters
- Clean geometric shapes, solid colors
- Module-specific color palette (10 unique palettes rotate by module index)
- 16:10 landscape aspect ratio
- Light/white background

**Prompt Template:** `buildCoverPrompt()`

**DB Field:** `lessons.cover_image_url`

**Example Palette (Module 0):**
```
Primary: indigo and sky blue
Accent: electric blue
```

### 2. Content Images (replace PENDIENTE_IMG_*)

**Purpose:** Inline illustrations within lesson HTML content

**Style:** 6 rotating visual styles based on `imageIndex % 6`:
0. Flat Illustration (modern flat design)
1. Icon Diagram (clean icons with connections)
2. Isometric Scene (3D isometric perspective)
3. Infographic Card (data visualization style)
4. Step-by-Step (numbered process flow)
5. Dashboard Mockup (UI/screen mockup)

**Additional Style Guidelines:**
- Professional color palette (blues, purples, teals)
- NO text or letters
- White or light background for readability
- Educational and informative

**Detection:** Scans lesson.content for:
```html
<img src="PENDIENTE_IMG_chatgpt_analisis" alt="Description here" />
```

**Prompt Template:** `buildContentPrompt(moduleIndex, imageIndex)`

**Process:**
1. Parse HTML for all PENDIENTE_IMG_* placeholders
2. Extract alt text as context for generation
3. Generate image per placeholder (with rotating style)
4. Upload to Supabase Storage
5. Replace placeholder with public URL
6. Update lesson.content field

**Auto-Insertion:**
- Function: `insertContentImagePlaceholders()` in prompt-templates.ts
- Auto-inserts PENDIENTE_IMG_ tags after h2 sections in lesson content
- Server action: `insertAndGenerateContentImages(lessonId)` combines insertion + generation

### 3. Summary Filminas (`summary_image_url`)

**Purpose:** Educational summary slide shown after lesson completion

**Style:** 8 rotating styles based on `lessonIndex % 8`:
0. Chalkboard (dark green with chalk)
1. Modern Infographic (clean white, flat icons)
2. Isometric (3D isometric blocks)
3. Watercolor (soft painting style)
4. Comic/Caricature (fun comic book)
5. Neon/Dark (cyberpunk HUD aesthetic)
6. Vintage Notebook (aged journal paper)
7. 3D Render (Pixar-like smooth 3D)

**Key Features:**
- Extracts key concepts from lesson HTML (h2, h3 headings)
- Includes Sinsajo branding (turquoise hummingbird + footer)
- Module-specific color palette
- 16:9 landscape aspect ratio
- Readable text (TOP PRIORITY)

**Prompt Template:** `buildSummaryPrompt()`

**DB Field:** `lessons.summary_image_url`

### 4. Course Cover (`thumbnail_url`)

**Purpose:** Main course card image in catalog

**Style:**
- Professional hero image representing the entire course
- Module color palette blend or primary course color
- Flat 2D minimalist illustration
- NO text or letters
- 16:10 landscape aspect ratio
- Light/white background

**Prompt Template:** `buildCourseCoverPrompt()`

**DB Field:** `courses.thumbnail_url`

**Storage Path:** `lesson-images/{courseSlug}/course-cover/cover_course-cover_{timestamp}.png`

**Server Action:** `generateCourseCoverImage(courseId)`

**Status:** Fully implemented

## Process Flow

### Step 0: Generate Course Cover

**Admin UI:** Click "Generar Cover del Curso" button

**What happens:**
1. Fetch course data (title, description)
2. Build course cover prompt with blended module palettes
3. Call Gemini API with `responseModalities: ['image', 'text']`
4. Extract base64 image from response
5. Upload to `lesson-images/{courseSlug}/course-cover/cover_course-cover_{timestamp}.png`
6. Update `courses.thumbnail_url` with public URL
7. Revalidate cache

**Server Action:** `generateCourseCoverImage(courseId)`

### Step 1: Generate Lesson Covers

**Admin UI:** Click "Generar Todos los Covers" or individual "Cover" button

**What happens:**
1. Fetch lesson + module + course data
2. Build cover prompt with module palette
3. Call Gemini API with `responseModalities: ['image', 'text']`
4. Extract base64 image from response
5. Upload to `lesson-images/{courseSlug}/{lessonId}/cover_*.png`
6. Update `lessons.cover_image_url` with public URL
7. Revalidate cache

**Rate Limit:** 4s delay between batch requests (~15 RPM for free tier)

**Server Action:** `generateLessonCoverImage(lessonId)`

### Step 2: Generate Content Images

**Admin UI:** Click "Generar Todo el Contenido" or individual "Contenido" button

**What happens:**
1. Parse lesson.content for PENDIENTE_IMG_* placeholders
2. For each placeholder:
   - Extract alt text as description
   - Generate content image
   - Upload to storage
   - Replace placeholder in HTML
3. Update lesson.content with new URLs
4. Return summary (replacements/total/errors)

**Rate Limit:** 2s delay between images within same lesson

**Server Action:** `generateContentImages(lessonId)`

### Step 3: Generate Summary Filminas

**Admin UI:** Click "Generar Todas las Filminas" or individual "Filmina" button

**What happens:**
1. Extract key concepts from lesson HTML:
   - h2 headings (main concepts)
   - h3 headings (sub-concepts)
   - Bold terms in list items (key terms)
2. Determine style (lessonIndex % 8)
3. Build summary prompt with:
   - Style-specific template
   - Key concepts list
   - Sinsajo branding block
   - Module color palette
4. Generate image
5. Upload to storage
6. Update `lessons.summary_image_url`

**Rate Limit:** 4s delay between batch requests

**Server Action:** `generateLessonSummaryImage(lessonId)`

### Step 4: Verify Results

**Admin UI:** `/admin/courses/[id]/images`

**Dashboard shows:**
- Covers Generated: X/Y
- Content Images: N pending
- Filminas Generated: X/Y
- Estimated Cost: $X.XX

**Per-lesson view:**
- Thumbnail preview
- Generation status
- Individual action buttons

## Rate Limits & Costs

### Google AI Free Tier
- Model: `gemini-3.1-flash-image-preview`
- Rate Limit: ~15 requests per minute (RPM)
- Recommended Delay: 3-4 seconds between requests
- Quota: $300 free credits (requires account activation)

### Cost Estimation
- ~$0.04 per image (approximate)
- Typical course (42 lessons):
  - 42 covers + 86 content + 42 summaries = 170 images
  - Total: ~$6.80

### Retry Strategy
On error:
- Wait 5 seconds
- Log error message
- Continue with next image
- Display errors in batch summary

## File Structure

```
src/
├── lib/openai/
│   ├── image-generation.ts          # Core Gemini API client
│   ├── upload-generated-image.ts    # Supabase Storage upload
│   ├── prompt-templates.ts          # All prompt builders
│   └── extract-lesson-concepts.ts   # HTML parser for summaries
│
├── actions/
│   └── generate-images.ts           # Server actions (auth + orchestration)
│
└── app/(admin)/admin/courses/[id]/images/
    └── page.tsx                      # Admin UI dashboard
```

## Implementation Details

### Module Color Palettes

10 unique palettes rotate by `moduleIndex`:

```typescript
0: indigo/sky blue (electric blue accent)
1: emerald/teal (mint green accent)
2: coral/orange (golden yellow accent)
3: violet/magenta (pink accent)
4: amber/burnt orange (warm gold accent)
5: crimson/rose (soft pink accent)
6: deep teal/cyan (aquamarine accent)
7: slate blue/lavender (periwinkle accent)
8: forest green/lime (chartreuse accent)
9: royal purple/deep blue (neon purple accent)
```

### Sinsajo Branding

**Logo Files:**
- `public/branding/sinsajo-hummingbird.png` (turquoise silhouette)
- `public/branding/sinsajo-logo-full.png` (full color logo)
- `public/branding/sinsajo-silhouette-black.png` (black version)

**Branding Levels:**

1. **SINSAJO_BRANDING** (Full - for summaries):
```
Bottom-right corner (small, subtle):
- Turquoise hummingbird silhouette (side profile, wings spread)
- "sinsajo creators" text below bird
- Turquoise color (#06B6D4)

Bottom center:
- "www.sinsajocreators.com"
```

2. **SINSAJO_WATERMARK** (Subtle - for covers/content):
```
Small watermark placement:
- Turquoise hummingbird silhouette
- Subtle, non-intrusive positioning
```

**Application:** Now included on ALL image types (covers, content, summaries)

### Storage Path Convention

```
lesson-images/
  {courseSlug}/
    {lessonId}/
      cover_{name}_{timestamp}.png
      content_{name}_{timestamp}.png
      summary_{name}_{timestamp}.png
```

Example:
```
lesson-images/domina-la-ia-de-cero-a-experto/abc123/cover_cover_1710691200000.png
```

## Troubleshooting

### Error: Model 404

**Symptom:** `gemini-2.0-flash-preview-image-generation` not found

**Solution:** Use correct model name: `gemini-3.1-flash-image-preview`

### Error: Rate Limit Exceeded

**Symptom:** 429 Too Many Requests

**Solution:**
- Increase delay to 5 seconds
- Free tier has limited quota
- Activate account for full $300 credits

### Error: Upload Failed

**Symptom:** Storage upload error

**Solution:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check bucket `lesson-images` exists
- Ensure bucket has public read access
- Verify file path doesn't contain invalid characters

### Error: No Image Data in Response

**Symptom:** "No image data in response"

**Solution:**
- Check prompt length (max 4000 chars)
- Verify API key is valid
- Ensure `responseModalities: ['image', 'text']` is set

### Error: Prompt Too Generic

**Symptom:** Generic/repetitive AI imagery

**Solution:**
- Emphasize specific topic in prompt
- Add more visual metaphors
- Use concrete nouns vs abstract concepts
- Reference MODULE_PALETTES for color variety

## Best Practices

### Before Batch Generation

1. **Test Single Image First:** Generate one cover, one content image, one summary
2. **Check Storage:** Verify bucket permissions and public access
3. **Monitor Costs:** Track API usage against free tier quota
4. **Backup Content:** If updating existing images, backup lesson HTML

### During Generation

1. **Don't Close Tab:** Keep admin UI open during batch operations
2. **Monitor Errors:** Watch batch error panel for failures
3. **Respect Rate Limits:** Let delays complete (don't spam buttons)

### After Generation

1. **Visual Review:** Check generated images for quality
2. **Content Verification:** Ensure PENDIENTE_IMG_* placeholders are replaced
3. **Cache Invalidation:** Verify revalidatePath worked (hard refresh if needed)
4. **Cost Tracking:** Note total images generated for budget

## Batch Script

For programmatic access outside admin UI:

**Location:** `scripts/batch-generate-images.mjs`

**Usage:**
```bash
node scripts/batch-generate-images.mjs <course-slug> [--type all|cover|lessons|content|summaries] [--delay ms]
```

**Features:**
- Auto-loads `.env.local` for credentials
- Handles full pipeline: placeholder insertion → image generation → upload → DB update
- Configurable delay between API calls
- Detailed progress logging and error handling

**Options:**
- `--type cover` (only course cover)
- `--type lessons` (only lesson covers)
- `--type content` (only content images, includes auto-insertion)
- `--type summaries` (only filminas)
- `--type all` (default, all types including course cover)
- `--delay <ms>` (delay between API calls, default varies by type)

**Examples:**
```bash
# Generate all images for course
node scripts/batch-generate-images.mjs domina-la-ia-de-cero-a-experto

# Generate only summaries with 5s delay
node scripts/batch-generate-images.mjs ia-para-marketing-y-negocios --type summaries --delay 5000

# Generate course cover only
node scripts/batch-generate-images.mjs domina-la-ia-de-cero-a-experto --type cover
```

## References

See additional documentation:
- `references/style-catalog.md` - Detailed summary style descriptions
- `references/branding-guide.md` - Sinsajo brand guidelines
- `references/prompt-patterns.md` - Proven prompt engineering patterns

## Version History

**v2.0.0** (2026-03-17)
- Course cover generation fully implemented (`generateCourseCoverImage`)
- Content images now use 6 rotating visual styles
- Auto-insertion of content placeholders (`insertContentImagePlaceholders`)
- Sinsajo branding on ALL image types (full + watermark variants)
- Batch script with full pipeline support
- Branding assets organized in `public/branding/`
- Enhanced content prompt with `moduleIndex` and `imageIndex` parameters

**v1.0.0** (2026-03-17)
- Initial skill documentation
- Support for 4 image types
- 8 summary styles with rotation
- 10 module color palettes
- Sinsajo branding integration
