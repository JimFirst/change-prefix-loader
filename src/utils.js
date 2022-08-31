function getRegExp(prefix, exclude) {
  let reg
  if (exclude) {
    reg = new RegExp(`(^|(\\s)+|(\\')|(\\")|(\\.)+)${prefix}(?!${exclude})`, 'g')
  } else {
    reg = new RegExp(`(^|(\\s)+|(\\')|(\\")|(\\.)+)${prefix}`, 'g')
  }
  return reg;
}
exports.getRegExp = getRegExp