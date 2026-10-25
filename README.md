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
npm start          # Expo Go / dev client
npm run web        # navegador
npm run android    # emulador/dispositivo Android
```

Configura host/puerto en la pantalla "connect" (por defecto `127.0.0.1:7272`).

## Backend

Se conecta a la API de Hazel (`/api/v1`): health, servers, join, channels, messages.
Repositorio del backend: https://github.com/gonnnzaDev/hazel
