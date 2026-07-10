import { readFileSync } from 'node:fs'
import process from 'node:process'
import { getMiniAppCategoryErrors } from './mini-app-categories.js'

const miniAppsUrl = new URL('../data/nimiq-mini-apps.json', import.meta.url)
const miniApps = JSON.parse(readFileSync(miniAppsUrl, 'utf8')) as unknown
const errors = getMiniAppCategoryErrors(miniApps)

for (const error of errors)
  console.error(`::error::${error}`)

if (errors.length > 0)
  process.exit(1)

console.log('Mini app categories are valid.')
