// backend/cache.js
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 }); // 5 min TTL
module.exports = cache;
