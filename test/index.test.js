const assert = require('assert')
const { getRegExp } = require('../src/utils')
const prefix = 'gp-'
const reg = getRegExp('el-', prefix)

describe('正则替换', () => {
  it('替换el-menu', () => {
    assert.equal(replace('el-menu', reg), 'gp-menu')
  })
  it('替换.el-menu', () => {
    assert.equal(replace('.el-menu', reg), '.gp-menu')
  })
  it('替换carousel-arrow-left', () => {
    assert.equal(replace('carousel-arrow-left', reg), 'carousel-arrow-left')
  })
  it('替换el-menu el-menu-item', () => {
    assert.equal(replace('el-menu el-menu-item', reg), 'el-menu gp-menu-item')
  })
})

function replace(str, reg) {
  return str.replace(reg, `$1${prefix}`)
}