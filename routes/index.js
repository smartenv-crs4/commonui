var express = require('express');
var router = express.Router();
var request=require("request");
var _ = require('underscore')._;
var properties = require('propertiesmanager').conf;
var tokenManager = require('tokenmanager');
var ejs=require('ejs');


var authMsUrl  = properties.authUrl;
var userMsUrl  = properties.userUrl;


tokenManager.configure( {
    "decodedTokenFieldName":"UserToken", // Add token in UserToken field
    "exampleUrl":authMsUrl,
    "authorizationMicroserviceUrl":authMsUrl+ "/tokenactions/checkiftokenisauth",
    "authorizationMicroserviceEncodeTokenUrl":authMsUrl+ "/tokenactions/decodeToken",
    "authorizationMicroserviceToken":properties.myMicroserviceToken,
});


function renderFooter(callback){
    ejs.renderFile("./views/caportFooter.ejs",{properties: properties} , null, function(err, str){
        if(err) {
            return (callback({
                status: 500,
                results: {
                    error: "Internal Server Error",
                    error_message: err
                }
            }));
        }else {
            return (callback({
                status: 200,
                results: {
                    html: str,
                    css: properties.commonUIUrl + "/customAssets/css/header_footer.css",
                    js: properties.commonUIUrl + "/customAssets/js/caportFooter.js"
                }
            }));
        }
    });
}


