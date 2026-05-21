/* ═══════════════════════════════════════════════════════
   SECURITY LAYER — Art Plena Persianas
   Camadas: anti-devtools, anti-inspect, console trap,
   debugger loop, teclado bloqueado, clique direito off
═══════════════════════════════════════════════════════ */
; (function (w, d) {
  'use strict';

  /* ── 1. DESABILITA CLIQUE DIREITO ─────────────────── */
  d.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

  /* ── 2. BLOQUEIA ATALHOS DE TECLADO ───────────────── */
  d.addEventListener('keydown', function (e) {
    const k = e.keyCode || e.which;

    // F12
    if (k === 123) { e.preventDefault(); return false; }

    if (e.ctrlKey || e.metaKey) {
      // Ctrl+Shift+I / J / C  (DevTools)
      if (e.shiftKey && (k === 73 || k === 74 || k === 67)) {
        e.preventDefault(); return false;
      }
      // Ctrl+U  (ver fonte)
      if (k === 85) { e.preventDefault(); return false; }
      // Ctrl+S  (salvar página)
      if (k === 83) { e.preventDefault(); return false; }
      // Ctrl+P  (imprimir / salvar PDF com fonte visível)
      if (k === 80) { e.preventDefault(); return false; }
    }
  }, true);

  /* ── 3. OVERLAY DE BLOQUEIO ───────────────────────── */
  function criaOverlay() {
    if (d.getElementById('__ap_sec__')) return;
    d.body.style.filter = 'blur(12px) brightness(0.4)';
    d.body.style.pointerEvents = 'none';

    const ov = d.createElement('div');
    ov.id = '__ap_sec__';
    Object.assign(ov.style, {
      position: 'fixed', inset: '0', zIndex: '2147483647',
      background: 'rgba(8,8,8,0.97)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat,sans-serif', textAlign: 'center',
      padding: '2rem', userSelect: 'none',
    });

    ov.innerHTML = `
      <div style="font-size:3rem;margin-bottom:1rem">🔒</div>
      <div style="font-size:1.3rem;font-weight:800;color:#F0B429;
                  letter-spacing:.1em;text-transform:uppercase;margin-bottom:.5rem">
        Acesso Restrito
      </div>
      <div style="font-size:.85rem;color:rgba(255,255,255,.45);max-width:320px;line-height:1.7">
        Feche as ferramentas do desenvolvedor<br>para continuar navegando.
      </div>`;

    d.body.appendChild(ov);
  }

  function removeOverlay() {
    const ov = d.getElementById('__ap_sec__');
    if (ov) ov.remove();
    d.body.style.filter = '';
    d.body.style.pointerEvents = '';
  }

  /* ── 4. DETECÇÃO DE DEVTOOLS (TAMANHO DE JANELA) ──── */
  const LIMIAR = 160;
  let devAberto = false;

  function verificaDevtools() {
    const largura = w.outerWidth - w.innerWidth > LIMIAR;
    const altura = w.outerHeight - w.innerHeight > LIMIAR;

    if (largura || altura) {
      if (!devAberto) { devAberto = true; criaOverlay(); }
    } else {
      if (devAberto) { devAberto = false; removeOverlay(); }
    }
  }

  w.addEventListener('resize', verificaDevtools, { passive: true });
  setInterval(verificaDevtools, 800);

  /* ── 5. DETECÇÃO VIA PERFORMANCE (DEBUGGER TIMING) ── */
  /*
     Quando o painel de Sources/Debugger está aberto,
     a instrução `debugger` pausa a execução, causando
     um delta de tempo muito alto. Detectamos isso.
  */
  function armadilaDebugger() {
    const t0 = performance.now();
    /* jshint ignore:start */
    // eslint-disable-next-line no-debugger
    debugger;
    /* jshint ignore:end */
    const dt = performance.now() - t0;

    if (dt > 100) {
      // Debugger pausou — DevTools com painel aberto
      devAberto = true;
      criaOverlay();
    } else {
      if (!verificaDevSizeAtivo()) {
        devAberto = false;
        removeOverlay();
      }
    }
  }

  function verificaDevSizeAtivo() {
    return (
      w.outerWidth - w.innerWidth > LIMIAR ||
      w.outerHeight - w.innerHeight > LIMIAR
    );
  }

  // Roda a cada 3 s para não degradar performance
  setInterval(armadilaDebugger, 3000);

  /* ── 6. CONSOLE TRAP (limpa + aviso persistente) ──── */
  const MSG_ESTILO_TITULO = [
    'color:#F0B429',
    'font-size:1.4rem',
    'font-weight:900',
    'background:#0E0E0E',
    'padding:6px 16px',
    'border-radius:4px',
  ].join(';');

  const MSG_ESTILO_CORPO = [
    'color:rgba(255,255,255,.55)',
    'font-size:.85rem',
    'background:#0E0E0E',
    'padding:4px 12px',
  ].join(';');

  function avisoConsole() {
    console.clear();
    console.log('%c⛔  ATENÇÃO', MSG_ESTILO_TITULO);
    console.log('%cEste console é restrito. Acesso não autorizado ao código fonte é proibido.', MSG_ESTILO_CORPO);
    console.log('%c© 2026 Art Plena Persianas — Todos os direitos reservados.', MSG_ESTILO_CORPO);
  }

  avisoConsole();
  setInterval(avisoConsole, 2500);

  /* ── 7. OBFUSCA REFERÊNCIAS SENSÍVEIS NO DOM ─────── */
  /*
     As chaves do EmailJS ficam no script.js em texto claro.
     Aqui sobrescrevemos os nomes de variáveis visíveis no
     painel Elements → Event Listeners com descriptors
     não-enumeráveis para dificultar a leitura em inspeção.
  */
  (function mascararGlobais() {
    const alvo = ['EJ_PK', 'EJ_SVC', 'EJ_TPL'];
    alvo.forEach(function (nome) {
      if (!(nome in w)) return;
      const valor = w[nome];
      try {
        Object.defineProperty(w, nome, {
          get: function () { return valor; },
          enumerable: false,
          configurable: false,
        });
      } catch (_) { }
    });
  })();

  /* ── 8. ANTI ARRASTAR / SELECIONAR TEXTO (UI) ────── */
  d.addEventListener('dragstart', function (e) { e.preventDefault(); });

  // Desativa seleção de texto fora de inputs/textareas
  d.addEventListener('selectstart', function (e) {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag !== 'input' && tag !== 'textarea') {
      e.preventDefault();
    }
  });

}(window, document));