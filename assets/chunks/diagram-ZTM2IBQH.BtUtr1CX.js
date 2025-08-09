import{H as e,a$ as t,aD as n,aG as r,aL as i,aN as a,aO as o,aP as s,aR as c,aS as l,aW as u,a_ as d,b1 as f,h as p}from"../app.DSF2ddfr.js";import"./chunk-4KMFLZZN.Bu_nnoIV.js";import"./baseUniq.BqXQhMx-.js";import"./basePickBy.C_hiHc8M.js";import"./clone.CZegHJqa.js";import"./chunk-JEIROHC2.g3nkjEDE.js";import"./chunk-BN7GFLIU.FWcZSzPf.js";import"./chunk-T44TD3VJ.BTMctIE3.js";import"./chunk-KMC2YHZD.XGbd0BGI.js";import"./chunk-WFWHJNB7.D0YhMwaO.js";import"./chunk-WFRQ32O7.CrBHQ4AJ.js";import"./chunk-XRWGC2XP.KdsN5Yqp.js";import{b as m}from"./chunk-353BL4L5.CEHNfFgC.js";import{b as h}from"./mermaid-parser.core.COC1fjE2.js";var g={showLegend:!0,ticks:5,max:null,min:0,graticule:`circle`},_={axes:[],curves:[],options:g},v=structuredClone(_),y=i.radar,b=n(()=>{let t=e({...y,...s().radar});return t},`getConfig`),x=n(()=>v.axes,`getAxes`),S=n(()=>v.curves,`getCurves`),C=n(()=>v.options,`getOptions`),w=n(e=>{v.axes=e.map(e=>({name:e.name,label:e.label??e.name}))},`setAxes`),T=n(e=>{v.curves=e.map(e=>({name:e.name,label:e.label??e.name,entries:E(e.entries)}))},`setCurves`),E=n(e=>{if(e[0].axis==null)return e.map(e=>e.value);let t=x();if(t.length===0)throw Error(`Axes must be populated before curves for reference entries`);return t.map(t=>{let n=e.find(e=>e.axis?.$refText===t.name);if(n===void 0)throw Error(`Missing entry for axis `+t.label);return n.value})},`computeCurveEntries`),D=n(e=>{let t=e.reduce((e,t)=>(e[t.name]=t,e),{});v.options={showLegend:t.showLegend?.value??g.showLegend,ticks:t.ticks?.value??g.ticks,max:t.max?.value??g.max,min:t.min?.value??g.min,graticule:t.graticule?.value??g.graticule}},`setOptions`),O=n(()=>{r(),v=structuredClone(_)},`clear`),k={getAxes:x,getCurves:S,getOptions:C,setAxes:w,setCurves:T,setOptions:D,getConfig:b,clear:O,setAccTitle:t,getAccTitle:o,setDiagramTitle:f,getDiagramTitle:c,getAccDescription:a,setAccDescription:d},A=n(e=>{m(e,k);let{axes:t,curves:n,options:r}=e;k.setAxes(t),k.setCurves(n),k.setOptions(r)},`populate`),j={parse:n(async e=>{let t=await h(`radar`,e);u.debug(t),A(t)},`parse`)},M=n((e,t,n,r)=>{let i=r.db,a=i.getAxes(),o=i.getCurves(),s=i.getOptions(),c=i.getConfig(),l=i.getDiagramTitle(),u=p(t),d=N(u,c),f=s.max??Math.max(...o.map(e=>Math.max(...e.entries))),m=s.min,h=Math.min(c.width,c.height)/2;P(d,a,h,s.ticks,s.graticule),F(d,a,h,c),I(d,a,o,m,f,s.graticule,c),z(d,o,s.showLegend,c),d.append(`text`).attr(`class`,`radarTitle`).text(l).attr(`x`,0).attr(`y`,-c.height/2-c.marginTop)},`draw`),N=n((e,t)=>{let n=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return e.attr(`viewbox`,`0 0 ${n} ${r}`).attr(`width`,n).attr(`height`,r),e.append(`g`).attr(`transform`,`translate(${i.x}, ${i.y})`)},`drawFrame`),P=n((e,t,n,r,i)=>{if(i===`circle`)for(let t=0;t<r;t++){let i=n*(t+1)/r;e.append(`circle`).attr(`r`,i).attr(`class`,`radarGraticule`)}else if(i===`polygon`){let i=t.length;for(let a=0;a<r;a++){let o=n*(a+1)/r,s=t.map((e,t)=>{let n=2*t*Math.PI/i-Math.PI/2,r=o*Math.cos(n),a=o*Math.sin(n);return`${r},${a}`}).join(` `);e.append(`polygon`).attr(`points`,s).attr(`class`,`radarGraticule`)}}},`drawGraticule`),F=n((e,t,n,r)=>{let i=t.length;for(let a=0;a<i;a++){let o=t[a].label,s=2*a*Math.PI/i-Math.PI/2;e.append(`line`).attr(`x1`,0).attr(`y1`,0).attr(`x2`,n*r.axisScaleFactor*Math.cos(s)).attr(`y2`,n*r.axisScaleFactor*Math.sin(s)).attr(`class`,`radarAxisLine`),e.append(`text`).text(o).attr(`x`,n*r.axisLabelFactor*Math.cos(s)).attr(`y`,n*r.axisLabelFactor*Math.sin(s)).attr(`class`,`radarAxisLabel`)}},`drawAxes`);function I(e,t,n,r,i,a,o){let s=t.length,c=Math.min(o.width,o.height)/2;n.forEach((t,n)=>{if(t.entries.length!==s)return;let l=t.entries.map((e,t)=>{let n=2*Math.PI*t/s-Math.PI/2,a=L(e,r,i,c),o=a*Math.cos(n),l=a*Math.sin(n);return{x:o,y:l}});a===`circle`?e.append(`path`).attr(`d`,R(l,o.curveTension)).attr(`class`,`radarCurve-${n}`):a===`polygon`&&e.append(`polygon`).attr(`points`,l.map(e=>`${e.x},${e.y}`).join(` `)).attr(`class`,`radarCurve-${n}`)})}n(I,`drawCurves`);function L(e,t,n,r){let i=Math.min(Math.max(e,t),n);return r*(i-t)/(n-t)}n(L,`relativeRadius`);function R(e,t){let n=e.length,r=`M${e[0].x},${e[0].y}`;for(let i=0;i<n;i++){let a=e[(i-1+n)%n],o=e[i],s=e[(i+1)%n],c=e[(i+2)%n],l={x:o.x+(s.x-a.x)*t,y:o.y+(s.y-a.y)*t},u={x:s.x-(c.x-o.x)*t,y:s.y-(c.y-o.y)*t};r+=` C${l.x},${l.y} ${u.x},${u.y} ${s.x},${s.y}`}return`${r} Z`}n(R,`closedRoundCurve`);function z(e,t,n,r){if(!n)return;let i=(r.width/2+r.marginRight)*3/4,a=-(r.height/2+r.marginTop)*3/4;t.forEach((t,n)=>{let r=e.append(`g`).attr(`transform`,`translate(${i}, ${a+n*20})`);r.append(`rect`).attr(`width`,12).attr(`height`,12).attr(`class`,`radarLegendBox-${n}`),r.append(`text`).attr(`x`,16).attr(`y`,0).attr(`class`,`radarLegendText`).text(t.label)})}n(z,`drawLegend`);var B={draw:M},V=n((e,t)=>{let n=``;for(let r=0;r<e.THEME_COLOR_LIMIT;r++){let i=e[`cScale${r}`];n+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
		}
		`}return n},`genIndexStyles`),H=n(t=>{let n=l(),r=s(),i=e(n,r.themeVariables),a=e(i.radar,t);return{themeVariables:i,radarOptions:a}},`buildRadarStyleOptions`),U=n(({radar:e}={})=>{let{themeVariables:t,radarOptions:n}=H(e);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${n.axisColor};
		stroke-width: ${n.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${n.axisLabelFontSize}px;
		color: ${n.axisColor};
	}
	.radarGraticule {
		fill: ${n.graticuleColor};
		fill-opacity: ${n.graticuleOpacity};
		stroke: ${n.graticuleColor};
		stroke-width: ${n.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${n.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${V(t,n)}
	`},`styles`),W={parser:j,db:k,renderer:B,styles:U};export{W as diagram};