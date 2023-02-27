$(function () {

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;
    //定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零方法
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象 请求数据的时候
    //需要将请求参数对象提交到服务器
    let datas = {
        pagenum: 1,  //页码 默认请求第一页
        pagesize: 2,  //每页显示默认两条数据
        cate_id: '',//文章分类的id
        state: '',//文章的发布状态
    }

    //初始获取列表数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: datas,
            success: function (res) {
                console.log('res', res);
                if (res.status !== 0) {
                    return layer.msg('获取列表数据失败')
                }
                layer.msg('获取列表数据成功')
                //使用模板引擎导入 模板引擎的id   要传的数据
                let Str = template('tpl-table', res)
                $('tbody').html(Str)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    initTable()
    initCate()

    //初始化文章分类方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                console.log('获取文章分类成功')
                layer.msg('获取文章分类成功')
                //调用模板引擎 渲染分类的可选项
                let Str = template('tpl-cate', res)
                //渲染填充
                $('[name=cate_id]').html(Str)
                //通过layui重新渲染扁担区域的ui结构
                form.render()
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取表单中选中的值
        let cateID = $('[name=cate_id]').val();
        let state = $('[name=state]').val()
        //为查询参数datas 对应的属性赋值
        datas.cate_id = cateID
        datas.state = state
        //重新渲染表格的数据
        initTable()
    })


    //定义渲染分页的方法
    function renderPage(total) {
        console.log('total', total);
        //调用方法 渲染分页结构
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total, //数据总数，从服务端得到
            limit: datas.pagesize,//每页显示多少条
            curr: datas.pagenum, //指定默认选中第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//配置项 自定义排版
            limits: [2, 3, 5, 10],
            //分页发生切换的时候 触发jump回调
            //触发jump的方式有两种
            //1.点击页码的时候会触发jump回调
            //2.只要调用laypage.render()方法就会触发jump回调
            //first用方法一触发  是undefined
            //方法二触发 是true
            jump: function (obj, first) {
                console.log(obj.curr);
                //把最新的页码值 赋值给datas
                datas.pagenum = obj.curr //页数
                datas.pagesize = obj.limit  //条目数
                if (!first) {
                    //根据最新的datas参数 渲染表格
                    initTable()
                }

            }
        });
    }

    //代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '#btnDl', function () {
        //获取当前页面按钮的个数
        let len = document.querySelectorAll('#btnDl').length
        console.log('删除按钮的个数', len);
        console.log('点击了删除');
        //获取删除的id
        let id = $(this).attr('data-id')
        //是否删除弹出层
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {

            console.log('要删除的id', id);
            $.ajax({
                method: "GET",
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    //判断当数据删除完成后 需要判断当前这一页是否还有剩余的数据
                    //如果当前页面删除按钮为1 则让页码减1
                    if (len === 1) {
                        //判断是否只剩一页了
                        datas.pagenum === 1 ? 1 : datas.pagenum - 1
                    }
                    //重新渲染表格的数据
                    initTable()
                }
            })
            layer.close(index);
        });
    })

    //为文章增加编辑事件
    $('tbody').on('click', '#editBtn', function () {
        let id = $(this).attr('data-id')
        console.log('点击了编辑', id);
        location.href = './art_edit.html?id=' + id

    })
})