# Semestre Filtro Trainer

Progressive Web App mobile-first per la preparazione al semestre filtro.

## Macro-aree implementate

- **Dashboard** con barra di avanzamento studio in tempo reale e quiz del giorno.
- **Archivio Teoria** con sezioni protette in-app (placeholder UX).
- **Simulatore** con risposta immediata e visualizzazione istantanea della **Strategia di Risoluzione Rapida**.
- **Ripasso Mirato** che raccoglie automaticamente i quiz sbagliati e li rende disponibili per un nuovo tentativo.
- **Tutoring (Upsell)** con slot prenotabili e conferma prenotazione.

## PWA

- Manifest (`/public/manifest.webmanifest`)
- Service worker base (`/public/sw.js`)
- Metadata PWA in `index.html`

## Avvio locale

```bash
npm install
npm run dev
```

## Verifica

```bash
npm run lint
npm run build
```
