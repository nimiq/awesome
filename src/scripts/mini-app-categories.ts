import { picklist } from 'valibot'

export const MINI_APP_CATEGORIES = [
  'defi',
  'exchanges',
  'games',
  'marketplaces',
  'nfts',
  'social',
  'utilities',
  'wallets',
] as const

export type MiniAppCategory = (typeof MINI_APP_CATEGORIES)[number]
export const MiniAppCategorySchema = picklist(MINI_APP_CATEGORIES)
export const MINI_APP_CATEGORY_LABELS: Record<MiniAppCategory, string> = {
  defi: 'DeFi',
  exchanges: 'Exchanges',
  games: 'Games',
  marketplaces: 'Marketplaces',
  nfts: 'NFTs',
  social: 'Social',
  utilities: 'Utilities',
  wallets: 'Wallets',
}

const categoryList = MINI_APP_CATEGORIES.join(', ')

export function getMiniAppCategoryErrors(entries: unknown): string[] {
  if (!Array.isArray(entries))
    return ['Mini apps data must be an array.']

  return entries.flatMap((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry))
      return [`[Mini app #${index + 1}] Entry must be an object.`]

    const record = entry as Record<string, unknown>
    const name = typeof record.name === 'string' && record.name.trim()
      ? record.name.trim()
      : `Mini app #${index + 1}`
    const category = record.category

    if (category === undefined || category === null || category === '')
      return [`[${name}] Category is required. Choose one of: ${categoryList}.`]

    if (typeof category !== 'string')
      return [`[${name}] Category must be a string. Choose one of: ${categoryList}.`]

    if (!(MINI_APP_CATEGORIES as readonly string[]).includes(category))
      return [`[${name}] Unknown category "${category}". Choose one of: ${categoryList}.`]

    return []
  })
}
