(function($) {
    var yearsExpSlider = $('#yearsExpSlider');
    var yearsExpInput = $('#yearsExpInput');
    var minSalarySlider = $('#minSalarySlider');
    var minSalaryInput = $('#minSalaryInput');
    var projectNumberSlider = $('#projectNumberSlider');
    var projectNumberInput = $('#projectNumberInput');
    
    var categoryInput = $('#categoryLookUp');

    var skillsInput = $('#skillsLookUp');
    var skillsList = $('#skillsLookUp');
    var selectedSkills = $('#insertedSkills');
    var skillsDiv = $('#skillsList');
    var form = $('#filteredSearchForm');
    
    var revealMinimumSalary = $('#revealMinSalary');
    var removeMinimumSalary = $('#removeMinSalary');
    var minSalaryFilter = $('minimumSalaryFilter');

    var revealProjectNumber = $('#revealProjectNumber');
    var removeProjectNumber = $('#removeProjectNumber');
    var projectNumberFilter = $('#projectNumberFilter');

    var revealJobCategory = $('#revealCategory');
    var removeJobCategory = $('#removeCategory');
    var jobCategoryFilter = $('#categoryInputFilter')




    function linkSliderAndInput(slider, input){
        slider.val(0);
        input.val(filterSlider.val());
        slider.on("input", function(){
            input.val($(this).val());
        });
        input.change(function(){
            slider.val($(this).val()); 
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

    function optionalFilterReveal(reveal, remove, filter, inputArray){
        for(input of inputArray){
            input.prop("disabled", true);
        }
        
        reveal.click(function(){
            filter.css("display", "block");
            for(input of inputArray){
                input.prop("disabled", false);
            }
            reveal.css("display", "none");
        });

        remove.click(function(){
            filter.css("display", "none");
            for(input of inputArray){
                input.prop("disabled", true);
            }
            reveal.css("display", "block");
        });
    }



    linkSliderAndInput(yearsExpSlider, yearsExpInput);
    linkSliderAndInput(minSalarySlider, minSalaryInput);
    linkSliderAndInput(projectNumberSlider, projectNumberInput);
    skillsAddition();
    optionalFilterReveal(revealMinimumSalary, removeMinimumSalary, minSalaryFilter, [minSalarySlider, minSalaryInput]);
    optionalFilterReveal(revealProjectNumber, removeProjectNumber, projectNumberFilter, [projectNumberSlider, projectNumberInput]);
    optionalFilterReveal(revealJobCategory, removeJobCategory, jobCategoryFilter, [categoryInput]);


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