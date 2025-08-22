import{J as e,O as t,a$ as n,aD as r,aG as i,aI as a,aN as o,aO as s,aQ as c,aR as l,aW as u,a_ as d,b1 as f,k as p}from"../app.CVP2xO_Q.js";import{b as m}from"./chunk-BFAMUDN2.BjlE2SZt.js";import{b as h}from"./chunk-SKB7J2MH.DG87sU9Z.js";var g=function(){var e=r(function(e,t,n,r){for(n||={},r=e.length;r--;n[e[r]]=t);return n},`o`),t=[1,2],n=[1,3],i=[1,4],a=[2,4],o=[1,9],s=[1,11],c=[1,16],l=[1,17],u=[1,18],d=[1,19],f=[1,33],p=[1,20],m=[1,21],h=[1,22],g=[1,23],_=[1,24],v=[1,26],y=[1,27],b=[1,28],x=[1,29],S=[1,30],C=[1,31],w=[1,32],T=[1,35],E=[1,36],D=[1,37],O=[1,38],k=[1,34],A=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],j=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],M=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],N={trace:r(function(){},`trace`),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:`error`,4:`SPACE`,5:`NL`,6:`SD`,14:`DESCR`,15:`-->`,16:`HIDE_EMPTY`,17:`scale`,18:`WIDTH`,19:`COMPOSIT_STATE`,20:`STRUCT_START`,21:`STRUCT_STOP`,22:`STATE_DESCR`,23:`AS`,24:`ID`,25:`FORK`,26:`JOIN`,27:`CHOICE`,28:`CONCURRENT`,29:`note`,31:`NOTE_TEXT`,33:`acc_title`,34:`acc_title_value`,35:`acc_descr`,36:`acc_descr_value`,37:`acc_descr_multiline_value`,38:`CLICK`,39:`STRING`,40:`HREF`,41:`classDef`,42:`CLASSDEF_ID`,43:`CLASSDEF_STYLEOPTS`,44:`DEFAULT`,45:`style`,46:`STYLE_IDS`,47:`STYLEDEF_STYLEOPTS`,48:`class`,49:`CLASSENTITY_IDS`,50:`STYLECLASS`,51:`direction_tb`,52:`direction_bt`,53:`direction_rl`,54:`direction_lr`,56:`;`,57:`EDGE_STATE`,58:`STYLE_SEPARATOR`,59:`left_of`,60:`right_of`},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:r(function(e,t,n,r,i,a,o){var s=a.length-1;switch(i){case 3:return r.setRootDoc(a[s]),a[s];case 4:this.$=[];break;case 5:a[s]!=`nl`&&(a[s-1].push(a[s]),this.$=a[s-1]);break;case 6:case 7:this.$=a[s];break;case 8:this.$=`nl`;break;case 12:this.$=a[s];break;case 13:let e=a[s-1];e.description=r.trimColon(a[s]),this.$=e;break;case 14:this.$={stmt:`relation`,state1:a[s-2],state2:a[s]};break;case 15:let t=r.trimColon(a[s]);this.$={stmt:`relation`,state1:a[s-3],state2:a[s-1],description:t};break;case 19:this.$={stmt:`state`,id:a[s-3],type:`default`,description:``,doc:a[s-1]};break;case 20:var c=a[s],l=a[s-2].trim();if(a[s].match(`:`)){var u=a[s].split(`:`);c=u[0],l=[l,u[1]]}this.$={stmt:`state`,id:c,type:`default`,description:l};break;case 21:this.$={stmt:`state`,id:a[s-3],type:`default`,description:a[s-5],doc:a[s-1]};break;case 22:this.$={stmt:`state`,id:a[s],type:`fork`};break;case 23:this.$={stmt:`state`,id:a[s],type:`join`};break;case 24:this.$={stmt:`state`,id:a[s],type:`choice`};break;case 25:this.$={stmt:`state`,id:r.getDividerId(),type:`divider`};break;case 26:this.$={stmt:`state`,id:a[s-1].trim(),note:{position:a[s-2].trim(),text:a[s].trim()}};break;case 29:this.$=a[s].trim(),r.setAccTitle(this.$);break;case 30:case 31:this.$=a[s].trim(),r.setAccDescription(this.$);break;case 32:this.$={stmt:`click`,id:a[s-3],url:a[s-2],tooltip:a[s-1]};break;case 33:this.$={stmt:`click`,id:a[s-3],url:a[s-1],tooltip:``};break;case 34:case 35:this.$={stmt:`classDef`,id:a[s-1].trim(),classes:a[s].trim()};break;case 36:this.$={stmt:`style`,id:a[s-1].trim(),styleClass:a[s].trim()};break;case 37:this.$={stmt:`applyClass`,id:a[s-1].trim(),styleClass:a[s].trim()};break;case 38:r.setDirection(`TB`),this.$={stmt:`dir`,value:`TB`};break;case 39:r.setDirection(`BT`),this.$={stmt:`dir`,value:`BT`};break;case 40:r.setDirection(`RL`),this.$={stmt:`dir`,value:`RL`};break;case 41:r.setDirection(`LR`),this.$={stmt:`dir`,value:`LR`};break;case 44:case 45:this.$={stmt:`state`,id:a[s].trim(),type:`default`,description:``};break;case 46:this.$={stmt:`state`,id:a[s-2].trim(),classes:[a[s].trim()],type:`default`,description:``};break;case 47:this.$={stmt:`state`,id:a[s-2].trim(),classes:[a[s].trim()],type:`default`,description:``};break}},`anonymous`),table:[{3:1,4:t,5:n,6:i},{1:[3]},{3:5,4:t,5:n,6:i},{3:6,4:t,5:n,6:i},e([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],a,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:o,5:s,8:8,9:10,10:12,11:13,12:14,13:15,16:c,17:l,19:u,22:d,24:f,25:p,26:m,27:h,28:g,29:_,32:25,33:v,35:y,37:b,38:x,41:S,45:C,48:w,51:T,52:E,53:D,54:O,57:k},e(A,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:c,17:l,19:u,22:d,24:f,25:p,26:m,27:h,28:g,29:_,32:25,33:v,35:y,37:b,38:x,41:S,45:C,48:w,51:T,52:E,53:D,54:O,57:k},e(A,[2,7]),e(A,[2,8]),e(A,[2,9]),e(A,[2,10]),e(A,[2,11]),e(A,[2,12],{14:[1,40],15:[1,41]}),e(A,[2,16]),{18:[1,42]},e(A,[2,18],{20:[1,43]}),{23:[1,44]},e(A,[2,22]),e(A,[2,23]),e(A,[2,24]),e(A,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},e(A,[2,28]),{34:[1,49]},{36:[1,50]},e(A,[2,31]),{13:51,24:f,57:k},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},e(j,[2,44],{58:[1,56]}),e(j,[2,45],{58:[1,57]}),e(A,[2,38]),e(A,[2,39]),e(A,[2,40]),e(A,[2,41]),e(A,[2,6]),e(A,[2,13]),{13:58,24:f,57:k},e(A,[2,17]),e(M,a,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},e(A,[2,29]),e(A,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},e(A,[2,14],{14:[1,71]}),{4:o,5:s,8:8,9:10,10:12,11:13,12:14,13:15,16:c,17:l,19:u,21:[1,72],22:d,24:f,25:p,26:m,27:h,28:g,29:_,32:25,33:v,35:y,37:b,38:x,41:S,45:C,48:w,51:T,52:E,53:D,54:O,57:k},e(A,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},e(A,[2,34]),e(A,[2,35]),e(A,[2,36]),e(A,[2,37]),e(j,[2,46]),e(j,[2,47]),e(A,[2,15]),e(A,[2,19]),e(M,a,{7:78}),e(A,[2,26]),e(A,[2,27]),{5:[1,79]},{5:[1,80]},{4:o,5:s,8:8,9:10,10:12,11:13,12:14,13:15,16:c,17:l,19:u,21:[1,81],22:d,24:f,25:p,26:m,27:h,28:g,29:_,32:25,33:v,35:y,37:b,38:x,41:S,45:C,48:w,51:T,52:E,53:D,54:O,57:k},e(A,[2,32]),e(A,[2,33]),e(A,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:r(function(e,t){if(t.recoverable)this.trace(e);else{var n=Error(e);throw n.hash=t,n}},`parseError`),parse:r(function(e){var t=this,n=[0],i=[],a=[null],o=[],s=this.table,c=``,l=0,u=0,d=0,f=2,p=1,m=o.slice.call(arguments,1),h=Object.create(this.lexer),g={yy:{}};for(var _ in this.yy)Object.prototype.hasOwnProperty.call(this.yy,_)&&(g.yy[_]=this.yy[_]);h.setInput(e,g.yy),g.yy.lexer=h,g.yy.parser=this,h.yylloc===void 0&&(h.yylloc={});var v=h.yylloc;o.push(v);var y=h.options&&h.options.ranges;typeof g.yy.parseError==`function`?this.parseError=g.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function b(e){n.length-=2*e,a.length-=e,o.length-=e}r(b,`popStack`);function x(){var e;return e=i.pop()||h.lex()||p,typeof e!=`number`&&(e instanceof Array&&(i=e,e=i.pop()),e=t.symbols_[e]||e),e}r(x,`lex`);for(var S,C,w,T,E,D={},O,k,A,j;;){if(w=n[n.length-1],this.defaultActions[w]?T=this.defaultActions[w]:(S??=x(),T=s[w]&&s[w][S]),T===void 0||!T.length||!T[0]){var M=``;for(O in j=[],s[w])this.terminals_[O]&&O>f&&j.push(`'`+this.terminals_[O]+`'`);M=h.showPosition?`Parse error on line `+(l+1)+`:
`+h.showPosition()+`
Expecting `+j.join(`, `)+`, got '`+(this.terminals_[S]||S)+`'`:`Parse error on line `+(l+1)+`: Unexpected `+(S==p?`end of input`:`'`+(this.terminals_[S]||S)+`'`),this.parseError(M,{text:h.match,token:this.terminals_[S]||S,line:h.yylineno,loc:v,expected:j})}if(T[0]instanceof Array&&T.length>1)throw Error(`Parse Error: multiple actions possible at state: `+w+`, token: `+S);switch(T[0]){case 1:n.push(S),a.push(h.yytext),o.push(h.yylloc),n.push(T[1]),S=null,C?(S=C,C=null):(u=h.yyleng,c=h.yytext,l=h.yylineno,v=h.yylloc,d>0&&d--);break;case 2:if(k=this.productions_[T[1]][1],D.$=a[a.length-k],D._$={first_line:o[o.length-(k||1)].first_line,last_line:o[o.length-1].last_line,first_column:o[o.length-(k||1)].first_column,last_column:o[o.length-1].last_column},y&&(D._$.range=[o[o.length-(k||1)].range[0],o[o.length-1].range[1]]),E=this.performAction.apply(D,[c,u,l,g.yy,T[1],a,o].concat(m)),E!==void 0)return E;k&&(n=n.slice(0,-1*k*2),a=a.slice(0,-1*k),o=o.slice(0,-1*k)),n.push(this.productions_[T[1]][0]),a.push(D.$),o.push(D._$),A=s[n[n.length-2]][n[n.length-1]],n.push(A);break;case 3:return!0}}return!0},`parse`)},P=function(){var e={EOF:1,parseError:r(function(e,t){if(this.yy.parser)this.yy.parser.parseError(e,t);else throw Error(e)},`parseError`),setInput:r(function(e,t){return this.yy=t||this.yy||{},this._input=e,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match=``,this.conditionStack=[`INITIAL`],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},`setInput`),input:r(function(){var e=this._input[0];this.yytext+=e,this.yyleng++,this.offset++,this.match+=e,this.matched+=e;var t=e.match(/(?:\r\n?|\n).*/g);return t?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),e},`input`),unput:r(function(e){var t=e.length,n=e.split(/(?:\r\n?|\n)/g);this._input=e+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-t),this.offset-=t;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-t},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-t]),this.yyleng=this.yytext.length,this},`unput`),more:r(function(){return this._more=!0,this},`more`),reject:r(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError(`Lexical error on line `+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:``,token:null,line:this.yylineno});return this},`reject`),less:r(function(e){this.unput(this.match.slice(e))},`less`),pastInput:r(function(){var e=this.matched.substr(0,this.matched.length-this.match.length);return(e.length>20?`...`:``)+e.substr(-20).replace(/\n/g,``)},`pastInput`),upcomingInput:r(function(){var e=this.match;return e.length<20&&(e+=this._input.substr(0,20-e.length)),(e.substr(0,20)+(e.length>20?`...`:``)).replace(/\n/g,``)},`upcomingInput`),showPosition:r(function(){var e=this.pastInput(),t=Array(e.length+1).join(`-`);return e+this.upcomingInput()+`
`+t+`^`},`showPosition`),test_match:r(function(e,t){var n,r,i;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),r=e[0].match(/(?:\r\n?|\n).*/g),r&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+e[0].length},this.yytext+=e[0],this.match+=e[0],this.matches=e,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(e[0].length),this.matched+=e[0],n=this.performAction.call(this,this.yy,this,t,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n)return n;if(this._backtrack){for(var a in i)this[a]=i[a];return!1}return!1},`test_match`),next:r(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var e,t,n,r;this._more||(this.yytext=``,this.match=``);for(var i=this._currentRules(),a=0;a<i.length;a++)if(n=this._input.match(this.rules[i[a]]),n&&(!t||n[0].length>t[0].length)){if(t=n,r=a,this.options.backtrack_lexer){if(e=this.test_match(n,i[a]),e!==!1)return e;if(this._backtrack){t=!1;continue}else return!1}else if(!this.options.flex)break}return t?(e=this.test_match(t,i[r]),e===!1?!1:e):this._input===``?this.EOF:this.parseError(`Lexical error on line `+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:``,token:null,line:this.yylineno})},`next`),lex:r(function(){var e=this.next();return e||this.lex()},`lex`),begin:r(function(e){this.conditionStack.push(e)},`begin`),popState:r(function(){var e=this.conditionStack.length-1;return e>0?this.conditionStack.pop():this.conditionStack[0]},`popState`),_currentRules:r(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},`_currentRules`),topState:r(function(e){return e=this.conditionStack.length-1-Math.abs(e||0),e>=0?this.conditionStack[e]:`INITIAL`},`topState`),pushState:r(function(e){this.begin(e)},`pushState`),stateStackSize:r(function(){return this.conditionStack.length},`stateStackSize`),options:{"case-insensitive":!0},performAction:r(function(e,t,n,r){switch(n){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:break;case 9:break;case 10:return 5;case 11:break;case 12:break;case 13:break;case 14:break;case 15:return this.pushState(`SCALE`),17;case 16:return 18;case 17:this.popState();break;case 18:return this.begin(`acc_title`),33;case 19:return this.popState(),`acc_title_value`;case 20:return this.begin(`acc_descr`),35;case 21:return this.popState(),`acc_descr_value`;case 22:this.begin(`acc_descr_multiline`);break;case 23:this.popState();break;case 24:return`acc_descr_multiline_value`;case 25:return this.pushState(`CLASSDEF`),41;case 26:return this.popState(),this.pushState(`CLASSDEFID`),`DEFAULT_CLASSDEF_ID`;case 27:return this.popState(),this.pushState(`CLASSDEFID`),42;case 28:return this.popState(),43;case 29:return this.pushState(`CLASS`),48;case 30:return this.popState(),this.pushState(`CLASS_STYLE`),49;case 31:return this.popState(),50;case 32:return this.pushState(`STYLE`),45;case 33:return this.popState(),this.pushState(`STYLEDEF_STYLES`),46;case 34:return this.popState(),47;case 35:return this.pushState(`SCALE`),17;case 36:return 18;case 37:this.popState();break;case 38:this.pushState(`STATE`);break;case 39:return this.popState(),t.yytext=t.yytext.slice(0,-8).trim(),25;case 40:return this.popState(),t.yytext=t.yytext.slice(0,-8).trim(),26;case 41:return this.popState(),t.yytext=t.yytext.slice(0,-10).trim(),27;case 42:return this.popState(),t.yytext=t.yytext.slice(0,-8).trim(),25;case 43:return this.popState(),t.yytext=t.yytext.slice(0,-8).trim(),26;case 44:return this.popState(),t.yytext=t.yytext.slice(0,-10).trim(),27;case 45:return 51;case 46:return 52;case 47:return 53;case 48:return 54;case 49:this.pushState(`STATE_STRING`);break;case 50:return this.pushState(`STATE_ID`),`AS`;case 51:return this.popState(),`ID`;case 52:this.popState();break;case 53:return`STATE_DESCR`;case 54:return 19;case 55:this.popState();break;case 56:return this.popState(),this.pushState(`struct`),20;case 57:break;case 58:return this.popState(),21;case 59:break;case 60:return this.begin(`NOTE`),29;case 61:return this.popState(),this.pushState(`NOTE_ID`),59;case 62:return this.popState(),this.pushState(`NOTE_ID`),60;case 63:this.popState(),this.pushState(`FLOATING_NOTE`);break;case 64:return this.popState(),this.pushState(`FLOATING_NOTE_ID`),`AS`;case 65:break;case 66:return`NOTE_TEXT`;case 67:return this.popState(),`ID`;case 68:return this.popState(),this.pushState(`NOTE_TEXT`),24;case 69:return this.popState(),t.yytext=t.yytext.substr(2).trim(),31;case 70:return this.popState(),t.yytext=t.yytext.slice(0,-8).trim(),31;case 71:return 6;case 72:return 6;case 73:return 16;case 74:return 57;case 75:return 24;case 76:return t.yytext=t.yytext.trim(),14;case 77:return 15;case 78:return 28;case 79:return 58;case 80:return 5;case 81:return`INVALID`}},`anonymous`),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[12,13],inclusive:!1},struct:{rules:[12,13,25,29,32,38,45,46,47,48,57,58,59,60,74,75,76,77,78],inclusive:!1},FLOATING_NOTE_ID:{rules:[67],inclusive:!1},FLOATING_NOTE:{rules:[64,65,66],inclusive:!1},NOTE_TEXT:{rules:[69,70],inclusive:!1},NOTE_ID:{rules:[68],inclusive:!1},NOTE:{rules:[61,62,63],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[34],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[33],inclusive:!1},CLASS_STYLE:{rules:[31],inclusive:!1},CLASS:{rules:[30],inclusive:!1},CLASSDEFID:{rules:[28],inclusive:!1},CLASSDEF:{rules:[26,27],inclusive:!1},acc_descr_multiline:{rules:[23,24],inclusive:!1},acc_descr:{rules:[21],inclusive:!1},acc_title:{rules:[19],inclusive:!1},SCALE:{rules:[16,17,36,37],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[51],inclusive:!1},STATE_STRING:{rules:[52,53],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[12,13,39,40,41,42,43,44,49,50,54,55,56],inclusive:!1},ID:{rules:[12,13],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,13,14,15,18,20,22,25,29,32,35,38,56,60,71,72,73,74,75,76,77,79,80,81],inclusive:!0}}};return e}();N.lexer=P;function F(){this.yy={}}return r(F,`Parser`),F.prototype=N,N.Parser=F,new F}();g.parser=g;var _=g,v=`TB`,y=`TB`,b=`dir`,x=`state`,S=`root`,C=`relation`,w=`classDef`,T=`style`,E=`applyClass`,D=`default`,O=`divider`,k=`fill:none`,A=`fill: #333`,j=`c`,M=`text`,N=`normal`,P=`rect`,F=`rectWithTitle`,ee=`stateStart`,te=`stateEnd`,I=`divider`,ne=`roundedWithTitle`,re=`note`,ie=`noteGroup`,L=`statediagram`,ae=`state`,oe=`${L}-${ae}`,R=`transition`,se=`note`,ce=`note-edge`,le=`${R} ${ce}`,ue=`${L}-${se}`,de=`cluster`,fe=`${L}-${de}`,pe=`cluster-alt`,me=`${L}-${pe}`,z=`parent`,B=`note`,he=`state`,V=`----`,ge=`${V}${B}`,H=`${V}${z}`,U=r((e,t=y)=>{if(!e.doc)return t;let n=t;for(let t of e.doc)t.stmt===`dir`&&(n=t.value);return n},`getDir`),_e=r(function(e,t){return t.db.getClasses()},`getClasses`),ve=r(async function(e,n,r,i){u.info(`REF0:`),u.info(`Drawing state diagram (v2)`,n);let{securityLevel:a,state:o,layout:s}=c();i.db.extract(i.db.getRootDocV2());let l=i.db.getData(),d=m(n,a);l.type=i.type,l.layoutAlgorithm=s,l.nodeSpacing=o?.nodeSpacing||50,l.rankSpacing=o?.rankSpacing||50,l.markers=[`barb`],l.diagramId=n,await p(l,d);try{let e=typeof i.db.getLinks==`function`?i.db.getLinks():new Map;e.forEach((e,t)=>{let n=typeof t==`string`?t:typeof t?.id==`string`?t.id:``;if(!n){u.warn(`⚠️ Invalid or missing stateId from key:`,JSON.stringify(t));return}let r=d.node()?.querySelectorAll(`g`),i;if(r?.forEach(e=>{let t=e.textContent?.trim();t===n&&(i=e)}),!i){u.warn(`⚠️ Could not find node matching text:`,n);return}let a=i.parentNode;if(!a){u.warn(`⚠️ Node has no parent, cannot wrap:`,n);return}let o=document.createElementNS(`http://www.w3.org/2000/svg`,`a`),s=e.url.replace(/^"+|"+$/g,``);if(o.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,s),o.setAttribute(`target`,`_blank`),e.tooltip){let t=e.tooltip.replace(/^"+|"+$/g,``);o.setAttribute(`title`,t)}a.replaceChild(o,i),o.appendChild(i),u.info(`🔗 Wrapped node in <a> tag for:`,n,e.url)})}catch(e){u.error(`❌ Error injecting clickable links:`,e)}t.insertTitle(d,`statediagramTitleText`,o?.titleTopMargin??25,i.db.getDiagramTitle()),h(d,8,L,o?.useMaxWidth??!0)},`draw`),ye={getClasses:_e,draw:ve,getDir:U},W=new Map,G=0;function K(e=``,t=0,n=``,r=V){let i=n!==null&&n.length>0?`${r}${n}`:``;return`${he}-${e}${i}-${t}`}r(K,`stateDomId`);var be=r((e,t,n,r,i,o,s,l)=>{u.trace(`items`,t),t.forEach(t=>{switch(t.stmt){case x:Z(e,t,n,r,i,o,s,l);break;case D:Z(e,t,n,r,i,o,s,l);break;case C:{Z(e,t.state1,n,r,i,o,s,l),Z(e,t.state2,n,r,i,o,s,l);let u={id:`edge`+G,start:t.state1.id,end:t.state2.id,arrowhead:`normal`,arrowTypeEnd:`arrow_barb`,style:k,labelStyle:``,label:a.sanitizeText(t.description??``,c()),arrowheadStyle:A,labelpos:j,labelType:M,thickness:N,classes:R,look:s};i.push(u),G++}break}})},`setupDoc`),q=r((e,t=y)=>{let n=t;if(e.doc)for(let t of e.doc)t.stmt===`dir`&&(n=t.value);return n},`getDir`);function J(e,t,n){if(!t.id||t.id===`</join></fork>`||t.id===`</choice>`)return;t.cssClasses&&(Array.isArray(t.cssCompiledStyles)||(t.cssCompiledStyles=[]),t.cssClasses.split(` `).forEach(e=>{let r=n.get(e);r&&(t.cssCompiledStyles=[...t.cssCompiledStyles??[],...r.styles])}));let r=e.find(e=>e.id===t.id);r?Object.assign(r,t):e.push(t)}r(J,`insertOrUpdateNode`);function Y(e){return e?.classes?.join(` `)??``}r(Y,`getClassesFromDbInfo`);function X(e){return e?.styles??[]}r(X,`getStylesFromDbInfo`);var Z=r((e,t,n,r,i,o,s,l)=>{let d=t.id,f=n.get(d),p=Y(f),m=X(f),h=c();if(u.info(`dataFetcher parsedItem`,t,f,m),d!==`root`){let n=P;t.start===!0?n=ee:t.start===!1&&(n=te),t.type!==D&&(n=t.type),W.get(d)||W.set(d,{id:d,shape:n,description:a.sanitizeText(d,h),cssClasses:`${p} ${oe}`,cssStyles:m});let c=W.get(d);t.description&&(Array.isArray(c.description)?(c.shape=F,c.description.push(t.description)):c.description?.length&&c.description.length>0?(c.shape=F,c.description===d?c.description=[t.description]:c.description=[c.description,t.description]):(c.shape=P,c.description=t.description),c.description=a.sanitizeTextOrArray(c.description,h)),c.description?.length===1&&c.shape===F&&(c.type===`group`?c.shape=ne:c.shape=P),!c.type&&t.doc&&(u.info(`Setting cluster for XCX`,d,q(t)),c.type=`group`,c.isGroup=!0,c.dir=q(t),c.shape=t.type===O?I:ne,c.cssClasses=`${c.cssClasses} ${fe} ${o?me:``}`);let f={labelStyle:``,shape:c.shape,label:c.description,cssClasses:c.cssClasses,cssCompiledStyles:[],cssStyles:c.cssStyles,id:d,dir:c.dir,domId:K(d,G),type:c.type,isGroup:c.type===`group`,padding:8,rx:10,ry:10,look:s};if(f.shape===I&&(f.label=``),e&&e.id!==`root`&&(u.trace(`Setting node `,d,` to be child of its parent `,e.id),f.parentId=e.id),f.centerLabel=!0,t.note){let e={labelStyle:``,shape:re,label:t.note.text,cssClasses:ue,cssStyles:[],cssCompiledStyles:[],id:d+ge+`-`+G,domId:K(d,G,B),type:c.type,isGroup:c.type===`group`,padding:h.flowchart?.padding,look:s,position:t.note.position},n=d+H,a={labelStyle:``,shape:ie,label:t.note.text,cssClasses:c.cssClasses,cssStyles:[],id:d+H,domId:K(d,G,z),type:`group`,isGroup:!0,padding:16,look:s,position:t.note.position};G++,a.id=n,e.parentId=n,J(r,a,l),J(r,e,l),J(r,f,l);let o=d,u=e.id;t.note.position===`left of`&&(o=e.id,u=d),i.push({id:o+`-`+u,start:o,end:u,arrowhead:`none`,arrowTypeEnd:``,style:k,labelStyle:``,classes:le,arrowheadStyle:A,labelpos:j,labelType:M,thickness:N,look:s})}else J(r,f,l)}t.doc&&(u.trace(`Adding nodes children `),be(t,t.doc,n,r,i,!o,s,l))},`dataFetcher`),xe=r(()=>{W.clear(),G=0},`reset`),Q={START_NODE:`[*]`,START_TYPE:`start`,END_NODE:`[*]`,END_TYPE:`end`,COLOR_KEYWORD:`color`,FILL_KEYWORD:`fill`,BG_FILL:`bgFill`,STYLECLASS_SEP:`,`},Se=r(()=>new Map,`newClassesList`),Ce=r(()=>({relations:[],states:new Map,documents:{}}),`newDoc`),$=r(e=>JSON.parse(JSON.stringify(e)),`clone`),we=class{constructor(e){this.version=e,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=Se(),this.documents={root:Ce()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.getAccTitle=s,this.setAccTitle=n,this.getAccDescription=o,this.setAccDescription=d,this.setDiagramTitle=f,this.getDiagramTitle=l,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this)}static#_=r(this,`StateDB`);static#_2=this.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3};extract(e){this.clear(!0);for(let t of Array.isArray(e)?e:e.doc)switch(t.stmt){case x:this.addState(t.id.trim(),t.type,t.doc,t.description,t.note);break;case C:this.addRelation(t.state1,t.state2,t.description);break;case w:this.addStyleClass(t.id.trim(),t.classes);break;case T:this.handleStyleDef(t);break;case E:this.setCssClass(t.id.trim(),t.styleClass);break;case`click`:this.addLink(t.id,t.url,t.tooltip);break}let t=this.getStates(),n=c();xe(),Z(void 0,this.getRootDocV2(),t,this.nodes,this.edges,!0,n.look,this.classes);for(let e of this.nodes){if(!Array.isArray(e.label))continue;if(e.description=e.label.slice(1),e.isGroup&&e.description.length>0)throw Error(`Group nodes can only have label. Remove the additional description for node [${e.id}]`);e.label=e.label[0]}}handleStyleDef(e){let t=e.id.trim().split(`,`),n=e.styleClass.split(`,`);for(let e of t){let t=this.getState(e);if(!t){let n=e.trim();this.addState(n),t=this.getState(n)}t&&(t.styles=n.map(e=>e.replace(/;/g,``)?.trim()))}}setRootDoc(e){u.info(`Setting root doc`,e),this.rootDoc=e,this.version===1?this.extract(e):this.extract(this.getRootDocV2())}docTranslator(t,n,r){if(n.stmt===C){this.docTranslator(t,n.state1,!0),this.docTranslator(t,n.state2,!1);return}if(n.stmt===x&&(n.id===Q.START_NODE?(n.id=t.id+(r?`_start`:`_end`),n.start=r):n.id=n.id.trim()),n.stmt!==S&&n.stmt!==x||!n.doc)return;let i=[],a=[];for(let e of n.doc)if(e.type===O){let t=$(e);t.doc=$(a),i.push(t),a=[]}else a.push(e);if(i.length>0&&a.length>0){let t={stmt:x,id:e(),type:`divider`,doc:$(a)};i.push($(t)),n.doc=i}n.doc.forEach(e=>this.docTranslator(n,e,!0))}getRootDocV2(){return this.docTranslator({id:S,stmt:S},{id:S,stmt:S,doc:this.rootDoc},!0),{id:S,doc:this.rootDoc}}addState(e,t=D,n=void 0,r=void 0,i=void 0,o=void 0,s=void 0,l=void 0){let d=e?.trim();if(!this.currentDocument.states.has(d))u.info(`Adding state `,d,r),this.currentDocument.states.set(d,{stmt:x,id:d,descriptions:[],type:t,doc:n,note:i,classes:[],styles:[],textStyles:[]});else{let e=this.currentDocument.states.get(d);if(!e)throw Error(`State not found: ${d}`);e.doc||=n,e.type||=t}if(r){u.info(`Setting state description`,d,r);let e=Array.isArray(r)?r:[r];e.forEach(e=>this.addDescription(d,e.trim()))}if(i){let e=this.currentDocument.states.get(d);if(!e)throw Error(`State not found: ${d}`);e.note=i,e.note.text=a.sanitizeText(e.note.text,c())}if(o){u.info(`Setting state classes`,d,o);let e=Array.isArray(o)?o:[o];e.forEach(e=>this.setCssClass(d,e.trim()))}if(s){u.info(`Setting state styles`,d,s);let e=Array.isArray(s)?s:[s];e.forEach(e=>this.setStyle(d,e.trim()))}if(l){u.info(`Setting state styles`,d,s);let e=Array.isArray(l)?l:[l];e.forEach(e=>this.setTextStyle(d,e.trim()))}}clear(e){this.nodes=[],this.edges=[],this.documents={root:Ce()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=Se(),e||(this.links=new Map,i())}getState(e){return this.currentDocument.states.get(e)}getStates(){return this.currentDocument.states}logDocuments(){u.info(`Documents = `,this.documents)}getRelations(){return this.currentDocument.relations}addLink(e,t,n){this.links.set(e,{url:t,tooltip:n}),u.warn(`Adding link`,e,t,n)}getLinks(){return this.links}startIdIfNeeded(e=``){return e===Q.START_NODE?(this.startEndCount++,`${Q.START_TYPE}${this.startEndCount}`):e}startTypeIfNeeded(e=``,t=D){return e===Q.START_NODE?Q.START_TYPE:t}endIdIfNeeded(e=``){return e===Q.END_NODE?(this.startEndCount++,`${Q.END_TYPE}${this.startEndCount}`):e}endTypeIfNeeded(e=``,t=D){return e===Q.END_NODE?Q.END_TYPE:t}addRelationObjs(e,t,n=``){let r=this.startIdIfNeeded(e.id.trim()),i=this.startTypeIfNeeded(e.id.trim(),e.type),o=this.startIdIfNeeded(t.id.trim()),s=this.startTypeIfNeeded(t.id.trim(),t.type);this.addState(r,i,e.doc,e.description,e.note,e.classes,e.styles,e.textStyles),this.addState(o,s,t.doc,t.description,t.note,t.classes,t.styles,t.textStyles),this.currentDocument.relations.push({id1:r,id2:o,relationTitle:a.sanitizeText(n,c())})}addRelation(e,t,n){if(typeof e==`object`&&typeof t==`object`)this.addRelationObjs(e,t,n);else if(typeof e==`string`&&typeof t==`string`){let r=this.startIdIfNeeded(e.trim()),i=this.startTypeIfNeeded(e),o=this.endIdIfNeeded(t.trim()),s=this.endTypeIfNeeded(t);this.addState(r,i),this.addState(o,s),this.currentDocument.relations.push({id1:r,id2:o,relationTitle:n?a.sanitizeText(n,c()):void 0})}}addDescription(e,t){let n=this.currentDocument.states.get(e),r=t.startsWith(`:`)?t.replace(`:`,``).trim():t;n?.descriptions?.push(a.sanitizeText(r,c()))}cleanupLabel(e){return e.startsWith(`:`)?e.slice(2).trim():e.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(e,t=``){this.classes.has(e)||this.classes.set(e,{id:e,styles:[],textStyles:[]});let n=this.classes.get(e);t&&n&&t.split(Q.STYLECLASS_SEP).forEach(e=>{let t=e.replace(/([^;]*);/,`$1`).trim();if(RegExp(Q.COLOR_KEYWORD).exec(e)){let e=t.replace(Q.FILL_KEYWORD,Q.BG_FILL),r=e.replace(Q.COLOR_KEYWORD,Q.FILL_KEYWORD);n.textStyles.push(r)}n.styles.push(t)})}getClasses(){return this.classes}setCssClass(e,t){e.split(`,`).forEach(e=>{let n=this.getState(e);if(!n){let t=e.trim();this.addState(t),n=this.getState(t)}n?.classes?.push(t)})}setStyle(e,t){this.getState(e)?.styles?.push(t)}setTextStyle(e,t){this.getState(e)?.textStyles?.push(t)}getDirectionStatement(){return this.rootDoc.find(e=>e.stmt===b)}getDirection(){return this.getDirectionStatement()?.value??v}setDirection(e){let t=this.getDirectionStatement();t?t.value=e:this.rootDoc.unshift({stmt:b,value:e})}trimColon(e){return e.startsWith(`:`)?e.slice(1).trim():e.trim()}getData(){let e=c();return{nodes:this.nodes,edges:this.edges,other:{},config:e,direction:U(this.getRootDocV2())}}getConfig(){return c().state}},Te=r(e=>`
defs #statediagram-barbEnd {
    fill: ${e.transitionColor};
    stroke: ${e.transitionColor};
  }
