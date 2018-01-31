function ActionMenu(menuItems){
  let actionMenuCtrElem = document.querySelector('.action-menu-ctr');
  let hide = true;
  this.show = (e) => {
    e.preventDefault();
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
  this.hide = () => {
    actionMenuCtrElem.style.display = 'none';
    hide = true;
  };
  actionMenuCtrElem.addEventListener('click', (e) => {
    let index = e.target.getAttribute('index');
    menuItems[index].callback();
  });
}
let actionMenuObj = new ActionMenu([
  {
    name:'Add Item', 
    callback:()=>console.log('Add Item')
  },
  {
    name:'Remove Item',
    callback:()=>console.log('Remove Item')
  }
]);
document.addEventListener('contextmenu', function(e){
  actionMenuObj.show(e);
});
document.addEventListener('click', function(e){
  actionMenuObj.hide();
});
