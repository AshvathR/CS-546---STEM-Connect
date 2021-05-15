(function($){

    
    let password = $('#password');
    let confirmPassword = $('#confirmPassword');
    let firstName = $('#firstName')
    let lastName = $('#lastName')
    let phoneNumber = $('#phoneNumber')
    let address = $('#address')
    let dob = $('#dob')
    let aboutme = $('#aboutme')
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g;
    let numbers = /[0-9]/g;

    let creationForm = $("#employee-creation-form")
    function checkForm(){
        
        creationForm.submit(function(event){
            let errorDiv = $("#error-form")
            let allSpecialCharacter = /[ `!@#$%^&*()+_\-=\[\]{};':"\\|,.<>\/?~]/;
            if(password.val().trim().length==0){
                event.preventDefault();
                $("#error-password").empty();
                $("#error-password").append('<p class="error"> Error: Please enter the password! <p>')
                $("#password").focus()
                return
            }
            else if(password.val().trim().length < 8 || password.val().trim().length > 15){
                event.preventDefault();
                $("#error-password").empty();
                $("#error-password").append('<p class="error"> Error: Password must be minimum of 8 characters and maximum of 15 characters </p>')
                $("#password").focus()
                return
            }
            else if(!password.val().match(upperCaseLetters) || !password.val().match(lowerCaseLetters) || !password.val().match(numbers) || !allSpecialCharacter.test(password.val())){
                event.preventDefault();
                $("#error-password").empty();
                $("#error-password").append('<p class="error"> Error: Password must be a combination of uppercase, lowercase, special character and a number!! </p>')
                $("#password").focus()
                return
            }
            else{
                $("#error-password").empty();
            } 
            
            if(confirmPassword.val() !== password.val()){
                event.preventDefault();
                $("#error-confirmPassword").empty();
                $("#error-confirmPassword").append('<p class="error"> Error: Password and confirm password should match </p>')
                confirmPassword.focus()
                return
            }
            else{
                $("#error-confirmPassword").empty();
            }
            if(firstName.val().trim().length == 0 ){
                event.preventDefault();
                $("#error-firstName").empty();
                $("#error-firstName").append('<p class="error"> Error: Please enter both FirstName and LastName </p>')
                $("#firstName").focus()
                return
            }
            else if(lastName.val().trim().length == 0){
                event.preventDefault();
                $("#error-firstName").empty();
                $("#error-firstName").append('<p class="error"> Error: Please enter both FirstName and LastName</p>')
                $("#lastName").focus()
            }
            else{
                $("#error-firstName").empty();
            }

            if(phoneNumber.val().trim() == 0){
                event.preventDefault();
                $("#error-phoneNumber").empty();
                $("#error-phoneNumber").append('<p class="error"> Error: Please enter the phone number</p>')
                $("#phoneNumber").focus()
                return
            }
            else if(phoneNumber.val().length != 10){
                event.preventDefault();
                $("#error-phoneNumber").empty();
                $("#error-phoneNumber").append(`<p class="error"> Error: Please enter a valid phone number</p>`)
                $("#phoneNumber").focus()
                return
            }
            else if(!phoneNumber.val().match("[0-9]+")){
                event.preventDefault();
                $("#error-phoneNumber").empty();
                $("#error-phoneNumber").append(`<p class="error"> Error: Please enter a valid phone number</p>`)
                $("#phoneNumber").focus()
                return
            }
            else{
                $("#error-phoneNumber").empty();
            }
            
            let split_date = dob.val().split("-");
            let yyyy = parseInt(split_date[0], 10);
            if(yyyy < 1900  || yyyy > 2021){
                    event.preventDefault();
                    $("#error-gender").empty();
                    $("#error-gender").append('<p class="error"> Error: Please enter a valid Date of Birth</p>')
                    $("#dob").focus()
                    return
            }
            else{
                $("#error-gender").empty();
            }  

            if(address.val().trim().length == 0){
                event.preventDefault();
                $("#error-address").empty();
                $("#error-address").append('<p class="error"> Error: Please enter the address</p>')
                $("#address").focus()
                return
            }
            else{
                $("#error-address").empty();
            }

            if(aboutme.val().trim().length == 0){
                event.preventDefault();
                $("#error-aboutme").empty();
                $("#error-aboutme").append('<p class="error"> Error: Please enter some information!</p>')
                $("#aboutme").focus()
                return
            }
            else{
                $("#error-aboutme").empty();
            }
        })
    }
    checkForm()
})(window.jQuery);
