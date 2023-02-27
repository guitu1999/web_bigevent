$(function () {
    //导入layer
    let layer = layui.layer
    let form = layui.form
    //获取文章的分类列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log('res', res.data);
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章类别失败')
                }
                layui.layer.msg('获取文章类别成功')
                // 调用template函数
                let htmlStr = template('tpl-table', res)
                //渲染html页面
                document.querySelector('tbody').innerHTML = htmlStr
            }
        })
    }
    initCate()

    //添加文章类别事件
    let indexAdd = null
    document.querySelector('#add_cate').addEventListener('click', function () {
        console.log('点击了添加类别');
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章文类'
            , content: $('#dialog_add').html()
        });
    })

    //通过代理的形式,为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        console.log('ok', $(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log('res', res);
                if (res.status !== 0) {
                    return layer.msg('添加分类失败')
                }
                layer.msg('添加分类成功')
                initCate()
                layer.close(indexAdd)
            }
        })
    })

    let indexEdit = null
    //代理的形式绑定 编辑分类点击事件
    $('tbody').on('click', '#btnEdit', function (res) {
        //弹出一个修改分类信息的曾
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章文类'
            , content: $('#dialog_edit').html()
        });
        let id = $(this).attr("data-id");
        console.log('id', id);
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log('编辑', res);
                form.val('form-edit', res.data)
            }
        })
    })

    //代理的形式 为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate/',
            data: $(this).serialize(),
            success: function (res) {
                console.log('编辑了', res);
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initCate()
            }
        })
    })

    //代理的形式 给删除按钮绑定点击事件
    $('tbody').on('click', '#btnDl', function (e) {
        let id = $(this).attr('data-id')
        console.log('id', id);
        //提示框
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    console.log('res', res);
                    if (res.status !== 0) {
                        return layer.msg('删除分类数据失败')
                    }
                    layer.msg('删除分类数据成功')
                    layer.close(index);
                    initCate()
                }
            })

        });
    })
})