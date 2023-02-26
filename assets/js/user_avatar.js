$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 上传文件绑定点击事件
    document.querySelector('#choose_btn').addEventListener('click', function () {
        document.querySelector('#file').click()
    })

    //文件改变事件
    document.querySelector('#file').addEventListener('change', function (e) {
        console.log('图片发生了改变', e);
        let list = e.target.files
        console.log('list', list);
        if (list.length === 0) {
            return layui.layer.msg('请选择照片')
        }
        //1.拿到用户选择的文件
        let file = e.target.files[0]
        //2.将文件转换为路径
        let newImgURL = URL.createObjectURL(file)
        console.log('newImgURL', newImgURL);
        //3.重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //确定上传点击事件
    document.querySelector('#btn_sure').addEventListener('click', function () {
        //1.拿到用户裁剪后的头像
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //2.调用接口 把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                console.log('res', res);
                if (res.status !== 0) {
                    return layui.layer.msg('更换头像失败')
                }
                layui.layer.msg('更换头像成功')
                window.parent.getUserinfo()
            }
        })
    })

})