function renderHeader(req,callback){

    var renderVar= {
        homePage : (req.query && req.query.homePage) || properties.defaultHomeRedirect,
        favourite: (req.query && req.query.favourite) || null,
        pageFaq : (req.query && req.query.pageFaq) || ((properties.pageFaq.length>0) && properties.pageFaq ) || null,
        logout : (req.query && req.query.logout) || null,
        login : (req.query && req.query.login) || null,
        loginHomeRedirect: (req.query && req.query.loginHomeRedirect) || null,
        afterLoginRedirectTo:(req.query && req.query.afterLoginRedirectTo) || null,
        defaultRedirectToCurrentPage:(req.query && req.query.defaultRedirectToCurrentPage) || null,
        enableUserUpgrade : (req.query && req.query.enableUserUpgrade) || null,
        applicationSettings:(req.query && req.query.applicationSettings) || null,
        isLogged : false,
        userProfilePage : null,
        whoWeAre : (req.query && req.query.whoWeAre) || ((properties.whoWeAre.length>0) && properties.whoWeAre ) || null,
        fastSearchUrl : (req.query && req.query.fastSearchUrl) || false,
        username:null,
        resetPasswordSettings:"",
        customMenu:(req.query && req.query.customMenu) || null,
    };


    // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    // console.log(renderVar);


    renderVar.redirectSettings=renderVar.loginHomeRedirect ? "homeRedirect="+ renderVar.loginHomeRedirect +"&loginHomeRedirect="+ renderVar.loginHomeRedirect : "";


    if(renderVar.fastSearchUrl){// fast search only for a little user group
        renderVar.fastSearchUrlIcon=JSON.parse(renderVar.fastSearchUrl).icon;
        try {
            var toUser=JSON.parse(renderVar.fastSearchUrl).toUser;
            if(toUser){
                if(req.UserToken && req.UserToken.token.type && _.isArray(toUser)){
                    if(!(toUser.indexOf(req.UserToken.token.type)>=0))
                        renderVar.fastSearchUrl=false;
                }else{
                    renderVar.fastSearchUrl=false;
                }
            }

        }catch (eX) {
            if(!(renderVar.fastSearchUrl === "true"))
                 renderVar.fastSearchUrl=false;
        }
    }


    if(renderVar.customMenu){// processes custom Menu
        var tempcustomMenu=JSON.parse(renderVar.customMenu);
        renderVar.customMenuItems=[];
        var toUser;
        _.each(tempcustomMenu, function(action, item) {
            try {
                toUser=action.showOnly;
                if(toUser){
                    if(req.UserToken && req.UserToken.token && req.UserToken.token.type && _.isArray(toUser)){
                        if((toUser.indexOf(req.UserToken.token.type)>=0))
                            renderVar.customMenuItems.push({menuAction:action.tag,menuItem:item});
                    }
                }
            }catch (eX) {
                console.log("!!!!!!!!!!!!!!!!! WARNING !!!!!!!!!!!!!!!!!");
                console.log("error in creation custom Menù: " + eX);
                console.log("!!!!!!!!!!!!!!!!! WARNING !!!!!!!!!!!!!!!!!");
            }
        });

    }else{
        renderVar.customMenuItems=null;
    }

    if(req.UserToken && req.UserToken.error_code && req.UserToken.error_code=="0") { // no access_token provided return void header

        if(renderVar.applicationSettings)
            renderVar.resetPasswordSettings="&applicationSettings="+renderVar.applicationSettings;

        ejs.renderFile("./views/caportHeader.ejs",{properties: properties, customizations:renderVar} , null, function(err, str){
            if(err) {
                return (callback({
                    status: 500,
                    results: {
                        error: "Internal Server Error",
                        error_message: err
                    }
                }));
            }else{
                return callback({
                    status:200,
                    results:{
                        html: str,
                        css: properties.commonUIUrl + "/customAssets/css/header_footer.css",
                        js: properties.commonUIUrl + "/customAssets/js/caportHeader.js"
                    }
                });
            }
        });
    }else { // get user Logged header

        if(req.UserToken && req.UserToken.error_code) { // no valid access_token return void Header
            return (callback({
                status: 400,
                results: {
                    error: "BadRequest",
                    error_message: "Not valid user access_token"
                }
            }));
        }
        else{ // load custom header

            renderVar.isLogged=true;

            var rqparams = {
                url:  userMsUrl + '/users/' + req.UserToken.token._id,
                headers: {'content-type': 'application/json','Authorization': "Bearer " + req.UserToken.access_token},
            };

            request.get(rqparams, function (error, response, body) {

                try {
                    var bodyJson = JSON.parse(body);

                    if (response.statusCode == 200) {


                        var userUiLogoutRedirect = (req.query && req.query.userUiLogoutRedirect) || null;
                        var userUiDeleteUserRedirect = (req.query && req.query.userUiDeleteUserRedirect) || null;

                        renderVar.username = bodyJson.email;
                        renderVar.userProfilePage = properties.userUIUrl + "/?access_token=" + req.UserToken.access_token;
                        renderVar.userProfilePage += userUiLogoutRedirect ? "&logout=" + userUiLogoutRedirect : "";
                        renderVar.userProfilePage += userUiDeleteUserRedirect ? "&userUiDeleteUserRedirect=" + userUiDeleteUserRedirect : "";
                        renderVar.userProfilePage += renderVar.loginHomeRedirect ? "&homeRedirect=" + renderVar.loginHomeRedirect + "&loginHomeRedirect=" + renderVar.loginHomeRedirect : "";
                        renderVar.userProfilePage += renderVar.afterLoginRedirectTo ? "&redirectTo=" + renderVar.afterLoginRedirectTo : "";
                        renderVar.userProfilePage += renderVar.fastSearchUrl ? "&fastSearchUrl=" + renderVar.fastSearchUrl : "";


                        if (renderVar.enableUserUpgrade)
                            renderVar.userProfilePage += "&enableUserUpgrade=" + renderVar.enableUserUpgrade;

                        if (renderVar.applicationSettings)
                            renderVar.userProfilePage += "&applicationSettings=" + renderVar.applicationSettings;

                        if (renderVar.customMenu)
                            renderVar.userProfilePage += "&customMenu=" + renderVar.customMenu;

                        if (renderVar.favourite)
                            renderVar.userProfilePage += "&favourite=" + renderVar.favourite;



                        console.log("################################################## is Logged true ");
                        console.log(renderVar);


                        ejs.renderFile("./views/caportHeader.ejs", {
                            properties: properties,
                            customizations: renderVar
                        }, null, function (err, str) {
                            if (err) {
                                return (callback({
                                    status: 500,
                                    results: {
                                        error: "Internal Server Error",
                                        error_message: err
                                    }
                                }));
                            } else {
                                return callback({
                                    status: 200,
                                    results: {
                                        html: str,
                                        css: properties.commonUIUrl + "/customAssets/css/header_footer.css",
                                        js: properties.commonUIUrl + "/customAssets/js/caportHeader.js"
                                    }
                                });
                            }
                        });
                    } else {
                        if (response.statusCode == 401) { //Not authorised access_token
                            return (callback({
                                status: 500,
                                results: bodyJson
                            }));
                        } else if (response.statusCode == 500) { //Not authorised access_token
                            return (callback({
                                status: 500,
                                results: bodyJson
                            }));
                        } else {// user Not found
                            return (callback({
                                status: 404,
                                results: {
                                    error: "Resource Not Found",
                                    error_message: "The owner of this access_token was not found"
                                }
                            }));
                        }
                    }
                }catch (ex) {
                    return (callback({
                        status: 500,
                        results: {
                            error: "Internal Server Error",
                            error_message: "in Get user info by id: " + ex
                        }
                    }));
                }
            });
        }
    }
}


/* GET home page. */
router.get('/env', function(req, res) {
    var env;
    if (process.env['NODE_ENV'] === 'dev')
        env='dev';
    else
        env='production';

    res.status(200).send({env:env});
});


