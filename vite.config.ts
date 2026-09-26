import { defineConfig, build, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

/**
 * Elorenderelés a kliens build vegen. Pluginben van, hogy a sima `vite build` se tudjon
 * nelkule "sikeresen" lefutni (pl. ha a hosting csak ezt hivja). Ha barmi hibazik,
 * a build elbukik, es a hosting a regi, mukodo deployt tartja meg.
 */
function prerender(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'videotar-prerender',
    apply: 'build',
    configResolved(c) {
      config = c
    },
    async closeBundle() {
      // A belso SSR build is betolti ezt a plugint, ott nem futunk ujra.
      if (config.build.ssr) return
      await build({
        configFile: config.configFile,
        mode: config.mode,
        logLevel: 'warn',
        build: { ssr: 'src/entry-server.tsx', outDir: 'dist-ssr', emptyOutDir: true },
      })
      const outDir = path.resolve(config.root, config.build.outDir)
      execFileSync(process.execPath, ['scripts/prerender.mjs', outDir], { cwd: config.root, stdio: 'inherit' })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), prerender()],
})
