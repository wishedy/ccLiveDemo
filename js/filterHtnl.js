/*
* create By ZhangHeng on 2018/1/16
*/

/*
var str = "<span>11111</span>2222<img src='1.jpg'>11111<img src='2.jpg'><img src='3.jpg'>";
var str1 = '<div><img id="img1" src="images/picture1.png" onclick="change()">234</div>';
var reTag = /<img(?:.|\s)*?>/g;
function delHtmlTag(str)
{
    return str.replace(/<\/?.+?>/g,"");//去掉所有的html标记
}
var machResult = str.match(reTag);
if(machResult.length){
    for(var num =0;num<machResult.length;num++){
        var l = machResult[num];
        str = str.replace(l ,"$"+l +'$');
    }
}
console.log((str.replace(/\$+/g,"$")).split("$"));
console.log(str);*/
var str = '[img/emotion/qqexpression/7.gif]1111[img/emotion/qqexpression/20.gif]1111[img/emotion/qqexpression/1.gif]';
console.log(str.replace(/\[/g,'[]').replace(/\[\]/g,'&').replace(/\]/g,'[]').replace(/\[\]/g,'&'));
