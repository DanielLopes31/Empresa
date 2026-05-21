# 🪟 Art Plena Persianas — Site Institucional

Site institucional completo para a **Art Plena Persianas**, empresa especializada em persianas, cortinas e rolôs sob medida desde 1981. O projeto inclui catálogo de produtos, seção de serviços, formulário de agendamento integrado ao EmailJS e camada de segurança anti-inspeção.

---

## 📁 Estrutura do Projeto

```
art-plena-persianas/
├── index.html          # Página principal
├── script.js           # Lógica do formulário, timeline e integrações
├── security.js         # Camada de proteção anti-devtools / anti-cópia
├── CSS/
│   ├── global.css      # Reset, variáveis de design e componentes globais
│   └── index.css       # Estilos específicos da página index
└── assets/
    ├── principal.png
    ├── persiana_melhorada.jpg
    ├── rolotranslucida1.png
    ├── blackout2.png
    ├── telasolar3.png
    ├── doublevision4.png
    ├── persiana5.png
    ├── cortina6.png
    ├── motorizada7.png
    ├── lavagem.png
    ├── manutencao.png
    └── img.png
```

---

## ✨ Funcionalidades

- **Navegação fixa** com links para todas as seções e botão de CTA para WhatsApp
- **Hero section** com promoção de 10% OFF, estatísticas e imagem de destaque
- **Strip de benefícios** animada (visita grátis, frete grátis, instalação gratuita etc.)
- **Seção Sobre** com diferenciais em cards interativos
- **Catálogo de produtos** em grid responsivo (Rolô Translúcida, Blackout, Tela Solar, Double Vision, Vertical, Cortina, Motorização)
- **Seção de Serviços** — Lavagem de Tecidos e Manutenção Completa com cards detalhados
- **Timeline animada** com scroll-driven (4 etapas do processo)
- **Seção de Benefícios** com imagem lateral e cards de vantagens
- **Depoimentos** de clientes em grid de 3 colunas
- **Formulário de agendamento em 3 passos** (dados pessoais → preferências de contato → confirmação)
- **Modal de sucesso** com confete animado e botão de abertura do WhatsApp
- **Rodapé completo** com links, contato e redes sociais
- **Botão flutuante do WhatsApp** com animação de pulse

---

## 📬 Integração EmailJS

O formulário de agendamento envia os dados via [EmailJS](https://www.emailjs.com/) sem necessidade de backend.

### Configuração (`script.js`)

```js
const EJ_PK  = 'Ffz5TXgaZhPmuWLEm';   // Public Key
const EJ_SVC = 'service_y6hvjjs';       // Service ID
const EJ_TPL = 'template_xsnta2r';      // Template ID
```

### Variáveis enviadas ao template

| Variável     | Descrição                           |
|--------------|-------------------------------------|
| `nome`       | Nome completo do cliente            |
| `email`      | E-mail do cliente                   |
| `telefone`   | Telefone formatado                  |
| `cidade`     | Cidade / bairro                     |
| `produtos`   | Produtos e serviços de interesse    |
| `contato`    | Canal preferido (WhatsApp/Tel/E-mail)|
| `periodo`    | Período da visita (Manhã/Tarde/Qualquer) |
| `mensagem`   | Mensagem adicional (opcional)       |
| `to_email`   | Destinatário fixo                   |

---

## 🔒 Camada de Segurança (`security.js`)

O arquivo `security.js` implementa múltiplas técnicas de proteção do código-fonte:

| Vetor | Técnica |
|---|---|
| Clique direito | `contextmenu` bloqueado |
| Atalhos de teclado | F12, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+Shift+I/J/C bloqueados |
| Anti-print | `@media print { display: none }` + evento `beforeprint` |
| Anti-copy | Evento `copy` substituído por watermark |
| Anti-iframe | Redirecionamento se carregado em `<iframe>` |
| DevTools — janela | Limiar de 220px entre `outerWidth` e `innerWidth` |
| DevTools — timing | `debugger` statement com medição de performance |
| DevTools — console | Watermark a cada 8s + `console.clear()` |
| Proteção de imagens | `draggable="false"` + bloqueio de contextmenu |
| Variáveis globais | Chaves EmailJS ocultadas com `Object.defineProperty` |

> ⚠️ A camada de segurança exibe um overlay de bloqueio caso detecte ferramentas de desenvolvedor abertas.

---

## 🎨 Design Tokens (CSS)

Todas as variáveis de estilo estão centralizadas em `:root` no `global.css`:

```css
--gold:    #F0B429   /* Dourado principal */
--gold-d:  #C9920A   /* Dourado escuro */
--ink:     #080808   /* Fundo escuro principal */
--white:   #FFFFFF
--off:     #F7F6F2   /* Fundo claro alternado */
--stone:   #7A7977   /* Texto secundário */
--r:       12px      /* Border-radius padrão */
--r2:      20px      /* Border-radius grande */
--ease:    .32s cubic-bezier(.4,0,.2,1)
```

**Fontes utilizadas (Google Fonts):**
- `Bebas Neue` — Títulos e destaques
- `Montserrat` — Corpo, labels e botões

---

## 📱 Responsividade

O layout é totalmente responsivo com breakpoints definidos via `@media`:

| Breakpoint | Ajustes |
|---|---|
| `≤ 900px` | Hero single-column, grade de produtos 1 coluna, nav sem links, serviços empilhados |
| `≤ 600px` | Footer single-column, grid de produtos 1 coluna, pills verticais, formulário single-column |

---

## 🚀 Como Usar

1. **Clone ou baixe** os arquivos do projeto
2. Configure seu template no [EmailJS](https://www.emailjs.com/) com as variáveis listadas acima
3. Atualize as constantes `EJ_PK`, `EJ_SVC` e `EJ_TPL` em `script.js`
4. Substitua as imagens em `assets/` pelas fotos reais dos produtos
5. Faça o deploy em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel etc.)

> Nenhum framework ou build step é necessário — HTML, CSS e JS puros.

---

## 📞 Contato da Empresa

| Canal | Info |
|---|---|
| 📱 WhatsApp | [+55 (11) 92109-3849](https://wa.me/5511921093849) |
| ✉️ E-mail | artplenapersianas@gmail.com |
| 📷 Instagram | [@artplenapersianas](https://www.instagram.com/artplenapersianas) |
| 📍 Região | Grande ABC Paulista — São Bernardo do Campo, Santo André, São Caetano, Diadema e toda Grande SP |
| 🕐 Horário | Seg–Sex: 8h–18h · Sáb: 8h–13h |

---

© 2026 Art Plena Persianas — Todos os direitos reservados.