const actionMenuObj = (function () {
  function ActionMenu() {
    let actionMenuCtrElem = document.querySelector('.action-menu-ctr');
    let hide = true;
    this.menuItems = [];

    //Method to show Action menu.
    this.show = (e, menuItems) => {
      e.preventDefault();
      this.menuItems = menuItems;
      let menuItemsHtml = '';
      menuItems.forEach((item, index) => {
        menuItemsHtml += `<div index=${index}>${item.name}</div>`;
      });
      actionMenuCtrElem.style.display = 'block';
      actionMenuCtrElem.style.top = e.clientY + 'px';
      actionMenuCtrElem.style.left = e.clientX + 'px';
      let menuItemsCtr = actionMenuCtrElem.querySelector('.menu-items');
      menuItemsCtr.innerHTML = menuItemsHtml;
      hide = false;
    };

    //Method to hide Action menu.
    this.hide = () => {
      actionMenuCtrElem.style.display = 'none';
      hide = true;
    };

    //Method to attach events.
    let addEvents = () => {
      actionMenuCtrElem.addEventListener('click', (e) => {
        let index = e.target.getAttribute('index');
        this.menuItems[index].callback();
      });
      document.addEventListener('click', function (e) {
        actionMenuObj.hide();
      });
    };
    addEvents();
  }

  return new ActionMenu();
})();

