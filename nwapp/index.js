// https://gist.github.com/yangshun/9892961
// modifed
window.parseVideo = function (url) {
    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|dailymotion.com|bilibili\.com)\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
    if (RegExp.$3.indexOf('youtu') > -1) {
        var type = 'youtube';
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
        var type = 'vimeo';
    } else if (RegExp.$3.indexOf('dailymotion') > -1) {
        var type = 'dailymotion';
    } else if (RegExp.$3.indexOf('bilibili') > -1) {
        var type = 'bilibili';
    }

    return {
        type: type,
        id: RegExp.$6
    };
}

// by myself
window.hyperId = function(w, ytu){
    if (ytu.indexOf('youtu') > -1 || ytu.indexOf('vimeo') > -1 || ytu.indexOf('dailymotion') > -1 || ytu.indexOf('bilibili') > -1) return w.parseVideo(ytu);
    return {id: ytu, type: "youtube"};
}

window.getVideoThumbnail = function (w, url, cb) {
    // Obtains the video's thumbnail and passed it back to a callback function.
    var videoObj = w.hyperId(w, url);
    if (videoObj.type == 'youtube') {
        cb('https://i.ytimg.com/vi/' + videoObj.id + '/maxresdefault.jpg');
    } else if (videoObj.type == 'vimeo') {
        // Requires jQuery
        w.$.get('https://vimeo.com/api/v2/video/' + videoObj.id + '.json', function(data, status, jxhr) {
            if (status == "200") cb(data[0].thumbnail_large);
            else cb("https://via.placeholder.com/640x480.png/000000/444444?text=Cover%20Not%20Found%20(vimeo)");
        });
    } else if (videoObj.type == 'dailymotion') {
        cb('https://www.dailymotion.com/thumbnail/video/' + videoObj.id);
    } else if (videoObj.type == 'bilibili') {
        // sorry to galmoe.com maintainers
        // this one is strange, so i use $.ajax
        w.$.ajax({
            url: 'https://www.galmoe.com/t.php?aid=' + videoObj.id,
            // responseType: 'text/html',
            statusCode: {
                404: function(){
                    console.err("statusCode = 404");
                    cb("https://via.placeholder.com/640x480.png/000000/444444?text=Cover%20Not%20Found%20(bilibili)");
                }
            },
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': '*',
            },
            success: function(data){
                if (data/**[0]**/.result == 1){
                    cb(data/**[0]**/.url);
                } else {
                    console.err("data.result = " + data/**[0]**/.result);
                    cb("https://via.placeholder.com/640x480.png/000000/444444?text=Cover%20Not%20Found%20(bilibili)");
                }
            }, 
            dataType: "jsonp",
            // jsonp: false,
            crossDomain: true,
            cache: false
        });
    }
}

window.createVideo = function(w, url, width, height) {
    // Returns an iframe of the video with the specified URL.
    var videoObj = w.hyperId(w, url);
    var $iframe = w.$('<iframe>', { width: width, height: height });
    $iframe.attr('frameborder', 0);
    if (videoObj.type == 'youtube') {
        $iframe.attr('src', 'https://www.youtube.com/embed/' + videoObj.id);
    } else if (videoObj.type == 'vimeo') {
        $iframe.attr('src', 'https://player.vimeo.com/video/' + videoObj.id);
    } else if (videoObj.type == 'dailymotion') {
        $iframe.attr('src', 'https://www.dailymotion.com/embed/video/' + videoObj.id);
    } else if (videoObj.type == 'bilibili') {
        // normal: https://player.bilibili.com/player.html?aid=44479907&cid=77871619&page=1
        // case in control panel: https://player.bilibili.com/blackboard/html5player.html?aid=41120791&cid=233&wmode=transparent&as_wide=1&crossDomain=1
        $iframe.attr('src', 'https://player.bilibili.com/player.html?aid=' + videoObj.id.replace("av", "") + "&crossDomain=1&as_wide=1&page=1");
    }
    return $iframe;
}

window.createVideo2 = function(w, url, ifr) {
    // Returns an iframe of the video with the specified URL, but the iframe precreated
    var videoObj = w.hyperId(w, url);
    var $iframe = w.$(ifr);
    // $iframe.attr('frameborder', 0);
    if (videoObj.type == 'youtube') {
        $iframe.attr('src', 'https://www.youtube.com/embed/' + videoObj.id);
    } else if (videoObj.type == 'vimeo') {
        $iframe.attr('src', 'https://player.vimeo.com/video/' + videoObj.id);
    } else if (videoObj.type == 'dailymotion') {
        $iframe.attr('src', 'https://www.dailymotion.com/embed/video/' + videoObj.id);
    } else if (videoObj.type == 'bilibili') {
        $iframe.attr('src', 'https://player.bilibili.com/player.html?aid=' + videoObj.id.replace("av", "") + "&crossDomain=1&as_wide=1&page=1");
    }
    return $iframe;
}

// __index
window.ytImgContId = "resultImg";
window.ytIdId = "ytId";
window.ifrId = "myIfr";
window.sfId = "sfSponsor";

window.doRefresh = function(w){
    var ytImgEle = w.document.getElementById(w.ytImgContId);
    var ytIEle = w.document.getElementById(w.ytIdId);
    w.getVideoThumbnail(w, ytIEle.value, function(f){
        ytImgEle.src = f;
        ytImgEle.style.display = "block";
        w.document.getElementById(w.ifrId).src = "about:blank";
        w.document.getElementById(w.ifrId).style.display="none";
    });
    return false;
}
window.doClear = function(w){
    var ytImgEle = w.document.getElementById(w.ytImgContId);
    ytImgEle.style.display = "none";
    w.document.getElementById(w.ifrId).src = "about:blank";
    w.document.getElementById(w.ifrId).style.display="none";
    return true;
}

window.watchVideoEx = function(w){
    w.document.getElementById(w.ifrId).style.display="block";
    w.document.getElementById(w.ytImgContId).style.display="none";
    window.createVideo2(w, w.document.getElementById(w.ytIdId).value, w.document.getElementById(w.ifrId));
    return true;
}

window.uglyIdChangeResolve = function(w){
    var ytIEle = w.document.getElementById(w.ytIdId);
    var sfEle = w.document.getElementById(w.sfId);
    if (ytIEle.value != ""){
        sfEle.href = "https://savefrom.net/" + ytIEle.value;
        return false;
    }else{
        sfEle.href = "https://savefrom.net/";
    }
    return true;
}