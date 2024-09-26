const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

(async () => {
  try {
    await esbuild.build({
      entryPoints: ['src/index.js'],
      bundle: true,
      platform: 'node',
      outfile: 'dist/index.js',
      plugins: [nodeExternalsPlugin()],
    });
    console.log(`Built with ${esbuild.version}`)
    process.exit(0);
  }
  catch (e) {
    console.error(e);
    process.exit(1);
  }
})()
