'use strict';

window.addEventListener('DOMContentLoaded', function(){
    let loginForm = document.getElementById('login-form'),
        todoApp = document.getElementById('app'),
        login = document.getElementById('login'),
        rememberUser = document.getElementById('remember'),
        usernameValue = document.getElementById('username');

    function checkUser(userData){
        let username = document.getElementById('username').value,
            password = document.getElementById('password').value;

        if(username == null || username == ""){
            alert("Enter the username");
            return false;
        } else if(password == null || password == ""){
            alert("Enter the password");
            return false;
        }

        for(let i = 0; i < userData.length; i++){
            if(username == userData[i].username && password == userData[i].password){
                //alert("Welcome");
                loginForm.classList.remove('visible');
                loginForm.classList.add('hidden');
                todoApp.classList.remove('hidden');
                todoApp.classList.add('vissible');
                console.log(userData[i].username, userData[i].password);
                break;
            } else {
                alert("Incorrect username or password");
            }
        }
    }
   
    function rememberUsername(){
        if(localStorage.checkbox && localStorage.checkbox !== ""){
            rememberUser.setAttribute("checked", "checked");
            usernameValue.value = localStorage.username;
        } else {
            rememberUser.removeAttribute("cheked");
            usernameValue.value = "";
        }

        if(rememberUser.checked && usernameValue.value !== ""){
            localStorage.username = usernameValue.value;
            localStorage.checkbox = rememberUser.value;
        } else {
            localStorage.username = "";
            localStorage.checkbox = "";
        }
    }

    function sendAjaxRequest(url){
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.onload = function(){
            let user = JSON.parse(this.response);
            checkUser(user);
        };
        xhr.send();
    }

    login.addEventListener('click', function(){
        /*let xhr = new XMLHttpRequest();
        xhr.open('POST', 'js/users.json');
        xhr.onload = function(){
            let user = JSON.parse(this.response);
            checkUser(user);
        };
        xhr.send();*/

        sendAjaxRequest('js/users.json');
        rememberUsername();
    });
});