import{b as e}from"./arc.Dqe8ZG59.js";import{a$ as t,aD as n,aG as r,aJ as i,aN as a,aO as o,aQ as s,aR as c,a_ as l,b1 as u,bJ as d}from"../app.CFsT-BMU.js";import{b as f}from"./chunk-E2GYISFI.C_QWR9kO.js";import{b as p,e as m,f as h,g}from"./chunk-67H74DCK._pUcGru7.js";var _=function(){var e=n(function(e,t,n,r){for(n||={},r=e.length;r--;n[e[r]]=t);return n},`o`),t=[6,8,10,11,12,14,16,17,18],r=[1,9],i=[1,10],a=[1,11],o=[1,12],s=[1,13],c=[1,14],l={trace:n(function(){},`trace`),yy:{},symbols_:{error:2,start:3,journey:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,title:11,acc_title:12,acc_title_value:13,acc_descr:14,acc_descr_value:15,acc_descr_multiline_value:16,section:17,taskName:18,taskData:19,$accept:0,$end:1},terminals_:{2:`error`,4:`journey`,6:`EOF`,8:`SPACE`,10:`NEWLINE`,11:`title`,12:`acc_title`,13:`acc_title_value`,14:`acc_descr`,15:`acc_descr_value`,16:`acc_descr_multiline_value`,17:`section`,18:`taskName`,19:`taskData`},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,2]],performAction:n(function(e,t,n,r,i,a,o){var s=a.length-1;switch(i){case 1:return a[s-1];case 2:this.$=[];break;case 3:a[s-1].push(a[s]),this.$=a[s-1];break;case 4:case 5:this.$=a[s];break;case 6:case 7:this.$=[];break;case 8:r.setDiagramTitle(a[s].substr(6)),this.$=a[s].substr(6);break;case 9:this.$=a[s].trim(),r.setAccTitle(this.$);break;case 10:case 11:this.$=a[s].trim(),r.setAccDescription(this.$);break;case 12:r.addSection(a[s].substr(8)),this.$=a[s].substr(8);break;case 13:r.addTask(a[s-1],a[s]),this.$=`task`;break}},`anonymous`),table:[{3:1,4:[1,2]},{1:[3]},e(t,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:r,12:i,14:a,16:o,17:s,18:c},e(t,[2,7],{1:[2,1]}),e(t,[2,3]),{9:15,11:r,12:i,14:a,16:o,17:s,18:c},e(t,[2,5]),e(t,[2,6]),e(t,[2,8]),{13:[1,16]},{15:[1,17]},e(t,[2,11]),e(t,[2,12]),{19:[1,18]},e(t,[2,4]),e(t,[2,9]),e(t,[2,10]),e(t,[2,13])],defaultActions:{},parseError:n(function(e,t){if(t.recoverable)this.trace(e);else{var n=Error(e);throw n.hash=t,n}},`parseError`),parse:n(function(e){var t=this,r=[0],i=[],a=[null],o=[],s=this.table,c=``,l=0,u=0,d=0,f=2,p=1,m=o.slice.call(arguments,1),h=Object.create(this.lexer),g={yy:{}};for(var _ in this.yy)Object.prototype.hasOwnProperty.call(this.yy,_)&&(g.yy[_]=this.yy[_]);h.setInput(e,g.yy),g.yy.lexer=h,g.yy.parser=this,h.yylloc===void 0&&(h.yylloc={});var v=h.yylloc;o.push(v);var y=h.options&&h.options.ranges;typeof g.yy.parseError==`function`?this.parseError=g.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function b(e){r.length-=2*e,a.length-=e,o.length-=e}n(b,`popStack`);function x(){var e;return e=i.pop()||h.lex()||p,typeof e!=`number`&&(e instanceof Array&&(i=e,e=i.pop()),e=t.symbols_[e]||e),e}n(x,`lex`);for(var S,C,w,T,E,D={},O,k,A,j;;){if(w=r[r.length-1],this.defaultActions[w]?T=this.defaultActions[w]:(S??=x(),T=s[w]&&s[w][S]),T===void 0||!T.length||!T[0]){var M=``;for(O in j=[],s[w])this.terminals_[O]&&O>f&&j.push(`'`+this.terminals_[O]+`'`);M=h.showPosition?`Parse error on line `+(l+1)+`:
`+h.showPosition()+`
Expecting `+j.join(`, `)+`, got '`+(this.terminals_[S]||S)+`'`:`Parse error on line `+(l+1)+`: Unexpected `+(S==p?`end of input`:`'`+(this.terminals_[S]||S)+`'`),this.parseError(M,{text:h.match,token:this.terminals_[S]||S,line:h.yylineno,loc:v,expected:j})}if(T[0]instanceof Array&&T.length>1)throw Error(`Parse Error: multiple actions possible at state: `+w+`, token: `+S);switch(T[0]){case 1:r.push(S),a.push(h.yytext),o.push(h.yylloc),r.push(T[1]),S=null,C?(S=C,C=null):(u=h.yyleng,c=h.yytext,l=h.yylineno,v=h.yylloc,d>0&&d--);break;case 2:if(k=this.productions_[T[1]][1],D.$=a[a.length-k],D._$={first_line:o[o.length-(k||1)].first_line,last_line:o[o.length-1].last_line,first_column:o[o.length-(k||1)].first_column,last_column:o[o.length-1].last_column},y&&(D._$.range=[o[o.length-(k||1)].range[0],o[o.length-1].range[1]]),E=this.performAction.apply(D,[c,u,l,g.yy,T[1],a,o].concat(m)),E!==void 0)return E;k&&(r=r.slice(0,-1*k*2),a=a.slice(0,-1*k),o=o.slice(0,-1*k)),r.push(this.productions_[T[1]][0]),a.push(D.$),o.push(D._$),A=s[r[r.length-2]][r[r.length-1]],r.push(A);break;case 3:return!0}}return!0},`parse`)},u=function(){var e={EOF:1,parseError:n(function(e,t){if(this.yy.parser)this.yy.parser.parseError(e,t);else throw Error(e)},`parseError`),setInput:n(function(e,t){return this.yy=t||this.yy||{},this._input=e,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match=``,this.conditionStack=[`INITIAL`],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},`setInput`),input:n(function(){var e=this._input[0];this.yytext+=e,this.yyleng++,this.offset++,this.match+=e,this.matched+=e;var t=e.match(/(?:\r\n?|\n).*/g);return t?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),e},`input`),unput:n(function(e){var t=e.length,n=e.split(/(?:\r\n?|\n)/g);this._input=e+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-t),this.offset-=t;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-t},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-t]),this.yyleng=this.yytext.length,this},`unput`),more:n(function(){return this._more=!0,this},`more`),reject:n(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError(`Lexical error on line `+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:``,token:null,line:this.yylineno});return this},`reject`),less:n(function(e){this.unput(this.match.slice(e))},`less`),pastInput:n(function(){var e=this.matched.substr(0,this.matched.length-this.match.length);return(e.length>20?`...`:``)+e.substr(-20).replace(/\n/g,``)},`pastInput`),upcomingInput:n(function(){var e=this.match;return e.length<20&&(e+=this._input.substr(0,20-e.length)),(e.substr(0,20)+(e.length>20?`...`:``)).replace(/\n/g,``)},`upcomingInput`),showPosition:n(function(){var e=this.pastInput(),t=Array(e.length+1).join(`-`);return e+this.upcomingInput()+`
`+t+`^`},`showPosition`),test_match:n(function(e,t){var n,r,i;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),r=e[0].match(/(?:\r\n?|\n).*/g),r&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+e[0].length},this.yytext+=e[0],this.match+=e[0],this.matches=e,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(e[0].length),this.matched+=e[0],n=this.performAction.call(this,this.yy,this,t,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n)return n;if(this._backtrack){for(var a in i)this[a]=i[a];return!1}return!1},`test_match`),next:n(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var e,t,n,r;this._more||(this.yytext=``,this.match=``);for(var i=this._currentRules(),a=0;a<i.length;a++)if(n=this._input.match(this.rules[i[a]]),n&&(!t||n[0].length>t[0].length)){if(t=n,r=a,this.options.backtrack_lexer){if(e=this.test_match(n,i[a]),e!==!1)return e;if(this._backtrack){t=!1;continue}else return!1}else if(!this.options.flex)break}return t?(e=this.test_match(t,i[r]),e===!1?!1:e):this._input===``?this.EOF:this.parseError(`Lexical error on line `+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:``,token:null,line:this.yylineno})},`next`),lex:n(function(){var e=this.next();return e||this.lex()},`lex`),begin:n(function(e){this.conditionStack.push(e)},`begin`),popState:n(function(){var e=this.conditionStack.length-1;return e>0?this.conditionStack.pop():this.conditionStack[0]},`popState`),_currentRules:n(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},`_currentRules`),topState:n(function(e){return e=this.conditionStack.length-1-Math.abs(e||0),e>=0?this.conditionStack[e]:`INITIAL`},`topState`),pushState:n(function(e){this.begin(e)},`pushState`),stateStackSize:n(function(){return this.conditionStack.length},`stateStackSize`),options:{"case-insensitive":!0},performAction:n(function(e,t,n,r){switch(n){case 0:break;case 1:break;case 2:return 10;case 3:break;case 4:break;case 5:return 4;case 6:return 11;case 7:return this.begin(`acc_title`),12;case 8:return this.popState(),`acc_title_value`;case 9:return this.begin(`acc_descr`),14;case 10:return this.popState(),`acc_descr_value`;case 11:this.begin(`acc_descr_multiline`);break;case 12:this.popState();break;case 13:return`acc_descr_multiline_value`;case 14:return 17;case 15:return 18;case 16:return 19;case 17:return`:`;case 18:return 6;case 19:return`INVALID`}},`anonymous`),rules:[/^(?:%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:journey\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[12,13],inclusive:!1},acc_descr:{rules:[10],inclusive:!1},acc_title:{rules:[8],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,9,11,14,15,16,17,18,19],inclusive:!0}}};return e}();l.lexer=u;function d(){this.yy={}}return n(d,`Parser`),d.prototype=l,l.Parser=d,new d}();_.parser=_;var v=_,y=``,b=[],x=[],S=[],C=n(function(){b.length=0,x.length=0,y=``,S.length=0,r()},`clear`),w=n(function(e){y=e,b.push(e)},`addSection`),T=n(function(){return b},`getSections`),E=n(function(){let e=A(),t=0;for(;!e&&t<100;)e=A(),t++;return x.push(...S),x},`getTasks`),D=n(function(){let e=[];x.forEach(t=>{t.people&&e.push(...t.people)});let t=new Set(e);return[...t].sort()},`updateActors`),O=n(function(e,t){let n=t.substr(1).split(`:`),r=0,i=[];n.length===1?(r=Number(n[0]),i=[]):(r=Number(n[0]),i=n[1].split(`,`));let a=i.map(e=>e.trim()),o={section:y,type:y,people:a,task:e,score:r};S.push(o)},`addTask`),k=n(function(e){let t={section:y,type:y,description:e,task:e,classes:[]};x.push(t)},`addTaskOrg`),A=n(function(){let e=n(function(e){return S[e].processed},`compileTask`),t=!0;for(let[n,r]of S.entries())e(n),t&&=r.processed;return t},`compileTasks`),j=n(function(){return D()},`getActors`),M={getConfig:n(()=>s().journey,`getConfig`),clear:C,setDiagramTitle:u,getDiagramTitle:c,setAccTitle:t,getAccTitle:o,setAccDescription:l,getAccDescription:a,addSection:w,getSections:T,getTasks:E,addTask:O,addTaskOrg:k,getActors:j},N=n(e=>`.label {
    font-family: ${e.fontFamily};
    color: ${e.textColor};
  }
  .mouth {
    stroke: #666;
  }

  line {
    stroke: ${e.textColor}
  }

  .legend {
    fill: ${e.textColor};
    font-family: ${e.fontFamily};
  }

  .label text {
    fill: #333;
  }
  .label {
    color: ${e.textColor}
  }

  .face {
    ${e.faceColor?`fill: ${e.faceColor}`:`fill: #FFF8DC`};
    stroke: #999;
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${e.mainBkg};
    stroke: ${e.nodeBorder};
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${e.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${e.lineColor};
    stroke-width: 1.5px;
  }

  .flowchart-link {
    stroke: ${e.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${e.edgeLabelBackground};
    rect {
      opacity: 0.5;
    }
    text-align: center;
  }

  .cluster rect {
  }

  .cluster text {
    fill: ${e.titleColor};
  }

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${e.fontFamily};
    font-size: 12px;
    background: ${e.tertiaryColor};
    border: 1px solid ${e.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .task-type-0, .section-type-0  {
    ${e.fillType0?`fill: ${e.fillType0}`:``};
  }
  .task-type-1, .section-type-1  {
    ${e.fillType0?`fill: ${e.fillType1}`:``};
  }
  .task-type-2, .section-type-2  {
    ${e.fillType0?`fill: ${e.fillType2}`:``};
  }
  .task-type-3, .section-type-3  {
    ${e.fillType0?`fill: ${e.fillType3}`:``};
  }
  .task-type-4, .section-type-4  {
    ${e.fillType0?`fill: ${e.fillType4}`:``};
  }
  .task-type-5, .section-type-5  {
    ${e.fillType0?`fill: ${e.fillType5}`:``};
  }
  .task-type-6, .section-type-6  {
    ${e.fillType0?`fill: ${e.fillType6}`:``};
  }
  .task-type-7, .section-type-7  {
    ${e.fillType0?`fill: ${e.fillType7}`:``};
  }

  .actor-0 {
    ${e.actor0?`fill: ${e.actor0}`:``};
  }
  .actor-1 {
    ${e.actor1?`fill: ${e.actor1}`:``};
  }
  .actor-2 {
    ${e.actor2?`fill: ${e.actor2}`:``};
  }
  .actor-3 {
    ${e.actor3?`fill: ${e.actor3}`:``};
  }
  .actor-4 {
    ${e.actor4?`fill: ${e.actor4}`:``};
  }
  .actor-5 {
    ${e.actor5?`fill: ${e.actor5}`:``};
  }
  ${f()}
`,`getStyles`),P=N,F=n(function(e,t){return m(e,t)},`drawRect`),I=n(function(t,r){let i=t.append(`circle`).attr(`cx`,r.cx).attr(`cy`,r.cy).attr(`class`,`face`).attr(`r`,15).attr(`stroke-width`,2).attr(`overflow`,`visible`),a=t.append(`g`);a.append(`circle`).attr(`cx`,r.cx-15/3).attr(`cy`,r.cy-15/3).attr(`r`,1.5).attr(`stroke-width`,2).attr(`fill`,`#666`).attr(`stroke`,`#666`),a.append(`circle`).attr(`cx`,r.cx+15/3).attr(`cy`,r.cy-15/3).attr(`r`,1.5).attr(`stroke-width`,2).attr(`fill`,`#666`).attr(`stroke`,`#666`);function o(t){let n=e().startAngle(Math.PI/2).endAngle(3*(Math.PI/2)).innerRadius(15/2).outerRadius(15/2.2);t.append(`path`).attr(`class`,`mouth`).attr(`d`,n).attr(`transform`,`translate(`+r.cx+`,`+(r.cy+2)+`)`)}n(o,`smile`);function s(t){let n=e().startAngle(3*Math.PI/2).endAngle(5*(Math.PI/2)).innerRadius(15/2).outerRadius(15/2.2);t.append(`path`).attr(`class`,`mouth`).attr(`d`,n).attr(`transform`,`translate(`+r.cx+`,`+(r.cy+7)+`)`)}n(s,`sad`);function c(e){e.append(`line`).attr(`class`,`mouth`).attr(`stroke`,2).attr(`x1`,r.cx-5).attr(`y1`,r.cy+7).attr(`x2`,r.cx+5).attr(`y2`,r.cy+7).attr(`class`,`mouth`).attr(`stroke-width`,`1px`).attr(`stroke`,`#666`)}return n(c,`ambivalent`),r.score>3?o(a):r.score<3?s(a):c(a),i},`drawFace`),L=n(function(e,t){let n=e.append(`circle`);return n.attr(`cx`,t.cx),n.attr(`cy`,t.cy),n.attr(`class`,`actor-`+t.pos),n.attr(`fill`,t.fill),n.attr(`stroke`,t.stroke),n.attr(`r`,t.r),n.class!==void 0&&n.attr(`class`,n.class),t.title!==void 0&&n.append(`title`).text(t.title),n},`drawCircle`),R=n(function(e,t){return h(e,t)},`drawText`),z=n(function(e,t){function r(e,t,n,r,i){return e+`,`+t+` `+(e+n)+`,`+t+` `+(e+n)+`,`+(t+r-i)+` `+(e+n-i*1.2)+`,`+(t+r)+` `+e+`,`+(t+r)}n(r,`genPoints`);let i=e.append(`polygon`);i.attr(`points`,r(t.x,t.y,50,20,7)),i.attr(`class`,`labelBox`),t.y+=t.labelMargin,t.x+=.5*t.labelMargin,R(e,t)},`drawLabel`),B=n(function(e,t,n){let r=e.append(`g`),i=g();i.x=t.x,i.y=t.y,i.fill=t.fill,i.width=n.width*t.taskCount+n.diagramMarginX*(t.taskCount-1),i.height=n.height,i.class=`journey-section section-type-`+t.num,i.rx=3,i.ry=3,F(r,i),U(n)(t.text,r,i.x,i.y,i.width,i.height,{class:`journey-section section-type-`+t.num},n,t.colour)},`drawSection`),V=-1,H=n(function(e,t,n){let r=t.x+n.width/2,i=e.append(`g`);V++,i.append(`line`).attr(`id`,`task`+V).attr(`x1`,r).attr(`y1`,t.y).attr(`x2`,r).attr(`y2`,450).attr(`class`,`task-line`).attr(`stroke-width`,`1px`).attr(`stroke-dasharray`,`4 2`).attr(`stroke`,`#666`),I(i,{cx:r,cy:300+(5-t.score)*30,score:t.score});let a=g();a.x=t.x,a.y=t.y,a.fill=t.fill,a.width=n.width,a.height=n.height,a.class=`task task-type-`+t.num,a.rx=3,a.ry=3,F(i,a);let o=t.x+14;t.people.forEach(e=>{let n=t.actors[e].color,r={cx:o,cy:t.y,r:7,fill:n,stroke:`#000`,title:e,pos:t.actors[e].position};L(i,r),o+=10}),U(n)(t.task,i,a.x,a.y,a.width,a.height,{class:`task`},n,t.colour)},`drawTask`),ee=n(function(e,t){p(e,t)},`drawBackgroundRect`),U=function(){function e(e,t,n,r,a,o,s,c){let l=t.append(`text`).attr(`x`,n+a/2).attr(`y`,r+o/2+5).style(`font-color`,c).style(`text-anchor`,`middle`).text(e);i(l,s)}n(e,`byText`);function t(e,t,n,r,a,o,s,c,l){let{taskFontSize:u,taskFontFamily:d}=c,f=e.split(/<br\s*\/?>/gi);for(let e=0;e<f.length;e++){let c=e*u-u*(f.length-1)/2,p=t.append(`text`).attr(`x`,n+a/2).attr(`y`,r).attr(`fill`,l).style(`text-anchor`,`middle`).style(`font-size`,u).style(`font-family`,d);p.append(`tspan`).attr(`x`,n+a/2).attr(`dy`,c).text(f[e]),p.attr(`y`,r+o/2).attr(`dominant-baseline`,`central`).attr(`alignment-baseline`,`central`),i(p,s)}}n(t,`byTspan`);function r(e,n,r,a,o,s,c,l){let u=n.append(`switch`),d=u.append(`foreignObject`).attr(`x`,r).attr(`y`,a).attr(`width`,o).attr(`height`,s).attr(`position`,`fixed`),f=d.append(`xhtml:div`).style(`display`,`table`).style(`height`,`100%`).style(`width`,`100%`);f.append(`div`).attr(`class`,`label`).style(`display`,`table-cell`).style(`text-align`,`center`).style(`vertical-align`,`middle`).text(e),t(e,u,r,a,o,s,c,l),i(f,c)}n(r,`byFo`);function i(e,t){for(let n in t)n in t&&e.attr(n,t[n])}return n(i,`_setTextAttrs`),function(n){return n.textPlacement===`fo`?r:n.textPlacement===`old`?e:t}}(),te=n(function(e){e.append(`defs`).append(`marker`).attr(`id`,`arrowhead`).attr(`refX`,5).attr(`refY`,2).attr(`markerWidth`,6).attr(`markerHeight`,4).attr(`orient`,`auto`).append(`path`).attr(`d`,`M 0,0 V 4 L6,2 Z`)},`initGraphics`),W={drawRect:F,drawCircle:L,drawSection:B,drawText:R,drawLabel:z,drawTask:H,drawBackgroundRect:ee,initGraphics:te},ne=n(function(e){let t=Object.keys(e);t.forEach(function(t){J[t]=e[t]})},`setConf`),G={},K=0;function q(e){let t=s().journey,n=t.maxLabelWidth;K=0;let r=60;Object.keys(G).forEach(i=>{let a=G[i].color,o={cx:20,cy:r,r:7,fill:a,stroke:`#000`,pos:G[i].position};W.drawCircle(e,o);let s=e.append(`text`).attr(`visibility`,`hidden`).text(i),c=s.node().getBoundingClientRect().width;s.remove();let l=[];if(c<=n)l=[i];else{let t=i.split(` `),r=``;s=e.append(`text`).attr(`visibility`,`hidden`),t.forEach(e=>{let t=r?`${r} ${e}`:e;s.text(t);let i=s.node().getBoundingClientRect().width;if(i>n){if(r&&l.push(r),r=e,s.text(e),s.node().getBoundingClientRect().width>n){let t=``;for(let r of e)t+=r,s.text(t+`-`),s.node().getBoundingClientRect().width>n&&(l.push(t.slice(0,-1)+`-`),t=r);r=t}}else r=t}),r&&l.push(r),s.remove()}l.forEach((n,i)=>{let a={x:40,y:r+7+i*20,fill:`#666`,text:n,textMargin:t.boxTextMargin??5},o=W.drawText(e,a),s=o.node().getBoundingClientRect().width;s>K&&s>t.leftMargin-s&&(K=s)}),r+=Math.max(20,l.length*20)})}n(q,`drawActorLegend`);var J=s().journey,Y=0,re=n(function(e,t,n,r){let a=s(),o=a.journey.titleColor,c=a.journey.titleFontSize,l=a.journey.titleFontFamily,u=a.securityLevel,f;u===`sandbox`&&(f=d(`#i`+t));let p=d(u===`sandbox`?f.nodes()[0].contentDocument.body:`body`);X.init();let m=p.select(`#`+t);W.initGraphics(m);let h=r.db.getTasks(),g=r.db.getDiagramTitle(),_=r.db.getActors();for(let e in G)delete G[e];let v=0;_.forEach(e=>{G[e]={color:J.actorColours[v%J.actorColours.length],position:v},v++}),q(m),Y=J.leftMargin+K,X.insert(0,0,Y,Object.keys(G).length*50),ie(m,h,0);let y=X.getBounds();g&&m.append(`text`).text(g).attr(`x`,Y).attr(`font-size`,c).attr(`font-weight`,`bold`).attr(`y`,25).attr(`fill`,o).attr(`font-family`,l);let b=y.stopy-y.starty+2*J.diagramMarginY,x=Y+y.stopx+2*J.diagramMarginX;i(m,b,x,J.useMaxWidth),m.append(`line`).attr(`x1`,Y).attr(`y1`,J.height*4).attr(`x2`,x-Y-4).attr(`y2`,J.height*4).attr(`stroke-width`,4).attr(`stroke`,`black`).attr(`marker-end`,`url(#arrowhead)`);let S=g?70:0;m.attr(`viewBox`,`${y.startx} -25 ${x} ${b+S}`),m.attr(`preserveAspectRatio`,`xMinYMin meet`),m.attr(`height`,b+S+25)},`draw`),X={data:{startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},verticalPos:0,sequenceItems:[],init:n(function(){this.sequenceItems=[],this.data={startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},this.verticalPos=0},`init`),updateVal:n(function(e,t,n,r){e[t]===void 0?e[t]=n:e[t]=r(n,e[t])},`updateVal`),updateBounds:n(function(e,t,r,i){let a=s().journey,o=this,c=0;function l(s){return n(function(n){c++;let l=o.sequenceItems.length-c+1;o.updateVal(n,`starty`,t-l*a.boxMargin,Math.min),o.updateVal(n,`stopy`,i+l*a.boxMargin,Math.max),o.updateVal(X.data,`startx`,e-l*a.boxMargin,Math.min),o.updateVal(X.data,`stopx`,r+l*a.boxMargin,Math.max),s!==`activation`&&(o.updateVal(n,`startx`,e-l*a.boxMargin,Math.min),o.updateVal(n,`stopx`,r+l*a.boxMargin,Math.max),o.updateVal(X.data,`starty`,t-l*a.boxMargin,Math.min),o.updateVal(X.data,`stopy`,i+l*a.boxMargin,Math.max))},`updateItemBounds`)}n(l,`updateFn`),this.sequenceItems.forEach(l())},`updateBounds`),insert:n(function(e,t,n,r){let i=Math.min(e,n),a=Math.max(e,n),o=Math.min(t,r),s=Math.max(t,r);this.updateVal(X.data,`startx`,i,Math.min),this.updateVal(X.data,`starty`,o,Math.min),this.updateVal(X.data,`stopx`,a,Math.max),this.updateVal(X.data,`stopy`,s,Math.max),this.updateBounds(i,o,a,s)},`insert`),bumpVerticalPos:n(function(e){this.verticalPos+=e,this.data.stopy=this.verticalPos},`bumpVerticalPos`),getVerticalPos:n(function(){return this.verticalPos},`getVerticalPos`),getBounds:n(function(){return this.data},`getBounds`)},Z=J.sectionFills,Q=J.sectionColours,ie=n(function(e,t,n){let r=s().journey,i=``,a=r.height*2+r.diagramMarginY,o=n+a,c=0,l=`#CCC`,u=`black`,d=0;for(let[n,a]of t.entries()){if(i!==a.section){l=Z[c%Z.length],d=c%Z.length,u=Q[c%Q.length];let o=0,s=a.section;for(let e=n;e<t.length&&t[e].section==s;e++)o+=1;let f={x:n*r.taskMargin+n*r.width+Y,y:50,text:a.section,fill:l,num:d,colour:u,taskCount:o};W.drawSection(e,f,r),i=a.section,c++}let s=a.people.reduce((e,t)=>(G[t]&&(e[t]=G[t]),e),{});a.x=n*r.taskMargin+n*r.width+Y,a.y=o,a.width=r.diagramMarginX,a.height=r.diagramMarginY,a.colour=u,a.fill=l,a.num=d,a.actors=s,W.drawTask(e,a,r),X.insert(a.x,a.y,a.x+a.width+r.taskMargin,450)}},`drawTasks`),$={setConf:ne,draw:re},ae={parser:v,db:M,renderer:$,styles:P,init:n(e=>{$.setConf(e.journey),M.clear()},`init`)};export{ae as diagram};