function Sheet(sheetId = 0, sheetName = '', sheetData = []) {
  let id = sheetId;
  let name = sheetName;
  let data = sheetData;

  this.getName = () => {
    return name;
  };

  this.setName = (sheetName) => {
    name = sheetName;
  };

  this.setData = (sheetData) => {
    data = sheetData;
  };

  this.getData = () => {
    return data;
  };

  const addEvents = () => {

  };

  addEvents();
}