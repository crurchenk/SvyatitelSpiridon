const PRICE_PER_NAME = 100;
const PAYMENT_URL = '#'; // После подключения ПСБ сюда поставим реальную ссылку или заменим на API-интеграцию.
const namesBox = document.querySelector('#names');
const countEl = document.querySelector('#count');
const amountEl = document.querySelector('#amount');
const payAmountEl = document.querySelector('#pay-amount');
const payLink = document.querySelector('#pay-link');
const addNameBtn = document.querySelector('#add-name');
const form = document.querySelector('#notes-form');
const message = document.querySelector('#form-message');

function addName(value=''){
  const row=document.createElement('div'); row.className='name-row';
  row.innerHTML=`<input class="name-input" type="text" placeholder="Имя" maxlength="80" value="${value.replace(/"/g,'&quot;')}" required><button class="remove-name" type="button" aria-label="Удалить имя">×</button>`;
  row.querySelector('.remove-name').addEventListener('click',()=>{ if(document.querySelectorAll('.name-input').length>1){row.remove();updateTotals();}});
  namesBox.appendChild(row); updateTotals();
}
function updateTotals(){const count=document.querySelectorAll('.name-input').length;const amount=count*PRICE_PER_NAME;countEl.textContent=count;amountEl.textContent=amount;payAmountEl.textContent=amount;payLink.href=PAYMENT_URL;}
addNameBtn.addEventListener('click',()=>addName());
addName();
form.addEventListener('submit',e=>{e.preventDefault();const names=[...document.querySelectorAll('.name-input')].map(x=>x.value.trim()).filter(Boolean);const noteType=document.querySelector('input[name="noteType"]:checked').value;const email=document.querySelector('#email').value.trim();const amount=names.length*PRICE_PER_NAME; if(!email||!names.length)return;const request={noteType,names,email,amount,createdAt:new Date().toISOString()};console.log('Заявка, которую позже отправим на e-mail:',request);message.textContent='Скелет формы готов. На следующем этапе подключим настоящую оплату ПСБ и автоматическую отправку заявки на почту матушки.';});
