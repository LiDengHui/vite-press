import mathjax3 from 'markdown-it-mathjax3';

const adaptor = globalThis.MathJax.startup.adaptor;

export const mathjaxStyles = adaptor.textContent(globalThis.MathJax.svgStylesheet());

function renderMath(content: string, display = false) {
    const node = globalThis.MathJax.tex2svg(content, { display });
    return adaptor.outerHTML(node);
}

export default function mathjax(md: any) {
    mathjax3(md);

    md.renderer.rules.math_inline = (tokens: any[], idx: number) => {
        return renderMath(tokens[idx].content, false);
    };

    md.renderer.rules.math_block = (tokens: any[], idx: number) => {
        return renderMath(tokens[idx].content, true);
    };
}
