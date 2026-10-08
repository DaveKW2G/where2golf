import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import ts from 'typescript'
const app = path.resolve('app')
const excluded = new Set(['/filters', '/results', '/map', '/region'])
const pages = new Set()
async function scan(directory, segments = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('_') || entry.name.startsWith('@') || entry.name.includes('[')) continue
      await scan(path.join(directory, entry.name), entry.name.startsWith('(') ? segments : [...segments, entry.name])
    } else if (/^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      const route = '/' + segments.join('/')
      if (excluded.has(route)) continue
      const source = await readFile(path.join(directory, entry.name), 'utf8')
      const tree = ts.createSourceFile(entry.name, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      let skip = false
      let canonical
      function visit(node) {
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && ['redirect', 'permanentRedirect'].includes(node.expression.text)) skip = true
        if (ts.isPropertyAssignment(node)) {
          const name = node.name.getText(tree).replace(/['"]/g, '')
          if (name === 'index' && node.initializer.kind === ts.SyntaxKind.FalseKeyword) skip = true
          if (name === 'canonical' && ts.isStringLiteralLike(node.initializer)) canonical = node.initializer.text
        }
        ts.forEachChild(node, visit)
      }
      visit(tree)
      if (canonical && new URL(canonical, 'https://guestplaygolf.com').pathname !== route) skip = true
      if (!skip) pages.add(route)
    }
  }
}
await scan(app)
const regionSource = await readFile(path.join(app, 'switzerland/[region]/page.tsx'), 'utf8')
const regionBlock = regionSource.match(/const regionNames[^=]*=\s*\{([\s\S]*?)\n\}/)?.[1]
if (!regionBlock) throw new Error('Could not discover Switzerland regions')
for (const match of regionBlock.matchAll(/^\s*([A-Z]{2}):/gm)) pages.add('/switzerland/' + match[1].toLowerCase())
await writeFile('app/sitemap-pages.json', JSON.stringify([...pages].sort(), null, 2) + '\n')
console.log(`Discovered ${pages.size} public sitemap pages`)
