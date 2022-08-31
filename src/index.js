const loaderUtils = require('loader-utils')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require("@babel/generator").default
const { getRegExp } = require('./utils')
module.exports = function changePrefixLoader(source) {
  const { prefix = 'el-', replace = 'gp-', exclude } = loaderUtils.getOptions(this) || {}
  const result = handleSource(source, prefix, replace, exclude)
  return result.code
}

function handleSource(source, prefix, replace, exclude) {
  const ast = parser.parse(source, { sourceType: 'unambiguous' })
  traverse(ast, {
    TemplateElement(path) {
      ;['raw', 'cooked'].forEach((type) => {
        const node = path.node;
        const reg = getRegExp(prefix, exclude);
        path.node.value[type] = node.value[type]
          .replace(reg, `$1${replace}`)
      })
    },
    Literal(path) {
      const reg = getRegExp(prefix, exclude);
      const node = path.node;
      if (!node) return;
      if (typeof node.value === 'string' && node.value.includes(prefix) && !canChange(path)) {
        if (node.value !== 'el-menu-collapse-transition') { // TODO 先特殊处理这个内部组件
          node.value = node.value.replace(reg, `$1${replace}`)
        }
      }
      path.replaceWith(node)
    },
    RegExpLiteral(path) {
      const node = path.node
      if (node.pattern.indexOf(prefix) !== -1) {
        const reg = new RegExp(prefix, 'g')
        node.extra.raw = node.extra.raw.replace(reg, replace)
        node.pattern = node.pattern.replace(reg, replace)
      }
      path.replaceWith(node)
    }
  })
  return generate(ast)
}


function canChange(path) {
  const parenNode = path.parent;
  if (!parenNode || !parenNode.callee) return false;
  if (parenNode.callee.name && parenNode.callee.name === 'h' || parenNode.callee.name === '_c') {
    return true
  }
  return false
}
