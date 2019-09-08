/*
* Adding Environment Configuration For App
*/
var environments = {};

environments.staging ={
    port:4500,
    envName:'staging'
};
environments.production = {
    port:5000,
    envName:'production'
};
var choosenEnv = typeof(process.env.NODE_ENV) =='string' ? process.env.NODE_ENV : '';
var environmentToExport = typeof(environments[choosenEnv])=='object' ? environments[choosenEnv] : environments['staging'];

// Export the environment configuration
module.exports = environmentToExport; 