(function($) {
    var requestConfig = {
        method: 'GET',
        url: '/search/autoComplete',
        contentType: 'application/json'
    }

    $.ajax(requestConfig).then(function(responseMessage) {
        console.log(responseMessage);
    });

    $("#homeSearchBar").on('keyup', function(e){
        e.preventDefault();
        var searchEntry = $(this).val().trim();
        
        if (searchResult.length > 4) {

        }
    });
})(window.jQuery);

