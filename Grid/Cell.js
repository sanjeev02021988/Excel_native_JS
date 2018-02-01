function Cell(row, col, data) {
  this.getHtml = () => {
    if (data) {
      return `<div row='${row}' col='${col}'>${data}</div>`;
    } else {
      return `<div row='${row}' col='${col}'></div>`;
    }
  }
}