const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
const API_KEY = require('./apiKey');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());


server.post('/get-bitcoin-price', (req, res) => {
    const currency = req.body.result && req.body.result.parameters && req.body.result.parameters.currency-name ? req.body.result.parameters.movie : 'usd';
    const reqUrl = encodeURI(`https://api.coindesk.com/v1/bpi/currentprice.json`);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const data = JSON.parse(completeResponse);
            let dataToSend = 'Heres the info:';

            if(currency == 'usd'){
                  dataToSend += `${data.USD}`;
            }
            else if(currency == 'eur'){
                dataToSend += `${data.GBP}`;
            }
            else{
                dataToSend += `${data.EUR}`;
            }


            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-bitcoin-price'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-bitcoin-price'
        });
    });
});

server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});
