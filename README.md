# viewImg

viewImg是一款 类似 手机qq聊天 查看大图的 时效果的组件
从图片从哪里出来，就回哪里去，

兼容 ie7.8等 更新进的浏览器
优点： 1.支持自定义 容器
      2.支持在缩放容器里 插入
      3.可配合 jquery 的 easing 动画
      4.支持动态插入的
      5.支持定位方式选择， 和 容器偏移，
      6.支持窗口 resize
      7.带回调

后续会加多点注释  和 加入 对 支持 transfrom的浏览器 用css3 属性

参数列表

/*
*配置参数
@param(appendBox)           //要插入的位置 类型 obj/str; 必填
@param(litObj)              //下图对象列表 类型 obj/str; 必填
@param(options)             //配置可选参数 类型 json，   选填

@options各项参数
@param(viewBoxId)           //插件容器id 类型 str; 选填 / 默认 “imgViewBox”
@param(viewPosition)        //插件最外层容器定位方式 类型 str; 选填 / 默认 fixed
@param(ratioScale)          //存放容器的scale缩放倍数 类型 number; 选填 / 默认 1
@param(leftPadding)         //相对定位容器左偏移量 类型 number; 选填 / 默认0
@param(topPadding)          //相对定位容器上偏移量 类型 number; 选填 / 默认0
@param(toTime)              //放大用时 类型 number; 选填 / 默认 500 毫秒
@param(backTime)            //缩小用时 类型 number; 选填 / 默认 400 毫秒
@param(lockScroll)          //是否禁止页面滚动 类型 bool; 选填 / 默认 false
@param(boxBg)               //背景 类型 str; 选填 / 默认 #000，可用图片
@param(easing)              //runtime 动画 类型 str; 选填 / 默认 linear， 可配合 jqury 的 easing动画
@param(toWidth)             //要变多大; 选填 / 类型: number or "百分比"， 默认 最内层视图的 60%; 
@param(beforeEnlarge)       //放大前回调 类型 fuction; 选填 / 默认 null
@param(enlargeEnd)          //放大完成后回调 类型 fuction; 选填 / 默认 null
@param(beforeReduce)        //缩小前回调 类型 fuction; 选填 / 默认 null
@param(reduceEnd)           //缩小前后回调 类型 fuction; 选填 / 默认 null


小图 dom 可之定义属性 
@ viewSrc                   //如果不设置 大图会取 小图的 src 

*/



















       


