
const D0={M2:'2026-10-02',A5:'Mois : OCTOBRE 2026',E9:'RENAULT TRAFIC',E10:'76119T6',E11:'MP TAZA',E12:'GASOIL',E13:80,K10:'2026-07-16',L10:40658,K11:'2026-07-08',L11:40300,K12:'RAS',L12:'RAS',K13:'RAS',L13:'RAS',K14:'RAS',L14:'RAS',K15:'2025-12-23',L15:28919,D38:'',E38:''};
const R0=[['2026-10-07',82697,379155,'TOTAL','2315/2573',44391,45038,49.08,16.3],['2026-10-12',82697,379155,'TOTAL','2448/2707',45038,45660,49.08,16.3],['2026-10-17',82133,379155,'TOTAL','539/671',45660,46176,49.14,16.28]];
const HF=[['M2','تاريخ التحرير (TAZA, le)','date'],['A5','الشهر','text'],['E9','Marque','text'],['E10','N° Minéralogique','text'],['E11','Affectation','text'],['E12','Carburant','text'],['E13','سعة الخزان','number'],
['K10','Visite Technique – التاريخ','date'],['L10','Visite Technique – المؤشر km','number'],['K11','Dernière vidange – التاريخ','date'],['L11','Dernière vidange – km','number'],
['K12','Pneus – التاريخ','text'],['L12','Pneus – km','text'],['K13','Chaîne distribution – التاريخ','text'],['L13','Chaîne distribution – km','text'],['K14','Batterie – التاريخ','text'],['L14','Batterie – km','text'],['K15','AdBlue – التاريخ','date'],['L15','AdBlue – km','number'],['D38','Incident – Panne: التاريخ','date'],['E38','Incident – Panne: الطبيعة','text']];
const HID=['E9','E10','E11','E12','K12','L12','K13','L13','K14','L14','K15','L15','D38','E38'];
const MN=['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'];
const mon=()=>{const m=(S.h.M2||'').match(/^\d\d\/(\d\d)\/(\d{4})$/);return m&&+m[1]>=1&&+m[1]<=12?'Mois : '+MN[+m[1]-1]+' '+m[2]:''};
const FC=[['Date','date'],['Mle Cond','number'],['N° Carte','number'],['Fourniss','text'],['Ticket N°','text'],['Index-Départ','number'],['Index-Arrivée','number'],['Quantité (L)','number'],['P.U','number']];
const COLS=['B','C','D','E','F','G','H','J','K'];

let S={h:{...D0},r:R0.map(r=>[...r])};

// الحفظ التلقائي واسترجاع المعطيات
const STORE_KEY='tazahub_rapport_mensuel_TO448_v1';

try{
  const saved=localStorage.getItem(STORE_KEY);
  if(saved){
    const data=JSON.parse(saved);
    if(data&&data.h&&Array.isArray(data.r)){
      S={
        h:{...D0,...data.h},
        r:data.r.map(r=>Array.isArray(r)?[...r]:[])
      };
    }
  }
}catch(e){}

const sv=()=>{
  try{
    localStorage.setItem(STORE_KEY,JSON.stringify(S));
  }catch(e){}
};

const $=id=>document.getElementById(id);
const iso=v=>/^\d{4}-\d\d-\d\d$/.test(v)?v.split('-').reverse().join('/'):v;
Object.keys(S.h).forEach(k=>S.h[k]=iso(S.h[k]));
S.r.forEach(r=>r[0]=iso(r[0]));

const mask=v=>{v=v.replace(/\D/g,'').slice(0,8);return v.length>4?v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4):v.length>2?v.slice(0,2)+'/'+v.slice(2):v};
const dm2iso=v=>{const m=String(v||'').match(/^(\d\d)\/(\d\d)\/(\d{4})$/);return m?m[3]+'-'+m[2]+'-'+m[1]:''};

function inp(t,val,at){
  if(t=='date')return `<input type="date" class="dt" ${at} value="${dm2iso(val)}">`;
  const x=t=='tk'?'type="text" inputmode="numeric" class="tk"':`type="${t}" step="any" inputmode="decimal"`;
  return `<input ${x} ${at} value="${val??''}">`;
}

function wire(i,get){
  i.oninput=()=>{
    let v=i.value;
    if(i.classList.contains('dt'))v=i.value?i.value.split('-').reverse().join('/'):'';
    else if(i.classList.contains('tk'))v=i.value=v.replace(/[^\d\/]/g,'');
    else if(i.type=='number')v=v!==''?+v:'';
    get(v);
    sv();
    sum();
  };
}