router.get('/footer',function(req,res){
    renderFooter(function(renderResult){
        res.status(renderResult.status).send(renderResult.results);
    });
});

/* GET home page. */
router.get('/header',tokenManager.checkTokenValidityOnReq, function(req, res) {
    renderHeader(req,function(renderResult){
        res.status(renderResult.status).send(renderResult.results);
    });

});


// /* GET home page. */
// router.get('/languageManager',tokenManager.checkTokenValidityOnReq, function(req, res) {
//     res.status(200).send({
//         languagemanager:properties.commonUIUrl + "/customAssets/js/caportLanguageManager.js"
//     });
// });


router.get('/headerAndFooter',tokenManager.checkTokenValidityOnReq, function(req, res) {

    console.log(req.UserToken);
    renderHeader(req,function(renderResult){
        console.log(renderResult);
        if(renderResult.status!=200){
            res.status(renderResult.status).send(renderResult.results);
        }else{
            renderFooter(function(renderResultFooter){
                if(renderResultFooter.status!=200) {
                    res.status(renderResultFooter.status).send(renderResultFooter.results);
                }else{
                    res.status(200).send({
                       header:renderResult.results,
                       footer:renderResultFooter.results
                    });
                }
            });
        }
    });

});


function renderPageError(req,callback){
    var error_code= (req.query && req.query.error_code) || 400;
    var error_message=(req.query && req.query.error_message) || "400";
    var defaultHomeRedirect=(req.query && req.query.defaultHomeRedirect) || null;
    var showMore_message=(req.query && req.query.showMore_message) || null;
    var custom_error_message=(req.query && req.query.custom_error_message) || null;


    var options={error_code:error_code,error_message:error_message,defaultHomeRedirect:defaultHomeRedirect, showMore_message:showMore_message,custom_error_message:custom_error_message};


    ejs.renderFile("./views/caportPageError.ejs",{properties:properties,options:options} , null, function(err, str){
        if(err) {
            return callback(500,{
                error: "InternalError",
                error_message: err
            });
        }else{
            return callback(200,{
                html: str,
                css: properties.commonUIUrl + "/customAssets/css/error_page.css",
                js: properties.commonUIUrl + "/customAssets/js/caportErrorPage.js"
            });
        }
    });
};

router.get('/errorBody',function(req,res){

    renderPageError(req,function(statusCode,respBody){
            return res.status(statusCode).send(respBody);
    });

});

router.get('/errorPage',function(req,res){
    renderPageError(req,function(statusCode,respBody){
        res.render('completeErrorPage',{errorPageCss:respBody.css,errorPageJs:respBody.js,errorPage:respBody.html});
    });
});


//
// router.get('/header',tokenManager.checkTokenValidityOnReq, function(req, res) {
//
//
//
//     // homePage
//     // pageFaq
//     // logout
//     // login
//     // isLogged
//     // userProfilePage
//     // username
//     // whoWeAre
//     // fastSearchUrl
//     //
//
//     console.log(req.UserToken);
//
//     var renderVar= {
//         homePage : (req.query && req.query.homePage) || properties.defaultHomeRedirect,
//         pageFaq : (req.query && req.query.pageFaq) || null,
//         logout : (req.query && req.query.logout) || null,
//         login : (req.query && req.query.login) || null,
//         isLogged : false,
//         userProfilePage : (req.query && req.query.userProfilePage) || null,
//         whoWeAre : (req.query && req.query.whoWeAre) || null,
//         fastSearchUrl : (req.query && req.query.fastSearchUrl) || true
//     };
//
//
//     if(req.UserToken && req.UserToken.error_code && req.UserToken.error_code=="0") { // no access_token provided return void header
//
//         return res.render('caportHeader', {properties: properties, user: null, error: null,customizations:renderVar});
//     }
//     else { // get user Logged header
//
//
//         if(req.UserToken && req.UserToken.error_code) { // no valid access_token return void Header
//
//             console.log("Login because not valid Access_token");
//             return res.render('login', {properties: properties, redirectTo: userWebUiMsUrl});
//         }
//         else{ // load custom header
//
//             isLogged=true;
//
//             var rqparams = {
//                 url:  userMsUrl + '/users/' + req.UserToken.token._id,
//                 headers: {'content-type': 'application/json','Authorization': "Bearer " + req.UserToken.access_token},
//             };
//
//             request.get(rqparams, function (error, response, body) {
//                 var bodyJson=JSON.parse(body);
//
//                 if(response.statusCode==200) {
//                     var username=bodyJson.email;
//
//                     return res.render('profile', {properties: properties, user: bodyJson, error: null});
//                 }
//                 else{
//                     return res.render('profile', {properties: properties, user:null ,error:bodyJson});
//                 }
//             });
//
//             }
//
//     }
// });



