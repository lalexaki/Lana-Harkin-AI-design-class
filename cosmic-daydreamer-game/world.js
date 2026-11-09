import * as T from './vendor/three.module.min.js';
import {makeWoodland} from './woodland.js?v=combined1';
import {createCosmos} from './cosmos.js?v=storybook2';
const C={cream:0xffefd0,lavender:0xa6a0d4,pink:0xefb8d4,mint:0xa7ded7,gold:0xffe3a0,navy:0x293454};
const mat=(color,emissive=0,intensity=0)=>new T.MeshStandardMaterial({color,roughness:.78,metalness:.02,emissive,emissiveIntensity:intensity});
const sphere=new T.SphereGeometry(1,20,14),lowSphere=new T.IcosahedronGeometry(1,1);
function mesh(g,m,parent,x=0,y=0,z=0,sx=1,sy=sx,sz=sx){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
function orb(parent,m,x,y,z,sx,sy=sx,sz=sx){return mesh(sphere,m,parent,x,y,z,sx,sy,sz);}
function tube(parent,points,r,material){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),20,r,7,false),material,parent);}
function starGeo(size=.5){const s=new T.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,r=i%2?size*.46:size,x=Math.cos(a)*r,y=Math.sin(a)*r;i?s.lineTo(x,y):s.moveTo(x,y);}s.closePath();const g=new T.ExtrudeGeometry(s,{depth:.13,bevelEnabled:true,bevelThickness:.06,bevelSize:.04,bevelSegments:2,steps:1});g.translate(0,0,-.065);return g;}
const starGeometry=starGeo(.5);
function star(parent,x,y,z,size=1,color=C.gold){const s=mesh(starGeometry,mat(color,color,.55),parent,x,y,z,size);return s;}
function disc(parent,radius,color,x,y,z,opacity=.2){const m=new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:T.DoubleSide});const d=mesh(new T.CircleGeometry(radius,40),m,parent,x,y,z);d.rotation.x=-Math.PI/2;return d;}
function flower(parent,x,z,color,scale=1){const f=new T.Group();f.position.set(x,.55,z);f.scale.setScalar(scale);parent.add(f);const stem=mat(0x75a6aa),petal=mat(color,color,.06);mesh(new T.CylinderGeometry(.035,.055,.7,6),stem,f,0,.35,0);orb(f,stem,.17,.27,0,.24,.065,.10).rotation.z=.45;const head=new T.Group();head.position.y=.78;f.add(head);for(let j=0;j<5;j++){const a=j*Math.PI*2/5;orb(head,petal,Math.cos(a)*.2,Math.sin(a)*.2,0,.2,.16,.10).rotation.z=a;}orb(head,mat(C.gold,C.gold,.15),0,0,.08,.12);head.rotation.x=-.35;return f;}
function cloud(parent){const g=new T.Group();parent.add(g);const m=mat(0xe1dff3);[[-1,0,0,1.2,.6,.7],[0,.25,0,1.1,.85,.8],[1.05,.05,0,.9,.6,.7],[.1,-.15,.4,1.7,.35,.6]].forEach(a=>orb(g,m,...a));return g;}
function arch(parent,x,z,color=C.pink,scale=1){const g=new T.Group();g.position.set(x,.55,z);g.scale.setScalar(scale);parent.add(g);const m=mat(color,color,.13);mesh(new T.CylinderGeometry(.15,.2,2.5,12),m,g,-1.15,1.25,0);mesh(new T.CylinderGeometry(.15,.2,2.5,12),m,g,1.15,1.25,0);const crown=mesh(new T.TorusGeometry(1.15,.16,10,36,Math.PI),m,g,0,2.5,0);return g;}
export function createWorld(container){
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;container.append(renderer.domElement);
 const scene=new T.Scene();scene.fog=new T.FogExp2(0x777eac,.006);
 const camera=new T.PerspectiveCamera(42,1,.1,180);camera.position.set(19,23,29);camera.lookAt(0,.5,0);

 scene.add(new T.HemisphereLight(0xc7e4dc,0x153e50,1.15));const sunlight=new T.DirectionalLight(0xffe3a4,2.3);sunlight.position.set(-12,22,8);sunlight.castShadow=true;sunlight.shadow.mapSize.set(1024,1024);Object.assign(sunlight.shadow.camera,{left:-17,right:17,top:17,bottom:-17,near:1,far:60});sunlight.shadow.bias=-.001;scene.add(sunlight);const rim=new T.DirectionalLight(0x9ce5ff,1.2);rim.position.set(8,5,-14);scene.add(rim);
 const universe=new T.Group(),planet=new T.Group(),dream=new T.Group();scene.add(universe,planet,dream);dream.visible=false;
 const woodland=makeWoodland(planet,scene);
 const cosmos=createCosmos(scene,camera);
 const soil=woodland.rock,grass=woodland.ground,awakeGrass=new T.Color(0xe4edb6);
 mesh(new T.CylinderGeometry(12.05,11.5,.45,96),grass,planet,0,.345,0).receiveShadow=true;
 mesh(new T.SphereGeometry(1,48,24,0,Math.PI*2,Math.PI/2,Math.PI/2),soil,planet,0,.55,0,12.05,6.8,12.05);
 const rimMesh=mesh(new T.TorusGeometry(11.95,.045,8,90),mat(0x678c58,0x759959,.08),planet,0,.58,0);rimMesh.rotation.x=-Math.PI/2;
 const pond=disc(planet,2.5,0x6383c4,-6,.59,-2,.7);pond.scale.set(1,1,.65);
 for(let i=0;i<4;i++){const ring=mesh(new T.TorusGeometry(1.1+i*.32,.025,5,40),mat(C.mint,C.mint,.4),planet,-6,.61,-2);ring.rotation.x=-Math.PI/2;ring.scale.y=.68;}
 // A meandering trail of warm, flat moonstones.
 const pathMat=mat(0xb6b38c);for(let i=0;i<24;i++){const a=i/23*Math.PI*1.7-.3,r=6.5+Math.sin(i*.7)*.7;const stone=mesh(new T.CylinderGeometry(.37,.42,.08,7),pathMat,planet,Math.sin(a)*r,.62,Math.cos(a)*r,1,.8,.7);stone.rotation.y=i;}
 const flora=[];let seed=27;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<80;i++){const a=rnd()*Math.PI*2,r=8+3.6*rnd();const f=flower(planet,Math.cos(a)*r,Math.sin(a)*r,[0xdd9cc3,0xefc0d7,0x92c9d9][i%3],.35+rnd()*.65);flora.push(f);}
 function tree(x,z,s){const g=new T.Group();g.position.set(x,.55,z);g.scale.setScalar(s);planet.add(g);const trunk=mat(0x78684b),leaf=mat(0x71964f);trunk.map=woodland.barkMap;leaf.map=woodland.leafMap;tube(g,[[0,0,0],[.15,1.7,0],[-.2,3,0],[.2,4.5,0]],.2,trunk);[-1,1].forEach(side=>{tube(g,[[0,2,0],[side*.9,3,.2],[side*1.4,3.8,.1]],.1,trunk);orb(g,leaf,side*1.2,3.7,0,1.25,.75,.85);});orb(g,leaf,.2,4.6,0,1.4,.9,1);for(let i=0;i<5;i++){const a=i*2.4;orb(g,mat(C.mint,C.mint,.65),Math.sin(a)*1.1,3.4+i*.3,Math.cos(a)*.6,.13); }return g;}
 tree(-7,5,.7);tree(7,-5,.75);
 // The dream tree holds little luminous worlds in its branches.
 const dreamTree=new T.Group();dreamTree.position.set(0,.55,-.3);planet.add(dreamTree);
 const bark=mat(0x79b8c7,0x78d6e1,.12),budMat=mat(0xc0f2e9,0x87e3e8,.75);
 tube(dreamTree,[[0,0,0],[-.15,1.3,0],[.15,2.8,0],[0,4.1,0]],.18,bark);
 for(let i=0;i<7;i++){const a=i*2.4,h=2.5+(i%3)*.65,x=Math.sin(a)*1.5,z=Math.cos(a)*1.15;tube(dreamTree,[[0,1.1,0],[x*.5,h*.7,z*.5],[x,h,z]],.09,bark);orb(dreamTree,budMat,x,h+.25,z,.32);star(dreamTree,x,h+.25,z+.3,.25,C.gold);}
 disc(planet,1.9,0xb3e2dd,0,.59,-.3,.23);
 // A few moon crystals and little mushrooms frame the paths.
 for(let i=0;i<16;i++){const a=i*2.4,r=8.5+(i%3)*.7,x=Math.sin(a)*r,z=Math.cos(a)*r;if(i%2===0){const crystal=mesh(new T.ConeGeometry(.18,.8,5),mat(0xa6d9df,0x89dce3,.2),planet,x,.96,z);crystal.rotation.z=.16;}else{mesh(new T.CylinderGeometry(.06,.08,.4,7),mat(C.cream),planet,x,.8,z);orb(planet,mat(0xd7a0c1),x,1.02,z,.29,.15,.29);}}
 const crescent=new T.Shape();crescent.moveTo(1.3,3.4);crescent.bezierCurveTo(-4,3.3,-4,-3.3,1.3,-3.4);crescent.bezierCurveTo(-1.5,-1.6,-1.5,1.6,1.3,3.4);const moon=mesh(new T.ExtrudeGeometry(crescent,{depth:.4,bevelEnabled:true,bevelThickness:.12,bevelSize:.12,bevelSegments:3,steps:1}),mat(0xffdf9c,0xffce79,.3),universe,-12,16,-30);moon.rotation.z=-.2;const secondMoon=orb(universe,mat(C.pink,C.pink,.3),12,18,-26,2);secondMoon.visible=false;
 // Nova: a little ceramic astronaut with a rose scarf and a bright visor.
 const nova=new T.Group();nova.position.set(0,.6,6);scene.add(nova);const suit=mat(0xf5eadc),visor=mat(0x435a7d),rose=mat(C.pink),boots=mat(0x797da6);
 const body=orb(nova,suit,0,.65,0,.43,.55,.32);mesh(new T.BoxGeometry(.5,.55,.22),rose,nova,0,.7,-.33);
 const helmet=orb(nova,suit,0,1.4,0,.58,.55,.51);orb(nova,visor,0,1.43,.37,.45,.35,.2);orb(nova,mat(C.cream,C.cream,.3),-.2,1.56,.53,.08,.05,.025);
 const scarf=mesh(new T.TorusGeometry(.33,.08,8,20),rose,nova,0,1.03,0);scarf.rotation.x=Math.PI/2;mesh(new T.BoxGeometry(.19,.55,.05),rose,nova,.28,.78,.29).rotation.z=-.25;
 const feet=[orb(nova,boots,-.22,.15,.06,.19,.19,.27),orb(nova,boots,.22,.15,.06,.19,.19,.27)];const arms=[orb(nova,suit,-.47,.7,0,.14,.33,.14),orb(nova,suit,.47,.7,0,.14,.33,.14)];helmet.castShadow=body.castShadow=true;
 const shadow=disc(scene,.6,0x4b4e79,0,.59,6,.2);
 const stations={};
 function station(id,x,z,name){const root=new T.Group();root.position.set(x,.6,z);planet.add(root);const ring=mesh(new T.TorusGeometry(1.25,.035,5,50),mat(C.gold,C.gold,.45),root,0,.03,0);ring.rotation.x=-Math.PI/2;const fragment=star(root,0,2.65,0,.8);fragment.visible=false;const beam=mesh(new T.CylinderGeometry(.025,.35,2.2,16,1,true),new T.MeshBasicMaterial({color:C.gold,transparent:true,opacity:.14,depthWrite:false,side:T.DoubleSide}),root,0,1.3,0);beam.visible=false;const object={id,root,ring,fragment,beam,name,point:new T.Vector3(x,.6,z),labelHeight:3};stations[id]=object;return object;}
 const whale=station('whale',-6,-2,'Dreaming cloud');whale.cloud=cloud(whale.root);whale.cloud.position.y=2.1;whale.cloud.scale.setScalar(.8);whale.creature=new T.Group();whale.creature.position.y=2.6;whale.creature.visible=false;whale.root.add(whale.creature);const whaleMat=mat(0xc8c3ef),belly=mat(0xf0d9eb);orb(whale.creature,whaleMat,0,0,0,1.9,.8,.8);orb(whale.creature,belly,-.15,-.27,.1,1.6,.45,.67);orb(whale.creature,whaleMat,1.7,.25,0,.6,.25,.35).rotation.z=.6;orb(whale.creature,whaleMat,2.1,.55,.35,.65,.14,.35).rotation.y=.65;orb(whale.creature,whaleMat,2.1,.55,-.35,.65,.14,.35).rotation.y=-.65;orb(whale.creature,whaleMat,-.1,-.45,.7,.65,.13,.32).rotation.z=-.5;orb(whale.creature,mat(C.navy),-1.12,.1,.68,.075);orb(whale.creature,mat(C.pink),-1.15,-.1,.7,.15,.07,.035);tube(whale.creature,[[-1.65,-.2,.5],[-1.4,-.28,.65],[-1.2,-.22,.72]],.018,mat(C.navy));
 const rock=station('rock',5,-4,'Wandering pebble');rock.creature=new T.Group();rock.root.add(rock.creature);mesh(lowSphere,mat(0x8e9db3),rock.creature,0,.5,0,.7,.65,.58);rock.legs=[orb(rock.creature,mat(0x6e7a9c),-.34,.15,0,.13,.25,.13),orb(rock.creature,mat(0x6e7a9c),.34,.15,0,.13,.25,.13)];for(const x of [-.22,.22])orb(rock.creature,mat(C.navy),x,.62,.49,.055);rock.labelHeight=2.5;
 const bloom=station('flower',6,4,'Sleeping blossom');bloom.creature=flower(bloom.root,0,0,C.pink,1.1);bloom.labelHeight=3.5;
 const dancer=station('star',-4,5,'Dancing star');dancer.creature=star(dancer.root,0,1.65,0,1.35);dancer.labelHeight=3.2;
 const portal=station('portal',0,-8,'Moon door');portal.arch=arch(portal.root,0,0,0xc4b57c);portal.arch.traverse(o=>{if(o.isMesh){o.material.map=woodland.barkMap;o.material.emissiveIntensity=.05;}});portal.labelHeight=4.8;portal.fragment.visible=false;const shape=new T.Shape();shape.moveTo(-.96,0);shape.lineTo(.96,0);shape.lineTo(.96,2.5);shape.absarc(0,2.5,.96,0,Math.PI,false);shape.lineTo(-.96,0);portal.door=mesh(new T.ShapeGeometry(shape),new T.MeshBasicMaterial({color:0x777fc7,transparent:true,opacity:.7,side:T.DoubleSide}),portal.root,0,.55,-.02);star(portal.root,0,2.5,.1,.5);
 // A compact dream garden: a portal changes the whole surrounding space.
 const dreamMeadow=woodland.ground.clone();dreamMeadow.color.set(0xa0c6d1);const dreamFloor=mesh(new T.CylinderGeometry(7,6.8,.45,64),dreamMeadow,dream,0,.275,0);dreamFloor.receiveShadow=true;mesh(new T.SphereGeometry(1,40,20,0,Math.PI*2,Math.PI/2,Math.PI/2),woodland.rock,dream,0,.5,0,7,3.5,7);
 for(let i=0;i<6;i++){const a=i*Math.PI/3;const ar=arch(dream,Math.cos(a)*6,Math.sin(a)*6,[0xd1c7a1,0x8eb9a0][i%2],.7);ar.traverse(o=>{if(o.isMesh)o.material.map=woodland.barkMap;});ar.rotation.y=-a+Math.PI/2;}
 for(let i=0;i<25;i++){const a=rnd()*Math.PI*2,r=3+rnd()*2.6;flower(dream,Math.sin(a)*r,Math.cos(a)*r,0x9bc7ed,.6+rnd()*.7);}
 const hidden=station('hidden',2,-2,'A hidden little star');planet.remove(hidden.root);dream.add(hidden.root);hidden.creature=star(hidden.root,0,1.2,0,.7);hidden.labelHeight=2.6;for(let i=0;i<3;i++)flower(hidden.root,Math.sin(i*2)*.65,Math.cos(i*2)*.55,0x9ab7eb,1.3);hidden.ring.visible=false;
 const rainGeo=new T.BufferGeometry(),rainPositions=new Float32Array(70*3);for(let i=0;i<70;i++){rainPositions[i*3]=(rnd()-.5)*24;rainPositions[i*3+1]=rnd()*10;rainPositions[i*3+2]=(rnd()-.5)*24;}rainGeo.setAttribute('position',new T.BufferAttribute(rainPositions,3));const rain=new T.Points(rainGeo,new T.PointsMaterial({color:C.gold,size:.14,transparent:true,opacity:.8}));scene.add(rain);rain.visible=false;
 let elapsed=0,lastRealm='planet',moving=false,ambient='',ambientEnd=0;const target=new T.Vector3();const pickPlane=new T.Plane(new T.Vector3(0,1,0),-.6),raycaster=new T.Raycaster();
 function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;const distance=w/h<.8?1.48:w/h<1.2?1.2:1;camera.position.set(19*distance,23*distance,29*distance);camera.lookAt(0,0,0);camera.updateProjectionMatrix();}
 new ResizeObserver(resize).observe(container);resize();
 function setRealm(realm){if(realm===lastRealm)return;lastRealm=realm;planet.visible=realm==='planet';dream.visible=realm==='dream';nova.position.set(0,.6,realm==='dream'?4: -5.8);scene.fog.color.set(realm==='dream'?0xc4a3c6:0x9695c8);}
 function reset(){lastRealm='dream';setRealm('planet');nova.position.set(0,.6,6);bloom.creature.scale.setScalar(1.1);elapsed=0;ambient='';ambientEnd=0;}
 function update(s,dt,settings){
  setRealm(s.realm);if(dt>0)elapsed+=dt;const t=settings.reduced?0:elapsed,count=s.collected.length;
  const awaken=count/5;grass.color.set(0xb1c3ac).lerp(awakeGrass,awaken);soil.color.set(0xaab6a5).lerp(new T.Color(0xb4c6a7),awaken);sunlight.intensity=2.3+awaken*.35;
  for(const [id,st]of Object.entries(stations)){const revealed=s.revealed.includes(id),done=s.collected.includes(id),stage=id==='whale'?1:id==='rock'||id==='flower'?2:3;
   const available=s.stage>=stage,belongs=(id==='hidden')===(s.realm==='dream');st.ring.visible=belongs&&available&&!done&&settings.guidance&&id!=='hidden';st.fragment.visible=revealed&&!done&&id!=='portal';st.beam.visible=st.fragment.visible;st.fragment.position.y=2.7+Math.sin(t*2)*.1;st.fragment.rotation.y=t*.7;st.ring.material.opacity=.6;
  }
  whale.cloud.visible=!s.revealed.includes('whale');whale.creature.visible=s.revealed.includes('whale');whale.creature.position.y=2.6+Math.sin(t*.7)*.2;whale.creature.rotation.z=Math.sin(t*.8)*.04;whale.cloud.position.y=2.1+Math.sin(t*.5)*.08;
  const walking=s.revealed.includes('rock');rock.creature.position.x=walking?Math.sin(t*.8)*.65:0;rock.creature.rotation.z=walking?Math.sin(t*3)*.07:0;rock.legs.forEach((l,i)=>l.position.y=.13+(walking?Math.sin(t*3+i*Math.PI)*.08:0));
  const big=s.revealed.includes('flower')?2.8:1.1;const sc=bloom.creature.scale.x;bloom.creature.scale.setScalar(settings.reduced?big:T.MathUtils.lerp(sc,big,Math.min(1,dt*3)));bloom.creature.rotation.z=Math.sin(t)*.025;
  dancer.creature.position.y=1.65+Math.sin(t*1.5)*.18;dancer.creature.rotation.z=Math.sin(t)*.2;dancer.creature.visible=!s.collected.includes('star');portal.door.material.color.set(s.collected.includes('star')?0xb8e8e4:0x777fc7);portal.door.material.opacity=s.collected.includes('star')?.82:.4;
  hidden.creature.rotation.y=t*.7;hidden.creature.visible=!s.revealed.includes('hidden');
  for(let i=0;i<flora.length;i++){flora[i].rotation.z=Math.sin(t*.9+i)*.035;flora[i].scale.y=.3+(i%7)/12+awaken*.45;}
  shadow.position.set(nova.position.x,.59,nova.position.z);nova.position.y=.6+(moving&&!settings.reduced?Math.abs(Math.sin(t*8))*.07:0);feet.forEach((f,i)=>f.position.z=.06+(moving?Math.sin(t*8+i*Math.PI)*.15:0));arms.forEach((f,i)=>f.rotation.x=moving?Math.sin(t*8+i*Math.PI)*.25:0);
  secondMoon.visible=ambient==='moon'&&elapsed<ambientEnd;rain.visible=(ambient==='rain'&&elapsed<ambientEnd||count===5)&&!settings.reduced;if(rain.visible){const arr=rain.geometry.attributes.position.array;for(let i=1;i<arr.length;i+=3)arr[i]=(arr[i]+dt*.8)%12;rain.geometry.attributes.position.needsUpdate=true;}
  if(ambient==='ocean'&&elapsed<ambientEnd)grass.color.lerp(new T.Color(0x8acbd6),.6);cosmos.update(elapsed,settings.reduced);woodland.update(elapsed,settings.reduced);
  renderer.render(scene,camera);
 }
 function move(dx,dz,dt){const length=Math.hypot(dx,dz);moving=length>.01;if(!moving)return;const speed=3.8;const forward=new T.Vector3(-camera.position.x,0,-camera.position.z).normalize();const right=new T.Vector3(-forward.z,0,forward.x);const velocity=right.multiplyScalar(dx/Math.max(1,length)).add(forward.multiplyScalar(dz/Math.max(1,length))).multiplyScalar(speed*dt);nova.position.add(velocity);const limit=lastRealm==='dream'?5.8:10.9;if(Math.hypot(nova.position.x,nova.position.z)>limit){const len=Math.hypot(nova.position.x,nova.position.z);nova.position.x*=limit/len;nova.position.z*=limit/len;}nova.rotation.y=Math.atan2(velocity.x,velocity.z);}
 function walkTo(point,dt){const d=point.clone().sub(nova.position);d.y=0;const distance=d.length();if(distance<.15){moving=false;return true;}moving=true;d.normalize();nova.position.addScaledVector(d,Math.min(distance,3.8*dt));nova.rotation.y=Math.atan2(d.x,d.z);return false;}
 function groundAt(clientX,clientY){const r=renderer.domElement.getBoundingClientRect();raycaster.setFromCamera(new T.Vector2((clientX-r.left)/r.width*2-1,-(clientY-r.top)/r.height*2+1),camera);const hit=raycaster.ray.intersectPlane(pickPlane,target);if(!hit)return null;const limit=lastRealm==='dream'?5.8:10.9;const point=hit.clone();const len=Math.hypot(point.x,point.z);if(len>limit){point.x*=limit/len;point.z*=limit/len;}return point;}
 function project(st){const p=st.root.getWorldPosition(new T.Vector3());p.y+=st.labelHeight;p.project(camera);return {x:(p.x*.5+.5)*container.clientWidth,y:(-.5*p.y+.5)*container.clientHeight,visible:p.z<1};}
 return {renderer,scene,camera,nova,stations,update,move,walkTo,groundAt,project,reset,stop:()=>{moving=false;},ambient:type=>{ambient=type;ambientEnd=elapsed+7;},distance:st=>Math.hypot(nova.position.x-st.point.x,nova.position.z-st.point.z)};
}
