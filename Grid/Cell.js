function Cell(row, col, data) {
  this.getHtml = () => {
    if (typeof data !== 'undefined') {
      return `<div row='${row}' col='${col}'>${data}</div>`;
    } else {
      return `<div row='${row}' col='${col}'></div>`;
    }
  }
}