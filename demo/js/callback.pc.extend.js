/**
 * Created by shanglt on 15/12/10.
 */
$(function () {
    Template.init();
});

var datas = [];
function on_cc_live_player_load(){
    //console.log('load');
    //var img = "<img src='" + datas[1].url  + "' >";
    //$('#chat-list').append(img);
}

// 接收全部聊天信息
// function on_cc_live_chat_msg(data) {
//    $('#chat-list').append(Template.chatMsg({
//        name: data.username,
//        content: showEm(data.msg)
//    }));
//
//    chatScroll();
// }

// 同步接收聊天信息
function on_cc_live_chat_msg_sync(datas) {
    var cmHtml = '';
    $.each(datas, function (index, data) {
        cmHtml += Template.chatMsg({
            name: data.username,
            content: showEm(data.msg)
        });
    });

    var rc = $('#chat-list').children().length - 500 + datas.length;
    if (rc > 0) {
        $('#chat-list> li:lt(' + rc + ')').remove();
    }

    $('#chat-list').append(cmHtml);

    chatScroll();
}

// 接收发送私聊
function on_cc_live_chat_private_question(data) {
    $("#chat-list").append(Template.privateChatMsg({
        fromUserName: data.username,
        toUserName: '管理员',
        content: showEm(data.msg)
    }));

    chatScroll();
}

// 接收回答私聊
function on_cc_live_chat_private_answer(data) {
    $("#chat-list").append(Template.privateChatMsg({
        fromUserName: '管理员',
        toUserName: data.tousername,
        content: showEm(data.msg)
    }));

    chatScroll();
}

// 提问
function on_cc_live_qa_question(data) {
    var question = data.value;
    // if (question.isPublish != 1) {
    //     return;
    // }

    $("#qas").append(Template.question({
        id: question.id,
        questionUserId: question.userId,
        questionUserName: question.userName,
        content: question.content
    }));

    qaScroll();
}

// 回答
function on_cc_live_qa_answer(data) {

    var answer = data.value;
    // 私密回答只能自己看
    if (answer.isPrivate) {
        return;
    }

    $("#" + answer.questionId).append(Template.answer({
        answerUserName: answer.userName,
        content: answer.content
    }));

    qaScroll();
}

function on_cc_callback_pages(data){
    //{
    //    "time": 11,  图片时间
    //    "url": "http://image.csslcloud.net/image/3CD4C4DF4DF8E0CB9C33DC5901307461/73D088D5AC02E6B1/0.jpg",  图片地址
    //    "docId": "73D088D5AC02E6B1",  文档ID
    //    "docName": "英语.pptx",  文档名称
    //    "docTotalPage": 11,  文档总页数
    //    "pageNum": 0,  当前页码
    //    "encryptDocId": "73D088D5AC02E6B1",  文档ID
    //    "useSDK": false
    //}
    console.log(data);
    datas = data;
}

var Template = {
    init: function () {
        if($("#chatMsgTemplate").length){
            this.chatMsg = Handlebars.compile($("#chatMsgTemplate").html());
        }
        if($("#privateChatMsgTemplate").length){
            this.privateChatMsg = Handlebars.compile($("#privateChatMsgTemplate").html());
        }
        if($("#questionTemplate").length){
            this.question = Handlebars.compile($("#questionTemplate").html());
        }
        if($("#answerTemplate").length){
            this.answer = Handlebars.compile($("#answerTemplate").html());
        }
    }
};


var Viewer = {
    id: $('#viewerId').val(),
    name: $('#viewerName').val(),
    role: $('#viewerRole').val(),
    sessionId: $.cookie('sessionid'),
    isMe: function (viwerId) {
        return viwerId == this.id;
    }
};

function chatScroll() {
    $("#chat-list").parent().scrollTop($("#chat-list").height());
}

function qaScroll() {
    $("#qas").parent().scrollTop($("#qas").height());
}