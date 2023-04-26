var KEY_ENTER = 13;
var sort = null;

$(function () {
    $('#form-modal-container').load('/page/main/product/form-modal.html');
    $('#delete-modal-container').load('/common/modal/delete-modal.html', null, function () {
        $('#delete-modal-btn-remove').on('click', function (event) {
            $.ajax({
                method: 'DELETE',
                url: 'http://localhost:8080/api/v1/products',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify($('.selected .id').toArray().map(id => id.innerText)),
                beforeSend: () => showLoading(),
                success: data => loadProducts(),
                complete: () => hideLoading()
            });
            bootstrap.Modal.getOrCreateInstance($('#delete-modal')).hide();
        });
    });

    if (storage.getItem('key_role') != 'ADMIN') {
        $('#btn-add').hide();
        $('#btn-edit').hide();
        $('#btn-delete').hide();
    }

    addListeners();
    loadCategories();
    loadProducts();
});

function addListeners() {
    $('#btn-search, #btn-refresh').on('click', event => loadProducts());

    // Khi người dùng thay đổi page size
    $('#page-size').on('change', event => loadProducts());

    // Khi người dùng thay đổi page number và nhấn ENTER
    $('#page-number').on('keypress', event => {
        if (event.which == KEY_ENTER) {
            loadProducts();
        }
    });

    $('#product-tbody').on('click', 'tr', function (event) {
        if (event.ctrlKey) {
            $(this).toggleClass('selected');
        } else {
            $(this).addClass('selected').siblings().removeClass('selected');
        }
        updateStatus();
    });

    $('#product-thead').on('click', 'th', function (event) {
        $(this).siblings().find('i').removeClass('fa-sort-up fa-sort-down').addClass('fa-sort');

        const i = $(this).find('i');
        if (i.hasClass('fa-sort')) {
            i.removeClass('fa-sort').addClass('fa-sort-up');
        } else {
            i.toggleClass('fa-sort-up fa-sort-down');
        }

        let type = i.hasClass('fa-sort-up') ? 'asc' : 'desc';
        sort = `${$(this).attr('key')},${type}`
        loadProducts();
    });

    $('#btn-add').on('click', event => {
        $('#product-form').trigger('reset');
        $('#form-id-container').hide();
        $('#form-modal-btn-update').hide();
        $('#form-modal-btn-create').show();
        $('#form-modal-title').text('Thêm sản phẩm');
    });

    $('#btn-edit').on('click', event => {
        $('#product-form').trigger('reset');
        $('#form-modal-btn-create').hide();
        $('#form-modal-btn-update').show();
        $('#form-id-container').show();
        $('#form-modal-title').text('Cập nhật sản phẩm');

        const row = $('.selected');
        $('#form-id').val(row.find('.id').attr('value'));
        $('#form-name').val(row.find('.name').attr('value'));
        $('#form-price').val(row.find('.price').attr('value'));
        $('#form-sale-price').val(row.find('.salePrice').attr('value'));
        $('#form-thumbnail-url').val(row.find('.thumbnailUrl').attr('value'));
        $('#form-description').val(row.find('.description').text());
        $('#form-ram').val(row.find('.ram').attr('value'));
        $('#form-category').val(row.find('.categoryId').attr('value'));
    });

    $('#btn-delete').on('click', function (event) {
        $('#delete-modal-title').text('Xóa sản phẩm');
        const message = `Bạn chắc chắn muốn xóa ${$('.selected').length} sản phẩm?`;
        $('#delete-modal-body').text(message);
    });
}

function updateStatus() {
    const length = $('.selected').length;
    if (length == 0) {
        $('#btn-edit').attr('disabled', 'disabled');
        $('#btn-delete').attr('disabled', 'disabled');
    } else if (length == 1) {
        $('#btn-edit').removeAttr('disabled');
        $('#btn-delete').removeAttr('disabled');
    } else {
        $('#btn-edit').attr('disabled', 'disabled');
        $('#btn-delete').removeAttr('disabled');
    }
}

function loadCategories() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/categories',
        success: (data) => showCategories(data.content)
    });
}

function test(){
    console.log(document.getElementById("min-sale-price").value)
    document.getElementById("min-sale-price").value = "";
}

function loadProducts() {
    const searchParams = new URLSearchParams();

    let ram = $('#ram').val();
    if (!ram) ram = null;
    let categoryId = $('#category-filter').val();
    if (!categoryId) categoryId = null;

    const params = {
        page: $('#page-number').val(),
        size: $('#page-size').val(),
        sort: sort,
        search: $('#search').val(),
        ram: ram,
        categoryId: categoryId,
        minYear: $('#min-year').val(),
        maxYear: $('#max-year').val(),
        minCreatedDate: $('#min-created-date').val(),
        maxCreatedDate: $('#max-created-date').val(),
        minSalePrice: $('#min-sale-price').val(),
        maxSalePrice: $('#max-sale-price').val(),
    }
    for (const key in params) {
        if (params[key]) {
            searchParams.set(key, params[key]);
        }
    }

    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/products?' + searchParams,
        beforeSend: () => showLoading(),
        success: function (data) {
            showPageInfo(data);
            showProducts(data.content);
            updateStatus();
        },
        complete: () => hideLoading(),
    });
}

function showCategories(categories) {
    const filter = $('#category-filter');
    const form = $('#form-category');
    let options = '';
    for (const category of categories) {
        options += `<option value="${category.id}">${category.name}</option>`;
    }
    filter.append(options);
    form.append(options);
}

function showPageInfo(data) {
    const start = data.pageable.offset;
    $('#page-info').text(`Showing ${start + 1} to ${start + data.numberOfElements} of ${data.totalElements} rows.`);
    $('#page-number').attr('max', data.totalPages);
    if (data.last) {
        $('#next').addClass('disabled');
    } else {
        $('#next').removeClass('disabled');
    }
    if (data.first) {
        $('#previous').addClass('disabled');
    } else {
        $('#previous').removeClass('disabled');
    }
}

function showProducts(products) {
    const tbody = $('#product-tbody');
    tbody.empty();
    for (const product of products) {
        const updatedAt = new Date(product.updatedAt);
        tbody.append(`
            <tr>
                <th class='id' value='${product.id}' scope="row">${product.id}</th>
                <td class='name' value='${product.name}'>${product.name}</td>
                <td class='ram' value='${product.ram}'>${product.ram}</td>
                <td class='price' value='${product.price}'>${product.price.toLocaleString('vi-VN')}₫</td>
                <td class='salePrice' value='${product.salePrice}'>${product.salePrice.toLocaleString('vi-VN')}₫</td>
                <td class='description'>${product.description}</td>
                <td class='thumbnailUrl' value='${product.thumbnailUrl}'><img src="${product.thumbnailUrl}" width="96"></td>
                <td class='createdDate'>${product.createdDate}</td>
                <td class='updatedAt'>${updatedAt.toLocaleDateString()} ${updatedAt.toLocaleTimeString()}</td>
                <td class='categoryId' value='${product.category.id}'>${product.category.name}</td>
            </tr>
        `);
    }
}

function showLoading() {
    $('#loading').show();
}

function hideLoading() {
    $('#loading').hide();
}

function changePageNumberBy(value) {
    const page = $('#page-number');
    page.val(+page.val() + value);
    loadProducts();
}
