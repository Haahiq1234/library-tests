class Account {
    username;
    #password;

    constructor(username, password) {
        this.username = username;
        this.#password = password;
    }
    check(password) {
        return this.#password == password;
    }

    static current = undefined;
    static accounts = {};
    static register(username, password) {
        if (!Account.contains(username)) {
            Account.accounts[username] = new Account(username, password);
        }
    }
    static contains(username) {
        if (Account.accounts[username]) {
            return true;
        }
        return false;
    }
    static signin(user) {
        Account.current = user;
        Account.set(user);
    }
    static set(user) {
        console.log(signin.screen.style.display);
        signin.screen.style.display = "none";

    }
} 

const signin = {
    screen: document.getElementById("signinscreen"),
    username: document.getElementById("signinusername"),
    password: document.getElementById("signinpassword"),
    button: document.getElementById("onsigninbutton"),
    on: function () {
        let username = signin.username.value;
        let password = signin.password.value;
        let user = Account.accounts[username];
        if (user && user.check(password)) {
            Account.signin(user);
        } else {
            signin.error();
        }
        signin.password.value = "";
        signin.password.blur();
        signin.username.value = "";
        signin.username.blur();
    },
    error: function () {
        console.log("Username or Password does not exist");
    },
    init: function () {
        signin.button.onclick = signin.on;
        signin.username.onkeydown = function (event) {
            if (event.key == "Enter") {
                signin.on();
            }
        };
        signin.password.onkeydown = function (event) {
            if (event.key == "Enter") {
                signin.on();
            }
        };
    }
};


const signup = {
    screen: document.getElementById("signupscreen"),
    username: document.getElementById("signupusername"),
    password: document.getElementById("signuppassword"),
    button: document.getElementById("signupbutton"),
    on: function () {
        
        
    },
    error: function () {

    },
    init: function () {
        signup.screen.style.display = "none";
        signup.button.onclick = signin.on;
        signup.username.onkeydown = function (event) {
            if (event.key == "Enter") {
                signin.on();
            }
        };
        signup.password.onkeydown = function (event) {
            if (event.key == "Enter") {
                signin.on();
            }
        };
    }
};
