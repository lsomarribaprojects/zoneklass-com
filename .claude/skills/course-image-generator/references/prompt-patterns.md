# Prompt Engineering Patterns for Nano Banana 2

Proven patterns and best practices for generating high-quality educational images with `gemini-3.1-flash-image-preview`.

---

## Core Principles

### 1. Specificity Over Abstraction

**Bad (Too Abstract):**
```
Create an image about artificial intelligence
```

**Good (Specific Visuals):**
```
Create a flat illustration showing a neural network diagram with connected nodes
in indigo and sky blue, representing how AI processes information through layers
```

### 2. Style First, Content Second

**Pattern:**
```
[STYLE DEFINITION]
[CONTENT/TOPIC]
[SPECIFIC REQUIREMENTS]
```

**Example:**
```
Style: Flat 2D minimalist illustration
Content: Introduction to Machine Learning
Requirements: NO text, indigo/sky blue colors, 16:10 aspect ratio
```

### 3. Negative Constraints Are Critical

Always explicitly state what NOT to include:

```
- NO text or letters anywhere in the image
- NO photorealism (use illustration style)
- NO gradients (use flat colors)
- NO 3D effects
```

---

## Pattern Library

### Pattern A: Lesson Cover Images

**Template Structure:**
```
Create a flat illustration cover for [TOPIC]

Style: FLAT DESIGN ILLUSTRATION
- Flat, minimalist 2D (like Dribbble top shots)
- Clean geometric shapes, no gradients
- Primary colors: [MODULE_COLORS] with [ACCENT] accents
- Light background, centered composition
- NO text, NO words anywhere
- 16:10 landscape aspect ratio
- Modern SaaS/tech app aesthetic

Visual metaphors for [SPECIFIC_CONCEPT]
```

**Why It Works:**
- "FLAT DESIGN ILLUSTRATION" in caps emphasizes style priority
- Reference to Dribbble sets quality benchmark
- Explicit aspect ratio prevents wrong dimensions
- "Visual metaphors for X" pushes AI toward specific imagery

**Example (Lesson: "Prompt Engineering Basics"):**
```
Create a flat illustration cover for an AI course lesson.

Topic: "Prompt Engineering Basics"

Style: FLAT DESIGN ILLUSTRATION
- Flat, minimalist 2D illustration (like Dribbble/Behance top shots)
- Clean geometric shapes, no gradients
- Primary colors: indigo and sky blue with electric blue accents
- Light/white background with illustration centered
- NO text, NO letters, NO words anywhere in the image
- 16:10 landscape aspect ratio
- Modern SaaS/tech app aesthetic

Create visual metaphors for crafting AI prompts: a person typing at a computer
with thought bubbles containing clear icons (lightbulb, checkmark, target),
representing structured thinking and clear communication with AI.
```

### Pattern B: Content Images

**Template Structure:**
```
Create a professional illustration for [LESSON_CONTEXT]

Purpose: [ALT_TEXT_DESCRIPTION]

Style requirements:
- Clean infographic/illustration style
- Professional color palette (blues, purples, teals)
- Clear visual hierarchy
- Educational and informative
- NO text or letters
- White/light background for inline content
```

**Why It Works:**
- "Purpose" frame gives AI clear goal
- Color palette matches ZoneKlass brand
- "For inline content" context influences composition
- Light background ensures readability in article

**Example (Alt: "ChatGPT interface with prompt examples"):**
```
Create a professional illustration for an online AI course lesson.

Lesson: "Introduction to ChatGPT"
Image purpose: ChatGPT interface with prompt examples

Style requirements:
- Clean, modern infographic style
- Professional color palette (blues, purples, teals)
- Clear visual hierarchy showing computer screen with chat interface
- Educational and informative
- NO text or letters in the image
- Suitable for professional online learning platform
- White or light background for readability within article content
```

### Pattern C: Summary Filminas

**Template Structure:**
```
Create a [STYLE_NAME] educational summary image.

TOPIC: "[LESSON_TITLE]" (from "[MODULE_TITLE]")

KEY CONCEPTS:
1. "[Concept 1]"
2. "[Concept 2]"
3. "[Concept 3]"

STYLE:
[DETAILED_STYLE_DESCRIPTION]
[COLOR_PALETTE_INTEGRATION]
[SPECIFIC_ELEMENTS]

[BRANDING_BLOCK]

CRITICAL RULES:
- ALL text MUST be clearly readable - TOP PRIORITY
- Use 16:9 landscape aspect ratio
- Include visual metaphors related to topic
- Educational, attractive, professional
```

**Why It Works:**
- Numbered concepts give AI clear structure
- "CRITICAL RULES" at end reinforces must-haves
- Style description comes before content (guides aesthetic first)
- Branding block ensures consistent attribution

