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
            if(typeof child.getAttribute("aria-translate-context") != undefined && !!child.getAttribute("aria-translate-context") && $.trim(child.getAttribute("aria-translate-context")) != ""){
                if (child.aria-translate-context == "fluxSponsorParent"){
                    continue;
                }
                if(typeof childJq.getAttribute("aria-translate-to") != undefined && !!child.getAttribute("aria-translate-to") && $.trim(child.getAttribute("aria-translate-to")) != ""){
                    ((function(){return eval(child.getAttribute("aria-translate-to").replace(/[obj]/g, "child"))})()) = eval(child.getAttribute("aria-translate-context"));     
                } else {
                    child.innerHTML = eval(child.getAttribute("aria-translate-context"));
                }       
            }
            child = child.nextElementSibling;
            var childJq = $(child);
          }
      }
    });    
}