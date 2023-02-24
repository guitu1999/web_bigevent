$(function () {
    //获取用户信息
    getUserinfo()

    //退出登录
    document.querySelector('#loginout_btn').addEventListener('click', function () {
        console.log('退出');
        // 提示框
        layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //清空本地存储的token
            localStorage.removeItem('token')
            //重新跳转到登录页
            location.href = './login.html';
            //关闭弹出框
            layer.close(index);
        });
    })
})

//获取用户的基本信息
function getUserinfo() {
    $.ajax({
        type: "GET",
        url: '/my/userinfo',
        // 请求头配置对象 (迁移至baseAPI)
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!');
            }

            //执行渲染用户头像方法
            renderAvater(res.data)
        },
        //无论成功还是失败 最终都会调用complete(迁移至baseAPI)
        // complete: function (res) {
        //     console.log('执行了complete回调', res);
        //     //在complete回调函数中 可以使用res.responseJSON 拿到服务器响应的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //强制清空token
        //         localStorage.removeItem('token')
        //         //强制跳转
        //         location.href = './login.html'
        //     }
        // }
    })
}

//渲染用户头像
function renderAvater(user) {
    console.log('user1111', user);
    //获取用户名称
    let name = user.nickname || user.username
    // 欢迎文本
    document.querySelector('#welcome').innerHTML = `欢迎&nbsp&nbsp${name}`
    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 图片头像
        let img_list = document.querySelectorAll('.layui-nav-img')
        img_list.forEach((item, index) => {
            item.src = user.user_pic
        })
        let name_list = document.querySelectorAll('.text-avater')
        name_list.forEach((item, index) => {
            item.style.display = "none"
        })
    } else {
        console.log("文本头像")
        // 文本头像
        document.querySelector('.layui-nav-img').style.display = "none"
        let first = name[0].toUpperCase();
        // 图片头像
        let img_list = document.querySelectorAll('.layui-nav-img')
        img_list.forEach((item, index) => {
            item.style.display = "none"
        })
        let name_list = document.querySelectorAll('.text-avater')
        name_list.forEach((item, index) => {
            item.innerHTML = first

        })
        document.querySelector('.text-avater').innerHTML = first

    }
}