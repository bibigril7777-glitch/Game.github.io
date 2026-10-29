
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let W, H;
function resize() {
  W = canvas.width = Math.min(innerWidth, 900);
  H = canvas.height = Math.min(innerHeight, 700);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
}
resize();
addEventListener("resize", resize);

const map = [
"111111111111",
"100000000001",
"101100010001",
"100000010001",
"100110000001",
"100000110001",
"100000000001",
"101100011001",
"100000000001",
"111111111111"
];

let player, enemies, playing = false;
let hp = 100, ammo = 12, reserve = 60;
let moveX = 0, moveY = 0, lookX = 0, jump = 0;
let reloadTime = 0, flash = 0, last = 0;

function reset() {
  player = { x: 2.5, y: 2.5, a: 0 };
  enemies = [
    {x:8.5,y:2.5,hp:100},
    {x:9.5,y:5.5,hp:100},
    {x:4.5,y:7.5,hp:100},
    {x:7.5,y:8.5,hp:100},
    {x:5.5,y:4.5,hp:100}
  ];
  hp = 100; ammo = 12; reserve = 60;
  reloadTime = 0; jump = 0;
  updateHUD();
}
function wall(x,y) {
  const a = Math.floor(x), b = Math.floor(y);
  return !map[b] || map[b][a] !== "0";
}
function updateHUD() {
  document.getElementById("hp").textContent = hp;
  document.getElementById("ammo").textContent = ammo + "/" + reserve;
  document.getElementById("enemies").textContent =
    enemies.filter(e=>e.hp>0).length;
}
function cast(angle) {
  for(let d=.05; d<16; d+=.035) {
    if(wall(player.x+Math.cos(angle)*d,
             player.y+Math.sin(angle)*d)) return d;
  }
  return 16;
}
function shoot() {
  if(!playing || reloadTime>0) return;
  if(ammo<=0) { notify("អស់គ្រាប់! ចុច ↻"); return; }
  ammo--;
  let target=null, best=999;
  for(const e of enemies) {
    if(e.hp<=0) continue;
    let dx=e.x-player.x, dy=e.y-player.y;
    let d=Math.hypot(dx,dy);
    let a=Math.atan2(dy,dx)-player.a;
    while(a>Math.PI)a-=Math.PI*2;
    while(a< -Math.PI)a+=Math.PI*2;
    if(Math.abs(a)<.09 && d<best) {
      let blocked=false;
      for(let t=.2;t<d;t+=.12) {
        if(wall(player.x+Math.cos(player.a+a)*t,
                 player.y+Math.sin(player.a+a)*t)) {
          blocked=true; break;
        }
      }
      if(!blocked){target=e;best=d;}
    }
  }
  if(target) {
    target.hp-=35;
    if(target.hp<=0) notify("កម្ចាត់សត្រូវបាន!");
  }
  flash=.08;
  updateHUD();
  if(enemies.every(e=>e.hp<=0)) finish(true);
}
function reload() {
  if(ammo===12 || reserve<=0 || reloadTime>0) return;
  reloadTime=1.2;
  notify("កំពុងបញ្ចូលគ្រាប់...");
}
let messageTimer=0;
function notify(text) {
  let el=document.getElementById("help");
  el.textContent=text;
  messageTimer=1.5;
}
function finish(win) {
  playing=false;
  document.getElementById("result").textContent =
    win ? "MISSION COMPLETE" : "MISSION FAILED";
  document.getElementById("end").classList.remove("hidden");
}
function draw() {
  const horizon=H*.48+jump*H*.08;
  let sky=ctx.createLinearGradient(0,0,0,horizon);
  sky.addColorStop(0,"#7d9291");
  sky.addColorStop(1,"#c0bea0");
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,horizon);
  let ground=ctx.createLinearGradient(0,horizon,0,H);
  ground.addColorStop(0,"#596347");
  ground.addColorStop(1,"#20291c");
  ctx.fillStyle=ground;ctx.fillRect(0,horizon,W,H-horizon);

  // Raycast walls: lightweight pseudo-3D view
  const step=2;
  for(let x=0;x<W;x+=step) {
    const camera=(x/W-.5)*1.15;
    const angle=player.a+camera;
    const d=cast(angle)*Math.cos(camera);
    const height=Math.min(H*1.5,H*.8/(d+.01));
    const top=horizon-height/2;
    const shade=Math.max(25,145-d*9);
    ctx.fillStyle=`rgb(${shade*.55},${shade*.78},${shade*.47})`;
    ctx.fillRect(x,top,step+1,height);
  }

  // Enemies in the distance
  enemies.filter(e=>e.hp>0).map(e=>{
    let dx=e.x-player.x,dy=e.y-player.y;
    let d=Math.hypot(dx,dy);
    let a=Math.atan2(dy,dx)-player.a;
    while(a>Math.PI)a-=Math.PI*2;
    while(a< -Math.PI)a+=Math.PI*2;
    return {e,d,a,x:W*(.5+a/1.15)};
  }).filter(o=>Math.abs(o.a)<.57).sort((a,b)=>b.d-a.d)
  .forEach(o=>{
    let h=Math.min(H*.7,H*.8/(o.d+.1));
    let x=o.x,y=horizon-h*.4+jump*H*.08,w=h*.38;
    ctx.fillStyle="#333b2b";
    ctx.fillRect(x-w*.4,y+h*.2,w*.3,h*.28);
    ctx.fillRect(x+w*.1,y+h*.2,w*.3,h*.28);
    ctx.fillStyle="#536342";
    ctx.fillRect(x-w*.5,y,w,h*.28);
    ctx.fillStyle="#303b2c";
    ctx.fillRect(x-w*.32,y+h*.04,w*.64,h*.18);
    ctx.fillStyle="#8c7d63";
    ctx.beginPath();ctx.arc(x,y-h*.06,w*.25,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#263629";
    ctx.beginPath();ctx.arc(x,y-h*.1,w*.27,Math.PI,Math.PI*2);ctx.fill();
    ctx.fillRect(x-w*.24,y-h*.1,w*.48,h*.045);
    ctx.fillStyle="#222820";
    ctx.fillRect(x-w*.15,y-h*.045,w*.3,h*.1);
    ctx.fillStyle="#151a15";
    ctx.fillRect(x,y+h*.09,w*.9,h*.035);
    ctx.fillStyle="#d0e8a3";
    ctx.fillRect(x-w*.45,y-h*.17,w*.9*h/Math.max(h,1),3);
  });

  // Weapon shown at bottom of the screen
  const bob=Math.sin(performance.now()*.008)*2;
  ctx.fillStyle="#8a765a";
  ctx.fillRect(W*.49,H*.84+bob,W*.12,H*.1);
  ctx.fillStyle="#252b23";
  ctx.fillRect(W*.54,H*.78+bob,W*.28,H*.065);
  ctx.fillStyle="#46513b";
  ctx.fillRect(W*.59,H*.76+bob,W*.18,H*.045);
  ctx.fillStyle="#171c17";
  ctx.fillRect(W*.75,H*.77+bob,W*.17,H*.018);
  if(flash>0) {
    ctx.fillStyle="#ffe7a0";
    ctx.beginPath();ctx.arc(W*.92,H*.78,14+Math.random()*10,0,Math.PI*2);ctx.fill();
  }
  if(hp<35) {
    ctx.fillStyle="rgba(180,0,0,.15)";
    ctx.fillRect(0,0,W,H);
  }
}
function update(dt) {
  if(!playing)return;
  if(reloadTime>0) {
    reloadTime-=dt;
    if(reloadTime<=0) {
      let n=Math.min(12-ammo,reserve);
      ammo+=n;reserve-=n;updateHUD();
    }
  }
  flash=Math.max(0,flash-dt);
  jump=Math.max(0,jump-dt*1.5);
  const speed=2.1*dt;
  let nx=player.x+Math.cos(player.a)*(-moveY)*speed+
    Math.cos(player.a+Math.PI/2)*moveX*speed;
  let ny=player.y+Math.sin(player.a)*(-moveY)*speed+
    Math.sin(player.a+Math.PI/2)*moveX*speed;
  if(!wall(nx,player.y))player.x=nx;
  if(!wall(player.x,ny))player.y=ny;

  enemies.forEach(e=>{
    if(e.hp<=0)return;
    let dx=player.x-e.x,dy=player.y-e.y,d=Math.hypot(dx,dy);
    if(d>2.2&&d<9) {
      let a=Math.atan2(dy,dx);
      let nx=e.x+Math.cos(a)*dt*.5;
      let ny=e.y+Math.sin(a)*dt*.5;
      if(!wall(nx,e.y))e.x=nx;
      if(!wall(e.x,ny))e.y=ny;
    }
    e.cool=(e.cool||1)-dt;
    if(d<7&&e.cool<=0) {
      e.cool=1.4;
      if(Math.random()<.38) {
        hp=Math.max(0,hp-8);updateHUD();
        if(hp<=0)finish(false);
      }
    }
  });
}
function loop(t) {
  const dt=Math.min(.05,(t-last)/1000||0);
  last=t;update(dt);draw();
  requestAnimationFrame(loop);
}
function bindMove(id,x,y) {
  const el=document.getElementById(id);
  el.addEventListener("pointerdown",e=>{
    e.preventDefault();moveX=x;moveY=y;
  });
  ["pointerup","pointercancel","pointerleave"].forEach(type=>
    el.addEventListener(type,()=>{moveX=0;moveY=0;}));
}
bindMove("up",0,-1);bindMove("down",0,1);
bindMove("left",-1,0);bindMove("right",1,0);

