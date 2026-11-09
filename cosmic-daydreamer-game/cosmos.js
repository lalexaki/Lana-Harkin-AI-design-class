import * as T from './vendor/three.module.min.js';

// All scenery is generated locally: no downloaded image assets or runtime requests.
export function createCosmos(scene,camera){
 const skyMaterial=new T.ShaderMaterial({depthWrite:false,depthTest:false,toneMapped:false,uniforms:{time:{value:0},aspect:{value:1}},vertexShader:`varying vec2 uvSky;void main(){uvSky=uv;gl_Position=vec4(position.xy,0.999999,1.0);}`,fragmentShader:`
 precision highp float;
 varying vec2 uvSky;uniform float time;uniform float aspect;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
 float mist(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=mat2(.8,.6,-.6,.8)*p*2.03+3.1;a*=.5;}return v;}
 float starfield(vec2 p,float scale,float seed){vec2 cell=floor(p*scale),f=fract(p*scale)-.5;float h=hash(cell+seed);vec2 offset=vec2(hash(cell+1.4),hash(cell+8.3))*.5-.25;float d=length(f-offset);float core=1.-smoothstep(.009,.065,d);float glow=exp(-d*23.)*.25;float pulse=.72+.28*sin(time*.8+h*30.);return (core+glow)*step(.95,h)*pulse;}
 void main(){vec2 p=(uvSky-.5)*vec2(aspect,1.);vec2 drift=vec2(time*.003,time*.001);float n=mist(p*3.7+drift);float w=mist(p*7.5+vec2(n*2.,-n)+drift*.6);float ribbon=exp(-pow((p.y-.23*sin(p.x*3.)-.08)/.27,2.));
 vec3 color=mix(vec3(.018,.036,.12),vec3(.025,.18,.28),n);
 color+=vec3(.045,.43,.45)*pow(w,2.)*ribbon;
 float green=exp(-length((p-vec2(-.55,.42))*vec2(1.,1.2))*2.7);
 color+=vec3(.40,.57,.22)*green*(.35+n*.8);
 float pink=exp(-length((p-vec2(.58,-.18))*vec2(1.,1.5))*3.);
 color+=vec3(.35,.10,.27)*pink*w;
 color+=vec3(.16,.24,.34)*pow(w,3.)*ribbon;
 float stars=starfield(p,36.,2.)+starfield(p,75.,7.)*.45;
 color+=mix(vec3(.65,.88,1.),vec3(1.,.85,.48),noise(p*90.))*stars;
 gl_FragColor=vec4(color,1.);}`});
 const sky=new T.Mesh(new T.PlaneGeometry(2,2),skyMaterial);sky.frustumCulled=false;sky.renderOrder=-1000;scene.add(sky);scene.background=null;
 let seed=481;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const sphere=new T.SphereGeometry(1,48,32),leafGeo=new T.IcosahedronGeometry(1,1);
 const material=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.9,fog:false,...extra});
 function ball(parent,mat,x,y,z,sx,sy=sx,sz=sx,geometry=sphere){const mesh=new T.Mesh(geometry,mat);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;}
 function texture(kind,variant){const canvas=document.createElement('canvas');canvas.width=768;canvas.height=384;const ctx=canvas.getContext('2d'),image=ctx.createImageData(canvas.width,canvas.height);const color=new T.Color();
  for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){const lon=x/canvas.width*Math.PI*2,lat=(y/canvas.height-.5)*Math.PI,X=Math.cos(lat)*Math.cos(lon),Y=Math.sin(lat),Z=Math.cos(lat)*Math.sin(lon);let h=0;
   for(let i=0;i<5;i++){const f=2**i;h+=Math.sin((X*3.1+Z*1.7)*f+variant)*Math.cos((Y*4.3-X*.8)*f+variant*.7)/f;}
   const detail=Math.sin(X*210+Z*133)*Math.cos(Y*181-X*79)*.035+Math.sin(X*48+Y*23)*Math.cos(Z*36-Y*18)*.018;
   if(kind==='garden'){if(h<-.85)color.setRGB(.035,.32+(h+1.6)*.1,.39+(h+1.6)*.1);else if(h<-.72)color.setRGB(.46,.66,.36);else{const t=Math.max(0,Math.min(1,(h+.7)*.55));color.setRGB(.22+t*.32,.40+t*.31,.13+t*.08);}if(Y<-.12){const rock=new T.Color().setRGB(.16+(h+1.5)*.06,.28+(h+1.5)*.045,.22+(h+1.5)*.035);color.lerp(rock,Math.min(1,(-Y-.12)*3.));}}
   else if(kind==='ocean'){color.setRGB(.045,.24,.46);const contour=Math.sin(h*10+Y*5);if(contour>.78)color.setRGB(.38,.74,.75);if(h>.65)color.setRGB(.83,.66,.38);}
   else{const band=.5+.5*Math.sin(Y*16+h*2.3);color.setRGB(.40+band*.30,.24+band*.34,.38+band*.16);if(band>.84)color.lerp(new T.Color('#ffe2a0'),.5);}
   const k=(y*canvas.width+x)*4;image.data[k]=Math.max(0,Math.min(255,(color.r+detail)*255));image.data[k+1]=Math.max(0,Math.min(255,(color.g+detail)*255));image.data[k+2]=Math.max(0,Math.min(255,(color.b+detail)*255));image.data[k+3]=255;}
  ctx.putImageData(image,0,0);if(kind==='garden'){for(let j=0;j<7000;j++){const x=Math.floor(random()*768),y=Math.floor(random()*384),k=(y*768+x)*4;if(image.data[k+1]<image.data[k+2]*1.15)continue;ctx.strokeStyle=j%3?'rgba(204,224,128,.14)':'rgba(16,58,37,.15)';ctx.lineWidth=.8+random()*1.4;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+2,y-1,x+2+random()*4,y-2-random()*2);ctx.stroke();}}const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t;}
 const sparkleCanvas=document.createElement('canvas');sparkleCanvas.width=sparkleCanvas.height=64;const sc=sparkleCanvas.getContext('2d'),halo=sc.createRadialGradient(32,32,0,32,32,32);halo.addColorStop(0,'rgba(255,246,191,.9)');halo.addColorStop(.14,'rgba(255,220,128,.45)');halo.addColorStop(1,'rgba(255,210,110,0)');sc.fillStyle=halo;sc.fillRect(0,0,64,64);const haloImage=document.createElement('canvas');haloImage.width=haloImage.height=64;haloImage.getContext('2d').drawImage(sparkleCanvas,0,0);const haloMap=new T.CanvasTexture(haloImage);sc.fillStyle='#fff0b0';sc.beginPath();sc.moveTo(32,10);sc.quadraticCurveTo(35,29,47,32);sc.quadraticCurveTo(35,35,32,54);sc.quadraticCurveTo(29,35,17,32);sc.quadraticCurveTo(29,29,32,10);sc.fill();const starMap=new T.CanvasTexture(sparkleCanvas);
 const planets=[];const backdrop=new T.Group();camera.add(backdrop);scene.add(camera);
 function paint(base,light,dark){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=base;ctx.fillRect(0,0,256,256);for(let i=0;i<3500;i++){ctx.globalAlpha=.08+random()*.17;ctx.fillStyle=i%3?light:dark;ctx.beginPath();ctx.ellipse(random()*256,random()*256,1+random()*7,.6+random()*2,random()*2,0,Math.PI*2);ctx.fill();}const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;return map;}
 const leafMaterial=material(0xa8c978,{map:paint('#376745','#91b869','#234338')}),trunkMaterial=material(0xc1a177,{map:paint('#7f6847','#c2ab7d','#3f493b')}),cloudMaterial=material(0xe2f4e6,{transparent:true,opacity:.65,depthWrite:false});
 function neighbor(kind,x,y,r,variant){const root=new T.Group();root.scale.setScalar(r);backdrop.add(root);const surface=new T.Group();root.add(surface);const map=texture(kind,variant);const globe=ball(surface,material(0xffffff,{map,bumpMap:map,bumpScale:.035}),0,0,0,1);if(kind==='garden'){globe.geometry=sphere.clone();const a=globe.geometry.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i),z=a.getZ(i),r=1+.018*Math.sin(x*9+variant)*Math.sin(z*8+y*4)+.012*Math.cos(y*11-x*3);a.setXYZ(i,x*r,y*r,z*r);}globe.geometry.computeVertexNormals();}
  // A transparent rim preserves the shaded globe beneath it.
  const atmosphere=new T.Mesh(sphere,new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{tint:{value:new T.Color(kind==='garden'?0x8bcf65:0x67bbdd)}},vertexShader:'varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 n;varying vec3 v;uniform vec3 tint;void main(){float a=pow(1.-max(dot(normalize(n),normalize(v)),0.),3.);gl_FragColor=vec4(tint,a*.24);}'}));atmosphere.scale.setScalar(1.045);root.add(atmosphere);
  const clouds=new T.Group();root.add(clouds);
  if(kind==='garden'){
   // Radial tree clusters make the worlds feel inhabited, not smooth marbles.
   const crowns=new T.InstancedMesh(leafGeo,leafMaterial,192),trunks=new T.InstancedMesh(new T.CylinderGeometry(.016,.023,.17,6),trunkMaterial,24),flowers=new T.InstancedMesh(new T.SphereGeometry(.012,5,4),material(0xffe7a3,{emissive:0xd7af44,emissiveIntensity:.15}),70);surface.add(crowns,trunks,flowers);const dummy=new T.Object3D(),up=new T.Vector3(0,1,0);
   for(let i=0;i<24;i++){const a=i*2.3999+variant,n=new T.Vector3(Math.cos(a)*.75,.3+random()*.7,Math.sin(a)*.75).normalize();dummy.position.copy(n).multiplyScalar(1.06);dummy.quaternion.setFromUnitVectors(up,n);dummy.scale.setScalar(1);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);for(let j=0;j<8;j++){dummy.position.copy(n).multiplyScalar(1.15+(j%3)*.045);dummy.position.x+=Math.sin(j*2.4)*.055;dummy.position.z+=Math.cos(j*2.4)*.055;dummy.scale.set(.072,.06,.078);dummy.updateMatrix();crowns.setMatrixAt(i*8+j,dummy.matrix);crowns.setColorAt(i*8+j,new T.Color().setHSL(.20+random()*.09,.36,.55+random()*.24));}}
   for(let i=0;i<70;i++){const n=new T.Vector3(random()-.5,random()-.1,random()-.5).normalize();dummy.position.copy(n).multiplyScalar(1.012);dummy.quaternion.identity();dummy.scale.setScalar(.7+random());dummy.updateMatrix();flowers.setMatrixAt(i,dummy.matrix);}
   // A tiny hillside cottage with a warm arched doorway and grassy roof.
   const house=new T.Group(),n=new T.Vector3(-.08,.65,.76).normalize();house.position.copy(n).multiplyScalar(.94);house.quaternion.setFromUnitVectors(up,n);house.scale.setScalar(1.3);surface.add(house);
   ball(house,material(0xe1ce9e,{map:paint('#b3a382','#f5dbaa','#8e815f')}),0,.16,0,.24,.25,.19);
   ball(house,material(0xa1bf64,{map:leafMaterial.map}),0,.37,-.015,.30,.12,.25);
   ball(house,material(0x7b674d),0,.13,.174,.104,.15,.025);
   ball(house,material(0xffdb80,{emissive:0xffc153,emissiveIntensity:1.1}),0,.16,.198,.065,.088,.012);const windowGlow=new T.Sprite(new T.SpriteMaterial({map:haloMap,color:0xffda85,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));windowGlow.position.set(0,.16,.23);windowGlow.scale.setScalar(.5);house.add(windowGlow);
   const beamMat=material(0xc8a96f,{map:trunkMaterial.map});
   for(let j=0;j<5;j++){const plank=new T.Mesh(new T.BoxGeometry(.022,.28,.018),beamMat);plank.position.set((j-2)*.065,.12,.187);house.add(plank);}
   for(const side of [-1,1]){ball(house,beamMat,side*.15,.17,.18,.052,.068,.022);ball(house,material(0xffdc81,{emissive:0xf2bd56,emissiveIntensity:1.1}),side*.15,.17,.204,.035,.049,.01);}
   const gardenMat=material(0xb6ce79,{map:leafMaterial.map});for(let j=0;j<8;j++){const a=j*2.4;ball(house,gardenMat,Math.sin(a)*.30,-.02,Math.cos(a)*.23,.065,.05,.068);}
   const cross=material(0x8b6737);ball(house,cross,0,.16,.215,.006,.09,.006);ball(house,cross,0,.16,.215,.065,.006,.006);
   for(let j=0;j<4;j++)ball(house,material(0xc4bda2),0,-.015,.25+j*.08,.13,.025,.045);
  }
  if(kind==='gas'){
   for(let j=0;j<4;j++){const ring=new T.Mesh(new T.RingGeometry(1.25+j*.13,1.32+j*.13,96),new T.MeshBasicMaterial({color:[0xfbe2a2,0xceb0ca,0x8fc9cd,0xeac89b][j],side:T.DoubleSide,transparent:true,opacity:.46,fog:false,depthWrite:false}));ring.rotation.x=1.15;ring.rotation.y=.2;root.add(ring);}
  }else{for(let j=0;j<8;j++){const a=j*.84+variant,n=new T.Vector3(Math.cos(a),.25+Math.sin(j)*.45,Math.sin(a)).normalize();const patch=new T.Group();patch.position.copy(n).multiplyScalar(1.035);patch.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n);clouds.add(patch);for(let k=0;k<3;k++)ball(patch,cloudMaterial,(k-1)*.08,0,0,.12,.025,.07);}}
  planets.push({root,surface,clouds,x,y,r,phase:variant});return root;
 }
 neighbor('garden',-.37,.20,8.3,1.5);
 neighbor('garden',.37,.23,6.1,5.2);
 neighbor('gas',.06,.38,3.5,2.7);
 neighbor('ocean',.47,-.17,3.8,4.6);
 const glints=[];for(let i=0;i<42;i++){const g=new T.Sprite(new T.SpriteMaterial({map:starMap,color:i%3?0xffe6a7:0xb6eef1,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false}));backdrop.add(g);const size=.35+random()*.55;g.scale.setScalar(size);glints.push({g,x:random()-.5,y:random()-.5,depth:78+random()*30,phase:random()*6});}
 const shooting=new T.Group();backdrop.add(shooting);const lineMat=new T.LineBasicMaterial({color:0xffefbd,transparent:true,opacity:0,depthWrite:false,fog:false});const line=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(-4,-1.3,0),new T.Vector3()]),lineMat);shooting.add(line);
 const head=ball(shooting,new T.MeshBasicMaterial({color:0xfff2c2,fog:false}),0,0,0,.09);
 return {update(time,reduced){const t=reduced?0:time;skyMaterial.uniforms.time.value=t;skyMaterial.uniforms.aspect.value=camera.aspect;const distance=90,height=2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*distance,width=height*camera.aspect;
  for(const glint of glints){const d=glint.depth/90;glint.g.position.set(glint.x*width*d+Math.sin(t*.08+glint.phase)*.12,glint.y*height*d,-glint.depth);glint.g.material.opacity=.38+.3*Math.sin(t*.5+glint.phase);}
  for(const p of planets){p.root.position.set(p.x*width+Math.sin(t*.09+p.phase)*.35,p.y*height+Math.sin(t*.13+p.phase)*.4,-distance);p.surface.rotation.y=t*.016+(p.phase===1.5?-.25:.22);p.surface.rotation.z=.18*Math.sin(p.phase);p.clouds.rotation.y=t*.04;p.root.rotation.z=Math.sin(t*.07+p.phase)*.025;}
  const cycle=t%27,show=!reduced&&cycle>19&&cycle<21;shooting.visible=show;if(show){const f=(cycle-19)/2;shooting.position.set((- .25+f*.55)*width,(.12+f*.24)*height,-88);lineMat.opacity=Math.sin(f*Math.PI)*.7;head.material.transparent=true;head.material.opacity=lineMat.opacity;}
 }};
}
