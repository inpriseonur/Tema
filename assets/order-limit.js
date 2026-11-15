/*
  Prime Gurme — varyant bazlı sipariş adedi limiti (kampanya koruması).

  Limit kaynağı: varyant metafield'ı custom.max_order_quantity (tam sayı, boşsa limit yok).
  - Ürün sayfası limitleri window.PGOrderLimits içine { variantId: limit } olarak yazar.
  - Drawer / sepet satır inputları limiti data-order-limit ile taşır.

  Sadece arayüz koruması yapılır; limit tanımlı olmayan varyantlarda hiçbir akış değişmez.
  Ağ hatasında ekleme engellenmez (fail-open).
*/
(function () {
  if (window.PGOrderLimit) return;

  function toLimit(value) {
    var limit = parseInt(value, 10);
    return limit > 0 ? limit : null;
  }

  function getLimit(variantId) {
    if (!variantId) return null;
    variantId = String(variantId);
    var registry = window.PGOrderLimits || {};
    if (registry[variantId]) return toLimit(registry[variantId]);
    var input = document.querySelector('[data-quantity-variant-id="' + variantId + '"][data-order-limit]');
    return input ? toLimit(input.dataset.orderLimit) : null;
  }

  function getMessage(limit) {
    var template = window.PGOrderLimitMessage || 'Bu üründen tek siparişte en fazla [max] adet alabilirsiniz.';
    return template.replace(/\[max\]/g, limit);
  }

  var toastTimer = null;
  function notify(message) {
    var toast = document.getElementById('pg-order-limit-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pg-order-limit-toast';
      toast.setAttribute('role', 'alert');
      toast.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:100000;' +
        'max-width:calc(100% - 32px);width:max-content;padding:10px 16px;border-radius:7px;' +
        'background:#061f4f;color:#fff;font-size:13px;line-height:1.4;text-align:center;' +
        'box-shadow:0 4px 16px rgba(0,0,0,.18);';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 3000);
  }

  /* Sepetteki adet + eklenecek adet limiti aşıyor mu? */
  function check(variantId, addQuantity) {
    var limit = getLimit(variantId);
    if (!limit) return Promise.resolve({ ok: true, limit: null });
    addQuantity = parseInt(addQuantity, 10) || 1;
    if (addQuantity > limit) return Promise.resolve({ ok: false, limit: limit });

    return fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (response) { return response.json(); })
      .then(function (cart) {
        var inCart = 0;
        (cart.items || []).forEach(function (item) {
          if (String(item.variant_id) === String(variantId)) inCart += item.quantity;
        });
        return { ok: inCart + addQuantity <= limit, limit: limit, inCart: inCart };
      })
      .catch(function () { return { ok: true, limit: limit }; });
  }

  /* Ürün sayfası adet kutusu: max = min(limit, quantity_rule.max) */
  function applyToInput(input, variantId) {
    if (!input) return;
    var limit = getLimit(variantId);
    var ruleMax = toLimit(input.dataset.max);
    var max = limit && (!ruleMax || limit < ruleMax) ? limit : ruleMax;

    if (limit) input.dataset.orderLimit = limit;
    else delete input.dataset.orderLimit;

    if (max) input.setAttribute('max', max);
    else input.removeAttribute('max');

    if (max && parseInt(input.value, 10) > max) input.value = max;
    var box = input.closest('qty-box');
    if (box && typeof box.requreQtyterm === 'function') box.requreQtyterm();
  }

  /* Elle yazılan adeti limite çek (capture: tema dinleyicilerinden önce çalışır) */
  document.addEventListener('change', function (event) {
    var input = event.target;
    if (!input || !input.matches || !input.matches('input[data-order-limit]')) return;
    var limit = toLimit(input.dataset.orderLimit);
    if (limit && parseInt(input.value, 10) > limit) {
      input.value = limit;
      notify(getMessage(limit));
    }
  }, true);

  /* Ürün formu: limitli varyantta sepete eklemeden önce sepeti kontrol et */
  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || !form.matches || !form.matches('form[data-type="add-to-cart-form"]')) return;
    if (form.dataset.pgOrderLimitPassed === 'true') {
      delete form.dataset.pgOrderLimitPassed;
      return;
    }

    var idInput = form.querySelector('[name="id"]');
    var variantId = idInput && idInput.value;
    if (!getLimit(variantId)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    if (form.dataset.pgOrderLimitPending === 'true') return;
    form.dataset.pgOrderLimitPending = 'true';

    var quantity = new FormData(form).get('quantity') || 1;
    check(variantId, quantity).then(function (result) {
      delete form.dataset.pgOrderLimitPending;
      if (result.ok) {
        form.dataset.pgOrderLimitPassed = 'true';
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        return;
      }
      /* Drawer / sepet sayfasıyla aynı format: üstte kısa bildirim */
      notify(getMessage(result.limit));
    });
  }, true);

  window.PGOrderLimit = {
    getLimit: getLimit,
    getMessage: getMessage,
    notify: notify,
    check: check,
    applyToInput: applyToInput
  };
})();
