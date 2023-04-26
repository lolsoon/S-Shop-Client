$(function () {
    $('#toast-container').load('/common/toast/toast.html');

    $('#btn-change-password').on('click', event => {
        const username = storage.getItem('key_username');
        const password = $('#password').val();
        $.ajax({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/auth/change-password',
            headers: {
                'Authorization': "Basic " + storage.getItem('key_token')
            },
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                username: username,
                password: password
            }),
            success: data => {
                console.log('Đổi mật khẩu thành công.');
                showToast('Đổi mật khẩu thành công.', 'Chúng tôi đang chuyển hướng bạn đến trang chủ...');

                storage.setItem('key_token', btoa(username + ":" + password));

                setTimeout(() => window.location.replace('/index.html'), 2000);
            },
            error: (status) => {
                console.log('Đổi mật khẩu thất bại.');
                showToast('Đổi mật khẩu thất bại');
            }
        });
    });
});

function showToast(title, message) {
    $('#toast-title').text(title);
    $('#toast-body').text(message);
    bootstrap.Toast.getOrCreateInstance($('#toast')).show();
}