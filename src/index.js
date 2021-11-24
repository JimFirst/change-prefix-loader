const loaderUtils = require('loader-utils')
const fs = require('fs')  // 调试用
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require("@babel/generator").default
module.exports = function changePrefixLoader(source) {
  // const options = loaderUtils.getOptions(this)
  const result = handleSource(source)
  writeFile(result.code)
  return result.code
}

const literalVistor = {
  Literal(path) {
    const node = path.node
    if (typeof node.value === 'string' && node.value.indexOf('el-') !== -1) {
      // console.log(node.value)
      // node.value = node.value.replace(/el-/g, 'mc-')
      node.value = replacePrefix(node.value, 'mc-')
    }
    path.replaceWith(node)
  }
}
function handleSource(source) {
  const ast = parser.parse(source)
  traverse(ast, {
    // 处理对象key-value的前缀
    Property(path) {
      const key = path.node.key
      // 处理template
      // node.key.value === 'class' 直接写的renader函数，后者都是template处理的
      if (key.value === 'class'
        || key.value === 'wrap-class'
        || key.value === 'view-class'
        || key.name === 'attrs'
        || key.name === 'class'
        || key.name === 'staticClass') {
        path.traverse(literalVistor)
      }
    },
    // 处理算术表达式前缀
    BinaryExpression(path) {
      path.traverse(literalVistor)
    },
    // ArrayExpression(path) {
    //   path.traverse(literalVistor)
    // },
    VariableDeclaration(path) {
      path.traverse({
        CallExpression(path) {
          if (isSelector(path)) {
            path.traverse(literalVistor)
          }
        }
      })
    }
  })
  return generate(ast)
}

function isSelector(path) {
  let result = false
  path.traverse({
    Identifier(path) {
      const name = path.node.name
      if (name === 'querySelector' || name === 'querySelectorAll') {
        result = true
      }
    }
  })
  return result
}

function replacePrefix(sourceStr, prefix) {
  const index = sourceStr.indexOf('el-')
  if (index !== -1 && index !== sourceStr.indexOf('el-icon')) {
    return replacePrefix(sourceStr.replace('el-', prefix), prefix)
  } else {
    return sourceStr
  }
}

function writeFile(data) {
  fs.writeFile('log.js', data, (err) => {
    if (err) {
      throw Error(err)
    }
    console.log('write success');
  })
}