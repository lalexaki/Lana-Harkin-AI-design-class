'use strict';
const drawing=document.querySelector('#drawing');
if(drawing){
 const svg=document.querySelector('#artboard'),status=document.querySelector('#draw-status'),undo=document.querySelector('#undo');
 const NS='http://www.w3.org/2000/svg';
 let index=0, artworkId=0; const marks=[]; let down=null;
 const node=(tag,attrs)=>{const el=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);return el};
 function dimensions(){const r=drawing.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);return r;}
 function motif(x,y,size,type,rotation){
  const g=node('g',{transform:`translate(${x} ${y}) rotate(${rotation})`});
  const art=node('g',{transform:`scale(${size/65})`});
  const ink=node('g',{'class':`sky-motif ${type===2?'sky-twinkles':''}`,stroke:'#F6D778','stroke-width':1.3,'stroke-linecap':'round','stroke-linejoin':'round'});
  const defs=node('defs',{}),id=`sky-${++artworkId}`;
  function gradient(name,colors){const grad=node('linearGradient',{id:`${id}-${name}`,x1:'0%',y1:'0%',x2:'80%',y2:'100%'});colors.forEach((color,i)=>grad.append(node('stop',{offset:`${i/(colors.length-1)*100}%`,'stop-color':color})));defs.append(grad);return `url(#${id}-${name})`;}
  const cloud=gradient('cloud',['#FFFDF3','#E4F1FB','#91BDE9']);
  const gold=gradient('gold',['#FFFFF3','#FFF4D3','#F6D778']);
  const ribbon=gradient('ribbon',['#FFF4D3','#CEE9F8','#6EA9DE']);
  const part=(tag,attrs)=>{const el=node(tag,attrs);ink.append(el);return el;};
  const sparkle=(x,y,r,filled=true)=>part('path',{d:`M ${x} ${y-r} Q ${x+r*.14} ${y-r*.12} ${x+r*.64} ${y} Q ${x+r*.14} ${y+r*.12} ${x} ${y+r} Q ${x-r*.14} ${y+r*.12} ${x-r*.64} ${y} Q ${x-r*.14} ${y-r*.12} ${x} ${y-r} Z`,fill:filled?gold:'none'});
  if(type===0){
   // Curved, translucent ribbons lead into a faceted golden shooting star.
   part('path',{d:'M 20 -21 C -20 -20 -62 3 -90 54 C -53 22 -19 10 29 -8 Z',fill:ribbon,stroke:'none',opacity:'.92'});
   part('path',{d:'M 25 -12 C -23 5 -53 31 -64 75 C -33 40 -5 21 33 -3 Z',fill:cloud,stroke:'none',opacity:'.8'});
   part('path',{d:'M 24 -24 C -12 -30 -58 -11 -92 26 C -45 0 -11 -1 30 -13 Z',fill:gold,stroke:'none',opacity:'.7'});
   part('path',{d:'M -92 51 C -64 18 -23 -8 22 -17 M -61 66 C -37 34 -10 12 27 -7',fill:'none',stroke:'#FFF4D3','stroke-width':1,opacity:'.9'});
   part('path',{d:'M 32 -47 L 40 -25 L 64 -24 L 46 -9 L 52 15 L 31 2 L 11 15 L 16 -9 L -2 -24 L 23 -26 Z',fill:gold,'stroke-width':1.7});
   part('path',{d:'M 32 -47 L 31 -16 L 64 -24 M 31 -16 L 52 15 M 31 -16 L 11 15 M 31 -16 L -2 -24',fill:'none',stroke:'#FFFFFF',opacity:'.65','stroke-width':1});
   sparkle(-57,-22,7);sparkle(-26,50,10);sparkle(66,-47,5);
   [[-43,14,1.5],[-62,30,1],[-27,8,1.6],[-38,34,1],[-9,26,1.3]].forEach(([cx,cy,r])=>part('circle',{cx,cy,r,fill:'#FFF4D3',stroke:'none'}));
  }else if(type===1){
   // A layered cloud with fine gold contours and a hanging crescent.
   part('path',{d:'M 28 -58 A 22 22 0 1 0 54 -30 A 20 20 0 0 1 28 -58 Z',fill:gold,stroke:'none'});
   part('path',{d:'M -56 24 C -79 23 -80 -3 -59 -7 C -62 -29 -33 -42 -17 -24 C -5 -52 34 -45 37 -17 C 59 -27 75 -4 61 10 C 84 19 66 38 45 34 L -43 34 Q -57 35 -56 24 Z',fill:cloud});
   part('path',{d:'M -57 -6 Q -43 -13 -34 1 Q -26 -16 -11 -6 Q 2 -29 19 -13 M -47 20 Q -23 9 -12 23 Q 7 6 29 22 Q 43 14 57 22',fill:'none',stroke:'#FFFFFF','stroke-width':2,opacity:'.68'});
   part('path',{d:'M -74 37 C -42 48 25 41 78 22 M -49 42 C -16 57 35 45 57 36',fill:'none','stroke-width':.9,opacity:'.9'});
   part('path',{d:'M 61 -54 L 61 -29',fill:'none','stroke-width':.8});sparkle(61,-22,7);sparkle(-49,-40,7);sparkle(1,54,5);
  }else{
   // Different lengths and off-center companions keep the constellation hand drawn.
   sparkle(0,0,39);sparkle(-39,24,17,false);sparkle(39,-25,14);sparkle(33,41,8,false);sparkle(-25,-39,7);
   part('path',{d:'M -17 -18 L -24 -26 M 19 18 L 27 26 M 22 -4 L 36 -6 M -18 5 L -29 8',fill:'none','stroke-width':1});
   part('path',{d:'M -48 -3 Q -39 -17 -24 -20 M 11 49 Q 24 52 38 49',fill:'none','stroke-width':.7,opacity:'.7'});
   [[-49,-12,1.7],[17,-42,2],[49,9,1.8],[-10,49,1.3]].forEach(([cx,cy,r])=>part('circle',{cx,cy,r,fill:gold,stroke:'none'}));
  }
  art.append(ink);g.append(defs,art);return g;
 }
 function update(){drawing.classList.toggle('has-art',marks.length>0);undo.disabled=!marks.length;status.textContent=marks.length?`${marks.length} celestial ${marks.length===1?'illustration':'illustrations'} on the canvas.`:'Canvas cleared.';}
 function add(x,y){const r=dimensions();if(!marks.length)svg.querySelectorAll('.seed').forEach(el=>el.remove());const size=Math.min(r.width*.16,48+Math.random()*22),type=index%3;const margin=size*1.5;x=Math.max(margin,Math.min(r.width-margin,x));y=Math.max(size,Math.min(r.height-size*1.2,y));const angle=Math.random()*24-12;const g=motif(x,y,size,type,angle);g.dataset.shape=String(++index);g.dataset.x=String(x/r.width);g.dataset.y=String(y/r.height);g.dataset.angle=String(angle);svg.append(g);marks.push(g);if(marks.length>40)marks.shift().remove();update();}
 function seed(){const r=dimensions();[[.59,.44,76,0,-8],[.83,.64,69,1,4],[.39,.72,49,2,-8],[.88,.18,27,2,8]].forEach(([x,y,s,t,rot])=>{const g=motif(r.width*x,r.height*y,Math.min(s,r.width*.12),t,rot);g.classList.add('seed');svg.append(g)});}
 drawing.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
 drawing.addEventListener('pointercancel',()=>{down=null;});
 drawing.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>12){down=null;return;}const r=dimensions();add(e.clientX-r.left,e.clientY-r.top);down=null;});
 drawing.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const r=dimensions();add(r.width*(.2+Math.random()*.6),r.height*(.25+Math.random()*.5));}});
 undo.addEventListener('click',()=>{marks.pop()?.remove();update();});
 document.querySelector('#clear').addEventListener('click',()=>{svg.replaceChildren();marks.length=0;update();});
 new ResizeObserver(()=>{const r=dimensions();if(!marks.length&&svg.querySelector('.seed')){svg.replaceChildren();seed();}else marks.forEach(g=>g.setAttribute('transform',`translate(${Number(g.dataset.x)*r.width} ${Number(g.dataset.y)*r.height}) rotate(${g.dataset.angle})`));}).observe(drawing);
 seed();
}
const slider=document.querySelector('#compare');
if(slider){slider.addEventListener('input',()=>{document.querySelector('.comparison').style.setProperty('--reveal',`${slider.value}%`);document.querySelector('#compare-value').value=`${slider.value}% initial`;});}
