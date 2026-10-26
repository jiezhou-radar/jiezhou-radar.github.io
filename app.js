let papers=[],filter='all';
const list=document.querySelector('#papers');
function splitPaper(p){
 const s=p.text;
 if(p.n===17)return {authors:'C. A. Schone et al. (including Jie Zhou)',title:'2025 IEEE International Radar Conference Student Paper Competition',journal:'IEEE Aerospace and Electronic Systems Magazine, vol. 41, no. 1, pp. 56–68, 2026.'};
 const start=s.indexOf('. ',s.includes('et al.')?s.indexOf('et al.'):0);
 const rest=s.slice(start+2);
 const split=rest.indexOf('. ');
 return {authors:s.slice(0,start)+'.',title:rest.slice(0,split),journal:rest.slice(split+2).replace(' Student Paper Award Finalist.','')};
}
function render(){
 const year=document.querySelector('#year').value;
 const selected=papers.filter(p=>(filter==='all'||(filter==='first'?p.first:!p.first))&&(year==='all'||p.year===year)).sort((a,b)=>b.year-a.year||a.n-b.n);
 list.replaceChildren();
 if(!selected.length){const p=document.createElement('p');p.className='empty';p.textContent='No papers match these filters.';list.append(p);return;}
 for(const p of selected){
  const data=splitPaper(p),row=document.createElement('article');row.className='paper';row.dataset.paperId=String(p.n);
  const y=document.createElement('span');y.className='paper-year';y.textContent=p.year;row.append(y);
  const body=document.createElement('div'),h=document.createElement('h3');
  if(p.url){
   const link=document.createElement('a');
   link.className='paper-link';link.href=p.url;link.target='_blank';link.rel='noopener noreferrer';
   link.setAttribute('aria-label',data.title+' — open article in a new tab');
   link.textContent=data.title;h.append(link);
  }else{h.textContent=data.title;}
  body.append(h);
  const authors=document.createElement('p');authors.textContent=data.authors;body.append(authors);
  const journal=document.createElement('p');journal.className='journal';journal.textContent=data.journal;body.append(journal);
  if(p.link_status==='forthcoming'){
   const status=document.createElement('span');status.className='paper-status';
   status.textContent='Accepted · article page forthcoming';body.append(status);
  }
  if(p.n===8){const award=document.createElement('span');award.className='award';award.textContent='↗ Student Paper Award Finalist';body.append(award);}
  row.append(body);const num=document.createElement('span');num.className='paper-num';num.textContent=String(p.n).padStart(2,'0');row.append(num);list.append(row);
 }
}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});render();}));
document.querySelector('#year').addEventListener('change',render);
try {
 papers=JSON.parse(document.querySelector('#publication-data').textContent);
 render();
} catch (error) {
 console.error('Publication filters unavailable; the full publication list remains visible.');
}
