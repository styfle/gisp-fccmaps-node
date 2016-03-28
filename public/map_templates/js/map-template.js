'use strict';
(function() {

    var autoCollapsed = false;
    $('.nav-collapse').on('click', function() {
        autoCollapsed = false;
        $('body').toggleClass('docs-collapsed-nav');
    });

    /* collapse sidebar when necessary */
    var checkNav = function() {
        var collapsed = $('body').hasClass('docs-collapsed-nav'),
            width = $(this).width();

        if (width <= 767 && !collapsed) {
            autoCollapsed = true;
            $('body').addClass('docs-collapsed-nav');
        } else if (width > 767 && autoCollapsed) {
            $('body').removeClass('docs-collapsed-nav');
        }
    };

    // $(window).on('resize', checkNav);
    // $(document).on('ready', checkNav);

    var resizeSidebar = function() {
        var sectHeight = $('.row-grid').height();

        $('.docs-sidebar').css('height', sectHeight);
    };

    $(window)
        .on('resize', checkNav)
        .on('resize', resizeSidebar);

    $(document)
        .on('ready', checkNav)
        .on('ready', resizeSidebar);


    /* enable tooltips */
    $('[data-toggle="tooltip"]').tooltip({ container: 'body', delay: { show: 200, hide: 0 } });

    $('.link-tags').click(function() {
        var thisLink = $(this),
            tagsList = thisLink.closest('.tag-list-inline').find('.list-tags');

        if (tagsList.is(':visible')) {
            tagsList.addClass('hide');
            thisLink.text('View Tags');
        } else {
            $('.list-tags').removeClass('hide');
            thisLink.text('Hide Tags');
        }
    });

    var scrolled = 0;

    $('.btn-scrollUp').click(function() {

        var pos = $('.nav.nav-stacked').scrollTop();

        if (pos === 0) {
            // console.log('top of the div');
            // scrolled = 0;
        } else {
            scrolled = $('.nav.nav-stacked').scrollTop() - 200;

            $('.nav.nav-stacked').animate({
                scrollTop: scrolled
            });
        }

    });

    $('.btn-scrollDown').click(function() {

        var pos = $('.nav.nav-stacked').scrollTop();

        if (pos + $('.nav.nav-stacked').innerHeight() >= $('.nav.nav-stacked')[0].scrollHeight) {
            // console.log('end reached');
            // scrolled = 0;
        } else {
            scrolled = $('.nav.nav-stacked').scrollTop() + 200;

            // console.log($('.nav.nav-stacked').scrollTop());

            $('.nav.nav-stacked').animate({
                scrollTop: scrolled
            });
        }
    });

    $('.link-ext').on('click', function(e) {
        var alertText = 'You are about to leave the FCC website and visit a third-party, non-governmental website that the FCC does not maintain or control. The FCC does not endorse any product or service, and is not responsible for, nor can it guarantee the validity or timeliness of the content on the page you are about to visit. Additionally, the privacy policies of this third-party page may differ from those of the FCC.';

        var confirm = window.confirm(alertText);

        if (!confirm) {
            e.preventDefault();
        }
    });
})();
