const cv=$('c'),cx=cv.getContext('2d'),BS=400,WS=3200;
const W=[{n:'កាំភ្លើងខ្លី',p:0,r:300,d:1,k:1},{n:'កាំភ្លើង SMG',p:100,r:110,d:1,k:1},{n:'កាំភ្លើងបាញ់ចៀស',p:250,r:700,d:1,k:5},{n:'កាំភ្លើងវែង',p:500,r:220,d:3,k:1}];
const MIS=[10,25,50,100,200];
const LM={'3,3':['វិមានឯករាជ្យ','#ddd'],'4,1':['វាំងព្រះរាជ','#e8b923'],'2,4':['ផ្សារកណ្ដាល','#d9a066'],'5,5':['វត្តភ្នំ','#fff']};
const K={},J={x:0,y:0,fire:0};
onkeydown=e=>{K[e.key.toLowerCase()]=1;if(e.key.toLowerCase()=='e')G.use()};
onkeyup=e=>K[e.key.toLowerCase()]=0;
onresize=()=>{cv.width=innerWidth;cv.height=innerHeight};onresize();
const rnd=(a,b)=>a+Math.random()*(b-a);
const hs=(i,j)=>((i*73856093^j*19349663)>>>0)%1000/1000;
const solid=(x,y)=>{if(x<10||y<10||x>2850||y>WS-10)return 1;const i=x/BS|0,j=y/BS|0,lx=x-i*BS,ly=y-j*BS;return lx>65&&lx<335&&ly>65&&ly<335&&!LM[i+','+j]};
const free=()=>{let x,y;do{x=rnd(20,2840);y=rnd(20,3180)}while(solid(x,y));return[x,y]};

