# CC直播
> ### 简介
***
CC视频成立于2005年主要实现视频、直播，业务主要有点播、直播、课堂，合作新东方、清华大学、好医生、凤凰网等
***
> ### 开启web端视频直播的使用流程

+ 首先注册登录CC直播账号，[登录地址](http://admin.bokecc.com/index/user.bo)
+ 使用用户只能体验视频播放器无权体验直播，付费后直接可以开启直播
+ 点击图中所示位置,开始创建一个视频直播
+ 然后点击++创建直播间++
+ 输入直播间相关信息，最后点击保存信息，这时候直播间就创建完成
+ 这里需要注意的是讲师、助教、观众的登录密码，尤其是观众登录方式
+ 创建完这时候需要在电脑下载一个CC直播客户端，用来供直播端的用户使用
+ 点击管理项里的++链接++，点击++复制客户端登录链接++，这个链接很重要链接格式++https://view.csslcloud.net/api/view/lecturer?roomid=C837DF69777B32DC9C33DC5901307461&userid=0438CD3A0AB20794++，电脑客户端通过打开该链接后的下载按钮下载，下载安装完后在电脑桌面并没有看到CC直播的快捷方式，保持淡定，这时候只需要点击以上链接界面的++点击启动++按钮即可启动程序，输入账号密码，账号是以上链接中的userId后的值，密码是在创建直播房间是用户自己设置的直播讲师密码。
+ CC直播单独提供了助教和观众的观看链接，也在直播间管理的点击++链接++后的里面，直接打开即可，如果之前直播间设置过密码没需要输入密码
> ### 引入web端
+ 首先要做的是创建一个项目文件，并且保证项目在服务器环境下运行，localhost可以
+ 必须引入的文件jq库，再有一个是CC提供的js库
+ ### JS
```javascript
<script src="//view.csslcloud.net/js/jquery-1.9.0.min.js" type="text/javascript"></script>
<script src="//view.csslcloud.net/js/liveSDK.js" type="text/javascript"></script>
//然后在自己的逻辑代码中初始化一下

<script type="text/javascript">
    DWLive.init({
        userid: 'userid',//讲师Id,必填项，就是上文客户端连接中的userId
        roomid: 'roomid',//通userId理
        viewername: 'name',//描述内容，自编
        viewertoken: 'token',//视情况，自编，
        viewercustomua: 'web'//视情况，自编
    });
</script>
```
+ ### HTML
```html
<!--如果在页面想看到视频直播-->
<div id="livePlayer"></div>
<!--如果在页面想看到文档直播-->
<div id="drawPanel"></div>
```
+ ### css
```css
 //不需要引用任何css文件，具体的样式实现以及交互，例如文档和视频的切换等，根据自己需要实现
```
+ ### 注意
```
CC不建议将直播嵌入【iframe】中使用，因为使用iframe方式将直播页面嵌入到网站后，使用微信或Safari浏览器访问时无法登录，尽管有解决办法引入
<script src="//view.csslcloud.net/js/_fix.js"></script>，但是仍然不建议做iframe嵌入
```
+ 具体的引用参考[WEB-API-文档](http://doc.bokecc.com/live/dev/websdk/)
+ cc直播官网提供的[注意事项](http://doc.bokecc.com/live/faq/)参见文档
> ### M端
+ M端采用的是video标签播放，PC端使用的是flash播放，M端测试不能在PC模拟器上进行，必须在真机上，且不能自动播放，其余引用方式和PC端无分别