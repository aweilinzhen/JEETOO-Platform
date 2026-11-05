import source from './androidSdkApi.md?raw'

export type MarkdownBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; value: string }
  | { type: 'table'; rows: string[][] }
  | { type: 'list'; ordered: boolean; items: string[] }

export type ApiDocNode = {
  id: string
  number: string
  title: string
  level: number
  blocks: MarkdownBlock[]
  children: ApiDocNode[]
}

function parseBlocks(lines: string[]): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  let index = 0
  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) { index += 1; continue }

    const fence = line.match(/^```([^`]*)$/)
    if (fence) {
      const code: string[] = []
      index += 1
      while (index < lines.length && !/^```\s*$/.test(lines[index])) code.push(lines[index++])
      if (index < lines.length) index += 1
      blocks.push({ type: 'code', language: fence[1].trim(), value: code.join('\n') })
      continue
    }

    if (line.trimStart().startsWith('|')) {
      const tableLines: string[] = []
      while (index < lines.length && lines[index].trimStart().startsWith('|')) tableLines.push(lines[index++])
      const rows = tableLines
        .filter((row) => !/^\s*\|?\s*:?-{3,}/.test(row))
        .map((row) => row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()))
      if (rows.length) blocks.push({ type: 'table', rows })
      continue
    }

    const listMatch = line.match(/^\s*(?:(\d+)\.|[-*])\s+(.*)$/)
    if (listMatch) {
      const ordered = Boolean(listMatch[1])
      const items: string[] = []
      while (index < lines.length) {
        const match = lines[index].match(/^\s*(?:(\d+)\.|[-*])\s+(.*)$/)
        if (!match || Boolean(match[1]) !== ordered) break
        items.push(match[2])
        index += 1
      }
      blocks.push({ type: 'list', ordered, items })
      continue
    }

    const paragraph = [line]
    index += 1
    while (index < lines.length && lines[index].trim() && !/^```/.test(lines[index]) && !lines[index].trimStart().startsWith('|') && !/^\s*(?:(\d+)\.|[-*])\s+/.test(lines[index]) && !/^#{1,6}\s/.test(lines[index])) {
      paragraph.push(lines[index++])
    }
    blocks.push({ type: 'paragraph', text: paragraph.join('\n') })
  }
  return blocks
}

export function cleanMarkdownLabel(raw: string) {
  return raw
    .replace(/\\([\\.\-_+()])/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .trim()
}

function getNumber(title: string) {
  return title.match(/^(\d+(?:\.\d+)?)/)?.[1] ?? ''
}

export function parseApiMarkdown(markdown: string): ApiDocNode[] {
  const roots: ApiDocNode[] = []
  let current: ApiDocNode | undefined
  let currentChild: ApiDocNode | undefined
  let blockLines: string[] = []
  const flush = () => {
    if (!blockLines.length) return
    const target = currentChild ?? current
    if (target) target.blocks.push(...parseBlocks(blockLines))
    blockLines = []
  }

  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      flush()
      const level = heading[1].length
      const title = cleanMarkdownLabel(heading[2])
      if (level === 1) {
        const number = getNumber(title)
        if (!number) {
          current = undefined
          currentChild = undefined
          continue
        }
        current = { id: number, number, title, level, blocks: [], children: [] }
        roots.push(current)
        currentChild = undefined
      } else if (level === 2 && current) {
        currentChild = { id: getNumber(title) || `${current.id}-${current.children.length + 1}`, number: getNumber(title), title, level, blocks: [], children: [] }
        current.children.push(currentChild)
      } else if (current) {
        blockLines.push(line)
      }
      continue
    }
    blockLines.push(line)
  }
  flush()
  return roots
}

export const apiDocs = parseApiMarkdown(source)
