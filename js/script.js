// global
var entity, term;

$(function() {
    // fullpage.jsSetting
    $(document).ready(function() {
        $('#fullpage').fullpage({
            css3: true,
            scrollingSpeed: 700,
            autoScrolling: false,
            fitToSection: false,
            fitToSectionDelay: 1000,
            scrollBar: true,
            easing: 'easeInOutCubic',
            easingcss3: 'ease',
            loopBottom: false,
            loopTop: false,
        });
    });
    // bodyOnLoadSection1&2DisplaayNone
    $("#section1").css("display", "none");
    $("#section2").css("display", "none");
    $(".loadingWrap").fadeOut();
    // dropdownButtonSelectEntity
    $(".dropdown-menu li a").click(function() {
        $(this).parents('.dropdown').find('.dropdown-toggle').html($(this).text() + '<span class="caret"></span>');
        $(this).parents('.dropdown').find('input[name="dropdown-value"]').val($(this).attr("data-value"));
        entity = $(this).parents('.dropdown').find('input[name="dropdown-value"]').val();
    });
    // section0SearchButtonSection1Toggle
    $("#search").click(function() {
        entity = $(this).parents('.dropdown').find('input[name="dropdown-value"]').val();
        term = $(this).parents('.dropdown').find('.form-control').val();
        $("#section1").toggle();
        $("#section0").css("display", "none");
        $.fn.fullpage.moveTo(2); // moveToSearchResult
    });
    // section1DetailButtonSection2Toggle
    $(document).on('click', '.detail', function() {
        $("#section2").toggle();
        $("#section1").css("display", "none");
        $.fn.fullpage.moveTo(3); // moveToDetail
    });
});
