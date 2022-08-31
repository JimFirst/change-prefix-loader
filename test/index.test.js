const assert = require('assert')
const { getRegExp } = require('../src/utils')
const prefix = 'gp-'
const reg = getRegExp('el-', prefix)

describe('正则替换', () => {
  generateIt('el-menu', 'gp-menu')
  generateIt('.el-menu', '.gp-menu')
  generateIt('babel-helper-vue-jsx-merge-props', 'babel-helper-vue-jsx-merge-props')
  generateIt('carousel-arrow-left', 'carousel-arrow-left')
  generateIt('el-menu el-menu-item', 'gp-menu gp-menu-item')

  function generateIt(str, expect) {
    it(`替换${str}`, () => {
      assert.equal(replace(str, reg), expect)
    })
  }
})


function replace(str, reg) {
  return str.replace(reg, `$1${prefix}`)
}