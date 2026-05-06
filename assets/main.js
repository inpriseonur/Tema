(function ($) {
  "use strict";
  jQuery(document).ready(function(){
  var windows = $(window);
  var sticky = $('.header-sticky');
  windows.on('scroll', function() {
    var scroll = windows.scrollTop();
    if (scroll < 100) {
      sticky.removeClass('is-sticky');
    }else{
      sticky.addClass('is-sticky');
    }
  }); 
  $("button.navbar-toggler").on('click', function() {
    $(".menu-drawer").addClass("active");
    $(".mm-fullscreen-bg").addClass("active");
    $("body").addClass("hidden");
  });
  $(".menu-drawer-close").on('click', function() {
    $(".menu-drawer").removeClass("active");
    $(".mm-fullscreen-bg").removeClass("active");
    $("body").removeClass("hidden");
  });
  $(".mm-fullscreen-bg").on("click", function(){
    $(".menu-drawer").removeClass("active");
    $(".mm-fullscreen-bg").removeClass("active");
    $("body").removeClass("hidden");
  });
  $(".mm-fullscreen-bg").on("click", function(){
    $(".mm-fullscreen-bg").removeClass("active");
  $(".filter-sidebar").removeClass("active");
  });
  $("button.filter-button").on('click', function() {
    $(".filter-sidebar").addClass("active");
    $(".mm-fullscreen-bg").addClass("active");
  });
  $("button.close-filter-sidebar").on('click', function() {
    $(".filter-sidebar").removeClass("active");
    $(".mm-fullscreen-bg").removeClass("active");
  });
  $('.full-view, .zoom').on('click', function() {
    $('.product_img_top').magnificPopup({
      delegate: 'a',
      type:'image',
      showCloseBtn: true,
      closeBtnInside: false,
      midClick: true,
      tLoading: 'Loading image #%curr%...',
      mainClass: 'mfp-img-mobile',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0,1]
      }
    }).magnificPopup('open');
  });
  $(window).scroll(function(){
    if ($(this).scrollTop() > 1000) {
      $('#top').fadeIn();
    } else {
      $('#top').fadeOut();
    }
  });
  $('#top').click(function(){
    $("html, body").animate({ scrollTop: 0 }, 100);
    return false;
  });
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });
  $(document).on("click", ".menu-arrow", function(e) {
    var menu_link = $(this).closest("li"),
        main_menu = menu_link.find(".menu-dropdown").eq(0);
        if(menu_link.hasClass("open")){
          menu_link.removeClass("open");
          $('.menu-content').removeClass('open-level-1');
        }else{
          main_menu.addClass("open");
          menu_link.addClass("open");
          $('.menu-content').addClass('open-level-1');
        }
     e.stopPropagation(); 
     e.preventDefault();
  });
  $(document).on("click", ".menu-arrow-sub", function(e) {
    var menu_link = $(this).closest("li"),
        main_menu = menu_link.find(".supmenu-dropdown").eq(0);
        if(menu_link.hasClass("open")){
          menu_link.removeClass("open");
          $('.menu-content').removeClass('open-level-2');
        }else{
          main_menu.addClass("open");
          menu_link.addClass("open");
          $('.menu-content').addClass('open-level-2');
        }
     e.stopPropagation(); 
     e.preventDefault();
  });
  $(document).on("click", ".back-menu", function(e) {
    var back_menu = $(this).closest(".menu-dropdown");
      setTimeout(function() {
        back_menu.removeClass('open');
      }, 500);
      $('.menu-link').removeClass('open');
      $('.menu-content').removeClass('open-level-1');
     e.stopPropagation(); 
     e.preventDefault();
  });
  $(document).on("click", ".back-menu-sub", function(e) {
    var back_menu = $(this).closest(".supmenu-dropdown");
      setTimeout(function() {
        back_menu.removeClass('open');
      }, 500);
      $('.singlemenu-li').removeClass('open');
      $('.menu-content').removeClass('open-level-2');
     e.stopPropagation(); 
     e.preventDefault();
  });
});
})(jQuery);