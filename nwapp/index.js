// https://gist.github.com/yangshun/9892961
// modifed
window.parseVideo = function (url) {
    url.match(/(http:|https:|)\/\/(player.|www.|m.|wap.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|dailymotion\.com|bilibili\.com|b23\.tv)\/(video\/|embed\/|watch\?v=|v\/|read\/)?([A-Za-z0-9._%-]*)(&\S+)?/);
    if (RegExp.$3.indexOf('youtu') > -1) {
        var type = 'youtube';
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
        var type = 'vimeo';
    } else if (RegExp.$3.indexOf('dailymotion') > -1) {
        var type = 'dailymotion';
    } else if (RegExp.$3.indexOf('bilibili') > -1||RegExp.$3.indexOf('b23') > -1) {
        if (RegExp.$6.indexOf("bv")>-1){var type="bilibili-bv";}else{var type = 'bilibili';}
    }

    return {
        type: type,
        id: RegExp.$6
    };
}

// by myself
window.hyperId = function(w, ytu){
    if (ytu.indexOf('youtu') > -1 || ytu.indexOf('vimeo') > -1 || ytu.indexOf('dailymotion') > -1 || ytu.indexOf('bilibili') > -1||ytu.indexOf('b23') > -1) return w.parseVideo(ytu);
    if(ytu.indexOf('av')>-1||ytu.indexOf('cv')>-1||ytu.indexOf('AV')>-1||ytu.indexOf('CV')>-1) return {id: ytu, type: "bilibili"};
	if(ytu.indexOf('bv')>-1||ytu.indexOf('BV')>-1) return {id: ytu, type: "bilibili-bv"};
    return {id: ytu, type: "youtube"};
}

window.getVideoThumbnail = function (w, url, cb) {
    // Obtains the video's thumbnail and passed it back to a callback function.
    var videoObj = w.hyperId(w, url);
    if (videoObj.type == 'youtube') {
        cb('https://i.ytimg.com/vi/' + videoObj.id + '/maxresdefault.jpg');
    } else if (videoObj.type == 'vimeo') {
        // Requires jQuery
        w.$.get('https://vimeo.com/api/v2/video/' + videoObj.id + '.json', function(data, status/**, jxhr**/) {
            if (status == "success") cb(data[0].thumbnail_large);
            else cb("https://via.placeholder.com/640x480.png/000000/444444?text=Cover%20Not%20Found%20(vimeo)");
        });
    } else if (videoObj.type == 'dailymotion') {
        cb('https://www.dailymotion.com/thumbnail/video/' + videoObj.id);
    } else if (videoObj.type == 'bilibili'||videoObj.type == 'bilibili-bv') {
        if (videoObj.id.indexOf('av') > -1||videoObj.type == 'bilibili-bv'){
          w.$.ajax({              
              type: 'GET',
              url: 'https://api.bilibili.com/x/web-interface/view?'+(videoObj.type == 'bilibili-bv'?"bvid":"aid")+'=' + (videoObj.type == 'bilibili'?videoObj.id.replace("av",""):videoObj.id) + "&jsonp=jsonp",
              dataType: "jsonp",
              jsonp: "callback",
              success: function(data){
                  console.info(data);
                  if (data.code == 0){
                      cb(data.data.pic.replace("http://", "https://"));
                  } else {
                      console.error("data.code = " + data.code);
                      cb("https://via.placeholder.com/640x480.png/000000/444444?text=Cover%20Not%20Found%20(bilibili)");
                  }
              },
              error: function(jqxhr, status, err){
                  console.error(err);
                  cb("https://via.placeholder.com/640x480.png/000000/444444?text=Cover%20Not%20Found%20(bilibili)");
              }
          });
        } else if (videoObj.id.indexOf('cv') > -1) {
          w.$.ajax({              
              type: 'GET',
              url: 'https://api.bilibili.com/x/article/viewinfo?id=' + videoObj.id.replace("cv",""),
              dataType: "json",
              crossDomain: true,
              success: function(data){
                  if (data.code == 0)
                  {
                    cb(data.data.banner_url);
                  }
                  else {
                    console.error(data.code);
                    cb("https://via.placeholder.com/640x480.png/000000/444444?text=Cover%20Not%20Found%20(bilibili%20article)");
                  } 
              },
              error: function(jqxhr, status, err){
                  console.error(err);
                  cb("https://via.placeholder.com/640x480.png/000000/444444?text=Cover%20Not%20Found%20(bilibili%20article)");
              }
          });  
        }
    }
}

window.createVideo = function(w, url, width, height) {
    // Returns an iframe of the video with the specified URL.
    var $iframe = w.$('<iframe>', { width: width, height: height });
    $iframe.attr('frameborder', 0);
    return window.createVideo2(w, url, $iframe, true);
}

window.createVideo2 = function(w, url, ifr, jq = false) {
    // Returns an iframe of the video with the specified URL, but the iframe precreated
    var videoObj = w.hyperId(w, url);
    var $iframe = (jq?ifr:w.$(ifr));
    if (videoObj.type == 'youtube') {
        $iframe.attr('src', 'https://www.youtube.com/embed/' + videoObj.id);
    } else if (videoObj.type == 'vimeo') {
        $iframe.attr('src', 'https://player.vimeo.com/video/' + videoObj.id);
    } else if (videoObj.type == 'dailymotion') {
        $iframe.attr('src', 'https://www.dailymotion.com/embed/video/' + videoObj.id);
    } else if (videoObj.type == 'bilibili' || videoObj.type == 'bilibili-bv') {
        // normal: https://player.bilibili.com/player.html?aid=44479907&cid=77871619&page=1
        // case in control panel: https://player.bilibili.com/blackboard/html5player.html?aid=41120791&cid=233&wmode=transparent&as_wide=1&crossDomain=1
        $iframe.attr('src', 'https://player.bilibili.com/blackboard/html5player.html?aid=' + (videoObj.type == 'bilibili'?videoObj.id.replace("av", ""):window.bv.decode(videoObj.id)) + "&wmode=transparent&crossDomain=1&page=1");
        
        if (videoObj.type == 'bilibili' && videoObj.id.indexOf('cv') > -1) {
            $iframe.attr('src', 'https://www.bilibili.com/read/mobile/' + videoObj.id.replace("cv", ""));
        }    
    }
    return $iframe;
}

// __index
window.ytImgContId = "resultImg";
window.ytIdId = "ytId";
window.ifrId = "myIfr";
window.sfId = "sfSponsor";

window.doRefresh = function(w){
    try{
		var ytImgEle = w.document.getElementById(w.ytImgContId);
		var ytIEle = w.document.getElementById(w.ytIdId);
		w.getVideoThumbnail(w, ytIEle.value, function(f){
			ytImgEle.src = f;
			ytImgEle.style.display = "block";
			w.document.getElementById(w.ifrId).src = "about:blank";
			w.document.getElementById(w.ifrId).style.display="none";
		});
    return false;
    }catch(e){
		alert(e.stack);
		return true;
    }
	// return true; /// @codefactor UNREACHABLE
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
