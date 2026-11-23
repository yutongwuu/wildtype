'use strict';
(async () => {
  const main = document.getElementById('main');
  const fallback = main.innerHTML;
  const pages = {home:'Home',projects:'Projects',readings:'Readings',arts:'Arts',blog:'Blog'};
  let content;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function url(value) {if(!value)return '';try {const u=new URL(value,document.baseURI);return ['https:','http:','mailto:'].includes(u.protocol)?value:''}catch{return ''}}
  function cleanHTML(value) {
    const doc=new DOMParser().parseFromString(value,'text/html');
    const allowed=['P','H1','H2','STRONG','B','EM','I','A','UL','OL','LI','BR','DIV'];
    function walk(parent){[...parent.children].forEach(el=>{if(['SCRIPT','STYLE','IFRAME','OBJECT'].includes(el.tagName)){el.remove();return}walk(el);if(!allowed.includes(el.tagName)){el.replaceWith(...el.childNodes);return}const href=el.getAttribute('href');[...el.attributes].forEach(a=>el.removeAttribute(a.name));if(el.tagName==='A'&&url(href))el.setAttribute('href',href)})}
    walk(doc.body);return doc.body.innerHTML;
  }
  function cards() {
    return '<section class="projects" aria-label="Selected projects">'+content.projects.map(p=>{
      const image=url(p.image)?'<img src="'+esc(url(p.image))+'" alt="'+esc(p.imageAlt||p.name)+'" loading="lazy">':'<span class="specimen">Photo / PNG</span>';
      const body='<div class="picture"><div class="photo-disc">'+image+'</div></div><h2 class="taxon">'+esc(p.name)+'</h2><p class="caption"><mark class="modality-text">'+esc(p.caption)+'</mark></p><p class="project-highlight">'+esc(p.highlights)+'</p>';
      return '<article class="project">'+(url(p.url)?'<a class="bubble-link" href="'+esc(url(p.url))+'">'+body+'</a>':body)+'</article>';
    }).join('')+'</section>';
  }
  const personal={Arts:[['Photography','personal/photography.html'],['Guzheng / 古筝','personal/guzheng.html'],['Theater','personal/theater.html'],['Arts education NGO','https://letsummerbe.github.io/content/#resources']],Blog:[['German essays / 德语文章','https://yutongw.blogspot.com/']],Readings:[['Literature library / 文献库','personal/readings.html']]};
  function render() {
    const page=pages[location.hash.slice(1)]||'Home';
    if(page==='Home') {
      const bio=content.bioBlocks.map(b=>'<div class="bio-block" style="margin-bottom:'+Math.max(0,Number(b.spacing)||22)+'px;text-align:'+(['left','center','right'].includes(b.align)?b.align:'left')+'">'+cleanHTML(b.html)+'</div>').join('');
      main.innerHTML='<div class="home"><section class="intro" aria-label="Introduction">'+bio+'</section>'+cards()+'</div>';
    } else if(page==='Projects') main.innerHTML='<section class="project-catalog"><h1>Projects</h1>'+cards()+'</section>';
    else main.innerHTML='<section class="other"><h1>'+page+'</h1><ul class="personal-list">'+personal[page].map(([label,href])=>'<li><a href="'+esc(href)+'">'+esc(label)+'</a></li>').join('')+'</ul></section>';
    document.querySelectorAll('[data-page]').forEach(b=>{if(b.dataset.page===page)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  }
  try {
    const response=await fetch('./content.json',{cache:'no-cache'});if(!response.ok)throw Error('Content unavailable');content=await response.json();
    const units={left:'%',leftLine:'',leftAlign:''};
    Object.entries(content.settings).forEach(([k,v])=>{if(k!=='font')document.documentElement.style.setProperty('--'+k,String(v)+(units[k]??'px'))});
    document.documentElement.style.setProperty('--ring-width',(content.bubbles.ringWidth||10)+'px');
    document.documentElement.style.setProperty('--photo-fit',content.bubbles.fit||'cover');
    if(content.settings.font==='sans'){const s=document.createElement('style');s.textContent='h1,h2,.taxon{font-family:Arial,sans-serif}';document.head.append(s)}
    render();document.documentElement.dataset.contentLoaded='true';
    document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>{const slug=Object.keys(pages).find(k=>pages[k]===b.dataset.page);if(location.hash==='#'+slug){render();main.focus()}else location.hash=slug}));
    window.addEventListener('hashchange',()=>{render();main.focus()});
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
    function reset(){document.querySelectorAll('.picture').forEach(el=>{el.style.removeProperty('--bx');el.style.removeProperty('--by')})}
    document.addEventListener('pointermove',e=>{if(frame||!content.bubbles.motion||reduced.matches||e.pointerType!=='mouse')return;const x=e.clientX,y=e.clientY;frame=requestAnimationFrame(()=>{frame=0;document.querySelectorAll('.projects .picture').forEach(el=>{const r=el.getBoundingClientRect();const dx=x-(r.left+r.width/2),dy=y-(r.top+r.height/2),distance=Math.hypot(dx,dy),strength=Math.max(0,1-distance/240);el.style.setProperty('--bx',dx/(distance||1)*8*strength+'px');el.style.setProperty('--by',dy/(distance||1)*8*strength+'px')})})},{passive:true});
    document.documentElement.addEventListener('pointerleave',reset);window.addEventListener('blur',reset);reduced.addEventListener('change',reset);
  } catch(error) {main.innerHTML=fallback;console.error('Wildtype: displaying the saved homepage. Check content.json.',error)}
})();
