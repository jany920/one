const { buildChart } = require('../engine');
const { branchName } = require('../engine/constants');

const input = { gender:'female', calendar:'solar', datetime:'1983-01-19T20:00', longitude:121.467, timezone:'+08:00', options:{ true_solar_time:true, year_boundary:'lunar_new_year', leap_month_rule:'split_half', equation_of_time:false, age_range:[1,60] } };
const chart = buildChart(input);
const palace = name => chart.palaces.find(p => p.name === name);
const starBranch = star => { const p = chart.palaces.find(p => [...p.majors, ...p.aux].some(s => s.name === star)); return p.branch; };
const star = (palaceName, starName) => [...palace(palaceName).majors, ...palace(palaceName).aux].find(s => s.name === starName);

describe('1983 golden Zi Wei chart', () => {
  it('computes key meta values', () => {
    expect(chart.meta.lunar).toBe('壬戌年腊月初六戌时');
    expect(chart.meta.ming_gong).toBe('卯');
    expect(chart.meta.shen_gong).toBe('亥');
    expect(chart.meta.wuxing_ju).toBe('金四局');
    expect(chart.meta.ming_zhu).toBe('文曲');
    expect(chart.meta.shen_zhu).toBe('文昌');
    expect(chart.meta.true_solar).toBe('1983-01-19 20:06');
  });

  it('assigns palace stems', () => {
    const expected = { 子:'壬', 丑:'癸', 寅:'壬', 卯:'癸', 辰:'甲', 巳:'乙', 午:'丙', 未:'丁', 申:'戊', 酉:'己', 戌:'庚', 亥:'辛' };
    const actual = Object.fromEntries(chart.palaces.map(p => [p.branch, p.stem]));
    expect(actual).toEqual(expected);
  });

  it('places fourteen major stars', () => {
    expect(Object.fromEntries(['紫微','天府','天机','太阴','太阳','贪狼','武曲','巨门','天同','天相','廉贞','天梁','破军','七杀'].map(s => [s, starBranch(s)]))).toEqual({ 紫微:'巳', 天府:'亥', 天机:'辰', 太阴:'子', 太阳:'寅', 贪狼:'丑', 武曲:'丑', 巨门:'寅', 天同:'子', 天相:'卯', 廉贞:'酉', 天梁:'辰', 破军:'酉', 七杀:'巳' });
  });

  it('places auxiliary stars', () => {
    expect(Object.fromEntries(['禄存','擎羊','陀罗','天魁','天钺','文昌','文曲','左辅','右弼','火星','铃星','地劫','地空','天马'].map(s => [s, starBranch(s)]))).toEqual({ 禄存:'亥', 擎羊:'子', 陀罗:'戌', 天魁:'卯', 天钺:'巳', 文昌:'子', 文曲:'寅', 左辅:'卯', 右弼:'亥', 火星:'亥', 铃星:'丑', 地劫:'酉', 地空:'丑', 天马:'申' });
  });

  it('applies born and self transforms', () => {
    expect(chart.born_sihua).toEqual({ 禄:'天梁', 权:'紫微', 科:'左辅', 忌:'武曲' });
    expect(star('子女', '天同').transforms).toContain('自化向心禄');
    expect(star('子女', '文昌').transforms).toContain('自化向心科');
    expect(star('夫妻', '贪狼').transforms).toContain('自化离心忌');
    expect(star('福德', '紫微').transforms).toContain('自化离心科');
    expect(star('迁移', '破军').transforms).toContain('自化向心禄');
  });

  it('computes shensha and fate periods', () => {
    expect(palace('命宫').shensha).toMatchObject({ changsheng:'冠带', boshi:'病符', suiqian:'小耗', jiangqian:'咸池' });
    expect(palace('财帛').shensha.boshi).toBe('博士');
    expect(palace('命宫').daxian).toBe('4~13');
    expect(palace('财帛').daxian).toBe('44~53');
    expect(palace('命宫').xiaoxian).toEqual([2,14,26,38,50]);
    expect(palace('疾厄').liunian).toEqual([1,13,25,37,49]);
  });
});
