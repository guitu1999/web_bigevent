// 入口函数
//当我们页面加载完毕之后（就是说等页面的结构 样式 节点等加载完毕），
//采取执行函数体里面的js部分
$(function () {
    //获取去注册dom元素
    let to_reg = document.querySelector('#to_reg')
    //获取去登录dom元素
    let to_login = document.querySelector('#to_login')
    //绑定去注册点击事件
    to_reg.addEventListener('click', function () {
        console.log('点击了去注册');
        document.querySelector('.toLogin').style.display = "none";
        document.querySelector('.toReg').style.display = "block";
    })
    //绑定去登录点击事件
    to_login.addEventListener('click', function () {
        console.log('点击了去登录');
        document.querySelector('.toReg').style.display = "none";
        document.querySelector('.toLogin').style.display = "block";
    })


    //从layui中获取form对象
    let layer = layui.layer
    // 登录按钮  表单提交事件
    // let login_btn = document.querySelector()
    $('#form_login').submit(function (e) {
        //阻止事件的默认行为
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: '/api/login',
            data: $(this).serialize(),  //快速获取表单中的数据
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功');
                console.log('令牌', res.token);
                //将登录成功得到的token令牌字符串
                //保存到localstorage
                localStorage.setItem('token', res.token)

                //跳转到后台主页
                location.href = './index.html'
            }
        })

    });


    //注册事件 jquery方法
    $('#form_reg').on("submit", function (e) {
        e.preventDefault();//阻止事件的默认行为
        console.log('点击了注册', e);
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                //不可以直接使用 先导出layer
                return layer.msg(res.message);
            }
            console.log('注册成功');
            layer.msg('注册成功,请登录');
            //模拟人的点击 去登录按钮
            document.querySelector('#to_login').click()

        })
    })


    //自定义表单校验规则(layui)
    //从layui中获取form对象
    let form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位 且不能出现空格'],
        // 校验两次密码是否一致
        repwd: function (value) {
            //通过形参拿到是 确认密码框中内容  再需要拿到密码框的内容
            //判断失败 则return一个错误消息
            let pdValue = document.querySelector('.toReg [name=password]').value
            console.log('打印密码的值', pdValue);
            if (value !== pdValue) {
                return '两次密码不一致'
            }

        }
    })
})