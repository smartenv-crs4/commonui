
/*List of all javascript used in header. If you need more js populate this list*/
function createScriptList(){
    var jsList=[];
    jsList.push(config.commonUIUrl + '/assets/plugins/jquery/jquery.min.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/jquery/jquery-migrate.min.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/bootstrap/js/bootstrap.min.js');


    // jsList.push(config.commonUIUrl + '/assets/js/plugins/i18next.min.js');
    // jsList.push(config.commonUIUrl + '/customAssets/translations/commonUITranslation.json');
    // jsList.push(config.commonUIUrl + '/assets/js/plugins/jquery-i18next.min.js');

    jsList.push(config.commonUIUrl + '/customAssets/js/languageManager.js');
    jsList.push(config.commonUIUrl + '/customAssets/js/templateManager.js');



    jsList.push(config.commonUIUrl + '/assets/plugins/back-to-top.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/smoothScroll.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/sky-forms-pro/skyforms/js/jquery-ui.min.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/sky-forms-pro/skyforms/js/jquery.validate.min.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/sky-forms-pro/skyforms/js/jquery.maskedinput.min.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/scrollbar/js/jquery.mCustomScrollbar.concat.min.js');
    jsList.push(config.commonUIUrl + '/node_modules/underscore/underscore-min.js');
    jsList.push(config.commonUIUrl + '/assets/js/plugins/bootstrap-editable.min.js');
    jsList.push(config.commonUIUrl + '/assets/js/app.js');
    jsList.push(config.commonUIUrl + '/assets/js/forms/reg.js');
    jsList.push(config.commonUIUrl + '/assets/js/forms/checkout.js');
    //jsList.push(config.commonUIUrl + '/assets/js/plugins/handlebars.min.js');
    jsList.push(config.commonUIUrl + '/assets/js/plugins/jquery.jgrowl.min.js');
    jsList.push(config.commonUIUrl + '/assets/js/plugins/bootstrap-filestyle.min.js');
    jsList.push(config.commonUIUrl + '/assets/js/plugins/typeahead.bundle.js');
    jsList.push(config.commonUIUrl + '/customAssets/js/caportCustom.js');
    jsList.push(config.commonUIUrl + '/assets/js/plugins/jquery.cookiebar.js');

    return jsList;
}

//check if script is already loaded and remove it if it's a duplicate
function isLoaded(scriptElem,list){
    var atr=scriptElem.getAttribute('src');
    if(atr){
        atr=atr.slice(atr.lastIndexOf("/"));
        return  (list.some(function(el,index){
            if(el.indexOf(atr) >=0){
                list.splice(index,1);
                return true;
            }else{
                return false
            }
        }));
    }
    return(false);
}


function initScriptLoad(){
    var javascriptScripts=createScriptList();
    var scripts = document.getElementsByTagName("script"); // get all script in page

// remove from list, all script already loaded in the page
    for (var i = 0; i < scripts.length; ++i) {
        isLoaded(scripts[i],javascriptScripts);
    }



//load a Async.js used to load all other script

    var tmpScript;
    tmpScript=document.createElement("script");
    tmpScript.type = "text/javascript"; // set the type attribute
    tmpScript.src = config.commonUIUrl + "/node_modules/async/dist/async.min.js"; // make the script element load file
    tmpScript.onload = function () { // when async  is loaded, load all other script
        async.forEachOfSeries(javascriptScripts, function (value, index, callback) {
            tmpScript=document.createElement("script");
            tmpScript.type = "text/javascript";// set the type attribute
            tmpScript.src = value;// make the script element load file
            // finally insert the element to the body element in order to load the script
            tmpScript.onload = function () {
                callback();
            };
            document.body.appendChild(tmpScript);
        }, function (err) { // all script are loaded then init module
            lockScriptLoad=false;
            console.log("NOW FOOTER CAN LOAD");
            var event = new Event('footerCanLoadScript');
            dispatchEvent(event);
            initHeader();
        });
    };
// finally insert the async.js element to the body element in order to load the script
    document.body.appendChild(tmpScript);
}


if(lockScriptLoad){
    console.log("FOTER ARE LOADING SCRIPT SO WAIT");
    addEventListener('headerCanLoadScript', function (e) {
        console.log("FOTER ARE END LOADING SCRIPT SO HEADER CAN LOAD");
        lockScriptLoad=true;
        initScriptLoad();
    }, false);

}else{
    console.log("NO  FOOTER LOADING SCRIPT LOCK");
    lockScriptLoad=true;
    initScriptLoad();
}


function defaultLoginRedirect(homeredirect){
    window.location.href=homeredirect+window.location.href;
}



// if(translation){
//     i18next.
//
// }






// var firstScript = document.getElementsByTagName('script')[0];
// var js = document.createElement('script');
// js.src = 'customAssets/js/init.js';
// console.log("BeforeLoad");
// js.onload = function () {
//     console.log("On load Call");
//     loadAllScript(firstScript);
// };
// firstScript.parentNode.insertBefore(js, firstScript);








//
// function loadAllScript(firstScript){
//
//     console.log("Load ALL");
//
//     var js = document.createElement('script');
//     js.src = 'assets/plugins/jquery/jquery.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//
//     var js = document.createElement('script');
//     js.src = 'assets/plugins/jquery/jquery-migrate.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/plugins/bootstrap/js/bootstrap.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/plugins/i18next.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'customAssets/translations/commonUITranslation.json';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/plugins/jquery-i18next.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/plugins/back-to-top.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/plugins/smoothScroll.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/plugins/sky-forms-pro/skyforms/js/jquery-ui.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/plugins/sky-forms-pro/skyforms/js/jquery.validate.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/plugins/sky-forms-pro/skyforms/js/jquery.maskedinput.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/plugins/scrollbar/js/jquery.mCustomScrollbar.concat.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'node_modules/underscore/underscore-min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/plugins/bootstrap-editable.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/caportCustom.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/app.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/forms/reg.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/forms/checkout.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/plugins/datepicker.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'customAssets/js/common_header.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'customAssets/js/footer.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'customAssets/js/profile_template.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/plugins/handlebars.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/plugins/jquery.jgrowl.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/plugins/bootstrap-filestyle.min.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'assets/js/plugins/typeahead.bundle.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//     firstScript=js;
//
//     var js = document.createElement('script');
//     js.src = 'customAssets/js/caportCustom.js';
//     firstScript.parentNode.insertBefore(js, firstScript.nextSibling);
//
//     console.log("END Load ALL");
// }