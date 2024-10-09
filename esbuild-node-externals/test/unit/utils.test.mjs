import assert from 'node:assert'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'node:test'
import { findPackagePaths } from '../../dist/utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')

describe('utils', () => {
  describe('findPackagePaths()', () => {
    it('should resolve package.json path', async () => {
      const paths = findPackagePaths(path.resolve(root, 'node_modules/esbuild'))
      assert.equal(paths.length, 2)
    })
  })
})
