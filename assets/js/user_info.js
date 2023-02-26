$(function () {
    let form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间!'
            }
        }
    })
    //调用用户信息函数
    init_info()
})
let form = layui.form
//初始化用户信息
function init_info() {
    $.ajax({
        type: "GET",
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            console.log(res);
            //调用form.val()为表单赋值
            form.val("formInfo", res.data);

        }
    })
}
// 重置表单数据
document.querySelector("#btnReset").addEventListener('click', function (e) {
    //阻止表单的重置默认行为
    e.preventDefault()
    //调用用户信息函数
    init_info()
})
//监听表单的提交事件
$('.layui-form').on("submit", function (e) {
    //阻止表单的默认提交行为
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),  //快速拿到表单的数据
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('更新用户信息失败')
            }
            layui.layer.msg('更新用户信息成功')
            //调用父页面的方法 重新渲染用户信息
            window.parent.getUserinfo()
        }
    })
})