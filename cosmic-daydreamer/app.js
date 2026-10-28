'use strict';
const scenes = [
 {name:'opening',step:'OPENING / ARRIVE',title:'A world holding its breath.',text:'Nova lands beside closed flowers. A softly glowing cloud is the first invitation to explore.',input:'Input: select “Begin wandering.” Feedback: Nova enters the glade and a cloud gains an outline.',count:0,alt:'Nova arrives on a sleeping planet, with zero of five fragments collected.'},
 {name:'notice',step:'STAGE 01 / NOTICE',title:'That cloud has a heartbeat.',text:'The cloud unfurls into a floating whale. A warm fragment appears along its trail, and the first flowers open.',input:'Input: click the cloud, then its fragment. Feedback: a soft chime and a persistent 1 / 5 counter.',count:1,alt:'A cloud transforms into a pink whale above Nova; one fragment is collected.'},
 {name:'follow',step:'STAGE 02 / FOLLOW',title:'Even the rocks are restless.',text:'A wandering rock leaves a trail. An enormous flower hides another dream. The same action now rewards reading a clue.',input:'Input: follow and inspect the rock and flower. Feedback: two fragments, visible footprints, and a path to the stars.',count:3,alt:'A walking rock leaves clues in the meadow; three fragments are collected.'},
 {name:'discover',step:'STAGE 03 / DISCOVER',title:'A doorway smaller than a dream.',text:'A dancing star yields fragment four and becomes a portal. Inside its tiny world, a familiar outline reveals the fifth fragment.',input:'Input: click the star, enter the portal, and find the outlined star within. Feedback: return to the planet at 5 / 5.',count:5,alt:'A golden star glows inside a lavender portal; five fragments are collected.'},
 {name:'ending',step:'ENDING / AWAKEN',title:'Some dreams decide to stay.',text:'The planet remembers its happiest dreams. Its sky warms, flowers bloom, and the whale becomes a permanent neighbor.',input:'Input: keep wandering, or choose “Dream again” to restart. Feedback: an unmistakable full-color ending.',count:5,alt:'Pink flowers bloom around Nova on the awakened planet.'}
];
const sceneTabs=[...document.querySelectorAll('[data-scene]')];
sceneTabs.forEach(button=>button.addEventListener('click',()=>{
 const s=scenes[Number(button.dataset.scene)];
 document.getElementById('scene-img').src=`assets/${s.name}.svg`;
 document.getElementById('scene-img').alt=s.alt;
 ['step','title','text','input'].forEach(key=>document.getElementById(`scene-${key}`).textContent=s[key]);
 document.getElementById('count').textContent=`${s.count} / 5`;
 document.getElementById('pips').textContent=Array.from({length:5},(_,i)=>i<s.count?'●':'○').join(' ');
 sceneTabs.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const motion=document.getElementById('motion');
let paused=reduced.matches;
function setMotion(){document.body.classList.toggle('reduced-motion',paused);document.documentElement.style.scrollBehavior=paused?'auto':'';motion.textContent=paused?'Motion: reduced':'Motion: on';motion.setAttribute('aria-pressed',String(paused));}
setMotion();motion.addEventListener('click',()=>{paused=!paused;setMotion();});
const rows=document.getElementById('event-rows');
for(let i=1;i<=5;i++){
 const row=document.createElement('tr');const th=document.createElement('th');th.scope='row';th.textContent=String(i).padStart(2,'0');row.append(th);
 for(const [key,prompt] of [['action','What did you do?'],['response','What changed?'],['learning','What did you understand?']]){
  const td=document.createElement('td');const area=document.createElement('textarea');area.dataset.save=`event${i}-${key}`;area.setAttribute('aria-label',`Event ${i}: ${key}`);area.placeholder=prompt;td.append(area);row.append(td);
 }
 rows.append(row);
}
const fields=[...document.querySelectorAll('[data-save]')];const storageKey='cosmic-daydreamer-proposal-notes-v1';let saved={};
try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}');if(!saved||typeof saved!=='object')saved={};}catch(_){document.getElementById('save-status').textContent='Browser storage is unavailable. Export your notes before closing this page.';}
fields.forEach(field=>{
 field.value=typeof saved[field.dataset.save]==='string'?saved[field.dataset.save]:'';
 field.addEventListener('input',()=>{saved[field.dataset.save]=field.value;try{localStorage.setItem(storageKey,JSON.stringify(saved));document.getElementById('save-status').textContent='Saved on this device. Export your notes to keep a separate copy.';}catch(_){document.getElementById('save-status').textContent='Could not save in this browser. Export your notes before closing.';}});
});
document.getElementById('export').addEventListener('click',()=>{
 const parts=['# Cosmic Daydreamer — Personal research notes','Exported '+new Date().toLocaleDateString(),'Only text entered by the student is included below.'];
 fields.forEach(f=>{if(f.value.trim())parts.push('## '+f.dataset.save+'\n'+f.value.trim());});
 const blob=new Blob([parts.join('\n\n')+'\n'],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='cosmic-daydreamer-my-notes.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
let audioContext,master,muted=false;
const sound=document.getElementById('sound'),mute=document.getElementById('mute'),audioStatus=document.getElementById('audio-status');
mute.addEventListener('click',()=>{muted=!muted;mute.setAttribute('aria-pressed',String(muted));mute.textContent=muted?'Unmute':'Mute';sound.disabled=muted;if(master)master.gain.setValueAtTime(muted?0:0.1,audioContext.currentTime);audioStatus.textContent=muted?'Sound muted. Visual feedback is always available.':'Sound unmuted. Choose “Play fragment cue” to hear the sketch.';});
sound.addEventListener('click',async()=>{
 if(muted)return;
 try{
  const Context=window.AudioContext||window.webkitAudioContext;
  if(!audioContext){audioContext=new Context();master=audioContext.createGain();master.gain.value=.1;master.connect(audioContext.destination);}
  await audioContext.resume();if(muted)return;
  const now=audioContext.currentTime;[523.25,659.25,783.99].forEach((hz,i)=>{const osc=audioContext.createOscillator(),env=audioContext.createGain();osc.type='sine';osc.frequency.value=hz;const start=now+i*.16;env.gain.setValueAtTime(0,start);env.gain.linearRampToValueAtTime(.45,start+.035);env.gain.exponentialRampToValueAtTime(.001,start+1.2);osc.connect(env);env.connect(master);osc.start(start);osc.stop(start+1.3);});
  audioStatus.textContent='Playing: a soft rising three-note bell, then silence.';
 }catch(_){audioStatus.textContent='This browser could not play the cue. Intended sound: a quiet, rising three-note bell.';}
});
