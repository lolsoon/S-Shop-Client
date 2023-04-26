$(function () {
    $('#form-modal-btn-create').on('click', function (event) {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/api/v1/categories',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                name: $('#form-name').val()
            }),
            success: function (data) {
                loadCategories();
                $('#category-form').trigger("reset");
            }
        });
    });

    $('#form-modal-btn-update').on('click', function (event) {
        const id = $('#form-id').val();
        $.ajax({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/categories/' + id,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                id: id,
                name: $('#form-name').val()
            }),
            success: function (data) {
                loadCategories();
                $('#category-form').trigger("reset");
                bootstrap.Modal.getOrCreateInstance($('#form-modal')).hide();
            }
        });
    });
});