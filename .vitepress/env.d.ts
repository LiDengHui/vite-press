/// <reference types="vite/client" />

declare module '*.css' {}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, unknown>;
    export default component;
}

declare module 'markdown-it-task-checkbox' {
    import type MarkdownIt from 'markdown-it';
    function plugin(md: MarkdownIt): void;
    export default plugin;
}

interface MathJaxAdaptor {
    textContent(node: unknown): string;
    outerHTML(node: unknown): string;
}

interface MathJaxGlobal {
    startup: {
        adaptor: MathJaxAdaptor;
    };
    svgStylesheet(): unknown;
    tex2svg(content: string, options: { display: boolean }): unknown;
}

declare global {
    const MathJax: MathJaxGlobal;
}

declare module '*.data' {
    const data: unknown;
    export { data };
}
