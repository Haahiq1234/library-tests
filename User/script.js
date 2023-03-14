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
    on: function (ths) {
        ths = signin;

        let username = ths.username.value;
        let password = ths.password.value;
        let user = Account.accounts[username];
        if (user && user.check(password)) {
            Account.signin(user);
        } else {
            ths.error();
        }
        ths.password.value = "";
        ths.password.blur();
        ths.username.value = "";
        ths.username.blur();
    },
    error: function () {
        console.log("Username or Password does not exist");
    },
    init: function () {
        let ths = this;
        this.button.onclick = function () {
            signin.on(ths);
        }
        this.username.onkeydown = function (event) {
            if (event.key == "Enter") {
                signin.on(ths);
            }
        };
        this.password.onkeydown = function (event) {
            if (event.key == "Enter") {
                signin.on(ths);
            }
        };
    },
    enable: function () {

    }
};


const signup = {
    screen: document.getElementById("signupscreen"),
    username: document.getElementById("signupusername"),
    password: document.getElementById("signuppassword"),
    button: document.getElementById("signupbutton"),
    on: function (ths) {
        //this = ths;
        ths = signup;
        let username = ths.username.value;
        let password = ths.password.value;
        
        
    },
    error: function () {

    },
    init: function () {
        let ths = this;
        this.button.onclick = function () {
            signin.on(ths);
        }
        signup.username.onkeydown = function (event) {
            if (event.key == "Enter") {
                signin.on(ths);
            }
        };
        signup.password.onkeydown = function (event) {
            if (event.key == "Enter") {
                signin.on(ths);
            }
        };


    }
};
