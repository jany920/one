const { mod } = require('./constants');
function daxianByPalaceIndex(ju, forward){ const out={}; for(let i=0;i<12;i++){ const palaceOrder = forward ? mod(-i,12) : i; out[palaceOrder]=`${ju+10*i}~${ju+10*i+9}`; } return out; }
function triadStart(b){ if([2,6,10].includes(b)) return 4; if([8,0,4].includes(b)) return 10; if([5,9,1].includes(b)) return 7; return 1; }
function agesByBranch(ageRange, branchFn){ const [a,b]=ageRange; const out=Array.from({length:12},()=>[]); for(let n=a;n<=b;n++) out[branchFn(n)].push(n); return out; }
function xiaoxian(yearBranch, gender, ageRange){ const start=triadStart(yearBranch); const dir=gender==='male'?1:-1; return agesByBranch(ageRange, n=>mod(start+dir*(n-1))); }
function liunian(yearBranch, ageRange){ return agesByBranch(ageRange, n=>mod(yearBranch+n-1)); }
module.exports={ daxianByPalaceIndex, xiaoxian, liunian };
