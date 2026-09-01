import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { optimizeAssets } from './optimize-assets.js'

const originalCwd = process.cwd()
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'awesome-optimize-assets-'))
const assetsDirectory = join(temporaryDirectory, 'data/assets')
const mixedPaintsPath = join(assetsDirectory, 'mixed-paints.svg')
const singlePaintPath = join(assetsDirectory, 'single-paint.svg')

try {
  mkdirSync(assetsDirectory, { recursive: true })
  writeFileSync(mixedPaintsPath, '<svg xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="#1c1f33"/><path fill="none" stroke="#E5C158" d="M1 1h30"/></svg>')
  writeFileSync(singlePaintPath, '<svg xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="#123456"/><path fill="none" stroke="#123456" d="M1 1h30"/></svg>')
  process.chdir(temporaryDirectory)

  await optimizeAssets()

  const singlePaintSvg = readFileSync(singlePaintPath, 'utf8')
  assert.match(singlePaintSvg, /fill="currentColor"/)
  assert.match(singlePaintSvg, /stroke="currentColor"/)

  const mixedPaintsSvg = readFileSync(mixedPaintsPath, 'utf8')
  assert.match(mixedPaintsSvg, /fill="#1c1f33"/)
  assert.doesNotMatch(mixedPaintsSvg, /currentColor/i)
}
finally {
  process.chdir(originalCwd)
  rmSync(temporaryDirectory, { recursive: true, force: true })
}
