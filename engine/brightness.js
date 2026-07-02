const table = require('../data/brightness.json');
function brightness(star, branch){ return table[star]?.[branch] ?? null; }
module.exports={ brightness };
