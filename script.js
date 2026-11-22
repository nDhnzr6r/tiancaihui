// 天才会 · 页面交互

document.documentElement.classList.add('js');

/* ── 入场 ───────────────────────────────────────────── */

const groups = [
  ['#society', ['.society__aside', '.lead', '.society__columns p']],
  ['#how', ['.stairs__title', '.stair']],
  ['#figures', ['.figures__title', '.mosaic']],
  ['#questions', ['.qa-head', '.qa__row']],
  ['#claim', ['.claim__form', '.cert']],
];

const watched = [];

for (const [scope, selectors] of groups) {
  const root = document.querySelector(scope);
  if (!root) continue;
  selectors.forEach((sel, s) => {
    root.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      const step = s === 0 ? 0 : Math.min(i, 3);
      if (step) el.setAttribute('data-delay', String(step));
      watched.push(el);
    });
  });
}

if ('IntersectionObserver' in window && watched.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
  );
  watched.forEach((el) => io.observe(el));
} else {
  watched.forEach((el) => el.classList.add('is-in'));
}

/* ── 授予书 ─────────────────────────────────────────── */

const form = document.getElementById('claim-form');
const input = document.getElementById('claim-name');
const hint = document.getElementById('claim-hint');
const nameOut = document.getElementById('cert-name');
const noOut = document.getElementById('cert-no');
const dateOut = document.getElementById('cert-date');
const cert = document.getElementById('cert');
const saveBtn = document.getElementById('save-cert');

const palette = {
  paper: '#f2ece0',
  ink: '#101218',
  blue: '#1423b8',
  sun: '#f7dd47',
  quiet: '#6a6350',
};

let holder = '';

function today() {
  const d = new Date();
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

function serial(name) {
  let h = 7;
  for (const ch of name) h = (Math.imul(h, 131) + ch.codePointAt(0)) >>> 0;
  const hex = h.toString(16).toUpperCase().padStart(8, '0');
  return `TC-${hex.slice(0, 4)}-${hex.slice(4)}`;
}

function render(name) {
  holder = name;
  nameOut.textContent = name || '天\u00a0才';
  nameOut.style.fontSize = name.length > 6 ? 'clamp(26px, 3.2vw, 42px)' : '';
  noOut.textContent = `编号 ${serial(name || '天才')}`;
  dateOut.textContent = today();
}

dateOut.textContent = today();
render('');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = input.value.trim().slice(0, 12);

  if (!name) {
    hint.textContent = '先写一个名字，本会才好称呼你。';
    input.focus();
    return;
  }

  render(name);
  descramble();
  hint.textContent = `好，${name}。这是你的授予书。`;
});

input.addEventListener('input', () => {
  if (hint.textContent) hint.textContent = '';
});

function descramble() {
  cert.classList.remove('is-stamped');
  void cert.offsetWidth;
  cert.classList.add('is-stamped');
}

/* ── 保存图片 ───────────────────────────────────────── */

const SERIF = '"Noto Serif SC", "Source Han Serif SC", "Songti SC", SimSun, serif';

function fitText(g, text, max, size, weight = '500') {
  let s = size;
  do {
    g.font = `${weight} ${s}px ${SERIF}`;
    if (g.measureText(text).width <= max) break;
    s -= 4;
  } while (s > 20);
  return s;
}

saveBtn.addEventListener('click', async () => {
  saveBtn.disabled = true;
  saveBtn.textContent = '正在生成';

  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;

    const W = 1240;
    const H = 1560;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const g = canvas.getContext('2d');

    g.fillStyle = palette.paper;
    g.fillRect(0, 0, W, H);

    // 双层边框
    g.strokeStyle = palette.blue;
    g.lineWidth = 3;
    g.strokeRect(46, 46, W - 92, H - 92);
    g.lineWidth = 1;
    g.strokeRect(60, 60, W - 120, H - 120);

    const left = 108;
    const innerW = W - left * 2;

    // 会名
    g.fillStyle = palette.blue;
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    g.font = `500 34px ${SERIF}`;
    g.letterSpacing = '12px';
    g.fillText('天才会', left, 200);
    g.letterSpacing = '0px';

    g.fillStyle = palette.quiet;
    g.font = `400 20px ${SERIF}`;
    g.letterSpacing = '9px';
    g.fillText('称号授予书', left, 246);
    g.letterSpacing = '0px';

    // 名字
    const name = holder || '天才';
    const size = fitText(g, name, innerW, 104);
    g.font = `500 ${size}px ${SERIF}`;
    g.fillStyle = palette.ink;
    g.textAlign = 'center';
    g.fillText(name, W / 2, H * 0.46);

    // 说明
    g.textAlign = 'left';
    g.fillStyle = '#3d392e';
    g.font = `400 22px ${SERIF}`;
    const lines = ['兹证明以上这位，自即日起在本会享有', '天才之称号，无需考核，无需续期。'];
    lines.forEach((line, i) => g.fillText(line, left, H - 330 + i * 40));

    // 落款
    g.fillStyle = palette.quiet;
    g.font = `400 19px ${SERIF}`;
    g.fillText(`编号 ${serial(name)}`, left, H - 180);
    g.textAlign = 'right';
    g.fillText(dateOut.textContent, W - left, H - 180);
    g.textAlign = 'left';

    // 印章
    const cx = W - 190;
    const cy = H - 300;
    const r = 62;
    g.save();
    g.translate(cx, cy);
    g.rotate((-8 * Math.PI) / 180);
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.fillStyle = palette.sun;
    g.fill();
    g.lineWidth = 4;
    g.strokeStyle = palette.blue;
    g.stroke();
    g.fillStyle = palette.blue;
    g.font = `700 34px ${SERIF}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.letterSpacing = '4px';
    g.fillText('天才', 2, 2);
    g.restore();

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `天才会-${name}-授予书.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, 'image/png');
  } catch (error) {
    hint.textContent = '这一下没生成成功，再点一次试试。';
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = '保存图片';
  }
});
