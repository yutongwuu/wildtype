'use strict';
// Edit content.json to update the public website. No browser-local edits override it.
(async function () {
  const main = document.getElementById('main');
  const homeTemplate = main.innerHTML;
  const pages = {'home':'Home','engineering-work':'Engineering Work','arts':'Arts','readings':'Readings','blog':'Blog'};
  let content;
  function safeURL(value) {
    if (!value) return '';
    try { const u = new URL(value, document.baseURI); return ['https:','http:','mailto:'].includes(u.protocol) || (u.protocol === 'data:' && /^data:image\/(png|jpeg|webp|gif);base64,/i.test(value)) ? value : ''; } catch { return ''; }
  }
  function render() {
    const slug = location.hash.slice(1) || 'home';
    const page = pages[slug] || 'Home';
    main.replaceChildren();
    if (page === 'Home') {
      main.innerHTML = homeTemplate;
      main.querySelectorAll('[data-edit]').forEach(el => {
        const key = el.dataset.edit;
        if (!key.startsWith('p.') && Object.hasOwn(content.text, key)) el.textContent = content.text[key];
      });
      const projects = main.querySelector('.projects');
      const articleTemplate = projects.querySelector('article').cloneNode(true);
      projects.replaceChildren();
      content.projects.forEach(p => {
        const article = articleTemplate.cloneNode(true);
        article.querySelector('.taxon').textContent = p.name;
        article.querySelector('.caption').textContent = p.caption || '';
        const picture = article.querySelector('.picture');
        picture.replaceChildren();
        const imageURL = safeURL(p.image);
        if (imageURL) {
          const image = document.createElement('img');
          image.src = imageURL; image.alt = p.imageAlt || p.name + ' illustration'; image.loading = 'lazy';
          picture.append(image);
        } else {
          const placeholder = document.createElement('span');
          placeholder.className = 'specimen'; placeholder.textContent = 'illustration';
          placeholder.setAttribute('aria-label', p.name + ' illustration placeholder'); picture.append(placeholder);
        }
        const url = safeURL(p.url);
        if (url) {
          const heading = article.querySelector('.taxon');
          const link = document.createElement('a'); link.href = url; link.textContent = p.name;
          heading.replaceChildren(link);
        }
        projects.append(article);
      });
    } else {
      const section = document.createElement('section'); section.className = 'other';
      const h1 = document.createElement('h1'); h1.textContent = page;
      const p = document.createElement('p'); p.textContent = content.text[page.replaceAll(' ', '_')] || '';
      section.append(h1, p); main.append(section);
    }
    document.querySelectorAll('[data-page]').forEach(button => {
      if (button.dataset.page === page) button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
  }
  try {
    const response = await fetch('./content.json', {cache:'no-cache'});
    if (!response.ok) throw new Error('Content not available');
    content = await response.json();
    if (!content.text || !Array.isArray(content.projects)) throw new Error('Invalid content.json');
    document.title = content.site.title;
    const units = {left:'%', leftLine:'', leftAlign:''};
    Object.entries(content.settings).forEach(([key,value]) => {
      if (key !== 'font') document.documentElement.style.setProperty('--'+key, String(value)+(units[key] ?? 'px'));
    });
    if (content.settings.font === 'sans') {
      const style = document.createElement('style'); style.textContent = 'h1,h2,.brand,.taxon{font-family:Arial,sans-serif}'; document.head.append(style);
    }
    const footer = document.querySelector('[data-edit="footer"]');
    footer.textContent = content.text.footer;
    if (content.site.email) {
      const link = document.createElement('a'); link.href = 'mailto:'+content.site.email; link.textContent = content.site.email;
      footer.replaceChildren(document.createTextNode('Contact: '),link);
    }
    const logoURL = safeURL(content.site.logo);
    if (logoURL) {
      const link = document.createElement('a'); link.href = '#home';
      const image = document.createElement('img'); image.className='header-logo'; image.src=logoURL; image.alt=content.site.logoAlt || 'Home';
      link.append(image); document.querySelector('.header').prepend(link);
    }
    document.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => {
      const slug = Object.keys(pages).find(key => pages[key] === button.dataset.page);
      if (location.hash === '#'+slug) { render(); main.focus(); } else location.hash = slug;
    }));
    window.addEventListener('hashchange', () => {render(); main.focus();});
    render();
  } catch (error) {
    console.error('Wildtype: showing the embedded backup; check content.json or serve over HTTP.', error);
    // Preserve the readable exported homepage if the content request fails.
  }
})();
