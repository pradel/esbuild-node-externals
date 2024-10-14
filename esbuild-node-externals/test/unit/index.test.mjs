import assert from 'node:assert'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { describe, it } from 'node:test'
import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const tempdir = async (prefix = `t${Math.random().toString(36).slice(2)}`) => {
  const dirpath = path.join(os.tmpdir(), prefix)
  await fs.mkdir(dirpath, { recursive: true })

  return dirpath
}

describe('index', () => {
  describe('nodeExternalsPlugin', () => {
    it('should exclude node_modules from bundle', async () => {
      const plugin = nodeExternalsPlugin()
      const temp = await tempdir()
      const config = {
        absWorkingDir: path.resolve(__dirname, '../fixtures'),
        entryPoints: ['index.mjs'],
        outdir: temp,
        bundle: true,
        platform: 'node',
      }
      await build(config)
      const r1 = await fs.readFile(path.resolve(__dirname, `${temp}/index.js`), 'utf8')
      assert.ok(r1.includes('node_modules/typescript'))

      await build({
        ...config,
        plugins: [plugin]
      })
      const r2 = await fs.readFile(path.resolve(__dirname, `${temp}/index.js`), 'utf8')
      assert.ok(!r2.includes('node_modules/typescript'))
    })

    it('works in commonjs mode too', async () => {
      const { nodeExternalsPlugin: nodeExternalsPluginCjs } = require('esbuild-node-externals')
      const plugin = nodeExternalsPluginCjs()
      const temp = await tempdir()
      const config = {
        absWorkingDir: path.resolve(__dirname, '../fixtures'),
        entryPoints: ['index.mjs'],
        outdir: temp,
        bundle: true,
        plugins: [plugin]
      }
      await build(config)
      const result = await fs.readFile(path.resolve(__dirname, `${temp}/index.js`), 'utf8')

      assert.equal(result.includes('node_modules/typescript'), false)
      assert.ok(nodeExternalsPlugin === nodeExternalsPluginCjs)
    })
  })
})
