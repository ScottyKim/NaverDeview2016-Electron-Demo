const {ipcRenderer} = require('electron');

const ORIGINAL_MESSAGE = 'Hello Naver! Hello Electron!';
class DeviewHello {
  constructor(){
      this.headerEl = document.querySelector('header');
  }
  changeText(arg){
    this.helloMessegeEl.innerHTML = arg;
  }
  render(){
    let helloMessegeEl = this.helloMessegeEl = document.createElement('h1');
    helloMessegeEl.id = 'hello';
    helloMessegeEl.innerHTML = ORIGINAL_MESSAGE;
    this.headerEl.appendChild(helloMessegeEl);
    helloMessegeEl.origin = this;
  }
}

let helloStart = new DeviewHello;
helloStart.render();

setTimeout(() => {
  ipcRenderer.send('deview-2016-hello', 'start');
}, 1000);
ipcRenderer.on('deview-2016-print', (event, arg) => {
  let helloEl = document.querySelector('#hello');
  helloEl.origin.changeText(arg);
});

class Rect {
  constructor(canvas, id){
    this.canvas = canvas;
    let rect = this.rect = document.createElement('div');
    rect.id = id;
    rect.style.position = 'relative';
    rect.style.backgroundColor = '#FF7472';
    rect.style.borderRadius = '25px';
    rect.origin = this;
    this.addEvent();
  }
  addEvent(){
    this.rect.addEventListener('click', () => {
      ipcRenderer.send('edit-rect', {id:this.rect.id, parameter: 'x', newValue: 0, oldValue: this.rect.left});
      ipcRenderer.send('edit-rect', {id:this.rect.id, parameter: 'y', newValue: 0, oldValue: this.rect.top});
    });
  }
  addToCanvas(){
    this.canvas.appendChild(this.rect);
  }
  deleteFromCanvas(){
    this.canvas.removeChild(this.rect);
  }
  get width () {return this.rect.style.width.replace('px','');}
  set width (newValue){this.rect.style.width = `${newValue}px`;}
  get height () { return this.rect.style.height.replace('px','');}
  set height (newValue){this.rect.style.height = `${newValue}px`;}
  get top () { return this.rect.style.top.replace('px','');}
  set top (newValue){this.rect.style.top = `${newValue}px`;}
  get left () { return this.rect.style.left.replace('px','');}
  set left (newValue){this.rect.style.left = `${newValue}px`;}
}

ipcRenderer.on('add-canvas-rect', (event, arg) => {
  let canvas = document.querySelector('#canvas');
  let startRect = new Rect(canvas, arg.id);
  startRect.addToCanvas();
});
ipcRenderer.on('delete-canvas-rect', (event, arg) => {
  let targetEl = document.querySelector(`#${arg.id}`);
  targetEl.origin.deleteFromCanvas();
});

ipcRenderer.on('edit-canvas-rect', (event, arg) => {
  let targetEl = document.querySelector(`#${arg.id}`);
  switch( arg.parameter ){
    case 'x': targetEl.origin.left = arg.value; break;
    case 'y': targetEl.origin.top = arg.value; break;
    case 'w': targetEl.origin.width = arg.value; break;
    case 'h': targetEl.origin.height = arg.value; break;
  }
});

document.querySelector('#add').addEventListener('click', (event) => {
  ipcRenderer.send('rect-add', {id:'rect-1', parameter: 'add', newValue: 0, oldValue: 0});
  ipcRenderer.send('edit-rect', {id:'rect-1', parameter: 'w', newValue: 100, oldValue: 0});
  ipcRenderer.send('edit-rect', {id:'rect-1', parameter: 'h', newValue: 100, oldValue: 0});
  ipcRenderer.send('edit-rect', {id:'rect-1', parameter: 'x', newValue: 136, oldValue: 0});
  ipcRenderer.send('edit-rect', {id:'rect-1', parameter: 'y', newValue: 50, oldValue: 0});
});

document.querySelector('#move-rect-1').addEventListener('click', (event) => {
  ipcRenderer.send('edit-rect', {id:'rect-1', parameter: 'x', newValue: 275, oldValue: 136});
  ipcRenderer.send('edit-rect', {id:'rect-1', parameter: 'y', newValue: 375, oldValue: 50});
});

document.querySelector('#undo').addEventListener('click', (event) => {
  ipcRenderer.send('move-undo');
});

document.querySelector('#delete').addEventListener('click', (event) => {
  ipcRenderer.send('rect-delete', {id:'rect-1', parameter: 'delete', newValue: 0, oldValue: 0});
});
