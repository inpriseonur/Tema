/* Scoped home carousels, including Shopify theme-editor section replacement. */
(() => {
  if (customElements.get('pg-home-carousel')) return;

  class HomeCarousel extends HTMLElement {
    connectedCallback() {
      this.start = this.start || this.initialize.bind(this);
      this.selectBlock = this.selectBlock || this.onBlockSelect.bind(this);
      this.addEventListener('shopify:block:select', this.selectBlock);
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', this.start, { once: true });
      } else {
        this.initialize();
      }
    }

    initialize() {
      if (!this.isConnected || this.carousel || !window.Swiper) return;
      const element = this.querySelector('.swiper');
      const config = this.querySelector('[data-carousel-options]');
      if (!element || !config || !element.querySelector('.swiper-slide')) return;
      const options = JSON.parse(config.textContent);
      const products = this.dataset.kind === 'products';
      if (options.navigation) {
        options.navigation = {
          prevEl: this.querySelector(products ? '[class*="slider-products__button-prev-"]' : '.arrow-prev'),
          nextEl: this.querySelector(products ? '[class*="slider-products__button-next-"]' : '.arrow-next'),
        };
      }
      if (options.pagination) {
        options.pagination = { el: this.querySelector('.slider-dot') };
      }
      this.carousel = new Swiper(element, options);
    }

    onBlockSelect(event) {
      if (!this.carousel || this.dataset.kind !== 'hero') return;
      const slides = [...this.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)')];
      const index = slides.findIndex(slide => slide.dataset.blockId === event.detail.blockId);
      if (index < 0) return;
      if (this.carousel.params.loop) this.carousel.slideToLoop(index, 0);
      else this.carousel.slideTo(index, 0);
      if (this.carousel.autoplay) this.carousel.autoplay.stop();
    }

    disconnectedCallback() {
      document.removeEventListener('DOMContentLoaded', this.start);
      this.removeEventListener('shopify:block:select', this.selectBlock);
      if (this.carousel) this.carousel.destroy(true, true);
      this.carousel = null;
    }
  }

  customElements.define('pg-home-carousel', HomeCarousel);
})();
