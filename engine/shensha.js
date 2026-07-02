const { mod } = require('./constants');
const CS=['长生','沐浴','冠带','临官','帝旺','衰','病','死','墓','绝','胎','养'];
const BS=['博士','力士','青龙','小耗','将军','奏书','飞廉','喜神','病符','大耗','伏兵','官府'];
const SQ=['岁建','晦气','丧门','贯索','官符','小耗','岁破','龙德','白虎','天德','吊客','病符'];
const JQ=['将星','攀鞍','岁驿','息神','华盖','劫煞','灾煞','天煞','指背','咸池','月煞','亡神'];
function triad(b, maps){ if([2,6,10].includes(b)) return maps.a; if([8,0,4].includes(b)) return maps.b; if([5,9,1].includes(b)) return maps.c; return maps.d; }
function seqMap(start, seq, forward=true){ const out={}; const dir=forward?1:-1; seq.forEach((name,i)=>out[mod(start+dir*i)]=name); return out; }
function shensha(juName, forward, lucun, yearBranch){ const csStart={水二局:8,木三局:11,金四局:5,土五局:8,火六局:2}[juName]; return { changsheng:seqMap(csStart,CS,forward), boshi:seqMap(lucun,BS,forward), suiqian:seqMap(yearBranch,SQ,true), jiangqian:seqMap(triad(yearBranch,{a:6,b:0,c:9,d:3}),JQ,true) }; }
module.exports={ shensha };
