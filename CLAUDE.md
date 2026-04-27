# Repository Guidelines

## Essential Commands

### Development Workflow
- `cd src && pnpm install` - Install dependencies (project uses pnpm)
- `cd src && pnpm run build` - Build the project (validates data, optimizes SVGs, generates markdown files and distribution JSONs, and updates README.md)
- `cd src && pnpm run lint` - Check for linting issues
- `cd src && pnpm run lint:fix` - Automatically fix linting issues
- `cd src && pnpm run typecheck` - Run TypeScript type checking

### Testing
- No dedicated test command is configured.
- After making changes, always run `cd src && pnpm run lint` and make sure it passes.
- For changes to data, build scripts, assets, or generated outputs, also run `cd src && pnpm run build`.
- For changes to TypeScript, also run `cd src && pnpm run typecheck`.

## Architecture & Structure

This is a curated collection of Nimiq ecosystem projects with an automated build system that generates documentation and distribution files.

### Key Components

**Data Sources (`src/data/`):**
- `nimiq-apps.json` - Apps/wallets/games in the Nimiq ecosystem
- `archive/nimiq-apps.archive.json` - Archived app entries used for the archive distribution
- `nimiq-resources.json` - Developer tools, documentation, and infrastructure
- `nimiq-exchanges.json` - Exchanges supporting Nimiq (auto-fetched from API)
- `nimiq-mini-apps.json` - Mini apps grouped as Nimiq or EVM entries
- `nimiq-explorers.json` - Mainnet and testnet explorers
- `nimiq-rpc-servers.json` - Public mainnet and testnet RPC servers
- `assets/` - Screenshots, logos, and other media files
- `assets/mini-apps/` - Mini app SVG logos
- `assets/exchanges/` - Exchange logos downloaded by the build
- `archive/assets/` - Archived app media
- `dist/` - Generated distribution files with absolute GitHub URLs

**Generated Files:**
- `src/apps.md`, `src/resources.md`, `src/mini-apps.md`, `src/exchanges.md`, `src/explorers.md`, `src/rpc-servers.md` - Generated markdown content
- `README.md` - Auto-updated with content from markdown files using automd markers
- `src/data/dist/*.json` - Generated API distribution files with absolute GitHub raw URLs

**Build Process (`src/scripts/build.ts`):**
1. Validates JSON data using Valibot schemas
2. Fetches exchange data from `https://api.nimiq.dev/api/exchanges`
3. Downloads exchange logos automatically
4. Validates referenced asset paths and mini app submission rules
5. Generates categorized markdown files
6. Creates distribution JSONs with absolute GitHub URLs
7. Optimizes SVG assets using SVGO
8. Updates README.md sections between automd markers
9. Generates table of contents

### Data Structure

**Apps:** Categorized by type (Wallets, Infrastructure, E-commerce, Games, Insights, Promotion, Bots, Miner, Faucet)
**Resources:** Categorized by type (developer-tool, documentation, core, rpc, ui, utils, validator, node, infrastructure)
**Exchanges:** Alphabetically sorted list with logos and descriptions
**Mini Apps:** Categorized by type (`nimiq`, `evm`), kept alphabetically by name in JSON, with featured entries displayed first within each generated category
**Explorers:** Grouped by network (`mainnet`, `testnet`)
**RPC Servers:** Grouped by network (`mainnet`, `testnet`) and displayed with a public-server warning

### Automated Systems

- **GitHub Action** (`.github/workflows/update-apps.yml`): On pushes to `main`, installs dependencies, runs lint, runs lint-fix, builds, and commits generated updates when `src/**` changes
- **PR Validation** (`.github/workflows/validate-pr.yml`): On PRs touching `src/**`, blocks contributor-added mini app `"featured": true`, then runs typecheck, lint, and build
- **Mini App PR Summary** (`.github/workflows/mini-app-pr-summary.yml`): Comments a summary table for changes to `src/data/nimiq-mini-apps.json`
- **Content Synchronization**: README.md is automatically updated with generated content using automd markers
- **Asset Management**: Exchange logos are automatically downloaded and managed
- **SVG Optimization**: Build optimizes SVG assets and may convert single-color fills to `currentColor` except for explicitly excluded files

## Important Notes

- All changes should be made to JSON files in `src/data/`, not to the generated markdown files
- The build system automatically handles README.md updates - do not manually edit automd sections
- Exchange data is automatically fetched from Nimiq's API during build
- Asset paths in JSON should be relative (e.g., `"./assets/logo.svg"`)
- Distribution files contain absolute GitHub URLs for external consumption
- ESLint uses @antfu/eslint-config with TypeScript support
- Mini app entries must be alphabetized by name, use HTTPS URLs, keep descriptions at 200 characters or fewer, and set `featured` to `false` for contributor submissions
- Mini app logos must be SVG files in `src/data/assets/mini-apps/` named `{developer}-{appName}.svg` using lowercase slug formatting
- Use the mini app PR template at `.github/PULL_REQUEST_TEMPLATE/mini-app.md` when adding mini apps
