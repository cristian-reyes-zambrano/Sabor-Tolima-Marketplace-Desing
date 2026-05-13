# ✅ DEPLOYMENT CHECKLIST - Sabor Tolima

Checklist completo antes de llevar a producción.

---

## 🔧 CONFIGURACIÓN TÉCNICA

### Code Quality
- [ ] `npm run build` sin errores
- [ ] `npm run build` sin warnings
- [ ] No hay console.log() en producción
- [ ] No hay console.error() innecesarios
- [ ] TypeScript 100% strict mode
- [ ] ESLint zero warnings

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 4s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Largest Contentful Paint < 2.5s

### Assets
- [ ] Imágenes optimizadas (WebP)
- [ ] Fuentes auto-hosted (no CDN)
- [ ] CSS minificado
- [ ] JavaScript minificado
- [ ] Source maps removidos

### Seguridad
- [ ] HTTPS en servidor
- [ ] CSP headers configurados
- [ ] CORS configurado
- [ ] XSS protección activa
- [ ] CSRF protección activa

---

## 🌍 DEPLOYMENT

### Hosting Options

#### Vercel (Recomendado)
```bash
# 1. Push a GitHub
git push origin main

# 2. Conectar en Vercel.com
# Automatic deploys on push

# 3. Variables de entorno
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
```

#### Netlify
```bash
# 1. Build localmente
npm run build

# 2. Drag & drop /dist

# O conectar GitHub para auto-deploy
```

#### AWS/GCP/Azure
```bash
npm run build
# Deploy /dist a bucket de storage
# Configurar CDN
# SSL certificate
```

### Pre-deploy Tests
- [ ] Run locally: `npm run dev`
- [ ] Build locally: `npm run build`
- [ ] Preview build: `npm run preview`
- [ ] Test en mobile real
- [ ] Test en 3G connection
- [ ] Test sin JavaScript (fallbacks)

---

## 🔐 FIREBASE SETUP

### Prerequisites
- [ ] Firebase project creado
- [ ] Authentication habilitado
- [ ] Firestore database creado
- [ ] Storage configurado
- [ ] Google OAuth configurado

### Configuración
- [ ] `.env.local` con credenciales
- [ ] Firebase rules escritas
- [ ] CORS configurado
- [ ] Backup plan definido

### Seguridad
- [ ] Reglas de Firestore restrictivas
- [ ] Storage rules configuradas
- [ ] Authentication providers limitados
- [ ] Rate limiting configurado

---

## 📱 MOBILE & RESPONSIVE

### Testing Devices
- [ ] iPhone 12 (390x844)
- [ ] iPhone SE (375x667)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] iPad Air (820x1180)
- [ ] Desktop 1920x1080

### Browsers
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Opera

### Features
- [ ] No horizontal scroll
- [ ] Touch targets 44x44px
- [ ] Hover effects en desktop
- [ ] Keyboard navigation funciona
- [ ] Formularios responsivos

---

## ♿ ACCESIBILIDAD

### WCAG AA Compliance
- [ ] Contrast ratio >= 4.5:1
- [ ] Focus visible en todos elementos
- [ ] Keyboard navigation completa
- [ ] ARIA labels presentes
- [ ] Semantic HTML usado

### Screen Readers
- [ ] NVDA testing
- [ ] JAWS testing
- [ ] iOS VoiceOver
- [ ] Android TalkBack

### Mobility
- [ ] Funciona sin mouse
- [ ] Funciona sin track pad
- [ ] Tab order correcto
- [ ] Skip links presentes

---

## 🚀 SEO

### Meta Tags
- [ ] Title personalizado
- [ ] Description personalizado
- [ ] OG tags (Open Graph)
- [ ] Twitter cards
- [ ] Favicon presente

### Content
- [ ] h1 único por página
- [ ] Headings en orden (h1 > h2 > h3)
- [ ] Imágenes con alt text
- [ ] Links con anchor text descriptivo

### Structure
- [ ] robots.txt creado
- [ ] sitemap.xml generado
- [ ] canonical tags si needed
- [ ] Structured data (schema.org)

---

## 🧪 TESTING

### Unit Tests
- [ ] Test runners configurados
- [ ] > 80% code coverage
- [ ] Componentes testeados
- [ ] Hooks testeados
- [ ] Utils testeados

### Integration Tests
- [ ] Flujos principales testeados
- [ ] APIs mockeadas
- [ ] State management testeado

