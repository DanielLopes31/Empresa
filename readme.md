# 🪟 Art Plena Persianas — Site Institucional

> Site de landing page para a **Art Plena Persianas**, especialistas em persianas, cortinas e rolôs sob medida desde 1981. Região do Grande ABC Paulista.

---

## 📁 Estrutura de Arquivos

```
artplena/
├── index.html          # Página principal
├── script.js           # JavaScript (formulário, animações, segurança)
├── CSS/
│   ├── global.css      # Tokens de design, nav, hero, componentes globais
│   └── index.css       # Seção de serviços, ajustes de layout, acessibilidade
└── README.md           # Este arquivo
```

---

## ✨ Seções da Página

| Seção | ID | Descrição |
|---|---|---|
| Hero | `#inicio` | Apresentação principal com CTA e promoção |
| Strip | — | Faixa com diferenciais rápidos |
| Sobre | `#sobre` | História e diferenciais da empresa |
| Produtos | `#produtos` | Catálogo completo de produtos |
| **Serviços** | `#servicos` | **Lavagem de Tecidos + Manutenção** *(novo)* |
| Como Funciona | `#processo` | Timeline com as 4 etapas |
| Por que nos escolher | `#sobre2` | Grade de benefícios |
| Depoimentos | — | 3 avaliações de clientes |
| Agendar Visita | `#agendar` | Formulário em 3 passos |
| Contato / Rodapé | `#contato` | Informações e links |

---

## 🧺 Serviços Adicionados

### Lavagem de Tecidos
- Higienização de cortinas, rolôs e persianas verticais
- Remoção de mofo, ácaros e manchas
- Aplicação de impermeabilizante (opcional)
- Retirada e recolocação inclusa

### Manutenção
- Troca de correntes e cordões
- Reparo de mecanismos e trilhos
- Regulagem e reajuste
- Substituição de lâminas danificadas
- Manutenção de motorização

---

## 🔧 Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 semântico | Estrutura e acessibilidade |
| CSS3 puro | Layout, animações, responsividade |
| JavaScript ES6+ | Formulário, timeline, validação |
| [EmailJS](https://www.emailjs.com/) | Envio de e-mail sem backend |
| Google Fonts | Bebas Neue + Montserrat |
| Unsplash | Imagens de demonstração |

---

## 📬 Configuração do EmailJS

No arquivo `script.js`, atualize as constantes caso necessário:

```js
const EJ_PK  = 'SUA_PUBLIC_KEY';   // Dashboard > Account > Public Key
const EJ_SVC = 'SEU_SERVICE_ID';   // Email Services > Service ID
const EJ_TPL = 'SEU_TEMPLATE_ID';  // Email Templates > Template ID
```

### Variáveis do Template EmailJS

O template deve conter estas variáveis:

```
{{nome}}       — Nome do cliente
{{email}}      — E-mail do cliente
{{telefone}}   — Telefone
{{cidade}}     — Cidade / Bairro
{{produtos}}   — Produtos/serviços de interesse
{{contato}}    — Forma de contato preferida
{{periodo}}    — Período para visita
{{mensagem}}   — Mensagem adicional
{{to_email}}   — Destinatário (artplenapersianas@gmail.com)
```

---

## 🛡️ Segurança Implementada

### No HTML (`index.html`)
- **Content Security Policy (CSP)** via `<meta>` — restringe fontes de scripts, estilos e conexões
- **X-Content-Type-Options** — impede MIME sniffing
- **X-Frame-Options: SAMEORIGIN** — bloqueia clickjacking
- **Referrer-Policy** — controla informações de referência
- **Permissions-Policy** — desabilita câmera, microfone e geolocalização
- `rel="noopener noreferrer"` em todos os links externos

### No JavaScript (`script.js`)
- **Sanitização de inputs** — escapa HTML antes de processar/exibir (`_sanitize()`)
- **Validação rigorosa** — regex, comprimento máximo, caracteres proibidos
- **Rate limiting local** — máx. 3 envios por sessão / 2 por minuto
- **Anti-bot por tempo** — bloqueia submissões em menos de 4 segundos
- **textContent em vez de innerHTML** — previne XSS no resumo do formulário
- `encodeURIComponent` no link do WhatsApp

---

## 🔒 Segurança Adicional — Recomendações para o Servidor

> As medidas abaixo **não podem ser feitas via HTML** — precisam ser configuradas no servidor (Apache, Nginx, Cloudflare, etc.)

### 1. HTTP Security Headers (Nginx)
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com data:; connect-src 'self' https://api.emailjs.com; frame-ancestors 'none';" always;
```

### 2. Para Apache (`.htaccess`)
```apache
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

### 3. Cloudflare (gratuito — recomendado)
- ✅ Ative **HTTPS automático** e **HSTS**
- ✅ Ative **Bot Fight Mode**
- ✅ Ative **DDoS Protection**
- ✅ Configure **Firewall Rules** para bloquear países suspeitos se necessário
- ✅ Ative o **WAF (Web Application Firewall)** no plano Free

### 4. SSL/TLS
- Use sempre HTTPS. Certificados gratuitos via **Let's Encrypt** ou pelo próprio Cloudflare.

### 5. Manutenção contínua
- Mantenha as bibliotecas (EmailJS, etc.) sempre atualizadas
- Revise periodicamente os logs de acesso em busca de comportamentos suspeitos
- Use o [Observatory da Mozilla](https://observatory.mozilla.org/) para auditar os headers do seu site

---

## 📱 Responsividade

| Breakpoint | Comportamento |
|---|---|
| > 900px | Layout completo, hero em 2 colunas |
| ≤ 900px | Hero em coluna única, nav sem links, cards empilhados |
| ≤ 720px | Cards de serviços empilhados |
| ≤ 600px | Formulário em coluna única, footer empilhado |

---

## ♿ Acessibilidade

- Skip link ("Pular para o conteúdo") para leitores de tela
- `aria-label` em todos os links externos e ícones decorativos
- `aria-hidden="true"` em elementos puramente decorativos
- `role="alert"` nas mensagens de erro do formulário
- `role="dialog" aria-modal="true"` no modal de sucesso
- `aria-pressed` nos botões de seleção (produtos, período, contato)
- `aria-progressbar` no indicador de passos
- Foco gerenciado no modal de sucesso
- `for` em todos os `<label>`
- Fechamento do modal com tecla **Escape**
- `loading="lazy"` em todas as imagens fora do hero

---

## 📞 Contato da Empresa

| Canal | Dados |
|---|---|
| WhatsApp | +55 (11) 92109-3849 |
| E-mail | artplenapersianas@gmail.com |
| Instagram | [@artplenapersianas](https://www.instagram.com/artplenapersianas) |
| Região atendida | Grande ABC Paulista + São Paulo |
| Horário | Seg–Sex 8h–18h · Sáb 8h–13h |

---

## 📄 Licença

Projeto privado — © 2026 Art Plena Persianas. Todos os direitos reservados.