var langNoChange = true
window.initLang = function(selector)
{
    var toLang = selector.options[selector.options.selectedIndex].value;
    console.log(toLang)
    if(toLang == "en" && langNoChange) return;
    langNoChange = false;
    jQuery.i18n.properties({
      name:'index', 
      path:'lang/', 
      mode:'both',
      language:toLang,
      async: true,
      callback: function() {
          // the basic system was here
          
          document.title = title;
          
          var child = document.body.firstElementChild;
          
          var childJq = $(child);
          
          while(child){
            if(typeof child.getAttribute("translate-context") != undefined && !!child.getAttribute("translate-context") && $.trim(child.getAttribute("translate-context")) != ""){
                console.log(child.getAttribute("translate-context"));
                if (child.getAttribute("translate-context") == "fluxSponsorParent"){
                    continue;
                }
                if(typeof child.getAttribute("translate-to") != undefined && !!child.getAttribute("translate-to") && $.trim(child.getAttribute("translate-to")) != ""){
                    console.log(child.getAttribute("translate-to"));
                    ((function(){return eval(child.getAttribute("translate-to").replace(/[obj]/g, "child"))})()) = eval(child.getAttribute("translate-context"));     
                } else {
                    child.innerHTML = eval(child.getAttribute("translate-context"));
                }       
            }
            child = child.nextElementSibling;
            var childJq = $(child);
          }
      }
    });    
}