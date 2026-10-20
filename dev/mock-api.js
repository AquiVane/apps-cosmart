const http=require('http');
const users={}, sess={}, datos={};
const DIA=86400000;
const precios=(u)=>{const reg=Date.now()<u.creadoEn+7*DIA;return{dolar:1530,trialDias:7,regaloVigente:reg,regaloVence:u.creadoEn+7*DIA,mensual:{usd:7,ars:10700},anual:{usd:reg?77:84,ars:reg?117800:128500},mesesGratisAnual:reg?1:0}};
const act=s=>!!(s&&s.subId&&['trial','activa','baja'].includes(s.estado)&&s.hasta>Date.now());
const cuenta=(u)=>({nombre:u.nombre,apellido:'',email:u.email,suscripcion:{activo:act(u.sub),estado:u.sub&&u.sub.subId?u.sub.estado:'ninguno',plan:u.sub&&u.sub.plan||null,medio:u.sub&&u.sub.medio||null,hasta:u.sub&&u.sub.hasta||null,trialHasta:u.sub&&u.sub.trialHasta||null,renueva:!!(u.sub&&u.sub.subId&&['trial','activa'].includes(u.sub.estado)),precios:precios(u)}});
http.createServer((q,r)=>{
 const h={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, OPTIONS','Content-Type':'application/json'};
 if(q.method==='OPTIONS'){r.writeHead(204,h);return r.end();}
 let b='';q.on('data',c=>b+=c);q.on('end',()=>{
  const send=(s,o)=>{r.writeHead(s,h);r.end(JSON.stringify(o))};let j={};try{j=JSON.parse(b||'{}')}catch{}
  const em=sess[(q.headers.authorization||'').replace('Bearer ','')];const u=em&&users[em];
  const p=q.url.split('?')[0];
  if(p==='/api/apps/registro'){if(users[j.email])return send(409,{error:'Ya tenés una cuenta con ese mail. Ingresá con tu contraseña.'});users[j.email]={nombre:j.nombre,email:j.email,pass:j.password,creadoEn:Date.now()};const t='t'+Math.random();sess[t]=j.email;return send(200,{token:t,...cuenta(users[j.email])});}
  if(p==='/api/apps/login'){const x=users[j.email];if(!x||x.pass!==j.password)return send(401,{error:'Email o contraseña incorrectos'});const t='t'+Math.random();sess[t]=j.email;return send(200,{token:t,...cuenta(x)});}
  if(!u&&p.startsWith('/api/'))return send(401,{error:'No autorizado'});
  if(p==='/api/apps/me')return send(200,cuenta(u));
  if(p==='/api/apps/mp'){const ah=Date.now();u.sub={estado:'trial',plan:j.plan,medio:'mp',subId:'S1',trialHasta:ah+7*DIA,hasta:ah+10*DIA};return send(200,{ok:true,...cuenta(u)});}
  if(p==='/api/apps/baja'){u.sub.estado='baja';return send(200,{ok:true,...cuenta(u)});}
  const m=p.match(/^\/api\/apps\/data\/([a-z0-9-]+)$/);
  if(m){if(!act(u.sub))return send(402,{error:'Necesitás una suscripción activa para usar la app.'});const k=u.email+m[1];if(q.method==='GET')return send(200,datos[k]!==undefined?datos[k]:(['contenidos','guiones','ideas','tareas','campanas','procesos','recursos','links'].includes(m[1])?[]:{}));datos[k]=j;return send(200,{ok:true});}
  if(p==='/auth/forgot')return send(200,{ok:true,message:'Si el email tiene cuenta, llegará el link en unos minutos.'});
  if(p==='/auth/logout')return send(200,{ok:true});
  send(404,{error:'no'});
 });
}).listen(8790);