function build(){
  const fld=([k,l,t])=>`<div><label>${l}</label>${inp(t,S.h[k],`data-h="${k}"`)}`;
  let h='<div class="card"><details><summary>▼ معلومات المركبة</summary><div class="g" style="margin-top:8px">';
  HF.filter(x=>x[0]!='A5'&&x[0]!='M2').forEach(x=>h+=fld(x));
  h+='</div></details></div><div class="card"><h2>استهلاك الوقود (7 أسطر كحد أقصى)</h2><div id="rows"></div><div class="bar"><button class="s" id="ar">+ إضافة سطر</button></div><div class="sum" id="sm"></div></div><button id="nw" class="s">ملف جديد</button>';
  h+='<div class="card" style="max-width:220px;margin-top:12px">'+fld(HF.find(x=>x[0]=='M2'))+'</div>';
  $('in').innerHTML=h;
  rows();

  document.querySelectorAll('[data-h]').forEach(i=>wire(i,v=>S.h[i.dataset.h]=v));

  $('ar').onclick=()=>{
    if(S.r.length>=7)return alert('الحد الأقصى 7 أسطر');
    const p=S.r[S.r.length-1]||[];
    S.r.push(['',p[1]||'',p[2]||'',p[3]||'','',p[6]||'','','',p[8]||'']);
    sv();
    rows();
  };

  $('nw').onclick=()=>{
    if(confirm('بدء ملف جديد؟ سيتم إفراغ الواجهة فقط (أسطر الوقود وتاريخ التحرير) وتبقى معلومات المركبة المخفية')){
      const f=S.r[0]||[];
      S.r=[['','',f[2]||'',f[3]||'TOTAL','','','','','']];
      S.h.M2='';
      sv();
      build();
    }
  };
}

function rows(){
  let h='';
  S.r.forEach((r,i)=>{
    h+='<div class="row"><div class="g">';
    FC.forEach(([l,t],j)=>{
      if(j==2||j==3)return;
      const ty=j==4?'tk':t;
      h+=`<div><label>${l}</label>${inp(ty,r[j],`data-r="${i}" data-c="${j}"`)}</div>`;
    });
    h+=`</div><button class="s" data-d="${i}" style="margin-top:6px">حذف</button></div>`;
  });

  $('rows').innerHTML=h;

  document.querySelectorAll('[data-r]').forEach(i=>wire(i,v=>S.r[i.dataset.r][i.dataset.c]=v));

  document.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{
    S.r.splice(b.dataset.d,1);
    sv();
    rows();
  });

  sum();
}

const n=v=>v===''||v==null||isNaN(+v)?null:+v;

function calc(){
  const rs=S.r.map(r=>{
    const d=n(r[6])!=null&&n(r[5])!=null?r[6]-r[5]:null;
    const q=n(r[7]),p=n(r[8]);
    return{d,m:q!=null&&p!=null?q*p:null,c:d&&q!=null?q*100/d:null};
  });

  const T=k=>rs.reduce((a,x)=>a+(x[k]||0),0);
  const q=S.r.reduce((a,r)=>a+(n(r[7])||0),0);
  const end=S.r.length&&n(S.r.at(-1)[6])!=null?+S.r.at(-1)[6]:null;
  const st=S.r.length&&n(S.r[0][5])!=null?+S.r[0][5]:null;
  const df=end!=null&&st!=null?end-st:null;

  return{rs,q,m:T('m'),d:T('d'),end,st,df,cons:df?q*100/df:null};
}

const f=(v,k=2)=>v==null?'':(+v).toFixed(k).replace(/\.?0+$/,'');

function sum(){
  const c=calc();
  $('sm').innerHTML=`<span>الفرق km: <b>${c.df??'-'}</b></span><span>الكمية الإجمالية: <b>${f(c.q)}</b> L</span><span>المبلغ: <b>${f(c.m)}</b> DH</span><span>الاستهلاك/100km: <b>${f(c.cons)}</b></span>`;
}

function prev(){
  S.h.A5=mon();
  const c=calc(),h=S.h;
  let t=`<div class="pt"><b>DI/CTR/DTO – DIVISION EXPLOITATION TRANSPORT FES</b><br>TAZA, le ${h.M2}<h3>RAPPORT MENSUEL DU VEHICULE N° TO448</h3>${h.A5}</div><table><tr><th>Marque</th><td>${h.E9}</td><th>Visite Technique</th><td>${h.K10}</td><td>${h.L10}</td></tr><tr><th>N° Minér.</th><td>${h.E10}</td><th>Dernière vidange</th><td>${h.K11}</td><td>${h.L11}</td></tr><tr><th>Affectation</th><td>${h.E11}</td><th>Pneus</th><td>${h.K12}</td><td>${h.L12}</td></tr><tr><th>Carburant</th><td>${h.E12}</td><th>Chaîne + Amortisseur</th><td>${h.K13}</td><td>${h.L13}</td></tr><tr><th>Réservoir</th><td>${h.E13}</td><th>Batterie</th><td>${h.K14}</td><td>${h.L14}</td></tr><tr><th></th><td></td><th>AdBlue</th><td>${h.K15}</td><td>${h.L15}</td></tr></table><br><table><tr><th>Index fin</th><td>${c.end??''}</td><th>Qté totale (L)</th><td>${f(c.q)}</td></tr><tr><th>Index début</th><td>${c.st??''}</td><th>Cons/100 KM</th><td>${f(c.cons)}</td></tr><tr><th>Différence</th><td>${c.df??''}</td><th>Montant (DH)</th><td>${f(c.m)}</td></tr></table><br><table><tr>${['Date','Mle Cond','N° Carte','Fourniss','Ticket N°','Index-Dép','Index-Arr','Diff','Qté','P.U','Montant','Cons %'].map(x=>'<th>'+x+'</th>').join('')}</tr>`;

  S.r.forEach((r,i)=>{
    const x=c.rs[i];
    t+=`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${r[6]}</td><td>${x.d??''}</td><td>${r[7]}</td><td>${r[8]}</td><td>${f(x.m)}</td><td>${f(x.c)}</td></tr>`;
  });

  t+=`<tr><th colspan="7">TOTAL</th><th>${c.d}</th><th>${f(c.q)}</th><th></th><th>${f(c.m)}</th><th></th></tr></table><br><b>Incident - Panne:</b> ${h.D38} ${h.E38}`;
  $('pv').innerHTML=t;
}

