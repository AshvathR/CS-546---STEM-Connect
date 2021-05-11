(function($) {
    let myInput = $('#password');
    let loginForm = $('#login-form');
    let errorDiv = $('#error-message');
    loginForm.submit(function(event){
        console.log("Here");
        let enteredPassword = myInput.val().trim();
        if(enteredPassword === undefined || enteredPassword === '' || enteredPassword === null){
            errorDiv.append('<p>Please give a valid data !!</p>');
        } 
    })
})(window.jQuery);




// (function () {
//     // let letter = document.getElementById("letter");
//     // let capital = document.getElementById("capital");
//     // let number = document.getElementById("number");
//     // let length = document.getElementById("length");

//     myInput.onkeyup = function() {
//         let lowerCaseLetters = /[a-z]/g;
//         let upperCaseLetters = /[A-Z]/g;
//         let numbers = /[0-9]/g;
//         let error = document.getElementById('error-message');

//         if(myInput == "") {
//             error.classList.add('hidden');
//             return ;
//         }

//         else  if(myInput.length < 8) {
//             error.classList.add('hidden');
//             return ;
//         }

//         else if(myInput.length > 15) {
//             error.classList.add('hidden');
//             return ;
//          }

//         else if(!myInput.value.match(lowerCaseLetters)){
//             error.classList.add('hidden');
//             return ;
//          }

//          else if(!myInput.value.match(upperCaseLetters)){
//             error.classList.add('hidden');
//             return ;
//          }

//          else if(!myInput.value.match(numbers)){
//             error.classList.add('hidden');
//             return ;
//          }
//          else{
//             error.classList.remove('hidden');
//             return;
//          }
//     }



//     // myInput.onfocus = function() {
//     // document.getElementById("message").style.display = "block";
//     // }

//     // myInput.onblur = function() {
//     // document.getElementById("message").style.display = "none";
//     // }

//     // myInput.onkeyup = function() {
//     // let lowerCaseLetters = /[a-z]/g;
//     // let upperCaseLetters = /[A-Z]/g;
//     // let numbers = /[0-9]/g;
//     // if(myInput.value.match(lowerCaseLetters)) {  
//     //     letter.classList.remove("invalid");
//     //     letter.classList.add("valid");
//     // } else {
//     //     letter.classList.remove("valid");
//     //     letter.classList.add("invalid");
//     // }
//     // if(myInput.value.match(upperCaseLetters)) {  
//     //     capital.classList.remove("invalid");
//     //     capital.classList.add("valid");
//     // } else {
//     //     capital.classList.remove("valid");
//     //     capital.classList.add("invalid");
//     // }
//     // if(myInput.value.match(numbers)) {  
//     //     number.classList.remove("invalid");
//     //     number.classList.add("valid");
//     // } else {
//     //     number.classList.remove("valid");
//     //     number.classList.add("invalid");
//     // }   
//     // if(myInput.value.length >= 8) {
//     //     length.classList.remove("invalid");
//     //     length.classList.add("valid");
//     // } else {
//     //     length.classList.remove("valid");
//     //     length.classList.add("invalid");
//     // }
//     // }
// })();