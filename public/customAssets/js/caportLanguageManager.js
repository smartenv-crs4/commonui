//var async=require('async');


var translation= translation || null;


if(!translation){
    translation={};
    console.log("No translations");
}


var languageBaseUrl=$('script[src*="/customAssets/js/caportLanguageManager.js"]')[0].src;
languageBaseUrl=languageBaseUrl.slice(0,languageBaseUrl.indexOf("/customAssets/js/caportLanguageManager.js"));

console.log("############### " + languageBaseUrl);




    $.ajax({
        url: languageBaseUrl + '/customAssets/translations/translation.json',
        cache: false,
        type:"get",
        contentType:"application/json",
        success: function(data) {
            console.log("Json Readed Ajax");
            console.log( "JSON Data: " + data);
                $.each( data, function( categoryMessageKey, categoryMessageValue ) {
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
            tmpScript=document.createElement("script");
            tmpScript.type = "text/javascript"; // set the type attribute
            // tmpScript.src = config.commonUIUrl + "/node_modules/async/dist/async.min.js"; // make the script element load file
            tmpScript.src = languageBaseUrl + "/assets/js/plugins/i18next.min.js"; // make the script element load file
            tmpScript.onload = function () { // when async  is loaded, load all other script
                tmpScript=document.createElement("script");
                tmpScript.type = "text/javascript"; // set the type attribute
                // tmpScript.src = config.commonUIUrl + "/node_modules/async/dist/async.min.js"; // make the script element load file
                tmpScript.src = languageBaseUrl+ "/assets/js/plugins/jquery-i18next.min.js"; // make the script element load file
                tmpScript.onload = function () { // when async  is loaded, load all other script

                    console.log("Langiage Manager tanslation init");
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

                        jQuery(document).ready(function(){

                            console.log("∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞ SET CURRENT LANGUAGE" );
                            if(localStorage.lng) // if a language is set in a previous page
                            {
                                i18next.changeLanguage(localStorage.lng, function(){});
                                console.log("localize No language set");
                                jQuery('body').localize();
                            }
                            else  //if not a language is set
                            {
                                console.log("language Not SET");
                                //get default language and set it
                                i18next.changeLanguage("en", function(){});
                                console.log("localize No language set");
                                jQuery('body').localize();
                            }
                        });



                    });
                };
                // finally insert the js element to the body element in order to load the script
                document.body.appendChild(tmpScript);
            };
            // finally insert the js element to the body element in order to load the script
            document.body.appendChild(tmpScript);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Json ERROR Ajax");
            console.log(xhr);
            console.log(thrownError);
        }

    });



    // async.eachOfSeries(dictionary,function(item,key,cb){
    //     async.eachOfSeries(item,function(errTypeValues,errTypeKey,cberr){
    //         async.eachOfSeries(errTypeValues,function(currentTranslation,language,cbTrans){
    //
    //                 cbTrans();
    //         },function(err){
    //             cberr();
    //         });
    //     },function(err){
    //         cb();
    //     });
    // },function(err){
    //     console.log(translation);
    // });


