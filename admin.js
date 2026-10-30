const Admin={
 pw:'admin123',ok:0,el:null,
 tp(x,y){const p=G.p;p.x=x;p.y=y;if(p.v){p.v.x=x;p.v.y=y}},
 open(){
  if(!G.run)return alert('សូមចាប់ផ្តើមហ្គេមសិន');
  if(!this.ok){if(prompt('លេខសម្ងាត់ Admin')!==this.pw)return alert('ខុស');this.ok=1}
  if(!this.el){const e=this.el=document.createElement('div');
   e.style.cssText='position:fixed;top:44px;right:6px;width:200px;max-height:70%;overflow:auto;background:rgba(0,0,0,.88);padding:8px;border-radius:8px;z-index:7;display:flex;flex-direction:column;gap:5px;font-size:13px';
   document.body.appendChild(e)}
  else{this.el.hidden=!this.el.hidden;if(this.el.hidden)return}
  this.el.hidden=false;this.render()},
 render(){
  const e=this.el,d=Store.data,A=[
   ['💰 +1000 កាក់',()=>d.coins+=1000],
   ['❤ ព្យាបាលពេញ',()=>G.p.hp=100],
   ['🛡 God mode '+(G.god?'(បើក)':'(បិទ)'),()=>G.god^=1],
   ['⚡ ល្បឿនឡាន x2 '+(G.boost>1?'(បើក)':'(បិទ)'),()=>G.boost=G.boost>1?1:2],
   ['🔫 អាវុធទាំងអស់',()=>d.own=[0,1,2,3]],
   ['🚗 បង្កើតឡាន',()=>G.cars.push({x:G.p.x+40,y:G.p.y,a:0,v:0,c:'#f0f'})],
   ['💀 សម្លាប់ខ្មាំងទាំងអស់',()=>G.en.forEach(x=>x.dead=1)],
   ['📍 វិមានឯករាជ្យ',()=>this.tp(1400,1400)],
   ['📍 វាំងព្រះរាជ',()=>this.tp(1800,600)],
   ['📍 ផ្សារកណ្ដាល',()=>this.tp(1000,1800)],
   ['📍 វត្តភ្នំ',()=>this.tp(2200,2200)]];
  e.innerHTML='<b>⚙ Admin</b>';
  A.forEach(([t,f])=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='font-size:13px;padding:6px';
   b.onclick=()=>{f();Store.save();this.render()};e.appendChild(b)});
  const u=document.createElement('div');u.innerHTML='<b>👥 អ្នកលេង</b><br>'+Store.users().map(n=>{let q={};try{q=JSON.parse(localStorage['pp_'+n])}catch(x){}return n+': 💰'+(q.coins||0)}).join('<br>');e.appendChild(u);
  const r=document.createElement('button');r.textContent='🗑 លុបទិន្នន័យទាំងអស់';r.style.cssText='font-size:13px;padding:6px;background:#d33;color:#fff';
  r.onclick=()=>{if(confirm('លុបទាំងអស់?')){localStorage.clear();location.reload()}};e.appendChild(r)}
};
$('ab').onclick=()=>Admin.open();
