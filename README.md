# hazel-client

Cliente móvil para **Hazel** (chat self-hosted). Estilo **Hyprland**: oscuro, minimal, monoespaciado, bordes rectos y acentos neón. Navbar en la parte superior y centrado.

Stack: React Native + TypeScript (Expo).

## Características

- Pantalla de conexión (host, puerto, nickname) — sin cuentas.
- Lista de canales del servidor.
- Chat con envío y auto-refresh.
- Estética tiling: paneles con borde 1px, sin esquinas redondeadas, acento cyan.

## Uso

```bash
npm install
npm run dev          # levanta el backend Hazel + cliente web (auto)
npm run dev:mobile   # levanta el backend + Expo Go (mobile)
npm run web          # solo cliente web (backend ya corriendo)
npm run dev:no-backend  # solo cliente (sin backend)
```

El script `scripts/dev.js` arranca automáticamente el backend en `../hazel`
(Postgres + Kafka + API, puerto 7272) y espera a `/health` antes de lanzar el
cliente. Override con `HAZEL_DIR`, `HAZEL_HOST`, `HAZEL_PORT`, `WEB_PORT`.

Configura host/puerto en la pantalla "connect" (por defecto `127.0.0.1:7272`).

## Backend

Se conecta a la API de Hazel (`/api/v1`): health, servers, join, channels, messages.
Repositorio del backend: https://github.com/gonnnzaDev/hazel
