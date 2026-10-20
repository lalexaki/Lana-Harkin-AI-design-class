'use strict';
{
 const stage=document.querySelector('#album-comparison-stage');
 const range=document.querySelector('#album-comparison-range');
 if(stage&&range){
  const render=()=>{const value=Number(range.value);stage.style.setProperty('--reveal',`${value}%`);range.setAttribute('aria-valuetext',`${value}% first result, ${100-value}% final result`);};
  const atPointer=e=>{const rect=stage.getBoundingClientRect();range.value=String(Math.round(Math.max(0,Math.min(100,(e.clientX-rect.left)/rect.width*100))));render();};
  let pointer=null;
  range.addEventListener('input',render);
  stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;pointer=e.pointerId;stage.setPointerCapture(e.pointerId);atPointer(e);});
  stage.addEventListener('pointermove',e=>{if(e.pointerId===pointer)atPointer(e);});
  const finish=e=>{if(e.pointerId===pointer){pointer=null;if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);}};
  stage.addEventListener('pointerup',finish);stage.addEventListener('pointercancel',finish);
  stage.addEventListener('dragstart',e=>e.preventDefault());
  render();
 }
}
