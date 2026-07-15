(function() {
    'use strict';

    // 绑定单个按钮的点击事件
    function bindButton(btn) {
        if (!btn) return;
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLoadMore(btn);
        });
    }

    // 核心加载逻辑（原样保留）
    function handleLoadMore(btn) {
        var offset           = parseInt(btn.dataset.offset) || 0;
        var perPage          = parseInt(btn.dataset.perPage) || 8;
        var total            = parseInt(btn.dataset.total) || 0;
        var albumId          = btn.dataset.albumId || '';
        var imageSize        = btn.dataset.imageSize || 'original';
        var imageHeight      = btn.dataset.imageHeight || '75%';
        var timer            = parseInt(btn.dataset.timer) || 2000;
        var lightbox         = btn.dataset.lightbox || 'true';
        var lightboxImageSize = btn.dataset.lightboxImageSize || 'original';
        var nonce            = btn.dataset.nonce || '';
        var layout           = btn.dataset.layout || 'shipping-log';
        var containerId      = btn.dataset.container || 'spa-timeline-container';

        if (typeof spa_ajax_obj === 'undefined' || !spa_ajax_obj.ajax_url) {
            console.error('spa_ajax_obj.ajax_url is not defined');
            btn.textContent = 'Error: Config missing';
            btn.disabled = false;
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Loading...';

        var formData = new FormData();
        formData.append('action', 'load_more_timeline');
        formData.append('offset', offset);
        formData.append('per_page', perPage);
        formData.append('album_id', albumId);
        formData.append('image_size', imageSize);
        formData.append('image_height', imageHeight);
        formData.append('timer', timer);
        formData.append('lightbox', lightbox);
        formData.append('lightbox_image_size', lightboxImageSize);
        formData.append('nonce', nonce);
        formData.append('layout', layout);

        fetch(spa_ajax_obj.ajax_url, {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(function(data) {
            if (data.success && data.data && data.data.html) {
                var container = document.getElementById(containerId);
                if (container) {
                    container.insertAdjacentHTML('beforeend', data.data.html);
                    reinitializeSliders(container);
                    isolateLightboxes(container);  // 为新插入的内容绑定灯箱隔离
                }

                if (offset + perPage >= total) {
                    btn.style.display = 'none';
                } else {
                    btn.dataset.offset = offset + perPage;
                    btn.textContent = 'View More';
                    btn.disabled = false;
                }
            } else {
                console.error('Invalid AJAX response:', data);
                btn.textContent = 'Error, click to retry';
                btn.disabled = false;
            }
        })
        .catch(function(error) {
            console.error('AJAX error:', error);
            btn.textContent = 'View More';
            btn.disabled = false;
        });
    }

    // 重新初始化滑块（原样）
    function reinitializeSliders(container) {
        if (typeof Flatsome !== 'undefined' && typeof Flatsome.attach !== 'undefined') {
            Flatsome.attach(container);
            return;
        }
        if (typeof Flickity === 'undefined') {
            console.warn('Flickity not available');
            return;
        }
        setTimeout(function() {
            var sliders = container.querySelectorAll('.slider-style-container:not(.flickity-enabled)');
            sliders.forEach(function(slider) {
                try {
                    var spin = slider.querySelector('.loading-spin');
                    if (spin) spin.style.display = 'none';
                    new Flickity(slider, {
                        cellAlign: 'left',
                        imagesLoaded: true,
                        lazyLoad: 1,
                        freeScroll: false,
                        wrapAround: true,
                        autoPlay: 2000,
                        pauseAutoPlayOnHover: true,
                        prevNextButtons: true,
                        contain: true,
                        adaptiveHeight: true,
                        dragThreshold: 10,
                        percentPosition: true,
                        pageDots: false,
                        rightToLeft: false,
                        draggable: true,
                        selectedAttraction: 0.1,
                        parallax: 0,
                        friction: 0.6
                    });
                } catch (e) {
                    console.error('Flickity init error:', e);
                }
            });
        }, 300);
    }

    // ============= 灯箱隔离核心函数 =============
    function isolateLightboxes(scope) {
        if (typeof jQuery === 'undefined' || typeof jQuery.magnificPopup === 'undefined') return;
        var $scope = scope ? jQuery(scope) : jQuery(document);
        
        // 为每个滑块分配独立的 gallery 组
        $scope.find('.slider-style-container').each(function() {
            var $slider = jQuery(this);
            // 如果已经处理过，跳过
            if ($slider.data('isolated')) return;
            $slider.data('isolated', true);

            var groupId = 'slider-gallery-' + Math.random().toString(36).substr(2, 9);
            
            // 移除原有的 lightbox 类，改用自定义类，并设置 data-gall
            $slider.find('a.image-lightbox').each(function() {
                var $link = jQuery(this);
                $link.removeClass('image-lightbox').addClass('isolated-lightbox');
                $link.attr('data-gall', groupId);
                $link.off('click.isolated').on('click.isolated', function(e) {
                    e.preventDefault();
                    // 收集同组的所有图片
                    var items = [];
                    var src = $link.attr('href');
                    var currentIndex = 0;
                    jQuery('.isolated-lightbox[data-gall="' + groupId + '"]').each(function(i) {
                        items.push({ src: jQuery(this).attr('href') });
                        if (jQuery(this).attr('href') === src) {
                            currentIndex = i;
                        }
                    });
                    
                    // 使用 Magnific Popup 打开灯箱
                    jQuery.magnificPopup.open({
                        items: items,
                        gallery: {
                            enabled: true,
                            navigateByImgClick: true,
                            preload: [0,1]
                        },
                        type: 'image',
                        image: {
                            markup: (typeof Flatsome !== 'undefined' && Flatsome.mfpMarkup) ? Flatsome.mfpMarkup : ''
                        }
                    }, currentIndex);
                });
            });
        });
    }

    // 页面初始加载时执行一次
    function init() {
        bindButton(document.getElementById('spa-load-more-btn'));
        bindButton(document.getElementById('spa-load-more-fb-btn'));
        // 初始灯箱隔离
        isolateLightboxes();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();