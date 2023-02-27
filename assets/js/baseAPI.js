//注意每次调用$.get $.post $.ajax 
//会先调用$.ajaxPrefilter函数
//在这个函数中 可以拿到我们给ajax的配置对象
$.ajaxPrefilter(function (options) {
    console.log('options', options.url);
    //在发起真正的ajax请求之前 同意拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log('options', options.url);
    // 判断是否是请求的有权限的接口
    if (options.url.indexOf('/my') != -1) {
        // 统一为有权限的接口 设置headers请求头
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //全局统一挂载complate回调函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清空token
            localStorage.removeItem('token')
            //强制跳转
            location.href = './login.html'
        }
    }
})