import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

import { viteStaticCopy } from 'vite-plugin-static-copy';

// Middleware для редиректа /static/* на /* в dev режиме
function staticRedirectPlugin(): Plugin {
	return {
		name: 'static-redirect',
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				if (req.url?.startsWith('/static/')) {
					req.url = req.url.replace('/static/', '/');
				}
				next();
			});
		}
	};
}

export default defineConfig({
	plugins: [
		staticRedirectPlugin(),
		sveltekit(),
		viteStaticCopy({
			targets: [
				{
					src: 'node_modules/onnxruntime-web/dist/*.jsep.*',
					dest: 'wasm'
				},
				{
					src: 'static/sw.js',
					dest: ''
				}
			]
		})
	],
	define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version),
		APP_BUILD_HASH: JSON.stringify(process.env.APP_BUILD_HASH || 'dev-build')
	},
	build: {
		sourcemap: true
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				secure: false
			},
			'/ollama': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				secure: false
			},
			'/openai': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				secure: false
			}
		}
	},
	worker: {
		format: 'es'
	},
	esbuild: {
		pure: process.env.ENV === 'dev' ? [] : ['console.log', 'console.debug', 'console.error']
	}
});
