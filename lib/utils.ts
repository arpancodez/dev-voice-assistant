import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function detectCommandType(transcript: string): string {
  const lower = transcript.toLowerCase()

  if (lower.includes('github') || lower.includes('pull request') || lower.includes('pr')) {
    return 'github_pr'
  }
  if (lower.includes('error') || lower.includes('exception') || lower.includes('bug')) {
    return 'error_log'
  }
  if (lower.includes('commit') || lower.includes('git message')) {
    return 'commit_msg'
  }
  if (lower.includes('review') || lower.includes('code quality')) {
    return 'code_review'
  }
  if (lower.includes('api') || lower.includes('documentation') || lower.includes('endpoint')) {
    return 'api_docs'
  }

  return 'default'
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}