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
          
          var every = $("[translate-context]")
          
          var child = null;
          
          for(z = 0; z<every.length - 1; z++){
            child = every[z]
            console.log(child.attr("translate-context"));
            if (child.attr("translate-context") == "fluxSponsorParent"){
              continue;
            }
            if($.trim(child.attr("translate-to")) != ""){
              console.log(child.attr("translate-to"));
              eval(child.attr("translate-to").replace(/obj/g, "child") + " = eval(child.attr(\"translate-context\"))");    
            } else {
              child.html = eval(child.attr("translate-context"));
            }       
          }
      }
    });    
}