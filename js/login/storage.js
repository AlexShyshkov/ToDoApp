'use strict';

let rememberUser = document.getElementById('remember'),
    usernameValue = document.getElementById('username');

if(localStorage.checkbox && localStorage.checkbox !== ""){
    rememberUser.setAttribute("checked", "checked");
    usernameValue.value = localStorage.username;
} else {
        rememberUser.removeAttribute("cheked");
        usernameValue.value = "";
    }

export default function rememberUsername(){
    if(rememberUser.checked && usernameValue.value !== ""){
        localStorage.username = usernameValue.value;
        localStorage.checkbox = rememberUser.value;
    } else {
        localStorage.username = "";
        localStorage.checkbox = "";
    }
}