exports.setEnvironment = (app)=>{
    app.set('port', process.env.PORT || 3000);
    app.set('whitelist', ['introduction.html', 'index.html', '/api/login', '/api/countries']);
    app.set('whitelistDynamic', ['/dynamic']);
    app.set('env', 'development');
    //app.set('env', 'prod');
};