const fs = require('fs')
const Path = require('path')
const LoaderRunner = require('loader-runner')

LoaderRunner.runLoaders({
  resource: resolve('../node_modules/element-ui/lib/table.js'),
  loaders: [resolve('../src/index.js?replace=gt-')],
  context: { minimize: true },
	// processResource: (loaderContext, resourcePath, callback) => { },
  readResource: fs.readFile.bind(fs),
}, 
function(err, result) {
  if (err) {
    return console.log('err', err)
  }
  console.log('result', result)
})
function resolve(path) {
  return Path.resolve(__dirname, path)
}
