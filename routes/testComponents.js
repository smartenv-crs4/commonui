var express = require('express');
var router = express.Router();
var request=require("request");
var _ = require('underscore')._;
var properties = require('propertiesmanager').conf;
var tokenManager = require('tokenmanager');
var ejs=require('ejs');


router.get('/testHeader', function(req, res) {

    request.get(properties.commonUIUrl+"/header", function (error, response, body) {
        if(error)console.log("ERRR " + error);
        console.log(body);
        body=JSON.parse(body);
        return res.render('testHeader', {header:body.html,headerCss:body.css,headerScript:body.js});
    });

});


router.get('/testFooter', function(req, res) {

    request.get(properties.commonUIUrl+"/footer", function (error, response, body) {
        if(error)console.log("ERRR " + error);
        console.log(body);
        body=JSON.parse(body);
        return res.render('testFooter', {footer:body.html,footerCss:body.css,footerScript:body.js});
    });

});


router.get('/testHeaderFooter', function(req, res) {

    var loginHomeRedirect=(req.query && req.query.loginHomeRedirect) || null;
    var access_token=(req.query && req.query.access_token) || null;
    request.get(properties.commonUIUrl+"/headerAndFooter?loginHomeRedirect="+loginHomeRedirect+"&access_token="+access_token+"&favourite=http://smartapi.crs4.it/content", function (error, response, body) {
        if(error)console.log("ERRR " + error);
        console.log(body);
        body=JSON.parse(body);
        return res.render('testHeaderFooter', {footer:body.footer.html,footerCss:body.footer.css,footerScript:body.footer.js,header:body.header.html,headerCss:body.header.css,headerScript:body.header.js});
    });

});


router.get('/testError', function(req, res) {

    request.get(properties.commonUIUrl+"/errorbody?error_code=401&error_message=401&defaultHomeRedirect=www.pippo.it&showMore_message=more text...", function (error, response, body) {
        if(error)console.log("ERRR " + error);
        body=JSON.parse(body);
        return res.render("completeErrorPage",{errorPageCss:body.css,errorPageJs:body.js,errorPage:body.html});
    });

});


router.get('/testErrorComplete', function(req, res) {

    request.get(properties.commonUIUrl+"/errorPage?error_code=401&error_message=401&defaultHomeRedirect=www.pippo.it&showMore_message=more text...", function (error, response, body) {
        return res.send(body);
    });

});

module.exports = router;
