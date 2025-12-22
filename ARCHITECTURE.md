# Architecture Guide - Dev Voice Assistant

## System Overview

Dev Voice Assistant is a browser-based, full-stack application that combines voice recognition, natural language processing, and developer-focused command execution.

```
┌──────────────────────────────────────────────────────┐
│                   User Browser                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │  React Frontend (Next.js 14)                   │ │
│  │  - Voice Input UI (Web Speech API)             │ │
│  │  - Command History Display                     │ │
│  │  - Zustand State Management                    │ │
│  └─────────────────────────────────────────────────┘ │
└──────────┬───────────────────────────────────────────┘
           │ HTTP API Calls
           ▼
┌──────────────────────────────────────────────────────┐
│        Next.js API Routes (Backend)                  │
│  ┌──────────────────────────────────────────────┐   │
│  │ /api/transcribe  - Audio to Text             │   │
│  │ /api/analyze     - Text to Response (LLM)    │   │
│  │ /api/history     - Command History (DB)      │   │
│  └──────────────────────────────────────────────┘   │
└──────────┬────────────┬─────────────────────────────┘
           │            │
      OpenAI API   Prisma ORM + SQLite Database
           │            │
           ▼            ▼
        GPT-4        dev.db (Local)
```

## Core Modules

### 1. Frontend Layer (`/app` & `/lib`)

**Key Components:**
- **Voice Input**: Uses Web Speech API for real-time audio capture
- **UI Components**: Built with React & Tailwind CSS
- **State Management**: Zustand store for global state
- **API Integration**: Fetch-based HTTP client for backend communication

**Files:**
- `app/page.tsx` - Main page entry
- `app/layout.tsx` - Root layout with providers
- `lib/` - Utility functions and helpers

### 2. Backend API Layer (`/app/api`)

**Endpoints:**

#### POST /api/transcribe
- Receives audio stream from frontend
- Converts speech to text using Web Speech API fallback
- Returns transcript

#### POST /api/analyze  
- Accepts: `{ transcript, context?, commandType, userId }`
- Sends to OpenAI GPT-4
- Applies context-aware prompting
- Returns: Structured response

#### GET /api/history?userId={id}
- Retrieves all past commands for a user
- Returns array of Command objects with metadata

### 3. Data Layer (`/prisma`)

**Database Models:**

```prisma
model User {
  id        String     @id @default(uuid())
  createdAt DateTime   @default(now())
  commands  Command[]
}

model Command {
  id          String   @id @default(uuid())
  userId      String
  transcript  String    // Original voice input
  context     String?   // Additional context (URLs, code snippets)
  response    String    // LLM-generated response
  commandType String    // Category (github_pr, code_review, etc.)
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
}
```

### 4. State Management (`/store`)

**Zustand Store Structure:**
- `useVoiceStore` - Manages voice state, recording status
- `useHistoryStore` - Manages command history
- `useUIStore` - Manages UI state (modals, notifications)

## Data Flow

### 1. Voice Command Flow
```
1. User clicks microphone button
2. Browser requests microphone permission (Web Speech API)
3. Audio captured in real-time
4. On silence detected → Audio stops
5. Speech converted to text
6. Text sent to /api/analyze with context
7. Response received from LLM
8. Response displayed and saved to history
```

### 2. Database Persistence
```
Frontend Submission
       ↓
API validates input
       ↓
Prisma creates Command record
       ↓
SQLite stores data locally
       ↓
Response returned to frontend
       ↓
UI updates with confirmation
```

## Extension Points

### Adding New LLM Providers

**File to modify:** `/app/api/analyze/route.ts`

```typescript
// Add new provider to the analyze function
if (process.env.LLM_PROVIDER === 'anthropic') {
  response = await callClaude(transcript, context);
} else if (process.env.LLM_PROVIDER === 'ollama') {
  response = await callOllama(transcript, context);
}
```

### Adding New Voice Commands

**File to modify:** `/lib/commandTypes.ts`

```typescript
const COMMAND_TYPES = {
  github_pr: { pattern: /github|pr/i, ... },
  code_review: { pattern: /review|refactor/i, ... },
  YOUR_NEW_COMMAND: { pattern: /your_pattern/i, ... }
};
```

### Extending Database Schema

**File to modify:** `/prisma/schema.prisma`

```prisma
model Command {
  // ... existing fields
  tags       String[]      // Add new fields
  embedding  String?       // For similarity search
  rating     Int?          // User feedback (1-5)
}
```

Then run:
```bash
npx prisma migrate dev --name add_new_fields
```

### Custom Command Processors

**Create new file:** `/lib/processors/customProcessor.ts`

```typescript
export function processCustomCommand(transcript: string) {
  // Custom logic here
  return enhancedResponse;
}
```

## Error Handling Strategy

### Microphone Errors
```typescript
try {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
} catch (error) {
  // Fallback to text input
  showTextInputFallback();
}
```

### API Failures
```typescript
if (response.status === 429) {
  // Rate limited - queue and retry
} else if (response.status >= 500) {
  // Server error - show user friendly message
} else if (response.status === 401) {
  // Invalid API key - redirect to settings
}
```

### Database Errors
```typescript
try {
  await prisma.command.create({ data });
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
  } else {
    // Log and retry
  }
}
```

## Performance Considerations

1. **Voice Recognition**: Web Speech API runs locally (no network latency)
2. **API Caching**: Results cached in Zustand store
3. **Database Queries**: Paginated history to avoid loading all records
4. **Bundle Size**: Tree-shaking unused Tailwind CSS utilities

## Security Best Practices

1. **API Keys**: Never expose in frontend code (use environment variables)
2. **User Data**: Stored locally in browser and encrypted SQLite database
3. **CORS**: Restrict to authorized origins
4. **Rate Limiting**: Implement per-user rate limits on API endpoints

## Deployment Architecture

**Development:**
- Local Next.js dev server (`npm run dev`)
- SQLite database stored in repo root (`dev.db`)

**Production (Vercel):**
- Serverless functions for API routes
- PostgreSQL/Supabase for persistent storage
- Environment variables for API keys
- EdgeConfig for dynamic configuration

## Testing Strategy

- **Unit Tests**: Test utilities and helper functions
- **Integration Tests**: Test API routes with mocked database
- **E2E Tests**: Test full user workflows
- **Manual Testing**: Voice recognition across browsers

## Future Architecture Improvements

1. **Streaming Responses**: Server-Sent Events (SSE) for real-time response streaming
2. **Multi-tenancy**: Support for teams and shared workspaces
3. **Plugin System**: Allow third-party extensions for new commands
4. **Real-time Collaboration**: WebSocket support for shared sessions
5. **RAG Integration**: Retrieval-Augmented Generation for context-aware responses
