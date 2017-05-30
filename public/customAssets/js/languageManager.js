//var async=require('async');


var translation= translation || null;
var i18nlibrariesLoading= i18nlibrariesLoading || false;
var jqueryi18nlibrariesLoading= jqueryi18nlibrariesLoading || false;
var asyncLibraryLoading= asyncLibraryLoading || false;
var asyncLanguageManagerLoading=asyncLanguageManagerLoading || false;



function setenv(commonUiBaseUrl,evenListener){
    async.series([
            function(callback) {
                if($('script[src*="i18next.min.js"]')[0]) { //18next.min.js lb loaded
                    console.log("------------> i18next.min.js already loaded");
                    if(i18nlibrariesLoading){
                        addEventListener('i18next', function (e) {
                            callback(null, 'one');
                        }, false);
                    }else{
                        callback(null, 'one');
                    }

                }else{
                    tmpScript=document.createElement("script");
                    tmpScript.type = "text/javascript"; // set the type attribute
                    // tmpScript.src = config.commonUIUrl + "/node_modules/async/dist/async.min.js"; // make the script element load file
                    tmpScript.src = commonUiBaseUrl + "/assets/js/plugins/i18next.min.js"; // make the script element load file
                    tmpScript.onload = function () { // when async  is loaded, load all other script
                        console.log("------------> i18next.min.js loaded");
                        var event = new Event('i18next');
                        dispatchEvent(event);
                        i18nlibrariesLoading=false;
                        callback(null, 'one');
                    };
                    // finally insert the js element to the body element in order to load the script
                    i18nlibrariesLoading=true;
                    document.body.appendChild(tmpScript);

                }

            },
            function(callback) {
                if($('script[src*="jquery-i18next.min.js"]')[0]) { //jquery-i18next.min.js lb loaded
                    console.log("------------> jquery-i18next.min.js already loaded");

                    if(jqueryi18nlibrariesLoading){
                        addEventListener('jquery-i18next', function (e) {
                            callback(null, 'two');
                        }, false);
                    }else{
                        callback(null, 'two');
                    }


                }else{
                    tmpScript=document.createElement("script");
                    tmpScript.type = "text/javascript"; // set the type attribute
                    // tmpScript.src = config.commonUIUrl + "/node_modules/async/dist/async.min.js"; // make the script element load file
                    tmpScript.src = commonUiBaseUrl + "/assets/js/plugins/jquery-i18next.min.js"; // make the script element load file
                    tmpScript.onload = function () { // when async  is loaded, load all other script
                        console.log("------------> jquery-i18next.min.js loaded");
                        var event = new Event('jquery-i18next');
                        jqueryi18nlibrariesLoading=false;
                        dispatchEvent(event);
                        callback(null, 'two');
                    };
                    // finally insert the js element to the body element in order to load the script
                    jqueryi18nlibrariesLoading=true;
                    document.body.appendChild(tmpScript);

                }
            }
        ],


        function(err, results) { // libs are loaded so Init Language Manager

            console.log("Library i18n initialized");
            i18next.init({
                lng: localStorage.lng, // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
                fallbackLng: "en",
                resources:  translation
            }, function (err, t) {
                jqueryI18next.init(i18next, jQuery,
                    {
                        tName: 't', // --> appends $.t = i18next.t
                        i18nName: 'i18n', // --> appends $.i18n = i18next
                        handleName: 'localize', // --> appends $(selector).localize(opts);
                        selectorAttr: 'data-i18n', // selector for translating elements
                        targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
                        optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
                        useOptionsAttr: false, // see optionsAttr
                        parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
                    });


                console.log("@@@@@@@@@@@@@@@@@@@@@@@@ " + evenListener + " Throw @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

                var event = new Event(evenListener);
                dispatchEvent(event);

                jQuery(document).ready(function(){

                    console.log("Language " + localStorage.lng);

                    if(localStorage.lng) // if a language is set in a previous page
                    {
                        console.log("language SET");
                        var l = jQuery(".languages a[data-lng='" + localStorage.lng +"']"); // get language arrays
                        if(l.length > 0)  // check if a language array exist(not all pages have a language drop down menu)
                        {
                            if(localStorage.lng != jQuery(".languages .active a").first().attr("data-lng")) // if current language != set language then translate and change language
                            {
                                var lngSel = jQuery(".languages .active").first()
                                lngSel.empty();
                                lngSel.append(l[0].cloneNode(true));
                                var c = document.createElement("i");
                                c.className = "fa fa-check";
                                lngSel.find("a").first().append(c);
                            }
                            i18next.changeLanguage(localStorage.lng, function(){});
                            console.log("localize");
                            jQuery('body').localize();
                        }else{// language selector not exixst
                            localStorage.lng = jQuery(".languages .active a").first().data("lng");
                            i18next.changeLanguage(localStorage.lng, function(){});
                            console.log("localize No language set");
                            jQuery('body').localize();
                        }
                    }
                    else  //if not a language is set
                    {
                        console.log("language Not SET");
                        //get default language and set it
                        localStorage.lng = jQuery(".languages .active a").first().data("lng");
                        i18next.changeLanguage(localStorage.lng, function(){});
                        console.log("localize No language set");
                        jQuery('body').localize();
                    }

                    // on click on language drop down set the language
                    jQuery(".languages a").click(function(){

                        if(jQuery(this).attr("data-lng"))
                        {

                            localStorage.lng = jQuery(this).attr("data-lng");
                            var lngSel = jQuery(".languages .active").first();
                            lngSel.empty();
                            lngSel.append(this.cloneNode(true));
                            var c = document.createElement("i");
                            c.className = "fa fa-check";
                            lngSel.find("a").first().append(c);
                            i18next.changeLanguage(localStorage.lng, function(){});
                            jQuery('body').localize();
                            jQuery(document).trigger('translate');
                            console.log("commonUi Cahange Language " + localStorage.lng);
                        }
                    });




                });



            });
        }
    );

}



function initDictionary(jsondictionary,commonUiBaseUrl,evenListener){


    if(!commonUiBaseUrl){
        commonUiBaseUrl=$('script[src*="/customAssets/js/languageManager.js"]')[0].src;
        commonUiBaseUrl=commonUiBaseUrl.slice(0,commonUiBaseUrl.indexOf("/customAssets/js/languageManager.js"));
        console.log("############### " + commonUiBaseUrl);
    }


    if(!translation){
        translation={};
        console.log("No translations");
    }

    $.each( jsondictionary, function( categoryMessageKey, categoryMessageValue ) {
        $.each( categoryMessageValue, function( translationKey, translationValues ) {
            $.each( translationValues, function( language,currentTranslation ) {
                translation[language]=translation[language]||{};
                translation[language]["translation"]=translation[language]["translation"]||{};
                translation[language]["translation"][categoryMessageKey]=translation[language]["translation"][categoryMessageKey]||{};
                translation[language]["translation"][categoryMessageKey][translationKey]=currentTranslation;
                // console.log("translation["+language+"][translation]["+categoryMessageKey+"]["+translationKey+"]="+currentTranslation);
            });
        });
    });

    console.log("Dizionario");
    console.log(translation);
    var tmpScript;

    if($('script[src*="async.min.js"]')[0] &&(asyncLanguageManagerLoading)){ //async lib loaded
        if(asyncLibraryLoading){
            console.log("Wait to async loading done");_
            addEventListener('asyncLoaded', function (e) {
                console.log("Async Lib end so its loaded");
                setenv(commonUiBaseUrl,evenListener);
            }, false);
        }else{

            console.log("Async Lib already loaded " + asyncLibraryLoading);
            setenv(commonUiBaseUrl,evenListener);
        }

    }else{ // no async lib
        asyncLanguageManagerLoading=true;
        var tmpScript=document.createElement("script");
        tmpScript.type = "text/javascript"; // set the type attribute
        // tmpScript.src = config.commonUIUrl + "/node_modules/async/dist/async.min.js"; // make the script element load file
        tmpScript.src = commonUiBaseUrl + "/node_modules/async/dist/async.min.js"; // make the script element load file
        tmpScript.onload = function () { // when async  is loaded, load all other script
            console.log("async loading done");
            asyncLibraryLoading=false;
            var event = new Event('asyncLoaded');
            dispatchEvent(event);
            setenv(commonUiBaseUrl,evenListener);
        };
        // finally insert the js element to the body element in order to load the script

        asyncLibraryLoading=true;
        console.log("Loading Async");
        document.body.appendChild(tmpScript);

    }

}







