import assert from 'node:assert/strict'
import { safeParse } from 'valibot'

const expectedCategories = [
  'Games',
  'Social',
  'Earning',
  'Marketplaces',
  'Productivity',
  'Creator tools',
  'Education',
  'Health & fitness',
  'Food & dining',
  'Shopping & deals',
  'Lifestyle',
]

let categoryModule: typeof import('./mini-app-categories.js') | undefined

try {
  categoryModule = await import('./mini-app-categories.js')
}
catch {
  assert.fail('mini-app category validation module should exist')
}

assert.deepEqual(categoryModule.MINI_APP_CATEGORIES, expectedCategories)

assert.equal(typeof categoryModule.getMiniAppCategoryErrors, 'function')

assert.deepEqual(categoryModule.getMiniAppCategoryErrors([
  { name: 'Nimtris', category: 'Games' },
  { name: 'OpenSea', category: 'Marketplaces' },
]), [])

assert.deepEqual(categoryModule.getMiniAppCategoryErrors([
  { name: 'Nimtris' },
]), [
  '[Nimtris] Category is required. Choose one of: Games, Social, Earning, Marketplaces, Productivity, Creator tools, Education, Health & fitness, Food & dining, Shopping & deals, Lifestyle.',
])

assert.deepEqual(categoryModule.getMiniAppCategoryErrors([
  { name: 'OpenSea', category: 'art' },
]), [
  '[OpenSea] Unknown category "art". Choose one of: Games, Social, Earning, Marketplaces, Productivity, Creator tools, Education, Health & fitness, Food & dining, Shopping & deals, Lifestyle.',
])

assert.deepEqual(categoryModule.getMiniAppCategoryErrors([
  { name: 'OpenSea', category: ['Marketplaces'] },
]), [
  '[OpenSea] Category must be a string. Choose one of: Games, Social, Earning, Marketplaces, Productivity, Creator tools, Education, Health & fitness, Food & dining, Shopping & deals, Lifestyle.',
])

assert.deepEqual(categoryModule.getMiniAppCategoryErrors({}), [
  'Mini apps data must be an array.',
])

assert.ok(categoryModule.MiniAppCategorySchema, 'mini-app category schema should exist')
assert.equal(safeParse(categoryModule.MiniAppCategorySchema, 'Social').success, true)
assert.equal(safeParse(categoryModule.MiniAppCategorySchema, 'art').success, false)
assert.equal(safeParse(categoryModule.MiniAppCategorySchema, ['Marketplaces']).success, false)