// /* GET home page. */
// router.get('/index', function(req, res) {
//     res.render('index', {POST_TITLE:"TITLE",POST_AUTHOR:"Author",POST_CONTENT:"Post Content"});
// });

// /* GET home page. */
// router.get('/env', function(req, res) {
//  var env;
//  if (process.env['NODE_ENV'] === 'dev')
//       env='dev';
//  else
//       env='production';
//
//  res.status(200).send({env:env});
// });
//
// router.get('/main', function(req, res) {
//     var action=req.signedCookies.action || null;
//
//     if(action=="log") {
//
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//         var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
//         var gwVersion=conf.getParam("apiVersion");
//         var gwConf=_.isEmpty(gwBaseUrl) ? "" : gwBaseUrl;
//         gwConf=_.isEmpty(gwVersion) ? gwConf : gwConf + "/" + gwVersion;
//         var adminToken=req.query.adminToken || null;
//         res.render('main', {
//             MicroSL: conf.getParam("microserviceList"),
//             myUrl: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf,
//             myToken: conf.getParam("myMicroserviceToken"),
//             iconsList: iconsList,
//             adminToken:adminToken
//         });
//     }
//     else {
//         res.status(401).send({error:"Unauthorized", error_message:"You are not authorized to access this resource"});
//     }
// });
//
//
//
// /* GET home page. */
// router.get('/configure', function(req, res) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.render('start', {read:"No"});
// });
//
//
//
// /* GET home page. */
// router.get('/login', function(req, res) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
//     var gwVersion=conf.getParam("apiVersion");
//     var gwConf=_.isEmpty(gwBaseUrl) ? "" : gwBaseUrl;
//     gwConf=_.isEmpty(gwVersion) ? gwConf : gwConf + "/" + gwVersion;
//     res.render('login', {
//         next: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf,
//         at: conf.getParam("myMicroserviceToken")
//     });
// });
//
// // /* GET home page. */
// // router.get('/configure', function(req, res) {
// //
// // var action=req.signedCookies.action || null;
// //
// //  console.log("XXXXXXXXXXXXXXX " + action + " XXXXXXXXXXXXXX");
// //
// //  console.log("Rendering " + conf.getParam("msType"));
// //
// //
// //     if(action=="log") {
// //
// //         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
// //         res.render('main', {
// //             MicroSL: conf.getParam("microserviceList"),
// //             myUrl: conf.getParam("myMicroserviceBaseUrl"),
// //             myToken: conf.getParam("myMicroserviceToken"),
// //             iconsList: iconsList
// //         });
// //     }
// //     else {
// //         //res.cookie("action","log");
// //         console.log("LOGIN");
// //         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
// //         res.render('login', {
// //             next: conf.getParam("myMicroserviceBaseUrl"),
// //             at: conf.getParam("myMicroserviceToken")
// //         });
// //     }
// // });
//
//
//
// /* GET home page. */
// router.post('/configure', function(req, res) {
//
//     var ms = {
//         "username": req.body.username,
//         "password": req.body.password
//     };
//     var userBody = JSON.stringify(ms);
//     // console.log("BODY " + userBody);
//
//     var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
//     var gwVersion=conf.getParam("apiVersion");
//     var gwConf=_.isEmpty(gwBaseUrl) ? "" : gwBaseUrl;
//     gwConf=_.isEmpty(gwVersion) ? gwConf : gwConf + "/" + gwVersion;
//     request.post({
//         url: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf + "/authuser/signin",
//         body: userBody,
//         headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.getParam("myMicroserviceToken")}
//     }, function (error, response,body) {
//         console.log(body);
//         respb=JSON.parse(body);
//         if (respb.error_message){
//             res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//             var gwBaseUrl=conf.getParam("apiGwAuthBaseUrl");
//             var gwVersion=conf.getParam("apiVersion");
//             var gwConf=_.isEmpty(gwBaseUrl) ? "" : gwBaseUrl;
//             gwConf=_.isEmpty(gwVersion) ? gwConf : gwConf + "/" + gwVersion;
//             res.render('login', {
//                 next: conf.getParam("authProtocol") + "://" + conf.getParam("authHost") + ":" + conf.getParam("authPort") + gwConf,
//                 at: conf.getParam("myMicroserviceToken"),
//                 error_message:respb.error_message
//             });
//         }
//         else {
//             res.cookie("action","log",{ signed: true });
//             res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//             res.render('start', {read:"Yes", adminToken:respb.apiKey.token});
//         }
//     });
// });
//
//
//
// /* GET home page. */
// router.post('/logout', function(req, res) {
//     res.clearCookie("action");
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.render('start', {read:"No"});
// });





module.exports = router;
