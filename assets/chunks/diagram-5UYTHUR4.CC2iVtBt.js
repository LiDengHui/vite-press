import{H as e,a$ as t,aD as n,aG as r,aJ as i,aL as a,aN as o,aO as s,aP as c,aR as l,aW as u,a_ as d,b1 as f,h as p}from"../app.DSF2ddfr.js";import"./chunk-4KMFLZZN.Bu_nnoIV.js";import"./baseUniq.BqXQhMx-.js";import"./basePickBy.C_hiHc8M.js";import"./clone.CZegHJqa.js";import"./chunk-JEIROHC2.g3nkjEDE.js";import"./chunk-BN7GFLIU.FWcZSzPf.js";import"./chunk-T44TD3VJ.BTMctIE3.js";import"./chunk-KMC2YHZD.XGbd0BGI.js";import"./chunk-WFWHJNB7.D0YhMwaO.js";import"./chunk-WFRQ32O7.CrBHQ4AJ.js";import"./chunk-XRWGC2XP.KdsN5Yqp.js";import{b as m}from"./chunk-353BL4L5.CEHNfFgC.js";import{b as h}from"./mermaid-parser.core.COC1fjE2.js";var g={packet:[]},_=structuredClone(g),v=a.packet,y=n(()=>{let t=e({...v,...c().packet});return t.showBits&&(t.paddingY+=10),t},`getConfig`),b=n(()=>_.packet,`getPacket`),x=n(e=>{e.length>0&&_.packet.push(e)},`pushWord`),S=n(()=>{r(),_=structuredClone(g)},`clear`),C={pushWord:x,getPacket:b,getConfig:y,clear:S,setAccTitle:t,getAccTitle:s,setDiagramTitle:f,getDiagramTitle:l,getAccDescription:o,setAccDescription:d},w=1e4,T=n(e=>{m(e,C);let t=-1,n=[],r=1,{bitsPerRow:i}=C.getConfig();for(let{start:a,end:o,bits:s,label:c}of e.blocks){if(a!==void 0&&o!==void 0&&o<a)throw Error(`Packet block ${a} - ${o} is invalid. End must be greater than start.`);if(a??=t+1,a!==t+1)throw Error(`Packet block ${a} - ${o??a} is not contiguous. It should start from ${t+1}.`);if(s===0)throw Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(o??=a+(s??1)-1,s??=o-a+1,t=o,u.debug(`Packet block ${a} - ${t} with label ${c}`);n.length<=i+1&&C.getPacket().length<w;){let[e,t]=E({start:a,end:o,bits:s,label:c},r,i);if(n.push(e),e.end+1===r*i&&(C.pushWord(n),n=[],r++),!t)break;({start:a,end:o,bits:s,label:c}=t)}}C.pushWord(n)},`populate`),E=n((e,t,n)=>{if(e.start===void 0)throw Error(`start should have been set during first phase`);if(e.end===void 0)throw Error(`end should have been set during first phase`);if(e.start>e.end)throw Error(`Block start ${e.start} is greater than block end ${e.end}.`);if(e.end+1<=t*n)return[e,void 0];let r=t*n-1,i=t*n;return[{start:e.start,end:r,label:e.label,bits:r-e.start},{start:i,end:e.end,label:e.label,bits:e.end-i}]},`getNextFittingBlock`),D={parse:n(async e=>{let t=await h(`packet`,e);u.debug(t),T(t)},`parse`)},O=n((e,t,n,r)=>{let a=r.db,o=a.getConfig(),{rowHeight:s,paddingY:c,bitWidth:l,bitsPerRow:u}=o,d=a.getPacket(),f=a.getDiagramTitle(),m=s+c,h=m*(d.length+1)-(f?0:s),g=l*u+2,_=p(t);_.attr(`viewbox`,`0 0 ${g} ${h}`),i(_,h,g,o.useMaxWidth);for(let[e,t]of d.entries())k(_,t,e,o);_.append(`text`).text(f).attr(`x`,g/2).attr(`y`,h-m/2).attr(`dominant-baseline`,`middle`).attr(`text-anchor`,`middle`).attr(`class`,`packetTitle`)},`draw`),k=n((e,t,n,{rowHeight:r,paddingX:i,paddingY:a,bitWidth:o,bitsPerRow:s,showBits:c})=>{let l=e.append(`g`),u=n*(r+a)+a;for(let e of t){let t=e.start%s*o+1,n=(e.end-e.start+1)*o-i;if(l.append(`rect`).attr(`x`,t).attr(`y`,u).attr(`width`,n).attr(`height`,r).attr(`class`,`packetBlock`),l.append(`text`).attr(`x`,t+n/2).attr(`y`,u+r/2).attr(`class`,`packetLabel`).attr(`dominant-baseline`,`middle`).attr(`text-anchor`,`middle`).text(e.label),!c)continue;let a=e.end===e.start,d=u-2;l.append(`text`).attr(`x`,t+(a?n/2:0)).attr(`y`,d).attr(`class`,`packetByte start`).attr(`dominant-baseline`,`auto`).attr(`text-anchor`,a?`middle`:`start`).text(e.start),a||l.append(`text`).attr(`x`,t+n).attr(`y`,d).attr(`class`,`packetByte end`).attr(`dominant-baseline`,`auto`).attr(`text-anchor`,`end`).text(e.end)}},`drawWord`),A={draw:O},j={byteFontSize:`10px`,startByteColor:`black`,endByteColor:`black`,labelColor:`black`,labelFontSize:`12px`,titleColor:`black`,titleFontSize:`14px`,blockStrokeColor:`black`,blockStrokeWidth:`1`,blockFillColor:`#efefef`},M=n(({packet:t}={})=>{let n=e(j,t);return`
	.packetByte {
		font-size: ${n.byteFontSize};
	}
	.packetByte.start {
		fill: ${n.startByteColor};
	}
	.packetByte.end {
		fill: ${n.endByteColor};
	}
	.packetLabel {
		fill: ${n.labelColor};
		font-size: ${n.labelFontSize};
	}
	.packetTitle {
		fill: ${n.titleColor};
		font-size: ${n.titleFontSize};
	}
	.packetBlock {
		stroke: ${n.blockStrokeColor};
		stroke-width: ${n.blockStrokeWidth};
		fill: ${n.blockFillColor};
	}
	`},`styles`),N={parser:D,db:C,renderer:A,styles:M};export{N as diagram};