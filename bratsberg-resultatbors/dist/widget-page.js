import {loadData,showError} from './data.js';import {mountWidget} from './widget.js';
const el=document.querySelector('#result-widget');loadData().then(data=>mountWidget(el,data,{embedded:window.self!==window.top})).catch(()=>showError(el));