const G={run:0,pause:0,god:0,boost:1,p:null,
start(){
 const d=Store.data;$('menu').classList.add('h');$('over').classList.add('h');
 this.p={x:400,y:430,a:0,hp:100,v:null,t:0};this.m=d.mission;this.mc=0;
 this.cars=[];this.en=[];this.it=[];this.bl=[];this.mt=0;
 for(let i=0;i<18;i++){const k=1+Math.random()*5|0,h=Math.random()<.5,o=Math.random()<.5?-20:20;
  this.cars.push({x:h?rnd(100,2700):k*400+o,y:h?k*400+o:rnd(100,3100),a:h?0:1.57,v:0,c:`hsl(${Math.random()*360|0},70%,50%)`})}
 for(let i=0;i<40;i++){const[x,y]=free();this.it.push({x,y,t:i<30?'c':i<38?'h':'k'})}
 for(let i=0;i<10;i++){const[x,y]=free();this.en.push({x,y,hp:3})}
 this.say('ស្វាគមន៍មកភ្នំពេញ! E = លួចឡាន');this.run=1;this.pause=0},
say(t){this.msg=t;this.mt=150},
use(){const p=this.p;if(!this.run||this.pause)return;
 if(p.v){const v=p.v;p.x=v.x+Math.cos(v.a+1.57)*30;p.y=v.y+Math.sin(v.a+1.57)*30;if(solid(p.x,p.y)){p.x=v.x;p.y=v.y}p.v=null;v.v=0;return}
 let b=null,bd=55;this.cars.forEach(c=>{const q=Math.hypot(c.x-p.x,c.y-p.y);if(q<bd){bd=q;b=c}});
 if(b){p.v=b;b.v=0;this.say('🚗 លួចឡានបាន!')}},
hit(e,d){e.hp-=d;if(e.hp<=0&&!e.dead){e.dead=1;this.it.push({x:e.x,y:e.y,t:'c'},{x:e.x+9,y:e.y,t:'c'})}},
chk(){const g=MIS[Math.min(this.m,MIS.length-1)];
 if(this.mc>=g){Store.data.coins+=g*2;this.say('✅ បេសកកម្មជោគជ័យ! +'+g*2+' 💰');this.m++;this.mc=0;Store.data.mission=this.m;Store.save()}},
upd(){
 const p=this.p,d=Store.data,v=p.v,cl=x=>Math.max(-1,Math.min(1,x));
 let ax=cl(J.x+((K.d||K.arrowright)?1:0)-((K.a||K.arrowleft)?1:0)),ay=cl(J.y+((K.s||K.arrowdown)?1:0)-((K.w||K.arrowup)?1:0));
 if(v){
  v.v=Math.max(-3,Math.min(9*this.boost,(v.v-ay*.25)*.985));
  v.a+=ax*.045*Math.sign(v.v)*Math.min(1,Math.abs(v.v)/3);
  const c=Math.cos(v.a),s=Math.sin(v.a),nx=v.x+c*v.v,ny=v.y+s*v.v;
  if(solid(nx,ny)||solid(nx+c*18,ny+s*18)||solid(nx-c*18,ny-s*18))v.v*=-.4;else{v.x=nx;v.y=ny}
  p.x=v.x;p.y=v.y;
  this.en.forEach(e=>{if(Math.abs(v.v)>3&&Math.hypot(e.x-v.x,e.y-v.y)<24)this.hit(e,9)});
 }else if(ax||ay){const l=Math.hypot(ax,ay);ax/=l;ay/=l;p.a=Math.atan2(ay,ax);
  const nx=p.x+ax*2.6,ny=p.y+ay*2.6;if(!solid(nx,p.y))p.x=nx;if(!solid(p.x,ny))p.y=ny}
 if((J.fire||K[' '])&&!v&&Date.now()-p.t>W[d.cur].r){
  p.t=Date.now();const w=W[d.cur];let a=p.a,b=null,bd=380;
  this.en.forEach(e=>{const q=Math.hypot(e.x-p.x,e.y-p.y);if(q<bd){bd=q;b=e}});
  if(b)a=Math.atan2(b.y-p.y,b.x-p.x);
  for(let i=0;i<w.k;i++){const t=a+(w.k>1?rnd(-.25,.25):0);this.bl.push({x:p.x,y:p.y,vx:Math.cos(t)*12,vy:Math.sin(t)*12,l:45,d:w.d})}}
 this.bl=this.bl.filter(b=>{b.x+=b.vx;b.y+=b.vy;if(--b.l<0||solid(b.x,b.y))return 0;
  for(const e of this.en)if(!e.dead&&Math.hypot(e.x-b.x,e.y-b.y)<13){this.hit(e,b.d);return 0}return 1});
 this.en=this.en.filter(e=>!e.dead);
 this.en.forEach(e=>{const dx=p.x-e.x,dy=p.y-e.y,q=Math.hypot(dx,dy);
  if(q<320&&q>1){const nx=e.x+dx/q*1.3,ny=e.y+dy/q*1.3;if(!solid(nx,e.y))e.x=nx;if(!solid(e.x,ny))e.y=ny}
  if(q<16&&!v&&!this.god)p.hp-=.3});
 if(this.en.length<10&&Math.random()<.01){const[x,y]=free();if(Math.hypot(x-p.x,y-p.y)>400)this.en.push({x,y,hp:3})}
 if(this.it.length<45&&Math.random()<.02){const[x,y]=free();this.it.push({x,y,t:'c'})}
 this.it=this.it.filter(i=>{if(Math.hypot(i.x-p.x,i.y-p.y)>16)return 1;
  if(i.t=='h'){p.hp=Math.min(100,p.hp+30);this.say('+30 ❤ ឥតគិតថ្លៃ')}
  else{const n=i.t=='k'?10:1;d.coins+=n;this.mc+=n;if(n>1)this.say('🎁 +10 💰 ឥតគិតថ្លៃ');this.chk()}
  Store.save();return 0});
 if(p.hp<=0){this.run=0;Store.save();$('over').classList.remove('h')}
},
draw(){
 const p=this.p;if(!p)return;
 const w=cv.width,h=cv.height,s=Math.min(w,h)/520,d=Store.data;
 cx.setTransform(1,0,0,1,0,0);cx.fillStyle='#3a3a3a';cx.fillRect(0,0,w,h);
 cx.setTransform(s,0,0,s,w/2-p.x*s,h/2-p.y*s);
 const vw=w/s/2+BS,vh=h/s/2+BS,i0=Math.max(0,(p.x-vw)/BS|0),i1=Math.min(7,(p.x+vw)/BS|0),j0=Math.max(0,(p.y-vh)/BS|0),j1=Math.min(7,(p.y+vh)/BS|0);
 cx.setLineDash([20,20]);cx.strokeStyle='#dd5';cx.lineWidth=3;cx.textAlign='center';
 for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){
  const x=i*BS,y=j*BS,L=LM[i+','+j];
  cx.beginPath();cx.moveTo(x,y);cx.lineTo(x,y+BS);cx.moveTo(x,y);cx.lineTo(x+BS,y);cx.stroke();
  if(i>6)continue;
  cx.fillStyle='#8a8a80';cx.fillRect(x+50,y+50,300,300);
  if(L){cx.fillStyle='#2f7d3a';cx.fillRect(x+65,y+65,270,270);cx.fillStyle=L[1];cx.beginPath();cx.arc(x+200,y+190,40,0,7);cx.fill();
   cx.fillStyle='#fff';cx.font='bold 16px system-ui';cx.fillText(L[0],x+200,y+270)}
  else{const c=hs(i,j);cx.fillStyle=`hsl(${c*360|0},35%,${40+c*20}%)`;cx.fillRect(x+65,y+65,270,270);cx.fillStyle='rgba(0,0,0,.25)';cx.fillRect(x+90,y+90,220,220)}}
 cx.setLineDash([]);cx.fillStyle='#2b6cb0';cx.fillRect(2850,0,350,WS);cx.fillStyle='#fff';cx.fillText('ទន្លេមេគង្គ',3020,p.y);
 this.it.forEach(i=>{cx.fillStyle=i.t=='c'?'#ffd700':i.t=='h'?'#2ecc71':'#ff8c00';
  if(i.t=='c'){cx.beginPath();cx.arc(i.x,i.y,5,0,7);cx.fill()}else cx.fillRect(i.x-7,i.y-7,14,14)});
 this.cars.forEach(c=>{cx.save();cx.translate(c.x,c.y);cx.rotate(c.a);cx.fillStyle=c.c;cx.fillRect(-18,-9,36,18);cx.fillStyle='#9cf';cx.fillRect(2,-7,8,14);cx.restore()});
 this.en.forEach(e=>{cx.fillStyle='#d33';cx.beginPath();cx.arc(e.x,e.y,9,0,7);cx.fill()});
 if(!p.v){cx.fillStyle='#39f';cx.beginPath();cx.arc(p.x,p.y,9,0,7);cx.fill();cx.strokeStyle='#000';cx.lineWidth=3;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x+Math.cos(p.a)*14,p.y+Math.sin(p.a)*14);cx.stroke()}
 cx.fillStyle='#fff';this.bl.forEach(b=>cx.fillRect(b.x-2,b.y-2,4,4));
 cx.setTransform(1,0,0,1,0,0);
 if(this.mt>0){this.mt--;cx.fillStyle='#fff';cx.font='bold 18px system-ui';cx.fillText(this.msg,w/2,70)}
 $('hud').innerHTML=`👤${Store.user} ❤${p.hp|0} 💰${d.coins}<br>🔫${W[d.cur].n}<br>🎯 សន្សំកាក់ ${this.mc}/${MIS[Math.min(this.m,MIS.length-1)]} ${p.v?'🚗':''}`;
},
shop(){const d=Store.data;let h=`<h2>🛒 ហាងអាវុធ 💰${d.coins}</h2>`;
 W.forEach((w,i)=>{const o=d.own.includes(i);h+=`<button onclick="G.buy(${i})">${w.n} — ${o?(d.cur==i?'✔ កំពុងប្រើ':'ប្រើ'):w.p+' 💰'}</button>`});
 $('shop').innerHTML=h+'<button onclick="G.closeShop()">បិទ</button>';$('shop').classList.remove('h');this.pause=1},
