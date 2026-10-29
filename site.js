'use strict';
const drawing=document.querySelector('#drawing');
if(drawing){
 const svg=document.querySelector('#artboard'),status=document.querySelector('#draw-status'),undo=document.querySelector('#undo');
 const NS='http://www.w3.org/2000/svg',palette=['#6EA9DE','#466CB5','#F6D778'];
 let index=0; const marks=[]; let down=null;
 const node=(tag,attrs)=>{const el=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);return el};
 function dimensions(){const r=drawing.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);return r;}
 function motif(x,y,size,type,color,rotation){
  const g=node('g',{transform:`translate(${x} ${y}) rotate(${rotation})`});
  const art=node('g',{transform:`scale(${size/65})`,stroke:'#101D3D','stroke-width':2.2,'stroke-linecap':'round','stroke-linejoin':'round'});
  const part=(tag,attrs)=>{const el=node(tag,attrs);art.append(el);return el;};
  // A striped tail, soft tummy, tiny paws, and the familiar raccoon mask.
  part('path',{d:'M 23 32 Q 78 52 62 10 Q 54 -8 45 5 Q 37 17 46 29 Q 42 33 23 26',fill:color});
  part('path',{d:'M 48 3 L 61 11 M 45 17 L 65 26 M 40 30 L 59 40',fill:'none','stroke-width':8});
  part('ellipse',{cx:0,cy:24,rx:29,ry:32,fill:color});
  part('ellipse',{cx:0,cy:29,rx:18,ry:22,fill:'#FFF4D3',stroke:'none'});
  for(const x of [-18,18]) part('ellipse',{cx:x,cy:51,rx:12,ry:7,fill:'#101D3D'});
  for(const x of [-25,25]){
   part('circle',{cx:x,cy:-32,r:15,fill:color});
   part('circle',{cx:x,cy:-32,r:8,fill:'#F6D778',stroke:'none'});
  }
  part('ellipse',{cx:0,cy:-10,rx:37,ry:31,fill:color});
  part('path',{d:'M -33 -15 Q -20 -27 0 -13 Q 20 -27 33 -15 L 29 1 Q 15 9 0 -1 Q -15 9 -29 1 Z',fill:'#101D3D',stroke:'none'});
  for(const x of [-16,16]){
   if(type===1) part('path',{d:`M ${x-5} -9 Q ${x} -16 ${x+5} -9`,fill:'none',stroke:'#FFF4D3','stroke-width':2.6});
   else {part('circle',{cx:x,cy:-11,r:4,fill:'#FFF4D3',stroke:'none'});part('circle',{cx:x+1,cy:-10,r:2,fill:'#101D3D',stroke:'none'});}
   part('ellipse',{cx:x*1.4,cy:5,rx:6,ry:3,fill:'#F6D778',stroke:'none'});
  }
  part('ellipse',{cx:0,cy:7,rx:13,ry:10,fill:'#FFF4D3',stroke:'none'});
  part('path',{d:'M -5 2 Q 0 -1 5 2 L 0 7 Z',fill:'#101D3D'});
  part('path',{d:'M -6 11 Q 0 17 6 11',fill:'none'});
  if(type===0){
   part('path',{d:'M -12 25 C -24 12 -35 28 0 44 C 35 28 24 12 12 25 Q 0 17 -12 25',fill:'#F6D778'});
  } else if(type===1){
   part('path',{d:'M -18 -35 L -26 -54 L -9 -49 L 0 -63 L 9 -49 L 26 -54 L 18 -35 Z',fill:'#466CB5'});
   part('circle',{cx:0,cy:-43,r:3,fill:'#F6D778'});
  } else {
   part('path',{d:'M -10 24 L -25 17 L -25 35 L -10 29 M 10 24 L 25 17 L 25 35 L 10 29',fill:'#466CB5'});
   part('circle',{cx:0,cy:26,r:7,fill:'#F6D778'});
   part('path',{d:'M 26 13 Q 42 -4 40 -14',fill:'none','stroke-width':9,stroke:color});
  }
  g.append(art);
  return g;
 }
 function update(){drawing.classList.toggle('has-art',marks.length>0);undo.disabled=!marks.length;status.textContent=marks.length?`${marks.length} ${marks.length===1?'raccoon':'raccoons'} on the canvas.`:'Canvas cleared.';}
 function add(x,y){const r=dimensions();if(!marks.length)svg.querySelectorAll('.seed').forEach(el=>el.remove());const size=Math.min(r.width*.19,48+Math.random()*28);const type=index%3;const g=motif(x,y,size,type,palette[index%palette.length],Math.random()*28-14);g.dataset.shape=String(++index);g.dataset.x=String(x/r.width);g.dataset.y=String(y/r.height);g.dataset.angle=g.getAttribute('transform').match(/rotate\(([^)]+)\)/)[1];svg.append(g);marks.push(g);if(marks.length>40)marks.shift().remove();update();}
 function seed(){const r=dimensions();[[.63,.52,82,0,palette[0],-10],[.83,.39,62,2,palette[1],20],[.47,.72,57,1,palette[2],-25]].forEach(([x,y,s,t,c,rot])=>{const g=motif(r.width*x,r.height*y,Math.min(s,r.width*.12),t,c,rot);g.classList.add('seed');g.setAttribute('opacity','.85');svg.append(g)});}
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
