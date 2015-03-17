function time_format(now) {
    var year = now.getFullYear();
    var month = (now.getMonth() + 1).toString();
    var day = (now.getDate()).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    return {
        year: year,
        month: month,
        day: day
    };
}
/**
 * 转译标签
 * @param str
 * @returns string
 */
function escape2Html(str) {
    var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
        return arrEntities[t];
    });
}
/**
 *获取RSS新闻
 *
 * @param url
 * @param num
 * @param callback
 */
function getRss(url, num,date, callback) {
    var options = $.extend({'sort': 0, 'sub': 0}, num);
    $.get(url, function (data) {
        var host_arr = url.split('/');
        var domain = host_arr[0] + '/' + host_arr[1] + '/' + host_arr[2];
        var item = $(data).find('item');
        var title = [];
        var link = [];
        var description = [];
        var pubDate = [];
        item.each(function (i) {
            var start_time = 0;
            if (date) {
                var hash = date.split('-');
                start_time = new Date(hash[0], hash[1], hash[2]).getTime();
            } else {
                var now = time_format(new Date());
                start_time = new Date(now.year, now.month, now.day).getTime();
            }

            var time = new Date($(this).find('pubDate').html());
            var rss_time = time_format(time);
            var update_time = new Date(rss_time.year, rss_time.month, rss_time.day).getTime();
            if (update_time >= start_time) {
                pubDate.push(rss_time.year + '-' + rss_time.month + '-' + rss_time.day);
                title.push($(this).find('title').html());
                link.push($(this).find('link').html());
                var re = /<content:encoded[^>]+><\!\[CDATA\[([\s\S]+)\]\]><\/content:encoded>/;
                var html = $(this).html();
                var desc = html.match(re);
                var description_str = '';
                if (desc && desc[1]) {
                    description_str = desc[1];

                    description_str = description_str.replace(/src=\"\//ig, 'src="' + domain + '/');
                    description.push(description_str);
                }
                if (!desc) {
                    var description_str = $($(this).find('description')).html();
                    if (description_str) {
                        description_str = description_str.replace('<![CDATA[', '');
                        description_str = description_str.replace(']]>', '');
                        description_str = escape2Html(description_str);
                        description_str = description_str.replace(/src=\"\//ig, 'src="' + domain + '/');

                        description.push(description_str);
                    }
                }
            }
        });
        callback({
            url: url,
            sort: options.sort,
            sub: options.sub,
            title: title,
            link: link,
            description: description,
            pubDate: pubDate
        });
    });
}

//DOM节点处理
var urls = {
    'ued': [
        'http://cued.xunlei.com/feed',//迅雷CUED
        "http://tid.tenpay.com/?feed=rss2",//腾讯财付通TID
        'http://www.alloyteam.com/?feed=rss2',//腾讯Web前端 Alloy 团队
        //"http://feed.feedsky.com/wsdued",//腾讯移动互联网设计WSD

        'http://isux.tencent.com/feed',//腾讯ISUX
        'http://cdc.tencent.com/?feed=rss2',//腾讯CDC
        "http://uxc.360.cn/feed",//360UXC
        "http://www.75team.com/feed",//奇舞团
        "http://mux.alimama.com/?feed=rss2",//阿里妈妈MUX
        "http://mued.sohu.com/feed/",//搜狐MUED搜狐MUED
        "http://ued.focus.cn/wordpress/?feed=rss2",//搜狐焦点UED
        "http://ued.ctrip.com/blog/?feed=rss2",//携程UED
        "http://udc.weibo.com/feed/",//微博UDC
        "http://ued.sina.com.cn/?feed=rss2",//新浪UED
        "http://www.aliued.cn/feed",//阿里巴巴（中国站）用户体验设计部
        "http://kux.kingdee.com/?feed=rss2",//"有意思"的用户体验团队
        "http://ued.baidu.com/?feed=rss2",//百度搜索用户体验中心
        "http://mux.baidu.com/?feed=rss2",//百度移动用户体验部
        "http://uedc.163.com/feed",//网易用户体验设计中心
        "http://mweb.baidu.com/feed",//MWEB 百度移动云前端
        "http://qqfe.org/feed/",//腾讯网前端团队
        "http://gux.163.com/feed",//网易GUX游戏用户体验中心
        "http://fex.baidu.com/feed.xml",//FEX 百度 Web 前端研发部
        "http://jdc.jd.com/feed",//京东设计中心

        //'http://www.wxwdesign.com/feed',
        'http://forcefront.com/feed/',
        'http://www.css88.com/feed',
        'http://mweb.baidu.com/?feed=rss2',
        'http://www.qianduan.net/feed',
        //'http://sofish.de/feed',
        'http://www.zhangxinxu.com/wordpress/feed/',
        'http://fex.baidu.com/feed.xml',
        'http://feed.cnblogs.com/blog/u/101461/rss',
        'http://www.itzhai.com/feed',

        'http://blog.19ued.com/?feed=rss2',
        'http://www.36ria.com/feed/'
    ],

    'seo': [
        'http://www.semyj.com/feed',
        'http://blog.sina.com.cn/rss/2125736794.xml',
        'http://www.seozac.com/feed/'
    ]
};
function addHtml(time){
    var $wraper = $('.wraper');
    $wraper.html('');
    for (var m in urls) {
        for (var i = 0, len = urls[m].length; i < len; i++) {
            getRss(urls[m][i], {sort: m, sub: i}, time,function (data) {
                if (data.sort && !data.sub) {
                    //var h1 = $('<h1/>').html(data.sort);
                    //$wraper.append(h1);
                }
                var item_len = data.title.length;
                if (item_len == 0) {
                    return;
                }
                var h2 = $('<h3/>').html(data.url);
                var ol = $('<ol/>');
                for (var j = 0; j < item_len; j++) {
                    var a = $('<a/>');
                    a.html(data.title[j]).attr('href', '#' + data.link[j]).data(data.description[j]);

                    var li = $('<li/>');
                    li.append(a);
                    li.append(' (' + data.pubDate[j] + ')' + ' <a href="' + data.link[j] + '" target="_blank">原文</a>');
                    ol.append(li);
                    //事件处理
                    (function (x) {
                        a.click(function () {
                            var sub = $(this).parent().find('.sub-item')[0];
                            if (!sub) {
                                $('.sub-item').hide();

                                console.log(data.description[x]);
                                $(this).parent().append($('<div/>').addClass('sub-item').html(data.description[x]));
                            } else {
                                $(sub).toggle();
                            }
                        });
                    })(j);
                }
                $wraper.append(h2);
                $wraper.append(ol);
            });
        }
    }
}
addHtml(0);
var date=new Date();
$('#datepickerInput').val(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'至'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
var calendar=new Calendar({
    id:'#datepickerInput',
    isPopup: 1,
    isPrevBtn: 1,
    isNextBtn: 1,
    isCloseBtn: 1,
    count: 2,
    monthStep: 1,
    isHoliday: 1,
    isHolidayTips: 1,
    isReadonly: 0,
    isDateInfo: 1,
    isSelect: 0,
    isquickselect: 1,
    weekstart: 7,
    rangeday:100,
    submit:function(val){
        var time=val.split('至')[0];
        addHtml(time);
    }
});//实例化日期