$(function () {
    $('#form-modal-btn-create').on('click', function (event) {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/api/v1/products',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                name: $('#form-name').val(),
                price: $('#form-price').val(),
                salePrice: $('#form-sale-price').val(),
                thumbnailUrl: $('#form-thumbnail-url').val(),
                description: $('#form-description').val(),
                ram: $('#form-ram').val(),
                categoryId: $('#form-category').val()
            }),
            success: function (data) {
                loadProducts();
                $('#product-form').trigger("reset");
            }
        });
    });

    $('#form-modal-btn-update').on('click', function (event) {
        const id = $('#form-id').val();
        $.ajax({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/products/' + id,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                id: id,
                name: $('#form-name').val(),
                price: $('#form-price').val(),
                salePrice: $('#form-sale-price').val(),
                thumbnailUrl: $('#form-thumbnail-url').val(),
                description: $('#form-description').val(),
                ram: $('#form-ram').val(),
                categoryId: $('#form-category').val()
            }),
            success: function (data) {
                loadProducts();
                $('#product-form').trigger("reset");
                bootstrap.Modal.getOrCreateInstance($('#form-modal')).hide();
            }
        });
    });
});