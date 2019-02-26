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
            if(typeof childJq.attr("aria-translate-context") != undefined && !!childJq.attr("aria-translate-context") && $.trim(childJq.attr("aria-translate-context")) != ""){
                if (child.aria-translate-context == "fluxSponsorParent"){
                    continue;
                }
                if(typeof childJq.attr("aria-translate-to") != undefined && !!childJq.attr("aria-translate-to") && $.trim(childJq.attr("aria-translate-to")) != ""){
                    ((function(){return eval(childJq.attr("aria-translate-to").replace(/[obj]/g, "child"))})()) = eval(childJq.attr("aria-translate-context"));     
                } else {
                    child.innerHTML = eval(childJq.attr("aria-translate-context"));
                }       
            }
            child = child.nextElementSibling;
            var childJq = $(child);
          }
      }
    });    
}