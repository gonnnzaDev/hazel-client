#!/usr/bin/env node
// Dev launcher: brings up the Hazel backend (Postgres + Kafka + API) and then
// the Expo client. Backend dir defaults to ../hazel (override with HAZEL_DIR).
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const backendDir = process.env.HAZEL_DIR || path.resolve(__dirname, '..', '..', 'hazel');
const host = process.env.HAZEL_HOST || '127.0.0.1';
const port = process.env.HAZEL_PORT || '7272';
const webPort = process.env.WEB_PORT || '8081';
const skipBackend = process.argv.includes('--no-backend');
const mobile = process.argv.includes('--mobile');

function run(cmd, args, opts = {}) {
  return spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
}

function waitForHealth(timeoutMs = 90000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (Date.now() - start > timeoutMs) return reject(new Error('backend health timeout'));
      const req = http.get(`http://${host}:${port}/health`, (res) => {
        if (res.statusCode === 200) resolve();
        else setTimeout(tick, 1000);
      });
      req.on('error', () => setTimeout(tick, 1000));
      req.setTimeout(2000, () => { req.destroy(); setTimeout(tick, 1000); });
    };
    tick();
  });
}

(async () => {
  let backend = null;
  if (!skipBackend) {
    console.log(`[dev] starting backend in ${backendDir}`);
    backend = run('bash', ['-lc', `cd "${backendDir}" && (make up || true) && make migrate && make api`]);
    backend.on('exit', (code) => {
      if (code !== null && code !== 0) console.error(`[dev] backend exited with ${code}`);
    });
    try {
      await waitForHealth();
      console.log('[dev] backend healthy');
    } catch (e) {
      console.error('[dev] backend did not become healthy:', e.message);
    }
  }

  const expoArgs = mobile ? ['start'] : ['start', '--web', '--port', webPort];
  console.log(`[dev] starting expo (${mobile ? 'mobile' : 'web'})`);
  const client = run('npx', ['expo', ...expoArgs], { cwd: path.resolve(__dirname, '..') });

  const shutdown = () => {
    console.log('\n[dev] shutting down');
    try { client.kill('SIGTERM'); } catch {}
    if (backend) try { backend.kill('SIGTERM'); } catch {}
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  client.on('exit', (code) => {
    console.log(`[dev] client exited (${code})`);
    if (backend) try { backend.kill('SIGTERM'); } catch {}
    process.exit(code ?? 0);
  });
})();
