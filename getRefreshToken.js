const express = require('express');
const axios = require('axios')

const app = express();
const port = 3000;

const CLIENT_ID = '1000.KEBQXHD7HKL3F2RDRS0I3HNG1PES9W';
const CLIENT_SECRET = 'ca24ffdd275fb83d07fe63d6b766ac7e7ac016aa56';
const SCOPE = 'ZohoCRM.modules.ALL,ZohoCRM.coql.READ';

app.get('/', (req, res) => {
    let params = `https%3A%2F%2Faccounts.zoho.com%2Foauth%2Fv2%2Fauth%3Fscope%3D${SCOPE}%26client_id%3D${CLIENT_ID}%26response_type%3Dcode%26access_type%3Doffline%26redirect_uri%3Dhttp%3A%2F%2Flocalhost%3A3000%2Foauth`;
    res.redirect('https://accounts.zoho.in/signin?&serviceurl='+params);
})

app.get('/oauth', (req, res) => {
    // Neccessary for API Call
    let code = req.query.code;
    let accountServer = req.query['accounts-server'];
    
    let options = {
        method:'POST',
        url: `${accountServer}/oauth/v2/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=http://localhost:3000/oauth&code=${code}`
        }

    axios(options)
    .then(resp => {
        
        console.log(resp.data);
        return resp.data.refresh_token;
    })
    .then(token =>{
        res.send(`Refresh Token: ${token}`);
    })
    .catch(err =>{
        res.send(err);
    })
});

app.listen(port, () => {
  console.log(`listening at Port: ${port}`)
})