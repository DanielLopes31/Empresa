/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   EmailJS CONFIG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const EJ_PK = 'Ffz5TXgaZhPmuWLEm';
const EJ_SVC = 'service_y6hvjjs';
const EJ_TPL = 'template_xsnta2r';
try { emailjs.init({ publicKey: EJ_PK }); } catch (e) { }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SCROLL REVEAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const rvObs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: .1 });
document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(() => {
    const rail = document.getElementById('tl-rail');
    const fill = document.getElementById('tl-fill');
    const steps = [1, 2, 3, 4].map(n => document.getElementById('ts' + n));
    function tick() {
        if (!fill || !rail) return;
        const r = rail.getBoundingClientRect();
        const h = window.innerHeight;
        const p = Math.max(0, Math.min(1, (h - r.top) / (r.height + h * .5)));
        fill.style.height = Math.round(p * rail.offsetHeight) + 'px';
        steps.forEach(s => {
            if (!s) return;
            const d = s.querySelector('.ts-dot');
            const dc = d.getBoundingClientRect();
            s.classList.toggle('on', dc.top + dc.height / 2 < h * .77);
        });
    }
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    tick();
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PHONE MASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
document.getElementById('i-tel').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) v = v.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})$/,
        (_, a, b, c) => a ? (b ? `(${a}) ${b}` + (c ? `-${c}` : '') : `(${a}`) : '');
    else v = v.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
    this.value = v;
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PRODUCT CHECKBOXES (produtos + serviços)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
document.querySelectorAll('.pitem').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('on');
    });
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONTACT PILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
let selContact = 'whatsapp';
document.querySelectorAll('.cpill').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelectorAll('.cpill').forEach(b => b.classList.remove('on'));
        this.classList.add('on');
        selContact = this.dataset.v;
    });
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PERIOD OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
let selPeriod = '';
document.querySelectorAll('.per-opt').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelectorAll('.per-opt').forEach(b => b.classList.remove('on'));
        this.classList.add('on');
        selPeriod = this.dataset.v;
        document.getElementById('per-err').classList.remove('on');
    });
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TERMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
let termsOk = false;
document.getElementById('terms-btn').addEventListener('click', function (e) {
    if (e.target.tagName === 'A') return;
    e.stopPropagation();
    termsOk = !termsOk;
    this.classList.toggle('on', termsOk);
    document.getElementById('terms-err').classList.remove('on');
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VALIDAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function gv(id) { return (document.getElementById(id) || {}).value || ''; }
function setF(id, hid, state, msg) {
    const el = document.getElementById(id), h = document.getElementById(hid);
    if (!el || !h) return;
    el.classList.remove('ok', 'err');
    h.classList.remove('on', 'ok', 'err');
    if (state) { el.classList.add(state); if (msg) { h.textContent = msg; h.classList.add('on', state); } }
}
function v1() {
    let ok = true;
    const nm = gv('i-nome').trim(), em = gv('i-email').trim(), ph = gv('i-tel').replace(/\D/g, ''), ci = gv('i-cidade').trim();
    if (nm.length < 3) { setF('i-nome', 'h-nome', 'err', 'Insira seu nome completo'); ok = false; }
    else setF('i-nome', 'h-nome', 'ok', '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setF('i-email', 'h-email', 'err', 'E-mail inválido'); ok = false; }
    else setF('i-email', 'h-email', 'ok', '');
    if (ph.length < 10) { setF('i-tel', 'h-tel', 'err', 'Telefone inválido'); ok = false; }
    else setF('i-tel', 'h-tel', 'ok', '');
    if (ci.length < 2) { setF('i-cidade', 'h-cidade', 'err', 'Informe cidade ou bairro'); ok = false; }
    else setF('i-cidade', 'h-cidade', 'ok', '');
    return ok;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STEP NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
let curStep = 1;
function goStep(n) {
    const err = document.getElementById('f-err');
    if (n > curStep) {
        if (curStep === 1 && !v1()) { err.classList.add('on'); return; }
        if (curStep === 2 && !selPeriod) { document.getElementById('per-err').classList.add('on'); return; }
        if (n === 3) fillSum();
    }
    err.classList.remove('on');
    [1, 2, 3].forEach(i => {
        document.getElementById('fs' + i).classList.toggle('on', i === n);
        const s = document.getElementById('sp' + i);
        s.classList.remove('cur', 'done');
        if (i < n) s.classList.add('done');
        else if (i === n) s.classList.add('cur');
    });
    curStep = n;
    document.getElementById('agendar').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('btn1').addEventListener('click', () => goStep(2));
document.getElementById('btn-bk2').addEventListener('click', () => goStep(1));
document.getElementById('btn2').addEventListener('click', () => goStep(3));
document.getElementById('btn-bk3').addEventListener('click', () => goStep(2));

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FILL SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function getSelectedItems() {
    return [...document.querySelectorAll('.pitem.on')].map(b => {
        // Remove emoji prefix from label if present
        return b.querySelector('.pitem-lbl').textContent.replace(/^[^\w]+/, '').trim();
    });
}

function fillSum() {
    const cm = { whatsapp: 'WhatsApp', telefone: 'Telefone', email: 'E-mail' };
    const pm = { manha: 'Manhã (8h–12h)', tarde: 'Tarde (12h–18h)', qualquer: 'Qualquer horário' };
    const items = getSelectedItems();
    const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    s('sv-nome', gv('i-nome').trim());
    s('sv-email', gv('i-email').trim());
    s('sv-tel', gv('i-tel').trim());
    s('sv-cidade', gv('i-cidade').trim());
    s('sv-prod', items.length ? items.join(', ') : 'Não selecionado');
    s('sv-cont', cm[selContact] || selContact);
    s('sv-per', pm[selPeriod] || '—');
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SUBMIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
document.getElementById('btn-sub').addEventListener('click', function () {
    if (!termsOk) { document.getElementById('terms-err').classList.add('on'); return; }
    const btn = this;
    btn.classList.add('loading'); btn.disabled = true;

    const cm = { whatsapp: 'WhatsApp', telefone: 'Telefone', email: 'E-mail' };
    const pm = { manha: 'Manhã (8h–12h)', tarde: 'Tarde (12h–18h)', qualquer: 'Qualquer horário' };
    const items = getSelectedItems();

    const params = {
        nome: gv('i-nome').trim(),
        email: gv('i-email').trim(),
        telefone: gv('i-tel').trim(),
        cidade: gv('i-cidade').trim(),
        produtos: items.length ? items.join(', ') : 'Não selecionado',
        contato: cm[selContact] || selContact,
        periodo: pm[selPeriod] || '—',
        mensagem: gv('i-msg').trim() || '(nenhuma)',
        to_email: 'artplenapersianas@gmail.com'
    };

    window._wamsg =
        `Olá! Me chamo *${params.nome}* e acabei de agendar uma visita pelo site 📅\n\n` +
        `📱 Telefone: ${params.telefone}\n✉️ E-mail: ${params.email}\n` +
        `📍 Cidade: ${params.cidade}\n🛍️ Interesse: ${params.produtos}\n` +
        `📞 Contato preferido: ${params.contato}\n🕐 Período: ${params.periodo}` +
        (params.mensagem !== '(nenhuma)' ? `\n💬 ${params.mensagem}` : '');

    emailjs.send(EJ_SVC, EJ_TPL, params)
        .finally(() => {
            btn.classList.remove('loading'); btn.disabled = false;
            document.getElementById('sn').textContent = params.nome.split(' ')[0];
            showSuccess();
        });
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SUCCESS MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function showSuccess() {
    const ov = document.getElementById('succ-ov');
    ov.classList.add('on');
    document.body.style.overflow = 'hidden';
    spawnConf();
}
document.getElementById('btn-cl-succ').addEventListener('click', () => {
    document.getElementById('succ-ov').classList.remove('on');
    document.body.style.overflow = '';
});
document.getElementById('btn-wa-succ').addEventListener('click', () => {
    window.open('https://wa.me/5511921093849?text=' + encodeURIComponent(window._wamsg || 'Olá!'), '_blank');
    document.getElementById('succ-ov').classList.remove('on');
    document.body.style.overflow = '';
});
document.getElementById('succ-ov').addEventListener('click', function (e) {
    if (e.target === this) { this.classList.remove('on'); document.body.style.overflow = ''; }
});

function spawnConf() {
    const c = document.getElementById('conf');
    c.innerHTML = '';
    const cols = ['#F5C400', '#FFD93D', '#C9A000', '#fff', '#FFF8C0', '#FFED4A'];
    for (let i = 0; i < 22; i++) {
        const s = document.createElement('span');
        const sz = 5 + Math.random() * 7;
        s.style.cssText = `
            background:${cols[i % cols.length]};
            left:${4 + Math.random() * 92}%;top:-8px;
            width:${sz}px;height:${sz}px;
            animation-delay:${Math.random() * .55}s;
            animation-duration:${.85 + Math.random() * .55}s;
        `;
        c.appendChild(s);
    }
}