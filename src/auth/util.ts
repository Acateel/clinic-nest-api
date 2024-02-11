export function generateCode() {
  const min = 10000
  const max = 99999
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  return num.toString()
}

export function generatePassword() {
  var length = 8,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    retVal = ''
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}
