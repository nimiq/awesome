import assert from 'node:assert/strict'
import { safeParse } from 'valibot'

const expectedCategories = [
  'defi',
  'exchanges',
  'games',
  'marketplaces',
  'nfts',
  'social',
  'utilities',
  'wallets',
]

let categoryModule: typeof import('./mini-app-categories.js') | undefined

try {
  categoryModule = await import('./mini-app-categories.js')
}
catch {
  assert.fail('mini-app category validation module should exist')
}

assert.deepEqual(categoryModule.MINI_APP_CATEGORIES, expectedCategories)
assert.deepEqual(categoryModule.MINI_APP_CATEGORY_LABELS, {
  defi: 'DeFi',
  exchanges: 'Exchanges',
  games: 'Games',
  marketplaces: 'Marketplaces',
  nfts: 'NFTs',
  social: 'Social',
  utilities: 'Utilities',
  wallets: 'Wallets',
})

assert.equal(typeof categoryModule.getMiniAppCategoryErrors, 'function')

assert.deepEqual(categoryModule.getMiniAppCategoryErrors([
  { name: 'Nimtris', category: 'games' },
  { name: 'OpenSea', category: 'nfts' },
]), [])

assert.deepEqual(categoryModule.getMiniAppCategoryErrors([
  { name: 'Nimtris' },
]), [
  '[Nimtris] Category is required. Choose one of: defi, exchanges, games, marketplaces, nfts, social, utilities, wallets.',
])

assert.deepEqual(categoryModule.getMiniAppCategoryErrors([
  { name: 'OpenSea', category: 'art' },
]), [
  '[OpenSea] Unknown category "art". Choose one of: defi, exchanges, games, marketplaces, nfts, social, utilities, wallets.',
])

assert.deepEqual(categoryModule.getMiniAppCategoryErrors([
  { name: 'OpenSea', category: ['nfts'] },
]), [
  '[OpenSea] Category must be a string. Choose one of: defi, exchanges, games, marketplaces, nfts, social, utilities, wallets.',
])

assert.deepEqual(categoryModule.getMiniAppCategoryErrors({}), [
  'Mini apps data must be an array.',
])

assert.ok(categoryModule.MiniAppCategorySchema, 'mini-app category schema should exist')
assert.equal(safeParse(categoryModule.MiniAppCategorySchema, 'social').success, true)
assert.equal(safeParse(categoryModule.MiniAppCategorySchema, 'art').success, false)
assert.equal(safeParse(categoryModule.MiniAppCategorySchema, ['nfts']).success, false)
