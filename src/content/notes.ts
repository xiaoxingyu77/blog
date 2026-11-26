import { marked } from 'marked'

export interface StudyNote {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  html: string
}

const files = import.meta.glob('./study/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

function parseTags(value: string): string[] {
  const inner = value.trim().replace(/^\[/, '').replace(/\]$/, '')
  if (!inner) return []
  return inner
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseNote(path: string, raw: string): StudyNote {
  const matched = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const metaBlock = matched?.[1] ?? ''
  const body = matched?.[2] ?? raw
  const meta: Record<string, string> = {}

  for (const line of metaBlock.split(/\r?\n/)) {
    const index = line.indexOf(':')
    if (index === -1) continue
    const key = line.slice(0, index).trim()
    meta[key] = line.slice(index + 1).trim()
  }

  const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? path

  return {
    slug,
    title: meta.title ?? slug,
    date: meta.date ?? '',
    tags: parseTags(meta.tags ?? ''),
    summary: meta.summary ?? '',
    html: marked.parse(body.trim(), { async: false })
  }
}

export function listStudyNotes(): StudyNote[] {
  return Object.entries(files)
    .map(([path, raw]) => parseNote(path, raw))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getStudyNote(slug: string): StudyNote | undefined {
  return listStudyNotes().find((note) => note.slug === slug)
}
