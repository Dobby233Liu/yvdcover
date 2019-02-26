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
          
          var every = document.querySelectorAll("[translate-context]")
          
          var child = null;
          
          for(z = 0; z<every.length - 1; z++){
            child = every[z]
            console.log(child.getAttribute("translate-context"));
            if (child.getAttribute("translate-context") == "fluxSponsorParent"){
              continue;
            }
            if($.trim(child.getAttribute("translate-to")) != ""){
              console.log(child.getAttribute("translate-to"));
              (eval(child.getAttribute("translate-to").replace(/obj/g, "child"))) = eval(child.getAttribute("translate-context"));     
            } else {
              child.innerHTML = eval(child.getAttribute("translate-context"));
            }       
          }
      }
    });    
}