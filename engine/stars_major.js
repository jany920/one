const { mod } = require('./constants');
function locateZiwei(ju,d){ let q=Math.floor(d/ju); let r=d%ju; if(r===0) return mod(2+q-1,12); q+=1; const gap=ju-r; const base=mod(2+q-1,12); return gap%2===0?mod(base+gap,12):mod(base-gap,12); }
function majorStars(ju,d){ const z=locateZiwei(ju,d); const f=mod(4-z,12); return {紫微:z,天机:mod(z-1,12),太阳:mod(z-3,12),武曲:mod(z-4,12),天同:mod(z-5,12),廉贞:mod(z-8,12),天府:f,太阴:mod(f+1,12),贪狼:mod(f+2,12),巨门:mod(f+3,12),天相:mod(f+4,12),天梁:mod(f+5,12),七杀:mod(f+6,12),破军:mod(f+10,12)}; }
module.exports={ locateZiwei, majorStars };