**Example (Chalkboard Style, Lesson 0):**
```
Create a chalkboard-style educational summary image.

SCENE: A realistic dark green classroom chalkboard with chalk-drawn elements.

TITLE (top center, large white chalk): "What is Prompt Engineering?"
SUBTITLE (smaller, sky blue chalk): "Module 1: AI Fundamentals"

KEY CONCEPTS (numbered chalk boxes):
1. "Clear instructions to AI"
2. "Structure and context"
3. "Iterative refinement"

STYLE:
- Dark green chalkboard with chalk dust texture and smudges
- White chalk for text, colored chalk for highlights (electric blue)
- Hand-drawn educational icons (lightbulb, book, brain, gear, chart)
- Chalk borders, eraser marks for authenticity
- Arrows connecting related concepts

BRANDING (bottom-right corner, small and subtle):
- A small turquoise hummingbird silhouette (simple, elegant, side profile)
- Below: "sinsajo creators" in small text

FOOTER (bottom center, small neat text):
- "www.sinsajocreators.com"

CRITICAL RULES:
- ALL text MUST be clearly readable - TOP PRIORITY
- Use 16:9 landscape aspect ratio
- Include visual metaphors and icons related to prompt engineering
- Educational, attractive, professional
```

---

## Advanced Techniques

### Technique 1: Color Palette Integration

Instead of generic "use blue," reference specific combinations:

**Generic:**
```
Use blue colors
```

**Specific:**
```
Primary colors: indigo (#4F46E5) and sky blue (#0EA5E9)
with electric blue (#06B6D4) accents
```

**With Mood:**
```
Color palette: emerald green and teal (calming, natural)
with mint green accents (energy, freshness)
```

### Technique 2: Reference Style Benchmarks

**Examples:**
- "Like Dribbble/Behance top shots" → High-quality design
- "Notion or Stripe aesthetic" → Clean SaaS design
- "Pixar/Nintendo style" → Friendly 3D rendering
- "Cyberpunk HUD interface" → Neon dark aesthetic

### Technique 3: Composition Instructions

**Layout Guidance:**
```
- Title at top center (25% of image height)
- Concepts in 3-column grid layout below
- Each concept in bordered box with icon above text
- Equal spacing between all elements
```

**Flow Indication:**
```
- Arrange concepts left-to-right as sequential steps
- Use arrows showing progression
- Visual hierarchy: larger elements = more important
```

### Technique 4: Element Repetition

Repeat critical requirements in multiple places:

**Start:**
```
Style: FLAT DESIGN ILLUSTRATION
```

**Middle:**
```
- Flat, minimalist 2D illustration style
```

**End:**
```
Ensure final image uses flat design with no 3D effects
```

### Technique 5: Aspect Ratio Specification

Always specify explicitly:

```
- 16:10 landscape aspect ratio (lesson covers)
- 16:9 landscape aspect ratio (summary filminas)
- 1:1 square aspect ratio (profile images)
```

**Why:** Prevents Nano Banana from defaulting to square images

---

## Common Mistakes and Fixes

### Mistake 1: Generic AI Imagery

**Problem:** Prompt produces cliché brain networks or robot heads

**Fix:** Add specific visual metaphors tied to exact lesson topic
```
DON'T: "Create image about AI"
DO: "Show a flowchart with user typing question, AI processing
(gears/nodes icon), and response appearing on screen"
```

### Mistake 2: Text Despite "NO TEXT"

**Problem:** AI adds text anyway

**Fix:** Triple emphasis
```
- NO text anywhere in the image
- NO letters or words
- NO typography - illustration only
```

Also specify at END of prompt:
```
CRITICAL: Do not include any text, letters, words, or typography in the image.
```

### Mistake 3: Wrong Aspect Ratio

**Problem:** Square images when landscape needed

**Fix:** Specify aspect ratio AND describe composition
```
- 16:10 landscape aspect ratio
- Horizontal orientation with wide layout
```

### Mistake 4: Muddy Colors

**Problem:** Too many colors, no cohesion

**Fix:** Limit palette explicitly
```
Use ONLY these colors:
- Indigo (#4F46E5)
- Sky blue (#0EA5E9)
- Electric blue accent (#06B6D4)
- White background
NO other colors
```

### Mistake 5: Too Complex Composition

**Problem:** Cluttered, overwhelming images

**Fix:** Emphasize simplicity
```
- Clean, minimal composition
- 3-5 main elements maximum
- Ample white space
- Each element well-separated
```

### Mistake 6: Photorealistic When Illustration Wanted

**Problem:** AI generates photo-like image instead of illustration

**Fix:** Reinforce illustration style
```
Style: ILLUSTRATION (NOT PHOTOGRAPH)
- Flat 2D illustration
- Vector art style
- Geometric shapes
- Simplified forms (not photorealistic)
```

---

## Module Color Palette Patterns

### Pattern: Palette Integration in Prompt

**Instead of:**
```
Use nice colors
```

**Use:**
```
Primary colors: [MODULE_COLORS] with [ACCENT] accents

Where MODULE_COLORS and ACCENT come from:
Module 0: indigo and sky blue / electric blue
Module 1: emerald green and teal / mint green
Module 2: coral and warm orange / golden yellow
...
```

**Full Example:**
```
Primary colors: emerald green and teal (representing growth and learning)
with mint green accents (highlighting key points)
```

### Pattern: Color Mood Association

Tie colors to lesson emotional tone:

