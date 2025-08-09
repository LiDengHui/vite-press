import{b as e}from"./arc.CLtAnA8m.js";import{H as t,M as n,a$ as r,aD as i,aG as a,aJ as o,aL as s,aN as c,aO as l,aQ as u,aR as d,aW as f,a_ as p,b1 as m,be as h,bs as g,bt as _,bv as v,h as y}from"../app.DSF2ddfr.js";import"./chunk-4KMFLZZN.Bu_nnoIV.js";import"./baseUniq.BqXQhMx-.js";import"./basePickBy.C_hiHc8M.js";import"./clone.CZegHJqa.js";import"./chunk-JEIROHC2.g3nkjEDE.js";import"./chunk-BN7GFLIU.FWcZSzPf.js";import"./chunk-T44TD3VJ.BTMctIE3.js";import"./chunk-KMC2YHZD.XGbd0BGI.js";import"./chunk-WFWHJNB7.D0YhMwaO.js";import"./chunk-WFRQ32O7.CrBHQ4AJ.js";import"./chunk-XRWGC2XP.KdsN5Yqp.js";import{b}from"./chunk-353BL4L5.CEHNfFgC.js";import{b as x}from"./mermaid-parser.core.COC1fjE2.js";function S(e,t){return t<e?-1:t>e?1:t>=e?0:NaN}function C(e){return e}function w(){var e=C,t=S,n=null,r=_(0),i=_(g),a=_(0);function o(o){var s,c=(o=h(o)).length,l,u,d=0,f=Array(c),p=Array(c),m=+r.apply(this,arguments),_=Math.min(g,Math.max(-g,i.apply(this,arguments)-m)),v,y=Math.min(Math.abs(_)/c,a.apply(this,arguments)),b=y*(_<0?-1:1),x;for(s=0;s<c;++s)(x=p[f[s]=s]=+e(o[s],s,o))>0&&(d+=x);for(t==null?n!=null&&f.sort(function(e,t){return n(o[e],o[t])}):f.sort(function(e,n){return t(p[e],p[n])}),s=0,u=d?(_-c*b)/d:0;s<c;++s,m=v)l=f[s],x=p[l],v=m+(x>0?x*u:0)+b,p[l]={data:o[l],index:s,value:x,startAngle:m,endAngle:v,padAngle:y};return p}return o.value=function(t){return arguments.length?(e=typeof t==`function`?t:_(+t),o):e},o.sortValues=function(e){return arguments.length?(t=e,n=null,o):t},o.sort=function(e){return arguments.length?(n=e,t=null,o):n},o.startAngle=function(e){return arguments.length?(r=typeof e==`function`?e:_(+e),o):r},o.endAngle=function(e){return arguments.length?(i=typeof e==`function`?e:_(+e),o):i},o.padAngle=function(e){return arguments.length?(a=typeof e==`function`?e:_(+e),o):a},o}var T=s.pie,E={sections:new Map,showData:!1,config:T},D=E.sections,O=E.showData,k=structuredClone(T),A=i(()=>structuredClone(k),`getConfig`),j=i(()=>{D=new Map,O=E.showData,a()},`clear`),M=i(({label:e,value:t})=>{D.has(e)||(D.set(e,t),f.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),N=i(()=>D,`getSections`),P=i(e=>{O=e},`setShowData`),F=i(()=>O,`getShowData`),I={getConfig:A,clear:j,setDiagramTitle:m,getDiagramTitle:d,setAccTitle:r,getAccTitle:l,setAccDescription:p,getAccDescription:c,addSection:M,getSections:N,setShowData:P,getShowData:F},L=i((e,t)=>{b(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),R={parse:i(async e=>{let t=await x(`pie`,e);f.debug(t),L(t,I)},`parse`)},z=i(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,`getStyles`),B=z,V=i(e=>{let t=[...e.entries()].map(e=>({label:e[0],value:e[1]})).sort((e,t)=>t.value-e.value),n=w().value(e=>e.value);return n(t)},`createPieArcs`),H=i((r,i,a,s)=>{f.debug(`rendering pie chart
`+r);let c=s.db,l=u(),d=t(c.getConfig(),l.pie),p=y(i),m=p.append(`g`);m.attr(`transform`,`translate(225,225)`);let{themeVariables:h}=l,[g]=n(h.pieOuterStrokeWidth);g??=2;let _=d.textPosition,b=e().innerRadius(0).outerRadius(185),x=e().innerRadius(185*_).outerRadius(185*_);m.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+g/2).attr(`class`,`pieOuterCircle`);let S=c.getSections(),C=V(S),w=[h.pie1,h.pie2,h.pie3,h.pie4,h.pie5,h.pie6,h.pie7,h.pie8,h.pie9,h.pie10,h.pie11,h.pie12],T=v(w);m.selectAll(`mySlices`).data(C).enter().append(`path`).attr(`d`,b).attr(`fill`,e=>T(e.data.label)).attr(`class`,`pieCircle`);let E=0;S.forEach(e=>{E+=e}),m.selectAll(`mySlices`).data(C).enter().append(`text`).text(e=>(e.data.value/E*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+x.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`),m.append(`text`).text(c.getDiagramTitle()).attr(`x`,0).attr(`y`,-400/2).attr(`class`,`pieTitleText`);let D=m.selectAll(`.legend`).data(T.domain()).enter().append(`g`).attr(`class`,`legend`).attr(`transform`,(e,t)=>{let n=22*T.domain().length/2,r=t*22-n;return`translate(216,`+r+`)`});D.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,T).style(`stroke`,T),D.data(C).append(`text`).attr(`x`,22).attr(`y`,14).text(e=>{let{label:t,value:n}=e.data;return c.getShowData()?`${t} [${n}]`:t});let O=Math.max(...D.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),k=512+O;p.attr(`viewBox`,`0 0 ${k} 450`),o(p,450,k,d.useMaxWidth)},`draw`),U={draw:H},W={parser:R,db:I,renderer:U,styles:B};export{W as diagram};