// let username = document.getElementById('username')
// let password = document.getElementById('password')
// let formerror = document.getElementById('form-error')
// let loginForm = document.getElementById('login-form')

// loginForm.addEventListener('submit', (event)=>{
//     event.preventDefault();
//     console.log("kjdabda")
//     let specialCharacter = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
//     if(specialCharacter.test(username.value)){
//         formerror.push('Username should contain only _ as special character')
//     }
// })


(function($) {

    function checkLoginForm(){
        let username = $("#username");
        let password = $("#password");
        let formerror = $("#form-error");
        let loginForm = $("#login-form");

        loginForm.submit(function(event){
            let specialCharacter = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
            console.log('LoginERROR')
            if(specialCharacter.test(username)){
                console.log(' Inside if login')
                event.preventDefault();
                formerror.append('Username should contain only _ as special character');
            }
        })
    }
    checkLoginForm();
})(window.jQuery);