```
Module 3 (violet and magenta / pink):
"Use violet and magenta for creative, imaginative feel with pink accents
for approachability - fitting for a lesson on creative AI applications"
```

---

## Summary Style-Specific Patterns

### Chalkboard Pattern
```
CRITICAL: Authentic chalkboard aesthetic
- Chalk texture visible on all elements
- Slight smudging and imperfections
- Hand-drawn quality (not perfect lines)
- Eraser marks in corners
- Chalk dust particles floating
```

### Modern Infographic Pattern
```
CRITICAL: Professional SaaS aesthetic
- Geometric precision (aligned grid)
- Minimal shadows (subtle only)
- Ample white space (30%+ of image)
- Flat icons (no gradients)
- Data visualization style
```

### Isometric Pattern
```
CRITICAL: Consistent 30-degree isometric perspective
- All elements at same angle
- 3D blocks on connected platforms
- Small human figures for scale
- Soft shadows directly below objects
- Flowing paths between concepts
```

### Watercolor Pattern
```
CRITICAL: Authentic watercolor painting
- Visible brush strokes
- Paint bleeds between colors
- Organic shapes (not geometric)
- Textured paper background
- Flowing, dreamy composition
```

### Comic Pattern
```
CRITICAL: Comic book aesthetic
- Bold 3-4px black outlines
- Halftone dot shading
- Action lines for energy
- Speech bubbles for concepts
- Expressive character faces
```

### Neon/Dark Pattern
```
CRITICAL: Cyberpunk neon glow
- Deep dark background (#0F172A)
- Outer glow on all neon elements
- Holographic translucent overlays
- Subtle grid in background
- Floating light particles
```

### Vintage Notebook Pattern
```
CRITICAL: Authentic aged notebook
- Yellowed lined paper texture
- Handwritten ink style
- Coffee stain rings
- Paper clips and washi tape
- Margin doodles and sketches
```

### 3D Render Pattern
```
CRITICAL: Toy-like 3D rendering
- Rounded corners on all objects
- Glossy reflections on surfaces
- Soft ambient lighting
- Playful proportions (not realistic)
- Gentle perspective (not extreme)
```

---

## Testing & Iteration

### A/B Test Prompts

When trying new patterns, test variations:

**Version A (Current):**
```
Create a flat illustration showing [X]
```

**Version B (Testing More Specificity):**
```
Create a FLAT 2D VECTOR ILLUSTRATION showing [X], similar to
Dribbble trending designs, with clean geometric shapes
```

Compare results and adopt better pattern.

### Prompt Length Sweet Spot

**Too Short (< 50 words):**
- Generic results
- AI fills gaps with clichés

**Optimal (150-300 words):**
- Specific without overwhelming
- Clear style guidance
- Enough constraints

**Too Long (> 500 words):**
- AI may ignore later instructions
- Conflicting guidance

**Current System:**
- Cover prompts: ~200 words ✅
- Content prompts: ~150 words ✅
- Summary prompts: ~300-400 words ✅ (acceptable due to complexity)

---

## Branding Integration Pattern

### The Footer Block

Always include at end of summary prompts:

```
BRANDING (bottom-right corner, small and subtle):
- A small turquoise/teal hummingbird silhouette (simple, elegant,
  side profile with wings spread upward)
- Below the hummingbird: "sinsajo creators" in small text
- Use turquoise color for the hummingbird

FOOTER (bottom center, small neat text):
- "www.sinsajocreators.com"
```

### Critical Rules Block

Always end prompts with:

```
CRITICAL RULES:
- ALL text MUST be clearly readable - TOP PRIORITY
- Use [ASPECT_RATIO] aspect ratio
- Include visual metaphors related to [TOPIC]
- Educational, attractive, professional
```

---

## Keyword Power List

### High-Impact Style Keywords

**For Flat Design:**
- "flat illustration"
- "geometric shapes"
- "solid color fills"
- "minimalist"
- "Dribbble/Behance aesthetic"

**For Quality:**
- "professional"
- "clean"
- "modern"
- "polished"
- "high-quality"

**For Mood:**
- "friendly" (approachable)
- "elegant" (sophisticated)
- "energetic" (dynamic)
- "calm" (soothing)

### Negative Keywords (Things to Avoid)

Use these in "NO X" statements:
- "photorealistic"
- "blurry"
- "cluttered"
- "chaotic"
- "low quality"
- "pixelated"

---

## Quick Reference Checklist

Before submitting prompt to Nano Banana 2:

- [ ] Style defined at top (caps for emphasis)
- [ ] NO TEXT stated at least twice
- [ ] Aspect ratio specified explicitly
- [ ] Color palette included with hex codes or names
- [ ] Specific visual metaphors (not generic concepts)
- [ ] Module color palette integrated
- [ ] Style benchmark referenced (e.g., "like Dribbble")
- [ ] Composition guidance provided
- [ ] Branding block included (summaries only)
- [ ] Critical rules at end
- [ ] Prompt length 150-400 words

---

## Version History

**v1.0** (2026-03-17)
- Initial prompt patterns documentation
- 3 core patterns (covers, content, summaries)
- 8 style-specific patterns
- Common mistakes and fixes
- Testing guidelines
