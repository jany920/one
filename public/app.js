const form = document.querySelector('#chart-form');
const message = document.querySelector('#message');
const summary = document.querySelector('#summary');
const palaceGrid = document.querySelector('#palaces');
const jsonOutput = document.querySelector('#json-output');
const copyButton = document.querySelector('#copy-json');
let latestJson = '';

function parseAgeRange(value) {
  const match = value.trim().match(/^(\d+)\s*[-~]\s*(\d+)$/);
  if (!match) throw new Error('年龄范围格式应为 1-60');
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) {
    throw new Error('年龄范围必须是有效的正整数区间');
  }
  return [start, end];
}

function buildInput(formData) {
  return {
    gender: formData.get('gender'),
    calendar: 'solar',
    datetime: formData.get('datetime'),
    longitude: Number(formData.get('longitude')),
    timezone: formData.get('timezone'),
    options: {
      true_solar_time: formData.get('trueSolarTime') === 'on',
      year_boundary: 'lunar_new_year',
      leap_month_rule: 'split_half',
      equation_of_time: true,
      age_range: parseAgeRange(formData.get('ageRange')),
    },
  };
}

function setMessage(text, isError = false) {
  message.hidden = !text;
  message.textContent = text;
  message.classList.toggle('error', isError);
}

function starList(stars) {
  if (stars.length === 0) return '<span class="muted">—</span>';
  return stars.map(star => {
    const transforms = star.transforms.length ? `<small>${star.transforms.join('、')}</small>` : '';
    return `<span class="star">${star.name}${transforms}</span>`;
  }).join('');
}

function renderSummary(meta, bornSihua) {
  const items = [
    ['性别', meta.gender],
    ['公历', meta.solar],
    ['真太阳时', meta.true_solar],
    ['农历', meta.lunar],
    ['四柱', meta.four_pillars],
    ['五行局', meta.wuxing_ju],
    ['命宫', meta.ming_gong],
    ['身宫', meta.shen_gong],
    ['命主', meta.ming_zhu],
    ['身主', meta.shen_zhu],
    ['大限流年', `${meta.fate_period_count || 12} 个大限 / ${meta.fate_year_count || 120} 个流年`],
  ];
  summary.innerHTML = `
    <h2>命盘摘要</h2>
    <dl>${items.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>
    <h3>生年四化</h3>
    <p class="sihua">禄：${bornSihua.禄}　权：${bornSihua.权}　科：${bornSihua.科}　忌：${bornSihua.忌}</p>
  `;
  summary.hidden = false;
}

function renderPalaces(palaces) {
  palaceGrid.innerHTML = palaces.map(palace => `
    <article class="palace-card">
      <header>
        <h3>${palace.name}</h3>
        <span>${palace.ganzhi}</span>
      </header>
      <p class="tags">${palace.tags.map(tag => `<b>${tag}</b>`).join('')}</p>
      <div class="stars"><strong>主星</strong>${starList(palace.majors)}</div>
      <div class="stars"><strong>辅曜</strong>${starList(palace.aux)}</div>
      <dl class="mini">
        <div><dt>长生</dt><dd>${palace.shensha.changsheng}</dd></div>
        <div><dt>博士</dt><dd>${palace.shensha.boshi}</dd></div>
        <div><dt>岁前</dt><dd>${palace.shensha.suiqian}</dd></div>
        <div><dt>将前</dt><dd>${palace.shensha.jiangqian}</dd></div>
        <div><dt>大限</dt><dd>${palace.daxian}</dd></div>
      </dl>
    </article>
  `).join('');
  palaceGrid.hidden = false;
}

async function generateChart(event) {
  event?.preventDefault();
  setMessage('正在生成命盘……');
  try {
    const input = buildInput(new FormData(form));
    const response = await fetch('/api/chart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || '生成失败');
    latestJson = JSON.stringify(payload, null, 2);
    jsonOutput.textContent = latestJson;
    renderSummary(payload.meta, payload.born_sihua);
    renderPalaces(payload.palaces);
    setMessage('命盘已生成。');
  } catch (error) {
    setMessage(error.message, true);
  }
}

copyButton.addEventListener('click', async () => {
  if (!latestJson) return;
  await navigator.clipboard.writeText(latestJson);
  setMessage('JSON 已复制到剪贴板。');
});
form.addEventListener('submit', generateChart);
generateChart();
