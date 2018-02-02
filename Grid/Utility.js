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

function getData(data, x1, y1, x2, y2) {
  let subset = [];
  let startRowIdx = x1, startColIdx = y1, endRowIdx = x2, endColIdx = y2;
  if (x1 > x2) {
    startRowIdx = x2;
    endRowIdx = x1;
  }
  if (y1 > y2) {
    startColIdx = y2;
    endColIdx = y1;
  }
  let k = 0, l = 0;
  for (let i = startRowIdx; i <= endRowIdx; i++) {
    subset[k] = [];
    for (let j = startColIdx; j <= endColIdx; j++) {
      subset[k][l] = data[i] && data[i][j];
      l++;
    }
    k++;
    l = 0;
  }
  return subset;
}

function appendData(data1, data2, x1, y1) {
  let endRowIdx = data2.length + x1;
  let k = 0, l = 0;
  for (let i = x1; i < endRowIdx; i++) {
    data1[i] = data1[i] ? data1[i] : [];
    let endColIdx = data2[k].length + y1;
    for (let j = y1; j <= endColIdx; j++) {
      data1[i][j] = data2[k][l];
      l++;
    }
    k++;
    l = 0;
  }
  return data1;
}

function sortColumn(data, col) {
  data.sort((a, b) => {
    if (typeof b[col] === 'undefined') {
      return -1;
    }
    if (typeof a[col] === 'undefined') {
      return 1;
    }
    return a[col] - b[col];
  });
}

function insertNewCol(data, col) {
  for (let i = 0; i < data.length; i++) {
    let rowData = data[i];
    if (rowData) {
      data[i] = [...rowData.slice(0, col), undefined, ...rowData.slice(col)];
    }
  }
}

function deleteCol(data, col) {
  for (let i = 0; i < data.length; i++) {
    let rowData = data[i];
    if (rowData) {
      data[i] = [...rowData.slice(0, col), ...rowData.slice(col + 1)];
    }
  }
}