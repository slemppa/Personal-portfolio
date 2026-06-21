import { defineConfig } from 'vitest/config'
import { loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { buildActivity } from './api/_lib/activity'

// Serves /api/activity during `vite dev`, mirroring the Vercel function so the
// build-in-public section works locally without `vercel dev`. Both paths call
// the same buildActivity(). `env` comes from loadEnv so .env (e.g.
// GITHUB_TOKEN) is picked up — Vite does not put non-VITE_ vars on process.env.
function devActivityApi(env: Record<string, string>): Plugin {
  return {
    name: 'dev-activity-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/activity', async (_req, res) => {
        try {
          const data = await buildActivity({
            GITHUB_TOKEN: env.GITHUB_TOKEN || process.env.GITHUB_TOKEN,
            GITHUB_USER: env.GITHUB_USER || process.env.GITHUB_USER,
            YT_HANDLE: env.YT_HANDLE || process.env.YT_HANDLE,
          })
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), devActivityApi(env)],
    test: {
      environment: 'node',
    },
  }
})
