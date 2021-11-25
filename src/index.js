const loaderUtils = require('loader-utils')
const fs = require('fs')  // 调试用
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require("@babel/generator").default
module.exports = function changePrefixLoader(source) {
  const { prefix = 'el-', replace = 'gt-' } = loaderUtils.getOptions(this) || {}
  const result = handleSource(source, prefix, replace)
  // writeFile(result.code)
  return result.code
}

// const literalVistor = {
//   Literal(path) {
//     const node = path.node
//     if (typeof node.value === 'string' && node.value.indexOf('el-') !== -1) {
//       node.value = node.value.replace(/(^|(\s)+)el-(?!icon)/g, '$2mc-' )
//     }
//     path.replaceWith(node)
//   }
// }
function handleSource(source, prefix, replace) {
  const ast = parser.parse(source)
  traverse(ast, {
    // 处理对象key-value的前缀
    // Property(path) {
    //   const key = path.node.key
    //   // 处理template
    //   // node.key.value === 'class' 直接写的renader函数，后者都是template处理的
    //   if (key.value === 'class'
    //     || key.value === 'wrap-class'
    //     || key.value === 'view-class'
    //     || key.name === 'attrs'
    //     || key.name === 'class'
    //     || key.name === 'staticClass') {
    //     path.traverse(literalVistor)
    //   }
    // },
    // // 处理算术表达式前缀
    // BinaryExpression(path) {
    //   path.traverse(literalVistor)
    // },
    // // ArrayExpression(path) {
    // //   path.traverse(literalVistor)
    // // },
    // VariableDeclaration(path) {
    //   path.traverse({
    //     CallExpression(path) {
    //       if (isSelector(path)) {
    //         path.traverse(literalVistor)
    //       }
    //     }
    //   })
    // },
    CallExpression(path) {
      path.traverse({
        Literal(path) {
          const node = path.node
          // 普通字符串替换
          if (typeof node.value === 'string' && node.value.indexOf(prefix) !== -1 && !canChange(path)) {
            if (node.value !== 'el-menu-collapse-transition') { // TODO 先特殊处理这个内部组件
              const reg = new RegExp(`(^|(\\s)+|(\.)+)${prefix}(?!icon)`, 'g')
              // const reg = new RegExp(`(^|(\\s)+)el-(?!icon)`, 'g')
              node.value = node.value.replace(reg, `$1${replace}` )
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
    }
  })
  return generate(ast)
}
function canChange(path) {
  const parenNode = path.parent
  if (parenNode.type !== 'CallExpression') return false
  if (parenNode.callee && parenNode.callee.name === 'h' || parenNode.callee.name === '_c') {
    return true
  }
  return false
}
// function isSelector(path) {
//   let result = false
//   path.traverse({
//     Identifier(path) {
//       const name = path.node.name
//       if (name === 'querySelector' || name === 'querySelectorAll') {
//         result = true
//       }
//     }
//   })
//   return result
// }

function writeFile(data) {
  fs.writeFile('log.js', data, (err) => {
    if (err) {
      throw Error(err)
    }
    console.log('write success');
  })
}