const fs = require('fs')
const Path = require('path')
const LoaderRunner = require('loader-runner')

LoaderRunner.runLoaders({
  resource: resolve('../node_modules/element-ui/lib/message-box.js'),
  loaders: [resolve('../src/index.js?replace=gt-')],
  context: { minimize: true },
	// processResource: (loaderContext, resourcePath, callback) => { },
  readResource: fs.readFile.bind(fs),
}, 
function(err, result) {
  if (err) {
    return console.log('err', err)
  }
  const fileDependencies = result.fileDependencies[0].split('/')
  const filename = fileDependencies[fileDependencies.length - 1]
  writeFile(result.result[0], filename)
})
function resolve(path) {
  return Path.resolve(__dirname, path)
}

function writeFile(data, filename) {
  fs.writeFile(Path.join(__dirname, 'files', filename), data, (err) => {
    if (err) {
      throw Error(err)
    }
  })
}
