const { mod, branchName, stemName, stemIndex, branchIndex, PALACE_NAMES } = require('./constants');
const NAYIN = ['海中金','海中金','炉中火','炉中火','大林木','大林木','路旁土','路旁土','剑锋金','剑锋金','山头火','山头火','涧下水','涧下水','城头土','城头土','白蜡金','白蜡金','杨柳木','杨柳木','泉中水','泉中水','屋上土','屋上土','霹雳火','霹雳火','松柏木','松柏木','长流水','长流水','砂中金','砂中金','山下火','山下火','平地木','平地木','壁上土','壁上土','金箔金','金箔金','佛灯火','佛灯火','天河水','天河水','大驿土','大驿土','钗钏金','钗钏金','桑柘木','桑柘木','大溪水','大溪水','沙中土','沙中土','天上火','天上火','石榴木','石榴木','大海水','大海水'];
const JU = {水:['水二局',2],木:['木三局',3],金:['金四局',4],土:['土五局',5],火:['火六局',6]};
function palaceStemIndex(yearStem, branch) { const map={甲:2,己:2,乙:4,庚:4,丙:6,辛:6,丁:8,壬:8,戊:0,癸:0}; return mod(map[yearStem] + mod(branch - 2,12), 10); }
function mingShen(month,h) { return { ming: mod(2+month-1-h,12), shen: mod(2+month-1+h,12) }; }
function buildPalaces(ming,shen,yearStem) { return PALACE_NAMES.map((name,i)=>{ const branch=mod(ming-i,12); const stem=stemName(palaceStemIndex(yearStem, branch)); const tags=[name]; if (branch===shen) tags.push('身宫'); return { name, branchIndex:branch, branch:branchName(branch), stem, ganzhi:`${stem}${branchName(branch)}`, tags }; }); }
function wuxingJu(stem, branch) { let cyc = 0; while (cyc < 60 && (cyc % 10 !== stemIndex(stem) || cyc % 12 !== branchIndex(branch))) cyc += 1; const element=NAYIN[cyc].slice(-1); const [name,number]=JU[element]; return { name, number, nayin:NAYIN[cyc] }; }
const MING_ZHU=['贪狼','巨门','禄存','文曲','廉贞','武曲','破军','武曲','廉贞','文曲','禄存','巨门'];
const SHEN_ZHU=['火星','天相','天梁','天同','文昌','天机','火星','天相','天梁','天同','文昌','天机'];
module.exports={ palaceStemIndex, mingShen, buildPalaces, wuxingJu, mingZhu:b=>MING_ZHU[b], shenZhu:b=>SHEN_ZHU[b] };
