// utils/cache.js
const NodeCache = require("node-cache");


const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

module.exports = cache;
