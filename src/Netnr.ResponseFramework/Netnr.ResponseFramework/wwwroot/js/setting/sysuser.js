﻿//载入
var gd1 = z.Grid();
gd1.url = "/Setting/QuerySysUser?tableName=sysuser";
gd1.sortName = "SuCreateTime";
gd1.onDblClickRow = function (index, row) {
    //双击行模拟点编辑
    z.buttonClick('edit');
}
gd1.onBeforeLoad = function (row, param) {
    var sq = QueryWhereGet();
    param.wheres = sq.stringify();
}
gd1.load();
//查询回调
function QueryWhereCallBack() {
    gd1.pageNumber = 1;
    gd1.load();
}

//角色格式化
function col_custom_srid(value, row, v) {
    return row.SrName;
}

//刷新
z.button('reload', function () {
    gd1.load();
});

//新增
z.button('add', function () {
    //表单标题
    z.FormTitle({
        icon: 0,
        title: '新增系统用户'
    });
    $('#fv_modal_1').modal();
});

//查看
z.button('see', function () {
    //获取选中行
    var rowData = gd1.func("getSelected");
    if (rowData) {
        //选中行回填表单
        z.FormEdit(rowData);
        //表单标题
        z.FormTitle({
            icon: 2,
            title: '查看系统用户',
            required: false
        });
        //禁用
        z.FormDisabled(true);
        //显示模态框
        $('#fv_modal_1').modal();
    } else {
        art("select");
    }
});
//关闭模态框后
$('#fv_modal_1').on('hidden.bs.modal', function () {
    //是查看时，解除禁用
    if (z.btnTrigger == "see") {
        z.FormDisabled(false);
    }
});

//修改
z.button('edit', function () {
    //获取选中行
    var rowData = gd1.func("getSelected");
    if (rowData) {
        //选中行回填表单
        z.FormEdit(rowData);
        //表单标题
        z.FormTitle({
            icon: 1,
            title: '修改系统用户'
        });
        //显示模态框
        $('#fv_modal_1').modal();
    } else {
        art("select");
    }
});

//保存
$('#fv_save_1').click(function () {
    //检测必填项
    if (z.FormRequired('red')) {
        $('#fv_save_1')[0].disabled = true;
        $.ajax({
            url: "/Setting/SaveSysUser?savetype=" + z.btnTrigger,
            type: "post",
            data: $("#fv_form_1").serialize(),
            success: function (data) {
                if (data == "exists") {
                    art('账号已经存在');
                } else if (data == "success") {
                    //新增成功，重新载入
                    if (z.btnTrigger == "add") {
                        gd1.load();
                    } else {
                        //编辑成功，修改行
                        gd1.func("updateRow", {
                            index: gd1.func('getRowIndex', gd1.func('getSelected')),
                            row: z.FormToJson()
                        });
                    }
                    $('#fv_modal_1').modal('hide');
                } else {
                    art('fail');
                }
            },
            error: function () {
                art('error');
            }
        });

        $('#fv_save_1')[0].disabled = false;
    }
});

//删除
z.button('del', function () {
    var rowData = gd1.func("getSelected");
    if (!rowData) {
        art('select');
        return false;
    }
    art('确定删除选中的行', function () {
        $.ajax({
            url: "/Setting/DelSysUser?id=" + rowData.SuId,
            type: "post",
            success: function (data) {
                if (data == "success") {
                    gd1.load();
                } else {
                    art('fail');
                }
            }
        })
    });
});