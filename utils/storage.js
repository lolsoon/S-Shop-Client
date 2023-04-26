const KEY_REMEMBER_ME = "key_remember_me";

const storage = {
    get rememberMe() {
        return localStorage.getItem(KEY_REMEMBER_ME);
    },
    set rememberMe(value) {
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem(KEY_REMEMBER_ME, value);
    },
    getItem: function (key) {
        if (this.rememberMe == 'true') {
            return localStorage.getItem(key);
        } else {
            return sessionStorage.getItem(key);
        }
    },
    setItem: function (key, value) {
        if (this.rememberMe == 'true') {
            localStorage.setItem(key, value);
        } else {
            sessionStorage.setItem(key, value);
        }
    },
    hasKey: function (key) {
        if (this.rememberMe == 'true') {
            return key in localStorage;
        } else {
            return key in sessionStorage;
        }
    },
    clear: () => {
        localStorage.clear();
        sessionStorage.clear();
    }
};