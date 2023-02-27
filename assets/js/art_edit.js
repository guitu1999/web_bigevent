$(function () {
    let layer = layui.layer
    let form = layui.form

    let map = getParameterMap();
    console.log('传过来的id', map.get("id"));
    let id = map.get("id")
    //获取文章的信息
    $.ajax({
        type: 'GET',
        url: '/my/article/' + id,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章失败')
            }
            console.log('文章获取成功', res);
            //渲染数据 为表单赋值
            form.val('formInfo', res.data)

        }
    })

    // 返回参数map
    function getParameterMap() {
        let parameters = window.location.search;
        // 如果没有参数
        if (parameters.indexOf("?") == -1) return null;
        let map = new Map;
        let strs = parameters.substr(1).split("&");
        for (let i = 0; i < strs.length; i++) {
            let str = strs[i].split("=");
            map.set(str[0], str[1]);
        }
        return map;
    }

    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 获取文章分类
    function initCate() {
        $.ajax({
            type: "GET",
            url: '/my/article/cates',
            success: function (res) {
                console.log('res111', res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                //调用模板引擎渲染下拉菜单  没有#号
                let Str = template('sel_cate', res)
                // 渲染
                $('[name=cate_id]').html(Str)
                // 调用layui的内置渲染函数 重新渲染下拉菜单
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //选择封面图片文件事件
    $('#choose_btn').on('click', function () {
        $('#coverFile').click();
    })

    //监听文件选择的change事件 获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        //获取到文件的列表数组
        let files = e.target.files[0]
        //判断用户选择是否选择了文件
        if (files.length === 0) {
            return
        }
        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    //定义文章的状态
    let art_state = '已发布'
    //存为草稿按钮点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //为表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        console.log('触发了表单的提交行为');
        //1.阻止表单的默认提交行为
        e.preventDefault();
        //2.基于form表单,快速创建一个formData对象
        let fd = new FormData($('#form-pub')[0])
        //追加id
        fd.append('Id', id)
        //3.将表单的发布状态存到fd中
        fd.append('state', art_state)
        //4.将封面裁剪过后的图片,输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5.将文件对象存储到fd中
                fd.append('cover_img', blob)
                //6.发起ajax请求
                publishArt(fd)
            })
    })
    //定义发布文章的方法
    function publishArt(fd) {
        console.log('编辑了', fd);
        //检查是否有数据 用fd.foreach检查
        fd.forEach((k, v) => {
            console.log(k, v);
        })
        $.ajax({
            type: 'POST',
            url: '/my/article/edit',
            data: fd,
            //注意 如果向服务器提交的是FormData格式的数据 
            //必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('编辑失败')
                }
                layui.layer.msg('编辑成功')
                // 跳转到文章列表页面
                // location.href = "./art_list.html"
            }
        })
    }
})