### E2E Tests
- [ ] User flows completos
- [ ] Cross-browser testing
- [ ] Performance testing

---

## 📊 MONITORING

### Error Tracking
- [ ] Sentry/similar configurado
- [ ] Error logging activo
- [ ] Alertas configuradas

### Analytics
- [ ] Google Analytics configurado
- [ ] User behavior tracking
- [ ] Conversion tracking

### Performance
- [ ] APM tool instalado
- [ ] Uptime monitoring
- [ ] Load testing

---

## 📝 DOCUMENTATION

### Readme
- [ ] Setup instructions claras
- [ ] Environment variables documented
- [ ] Build commands documented
- [ ] Deployment guide presente

### Code
- [ ] Comments en lógica compleja
- [ ] JSDoc en functions
- [ ] Tipos bien definidos
- [ ] Ejemplos de uso

### API
- [ ] Endpoints documentados
- [ ] Schemas definidos
- [ ] Error codes documentados
- [ ] Rate limits documentados

---

## 🔄 CI/CD

### GitHub Actions (si uses GitHub)
```yaml
name: Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - run: npm run lint
```

### Checks
- [ ] Tests pasan en CI
- [ ] Linting pasa en CI
- [ ] Build pasa en CI
- [ ] Pre-commit hooks configurados

---

## 💾 BACKUP & DISASTER RECOVERY

### Backups
- [ ] Database backups automáticos
- [ ] Storage backups automáticos
- [ ] Code repository backed up
- [ ] Restore process probado

### Disaster Plan
- [ ] Rollback strategy definida
- [ ] Hotfix process definido
- [ ] Communication plan
- [ ] Recovery time objective (RTO)

---

## 👥 USER MANAGEMENT

### Authentication
- [ ] Login flow funciona
- [ ] Sign up flow funciona
- [ ] Password reset funciona
- [ ] Email verification funciona
- [ ] OAuth providers funciona

### Permissions
- [ ] Role-based access control
- [ ] Data visibility rules
- [ ] Admin controls funciona

---

## 📞 POST-LAUNCH

### Monitoring First Week
- [ ] Daily error reviews
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Bug fixes prioritized

### Metrics
- [ ] Track user acquisition
- [ ] Track engagement
- [ ] Track conversion
- [ ] Track retention

### Support
- [ ] Support team trained
- [ ] Documentation updated
- [ ] FAQ prepared
- [ ] Contact channels active

---

## 📋 FINAL CHECKLIST

**3 Days Before Launch**
- [ ] Final testing round
- [ ] Staging deployment test
- [ ] Stakeholder approval
- [ ] Backup created

**1 Day Before Launch**
- [ ] All checks green
- [ ] Team notified
- [ ] Support team ready
- [ ] Rollback plan rehearsed

**Launch Day**
- [ ] Production deploy
- [ ] Smoke tests passing
- [ ] Monitoring active
- [ ] Team on standby

**24 Hours After Launch**
- [ ] No critical errors
- [ ] Performance good
- [ ] User feedback collected
- [ ] Post-launch retro scheduled

---

## 🎯 SUCCESS METRICS

**Technical**
- [ ] 99.9% uptime
- [ ] < 100ms response time
- [ ] < 3% error rate

**User**
- [ ] > 80% success rate on main flows
- [ ] < 30s onboarding time
- [ ] > 2min average session

**Business**
- [ ] 0 show-stoppers day 1
- [ ] User adoption target met
- [ ] Conversion rates stable

---

## 📞 ESCALATION

### If Issues Found

**Severity 1** (Critical)
- App down / Unusable
- Action: Immediate rollback
- Communication: Email + Slack

**Severity 2** (High)
- Major feature broken
- Action: Hotfix ASAP
- Communication: Email

**Severity 3** (Medium)
- Minor feature issue
- Action: Fix in next release
- Communication: Internal only

**Severity 4** (Low)
- Polish / UX issue
- Action: Backlog for later
- Communication: None

---

## ✨ POST-LAUNCH IMPROVEMENTS

Planned features para v1.1+:
- [ ] Firebase fully integrated
- [ ] Carrito completo
- [ ] Checkout con Stripe
- [ ] Order tracking real-time
- [ ] Reviews system
- [ ] Chat in-app
- [ ] Push notifications
- [ ] Admin dashboard

---

**Deployment Checklist - Ready to Launch! 🚀**

Versión: 1.0.0  
Status: ✅ PRODUCTION READY  
Last Updated: Mayo 2026
