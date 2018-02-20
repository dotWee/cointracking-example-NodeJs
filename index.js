var crypto = require('crypto');
var fetch = require('node-fetch');
var moment = require('moment');
var FormData = require('form-data');
var http_build_query = require('qhttp/http_build_query');
var jsonfile = require('jsonfile');

const config = require('./config.json');
const url = "https://cointracking.info/api/v1/";

async function coinTracking(method, params) {
    params.method = method;
    params.nonce = moment().unix();

    var post_data = http_build_query(params, {leave_brackets: false});

    var hash = crypto.createHmac('sha512', config.secret);
    hash.update(post_data);
    var sign = hash.digest('hex');

    var headers =  { 'Key': config.key, 'Sign': sign};

    var form = new FormData();
    for(var paramKey in params) {
        var value = params[paramKey];
        form.append(paramKey, value);
    }

    var result = await fetch(url, {
        method: 'POST',
        body:   form,
        headers: headers,
    });
    var json = await result.json();
    return json;
}

function writeResponse(res) {
    var file = "./" + res.method + ".json";
    jsonfile.writeFile(file, res, function (err) {
        console.error(err)
    });
}

async function getTrades() {
    var params={};
    
    // optional parameter
    /*
    params.limit=200;
    params.order='DESC';
    params.start=1518029160;
    params.end=1518029160;
    */

    var res = await coinTracking('getTrades', params);
    writeResponse(res);
}

async function getBalance() {

    // no support for paramter
    var params={};

    var res = await coinTracking('getBalance', params);
    writeResponse(res);
}

async function getHistoricalSummary() {
    var params={};    

    // optional parameter
    /*
    params.btc=1;               // show as btc
    params.start=0;
    params.end=1518029160;
    */

    var res = await coinTracking('getHistoricalSummary', params);
    writeResponse(res);
}

async function getHistoricalCurrency() {
    var params={};    

    // optional parameter
    /*
    params.currency="ETH";
    params.start=0;
    params.end=1518029160;
    */

    var res = await coinTracking('getHistoricalCurrency', params);
    writeResponse(res);
}

async function getGroupedBalance() {
    var params={};    

    // optional parameter
    /*
    params.group="exchange";
    params.exclude_dep_with=1;
    params.type="Trade";
    */

    var res = await coinTracking('getGroupedBalance', params);
    writeResponse(res);
}

async function getGains() {
    var params={};    

    // optional parameter
    /*
    params.method="FIFO";
    params.price="transaction";
    params.exclude_dep_with=1;
    params.costbasis="all";
    params.btc=1;
    */

    var res = await coinTracking('getGains', params);
    writeResponse(res);
}

// uncomment to execute
getTrades();
//getBalance();
//getHistoricalSummary();
//getHistoricalCurrency();
//getGroupedBalance();
//getGains();