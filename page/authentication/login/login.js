const KEY_FULL_NAME = 'key_full_name';
const KEY_ROLE = 'key_role';
const KEY_TOKEN = 'key_token';
const KEY_USERNAME = 'key_username';

$(function () {
    $('#toast-container').load('/common/toast/toast.html');

    $('#btn-login').on('click', event => {
        const username = $('#username').val();
        const password = $('#password').val();
        const token = btoa(username + ":" + password);
        const rememberMe = document.getElementById('remember-me').checked;

        $.ajax({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/auth/login',
            headers: {
                'Authorization': "Basic " + token
            },
            success: data => {
                console.log('Đăng nhập thành công.');
                console.log(data);

                saveUserInfo(data, token, rememberMe);
                showToast('Đăng nhập thành công', 'Chúng tôi đang chuyển hướng bạn đến trang chủ...');

                // Chuyển hướng trang web sau 2 giấy
                setTimeout(function () {
                    window.location.replace('/index.html');
                }, 2000);
            },
            error: () => {
                console.log('Đăng nhập thất bại.');
                showToast('Đăng nhập thất bại', 'Tài khoản hoặc mật khẩu không đúng');
            }
        });
    });
});

function saveUserInfo(data, token, rememberMe) {
    storage.rememberMe = rememberMe;
    storage.setItem(KEY_TOKEN, token);
    storage.setItem(KEY_FULL_NAME, data.fullName);
    storage.setItem(KEY_ROLE, data.role);
    storage.setItem(KEY_USERNAME, data.username);
}

function showToast(title, message) {
    $('#toast-title').text(title);
    $('#toast-body').text(message);
    bootstrap.Toast.getOrCreateInstance($('#toast')).show();
}