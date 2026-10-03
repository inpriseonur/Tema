(function() {
  function getPath(url) {
    try {
      var parsed = new URL(url, window.location.origin);
      return parsed.pathname + parsed.search;
    } catch (error) {
      return url || '';
    }
  }

  function centsToAmount(value) {
    var cents = parseInt(value, 10);
    if (Number.isNaN(cents)) return undefined;
    return cents / 100;
  }

  function parseIndex(value) {
    var index = parseInt(value, 10);
    return Number.isNaN(index) ? undefined : index;
  }

  function compactObject(object) {
    var output = {};
    Object.keys(object).forEach(function(key) {
      var value = object[key];
      if (value !== undefined && value !== null && value !== '') output[key] = value;
    });
    return output;
  }

  function trackProductClick(link) {
    if (typeof window.gtag !== 'function') return;

    var itemListId = link.dataset.ga4ListId || '';
    var itemListName = link.dataset.ga4ListName || '';
    var item = compactObject({
      item_id: link.dataset.ga4ItemId,
      item_name: link.dataset.ga4ItemName,
      item_variant: link.dataset.ga4ItemVariant,
      item_brand: link.dataset.ga4ItemBrand,
      item_category: link.dataset.ga4ItemCategory,
      price: centsToAmount(link.dataset.ga4Price),
      currency: link.dataset.ga4Currency,
      index: parseIndex(link.dataset.ga4Index),
      item_list_id: itemListId,
      item_list_name: itemListName
    });

    window.gtag('event', 'select_item', compactObject({
      item_list_id: itemListId,
      item_list_name: itemListName,
      pg_click_area: link.dataset.ga4ClickArea,
      pg_source_page_type: link.dataset.ga4SourcePageType,
      pg_source_page_name: link.dataset.ga4SourcePageName,
      pg_item_name: link.dataset.ga4ItemName,
      pg_destination_url: getPath(link.href),
      items: [item]
    }));
  }

  function trackPromotionClick(link) {
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', 'select_promotion', compactObject({
      promotion_id: link.dataset.ga4PromotionId,
      promotion_name: link.dataset.ga4PromotionName,
      creative_name: link.dataset.ga4CreativeName,
      creative_slot: link.dataset.ga4CreativeSlot,
      pg_click_area: link.dataset.ga4ClickArea,
      pg_source_page_type: link.dataset.ga4SourcePageType,
      pg_source_page_name: link.dataset.ga4SourcePageName,
      pg_destination_url: getPath(link.href)
    }));
  }

  document.addEventListener('click', function(event) {
    var productLink = event.target.closest('a[data-ga4-product-click]');
    if (productLink) {
      trackProductClick(productLink);
      return;
    }

    var promotionLink = event.target.closest('a[data-ga4-promotion-click]');
    if (promotionLink) trackPromotionClick(promotionLink);
  });
})();
