/* ================= Shared records outside Claude (VS Code / your own web hosting) =================
   Messages, notifications, approvals, announcements and events need one shared place that the
   students' browsers and the director's browser can both reach. Inside Claude that place is built in.
   Everywhere else this file connects the app to a free Firebase Realtime Database.
   It stays OFF until js/config.js is filled in. Setup steps: SETUP-SHARED-RECORDS.md                  */
(function(){
  'use strict';
  const cfg=window.BFM_CONFIG||{};
  if(window.claude||!cfg.databaseURL||!cfg.apiKey)return;
  const DBU=String(cfg.databaseURL).replace(/\/+$/,''),KEY=cfg.apiKey;
  const LS='bfm-fb-auth',SS='bfm-fb-director',AC='bfm-fb-acct';
  const ACC=cfg.studentAccounts!==false; /* real student accounts (email + password). Set studentAccounts:false in config.js to go back to device-only identities. */
  const now=()=>Date.now();
  const jget=(s,k)=>{try{return JSON.parse(s.getItem(k)||'null');}catch(e){return null;}};
  const jset=(s,k,v)=>{try{if(v==null)s.removeItem(k);else s.setItem(k,JSON.stringify(v));}catch(e){}};
  let anon=jget(localStorage,LS),dir=jget(sessionStorage,SS),anonP=null,acct=jget(localStorage,AC);
  const pack=j=>({id:j.localId||j.user_id,refresh:j.refreshToken||j.refresh_token,idt:j.idToken||j.id_token,exp:now()+(Math.max(120,+(j.expiresIn||j.expires_in)||3600)-60)*1000});
  const post=async(url,opt)=>{const r=await fetch(url,opt),j=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(new Error('auth'),{code:(j.error&&(j.error.message||j.error))||'auth'});return j;};
  const idp=(path,body)=>post('https://identitytoolkit.googleapis.com/v1/accounts:'+path+'?key='+KEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const renew=a=>post('https://securetoken.googleapis.com/v1/token?key='+KEY,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=refresh_token&refresh_token='+encodeURIComponent(a.refresh)}).then(pack);
  async function getAnon(){
    if(anon&&anon.exp>now())return anon;
    if(anonP)return anonP;
    anonP=(async()=>{
      try{
        if(anon&&anon.refresh){try{anon=await renew(anon);jset(localStorage,LS,anon);return anon;}catch(e){}}
        anon=pack(await idp('signUp',{returnSecureToken:true}));jset(localStorage,LS,anon);return anon;
      }finally{anonP=null;}
    })();
    return anonP;
  }
  async function getDir(){
    if(!dir)return null;
    if(dir.exp>now())return dir;
    try{dir=await renew(dir);jset(sessionStorage,SS,dir);return dir;}catch(e){dir=null;jset(sessionStorage,SS,null);return null;}
  }
  async function getAcct(){
    if(!acct)return null;
    if(acct.exp>now())return acct;
    try{const n=await renew(acct);acct=Object.assign({},acct,n);jset(localStorage,AC,acct);return acct;}catch(e){if(e&&/TOKEN_EXPIRED|USER_NOT_FOUND|USER_DISABLED|INVALID_REFRESH/.test(String(e.code))){acct=null;jset(localStorage,AC,null);}return acct;}
  }
  const tok=async()=>{
    const d=await getDir();if(d)return d.idt;
    if(ACC){const a=await getAcct();if(!a)throw Object.assign(new Error('permission-denied'),{code:'permission-denied'});return a.idt;}
    return (await getAnon()).idt;
  };
  function parseLogin(v){
    v=String(v||'').trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?{type:'email',email:v,label:v}:null;
  }
  async function startAcct(path,login,pw){
    const p=parseLogin(login);if(!p)throw Object.assign(new Error('bad'),{code:'INVALID_EMAIL'});
    const j=await idp(path,{email:p.email,password:pw,returnSecureToken:true});
    acct=Object.assign(pack(j),{label:p.label,type:p.type});jset(localStorage,AC,acct);return true;
  }
  async function req(method,path,body){
    const t=await tok();
    const r=await fetch(DBU+'/'+path+'.json?auth='+encodeURIComponent(t),{method,headers:{'Content-Type':'application/json'},body:body==null?undefined:JSON.stringify(body)});
    if(r.status===401||r.status===403)throw Object.assign(new Error('permission-denied'),{code:'permission-denied'});
    if(!r.ok)throw Object.assign(new Error('network'),{code:'unavailable'});
    return r.text();
  }
  const parse=v=>{try{return v&&v.j!=null?JSON.parse(v.j):null;}catch(e){return null;}};
  const W=[];let timer=null,busy=false;
  async function pollOne(w){
    try{
      const raw=await req('GET',w.path);
      if(raw===w.last&&w.ok)return;
      w.last=raw;w.ok=true;
      const v=JSON.parse(raw);
      if(w.col){const ids=v?Object.keys(v):[];w.cb({size:ids.length,docs:ids.map(id=>({id,exists:true,data:()=>parse(v[id])}))});}
      else w.cb({exists:!!(v&&v.j!=null),id:w.path.split('/').pop(),data:()=>parse(v)});
    }catch(e){if(w.err)try{w.err({code:e.code||'unavailable'});}catch(x){}}
  }
  async function pollAll(){
    if(busy||document.hidden)return;busy=true;
    try{for(const w of W.slice())await pollOne(w);}finally{busy=false;}
  }
  function watch(path,col,cb,err){
    const w={path,col,cb,err,last:null,ok:false};W.push(w);
    if(!timer)timer=setInterval(pollAll,6000);
    pollOne(w);
    return ()=>{const i=W.indexOf(w);if(i>=0)W.splice(i,1);};
  }
  const poke=()=>setTimeout(()=>{W.forEach(w=>{w.ok=false;});pollAll();},400);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)poke();});
  const DB={
    doc:path=>({
      set:d=>req('PUT',path,{j:JSON.stringify(d),at:now()}).then(r=>{poke();return r;}),
      delete:()=>req('DELETE',path).then(r=>{poke();return r;}),
      get:async()=>{const v=JSON.parse(await req('GET',path));return {exists:!!(v&&v.j!=null),id:path.split('/').pop(),data:()=>parse(v)};},
      onSnapshot:(cb,err)=>watch(path,false,cb,err)
    }),
    collection:name=>({onSnapshot:(cb,err)=>watch(name,true,cb,err)})
  };
  if(ACC&&cfg.googleClientId&&!document.getElementById('gsi-js')){const g=document.createElement('script');g.id='gsi-js';g.src='https://accounts.google.com/gsi/client';g.async=true;g.defer=true;(document.head||document.documentElement).appendChild(g);}
  window.claude={use:async name=>name==='db'?DB:name==='user'?{id:async()=>{
    const d=await getDir();if(d)return d.id;
    if(ACC){const a=await getAcct();return a?a.id:'';}
    return (await getAnon()).id;}}:null};
  window.BFM_BACKEND={
    on:true,
    accounts:ACC,
    signedIn:()=>!!acct,
    accountKey:()=>ACC&&acct?'-'+acct.id:'',
    contact:()=>acct?acct.label:'',
    parseLogin,
    signUp:(login,pw)=>startAcct('signUp',login,pw),
    signIn:(login,pw)=>startAcct('signInWithPassword',login,pw),
    signOut:()=>{acct=null;jset(localStorage,AC,null);},
    googleClientId:String(cfg.googleClientId||''),
    /* Google: the Google button gives us an ID token; Firebase turns it into a normal Academy account */
    signInGoogle:async idToken=>{
      const j=await idp('signInWithIdp',{postBody:'id_token='+encodeURIComponent(idToken)+'&providerId=google.com',requestUri:(location.origin&&location.origin!=='null')?location.origin:'http://localhost',returnSecureToken:true,returnIdpCredential:true});
      if(j.needConfirmation||!j.idToken)throw Object.assign(new Error('link'),{code:'NEED_CONFIRMATION'});
      acct=Object.assign(pack(j),{label:String(j.email||'').toLowerCase(),type:'google'});jset(localStorage,AC,acct);
      return {isNew:!!j.isNewUser,name:j.displayName||j.fullName||'',email:String(j.email||'').toLowerCase()};
    },
    reset:async login=>{const p=parseLogin(login);if(!p)throw Object.assign(new Error('bad'),{code:'INVALID_EMAIL'});await idp('sendOobCode',{requestType:'PASSWORD_RESET',email:p.email});return true;},
    changePassword:async pw=>{const a=await getAcct();if(!a)throw Object.assign(new Error('x'),{code:'INVALID_ID_TOKEN'});const j=await idp('update',{idToken:a.idt,password:pw,returnSecureToken:true});acct=Object.assign({},a,pack(j));jset(localStorage,AC,acct);return true;},
    needsDirector:!!cfg.directorEmail,
    signInDirector:async pw=>{const j=await idp('signInWithPassword',{email:cfg.directorEmail,password:pw,returnSecureToken:true});dir=pack(j);jset(sessionStorage,SS,dir);poke();return true;},
    signOutDirector:()=>{dir=null;jset(sessionStorage,SS,null);}
  };
})();
