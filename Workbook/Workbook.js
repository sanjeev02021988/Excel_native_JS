const getSampleData = () => [
  [0, 2, 3],
  [4, 5, 6],
  [1, 3, 4]
];
function Workbook() {
  let self = this;
  let name = 'Untitiled Workbook';
  let sheets = [];
  let currentSheet = 0;

  const workBookInputElem = document.querySelector('.spreadsheet__title input');
  const sheetListCtrElem = document.querySelector('.spreadsheet__sheet-list');
  const addSheetBtn = document.querySelector('.spreadsheet-add-sheet-btn');

  this.getName = () => {
    return name;
  };

  this.setName = (workbookName) => {
    name = workbookName;
  };

  this.getCurrentSheetObj = () => {
    return sheets[currentSheet];
  };

  const onDataChange = (data) => {
    this.getCurrentSheetObj().setData(data);
  };

  this.addSheet = () => {
    let id = sheets.length;
    let name = `Sheet${id}`;
    let newSheetObj = new Sheet(id, name, getSampleData());
    sheets.push(newSheetObj);
    currentSheet = id;
  };

  const loadWorkBook = () => {
    workBookInputElem.value = name;
    let sheetHtmlStr = '';
    sheets.forEach((item, idx) => {
      let classname = idx === currentSheet ? 'active' : '';
      sheetHtmlStr += `<div class="${classname}" index="${idx}">${item.getName()}</div>`;
    });
    sheetListCtrElem.innerHTML = sheetHtmlStr;
    gridObj.loadData(this.getCurrentSheetObj().getData());
  };

  const changeSheet = (sheetId) => {
    currentSheet = sheetId;
    sheetListCtrElem.querySelector(`div.active`).classList.remove('active');
    sheetListCtrElem.querySelector(`div:nth-child(${currentSheet + 1})`).classList.add('active');
    gridObj.loadData(this.getCurrentSheetObj().getData());
  };

  const addEvents = () => {
    workBookInputElem.addEventListener('change', function (e) {
      self.setName(e.target.value);
    });
    addSheetBtn.addEventListener('click', function () {
      self.addSheet();
      loadWorkBook();
    });
    sheetListCtrElem.addEventListener('click', function (e) {
      changeSheet(Number(e.target.getAttribute('index')));
    });
    sheetListCtrElem.addEventListener('dblclick', function (e) {
      debugger;
      let sheetTitleElem = e.target;
      currentSheet = e.target.getAttribute('index');
      let sheetObj = self.getCurrentSheetObj();
      let sheetName = sheetObj.getName();
      sheetTitleElem.innerHTML = `<input value='${sheetName}'/>`;
      let inputElem = sheetTitleElem.querySelector('input');
      inputElem.focus();
      inputElem.addEventListener('blur', (e) => {
        let cellElem = e.target.closest('div');
        let cellValue = e.target.value;
        sheetObj.setName(cellValue);
        cellElem.innerHTML = cellValue;
      });
    });
  };

  this.addSheet();
  addEvents();
  loadWorkBook();
  gridObj.subscribeChanges(onDataChange.bind(this));
}

let workBookObj = new Workbook();