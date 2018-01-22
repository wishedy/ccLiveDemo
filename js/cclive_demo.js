/*
* create By ZhangHeng on 2018/1/12
*/

$(document).ready(function () {
    var ccLive = {
        data: {
            emotion: {
                emotionList: [],
                num: 132
            },
            bullet: true,//弹幕开关
            controlBar: true,//控制条显示隐藏
            docFit: true,//文档自适应开关
            liveInit: {
                roomid: "C837DF69777B32DC9C33DC5901307461",
                userid: "0438CD3A0AB20794",
                viewername: '萤火虫_227342010941_13_809302',
                viewertoken: 'nothing',
                viewercustomua: 'web-pc',
                showMarquee: true
            }
        },
        el: {
            phizList: $(".cc-chat-emotionList"),
            sendBtn: $("#cc-send-msg"),
            emotionBtn: $(".cc-chat-emotion"),
            personalBtn: $(".cc-chat-people"),
            personalList: $(".cc-chat-users"),
            onLineNum: $(".cc-online-num"),
            bullet: $(".cc-bullet"),
            strip: $(".cc-strip"),
            microphone: $(".cc-microphone"),
            docFit: $(".cc-doc"),
            exitLive: $(".control-exit"),
            volume: $(".volume-control-input"),
            liveName: $(".cc-live-name"),
            sendQues: $(".send-question-btn"),
            quesInput: $(".control-input-question"),
            screenMsg: $(".control-btn-screen"),
            screenInput: $(".screen-input"),
            teacherList: $(".cc-chat-users"),
            chatInput: $(".cc-chat-input")
        },
        init: function () {
            var t = this;
            t.liveInit().emotionInit().sendMsg().chatInit().bulletState().controlBarState().docFitState();
        },
        getOnLineNum: function (num) {
            var t = ccLive;
            t.el.onLineNum.html(num);
            return t;
        },
        chatInit: function () {
            var t = this;
            t.el.personalBtn.off("click").on("click", function (e) {
                e.stopPropagation();
                t.el.personalList.slideToggle(200);
                return false;
            });
            $("body").off("click").on("click", function (e) {
                var element = $(e.target);
                var onOff = element.hasClass("cc-chat-people") || element.hasClass("cc-chat-emotion");
                if (!onOff) {
                    t.el.personalList.hide(400);
                    t.el.phizList.hide(400);
                }
            });
            return t;
        },
        produceMsg: function (data) {
            var t = this;
        },
        receivePrivate: function (data) {
            var t = this;
            console.log(JSON.parse(data));

            return t;
        },
        bulletState: function () {
            var t = this;
            if (t.data.bullet) {
                t.el.bullet.html("弹幕已开").toggleClass("cc-bullet-active");
            } else {
                t.el.bullet.html("弹幕已关").toggleClass("cc-bullet-active");
            }

            return t;
        },
        filterMsg: function (str) {
            var reTag = /<img(?:.|\s)*?>/g;
            var machResult = str.match(reTag);
            var lastResult = {};
            var contentPara = [];
            if (machResult) {
                for (var num = 0; num < machResult.length; num++) {
                    var l = machResult[num]
                    str = str.replace(l, "$" + l + '$');
                }
                var arr = (str.replace(/\$+/g, "$")).split("$");
                for (var innerNum = 0; innerNum < arr.length; innerNum++) {
                    if (arr[innerNum].indexOf("img") > -1) {
                        contentPara.push($(arr[innerNum]).attr("src"));
                    } else {
                        var item = $('<p>' + arr[innerNum] + '</p>').text();
                        if(item.length){
                            contentPara.push(item);
                        }

                    }
                }
                lastResult = {
                    type: 1,
                    contentData: contentPara
                }

            } else {
                lastResult = {
                    type: 0,
                    contentData: [str]
                };
            }
            var lastResultStr = '';
            $.each(lastResult.contentData,function(i,v){
               if(v.indexOf("img")>-1){
                   lastResultStr+='['+v+']';
               }else{
                   lastResultStr+=v;
               }
            });
            return lastResultStr;
        },
        sendMsg: function () {
            var t = this;
            t.el.sendBtn.off("click").on("click", function () {//发送弹幕
                var resultContainer = $(".cc-chat-people");
                var toWhich = (resultContainer.attr("data-to") === '0') ? 0 : 1;
                var msg = t.filterMsg(t.el.chatInput.html());
                if (msg.length) {
                    console.log(toWhich)
                    if (toWhich === 0) {
                        //公聊
                        DWLive.sendPublicChatMsg(msg);
                        t.el.chatInput.html('');
                    } else {

                        //私聊

                    }
                } else {
                    return false;
                }

            });
            console.log("开始公聊");
            DWLive.onPublicChatMessage = t.updateMsg;//当收到公聊信息的时候触发
            DWLive.onPrivateChatMessage = t.receivePrivate;//当收到私聊信息的时候触发

            DWLive.onLiveStarting = function (j) {
                console.log(j);
            }
            DWLive.onInformation = function (data) {//当禁言的时候触发
                console.log(data);
                console.log("已禁言");
            };
            DWLive.onAnnouncementShow = function (j) {//开始直播后显示公告
                console.log(j);
            };
            t.el.sendQues.off("click").on("click", function () {
                var queStr = t.el.quesInput.val();
                if (queStr.length) {
                    DWLive.sendQuestionMsg(queStr);//闲讲师提出问题，其他学生看不到
                    t.el.quesInput.val('');
                } else {
                    return false;
                }
            });
            DWLive.onAnswer = function (data) {
                console.log(data);
                alert("收到回复信息" + data);
            }
            t.el.screenMsg.off("click").on("click", function () {
                var msg = t.el.screenInput.val();
                if (msg.length) {
                    DWLive.barrage(msg, "0xffffff");
                    t.el.screenInput.val('');
                } else {
                    return false;
                }
            });


            return t;
        },
        analysisMsg:function(msg){
            var str = '';
            var lastResult = '';
          if((msg.indexOf("[")>-1)&&(msg.indexOf("]")>-1)){
              str = msg.replace(/\[/g,'[]').replace(/\[\]/g,'&').replace(/\]/g,'[]').replace(/\[\]/g,'&');
              var dataList = str.split('&');
              for(var num = 0;num<dataList.length;num++){
                  var item = dataList[num];
                  if(item.length){
                      if((item.indexOf("gif")>-1)||(item.indexOf("png")>-1)||(item.indexOf("jpg")>-1)||(item.indexOf("jpeg")>-1)){
                          lastResult+='<img src="'+item+'"/>';
                      }else{
                          lastResult+=item;
                      }
                  }
              }
          }else{
              lastResult = msg;
          }
          return lastResult;
        },
        updateMsg:function(data){
            var t = ccLive;
          var container = $(".cc-msg-list");
          var itemData = JSON.parse(data);
          var userNameInfo = itemData.username.split("_");
          var cid = userNameInfo[1];
          var customerName = userNameInfo[0];
          var localuserInfo = t.data.liveInit.viewername.split('_');
          var myCid = localuserInfo[1];
          var isMe = (myCid===cid)?"me":""
          var template = '<li class="cc-msg-item '+isMe+'">'+
              '                        <div class="cc-chat-user">'+
              '                            <span>'+customerName+'</span>说:'+
              '                        </div>'+
              '                        <div class="cc-chat-word">'+
              '                            '+t.analysisMsg(itemData.msg)+
              '                        </div>'+
              '                        <div class="cc-chat-time">'+itemData.time+'</div>'+
              '                    </li>';
          container.append(template);
        },
        initTeacher: function (data) {
            var t = ccLive;
            var myTemplate = Handlebars.compile($("#al-tpl-teacher").html());
            var listStr = myTemplate(data) + '<li class="cc-chat-users-item" data-teacherId="0" data-role="all">所有人</li>';
            t.el.teacherList.html(listStr);
            var listItem = $('.cc-chat-users-item');
            listItem.each(function () {
                var item = $(this);
                item.off("click").on("click", function () {
                    var target = $(this);
                    var userName = target.text();
                    var userId = target.attr("data-teacherId");
                    var resultContainer = $(".cc-chat-people");
                    resultContainer.html(userName).attr({"data-to": userId});
                })
            });

            return t;
        },
        liveInit: function () {
            var t = this;
            DWLive.onUserCountMessage = ccLive.getOnLineNum;//初始化直播在线人数
            DWLive.init(t.data.liveInit);//直播初始化数据
            DWLive.onLiveStart = function (num) {//在直播开始的时候触发
                console.log(num);
            };
            t.el.bullet.off("click").on("click", function () {//初始化弹幕开关事件
                t.data.bullet = !t.data.bullet;
                DWLive.openBarrage(t.data.bullet);
                t.bulletState();
            });
            DWLive.onOnlineTeachers = t.initTeacher;
            t.el.strip.off("click").on("click", function () {//初始化显示隐藏控制条事件
                t.data.controlBar = !t.data.controlBar;
                DWLive.showControl(t.data.controlBar);
                t.controlBarState();
            });
            t.el.microphone.off("click").on("click", function () {
                DWLive.requestInteraction({
                    video: true,
                    audio: true
                });
            });
            t.el.docFit.off("click").on("click", function () {
                t.data.docFit = !t.data.docFit;
                console.log(t.data.docFit);
                DWLive.docAdapt(t.data.docFit);
                t.docFitState();
            });
            t.el.exitLive.off("click").on("click", function () {
                DWLive.logout();
            });
            DWLive.onStartRollCall = function (data) {//签到功能
                var rid = data.rollcallId;
                var pid = data.publisherId;
                var time = data.duration;
                t.signIn(rid, pid, time);
            }
            t.el.volume.off("change").on("change", function () {//调节音量
                DWLive.setSound($(this).val());
            });
            window.on_cc_swf_loading_completed = function (i) {//PC端flash加载完的回调,无参数返回
                console.log(i);
            }
            DWLive.onLiveDesc = function (i) {
                console.log(i);//这个直播的标题，就是开直播时输入的标题
                t.el.liveName.html(i);
            }
            DWLive.onStartLottery = function (data) {//开始抽奖的时候会触发的函数
                console.log(data.lotteryId);//此时会返回一个抽奖I的，lotteryId
                var options = {
                    type: -1,
                    title: "抽奖开始！",
                    content: '您的抽奖号码（ID）：' + data.lotteryId,
                    init: function () {

                    },
                    cancelBack: function () {

                    },
                    ensureBack: function () {

                    }
                }
                t.modal(options);
            }
            DWLive.onStopLottery = function (data) {
                console.log(data.lotteryId);//此时会返回一个结束的，lotteryId
                var mask = $(".cc-mask");
                mask.addClass("hide");
            }
            DWLive.onWinLottery = function (data) {
                //中奖的时候会触发的函数
                console.log(data.lotteryId);//此时会返回一个中奖Id,lotteryId
                alert("中奖号码：" + data.lotteryId);
            }
            window._onStart = function (i) {//PC端直播开始后的回调,，无参数返回
                console.log("直播开始")
            }
            return t;
        },
        modal: function (options) {
            var mask = $(".cc-mask");
            var modal = $(".cc-modal");
            var contentElement = modal.find(".cc-modal-content");
            var titleElement = modal.find(".cc-modal-title");
            var controlElement = modal.find(".cc-modal-control-bar");
            titleElement.html(options.title);
            contentElement.html(options.content);
            if (options.type === 0) {
                controlElement.addClass("cc-modal-alert");
                controlElement.find(".control-modal-btn").eq(0).html(options.btnContent).off("click").on("click", function () {
                    mask.addClass("hide");
                });
            } else if (options.type === -1) {
                controlElement.hide();
            } else {
                controlElement.removeClass("cc-modal-alert");
                controlElement.find(".control-modal-btn").eq(0).html("取消").off("click").on("click", function () {
                    options.cancelBack && options.cancelBack();
                    mask.addClass("hide");
                });
                controlElement.find(".control-modal-btn").eq(1).html("确认").off("click").on("click", function () {
                    options.ensureBack && options.ensureBack();
                    mask.addClass("hide");
                });
            }
            mask.removeClass("hide");
            options.init && options.init();

        },
        signIn: function (rid, pid, tim) {
            var t = this;
            var timeNum = tim;
            var options = {
                type: 0,
                title: "签到",
                content: '<p class="cc-sign-title">距离签到结束还有<i class="cc-time">' + timeNum + '</i>s</p>' +
                '            <button class="cc-sign-btn">签到</button>',
                init: function () {
                    var signBtn = $(".cc-sign-btn");
                    var timeobj = $(".cc-time");
                    var timeTitle = $(".cc-sign-title");
                    clearInterval(signTimer);
                    var signTimer = setInterval(function () {
                        timeNum--;
                        if (timeNum >= 0) {
                            timeobj.html(timeNum);
                        } else {
                            timeTitle.html("签到结束");
                            signBtn.addClass("cc-sign-btn-end");
                            signBtn.off("click");
                            clearTimeout(hideMask);
                            var hideMask = setTimeout(function () {
                                $(".cc-mask").addClass("hide");
                            }, 2000)
                        }
                    }, 1000)
                    signBtn.off("click").on("click", function () {
                        timeTitle.html("恭喜你签到成功！").addClass("cc-sign-btn-active");
                        DWLive.answerRollcall(rid, pid);
                        $(".cc-mask").addClass("hide");
                    });
                },
                btnContent: "暂时不签",
                cancelBack: function () {

                },
                ensureBack: function () {

                }
            }
            t.modal(options);
        },
        docFitState: function () {
            var t = this;
            if (t.data.controlBar) {
                t.el.docFit.html("自适应窗口").toggleClass("cc-doc-active");
            } else {
                t.el.docFit.html("原始宽高比").toggleClass("cc-doc-active");
            }

            return t;
        },
        controlBarState: function () {
            var t = this;
            if (t.data.controlBar) {
                t.el.strip.html("显示控制条").toggleClass("cc-strip-active");
            } else {
                t.el.strip.html("隐藏控制条").toggleClass("cc-strip-active");
            }

            return t;
        },
        emotionInit: function () {
            var t = this;
            for (var num = 0; num < 132; num++) {
                t.data.emotion.emotionList.push(num + 1);
            }
            var myTemplate = Handlebars.compile($("#al-tpl-emotion").html());
            t.el.phizList.html(myTemplate(t.data.emotion));
            t.el.emotionBtn.off("click").on("click", function (e) {
                e.stopPropagation();
                t.el.phizList.toggle(400);
                return false;
            });
            $(".cc-chat-emotionItem").off("click").on("click", function (e) {
                e.stopPropagation();
                var item = $(this);
                t.el.personalList.hide(400);
                t.el.phizList.hide(400);
                t.el.chatInput.append("<img class='msg-img' src='" + item.find('img').attr("src") + "'/>");
                return false;
            });
            return t;
        }
    };
    ccLive.init();
});