function stCallTestClass(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function stProprshow(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function stProtoOf(o) {
  stProtoOf = Object.setPrototypeOf ? Object.getPrototypeOf : function stProtoOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return stProtoOf(o);
}
function stNewclass(Constructor, protoProps, staticProps) {
  if (protoProps) stProprshow(Constructor.prototype, protoProps);
  if (staticProps) stProprshow(Constructor, staticProps);
  return Constructor;
}
function stNatiRefConst() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function stNewSuper(Derived) {
  var stNativeReflConst = stNatiRefConst();
  return function stNewSuperInternal() {
    var Super = stProtoOf(Derived),
        result;
    if (stNativeReflConst) {
      var NewTarget = stProtoOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return stPossConstReturn(this, result);
  };
}
function stPossConstReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}
function stInherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function stNativeFunc(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function stConst(Parent, args, Class) {
  if (stNatiRefConst()) {
    stConst = Reflect.construct;
  } else {
    stConst = function stConst(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }
  return stConst.apply(null, arguments);
}
function stNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  stNativeSuper = function stNativeSuper(Class) {
    if (Class === null || !stNativeFunc(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return stConst(Class, arguments, stProtoOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };
  return stNativeSuper(Class);
}
class stFacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.StonActiveFilterTrigger = this.StonActiveFilterTrigger.bind(this);
    this.debouncedOnSubmit = stdebounce((event) => {
      this.triggerSendHand(event);
    }, 500);
    this.querySelector('form').addEventListener('input', (event) => {
      if (this.isMobileCollection()) return;
      this.debouncedOnSubmit(event);
    });
    const facetWrapper = this.querySelector('#st-wrapper');
    if (facetWrapper) facetWrapper.addEventListener('keyup', escClick);
  }
  isMobileCollection() {
    return !!this.closest('[data-collection-controls]') && window.matchMedia('(max-width: 767px)').matches;
  }
  static setListeners() {
    const stOnHistChange = (event) => {
      const searchParams = typeof event.state?.searchParams === 'string' ? event.state.searchParams : window.location.search.slice(1);
      if (searchParams === stFacetFiltersForm.searchParamsPrev) return;
      stFacetFiltersForm.renderPage(searchParams, null, false);
    }
    window.addEventListener('popstate', stOnHistChange);
  }
  static stToggActive(disable = true) {
    document.querySelectorAll('.js-flt-clear').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }
  static async renderPage(searchParams, event, stUpdateURLHash = true) {
    const requestId = ++stFacetFiltersForm.requestId;
    if (stFacetFiltersForm.requestController) stFacetFiltersForm.requestController.abort();
    const controller = new AbortController();
    stFacetFiltersForm.requestController = controller;
    const grid = document.getElementById('ProductGridContainer');
    const collection = grid && grid.querySelector('.collection');
    if (!grid || !collection) return false;
    collection.classList.add('loading');
    grid.setAttribute('aria-busy', 'true');
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const section = stFacetFiltersForm.stGetSections()[0].section;
      const url = `${window.location.pathname}?section_id=${section}&${searchParams}`;
      const cached = stFacetFiltersForm.filterData.find((entry) => entry.url === url);
      let html;
      if (cached) {
        html = cached.html;
      } else {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Collection request failed');
        html = await response.text();
      }
      if (requestId !== stFacetFiltersForm.requestId) return false;
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      if (!parsed.getElementById('ProductGridContainer') || !parsed.querySelector('#stFacetFiltersForm')) {
        throw new Error('Invalid collection response');
      }
      if (!cached) {
        stFacetFiltersForm.filterData.push({ html, url });
        stFacetFiltersForm.filterData = stFacetFiltersForm.filterData.slice(-10);
      }
      stFacetFiltersForm.renderFilters(html, event);
      stFacetFiltersForm.stRenderProGridCont(html);
      stFacetFiltersForm.stIncludeProCount(html);
      stFacetFiltersForm.searchParamsPrev = searchParams;
      if (stUpdateURLHash) stFacetFiltersForm.stUpdateURLHash(searchParams);
      document.dispatchEvent(new CustomEvent('collection:updated', { detail: { searchParams } }));
      return true;
    } catch (error) {
      if (requestId === stFacetFiltersForm.requestId) {
        document.dispatchEvent(new CustomEvent('collection:update-error'));
      }
      return false;
    } finally {
      clearTimeout(timeout);
      if (requestId === stFacetFiltersForm.requestId) {
        grid.querySelector('.collection')?.classList.remove('loading');
        grid.removeAttribute('aria-busy');
        stFacetFiltersForm.stToggActive(false);
      }
    }
  }
  static stRenderProGridCont(html) {
    document.getElementById('ProductGridContainer').innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductGridContainer').innerHTML;
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    $(document).ready(function() {
      if($(".shopify-product-reviews-badge").length > 0 && typeof window.SPR == 'function'){
        window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
      }
      $('.item-data').on("click", function() {
        $(this).parents('.option-block').find(".variant-option").removeClass('active-variant');
        $(this).closest('form-wrap').addClass('active-variant');
        var it_img = $(this).attr('dataimg');
        $(this).parents('.single-product-wrap').find('.product-image .img1 img').attr('src',it_img);
      $(this).parents('.single-product-wrap').find('.product-image .img1 img').attr('srcset',it_img);
        var price = $(this).attr('dataprice');
        var compareprice = $(this).attr('datacompare');
        var stocks = $(this).attr('dataavailable');
        $(this).parents('.single-product-wrap').find('.price-box .new-price').text(Shopify.formatMoney(price, window.money_format));
        if (compareprice > price) {
          $(this).parents('.single-product-wrap').find('.price-box .old-price').show();
          $(this).parents('.single-product-wrap').find('.price-box .old-price').html(Shopify.formatMoney(compareprice, window.money_format));
        }else{
          $(this).parents('.single-product-wrap').find('.price-box .old-price').hide();
        }
      });
    });
  }
  static stIncludeProCount(html) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
    const source = parsedHTML.getElementById('pro-count');
    const container = document.getElementById('pro-count');
    if (source && container) {
      container.innerHTML = source.innerHTML;
      container.classList.remove('loading');
    }
    const toolbarCountSource = parsedHTML.getElementById('CollectionToolbarCount');
    const toolbarCountContainer = document.getElementById('CollectionToolbarCount');
    if (toolbarCountSource && toolbarCountContainer) {
      toolbarCountContainer.innerHTML = toolbarCountSource.innerHTML;
    }
  }
  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
    const stfacetDetailsEle =
      parsedHTML.querySelectorAll('#stFacetFiltersForm .st-filter, #stFacetFiltersFormMobile .st-filter');
    const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest('.st-filter') : undefined;
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
    }
    const facetsToRender = Array.from(stfacetDetailsEle).filter(element => !matchesIndex(element));
    const countsToRender = Array.from(stfacetDetailsEle).find(matchesIndex);
    facetsToRender.forEach((element) => {
      const target = document.querySelector(`.st-filter[data-index="${element.dataset.index}"]`);
      if (target) target.innerHTML = element.innerHTML;
    });
    stFacetFiltersForm.stIncludeActiveFacets(parsedHTML);
    if (countsToRender) stFacetFiltersForm.stIncludeCounts(countsToRender, event.target.closest('.st-filter'));
  }
  static stIncludeActiveFacets(html) {
    const stActiveFacetEleSele = ['.active-facets-mobile', '.active-flt'];
    stActiveFacetEleSele.forEach((selector) => {
      const stActiveFacetEle = html.querySelector(selector);
      if (!stActiveFacetEle) return;
      const target = document.querySelector(selector);
      if (target) target.innerHTML = stActiveFacetEle.innerHTML;
    })
    stFacetFiltersForm.stToggActive(false);
  }
  static stIncludeCounts(source, target) {
    const stTargetEle = target.querySelector('.flt-selected');
    const stSourceEle = source.querySelector('.flt-selected');
    if (stSourceEle && stTargetEle) {
      target.querySelector('.flt-selected').outerHTML = source.querySelector('.flt-selected').outerHTML;
    }
  }
  static stUpdateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }
  static stGetSections() {
    return [
      {
        section: document.getElementById('product-grid').dataset.id,
      }
    ]
  }
  triggerSendHand(event) {
    event.preventDefault();
    if (this.isMobileCollection()) return;
    const formData = new FormData(event.target.closest('form'));
    const searchParams = new URLSearchParams(formData).toString();
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    stFacetFiltersForm.renderPage(params.toString(), event);
  }
  StonActiveFilterTrigger(event) {
    event.preventDefault();
    if (this.isMobileCollection()) {
      this.dispatchEvent(new CustomEvent('collection:draft-clear', {
        bubbles: true,
        detail: { url: event.currentTarget.href }
      }));
      return;
    }
    stFacetFiltersForm.stToggActive();
    const url = event.currentTarget.href.indexOf('?') == -1 ? '' : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    stFacetFiltersForm.renderPage(url);
  }
}
stFacetFiltersForm.requestId = 0;
stFacetFiltersForm.filterData = [];
stFacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
stFacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('stfilter-ele', stFacetFiltersForm);
stFacetFiltersForm.setListeners();
var stPriceRanger = /*#__PURE__*/function (_HTMLElement) {
    stInherits(stPriceRanger, _HTMLElement);
    var _super = stNewSuper(stPriceRanger);
    function stPriceRanger() {
      stCallTestClass(this, stPriceRanger);
      return _super.apply(this, arguments);
    }
    stNewclass(stPriceRanger, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this = this;
        this.rangeLowerBound = this.querySelector('.range-slider-group input:first-child');
        this.rangeHigherBound = this.querySelector('.range-slider-group input:last-child');
        this.textInputLowerBound = this.querySelector('.range-slider-input:first-child input');
        this.textInputHigherBound = this.querySelector('.range-slider-input:last-child input'); // Select whole text on focus for text field to improve user experience
        this.textInputLowerBound.addEventListener('focus', function () {
          return _this.textInputLowerBound.select();
        });
        this.textInputHigherBound.addEventListener('focus', function () {
          return _this.textInputHigherBound.select();
        }); // Keep in sync the range with the text input fields
        this.textInputLowerBound.addEventListener('change', function (event) {
          event.target.value = Math.max(Math.min(parseInt(event.target.value), parseInt(_this.textInputHigherBound.value || event.target.max) - 1), event.target.min);
          _this.rangeLowerBound.value = event.target.value;
          _this.rangeLowerBound.parentElement.style.setProperty('--range-min', "".concat(parseInt(_this.rangeLowerBound.value) / parseInt(_this.rangeLowerBound.max) * 100, "%"));
        });
        this.textInputHigherBound.addEventListener('change', function (event) {
          event.target.value = Math.min(Math.max(parseInt(event.target.value), parseInt(_this.textInputLowerBound.value || event.target.min) + 1), event.target.max);
          _this.rangeHigherBound.value = event.target.value;
          _this.rangeHigherBound.parentElement.style.setProperty('--range-max', "".concat(parseInt(_this.rangeHigherBound.value) / parseInt(_this.rangeHigherBound.max) * 100, "%"));
        });
        this.rangeLowerBound.addEventListener('change', function (event) {
          _this.textInputLowerBound.value = event.target.value;
          _this.textInputLowerBound.dispatchEvent(new Event('change', {
            bubbles: true
          }));
        });
        this.rangeHigherBound.addEventListener('change', function (event) {
          _this.textInputHigherBound.value = event.target.value;

          _this.textInputHigherBound.dispatchEvent(new Event('change', {
            bubbles: true
          }));
        }); // We also have to bound the two range sliders

        this.rangeLowerBound.addEventListener('input', function (event) {
          _this.dispatchEvent(new CustomEvent('collection:abort-loading', {
            bubbles: true
          }));

          event.target.value = Math.min(parseInt(event.target.value), parseInt(_this.textInputHigherBound.value || event.target.max) - 1); // Bound the value

          event.target.parentElement.style.setProperty('--range-min', "".concat(parseInt(event.target.value) / parseInt(event.target.max) * 100, "%"));
          _this.textInputLowerBound.value = event.target.value;
        });
        this.rangeHigherBound.addEventListener('input', function (event) {
          _this.dispatchEvent(new CustomEvent('collection:abort-loading', {
            bubbles: true
          }));

          event.target.value = Math.max(parseInt(event.target.value), parseInt(_this.textInputLowerBound.value || event.target.min) + 1); // Bound the value

          event.target.parentElement.style.setProperty('--range-max', "".concat(parseInt(event.target.value) / parseInt(event.target.max) * 100, "%"));
          _this.textInputHigherBound.value = event.target.value;
        });
      }
    }]);
    return stPriceRanger;
  }( /*#__PURE__*/stNativeSuper(HTMLElement));
  window.customElements.define('range-slider', stPriceRanger);
class stFacetRemove extends HTMLElement {
  constructor() {
    super();
    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault();
      const form = this.closest('stfilter-ele') || document.querySelector('stfilter-ele');
      form.StonActiveFilterTrigger(event);
    });
  }
}
customElements.define('flt-clear', stFacetRemove);
