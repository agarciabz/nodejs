const axios = require('axios');
const http = axios.create();
const express = require('express');

const failMultipleHttps =  async (req, res) => {

    try{
    const _google = http.get('http://google.es').then(res=>res.data);
    const _cities = http.get('http://localhost:3000/asdas/asd/asd/as').then(res=>res.data);

    const [google, cities] = await Promise.all([_google, _cities]);

    }
    catch (e){
        res.status(500).send(e);
    }
}


const citiesRouter = express.Router();
citiesRouter.get('/', failMultipleHttps);
module.exports = { citiesRouter };  