function show(p){
  $('in').style.display=p?'none':'block';
  $('pv').style.display=p?'block':'none';
  if(p)prev();
}

$('bi').onclick=()=>show(0);
$('bp').onclick=()=>show(1);

function dl(blob,name){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const ser=s=>{
  const m=String(s).match(/^(\d\d)\/(\d\d)\/(\d{4})$/);
  return m?Math.round(Date.UTC(+m[3],+m[2]-1,+m[1])/864e5)+25569:null;
};

const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function put(x,ref,v,t){
  const re=new RegExp('<c r="'+ref+'"([^>]*?)(/>|>[\\s\\S]*?</c>)');
  const m=x.match(re);
  if(!m)return x;
  const sm=m[1].match(/s="(\d+)"/),s=sm?' s="'+sm[1]+'"':'';
  let o;

  if(t=='f')o=`<c r="${ref}"${s}><f>${v}</f></c>`;
  else if(v===''||v==null)o=`<c r="${ref}"${s}/>`;
  else if(t=='date'){
    const q=ser(v);
    o=q?`<c r="${ref}"${s}><v>${q}</v></c>`:`<c r="${ref}"${s} t="inlineStr"><is><t>${esc(v)}</t></is></c>`;
  }
  else if(t=='number'&&!isNaN(+v))o=`<c r="${ref}"${s}><v>${+v}</v></c>`;
  else o=`<c r="${ref}"${s} t="inlineStr"><is><t>${esc(v)}</t></is></c>`;

  return x.replace(re,()=>o);
}

$('bd').onclick=async()=>{
  let buf;
  try{
    const r=await fetch('TO448_-_10-2026.xlsx');
    if(!r.ok)throw 0;
    buf=await r.arrayBuffer();
  }catch(e){
    return alert('تعذر تحميل ملف القالب TO448_-_10-2026.xlsx — افتح التطبيق من الموقع (GitHub Pages) وتأكد أن الملف بجانب index.html');
  }

  const z=await JSZip.loadAsync(buf);
  let x=await z.file('xl/worksheets/sheet1.xml').async('string');

  S.h.A5=mon();
  HF.forEach(([k,,t])=>{
    x=put(x,k,S.h[k],t=='date'&&!/^\d\d\/\d\d\/\d{4}$/.test(S.h[k]||'')?'text':t);
  });

  for(let i=0;i<7;i++){
    const r=S.r[i],w=27+i;
    COLS.forEach((c,j)=>{x=put(x,c+w,r?r[j]:'',FC[j][1])});
    x=put(x,'I'+w,r?`H${w}-G${w}`:'',r?'f':'');
    x=put(x,'L'+w,r?`J${w}*K${w}`:'',r?'f':'');
    x=put(x,'M'+w,r?`IF(I${w}=0,0,J${w}*100/I${w})`:'',r?'f':'');
  }

  const last=26+Math.max(S.r.length,1);
  x=put(x,'E20',`H${last}`,'f');
  x=x.replace(/(<f[^>]*>[^<]*<\/f>|<f[^>]*\/>)<v>[^<]*<\/v>/g,'$1');
  z.file('xl/worksheets/sheet1.xml',x);

  let w=await z.file('xl/workbook.xml').async('string');
  w=/<calcPr[^>]*\/>/.test(w)
    ?w.replace(/<calcPr[^>]*\/>/,'<calcPr calcId="191029" fullCalcOnLoad="1"/>')
    :w.replace('<extLst','<calcPr calcId="191029" fullCalcOnLoad="1"/><extLst');
  z.file('xl/workbook.xml',w);

  z.remove('xl/calcChain.xml');
  for(const [p,re] of [
    ['xl/_rels/workbook.xml.rels',/<Relationship [^>]*calcChain[^>]*\/>/],
    ['[Content_Types].xml',/<Override [^>]*calcChain[^>]*\/>/]
  ]){
    z.file(p,(await z.file(p).async('string')).replace(re,''));
  }

  dl(
    await z.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),
    'TO448_-_10-2026_rempli.xlsx'
  );
};

window.addEventListener('pagehide',sv);
document.addEventListener('visibilitychange',sv);

build();
