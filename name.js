const $=id=>document.getElementById(id);
const Store={
 user:null,data:null,
 users(){try{return JSON.parse(localStorage.pp_users||'[]')}catch(e){return[]}},
 login(n){
  n=(n||'').trim().slice(0,12);if(!n)return false;
  this.user=n;const u=this.users();
  if(!u.includes(n)){u.push(n);localStorage.pp_users=JSON.stringify(u)}
  let d;try{d=JSON.parse(localStorage['pp_'+n])}catch(e){}
  this.data=d||{coins:0,own:[0],cur:0,mission:0};
  localStorage.pp_last=n;return true},
 save(){if(this.user)localStorage['pp_'+this.user]=JSON.stringify(this.data)}
};
$('nm').value=localStorage.pp_last||'';
$('go').onclick=()=>{if(Store.login($('nm').value))G.start();else alert('សូមបញ្ចូលឈ្មោះ')};
