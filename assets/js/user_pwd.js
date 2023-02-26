$(function () {
    let form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }

        }

    })

    // 表单的提交事件
    $('.layui-form').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),//快速获取表单内容
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')
                //重置表单 [0]转成原生dom
                // $('.layui-form')[0].reset()
                //原生写法
                document.querySelector('.layui-form').reset()
            }
        })
    })

})