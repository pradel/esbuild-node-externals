import assert from 'node:assert'
import fs from 'node:fs/promises'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('nodeExternalsPlugin', () => {
  it('should exclude node_modules from bundle', async () => {
    const plugin = nodeExternalsPlugin()
    const config = {
      absWorkingDir: path.resolve(__dirname, '../fixtures'),
      entryPoints: ['index.mjs'],
      outdir: '../temp',
      bundle: true,
    }
    await build(config)
    const result1 = await fs.readFile(path.resolve(__dirname, '../temp/index.js'), 'utf8')
    assert.equal(result1.includes('node_modules/tslib/tslib.es6.mjs'), true)

    await build({
      ...config,
      plugins: [plugin]
    })
    const result2 = await fs.readFile(path.resolve(__dirname, '../temp/index.js'), 'utf8')
    assert.equal(result2.includes('node_modules/tslib/tslib.es6.mjs'), false)
  })
})
