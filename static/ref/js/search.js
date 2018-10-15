$(function () {
    $(".search-box .search-btn").on('click', function () {
        $(this).hide();
        $(".search-box .sform").show();
        $(".search-box .sform .search-input").focus();
    });

    $(".search-box .sform .search-input").on('focusout', function () {
        $(".search-box .sform").hide();
        $(".search-box .search-btn").show();
    })
})