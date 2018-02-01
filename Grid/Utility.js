function convertToBase(base, num) {
  let str = '';
  while (num !== 0) {
    num = num - 1;
    let rem = num % base;
    str = String.fromCharCode(rem + 65) + str;
    num = parseInt(num / base);
  }
  return str;
}
let convertToBase26 = convertToBase.bind(null, 26);