
/*List of all javascript used in header. If you need more js populate this list*/
function createScriptList(){
    var jsList=[];
    jsList.push(config.commonUIUrl + '/assets/plugins/jquery/jquery.min.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/jquery/jquery-migrate.min.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/bootstrap/js/bootstrap.min.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/back-to-top.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/backstretch/jquery.backstretch.min.js');

    // jsList.push(config.commonUIUrl + '/assets/js/plugins/i18next.min.js');
    // jsList.push(config.commonUIUrl + '/customAssets/translations/commonUITranslation.json');
    // jsList.push(config.commonUIUrl + '/assets/js/plugins/jquery-i18next.min.js');

    jsList.push(config.commonUIUrl + '/customAssets/js/languageManager.js');


    jsList.push(config.commonUIUrl + '/assets/js/app.js');
    jsList.push(config.commonUIUrl + '/customAssets/js/caportCustom.js');
    jsList.push(config.commonUIUrl + '/assets/js/plugins/style-switcher.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/respond.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/html5shiv.js');
    jsList.push(config.commonUIUrl + '/assets/plugins/placeholder-IE-fixes.js');

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

    var tmpScript;
    //load a Async.js used to load all other script
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
            // lockScriptLoad=false;
            // console.log("NOW hEADER CAN LOAD");
            // var event = new Event('headerCanLoadScript');
            // dispatchEvent(event);
            initErrorPage();
        });
    };
// finally insert the async.js element to the body element in order to load the script
    document.body.appendChild(tmpScript);
}


// if(lockScriptLoad){
//     addEventListener('footerCanLoadScript', function (e) {
//             console.log("Error Page Can Load");
//             lockScriptLoad=true;
//             initScriptLoad();
//     }, false);
//
// }else{
//     console.log("Error Page Load");
//     lockScriptLoad=true;
//     initScriptLoad();
// }

initScriptLoad();













