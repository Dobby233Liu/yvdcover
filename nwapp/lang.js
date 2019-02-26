var langNoChange = true
window.initLang = function(selector)
{
    var toLang = selector.options[selector.options.selectedIndex - 1].value;
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
          
          while(child){
            if(typeof child.aria-translate-context != undefined && !!child.aria-translate-context && $.trim(child.aria-translate-context.trim()) != ""){
                if (child.aria-translate-context == "fluxSponsorParent"){
                    continue;
                }
                if(typeof child.aria-translate-to != undefined && !!child.aria-translate-to && $.trim(child.aria-translate-to) != ""){
                    ((function(){return eval(child.aria-translate-to.replace(/[obj]/g, "child"))})()) = eval(child.aria-translate-context);     
                } else {
                    child.innerHTML = eval(child.aria-translate-context);
                }       
            }
            child = child.nextElementSibling;
          }
      }
    });    
}