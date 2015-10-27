/**!
 * PJAX- Standalone
 *
 * A standalone implementation of Pushstate AJAX, for non-jQuery web pages.
 * jQuery are recommended to use the original implementation at: http://github.com/defunkt/jquery-pjax
 *
 * @version 0.6.1
 * @author Carl
 * @source https://github.com/thybag/PJAX-Standalone
 * @license MIT
 */
(function(){var internal={firstrun:!0,is_supported:window.history&&window.history.pushState&&window.history.replaceState&&!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/),loaded_scripts:[]};if(!internal.is_supported){var pjax_shell={connect:function(){},invoke:function(){var a=2===arguments.length?arguments[0]:arguments.url;document.location=a}};return void("function"==typeof define&&define.amd?define(function(){return pjax_shell}):window.pjax=pjax_shell)}internal.addEvent=function(a,b,c){a.addEventListener(b,c,!1)},internal.clone=function(a){var b={};for(var c in a)b[c]=a[c];return b},internal.triggerEvent=function(a,b,c){var d=document.createEvent("HTMLEvents");d.initEvent(b,!0,!0),"undefined"!=typeof c&&(d.data=c),a.dispatchEvent(d)},internal.addEvent(window,"popstate",function(a){if(null!==a.state){var b={url:a.state.url,container:a.state.container,title:a.state.title,history:!1};if("undefined"!=typeof internal.options)for(var c in internal.options)"undefined"==typeof b[c]&&(b[c]=internal.options[c]);var d=internal.parseOptions(b);if(d===!1)return;internal.handle(d)}}),internal.attach=function(a,b){if(a.protocol===document.location.protocol&&a.host===document.location.host&&!(a.pathname===location.pathname&&a.hash.length>0)){var c=["pdf","doc","docx","zip","rar","7z","gif","jpeg","jpg","png"];"undefined"==typeof b.ignoreFileTypes&&(b.ignoreFileTypes=c),-1===b.ignoreFileTypes.indexOf(a.pathname.split(".").pop().toLowerCase())&&(b.url=a.href,a.getAttribute("data-pjax")&&(b.container=a.getAttribute("data-pjax")),a.getAttribute("data-title")&&(b.title=a.getAttribute("data-title")),b=internal.parseOptions(b),b!==!1&&internal.addEvent(a,"click",function(a){return a.which>1||a.metaKey||a.ctrlKey?void 0:(a.preventDefault?a.preventDefault():a.returnValue=!1,document.location.href===b.url?!1:void internal.handle(b))}))}},internal.parseLinks=function(a,b){var c;c="undefined"!=typeof b.useClass?a.getElementsByClassName(b.useClass):a.getElementsByTagName("a");for(var d,e=0;e<c.length;e++){var f=c[e];("undefined"==typeof b.excludeClass||-1===f.className.indexOf(b.excludeClass))&&(d=internal.clone(b),d.history=!0,internal.attach(f,d))}if(internal.firstrun){for(var g=document.getElementsByTagName("script"),h=0;h<g.length;h++)g[h].src&&-1===internal.loaded_scripts.indexOf(g[h].src)&&internal.loaded_scripts.push(g[h].src);internal.triggerEvent(internal.get_container_node(b.container),"ready")}},internal.smartLoad=function(a,b){var c=a.getElementsByTagName("title")[0].innerHTML;c&&(document.title=c);var d=a.querySelector("#"+b.container.id);return null!==d?d:a},internal.updateContent=function(a,b){var c=document.createElement("div");if(c.innerHTML=a,b.smartLoad&&(c=internal.smartLoad(c,b)),"undefined"==typeof b.title&&(b.title=document.title,!b.smartLoad)){var d=c.getElementsByTagName("title");0!==d.length&&(b.title=d[0].innerHTML)}return b.container.innerHTML=c.innerHTML,b.parseJS&&internal.runScripts(c),b},internal.runScripts=function(html){for(var scripts=html.getElementsByTagName("script"),sc=0;sc<scripts.length;sc++)if(scripts[sc].src&&-1===internal.loaded_scripts.indexOf(scripts[sc].src)){var s=document.createElement("script");s.src=scripts[sc].src,document.head.appendChild(s),internal.loaded_scripts.push(scripts[sc].src)}else eval(scripts[sc].innerHTML)},internal.handle=function(a){internal.triggerEvent(a.container,"beforeSend",a),internal.request(a.url,function(b){return b===!1?(internal.triggerEvent(a.container,"complete",a),void internal.triggerEvent(a.container,"error",a)):(a=internal.updateContent(b,a),a.history&&(internal.firstrun&&(window.history.replaceState({url:document.location.href,container:a.container.id,title:document.title},document.title),internal.firstrun=!1),window.history.pushState({url:a.url,container:a.container.id,title:a.title},a.title,a.url)),a.parseLinksOnload&&internal.parseLinks(a.container,a),internal.triggerEvent(a.container,"complete",a),internal.triggerEvent(a.container,"success",a),a.autoAnalytics&&a.history&&(window._gaq&&_gaq.push(["_trackPageview"]),window.ga&&ga("send","pageview",{page:a.url,title:a.title})),document.title=a.title,void(a.returnToTop&&window.scrollTo(0,0)))})},internal.request=function(a,b){var c;try{c=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP")}catch(d){return void console.log("Unable to create XMLHTTP Request")}c.onreadystatechange=function(){4===c.readyState&&200===c.status?b(c.responseText):4!==c.readyState||404!==c.status&&500!==c.status||b(!1)},c.open("GET",a+(/[?&]/.test(a)?"&_pjax":"?_pjax"),!0),c.setRequestHeader("X-PJAX","true"),c.setRequestHeader("X-Requested-With","XMLHttpRequest"),c.send(null)},internal.parseOptions=function(a){var b={history:!0,parseLinksOnload:!0,smartLoad:!0,autoAnalytics:!0,returnToTop:!0,parseJS:!1};if("undefined"==typeof a.url||"undefined"==typeof a.container||null===a.container)return console.log("URL and Container must be provided."),!1;for(var c in b)"undefined"==typeof a[c]&&(a[c]=b[c]);a.history=a.history===!1?!1:!0,a.container=internal.get_container_node(a.container);var d=["ready","beforeSend","complete","error","success"];for(var e in d){var f=d[e];"function"==typeof a[f]&&internal.addEvent(a.container,f,a[f])}return a},internal.get_container_node=function(a){return"string"==typeof a&&(a=document.getElementById(a),null===a)?(console.log("Could not find container with id:"+a),!1):a},this.connect=function(){var a={};2===arguments.length&&(a.container=arguments[0],a.useClass=arguments[1]),1===arguments.length&&("string"==typeof arguments[0]?a.container=arguments[0]:a=arguments[0]),delete a.title,delete a.history,internal.options=a,"complete"===document.readyState?internal.parseLinks(document,a):internal.addEvent(window,"load",function(){internal.parseLinks(document,a)})},this.invoke=function(){var a={};2===arguments.length?(a.url=arguments[0],a.container=arguments[1]):a=arguments[0],a=internal.parseOptions(a),a!==!1&&internal.handle(a)};var pjax_obj=this;"function"==typeof define&&define.amd?define(function(){return pjax_obj}):window.pjax=pjax_obj}).call({});
