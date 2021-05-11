(function($) {
    var filterSlider = $('#yearsExpSlider');
    var filterInput = $('#yearsExpInput');
    var skillsInput = $('#skillsLookUp');
    var skillsList = $('#skillsLookUp');
    var selectedSkills = $('#insertedSkills');
    var skillsDiv = $('#skillsList');
    var form = $('#filteredSearchForm');
    function linkSliderAndInput(){
        filterSlider.val(0);
        filterInput.val(filterSlider.val());
        filterSlider.on("input", function(){
            filterInput.val($(this).val());

        });

        filterInput.change(function(){
            filterSlider.val($(this).val());
            
        });
    }

    function skillsAddition(){
        var skills = getSkills();
        skillsList.autocomplete({
            source: skills,
            minLength: 1,
            select: function(event, ui){
                if(selectedSkills.children().length == 0 ) $('#skillsHeading').html('Skills List');
                skillsInput.val("");
                $('#filteredSearchBarErrorState').empty();
                selectedSkills.append("<li id='" + ui.item.value + "'>"
                + ui.item.value + " <input type='hidden' name='skills[]' value='" + ui.item.value + "'/>"
                //+ "<button onclick='document.getElementById(\"" + ui.item.value + "\".remove())>Remove</button>"
                + "<button onclick='document.getElementById(\"" + ui.item.value + "\").remove()'>Remove</button>"
                + "</li>");

                return false;
            }
        });

    }


    linkSliderAndInput();
    skillsAddition();


    form.submit(function(e){
        console.log("Here");
        if(selectedSkills.children().length == 0){
            e.preventDefault();
            $('#filteredSearchBarErrorState').empty();
            $('#filteredSearchBarErrorState').append('<p class="validationMessage"> Error: At least one skill is required for filtered search</p>')
        } else{
            $('#homeSearchBarErrorState').empty();
            filterInput.prop('disabled', true);
        }
    })


})(window.jQuery);