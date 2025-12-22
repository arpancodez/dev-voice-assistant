import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'

export interface AnalyzeRequest {
  transcript: string
  context?: string
  commandType: string
}

export interface AnalyzeResponse {
  response: string
  tokensUsed?: number
}

// System prompts for different command types
export const SYSTEM_PROMPTS: Record<string, string> = {
  github_pr: `You are a GitHub PR expert. Analyze pull requests and provide:
1. Summary of changes
2. Key files modified
3. Potential issues or improvements
4. Review comments
Be concise and actionable.`,

  error_log: `You are a debugging expert. Analyze error logs and provide:
1. Root cause identification
2. Explanation of the error
3. Step-by-step solution
4. Prevention tips
Be clear and practical.`,

  commit_msg: `You are a Git commit message expert following Conventional Commits.
Generate a commit message with:
1. Type (feat, fix, docs, style, refactor, test, chore)
2. Scope (optional)
3. Subject (imperative mood, <50 chars)
4. Body (optional, detailed explanation)
Example: "feat(auth): add JWT token validation"`,

  code_review: `You are a senior code reviewer. Analyze code and provide:
1. Code quality assessment
2. Best practices violations
3. Security concerns
4. Performance optimizations
5. Suggested improvements
Be constructive and specific.`,

  api_docs: `You are an API documentation expert. Generate documentation with:
1. Endpoint description
2. Request parameters
3. Response format
4. Example requests/responses
5. Error codes
Follow OpenAPI/Swagger format where applicable.`,

  default: `You are a helpful AI assistant for developers. Provide clear, concise, and actionable responses.`,
}

export async function analyzeWithAI({
  transcript,
  context,
  commandType,
}: AnalyzeRequest): Promise<AnalyzeResponse> {
  const systemPrompt = SYSTEM_PROMPTS[commandType] || SYSTEM_PROMPTS.default

  const userMessage = context
    ? `Command: ${transcript}\n\nContext:\n${context}`
    : transcript

  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    return {
      response: completion.choices[0]?.message?.content || 'No response generated',
      tokensUsed: completion.usage?.total_tokens,
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to analyze with AI')
  }
}