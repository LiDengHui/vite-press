import { Plugin } from 'vitepress';

/// <reference types="" />
export default function drawioPlugin() {
    return {
        name: 'vitepress-drawio',
        enforce: 'pre',
        transform(code, id) {
            if (id.endsWith('.drawio')) {
                return `export default ${JSON.stringify(code)}`;
            }
        },
    };
}
