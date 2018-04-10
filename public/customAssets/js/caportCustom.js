

function initTranslation(evenListener){
    $.ajax({
        url: config.commonUIUrl + '/customAssets/translations/translation.json',
        cache: false,
        type:"get",
        contentType:"application/json",
        success: function(data) {
            initDictionary(data,config.commonUIUrl,evenListener);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Json ERROR Ajax");
            console.log(xhr);
            console.log(thrownError);
        }

    });
}


function initErrorPage(){

   initTranslation("errorPageLanguageInitialized");

    jQuery(document).ready(function(){

        initApp();// App.init();
        StyleSwitcher.initStyleSwitcher();
    });

    $.backstretch([
        config.commonUIUrl+"/assets/img/blur/img6.jpg"
    ]);



};

function initFooter(){


    // Get userWebUi Token
    // _access_token =  config.myMicroserviceToken;


    initTranslation("footerLanguageInitialized");

    jQuery(document).ready(function(){
        initApp();// App.init();
    });



}

function initHeader(){


    // Get userWebUi Token
    // _access_token =  config.myMicroserviceToken;



    initTranslation("headerLanguageInitialized");

    addEventListener('headerLanguageInitialized', function (e) {
        loadCookieLawBar();
    }, false);


    jQuery(document).ready(function(){
        initApp(); // App.init();
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


