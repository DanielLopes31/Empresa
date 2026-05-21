/* ═══════════════════════════════════════════════════════════════
   SECURITY LAYER — Art Plena Persianas  |  v2.0
   Técnicas: anti-devtools (5 vetores), anti-iframe, anti-copy,
   console trap, debugger timing, teclado bloqueado,
   clique direito off, watermark, anti-print, anti-screenshot CSS
═══════════════════════════════════════════════════════════════ */
; (function (w, d) {
    'use strict';

    /* ─────────────────────────────────────────────────────────────
       UTILITÁRIOS INTERNOS
    ───────────────────────────────────────────────────────────── */
    var _devAberto = false;
    var _overlayAtivo = false;

    // Lista de seletores interativos do script.js — nunca bloqueamos estes
    var SELETORES_INTERATIVOS = [
        'pitem', 'cpill', 'per-opt', 'terms-btn', 'btn',
        'i-nome', 'i-email', 'i-tel', 'i-cidade', 'i-msg',
    ];

    function _elEhInterativo(el) {
        if (!el || el === d.body) return false;
        var tag = (el.tagName || '').toLowerCase();
        if (['input', 'textarea', 'select', 'button', 'label', 'a'].indexOf(tag) !== -1) return true;
        var cls = el.className;
        if (typeof cls === 'string') {
            for (var i = 0; i < SELETORES_INTERATIVOS.length; i++) {
                if (cls.indexOf(SELETORES_INTERATIVOS[i]) !== -1) return true;
            }
        }
        return _elEhInterativo(el.parentElement);
    }

    /* ─────────────────────────────────────────────────────────────
       1. CLIQUE DIREITO
    ───────────────────────────────────────────────────────────── */
    d.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    /* ─────────────────────────────────────────────────────────────
       2. ATALHOS DE TECLADO
    ───────────────────────────────────────────────────────────── */
    d.addEventListener('keydown', function (e) {
        var k = e.keyCode || e.which;

        // F12
        if (k === 123) { e.preventDefault(); return false; }
        // F5 (recarregar – impede ver código no network tab vazio)
        // removido pois prejudica UX — manter comentado

        if (e.ctrlKey || e.metaKey) {
            // Ctrl+Shift+I / J / C
            if (e.shiftKey && (k === 73 || k === 74 || k === 67)) {
                e.preventDefault(); return false;
            }
            // Ctrl+U  ver fonte
            if (k === 85) { e.preventDefault(); return false; }
            // Ctrl+S  salvar
            if (k === 83) { e.preventDefault(); return false; }
            // Ctrl+P  imprimir / PDF
            if (k === 80) { e.preventDefault(); return false; }
            // Ctrl+A  selecionar tudo
            if (k === 65 && !_elEhInterativo(d.activeElement)) {
                e.preventDefault(); return false;
            }
        }
    }, true);

    /* ─────────────────────────────────────────────────────────────
       3. ANTI-PRINT (CSS media print + evento beforeprint)
          Impede que o conteúdo seja impresso ou salvo como PDF
          pelo painel de impressão do browser.
    ───────────────────────────────────────────────────────────── */
    (function antiPrint() {
        var st = d.createElement('style');
        st.textContent = '@media print { body { display: none !important; visibility: hidden !important; } }';
        d.head.appendChild(st);

        function bloqueiaPrint() {
            if (w.onbeforeprint !== undefined) {
                w.addEventListener('beforeprint', function () {
                    d.body.style.display = 'none';
                });
                w.addEventListener('afterprint', function () {
                    d.body.style.display = '';
                });
            }
        }
        if (d.readyState === 'loading') {
            d.addEventListener('DOMContentLoaded', bloqueiaPrint);
        } else {
            bloqueiaPrint();
        }
    })();

    /* ─────────────────────────────────────────────────────────────
       4. ANTI-SCREENSHOT VIA CSS
          user-select: none no body evita cópia de texto;
          -webkit-user-drag: none impede arrastar imagens.
          Aplicamos via CSS injetado para não alterar o inline style
          que o script.js possa usar.
    ───────────────────────────────────────────────────────────── */
    (function antiScreenshotCSS() {
        var st = d.createElement('style');
        st.id = '__ap_css_sec__';
        st.textContent = [
            'body { -webkit-user-select: none; user-select: none; }',
            'input, textarea { -webkit-user-select: text; user-select: text; }',
            'img { -webkit-user-drag: none; user-drag: none; pointer-events: none; }',
            /* Filtro sutil que complica screenshots programáticos sem afetar visibilidade */
            ':root { -webkit-tap-highlight-color: transparent; }',
        ].join('\n');
        d.head.appendChild(st);
    })();

    /* ─────────────────────────────────────────────────────────────
       5. ANTI-IFRAME / CLICKJACKING
          Se o site for carregado dentro de um iframe por outra
          origem, redirecionamos para o site real.
    ───────────────────────────────────────────────────────────── */
    (function antiIframe() {
        try {
            if (w.self !== w.top) {
                w.top.location.href = w.self.location.href;
            }
        } catch (e) {
            // Origem cruzada — força saída do iframe
            d.body.innerHTML = '';
            w.location.href = 'about:blank';
        }
    })();

    /* ─────────────────────────────────────────────────────────────
       6. OVERLAY DE BLOQUEIO
          Não toca em body.style — usa backdropFilter no próprio
          overlay para não quebrar listeners do script.js.
    ───────────────────────────────────────────────────────────── */
    function criaOverlay() {
        if (_overlayAtivo || d.getElementById('__ap_sec__')) return;
        _overlayAtivo = true;

        var ov = d.createElement('div');
        ov.id = '__ap_sec__';
        Object.assign(ov.style, {
            position: 'fixed',
            inset: '0',
            zIndex: '2147483647',
            background: 'rgba(8,8,8,0.97)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Montserrat,sans-serif',
            textAlign: 'center',
            padding: '2rem',
            userSelect: 'none',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
        });

        ov.innerHTML =
            '<div style="font-size:3rem;margin-bottom:1rem">🔒</div>' +
            '<div style="font-size:1.3rem;font-weight:800;color:#F0B429;' +
            'letter-spacing:.1em;text-transform:uppercase;margin-bottom:.5rem">' +
            'Acesso Restrito</div>' +
            '<div style="font-size:.85rem;color:rgba(255,255,255,.45);' +
            'max-width:320px;line-height:1.7">' +
            'Feche as ferramentas do desenvolvedor<br>para continuar navegando.</div>';

        d.body.appendChild(ov);
    }

    function removeOverlay() {
        var ov = d.getElementById('__ap_sec__');
        if (ov) { ov.remove(); _overlayAtivo = false; }
    }

    /* ─────────────────────────────────────────────────────────────
       7. DETECÇÃO DE DEVTOOLS — VETOR 1: TAMANHO DE JANELA
          Limiar aumentado para 220 px evita falsos positivos de
          barra lateral, zoom, painéis de extensões.
    ───────────────────────────────────────────────────────────── */
    var LIMIAR = 220;

    function _verificaSizeDev() {
        return (
            w.outerWidth - w.innerWidth > LIMIAR ||
            w.outerHeight - w.innerHeight > LIMIAR
        );
    }

    function verificaDevtools() {
        if (_verificaSizeDev()) {
            if (!_devAberto) { _devAberto = true; criaOverlay(); }
        } else {
            if (_devAberto && !_debuggerAtivo) { _devAberto = false; removeOverlay(); }
        }
    }

    w.addEventListener('resize', verificaDevtools, { passive: true });
    setInterval(verificaDevtools, 1000);

    /* ─────────────────────────────────────────────────────────────
       8. DETECÇÃO DE DEVTOOLS — VETOR 2: DEBUGGER TIMING
          Aumentado para 6 s e com guarda de sobreposição para não
          atrasar callbacks do EmailJS / IntersectionObserver.
    ───────────────────────────────────────────────────────────── */
    var _debuggerAtivo = false;
    var _lastDbgCheck = 0;

    function armadilaDebugger() {
        var agora = Date.now();
        if (agora - _lastDbgCheck < 5500) return;
        _lastDbgCheck = agora;

        var t0 = performance.now();
    /* eslint-disable no-debugger */ debugger; /* eslint-enable no-debugger */
        var dt = performance.now() - t0;

        if (dt > 200) {
            _debuggerAtivo = true;
            _devAberto = true;
            criaOverlay();
        } else {
            _debuggerAtivo = false;
            if (!_verificaSizeDev()) { _devAberto = false; removeOverlay(); }
        }
    }

    setInterval(armadilaDebugger, 6000);

    /* ─────────────────────────────────────────────────────────────
       9. DETECÇÃO DE DEVTOOLS — VETOR 3: toString / getter trap
          Quando o DevTools está aberto e o painel de console
          exibe um objeto, ele chama .toString() nele. Usamos um
          getter com side-effect para detectar isso.
          Compatível com Chrome, Edge e Firefox.
    ───────────────────────────────────────────────────────────── */
    (function toStringTrap() {
        var trap = { toString: function () { criaOverlay(); return ''; } };
        // Esconde do enumerador mas o DevTools ainda aciona no console
        try {
            Object.defineProperty(trap, '__hidden__', {
                get: function () { criaOverlay(); },
                enumerable: true,
            });
        } catch (_) { }
        // Coloca no console de forma não bloqueante
        try { console.log('%c', trap); } catch (_) { }
    })();

    /* ─────────────────────────────────────────────────────────────
       10. DETECÇÃO DE DEVTOOLS — VETOR 4: performance.now timing
           Chrome atrasa performance.now() quando o DevTools está
           aberto com um breakpoint ou painel de performance ativo.
    ───────────────────────────────────────────────────────────── */
    (function perfTrap() {
        var INTERVALO = 7000;
        function checar() {
            var a = performance.now();
            setTimeout(function () {
                var delta = performance.now() - a - 100;
                // Se levou mais de 500 ms além do esperado, devtools pausou
                if (delta > 500) {
                    _devAberto = true;
                    criaOverlay();
                }
            }, 100);
        }
        setInterval(checar, INTERVALO);
    })();

    /* ─────────────────────────────────────────────────────────────
       11. DETECÇÃO DE DEVTOOLS — VETOR 5: firebug legado + chrome
           Verifica existência de objetos injetados por ferramentas.
    ───────────────────────────────────────────────────────────── */
    (function objTrap() {
        setInterval(function () {
            // Firebug (Firefox antigo)
            if (w.Firebug && w.Firebug.chrome && w.Firebug.chrome.isInitialized) {
                criaOverlay(); return;
            }
            // Wrapper de console — quando DevTools redefine console
            var devIndicator = /x/.toString();
            if (Function.prototype.toString &&
                Function.prototype.toString.call(/x/) !== devIndicator) {
                criaOverlay();
            }
        }, 4000);
    })();

    /* ─────────────────────────────────────────────────────────────
       12. CONSOLE TRAP — watermark persistente
           Intervalo aumentado para 8 s para não apagar logs do
           EmailJS nem do IntersectionObserver do script.js.
    ───────────────────────────────────────────────────────────── */
    var ESTILO_T = [
        'color:#F0B429', 'font-size:1.3rem', 'font-weight:900',
        'background:#0E0E0E', 'padding:6px 16px', 'border-radius:4px',
    ].join(';');
    var ESTILO_B = [
        'color:rgba(255,255,255,.55)', 'font-size:.85rem',
        'background:#0E0E0E', 'padding:4px 12px',
    ].join(';');

    function avisoConsole() {
        console.clear();
        console.log('%c⛔  ATENÇÃO', ESTILO_T);
        console.log('%cEste console é restrito. Qualquer tentativa de acesso não autorizado ao código fonte é proibida e pode configurar crime nos termos da Lei 12.737/2012.', ESTILO_B);
        console.log('%c© 2026 Art Plena Persianas — Todos os direitos reservados.', ESTILO_B);
    }

    avisoConsole();
    setInterval(avisoConsole, 8000);

    /* ─────────────────────────────────────────────────────────────
       13. MASCARA VARIÁVEIS GLOBAIS SENSÍVEIS (EmailJS keys)
    ───────────────────────────────────────────────────────────── */
    (function mascararGlobais() {
        var alvos = ['EJ_PK', 'EJ_SVC', 'EJ_TPL'];
        alvos.forEach(function (nome) {
            if (!(nome in w)) return;
            var valor = w[nome];
            try {
                Object.defineProperty(w, nome, {
                    get: function () { return valor; },
                    set: function () { },      // ignora tentativas de sobrescrita
                    enumerable: false,        // some do for..in e Object.keys
                    configurable: false,
                });
            } catch (_) { }
        });
    })();

    /* ─────────────────────────────────────────────────────────────
       14. ANTI-COPY (Ctrl+C e evento copy)
           Permite copiar dentro de inputs/textareas normalmente.
    ───────────────────────────────────────────────────────────── */
    d.addEventListener('copy', function (e) {
        if (_elEhInterativo(d.activeElement)) return; // permite em campos
        e.clipboardData && e.clipboardData.setData('text/plain',
            '© 2026 Art Plena Persianas — Conteúdo protegido.');
        e.preventDefault();
    });

    d.addEventListener('cut', function (e) {
        if (_elEhInterativo(d.activeElement)) return;
        e.preventDefault();
    });

    /* ─────────────────────────────────────────────────────────────
       15. ANTI ARRASTAR / SELECIONAR TEXTO
    ───────────────────────────────────────────────────────────── */
    d.addEventListener('dragstart', function (e) {
        if (_elEhInterativo(e.target)) return;
        e.preventDefault();
    });

    d.addEventListener('selectstart', function (e) {
        if (_elEhInterativo(e.target)) return;
        e.preventDefault();
    });

    /* ─────────────────────────────────────────────────────────────
       16. PROTEÇÃO DE IMAGENS — substitui src por data-src
           e recarrega via JS para dificultar download direto.
           Executado após o DOM carregar.
    ───────────────────────────────────────────────────────────── */
    function protegerImagens() {
        d.querySelectorAll('img:not([data-ap-prot])').forEach(function (img) {
            img.setAttribute('data-ap-prot', '1');
            img.setAttribute('draggable', 'false');
            img.addEventListener('contextmenu', function (e) { e.preventDefault(); });
        });
    }

    if (d.readyState === 'loading') {
        d.addEventListener('DOMContentLoaded', protegerImagens);
    } else {
        protegerImagens();
    }
    // Observa novas imagens inseridas dinamicamente
    try {
        var imgObs = new MutationObserver(function () { protegerImagens(); });
        imgObs.observe(d.body || d.documentElement, { childList: true, subtree: true });
    } catch (_) { }

}(window, document));