// https://gist.github.com/yangshun/9892961
// modifed
window.parseVideo = function (url) {
    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|dailymotion.com)\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
    if (RegExp.$3.indexOf('youtu') > -1) {
        var type = 'youtube';
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
        var type = 'vimeo';
    } else if (RegExp.$3.indexOf('dailymotion') > -1) {
        var type = 'dailymotion';
    }

    return {
        type: type,
        id: RegExp.$6
    };
}

// by myself
window.hyperId = function(w, ytu){
    if (ytu.indexOf('youtu') > -1 || ytu.indexOf('vimeo') > -1 || ytu.indexOf('dailymotion') > -1) return w.parseVideo(ytu);
    return {id: ytu, type: "youtube"};
}

window.getVideoThumbnail = function (w, url, cb) {
    // Obtains the video's thumbnail and passed it back to a callback function.
    var videoObj = w.hyperId(w, url);
    if (videoObj.type == 'youtube') {
        cb('https://i.ytimg.com/vi/' + videoObj.id + '/maxresdefault.jpg');
    } else if (videoObj.type == 'vimeo') {
        // Requires jQuery
        w.$.get('https://vimeo.com/api/v2/video/' + videoObj.id + '.json', function(data) {
            cb(data[0].thumbnail_large);
        });
    } else if (videoObj.type == 'dailymotion') {
        cb('https://www.dailymotion.com/thumbnail/video/' + videoObj.id);
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
    }
    return $iframe;
}

// __index
window.ytImgContId = "resultImg";
window.tipId = "tip";
window.ytIdId = "ytId";
window.ifrId = "myIfr";
window.sfId = "sfSponsor";

window.doRefresh = function(w){
    var ytImgEle = w.document.getElementById(w.ytImgContId);
    var tipEle = w.document.getElementById(w.tipId);
    var ytIEle = w.document.getElementById(w.ytIdId);
    w.getVideoThumbnail(w, ytIEle.value, function(f){
        ytImgEle.src = f;
        ytImgEle.style.display = "block";
        tipEle.style.display = "block";
    });
    return false;
}
window.doClear = function(w){
    var tipEle = w.document.getElementById(w.tipId);
    var ytImgEle = w.document.getElementById(w.ytImgContId);
    ytImgEle.style.display = "none";
    tipEle.style.display = "none";
    w.document.getElementById(w.ifrId).src = "https://example.com";
    return true;
}

window.watchVideoEx = function(w){
    window.createVideo2(w, w.document.getElementById(w.ytIdId).value, w.document.getElementById(w.ifrId));
    return true;
}

window.sfJump = function(w){
    var ytIEle = w.document.getElementById(w.ytIdId);
    if (ytIEle.value != ""){
        window.open("https://savefrom.net/" + ytIEle.value, "_blank");
        return false;
    }else{
        return true;
    }
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