buy(i){const d=Store.data;if(d.own.includes(i))d.cur=i;else if(d.coins>=W[i].p){d.coins-=W[i].p;d.own.push(i);d.cur=i}else alert('កាក់មិនគ្រប់!');Store.save();this.shop()},
closeShop(){$('shop').classList.add('h');this.pause=0},
loop(){if(this.run&&!this.pause)this.upd();this.draw();requestAnimationFrame(()=>this.loop())}
};
const st=$('stick'),kn=$('knob');
function mv(e){const r=st.getBoundingClientRect(),dx=e.clientX-r.left-60,dy=e.clientY-r.top-60,l=Math.hypot(dx,dy)||1,m=Math.min(l,50);
 J.x=dx/l*m/50;J.y=dy/l*m/50;kn.style.transform=`translate(${dx/l*m}px,${dy/l*m}px)`}
st.onpointerdown=e=>{st.setPointerCapture(e.pointerId);mv(e);st.onpointermove=mv};
st.onpointerup=st.onpointercancel=()=>{J.x=J.y=0;kn.style.transform='';st.onpointermove=null};
const fb=$('fb');fb.onpointerdown=()=>J.fire=1;fb.onpointerup=fb.onpointerleave=fb.onpointercancel=()=>J.fire=0;
$('cb').onclick=()=>G.use();$('sb').onclick=()=>{if(G.run)G.shop()};
G.loop();
