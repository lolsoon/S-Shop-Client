var KEY_ENTER = 13;
var sort = null;

$(function () {
    $('#form-modal-container').load('/page/main/account/form-modal.html');
    $('#delete-modal-container').load('/common/modal/delete-modal.html', null, function () {
        $('#delete-modal-btn-remove').on('click', function (event) {
            $.ajax({
                method: 'DELETE',
                url: 'http://localhost:8080/api/v1/accounts',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify($('.selected .id').toArray().map(id => id.innerText)),
                beforeSend: () => showLoading(),
                success: data => loadAccounts(),
                complete: () => hideLoading()
            });
            bootstrap.Modal.getOrCreateInstance($('#delete-modal')).hide();
        });
    });

    addListeners();
    loadAccounts();
});

function addListeners() {
    $('#btn-search, #btn-refresh').on('click', event => loadAccounts());

    // Khi người dùng thay đổi page size
    $('#page-size').on('change', event => loadAccounts());

    // Khi người dùng thay đổi page number và nhấn ENTER
    $('#page-number').on('keypress', event => {
        if (event.which == KEY_ENTER) {
            loadAccounts();
        }
    });

    $('#account-tbody').on('click', 'tr', function (event) {
        if (event.ctrlKey) {
            $(this).toggleClass('selected');
        } else {
            $(this).addClass('selected').siblings().removeClass('selected');
        }
        updateStatus();
    });

    $('#account-thead').on('click', 'th', function (event) {
        $(this).siblings().find('i').removeClass('fa-sort-up fa-sort-down').addClass('fa-sort');

        const i = $(this).find('i');
        if (i.hasClass('fa-sort')) {
            i.removeClass('fa-sort').addClass('fa-sort-up');
        } else {
            i.toggleClass('fa-sort-up fa-sort-down');
        }

        let type = i.hasClass('fa-sort-up') ? 'asc' : 'desc';
        sort = `${$(this).attr('key')},${type}`
        loadAccounts();
    });

    $('#btn-add').on('click', event => {
        $('#account-form').trigger('reset');
        $('#form-id-container').hide();
        $('#form-modal-btn-update').hide();
        $('#form-modal-btn-create').show();
        $('#form-modal-title').text('Thêm tài khoản');
    });

    $('#btn-edit').on('click', event => {
        $('#account-form').trigger('reset');
        $('#form-modal-btn-create').hide();
        $('#form-modal-btn-update').show();
        $('#form-id-container').show();
        $('#form-modal-title').text('Cập nhật tài khoản');

        const row = $('.selected');
        $('#form-id').val(row.find('.id').text());
        $('#form-last-name').val(row.find('.lastName').text());
        $('#form-first-name').val(row.find('.firstName').text());
        $('#form-username').val(row.find('.username').text());
        $('#form-role').val(row.find('.role').text());
    });

    $('#btn-delete').on('click', function (event) {
        $('#delete-modal-title').text('Xóa tài khoản');
        const message = `Bạn chắc chắn muốn xóa ${$('.selected').length} tài khoản?`;
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

function loadAccounts() {
    const searchParams = new URLSearchParams();

    let role = $('#role').val();
    if (!role) role = null;

    const params = {
        page: $('#page-number').val(),
        size: $('#page-size').val(),
        sort: sort,
        search: $('#search').val(),
        role: role,
        minId: $('#min-id').val(),
        maxId: $('#max-id').val()
    }
    for (const key in params) {
        if (params[key]) {
            searchParams.set(key, params[key]);
        }
    }

    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/accounts?' + searchParams,
        beforeSend: () => showLoading(),
        success: function (data) {
            showPageInfo(data);
            showAccounts(data.content);
            updateStatus();
        },
        complete: () => hideLoading(),
    });
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

function showAccounts(accounts) {
    const tbody = $('#account-tbody');
    tbody.empty();
    for (const account of accounts) {
        const updatedAt = new Date(account.updatedAt);
        tbody.append(`
            <tr>
                <th class='id' scope="row">${account.id}</th>
                <td class='lastName''>${account.lastName}</td>
                <td class='firstName'>${account.firstName}</td>
                <td class='username'>${account.username}</td>
                <td class='createdDate'>${account.createdDate}</td>
                <td class='updatedAt'>${updatedAt.toLocaleDateString()} ${updatedAt.toLocaleTimeString()}</td>
                <td class='role'>${account.role}</td>
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
    loadAccounts();
}
