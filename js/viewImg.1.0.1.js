/*!
 * viewIng v1.0.1 ~ Copyright (c) Ajaxson, 2018/05/14/ Email Ajaxson@163.com
 * 如有什么问题，请github 留言 或者 邮件
*/

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
@param(toTime)              //放大用时 类型 number; 选填 / 默认 500
@param(backTime)            //缩小用时 类型 number; 选填 / 默认 400
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

;(function(win){
    viewImg = function(appendBox, litObj, options){
        var that = this;
        var options = options || "";

        // 标配
        that.appendBox = typeof(appendBox) == 'object' ? appendBox : $(appendBox);
        that.litObj = typeof(litObj) == 'object' ? litObj : $(litObj);
        // 可选配置
        that.option = {
            boxId : options.viewBoxId || "imgViewBox",
            viewPosition: options.viewPosition == "absolute"? "absolute" : "fixed",
            ratioScale: options.ratioScale || 1,
            leftPadding: options.leftPadding || 0,
            topPadding: options.topPadding || 0,
            toTime: options.toTime || 500,
            backTime: options.backTime || 400,
            lockScroll: options.lockScroll == true? true : false,
            boxBg: options.boxBg || "#000",
            easingMethod: options.easing || "",
            toWidth: options.toWidth || "60%",    //可以设百分比，即装载容器的百分比，也可以是固定的值

            beforeEnlarge: options.beforeEnlarge || "",
            enlargeEnd: options.enlargeEnd || "",
            beforeReduce: options.beforeReduce || "",
            reduceEnd: options.reduceEnd || ""

        }

        /**************************系统初始化配置,非人为修改************************************/
        that.oldLit = litObj;
        that.base = {
            pdboxWidth: that.appendBox.width() - that.option.leftPadding,                   //计算显示容器的宽，，最外层容器 - 偏移值
            pdboxHeight: that.appendBox.height() - that.option.topPadding,                  //计算显示容器的高，，最外层容器 - 偏移值
            easingMethod: $.easing.easeInCirc? that.option.easingMethod : "linear",         //判断是否有引入用到 jqury easing辅助
            pdView: "",                                                                     //带偏移值的容器
            posReView: "",                                                                  //真实容器（最内层）
            litImg: "",                                                                     //要点击的对象 s
            bigObj: "",                                                                     //大图
            bigSrc: "",                                                                     //大图 url
            appendHtml:  "",                                                                //要插入的 dom
            litXy: "",                                                                      //小图的位置及大小
            reviewXy: "",                                                                   //大图最内层容器的位置及大小存储
            bigXy: "",                                                                      //大图的初始位置及大小存储
            toWidth: "",                                                                    //大图要去的宽
            toHeight: "",                                                                   //大图要去的高                                                      
            toXy: ""                                                                        //大图即将去的位置及大小存储
        }


        /**************************调用方法************************************/
        that._init();
    
    }

    // 原型
    viewImg.prototype = {

         // 初始化
        _init: function(){
            var that = this;
            that._litClick();
            // 是否锁定滚动条
            that.option.lockScroll == true? that._lockScroll(): "";
        },

        // 锁定滚动条
        _lockScroll: function(){
            var scTop = $(document).scrollTop();
            $(document).on('scroll.unable',function (e) {
                $(document).scrollTop(scTop);
            })
        },
        // 解锁滚动条
        _unLockScroll: function(){
            $(document).unbind("scroll.unable");
        },

        // 插入的模板
        _viewHtml: function(){
            var that = this;
            that.base.appendHtml += '<div class="window_viewimg on" id="'+that.option.boxId+'" style="position:'+that.option.viewPosition+'; top: 0; left: 0; z-index: 9999; width: 100%; height: 100%;">';
            that.base.appendHtml +=      '<div class="pd_viewimg" style="box-sizing: content-box; position: relative; width: '+that.base.pdboxWidth+'px; height: '+that.base.pdboxHeight+'px; padding-top: '+that.option.topPadding+'px; padding-left: '+that.option.leftPadding+'px;">';
            that.base.appendHtml +=            '<div class="re_viewimg" style="position: relative; width: 100%; height: 100%;">';
            that.base.appendHtml +=                '<i class="viewBg" style="display: inline-block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.6; background: '+that.option.boxBg+';"></i>';
            that.base.appendHtml +=                '<img src="'+that.base.bigSrc+'" alt="" id="bigViewPic" style="position: absolute;">';
            that.base.appendHtml +=            '</div>';
            that.base.appendHtml +=      '</div>';
            that.base.appendHtml += '</div>';
            // return that.base.appendHtml;
        },

        // 判断插入
        _appendView: function(phtml){
            var that = this;
            if($("#"+that.option.boxId)[0]){
                $("#"+that.option.boxId).remove();
            }
            that.appendBox.append(phtml); 
        },

        // 小图点击
        _litClick: function(){
            var that = this;
            that.litObj.on("click", function(){
                that.base.litImg = $(this);
                that.base.bigSrc = that.base.litImg.attr("viewSrc")? that.base.litImg.attr("viewSrc") : that.base.litImg.attr("src");
                that._reInit();
                // 调用模板渲染
                that._viewHtml();
                that._appendView(that.base.appendHtml);
                // 大图位置计算
                that._bigStart();
                // 给大图添加点击
                that._bigClick();
            })
        },

        // 大图开始走动
        _bigStart: function(){
            var that = this;
            that.base.bigObj = $("#"+that.option.boxId+ " "+"#bigViewPic");
            that.base.pdView = $("#"+that.option.boxId+ " "+".pd_viewimg");
            that.base.posReView = $("#"+that.option.boxId+ " "+".re_viewimg");
            that._viewSizeResum();
            that.base.litXy = { "x": that.base.litImg.offset().left, "y": that.base.litImg.offset().top, "width": that.base.litImg.width(), "height": that.base.litImg.height() }
            that.base.reviewXy = { "x": that.base.posReView.offset().left, "y": that.base.posReView.offset().top, "width": that.base.posReView.width(), "height": that.base.posReView.height() }
            that.base.bigXy = { "x": (that.base.litXy.x-that.base.reviewXy.x)/that.option.ratioScale, "y": (that.base.litXy.y-that.base.reviewXy.y)/that.option.ratioScale, "width": that.litObj.width(), "height": that.litObj.height() }
            that.base.bigObj.css({  "left": that.base.bigXy.x+"px", "top": that.base.bigXy.y+"px", "width": that.base.bigXy.width+"px", "height": that.base.bigXy.height+"px" })
            that.base.toWidth = that._sumWidth(that.option.toWidth, that.base.reviewXy.width);
            that.base.toHeight = that.base.toWidth / that.base.litXy.width * that.base.litXy.height;
            that.base.toXy = { "x": (that.base.reviewXy.width/2 - that.base.toWidth/2), "y": that.base.reviewXy.height/2 - that.base.toHeight/2, "width": that.base.toWidth, "height": that.base.toHeight };
            // 调用放大前回调
            that.beforeEnlarge();
            that.base.bigObj.animate( { "left": that.base.toXy.x, "top": that.base.toXy.y , "width": that.base.toXy.width, "height": that.base.toXy.height }, { duration: that.option.toTime, easing: that.base.easingMethod, complete: function(){
                // 调用放大完成的回调
                that.enlargeEnd();
            } });
            $(".viewBg").animate( { "opacity": 1 }, that.option.backTime-200 < 0? 10 : that.option.backTime-200 );
        },

        _sumWidth: function(toW, viewW){
            var that = this;
            var res = /^[1-9]+[0-9]*]*$/ ; 
            if(!res.test(that.option.toWidth)){
                 return viewW * (toW).replace(/%/, "") / 100;
            }else{
                return toW
            }
        },

        // 大图点击
        _bigClick: function(){
            var that = this;
            that.base.bigObj.on("click", function(){
                // 调用所小
                that._reduceFunc();
            })
        },

        // 大图缩小
        _reduceFunc: function(){
            var that = this;

            that.base.bigObj.stop();
            $("#"+that.option.boxId+" .viewBg").stop();
            $("#"+that.option.boxId+" .viewBg").animate( { "opacity": 0 }, that.option.backTime+200 );

            var retoLitXy = { "x": that.base.litImg.offset().left, "y": that.base.litImg.offset().top, "width": that.base.litImg.width(), "height": that.base.litImg.height() }
            var retoViewXy = { "x": that.base.posReView.offset().left, "y": that.base.posReView.offset().top, "width": that.base.posReView.width(), "height": that.base.posReView.height() }
            var retoXy = { "x": (retoLitXy.x-retoViewXy.x)/that.option.ratioScale, "y": (retoLitXy.y-retoViewXy.y)/that.option.ratioScale, "width": that.base.litImg.width(), "height": that.base.litImg.height() }
            
            // 调用缩小前回调
            that.beforeReduce();
            that.base.bigObj.animate({ "left": retoXy.x, "top": retoXy.y , "width": retoXy.width, "height": retoXy.height }, {duration: that.option.backTime, complete:function(){                    
                // 回复初始
                that._reInit();
                // 调用缩小完回调
                that.reduceEnd();
            }})  
        },

        // 回复初始
        _reInit: function(){
            var that = this;
            that.base.appendHtml = "";
            $("#"+that.option.boxId).remove();
            $(document).unbind("scroll.unable");
        },

        // 视图大小重新计算
        _viewSizeResum: function(){
            var that = this;
            that.base.pdboxWidth = that.appendBox.width() - that.option.leftPadding,
            that.base.pdboxHeight = that.appendBox.height() - that.option.topPadding,
            that.base.pdView.css({ "width": that.base.pdboxWidth, "height": that.base.pdboxHeight, "leftPadding": that.option.leftPadding, "topPadding": that.option.leftPadding })
        },

        // 让动态加载的 dom重新绑定
        reDom: function(){
            var that = this;
            that.litObj = typeof(that.oldLit) == 'object' ? that.oldLit : $(that.oldLit);
            that._litClick();
        },

        // 尺寸变了, 外部调用这个方法
        resizeApply: function(){
            var that = this;
            if(that.base.boxId){
                // 重新计算
                that._bigStart();
                that._bigClick();
            }
        },

        // 回调函数
        // 放大前回调
        beforeEnlarge: function(){
            var that = this;
            if( that.option.beforeEnlarge && typeof that.option.beforeEnlarge == "function"){
                that.option.beforeEnlarge();
            };
        },
        // 放大完回调
        enlargeEnd: function(){
            var that = this;
            if(that.option.enlargeEnd && typeof that.option.enlargeEnd == "function"){
                that.option.enlargeEnd();
            };
        },
        // 缩小前回调
        beforeReduce: function(){
            var that = this;
            if( that.option.beforeReduce && typeof that.option.beforeReduce == "function"){
                that.option.beforeReduce();
            };
        },
        // 缩小完回调
        reduceEnd: function(){
            var that = this;
            if(that.option.reduceEnd && typeof that.option.reduceEnd == "function"){
                that.option.reduceEnd();
            };
        }
    }
}(window))







