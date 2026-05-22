/* ═══════════════════════════════════════════════════════════════
   SECURITY LAYER — Art Plena Persianas  |  v2.2
   Técnicas: anti-devtools (5 vetores), anti-iframe, anti-copy,
   console trap, debugger timing, teclado bloqueado,
   clique direito off, watermark, anti-print, anti-screenshot CSS

   CHANGELOG v2.2 (CORREÇÕES MOBILE):
   - FIX CRÍTICO: armadilaDebugger() agora retorna em mobile.
     A instrução `debugger;` rodando a cada 6s em celulares causava
     travamentos e podia disparar o overlay erroneamente.
   - FIX: setInterval(verificaDevtools) e listener resize agora são
     registrados apenas em desktop. Desnecessário em mobile.
   - FIX: avisoConsole() não chama console.clear() em mobile.
     Alguns browsers mobile lançam erros silenciosos nessa chamada.
   - FIX: CSS injetado removeu pointer-events:none de img.
     Bloqueava eventos de toque em áreas sobrepostas a imagens.
   - FIX: selectstart handler agora verifica touch event corretamente.
═══════════════════════════════════════════════════════════════ */
; (function (w, d) {
    'use strict';

    /* ─────────────────────────────────────────────────────────────
       UTILITÁRIOS INTERNOS
    ───────────────────────────────────────────────────────────── */
    var _devAberto = false;
    var _overlayAtivo = false;

    /* Detecta dispositivo mobile — desativa vetores que geram
       falsos positivos em iPhones, Androids e iPads.            */
    var _isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)
        || ('ontouchstart' in w)
        || (navigator.maxTouchPoints > 0);

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

       FIX v2.2: Removido pointer-events:none de img.
       No mobile, esse estilo bloqueava toque em áreas sobrepostas
       a imagens (ex.: botões dentro de cards com img de fundo),
       tornando partes da interface não-responsivas ao toque.
    ───────────────────────────────────────────────────────────── */
    (function antiScreenshotCSS() {
        var st = d.createElement('style');
        st.id = '__ap_css_sec__';
        st.textContent = [
            'body { -webkit-user-select: none; user-select: none; }',
            'input, textarea, button, [contenteditable] { -webkit-user-select: text; user-select: text; }',
            'img { -webkit-user-drag: none; user-drag: none; }',
            ':root { -webkit-tap-highlight-color: transparent; }',
        ].join('\n');
        d.head.appendChild(st);
    })();

    /* ─────────────────────────────────────────────────────────────
       5. ANTI-IFRAME / CLICKJACKING
    ───────────────────────────────────────────────────────────── */
    (function antiIframe() {
        try {
            if (w.self !== w.top) {
                w.top.location.href = w.self.location.href;
            }
        } catch (e) {
            d.body.innerHTML = '';
            w.location.href = 'about:blank';
        }
    })();

    /* ─────────────────────────────────────────────────────────────
       6. OVERLAY DE BLOQUEIO
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

       Desativado em mobile (já era, mantido).
    ───────────────────────────────────────────────────────────── */
    var LIMIAR = 220;

    function _verificaSizeDev() {
        if (_isMobile) return false;
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

    /* FIX v2.2: resize e intervalo registrados SOMENTE em desktop.
       Em mobile eram disparados desnecessariamente a cada 1s.    */
    if (!_isMobile) {
        w.addEventListener('resize', verificaDevtools, { passive: true });
        setInterval(verificaDevtools, 1000);
    }

    /* ─────────────────────────────────────────────────────────────
       8. DETECÇÃO DE DEVTOOLS — VETOR 2: DEBUGGER TIMING

       FIX v2.2: DESATIVADO COMPLETAMENTE EM MOBILE.
       A instrução `debugger;` rodando a cada 6s em celulares:
         - Causava micro-travamentos na thread principal.
         - Em celulares lentos ultrapassava o limiar de 500ms e
           disparava o overlay de bloqueio erroneamente.
         - Browsers mobile não pausam em `debugger` sem DevTools
           conectado, tornando o vetor inútil no mobile.
    ───────────────────────────────────────────────────────────── */
    var _debuggerAtivo = false;
    var _lastDbgCheck = 0;
    var LIMIAR_DBG = 200;

    function armadilaDebugger() {
        if (_isMobile) return; /* FIX v2.2: completamente pulado em mobile */

        var agora = Date.now();
        if (agora - _lastDbgCheck < 5500) return;
        _lastDbgCheck = agora;

        var t0 = performance.now();
        /* eslint-disable no-debugger */ debugger; /* eslint-enable no-debugger */
        var dt = performance.now() - t0;

        if (dt > LIMIAR_DBG) {
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

       Já desativado em mobile na v2.1.
    ───────────────────────────────────────────────────────────── */
    (function toStringTrap() {
        if (_isMobile) return;

        var trap = { toString: function () { criaOverlay(); return ''; } };
        try {
            Object.defineProperty(trap, '__hidden__', {
                get: function () { criaOverlay(); },
                enumerable: true,
            });
        } catch (_) { }

        try { console.log(trap); } catch (_) { }
    })();

    /* ─────────────────────────────────────────────────────────────
       10. DETECÇÃO DE DEVTOOLS — VETOR 4: performance.now timing

       Já desativado em mobile na v2.1.
    ───────────────────────────────────────────────────────────── */
    (function perfTrap() {
        if (_isMobile) return;
        var INTERVALO = 7000;
        function checar() {
            var a = performance.now();
            setTimeout(function () {
                var delta = performance.now() - a - 100;
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

       Já desativado em mobile na v2.1.
    ───────────────────────────────────────────────────────────── */
    (function objTrap() {
        if (_isMobile) return;
        setInterval(function () {
            if (w.Firebug && w.Firebug.chrome && w.Firebug.chrome.isInitialized) {
                criaOverlay(); return;
            }
            try {
                var devIndicator = /x/.toString();
                if (Function.prototype.toString &&
                    Function.prototype.toString.call(/x/) !== devIndicator) {
                    criaOverlay();
                }
            } catch (_) { }
        }, 4000);
    })();

    /* ─────────────────────────────────────────────────────────────
       12. CONSOLE TRAP — watermark persistente

       FIX v2.2: console.clear() ignorado em mobile.
       Alguns browsers Android/iOS lançam erros silenciosos ou
       bloqueiam o event loop ao receber console.clear() em loop.
       O aviso visual no console é irrelevante em mobile pois o
       usuário final não tem acesso ao console do browser.
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
        if (!_isMobile) console.clear(); /* FIX v2.2: só limpa em desktop */
        console.log('%c⛔  ATENÇÃO', ESTILO_T);
        console.log('%cEste console é restrito. Qualquer tentativa de acesso não autorizado ao código fonte é proibida e pode configurar crime nos termos da Lei 12.737/2012.', ESTILO_B);
        console.log('%c© 2026 Art Plena Persianas — Todos os direitos reservados.', ESTILO_B);
    }

    avisoConsole();
    /* FIX v2.2: intervalo do aviso somente em desktop */
    if (!_isMobile) {
        setInterval(avisoConsole, 8000);
    }

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
                    set: function () { },
                    enumerable: false,
                    configurable: false,
                });
            } catch (_) { }
        });
    })();

    /* ─────────────────────────────────────────────────────────────
       14. ANTI-COPY (Ctrl+C e evento copy)
    ───────────────────────────────────────────────────────────── */
    d.addEventListener('copy', function (e) {
        if (_elEhInterativo(d.activeElement)) return;
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

       FIX v2.2: selectstart ignora o evento inteiramente em mobile.
       No mobile, o `selectstart` pode ser disparado durante a
       inicialização do foco em campos de formulário via toque,
       causando bloqueio indevido da interação.
    ───────────────────────────────────────────────────────────── */
    d.addEventListener('dragstart', function (e) {
        if (_elEhInterativo(e.target)) return;
        e.preventDefault();
    });

    d.addEventListener('selectstart', function (e) {
        if (_isMobile) return; /* FIX v2.2: sem bloqueio de seleção em mobile */
        if (_elEhInterativo(e.target)) return;
        e.preventDefault();
    });

    /* ─────────────────────────────────────────────────────────────
       16. PROTEÇÃO DE IMAGENS
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

    try {
        var imgObs = new MutationObserver(function () { protegerImagens(); });
        imgObs.observe(d.body || d.documentElement, { childList: true, subtree: true });
    } catch (_) { }

}(window, document));