import { resolve, join } from 'path'
import * as fs from 'fs'
import Handlebars from 'handlebars'

export function transformHTMLTemplate(path: string, replacements: any) {
  const __dirname = resolve()
  const filePath = join(__dirname, path)
  const source = fs.readFileSync(filePath, 'utf-8').toString()

  const template = Handlebars.compile(source)
  const htmlToSend = template(replacements)

  return htmlToSend
}