g.stateGroup text {
  fill: ${e.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${e.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${e.stateLabelColor};
}

g.stateGroup rect {
  fill: ${e.mainBkg};
  stroke: ${e.nodeBorder};
}

g.stateGroup line {
  stroke: ${e.lineColor};
  stroke-width: 1;
}

.transition {
  stroke: ${e.transitionColor};
  stroke-width: 1;
  fill: none;
}

.stateGroup .composit {
  fill: ${e.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${e.noteBorderColor};
  fill: ${e.noteBkgColor};

  text {
    fill: ${e.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${e.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${e.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${e.edgeLabelBackground};
  p {
    background-color: ${e.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${e.edgeLabelBackground};
    fill: ${e.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${e.transitionLabelColor||e.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${e.transitionLabelColor||e.tertiaryTextColor};
}

.stateLabel text {
  fill: ${e.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${e.specialStateColor};
  stroke: ${e.specialStateColor};
}

.node .fork-join {
  fill: ${e.specialStateColor};
  stroke: ${e.specialStateColor};
}

.node circle.state-end {
  fill: ${e.innerEndBackground};
  stroke: ${e.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${e.compositeBackground||e.background};
  // stroke: ${e.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${e.stateBkg||e.mainBkg};
  stroke: ${e.stateBorder||e.nodeBorder};
  stroke-width: 1px;
}
.node polygon {
  fill: ${e.mainBkg};
  stroke: ${e.stateBorder||e.nodeBorder};;
  stroke-width: 1px;
}
#statediagram-barbEnd {
  fill: ${e.lineColor};
}

.statediagram-cluster rect {
  fill: ${e.compositeTitleBackground};
  stroke: ${e.stateBorder||e.nodeBorder};
  stroke-width: 1px;
}

.cluster-label, .nodeLabel {
  color: ${e.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${e.stateBorder||e.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${e.compositeBackground||e.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${e.altBackground?e.altBackground:`#efefef`};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${e.altBackground?e.altBackground:`#efefef`};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${e.noteBkgColor};
  stroke: ${e.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${e.noteBkgColor};
  stroke: ${e.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${e.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${e.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${e.noteTextColor};
}

#dependencyStart, #dependencyEnd {
  fill: ${e.lineColor};
  stroke: ${e.lineColor};
  stroke-width: 1;
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${e.textColor};
}
`,`getStyles`),Ee=Te;export{we as b,_ as c,ye as d,Ee as e};