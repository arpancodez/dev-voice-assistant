# 🎤 Dev Voice Assistant

A powerful browser-based voice assistant designed specifically for developers. Use voice commands to interact with GitHub PRs, analyze error logs, generate commit messages, and more.

## ✨ Features

- 🎙️ **Voice Recognition**: Uses Web Speech API for real-time speech-to-text
- 🤖 **LLM Integration**: Powered by OpenAI GPT-4 for intelligent responses
- 📝 **Command History**: Per-user command storage with full context
- 📋 **One-Click Copy**: Instantly copy AI-generated outputs
- 🎯 **Developer-Focused**: Specialized commands for GitHub, error analysis, commits
- 💾 **Persistent Storage**: SQLite database with Prisma ORM
- 🎨 **Modern UI**: Built with Next.js 14, React, and Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/arpancodez/dev-voice-assistant.git
cd dev-voice-assistant

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Initialize database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Voice Commands

1. **Click the microphone button** to start recording
2. **Speak your command** (e.g., "Summarize this GitHub PR")
3. **Wait for transcription** and AI response
4. **Copy the output** with one click

### Example Commands

- "Summarize this GitHub PR: [PR URL]"
- "Explain this error: TypeError: Cannot read property 'map' of undefined"
- "Write a commit message for: Added user authentication and JWT tokens"
- "Review this code: [paste code snippet]"
- "Generate API documentation for this endpoint"

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Web Speech API** - Browser-native voice recognition
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Type-safe database access
- **SQLite** - Lightweight embedded database
- **OpenAI API** - GPT-4 integration

## 📂 Project Structure

```
dev-voice-assistant/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── transcribe/   # Voice transcription
│   │   ├── analyze/      # LLM analysis
│   │   └── history/      # Command history
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── VoiceInput.tsx    # Voice recording
│   ├── CommandHistory.tsx
│   ├── ResponseDisplay.tsx
│   └── CopyButton.tsx
├── lib/                   # Utility functions
│   ├── openai.ts         # OpenAI client
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helpers
├── prisma/               # Database schema
│   └── schema.prisma
├── store/                # Zustand stores
│   └── useAssistantStore.ts
├── types/                # TypeScript types
│   └── index.ts
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

```env
OPENAI_API_KEY=sk-...           # Your OpenAI API key
OPENAI_MODEL=gpt-4-turbo-preview # Model to use
DATABASE_URL=file:./dev.db      # SQLite database path
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Schema

The application uses Prisma with SQLite:

```prisma
model User {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  commands  Command[]
}

model Command {
  id          String   @id @default(uuid())
  userId      String
  transcript  String
  context     String?
  response    String
  commandType String
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}
```

## 🎯 API Endpoints

### POST /api/transcribe
Transcribes audio to text using Web Speech API or fallback service.

### POST /api/analyze
Sends transcript + context to OpenAI for intelligent analysis.

**Request Body:**
```json
{
  "transcript": "Summarize this GitHub PR",
  "context": "PR URL or code snippet",
  "commandType": "github_pr",
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "response": "This PR implements...",
  "commandId": "cmd-uuid"
}
```

### GET /api/history?userId={id}
Retrieves command history for a user.

## 🎨 Features in Detail

### Voice Recognition
- Uses native Web Speech API (Chrome, Edge, Safari)
- Real-time transcription with visual feedback
- Automatic stop detection
- Fallback for unsupported browsers

### LLM Integration
- Context-aware prompts for different command types
- Structured responses optimized for developers
- Token-efficient processing
- Error handling and retry logic

### Command History
- Chronological display of past commands
- Search and filter capabilities
- Export history as JSON
- Per-user isolation

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub** (already done)
2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import `arpancodez/dev-voice-assistant`
   - Add environment variable: `OPENAI_API_KEY`
3. **Deploy!**

### Database for Production

For production, migrate from SQLite to PostgreSQL:

```prisma
// In prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Use services like:
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Vercel for hosting platform
- Web Speech API community

## 📧 Contact

Arpan - [@arpancodez](https://github.com/arpancodez)

Project Link: [https://github.com/arpancodez/dev-voice-assistant](https://github.com/arpancodez/dev-voice-assistant)

---

Built with ❤️ by developers, for developers.