const request = require("request");

const options = { method: 'GET',
    url: 'https://api-v3.igdb.com/games',
    headers:
        { 'cache-control': 'no-cache',
            Connection: 'keep-alive',
            'content-length': '37',
            'accept-encoding': 'gzip, deflate',
            cookie: '__cfduid=da63c1d3e5d0632fce78e709a93f897b01567501014',
            Host: 'api-v3.igdb.com',
            'Postman-Token': 'e1c314af-aa54-4eb0-9430-fea38aadbc29,f9a5d8cb-c573-4d28-9cdf-43757c76a7b4',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'User-Agent': 'PostmanRuntime/7.15.0',
            'Content-Type': 'text/plain',
            Authorization: 'Basic Yjc5MWU0NmEtNmE0Yy00ZmJkLThiYzYtMjFhZjk0NTJkMTIyOlNhc2hhMTk5M2Nvbm9y',
            'user-key': 'c437feb2cb1efb53a512834ed8a07732' },
    body: 'fields cover,name,url;\nsearch "Fifa";' };

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});


var options = { method: 'GET',
    url: 'https://api-v3.igdb.com/covers',
    headers:
        {
            cookie: '__cfduid=da63c1d3e5d0632fce78e709a93f897b01567501014',
            Host: 'api-v3.igdb.com',
            'Postman-Token': '13a3aecc-699c-4518-bc46-e4afabe8ee99,ecc0ec8d-fdb9-4393-836a-0c384d75f2dc',
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/plain',
            'user-key': 'c437feb2cb1efb53a512834ed8a07732' },
    body: 'fields image_id;\nwhere game = 2946;' };

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});
