import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { writeFileSync, mkdirSync, existsSync, copyFileSync, readFileSync } from 'fs';
import { dirname } from 'path';

// Custom plugin to handle HTML files
function chromeExtensionHtml() {
    return {
        name: 'chrome-extension-html-fix',
        closeBundle: () => {
            // Ensure output directories exist
            const popupDir = resolve(__dirname, 'dist/popup');
            const optionsDir = resolve(__dirname, 'dist/options');

            if (!existsSync(popupDir)) {
                mkdirSync(popupDir, { recursive: true });
            }
            if (!existsSync(optionsDir)) {
                mkdirSync(optionsDir, { recursive: true });
            }

            // Copy and fix HTML files
            try {
                // Fix popup HTML
                const popupHtmlPath = resolve(__dirname, 'dist/src/popup/index.html');
                const popupHtmlContent = readFileSync(popupHtmlPath, 'utf8');

                // Replace relative paths with paths that work in Chrome extensions
                const fixedPopupHtml = popupHtmlContent
                    .replace(/src="\.\.\/\.\.\/assets\//g, 'src="../assets/')
                    .replace(/href="\.\.\/\.\.\/assets\//g, 'href="../assets/');

                writeFileSync(
                    resolve(__dirname, 'dist/popup/index.html'),
                    fixedPopupHtml
                );
                console.log('Fixed and copied popup HTML');

                // Fix options HTML
                const optionsHtmlPath = resolve(__dirname, 'dist/src/options/index.html');
                const optionsHtmlContent = readFileSync(optionsHtmlPath, 'utf8');

                // Replace relative paths with paths that work in Chrome extensions
                const fixedOptionsHtml = optionsHtmlContent
                    .replace(/src="\.\.\/\.\.\/assets\//g, 'src="../assets/')
                    .replace(/href="\.\.\/\.\.\/assets\//g, 'href="../assets/');

                writeFileSync(
                    resolve(__dirname, 'dist/options/index.html'),
                    fixedOptionsHtml
                );
                console.log('Fixed and copied options HTML');
            } catch (error) {
                console.error('Error processing HTML files:', error);
            }
        }
    };
}

export default defineConfig({
    plugins: [
        react(),
        chromeExtensionHtml()
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/popup/index.html'),
                options: resolve(__dirname, 'src/options/index.html'),
                background: resolve(__dirname, 'src/background/index.ts'),
                content: resolve(__dirname, 'src/content/index.ts'),
            },
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
        assetsInlineLimit: 0,
        minify: true,
        copyPublicDir: false,
    },
    base: './',
}); 