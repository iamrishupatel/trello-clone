import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess({
			style: 'scss',
		}),
		preprocess({
			postcss: true,
		}),
	],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$lib: 'src/lib',
			$components: 'src/lib/components',
			$sass: 'src/lib/sass',
			$types: 'src/lib/types',
			$helpers: 'src/lib/helpers',
			$enums: 'src/lib/enums',
			$utils: 'src/lib/utils',
			$constants: 'src/lib/constants',
			$validations: 'src/lib/validations',
			$store: 'src/lib/store',
			$api: 'src/lib/api',
			$factories: 'src/lib/factories',
			$transformers: 'src/lib/transformers',
		},
	},
};

export default config;
