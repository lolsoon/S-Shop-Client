$(function () {
    $('#form-modal-btn-create').on('click', function (event) {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/api/v1/accounts',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                username: $('#form-username').val(),
                firstName: $('#form-first-name').val(),
                lastName: $('#form-last-name').val(),
                password: $('#form-password').val(),
                role: $('#form-role').val(),
            }),
            success: function (data) {
                loadAccounts();
                $('#account-form').trigger("reset");
            }
        });
    });

    $('#form-modal-btn-update').on('click', function (event) {
        const id = $('#form-id').val();
        $.ajax({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/accounts/' + id,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                id: id,
                username: $('#form-username').val(),
                firstName: $('#form-first-name').val(),
                lastName: $('#form-last-name').val(),
                password: $('#form-password').val(),
                role: $('#form-role').val(),
            }),
            success: function (data) {
                loadAccounts();
                $('#account-form').trigger("reset");
                bootstrap.Modal.getOrCreateInstance($('#form-modal')).hide();
            }
        });
    });
});