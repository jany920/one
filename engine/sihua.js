const table = require('../data/sihua.json');
const { mod } = require('./constants');
function bornSihua(stem){ return table[stem]; }
function applyBornTransforms(starMap, stem){ const sihua=bornSihua(stem); for (const [t, star] of Object.entries(sihua)) starMap[star]?.transforms.push(`生年${t}`); }
function applySelfTransforms(palaces, starMap){ const branchToPalace=Object.fromEntries(palaces.map(p=>[p.branchIndex,p])); for (const p of palaces){ const sihua=table[p.stem]; for (const [t,star] of Object.entries(sihua)){ const s=starMap[star]; if(!s) continue; if(s.branchIndex===p.branchIndex) s.transforms.push(`自化离心${t}`); if(s.branchIndex===mod(p.branchIndex+6)) s.transforms.push(`自化向心${t}`); } } }
module.exports={ bornSihua, applyBornTransforms, applySelfTransforms };
