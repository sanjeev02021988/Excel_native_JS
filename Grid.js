let data = [
  [1, 2, 3],
  [4, 5, 6],
  [1, 3, 4]
];
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
function Cell(row, col, data) {
  this.getHtml = () => {
    if (data) {
      return `<div row='${row}' col='${col}'>${data}</div>`;
    } else {
      return `<div row='${row}' col='${col}'></div>`;
    }
  }
}
function grid(data) {
  const self = this;
  let DEFAULT_ROW_COUNT = 30;
  let DEFAULT_COL_COUNT = 26;
  this.data = data;
  this.m = DEFAULT_ROW_COUNT;
  this.n = DEFAULT_COL_COUNT;
  let gridElem = document.querySelector('.grid__container');
  let rowCtrElem = gridElem.querySelector('.grid__row-index-ctr');
  let colCtrElem = gridElem.querySelector('.grid__header .grid__row');
  let ctrElem = gridElem.querySelector('.grid__content');
  let _updateRowAndColCount = () => {
    this.m = DEFAULT_ROW_COUNT;
    this.n = DEFAULT_COL_COUNT;
    let data = this.data;
    if (data && data.length) {
      if (data.length > this.m) {
        this.m = data.length;
      }
      if (data[0] && data[0].length > this.n) {
        this.n = data[0].length;
      }
    }
  };
  let _loadData = () => {
    let data = this.data;
    let rowHtmlStr = '<div></div>';
    for (let i = 0; i < this.m; i++) {
      rowHtmlStr += `<div row="${i}">${i + 1}</div>`;
    }
    rowCtrElem.innerHTML = rowHtmlStr;

    let colHdrHtmlStr = '';
    for (let j = 0; j < this.n; j++) {
      colHdrHtmlStr += `<div col="${j}">${convertToBase26(j + 1)}</div>`;
    }
    colCtrElem.innerHTML = colHdrHtmlStr;

    let htmlStr = '';
    for (let i = 0; i < this.m; i++) {
      let rowData = '<div class="grid__row">';
      for (let j = 0; j < this.n; j++) {
        let cellObj = new Cell(i, j, data[i] && data[i][j]);
        rowData += cellObj.getHtml();
      }
      rowData += '</div>';
      htmlStr += rowData;
    }
    ctrElem.innerHTML = htmlStr;
  };

  _updateRowAndColCount();
  _loadData();
  gridElem.addEventListener('click', (e) => {
    let row = e.target.getAttribute('row');
    let col = e.target.getAttribute('col');
  });
  rowCtrElem.addEventListener('contextmenu', function (e) {
    let row = Number(e.target.getAttribute('row'));
    let menuItems = [
      {
        name: 'Insert 1 above',
        callback: insert.bind(self, row)
      },
      {
        name: 'Insert 1 below',
        callback: insert.bind(self, row + 1)
      },
      {
        name: 'Delete row',
        callback: deleteRow.bind(self, row)
      },
    ];
    actionMenuObj.show(e, menuItems);
    function deleteRow(row) {
      self.m--;
      self.data = [...self.data.slice(0, row), ...self.data.slice(row + 1)];
      _loadData();
    }

    function insert(row) {
      self.m++;
      self.data = [...self.data.slice(0, row), [], ...self.data.slice(row)];
      _loadData();
    }
  });
  colCtrElem.addEventListener('contextmenu', function (e) {
    let col = Number(e.target.getAttribute('col'));
    let menuItems = [
      {
        name: 'Insert 1 left',
        callback: insert.bind(self, col)
      },
      {
        name: 'Insert 1 right',
        callback: insert.bind(self, col + 1)
      },
      {
        name: 'Delete column',
        callback: deleteCol.bind(self, col)
      },
    ];
    actionMenuObj.show(e, menuItems);
    function insert(col) {
      self.n++;
      for (let i = 0; i < self.data.length; i++) {
        let rowData = self.data[i];
        self.data[i] = [...rowData.slice(0, col), '', ...rowData.slice(col)];
      }
      _loadData();
    }

    function deleteCol(col) {
      self.n++;
      for (let i = 0; i < self.data.length; i++) {
        let rowData = self.data[i];
        self.data[i] = [...rowData.slice(0, col), ...rowData.slice(col + 1)];
      }
      _loadData();
    }
  });
  gridElem.addEventListener('dblclick', (e) => {
    let cellElem = e.target;
    let row = cellElem.getAttribute('row');
    let col = cellElem.getAttribute('col');
    let data = this.data[row] && this.data[row][col] || '';
    cellElem.innerHTML = `<input value='${data}'/>`;
    let inputElem = cellElem.querySelector('input');
    inputElem.focus();
    inputElem.addEventListener('blur', (e) => {
      let cellElem = e.target.closest('div');
      let cellValue = e.target.value;
      let row = cellElem.getAttribute('row');
      let col = cellElem.getAttribute('col');
      if (!this.data[row] || !this.data[row][col]) {
        this.data[row] = [];
      }
      this.data[row][col] = cellValue;
      cellElem.innerHTML = cellValue;
    });
  });
}
grid(data);