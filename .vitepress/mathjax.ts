import mathjax3 from 'markdown-it-mathjax3';
import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

const adaptor = MathJax.startup.adaptor;

export const mathjaxStyles = adaptor.textContent(MathJax.svgStylesheet());

function renderMath(content: string, display = false): string {
    const node = MathJax.tex2svg(content, { display });
    return adaptor.outerHTML(node);
}

export default function mathjax(md: MarkdownIt) {
    mathjax3(md);

    md.renderer.rules.math_inline = (tokens: Token[], idx: number) => {
        return renderMath(tokens[idx].content, false);
    };

    md.renderer.rules.math_block = (tokens: Token[], idx: number) => {
        return renderMath(tokens[idx].content, true);
    };
}
