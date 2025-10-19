(async function () {
  const qs = new URLSearchParams(location.search);
  const startPage = Math.max(1, parseInt(qs.get('page') || '1', 10));
  const res = await fetch('manifest.json');
  const manifest = await res.json();
  const pages = manifest.pages;

  const brand = document.querySelector('.brand');
  brand.textContent = manifest.title + ' · ' + pages.length + ' pages';

  const container = document.querySelector('main');
  for (let i = 0; i < pages.length; i++) {
    const section = document.createElement('section');
    section.className = 'page';
    section.id = 'p' + (i + 1);
    const img = document.createElement('img');
    img.alt = `Page ${i+1} of ${pages.length}`;
    img.loading = i === 0 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.src = pages[i];
    section.appendChild(img);
    container.appendChild(section);
  }

  // Keyboard navigation
  function goto(delta) {
    const current = Math.max(1, Math.min(pages.length, Math.round(window.scrollY / window.innerHeight) + 1));
    const target = Math.max(1, Math.min(pages.length, current + delta));
    document.querySelector('#p' + target)?.scrollIntoView({behavior: 'smooth'});
    history.replaceState(null, '', '?page=' + target);
  }
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'arrowdown' || k === 'pagedown' || k === ' ') goto(+1);
    if (k === 'arrowup' || k === 'pageup') goto(-1);
    if (k === 'home') goto(-(pages.length));
    if (k === 'end') goto(+(pages.length));
    if (k === 'arrowright') goto(+1);
    if (k === 'arrowleft') goto(-1);
  });

  // Initial page
  setTimeout(() => {
    document.querySelector('#p' + startPage)?.scrollIntoView({behavior: 'instant'});
  }, 0);

  // Download PDF action
  const dl = document.querySelector('#download');
  dl?.addEventListener('click', () => {
    window.open(manifest.pdf, '_blank');
  });
})();
