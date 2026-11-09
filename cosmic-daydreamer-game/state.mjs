// Pure game rules: renderer and controls dispatch the same events.
export const dreams = [
 {id:'whale',stage:1,name:'The cloud that dreamed',hint:'Visit the cloud beside the little crescent pool.'},
 {id:'rock',stage:2,name:'The wandering pebble',hint:'Look for the small rock with a very big wish to wander.'},
 {id:'flower',stage:2,name:'A wish in bloom',hint:'The pink flower is dreaming of growing taller than Nova.'},
 {id:'star',stage:3,name:'The dancing star',hint:'Follow the golden star beside the glowing tree.'},
 {id:'hidden',stage:3,name:'A dream within a dream',hint:'Enter the moon door. Find the golden star among the blue blossoms.'}
];
export function initialState(){return {phase:'ready',stage:1,realm:'planet',revealed:[],collected:[],returnPhase:'playing'};}
export function isExploring(s){return s.phase==='playing'||s.phase==='wandering';}
export function canDiscover(s,id){const d=dreams.find(d=>d.id===id);return !!d&&isExploring(s)&&d.stage===s.stage&&!s.collected.includes(id)&&(id==='hidden'?s.realm==='dream':s.realm==='planet');}
export function reduceGame(s,event){
 const {type,id}=event;
 if(type==='RESTART')return initialState();
 if(type==='START'&&s.phase==='ready')return {...s,phase:'playing'};
 if(type==='PAUSE'&&isExploring(s))return {...s,phase:'paused',returnPhase:s.phase};
 if(type==='RESUME'&&s.phase==='paused')return {...s,phase:s.returnPhase};
 if(type==='NEXT'&&s.phase==='transition')return {...s,phase:'playing',stage:s.stage+1};
 if(type==='WANDER'&&s.phase==='complete')return {...s,phase:'wandering'};
 if(type==='ENTER_DREAM'&&isExploring(s)&&s.stage===3&&s.collected.includes('star')&&s.realm==='planet')return {...s,realm:'dream'};
 if(type==='LEAVE_DREAM'&&isExploring(s)&&s.realm==='dream')return {...s,realm:'planet'};
 if(type==='REVEAL'&&canDiscover(s,id)&&!s.revealed.includes(id))return {...s,revealed:[...s.revealed,id]};
 if(type==='COLLECT'&&canDiscover(s,id)&&s.revealed.includes(id)){
  const collected=[...s.collected,id],count=collected.length;
  return {...s,collected,phase:count===5?'complete':count===1||count===3?'transition':'playing',realm:count===5?'planet':s.realm};
 }
 return s;
}
