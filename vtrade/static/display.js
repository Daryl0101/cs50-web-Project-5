document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById("registerUsername")){
        document.getElementById("registerUsername").oninput = usernameIndication;
    }
    if(document.getElementById("registerPassword")){
        document.getElementById("registerPassword").oninput = passwordIndication;
    }

    // Activate selection on navbar
    const navbarItems = ["dashboard", "search", "portfolio", "history"]
    navbarItems.forEach((item) => {
        if(window.location.href.indexOf(`${item}`) != -1){
            if(!document.getElementById(`${item}-nav-btn`).classList.contains("active")){
                document.getElementById(`${item}-nav-btn`).classList.add("active");
            }
            if(!document.getElementById(`${item}-nav-btn`).parentElement.classList.contains("is-active")){
                document.getElementById(`${item}-nav-btn`).parentElement.classList.add("is-active");
            }
        }
        else{
            if(document.getElementById(`${item}-nav-btn`)){
                if(document.getElementById(`${item}-nav-btn`).classList.contains("active")){
                    document.getElementById(`${item}-nav-btn`).classList.remove("active");
                }
                if(document.getElementById(`${item}-nav-btn`).parentElement.classList.contains("is-active")){
                    document.getElementById(`${item}-nav-btn`).parentElement.classList.remove("is-active");
                }
            }
        }
    });

    document.getElementById("register-form").onkeyup = signUpBtnControl;
});

// Check and return false if username exist
function checkUsernameExist(){
    registerUsername = document.getElementById("registerUsername");

    return fetch(`/checkUser?username=${registerUsername.value.trim()}`)
    .then(response => response.json())
    .then(result => {
        return result;
    });
}

// Check if user password contains spaces at start, end or both
function checkPassword(){
    registerPassword = document.getElementById("registerPassword");

    if(registerPassword.value == registerPassword.value.trim()){
        return true;
    }else{
        return false;
    }
}


// Tells user the availability of username
function usernameIndication(){
    registerUsername = document.getElementById("registerUsername");

    usernameYes = document.createElement("p");
    usernameYes.innerHTML = "Username available";
    usernameYes.id = "username-indicator";

    usernameNo = document.createElement("p");
    usernameNo.innerHTML = "Username has been taken";
    usernameNo.id = "username-indicator";

    usernameEmpty = document.createElement("p");
    usernameEmpty.innerHTML = "Username cannot be spaces";
    usernameEmpty.id = "username-indicator";

    if(registerUsername.value.trim() != ""){
        checkUsernameExist().then(result => {
            if(result.username_available){
                registerUsername.style.borderColor = "green";
                registerUsername.style.borderWidth = "5px";
                if(document.getElementById("username-indicator")){
                    document.getElementById("username-indicator").remove();
                }
                registerUsername.insertAdjacentElement("afterend", usernameYes);
            }
            else{
                registerUsername.style.borderColor = "red";
                registerUsername.style.borderWidth = "5px";
                if(document.getElementById("username-indicator")){
                    document.getElementById("username-indicator").remove();
                }
                registerUsername.insertAdjacentElement("afterend", usernameNo);
            }
        });
    }else if(registerUsername.value == ""){
        registerUsername.style.borderColor = "white";
        registerUsername.style.borderWidth = "thin";
        if(document.getElementById("username-indicator")){
            document.getElementById("username-indicator").remove();
        }
    }else{
        registerUsername.style.borderColor = "red";
        registerUsername.style.borderWidth = "5px";
        if(document.getElementById("username-indicator")){
            document.getElementById("username-indicator").remove();
        }
        registerUsername.insertAdjacentElement("afterend", usernameEmpty);
    }
}

// Tells user the validity of password
function passwordIndication(){
    registerPassword = document.getElementById("registerPassword");
    
    passwordNo = document.createElement("p");
    passwordNo.innerHTML = "Password cannot have spaces at start & end";
    passwordNo.id = "password-indicator";

    if(!checkPassword()){
        registerPassword.style.borderColor = "red";
        registerPassword.style.borderWidth = "5px";
        if(!document.getElementById("password-indicator")){
            registerPassword.insertAdjacentElement("afterend", passwordNo);
        }
    }else{
        registerPassword.style.borderColor = "white";
        registerPassword.style.borderWidth = "thin";
        if(document.getElementById("password-indicator")){
            document.getElementById("password-indicator").remove();
        }
    }
}

// Enable or disable sign up button
function signUpBtnControl(){
    registerUsername = document.getElementById("registerUsername");
    signUpBtn = document.getElementById("sign-up-button");

    if(registerUsername.value.trim() != ""){
        checkUsernameExist().then(result => {
            if(!result.username_available || !checkPassword()){
                signUpBtn.disabled = true;
                document.getElementById("register-form").onsubmit = () => {return false};
            }
            else{
                signUpBtn.disabled = false;
                document.getElementById("register-form").onsubmit = () => {return true};
            }
        });
    }
}