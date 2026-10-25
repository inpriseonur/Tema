/* Collection toolbar and mobile sheet. Uses Shopify's existing facet renderer. */
(() => {
  const mobileQuery = '(max-width: 767px)';

  function filterEntries(params) {
    return Array.from(params.entries()).filter(([key, value]) => value !== '' &&
      (key.startsWith('filter.') || key === 'q' || key === 'constraint'));
  }

  function initialize(root) {
    if (root.dataset.collectionControlsReady) return;
    const panel = root.querySelector('[data-collection-filter-panel]');
    const form = root.querySelector('[data-collection-filter-form]');
    const opener = root.querySelector('[data-collection-filter-open]');
    if (!panel || !form || !opener) return;
    root.dataset.collectionControlsReady = 'true';
    const media = window.matchMedia(mobileQuery);
    const backdrop = root.querySelector('[data-collection-filter-backdrop]');
    const apply = root.querySelector('[data-collection-filter-apply]');
    const clear = root.querySelector('[data-collection-filter-clear]');
    const error = root.querySelector('[data-collection-filter-error]');
    let open = false;
    let busy = false;
    let snapshot = [];
    let previousFocus;
    let bodyOverflow;
    let htmlOverflow;

    function updateToolbar() {
      const current = new URL(window.location.href);
      const path = current.pathname.replace(/\/$/, '');
      const entries = filterEntries(current.searchParams);
      let best;
      let bestScore = -1;
      root.querySelectorAll('[data-collection-quick-link]').forEach((link) => {
        link.removeAttribute('aria-current');
        const url = new URL(link.href, current);
        const shopOrigin = root.dataset.shopUrl ? new URL(root.dataset.shopUrl).origin : current.origin;
        if (url.origin !== current.origin && url.origin !== shopOrigin) return;
        // Internal links also stay on the current preview domain while testing.
        if (url.origin === shopOrigin) link.setAttribute('href', url.pathname + url.search + url.hash);
        if (url.pathname.replace(/\/$/, '') !== path) return;
        const required = filterEntries(url.searchParams);
        const keys = [...new Set(required.map(([key]) => key))];
        const matches = keys.every((key) => {
          const values = required.filter(([name]) => name === key).map(([, value]) => value).sort();
          const active = entries.filter(([name]) => name === key).map(([, value]) => value).sort();
          return JSON.stringify(values) === JSON.stringify(active);
        });
        // "All products" must not look selected while a vendor/category filter is active.
        if (!required.length && /\/collections\/all$/.test(path) && entries.length) return;
        if (!matches) return;
        const score = required.length;
        if (score > bestScore) { best = link; bestScore = score; }
      });
      if (best) best.setAttribute('aria-current', 'page');
      const badge = root.querySelector('[data-collection-filter-count]');
      if (badge) { badge.textContent = entries.length || ''; badge.hidden = !entries.length; }
      const sort = current.searchParams.get('sort_by') || root.dataset.defaultSort;
      form.querySelectorAll('[name="sort_by"]').forEach((input) => {
        if (input.type === 'radio') input.checked = input.value === sort;
        else input.value = sort;
      });
      root.querySelectorAll('[data-collection-sort-value]').forEach((link) => {
        const url = new URL(current);
        url.searchParams.set('sort_by', link.dataset.collectionSortValue);
        url.searchParams.delete('page');
        link.href = url.pathname + url.search;
        if (link.dataset.collectionSortValue === sort) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }

    function syncRanges() {
      form.querySelectorAll('range-slider').forEach((range) => {
        const fields = range.querySelectorAll('.input-prefix-field');
        const sliders = range.querySelectorAll('input[type="range"]');
        if (fields.length !== 2 || sliders.length !== 2) return;
        const maximum = Number(sliders[1].max) || 1;
        sliders[0].value = fields[0].value || sliders[0].min;
        sliders[1].value = fields[1].value || sliders[1].max;
        const group = range.querySelector('.range-slider-group');
        group.style.setProperty('--range-min', `${Number(sliders[0].value) / maximum * 100}%`);
        group.style.setProperty('--range-max', `${Number(sliders[1].value) / maximum * 100}%`);
      });
    }

    function openPanel() {
      if (!media.matches || open || busy) return;
      updateToolbar();
      snapshot = Array.from(form.elements).map((input) => ({
        input, value: input.value, checked: input.checked, disabled: input.disabled
      }));
      previousFocus = document.activeElement;
      bodyOverflow = document.body.style.overflow;
      htmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      panel.classList.remove('active');
      panel.classList.add('collection-filter-panel--open');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      backdrop.hidden = false;
      opener.setAttribute('aria-expanded', 'true');
      error.hidden = true;
      open = true;
      panel.querySelector('[data-collection-filter-close]').focus({ preventScroll: true });
    }

    function closePanel(commit = false, force = false) {
      if (!open || (busy && !force)) return;
      if (!commit) {
        snapshot.forEach(({ input, value, checked, disabled }) => {
          if (!input.isConnected) return;
          input.value = value; input.checked = checked; input.disabled = disabled;
        });
        syncRanges();
      }
      open = false;
      panel.classList.remove('collection-filter-panel--open');
      panel.removeAttribute('role');
      panel.removeAttribute('aria-modal');
      backdrop.hidden = true;
      opener.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    }

    function stageClear(url) {
      const params = url ? new URL(url, window.location.href).searchParams : new URLSearchParams();
      form.querySelectorAll('[name^="filter."]').forEach((input) => {
        const values = params.getAll(input.name);
        if (input.type === 'checkbox') {
          input.checked = values.includes(input.value);
          // With no draft request, allow combinations whose availability will be resolved on Apply.
          input.disabled = false;
        } else input.value = values[0] || '';
      });
      if (!url) {
        form.querySelectorAll('[name="sort_by"]').forEach((input) => {
          if (input.type === 'radio') input.checked = input.value === root.dataset.defaultSort;
          else input.value = root.dataset.defaultSort;
        });
      }
      syncRanges();
    }

    async function applyFilters() {
      if (busy || !open) return;
      const FacetForm = customElements.get('stfilter-ele');
      if (!FacetForm) { error.hidden = false; return; }
      const params = new URLSearchParams(window.location.search);
      for (const key of [...params.keys()]) {
        if (key.startsWith('filter.') || key === 'sort_by' || key === 'page' || key === 'section_id') params.delete(key);
      }
      const data = new FormData(form);
      const names = new Set(Array.from(data.keys()));
      names.forEach((name) => {
        params.delete(name);
        data.getAll(name).forEach((value) => { if (value !== '') params.append(name, value); });
      });
      busy = true;
      apply.disabled = clear.disabled = true;
      panel.setAttribute('aria-busy', 'true');
      error.hidden = true;
      const success = await FacetForm.renderPage(params.toString());
      busy = false;
      apply.disabled = clear.disabled = false;
      panel.removeAttribute('aria-busy');
      if (success) {
        closePanel(true);
        updateToolbar();
      } else error.hidden = false;
    }

    function onClick(event) {
      if (event.target.closest('[data-collection-filter-open]') && media.matches) openPanel();
      if (event.target.closest('[data-collection-filter-close]') && media.matches) closePanel();
      if (event.target === backdrop) closePanel();
      if (event.target.closest('[data-collection-filter-clear]')) stageClear();
      if (event.target.closest('[data-collection-filter-apply]')) applyFilters();
    }

    function onKeydown(event) {
      if (!open) return;
      if (event.key === 'Escape') { event.preventDefault(); closePanel(); }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(panel.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select, [tabindex="0"]'))
        .filter((element) => element.getClientRects().length);
      if (!focusable.length) { event.preventDefault(); panel.focus(); return; }
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }

    function onDraftClear(event) { stageClear(event.detail.url); }
    function onMediaChange() {
      if (!media.matches && open) closePanel(false, true);
    }
    function onCollectionUpdated() {
      if (open && !busy) closePanel(true);
      updateToolbar();
      root.querySelector('[data-collection-toolbar-error]').hidden = true;
    }
    function onUpdateError() {
      const message = root.querySelector('[data-collection-toolbar-error]');
      if (message) message.hidden = media.matches;
    }
    function onSubmit(event) {
      if (!media.matches) return;
      event.preventDefault(); applyFilters();
    }
    function onUnload(event) {
      if (!event.target.contains(root)) return;
      busy = false; closePanel();
      root.removeEventListener('click', onClick);
      root.removeEventListener('collection:draft-clear', onDraftClear);
      form.removeEventListener('submit', onSubmit);
      media.removeEventListener('change', onMediaChange);
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('collection:updated', onCollectionUpdated);
      document.removeEventListener('collection:update-error', onUpdateError);
      document.removeEventListener('shopify:section:unload', onUnload);
      delete root.dataset.collectionControlsReady;
    }

    root.addEventListener('click', onClick);
    root.addEventListener('collection:draft-clear', onDraftClear);
    form.addEventListener('submit', onSubmit);
    media.addEventListener('change', onMediaChange);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('collection:updated', onCollectionUpdated);
    document.addEventListener('collection:update-error', onUpdateError);
    document.addEventListener('shopify:section:unload', onUnload);
    updateToolbar();
  }

  function boot(scope = document) {
    scope.querySelectorAll('[data-collection-controls]').forEach(initialize);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => boot(), { once: true });
  else boot();
  document.addEventListener('shopify:section:load', (event) => boot(event.target));
})();
