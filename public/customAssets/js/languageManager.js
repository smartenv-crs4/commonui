//var async=require('async');


var translation= translation || null;
var i18nlibrariesLoading= i18nlibrariesLoading || false;
var jqueryi18nlibrariesLoading= jqueryi18nlibrariesLoading || false;
var asyncLibraryLoading= asyncLibraryLoading || false;
var i18nInitDone=i18nInitDone || false;



function setenv(commonUiBaseUrl,evenListener){

    async.series([
            function(callback) {
                if($('script[src*="i18next.min.js"]')[0]) { //18next.min.js lb loaded
                    if(i18nlibrariesLoading){
                        addEventListener('i18next', function (e) {
                            callback(null, 'one');
                        }, false);
                    }else{
                        callback(null, 'one');
                    }

                }else{
                    i18nlibrariesLoading=true;
                    tmpScript=document.createElement("script");
                    tmpScript.type = "text/javascript"; // set the type attribute
                    // tmpScript.src = config.commonUIUrl + "/node_modules/async/dist/async.min.js"; // make the script element load file
                    tmpScript.src = commonUiBaseUrl + "/assets/js/plugins/i18next.min.js"; // make the script element load file
                    tmpScript.onload = function () { // when async  is loaded, load all other script
                        var event = new Event('i18next');
                        dispatchEvent(event);
                        i18nlibrariesLoading=false;
                        callback(null, 'one');
                    };
                    // finally insert the js element to the body element in order to load the script
                    document.body.appendChild(tmpScript);

                }

            },
            function(callback) {
                if($('script[src*="jquery-i18next.min.js"]')[0]) { //jquery-i18next.min.js lb loaded

                    if(jqueryi18nlibrariesLoading){
                        addEventListener('jquery-i18next', function (e) {
                            callback(null, 'two');
                        }, false);
                    }else{
                        callback(null, 'two');
                    }


                }else{
                    jqueryi18nlibrariesLoading=true;
                    tmpScript=document.createElement("script");
                    tmpScript.type = "text/javascript"; // set the type attribute
                    // tmpScript.src = config.commonUIUrl + "/node_modules/async/dist/async.min.js"; // make the script element load file
                    tmpScript.src = commonUiBaseUrl + "/assets/js/plugins/jquery-i18next.min.js"; // make the script element load file
                    tmpScript.onload = function () { // when async  is loaded, load all other script
                        var event = new Event('jquery-i18next');
                        jqueryi18nlibrariesLoading=false;
                        dispatchEvent(event);
                        callback(null, 'two');
                    };
                    // finally insert the js element to the body element in order to load the script
                    document.body.appendChild(tmpScript);

                }
            }
        ],


        function(err, results) { // libs are loaded so Init Language Manager


            if(i18nInitDone){
                $.each( translation, function( lng, translationLanguage ) {
                    i18next.addResourceBundle(lng,"translation",translationLanguage.translation,true,false);
                });
                // jQuery('body').localize();
                var event = new Event(evenListener);
                dispatchEvent(event);

            }else{
                i18nInitDone=true;
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


                    var event = new Event(evenListener);
                    dispatchEvent(event);

                    jQuery(document).ready(function(){


                        if(localStorage.lng) {  // if a language is set in a previous page

                            var l = jQuery(".languages a[data-lng='" + localStorage.lng +"']"); // get language arrays
                            if(l.length > 0)  // check if a language array exist(not all pages have a language drop down menu)
                            {
                                if(localStorage.lng != jQuery(".languages .active a").first().attr("data-lng")) // if current language != set language then translate and change language
                                {
                                    var lngSel = jQuery(".languages .active").first();
                                    lngSel.empty();
                                    lngSel.append(l[0].cloneNode(true));
                                    var c = document.createElement("i");
                                    c.className = "fa fa-check";
                                    lngSel.find("a").first().append(c);
                                }
                                i18next.changeLanguage(localStorage.lng, function(){});
                                jQuery('body').localize();
                            }else{// language selector not exixst
                                localStorage.lng = jQuery(".languages .active a").first().data("lng");
                                i18next.changeLanguage(localStorage.lng, function(){});
                                jQuery('body').localize();
                            }
                        }
                        else  //if not a language is set
                        {
                            //get default language and set it
                            localStorage.lng = jQuery(".languages .active a").first().data("lng");
                            i18next.changeLanguage(localStorage.lng, function(){});
                            jQuery('body').localize();
                        }

                        // on click on language drop down set the language
                        jQuery(".languages a").click(function(){

                            if(jQuery(this).attr("data-lng")){

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
                            }
                        });
                    });

                });
            }
        }
    );

}



function initDictionary(jsondictionary,commonUiBaseUrl,evenListener){



    if(!commonUiBaseUrl){
        commonUiBaseUrl=$('script[src*="/customAssets/js/languageManager.js"]')[0].src;
        commonUiBaseUrl=commonUiBaseUrl.slice(0,commonUiBaseUrl.indexOf("/customAssets/js/languageManager.js"));
    }


    if(!translation){
        translation={};
    }

    $.each( jsondictionary, function( categoryMessageKey, categoryMessageValue ) {
        $.each( categoryMessageValue, function( translationKey, translationValues ) {
            $.each( translationValues, function( language,currentTranslation ) {
                translation[language]=translation[language]||{};
                translation[language]["translation"]=translation[language]["translation"]||{};
                translation[language]["translation"][categoryMessageKey]=translation[language]["translation"][categoryMessageKey]||{};
                translation[language]["translation"][categoryMessageKey][translationKey]=currentTranslation;
            });
        });
    });

    // console.log("Dizionario Grezzo");
    // console.log(jsondictionary);
    // console.log("Dizionario");
    // console.log(translation);


    if($('script[src*="async.min.js"]')[0]) { //async lib loaded

        if(asyncLibraryLoading ){
            addEventListener('asyncLoaded', function (e) {
                setenv(commonUiBaseUrl,evenListener);
            }, false);
        }else{
            if(window.async===undefined){
                var initEnv=false;
                addEventListener('asyncLoaded', function (e) {
                    if(!initEnv) {
                        initEnv=true;
                        setenv(commonUiBaseUrl, evenListener);
                    }
                }, false);
            }else {
                setenv(commonUiBaseUrl, evenListener);
            }
        }

    }else{
        asyncLibraryLoading=true;
        var tmpScript=document.createElement("script");
        tmpScript.type = "text/javascript"; // set the type attribute
        // tmpScript.src = config.commonUIUrl + "/node_modules/async/dist/async.min.js"; // make the script element load file
        tmpScript.src = commonUiBaseUrl + "/node_modules/async/dist/async.min.js"; // make the script element load file
        tmpScript.onload = function () { // when async  is loaded, load all other script
            asyncLibraryLoading=false;
            var event = new Event('asyncLoaded');
            dispatchEvent(event);
            setenv(commonUiBaseUrl,evenListener);
        };
        // finally insert the js element to the body element in order to load the script
        document.body.appendChild(tmpScript);
    }


}







