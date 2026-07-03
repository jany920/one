const { mod, STEMS, BRANCHES } = require('./constants');
const { bornSihua } = require('./sihua');
function daxianByPalaceIndex(ju, forward){ const out={}; for(let i=0;i<12;i++){ const palaceOrder = forward ? mod(-i,12) : i; out[palaceOrder]=`${ju+10*i}~${ju+10*i+9}`; } return out; }
function triadStart(b){ if([2,6,10].includes(b)) return 4; if([8,0,4].includes(b)) return 10; if([5,9,1].includes(b)) return 7; return 1; }
function agesByBranch(ageRange, branchFn){ const [a,b]=ageRange; const out=Array.from({length:12},()=>[]); for(let n=a;n<=b;n++) out[branchFn(n)].push(n); return out; }
function xiaoxian(yearBranch, gender, ageRange){ const start=triadStart(yearBranch); const dir=gender==='male'?1:-1; return agesByBranch(ageRange, n=>mod(start+dir*(n-1))); }
function liunian(yearBranch, ageRange){ return agesByBranch(ageRange, n=>mod(yearBranch+n-1)); }
function ganzhiForYear(year){ const offset = year - 1984; return `${STEMS[mod(offset,10)]}${BRANCHES[mod(offset,12)]}`; }
function parseDaxian(range){ const [start,end]=range.split('~').map(Number); return { startAge:start, endAge:end }; }
function fateYears(palaces, dxMap, cal){ const birthYear = Number(cal.solar.slice(0,4)); return palaces.map((p, i)=>{ const {startAge,endAge}=parseDaxian(dxMap[i]); const startYear = birthYear + startAge - 2; const endYear = birthYear + endAge - 2; return { index:i+1, palace:p.name, palace_ganzhi:p.ganzhi, start_age:startAge, end_age:endAge, start_year:startYear, end_year:endYear, sihua:bornSihua(p.stem), years:Array.from({length:endAge-startAge+1}, (_,k)=>{ const year=startYear+k; const gz=ganzhiForYear(year); const age=startAge+k; return { year, ganzhi:gz, age, ming_ganzhi:palaces.find(pp=>pp.branchIndex===mod(cal.yearBranchIndex+age-1))?.ganzhi, sihua:bornSihua(gz[0]) }; }) }; }).sort((a,b)=>a.start_age-b.start_age); }
module.exports={ daxianByPalaceIndex, xiaoxian, liunian, fateYears, ganzhiForYear };
