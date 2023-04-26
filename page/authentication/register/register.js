$(function () {
    $('#toast-container').load('/common/toast/toast.html');

    $('#btn-register').on('click', event => {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/api/v1/auth/register',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                username: $('#username').val(),
                firstName: $('#first-name').val(),
                lastName: $('#last-name').val(),
                password: $('#password').val(),
                role: $('#role').val()
            }),
            success: data => {
                console.log('Đăng ký thành công.');
                showToast('Đăng ký thành công', 'Chúng tôi đang chuyển hướng bạn đến trang đăng nhập...');
                setTimeout(function () {
                    window.location.replace('/page/authentication/login/login.html');
                }, 2000);
            },
            error: () => {
                console.log('Đăng ký thất bại.');
                showToast('Đăng ký thất bại');
            }
        });
    });
});

function showToast(title, message) {
    $('#toast-title').text(title);
    $('#toast-body').text(message);
    bootstrap.Toast.getOrCreateInstance($('#toast')).show();
}