

function initErrorPage(){
    jQuery(document).ready(function(){

        App.init();
        StyleSwitcher.initStyleSwitcher();

        if(localStorage.lng) // if a language is set in a previous page
        {
            console.log("language IS SET");
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
            }
        });
    });

    $.backstretch([
        config.commonUIUrl+"/assets/img/blur/img6.jpg"
    ]);


    i18next.init({
        lng: localStorage.lng, // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
        fallbackLng: "en",
        resources:  translation
    }, function (err, t) {
        console.log("After tanslation init");
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
    });
};

function initFooter(){


    // Get userWebUi Token
    // _access_token =  config.myMicroserviceToken;

    jQuery(document).ready(function(){


        App.init();
        if(localStorage.lng) // if a language is set in a previous page
        {
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
            }
        });
    });


    i18next.init({
        lng: localStorage.lng, // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
        fallbackLng: "en",
        resources:  translation
    }, function (err, t) {
        console.log("After tanslation init");
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
    });

}

function initHeader(){


    // Get userWebUi Token
    // _access_token =  config.myMicroserviceToken;

    jQuery(document).ready(function(){

        console.log("Document READY");
        App.init();

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
            }
        });
        loadCookieLawBar();
    });

    console.log("Before tanslation init");
    i18next.init({
        lng: localStorage.lng, // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
        fallbackLng: "en",
        resources:  translation
    }, function (err, t) {
        console.log("After tanslation init");
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
    });

}



function loadCookieLawBar()
{

    initCookieBar();
    jQuery(document).on("translate", function(){
        if(jQuery("#cookie-bar .cb-enable").length > 0)
        {
            var button = jQuery("#cookie-bar .cb-enable").first()[0].cloneNode(true);
            jQuery("#cookie-bar p").html(jQuery.i18n.t("cookieLaw.message"));
            button.innerHTML = jQuery.i18n.t("cookieLaw.accept");
            jQuery("#cookie-bar p").append(button);
        }
    })
}
function initCookieBar()
{
    jQuery.cookieBar({
        message: jQuery.i18n.t("cookieLaw.message"),
        //declineButton: true,
        acceptText: jQuery.i18n.t("cookieLaw.accept"),
        declineText: jQuery.i18n.t("cookieLaw.decline"),
        declineFunction: function() {
            window.location.href = "http://www.crs4.it";
        },
        //renewOnVisit: true,
        expireDays: 90,
        //autoEnable: false,
    });

    jQuery("#cookie-bar p").css("color", "#FFFFFF");
}
