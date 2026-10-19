'use strict';
const drawing=document.querySelector('#drawing');
if(drawing){
 const svg=document.querySelector('#artboard'),status=document.querySelector('#draw-status'),undo=document.querySelector('#undo');
 const NS='http://www.w3.org/2000/svg',palette=['#b9442d','#2b6486','#936d19','#795489','#327867'];
 let index=0; const marks=[]; let down=null;
 const node=(tag,attrs)=>{const el=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);return el};
 function dimensions(){const r=drawing.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);return r;}
 function motif(x,y,size,type,color,rotation){
  const g=node('g',{transform:`translate(${x} ${y}) rotate(${rotation})`,fill:'none',stroke:color,'stroke-width':1.4,'stroke-linecap':'round'});
  if(type===0){for(let i=0;i<8;i++){const a=i*Math.PI/4;g.append(node('ellipse',{cx:Math.cos(a)*size*.25,cy:Math.sin(a)*size*.25,rx:size*.52,ry:size*.18,transform:`rotate(${i*45} ${Math.cos(a)*size*.25} ${Math.sin(a)*size*.25})`}));}}
  else if(type===1){for(let j=0;j<6;j++){let d='';for(let t=0;t<=100;t++){const px=(t/100-.5)*size*1.8,py=Math.sin(t/100*Math.PI*7+j*.32)*Math.sin(t/100*Math.PI)*size*(.23+j*.035);d+=`${t?'L':'M'}${px.toFixed(2)},${py.toFixed(2)} `;}g.append(node('path',{d}));}}
  else {for(let i=0;i<9;i++)g.append(node('ellipse',{cx:0,cy:0,rx:size*(.22+i*.038),ry:size*(.58-i*.035),transform:`rotate(${i*14})`}));}
  return g;
 }
 function update(){drawing.classList.toggle('has-art',marks.length>0);undo.disabled=!marks.length;status.textContent=marks.length?`${marks.length} ${marks.length===1?'shape':'shapes'} on the canvas.`:'Canvas cleared.';}
 function add(x,y){const r=dimensions();if(!marks.length)svg.querySelectorAll('.seed').forEach(el=>el.remove());const size=Math.min(r.width*.19,48+Math.random()*28);const type=index%3;const g=motif(x,y,size,type,palette[index%palette.length],Math.random()*80-40);g.dataset.shape=String(++index);g.dataset.x=String(x/r.width);g.dataset.y=String(y/r.height);g.dataset.angle=g.getAttribute('transform').match(/rotate\(([^)]+)\)/)[1];svg.append(g);marks.push(g);if(marks.length>40)marks.shift().remove();update();}
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
