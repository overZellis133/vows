# Changelog

## New Feature: Personal Context

### Added
- **Personal Context Text Area**: Users can now provide additional details about their loved one and relationship
- **Optional Field**: Personal context is optional - the app works perfectly without it
- **Enhanced AI Prompts**: The AI now uses personal context to create more personalized and specific vows

### UI Updates
- Added textarea below the name field for personal context
- Helpful placeholder text to guide users
- Contextual hint explaining how it helps
- Proper clearing when "Clear" button is clicked

### Backend Updates
- API route now accepts `personalContext` parameter
- Prompt dynamically adjusts based on whether context is provided
- AI instructions updated to incorporate personal details

### How It Works
1. User selects a quote and enters name
2. Optionally adds personal context (memories, qualities, hopes, etc.)
3. AI generates vows that blend the philosophical quote with personal details
4. The result is more personalized and meaningful than generic vows

### Example Personal Context
Users might write things like:
- "We met in college and bonded over our love of hiking"
- "Their kindness and humor light up every room"
- "I love how they challenge me to grow and support my dreams"
- "We're planning to travel the world together"

This information helps the AI create vows that feel truly unique to the relationship.

---

## Technical Details

**Files Modified:**
- `app/page.tsx` - Added state, UI component, and API integration
- `app/api/generate/route.ts` - Enhanced prompt with context handling

**New State:**
- `personalContext: string` - Stores user's personal details

**API Changes:**
- POST `/api/generate` now accepts optional `personalContext` field

---

**Version:** 0.2.0
**Date:** 2024