document.getElementById("shoot").addEventListener("pointerdown",e=>{
  e.preventDefault();shoot();
});
document.getElementById("reload").addEventListener("pointerdown",reload);
document.getElementById("jump").addEventListener("pointerdown",()=>{
  if(playing&&jump===0)jump=1;
});
document.getElementById("start").onclick=()=>{
  document.getElementById("intro").classList.add("hidden");
  reset();playing=true;
};
document.getElementById("again").onclick=()=>{
  document.getElementById("end").classList.add("hidden");
  reset();playing=true;
};

let dragging=false,lastX=0;
canvas.addEventListener("pointerdown",e=>{
  dragging=true;lastX=e.clientX;
});
canvas.addEventListener("pointermove",e=>{
  if(dragging&&playing) {
    player.a+=(e.clientX-lastX)*.006;
    lastX=e.clientX;
  }
});
["pointerup","pointercancel","pointerleave"].forEach(t=>
  canvas.addEventListener(t,()=>dragging=false));

addEventListener("keydown",e=>{
  if(e.key==="w")moveY=-1;
  if(e.key==="s")moveY=1;
  if(e.key==="a")moveX=-1;
  if(e.key==="d")moveX=1;
  if(e.key===" ")shoot();
  if(e.key.toLowerCase()==="r")reload();
});
addEventListener("keyup",e=>{
  if(["w","s"].includes(e.key))moveY=0;
  if(["a","d"].includes(e.key))moveX=0;
});

reset();
requestAnimationFrame(loop);
