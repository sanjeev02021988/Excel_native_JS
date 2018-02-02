const gridObj = (function () {
  function Grid() {
    const self = this;
    let DEFAULT_ROW_COUNT = 30;
    let DEFAULT_COL_COUNT = 26;
    this.m = DEFAULT_ROW_COUNT;
    this.n = DEFAULT_COL_COUNT;

    this.data = [];
    let onChangeCallback = () => {};

    let gridElem = document.querySelector('.grid__container');
    let rowCtrElem = gridElem.querySelector('.grid__row-index-ctr');
    let colCtrElem = gridElem.querySelector('.grid__header .grid__row');
    let ctrElem = gridElem.querySelector('.grid__content');

    //Method to load new data
    this.loadData = (data) => {
      this.data = data;
      _updateRowAndColCount();
      _loadData();
    };

    //Single subscriber only for grid changes
    this.subscribeChanges = callback => {
      onChangeCallback = callback;
    };

    const updateData = (data) => {
      this.data = data;
      onChangeCallback(data);
    };

    //Method to update row and col count.
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

    //Method to render data into grid html.
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
      onChangeCallback(data);
    };

    let getRowCol = (e) => {
      let row = Number(e.target.getAttribute('row'));
      let col = Number(e.target.getAttribute('col'));
      return { row, col };
    };

    //Method to attach events.
    let addEvents = () => {
      _enableCopyPaste();
      _enableCellEditing();
      _addContextMenuForColandRowHdr();
    };

    const _enableCopyPaste = () => {
      let startRow = 0, startCol = 0;
      let clipboard = null;
      let ctrlDown = false,
        ctrlKey = 17,
        vKey = 86,
        cKey = 67;
      let copied = false;
      let currentRow = null, currentCol = null;

      gridElem.addEventListener('click', (e) => {
        let { row, col } = getRowCol(e);
        let rowHdrCurrentCell = rowCtrElem.querySelector(`div:nth-child(${currentRow + 2})`);
        let colHdrCurrentCell = colCtrElem.querySelector(`div:nth-child(${currentCol + 1})`);
        if (rowHdrCurrentCell) {
          rowHdrCurrentCell.classList.remove('active');
        }
        if (colHdrCurrentCell) {
          colHdrCurrentCell.classList.remove('active');
        }
        currentRow = row;
        currentCol = col;
        rowHdrCurrentCell = rowCtrElem.querySelector(`div:nth-child(${currentRow + 2})`);
        colHdrCurrentCell = colCtrElem.querySelector(`div:nth-child(${currentCol + 1})`);
        if (e.target.getAttribute('row') === null) {
          colHdrCurrentCell.classList.add('active');
        } else {
          rowHdrCurrentCell.classList.add('active');
        }
        if (e.target.getAttribute('col') === null) {
          rowHdrCurrentCell.classList.add('active');
        } else {
          colHdrCurrentCell.classList.add('active');
        }
      });

      gridElem.addEventListener('mousedown', (e) => {
        let { row, col } = getRowCol(e);
        startRow = row;
        startCol = col;
      });

      gridElem.addEventListener('mouseup', (e) => {
        let { row, col } = getRowCol(e);
        if (startRow - row === 0 && startCol - col === 0) {
          return null;
        }
        copied = false;
        clipboard = getData(self.data, startRow, startCol, row, col);
      });

      document.addEventListener('keydown', function (e) {
        if (e.keyCode === ctrlKey) {
          ctrlDown = true;
        }
        if (ctrlDown && clipboard && e.keyCode === cKey) {
          copied = true;
        }
        if (ctrlDown && copied && clipboard && e.keyCode === vKey) {
          if (currentRow !== null && currentCol !== null) {
            self.data = appendData(self.data, clipboard, currentRow, currentCol);
            _loadData();
          }
        }
      });
      document.addEventListener('keyup', function (e) {
        if (e.keyCode === ctrlKey) {
          ctrlDown = false;
        }
      });
    };

    const _enableCellEditing = () => {
      gridElem.addEventListener('dblclick', (e) => {
        let cellElem = e.target;
        let { row, col } = getRowCol(e);
        let data = this.data[row] && this.data[row][col] || '';
        cellElem.innerHTML = `<input value='${data}'/>`;
        let inputElem = cellElem.querySelector('input');
        inputElem.focus();
        inputElem.addEventListener('blur', (e) => {
          let cellElem = e.target.closest('div');
          let cellValue = e.target.value;
          if (!this.data[row]) {
            this.data[row] = [];
          }
          this.data[row][col] = cellValue;
          cellElem.innerHTML = cellValue;
        });
      });
    };

    const _addContextMenuForColandRowHdr = () => {
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
            callback: () => {
              self.m--;
              self.data = [...self.data.slice(0, row), ...self.data.slice(row + 1)];
              _loadData();
            }
          },
          {
            name: 'Sort',
            callback: () => {
              self.data[row].sort((a, b) => a - b);
              _loadData();
            }
          },
        ];
        actionMenuObj.show(e, menuItems);
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
            callback: () => {
              self.n--;
              deleteCol(self.data, col);
              _loadData();
            }
          },
          {
            name: 'Sort',
            callback: () => {
              sortColumn(self.data, col);
              _loadData();
            }
          },
        ];
        actionMenuObj.show(e, menuItems);
        function insert(col) {
          self.n++;
          insertNewCol(self.data, col);
          _loadData();
        }
      });
    };
    addEvents();
  }

  return new Grid();
})();