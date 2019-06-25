/**
 * 判断手机号格式
 */
export const isPhone = (rule, value, callback) => {
  let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/
  if (myreg.exec(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}

/**
 * 判断电话号码格式
 */
export const isSpecialPlane = (rule, value, callback) => {
  let myreg = /^([0-9]{3,4}-)?[0-9]{7,8}$/
  if (myreg.exec(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的电话号码'))
  }
}

/**
 * 验证账号是否正确
 */
export function isAccount (rule, value, callback) {
  let myreg = /^[a-zA-Z][a-zA-Z0-9_]{4,19}$/
  if (myreg.exec(value)) {
    callback()
  } else {
    callback(new Error('以字母开头的5-20位字母、数字或下划线组合'))
  }
}

/**
 * 验证密码是否正确
 */
export function isPassword (rule, value, callback) {
  let myreg = /^[a-zA-Z0-9_.`~!@#$%^&*?]{6,20}$/
  if (myreg.exec(value)) {
    callback()
  } else {
    callback(new Error('以6-20位字母、数字或特殊字符组合'))
  }
}