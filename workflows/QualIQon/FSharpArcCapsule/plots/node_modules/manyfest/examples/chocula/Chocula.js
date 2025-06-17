let libManyfest = require('../../source/Manyfest.js');

let dataArchiveOrg = require(`./Data-Archive-org-Frankenberry.json`);
let schemaArchiveOrg = require(`./Schema-Archive-org-Item.json`);

let _Schema = new libManyfest(schemaArchiveOrg);

console.log(`The URL for "${_Schema.getValueByHash(dataArchiveOrg,'Title')}" is: ${_Schema.getValueByHash(dataArchiveOrg,'Server')}${_Schema.getValueByHash(dataArchiveOrg,'Path')}`);
