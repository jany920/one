const { buildChart } = require('../engine');

const chart = buildChart({
  gender: 'female',
  calendar: 'solar',
  datetime: '1992-01-18T02:15',
  longitude: 108.933,
  timezone: '+08:00',
  options: { true_solar_time: true, equation_of_time: true, age_range: [1, 60] },
});
const palace = name => chart.palaces.find(p => p.name === name);
const starNames = p => [...p.majors, ...p.aux].map(s => s.name);
const transforms = (p, star) => [...p.majors, ...p.aux].find(s => s.name === star)?.transforms || [];

describe('1992 Wenmo Tianji acceptance fixture', () => {
  it('computes the published base metadata', () => {
    expect(chart.meta).toMatchObject({
      gender: '女',
      solar: '1992-01-18 02:15',
      true_solar: '1992-01-18 01:20',
      lunar: '辛未年腊月十四丑时',
      four_pillars: '辛未 辛丑 癸巳 癸丑',
      wuxing_ju: '土五局',
      ming_gong: '子',
      shen_gong: '寅',
      ming_zhu: '贪狼',
      shen_zhu: '天相',
      fate_period_count: 12,
      fate_year_count: 120,
    });
  });

  it('renders all twelve palaces and key stars from the specification', () => {
    expect(chart.palaces).toHaveLength(12);
    expect(palace('命宫').ganzhi).toBe('庚子');
    expect(starNames(palace('命宫'))).toEqual(expect.arrayContaining(['太阳', '地劫']));
    expect(starNames(palace('福德'))).toEqual(expect.arrayContaining(['天机', '太阴', '天钺']));
    expect(palace('福德').tags).toContain('身宫');
    expect(starNames(palace('田宅'))).toEqual(expect.arrayContaining(['紫微', '贪狼', '左辅']));
    expect(starNames(palace('夫妻'))).toEqual(expect.arrayContaining(['天同', '擎羊', '火星', '地空']));
  });

  it('applies born sihua and self transforms used by the page', () => {
    expect(chart.born_sihua).toEqual({ 禄: '巨门', 权: '太阳', 科: '文曲', 忌: '文昌' });
    expect(transforms(palace('命宫'), '太阳')).toEqual(expect.arrayContaining(['生年权', '自化离心禄', '自化向心忌']));
    expect(transforms(palace('交友'), '文曲')).toEqual(expect.arrayContaining(['生年科', '自化向心忌']));
    expect(transforms(palace('子女'), '文昌')).toEqual(expect.arrayContaining(['生年忌', '自化向心忌']));
  });

  it('builds the full twelve major periods and 120 annual records', () => {
    expect(chart.fate_periods).toHaveLength(12);
    expect(chart.fate_periods.flatMap(p => p.years)).toHaveLength(120);
    expect(chart.fate_periods[0]).toMatchObject({ palace: '命宫', palace_ganzhi: '庚子', start_age: 5, end_age: 14, start_year: 1995, end_year: 2004, sihua: { 禄: '太阳', 权: '武曲', 科: '太阴', 忌: '天同' } });
    expect(chart.fate_periods[3]).toMatchObject({ palace: '田宅', palace_ganzhi: '辛卯', start_year: 2025, end_year: 2034, sihua: { 禄: '巨门', 权: '太阳', 科: '文曲', 忌: '文昌' } });
    expect(chart.fate_periods[3].years[1]).toMatchObject({ year: 2026, ganzhi: '丙午', age: 36, ming_ganzhi: '甲午', sihua: { 禄: '天同', 权: '天机', 科: '文昌', 忌: '廉贞' } });
  });
});
