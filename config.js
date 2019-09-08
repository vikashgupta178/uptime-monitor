/*
* Adding Environment Configuration For App
*/
var environments = {};

environments.staging ={
    httpPort:4500,
    httpsPort:4501,
    envName:'staging'
};
environments.production = {
    httpPort:5000,
    httpsPort:5001,
    envName:'production'
};
var choosenEnv = typeof(process.env.NODE_ENV) =='string' ? process.env.NODE_ENV : '';
var environmentToExport = typeof(environments[choosenEnv])=='object' ? environments[choosenEnv] : environments['staging'];

// Export the environment configuration
module.exports = environmentToExport; 