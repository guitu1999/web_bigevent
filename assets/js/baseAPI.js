//注意每次调用$.get $.post $.ajax 
//会先调用$.ajaxPrefilter函数
//在这个函数中 可以拿到我们给ajax的配置对象
$.ajaxPrefilter(function (options) {
    console.log('options', options.url);
    //在发起真正的ajax请求之前 同意拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log('options', options.url);

})