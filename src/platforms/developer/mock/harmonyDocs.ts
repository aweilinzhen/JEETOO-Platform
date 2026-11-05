import source from './harmonySdkApi.md?raw'
import { parseApiMarkdown } from './apiDocs'

export const harmonyDocs = parseApiMarkdown(source)
