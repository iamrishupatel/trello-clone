# SvelteKit Starter Template

[![Svelte](https://img.shields.io/badge/Svelte-3.54.0-orange)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/SCSS-1.62.1-ff69b4)](https://sass-lang.com/)
[![Playwright](https://img.shields.io/badge/Playwright-1.28.1-yellowgreen)](https://playwright.dev/)
[![Vite](https://img.shields.io/badge/Vite-4.3.0-blueviolet)](https://vitejs.dev/)
[![vitest](https://img.shields.io/badge/test_with-vitest-blue.svg?style=flat-square)](https://github.com/vitest/vitest)
[![Husky](https://img.shields.io/badge/Husky-8.0.3-blue)](https://typicode.github.io/husky/#/)
[![ESLint](https://img.shields.io/badge/ESLint-8.28.0-blue)](https://eslint.org/)
[![Stylelint](https://img.shields.io/badge/Stylelint-15.6.1-orange)](https://stylelint.io/)
[![Prettier](https://img.shields.io/badge/Prettier-2.8.0-ff69b4)](https://prettier.io/)

This is a SvelteKit starter template for building web-apps that comes with:

- TypeScript and SCSS support
- Vite
- Vitest and Vitest UI
- Playwright for E2E testing
- Husky for Git hooks
- Stylelint and ESLint for linting

## Available Scripts

- `dev`: Start development server
- `build`: Build the app
- `preview`: Preview the built app
- `check`: Run svelte-check and TypeScript compiler
- `check:watch`: Run check script in watch mode
- `test:e2e`: Run Playwright tests
- `test:unit`: Run vitest unit tests
- `test:unit:once`: Run test:unit once
- `test:unit:ui`: Run test:unit in UI mode
- `format`: Run Prettier
- `lint`: Run ESLint on .ts and .tsx files
- `lint:styles`: Run Stylelint on .svelte and .scss files
- `lint:fix`: Run Prettier, ESLint and Stylelint in fix mode
- `lint-staged`: Run lint-staged on staged file

## Getting Started

To get started, clone this repository and install the dependencies:

```bash
git clone https://github.com/your-username/sveltekit-starter-template.git
cd sveltekit-starter-template
pnpm install
```

## Developing

Once you've created a project and installed dependencies with `pnpm install` (or `npm install` or `yarn`), start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

> Of course, feel free to modify and expand upon this README.md as needed for your specific p

Everything you need to build a Svelte project.

## Licence

[MIT](https://github.com/rlabs-digital/sveltekit-starter-base-template/blob/main/LICENSE)
