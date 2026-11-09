import * as T from './vendor/three.module.min.js';

// Original procedural brush textures and true 3D scenery, shared across meshes.
export function makeWoodland(planet,scene){
 let seed=127;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 function painted(base,light,dark){const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d');c.fillStyle=base;c.fillRect(0,0,512,512);for(let i=0;i<11000;i++){c.globalAlpha=.04+random()*.16;c.fillStyle=i%3?light:dark;const x=random()*512,y=random()*512;c.beginPath();c.ellipse(x,y,1+random()*10,.5+random()*2,random()*2,0,Math.PI*2);c.fill();}const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=4;return texture;}
 const grassMap=painted('#466b39','#a7bc5e','#183e35'),leafMap=painted('#386d46','#b0c978','#153d36'),barkMap=painted('#776046','#cfb684','#303d34'),rockMap=painted('#435a51','#7f9c71','#172d33');
 function material(color,map=null,extra={}){return new T.MeshStandardMaterial({color,map,roughness:1,metalness:0,...extra});}
 const ground=material(0xffffff,grassMap,{bumpMap:grassMap,bumpScale:.055}),rock=material(0xffffff,rockMap,{bumpMap:rockMap,bumpScale:.15}),leaf=material(0xffffff,leafMap),bark=material(0xffffff,barkMap);
 const sphere=new T.SphereGeometry(1,18,12),leafGeo=new T.SphereGeometry(1,8,6);
 function ball(parent,m,x,y,z,sx,sy=sx,sz=sx){const o=new T.Mesh(sphere,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function box(parent,m,x,y,z,sx,sy,sz){const o=new T.Mesh(new T.BoxGeometry(sx,sy,sz),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 // Rough, moss-covered rim. Walkable ground remains level for existing controls.
 const hills=new T.InstancedMesh(sphere,ground,42),dummy=new T.Object3D();planet.add(hills);hills.receiveShadow=true;hills.castShadow=true;
 for(let i=0;i<42;i++){const a=i/42*Math.PI*2,r=11.1+random()*.35;dummy.position.set(Math.sin(a)*r,.45,Math.cos(a)*r);dummy.scale.set(.65+random()*.5,.16+random()*.5,.65+random()*.5);dummy.rotation.set(0,a,0);dummy.updateMatrix();hills.setMatrixAt(i,dummy.matrix);hills.setColorAt(i,new T.Color().setHSL(.22+random()*.08,.28,.65+random()*.2));}
 // Multi-layer crowns with individual broad leaves; one instanced draw per tree.
 function tree(x,z,size){const root=new T.Group();root.position.set(x,.55,z);root.scale.setScalar(size);planet.add(root);const trunk=new T.Mesh(new T.CylinderGeometry(.16,.34,2.6,9),bark);trunk.position.y=1.3;trunk.rotation.z=.08;root.add(trunk);trunk.castShadow=true;
  const clusters=new T.InstancedMesh(leafGeo,leaf,85);root.add(clusters);clusters.castShadow=true;clusters.receiveShadow=true;
  for(let i=0;i<85;i++){const a=random()*Math.PI*2,h=random(),r=Math.sqrt(random())*(1.4-h*.65);dummy.position.set(Math.sin(a)*r,2.15+h*1.9,Math.cos(a)*r);dummy.scale.set(.35+random()*.3,.19+random()*.18,.32+random()*.2);dummy.rotation.set(random()*.5,a,random()*.6);dummy.updateMatrix();clusters.setMatrixAt(i,dummy.matrix);clusters.setColorAt(i,new T.Color().setHSL(.22+random()*.09,.35,.48+random()*.35));}
  for(let i=0;i<4;i++){const branch=new T.Mesh(new T.CylinderGeometry(.04,.13,1.3,7),bark);branch.position.set(Math.sin(i*2)*.45,2,Math.cos(i*2)*.45);branch.rotation.z=Math.sin(i*2)*.8;branch.rotation.x=Math.cos(i*2)*.8;root.add(branch);}
 }
 tree(-9,2,.9);tree(8,-7,1);tree(-4,-10,.85);tree(10,3,.75);tree(-8,7,.65);
 // Grass blades and small leaves follow the edge, keeping discovery routes clear.
 const bladeShape=new T.Shape();bladeShape.moveTo(-.05,0);bladeShape.quadraticCurveTo(-.08,.22,.09,.45);bladeShape.quadraticCurveTo(.02,.12,.05,0);const blades=new T.InstancedMesh(new T.ShapeGeometry(bladeShape),material(0x9ab95a,null,{side:T.DoubleSide}),1100);planet.add(blades);
 for(let i=0;i<1100;i++){const a=random()*Math.PI*2,r=8.8+random()*2.9;dummy.position.set(Math.cos(a)*r,.59,Math.sin(a)*r);dummy.rotation.set(0,random()*Math.PI*2,(random()-.5)*.5);dummy.scale.setScalar(.45+random()*.8);dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix);blades.setColorAt(i,new T.Color().setHSL(.19+random()*.12,.5,.35+random()*.25));}
 const cap=material(0xcf9875,painted('#cc9879','#ffdc94','#735744')),stem=material(0xe7d4a4,barkMap);
 for(let i=0;i<30;i++){const a=i*2.4,r=9+random()*2;const x=Math.cos(a)*r,z=Math.sin(a)*r,s=.3+random()*.6;ball(planet,stem,x,.65+s*.25,z,.07*s,.3*s,.07*s);ball(planet,cap,x,.65+s*.52,z,.32*s,.17*s,.32*s);for(let j=0;j<3;j++)ball(planet,material(0xffe6ae),x+(j-1)*s*.1,.7+s*.6,z+.09*s,.035*s);}
 // Trailing ivy follows the curved underside instead of ending at a hard platform edge.
 const vines=new T.Group();planet.add(vines);const vineMat=material(0x49733e,barkMap),ivyMat=material(0x8eaf59,leafMap);
 for(let i=0;i<12;i++){const a=i*Math.PI*2/12+.2,r=11.7,len=1.4+random()*2;const points=[];for(let k=0;k<6;k++){const d=k/5,rr=r-d*.9;points.push(new T.Vector3(Math.sin(a+d*.08)*rr,.45-d*len,Math.cos(a+d*.08)*rr));}const curve=new T.CatmullRomCurve3(points);const stemMesh=new T.Mesh(new T.TubeGeometry(curve,15,.035,5,false),vineMat);vines.add(stemMesh);for(let k=0;k<8;k++){const p=curve.getPoint(k/8);const l=ball(vines,ivyMat,p.x+Math.cos(a)*(k%2?.13:-.13),p.y,p.z,.16,.08,.25);l.rotation.set(.4,a,k%2?.5:-.5);}}
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=64;const gc=glowCanvas.getContext('2d'),gr=gc.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,237,163,.75)');gr.addColorStop(.2,'rgba(255,210,103,.28)');gr.addColorStop(1,'rgba(255,190,64,0)');gc.fillStyle=gr;gc.fillRect(0,0,64,64);const glowTexture=new T.CanvasTexture(glowCanvas);
 function glow(parent,x,y,z,size){const sprite=new T.Sprite(new T.SpriteMaterial({map:glowTexture,color:0xffdb85,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));sprite.position.set(x,y,z);sprite.scale.setScalar(size);parent.add(sprite);return sprite;}
 function cottage(x,z,rotation){const h=new T.Group();h.position.set(x,.6,z);h.rotation.y=rotation;planet.add(h);const plaster=material(0xe2cda0,painted('#c3b089','#f5e6b9','#736649'));ball(h,plaster,0,.85,0,1.35,1.25,.95);ball(h,ground,0,1.75,-.1,1.6,.65,1.15);box(h,bark,0,.6,.91,.72,1.2,.13);ball(h,bark,0,1.12,.94,.36,.3,.1);
  const warm=material(0xffdc86,null,{emissive:0xffba40,emissiveIntensity:1.7});ball(h,warm,0,.95,1.03,.23,.3,.025);box(h,bark,0,.95,1.07,.045,.6,.04);box(h,bark,0,.95,1.07,.45,.045,.04);glow(h,0,1,1.08,3.5);
  for(const side of [-1,1]){ball(h,bark,side*.8,.8,.72,.26,.3,.09);ball(h,warm,side*.8,.8,.8,.18,.22,.03);glow(h,side*.8,.8,.85,1.6);}
  const lamp=new T.PointLight(0xffcd74,3,6,2);lamp.position.set(0,1.4,1.8);h.add(lamp);for(let i=0;i<4;i++)box(h,rock,0,.08-i*.02,1.2+i*.28,.9,.12,.3);
  for(let i=0;i<12;i++){const a=i*2.4;ball(h,leaf,Math.sin(a)*1.25,.3,Math.cos(a)*.9,.35,.25,.3);}
  box(h,bark,.75,2,-.28,.28,1,.3);
 }
 cottage(-8,-6.8,.7);cottage(8.9,-3,-.3);
 // Warm pinpricks and halos remain depth-tested inside the 3D garden.
 const fireflies=new T.Group();planet.add(fireflies);const lights=[];
 for(let i=0;i<26;i++){const a=random()*Math.PI*2,r=3+random()*8,x=Math.cos(a)*r,z=Math.sin(a)*r,y=1+random()*2.5;const s=glow(fireflies,x,y,z,.35+random()*.3);lights.push({s,x,y,z,phase:random()*6});}
 return {ground,rock,leafMap,barkMap,update(time,reduced){const t=reduced?0:time;for(const p of lights){p.s.position.set(p.x+Math.sin(t*.25+p.phase)*.2,p.y+Math.sin(t*.45+p.phase)*.25,p.z);p.s.material.opacity=.55+Math.sin(t*.7+p.phase)*.2;}}};
}
