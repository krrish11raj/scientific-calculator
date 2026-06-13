let cur = '0', prev = '', operator = '', waitingForOperand = false, calcHistory = [];

function upd(v) {
  const el = document.getElementById('display');
  const s = String(v);
  el.style.fontSize = s.length > 12 ? '18px' : s.length > 9 ? '24px' : '36px';
  el.textContent = s;
}

function digit(d) {
  if (waitingForOperand) { cur = d; waitingForOperand = false; }
  else cur = cur === '0' ? d : cur + d;
  upd(cur);
}

function dot() {
  if (waitingForOperand) { cur = '0.'; waitingForOperand = false; upd(cur); return; }
  if (!cur.includes('.')) cur += '.';
  upd(cur);
}

function op(o) {
  if (operator && !waitingForOperand) equals(true);
  prev = cur; operator = o; waitingForOperand = true;
  const sym = {'*':'×', '/':'÷', '+':'+', '-':'−'}[o];
  document.getElementById('history').textContent = prev + ' ' + sym;
}

function equals(chain) {
  if (!operator) return;
  const a = parseFloat(prev), b = parseFloat(cur);
  let res;
  if (operator === '+') res = a + b;
  else if (operator === '-') res = a - b;
  else if (operator === '*') res = a * b;
  else if (operator === '/') res = b === 0 ? 'Error' : a / b;
  const sym = {'*':'×', '/':'÷', '+':'+', '-':'−'}[operator];
  const expr = prev + ' ' + sym + ' ' + cur;
  if (!chain) {
    document.getElementById('history').textContent = expr + ' =';
    addHistory(expr, res === 'Error' ? 'Error' : parseFloat(res.toFixed(10)).toString());
    operator = ''; waitingForOperand = false;
  }
  cur = res === 'Error' ? 'Error' : parseFloat(res.toFixed(10)).toString();
  upd(cur);
}

function clearAll() {
  cur = '0'; prev = ''; operator = ''; waitingForOperand = false;
  document.getElementById('history').textContent = '';
  upd('0');
}

function toggleSign() {
  if (cur === 'Error') return;
  cur = (parseFloat(cur) * -1).toString(); upd(cur);
}

function percent() {
  if (cur === 'Error') return;
  cur = (parseFloat(cur) / 100).toString(); upd(cur);
}

function calcFn(fn) {
  if (cur === 'Error') return;
  const v = parseFloat(cur);
  let res;
  if (fn === 'sin') res = Math.sin(v * Math.PI / 180);
  else if (fn === 'cos') res = Math.cos(v * Math.PI / 180);
  else if (fn === 'tan') res = Math.tan(v * Math.PI / 180);
  else if (fn === 'log') res = v <= 0 ? 'Error' : Math.log10(v);
  else if (fn === 'ln') res = v <= 0 ? 'Error' : Math.log(v);
  else if (fn === 'sqrt') res = v < 0 ? 'Error' : Math.sqrt(v);
  else if (fn === 'sq') res = v * v;
  cur = res === 'Error' ? 'Error' : parseFloat(res.toFixed(10)).toString();
  addHistory(fn + '(' + v + ')', cur);
  waitingForOperand = false; upd(cur);
}

function insertConst(c) {
  cur = parseFloat(eval(c).toFixed(10)).toString();
  waitingForOperand = false; upd(cur);
}

function addHistory(expr, result) {
  calcHistory.unshift({ expr, result });
  if (calcHistory.length > 15) calcHistory.pop();
  renderHistory();
}

function renderHistory() {
  const el = document.getElementById('histList');
  el.innerHTML = calcHistory.map((h, i) =>
    '<div class="hist-item" onclick="loadHist(' + i + ')"><span>' + h.expr + '</span><span>' + h.result + '</span></div>'
  ).join('');
}

function loadHist(i) {
  cur = String(calcHistory[i].result);
  waitingForOperand = false; upd(cur);
}

function setMode(m) {
  document.querySelectorAll('.mode-btn').forEach((b, i) =>
    b.classList.toggle('active', (m==='basic'&&i===0)||(m==='sci'&&i===1))
  );
  document.getElementById('sciGrid').classList.toggle('show', m === 'sci');
}

function toggleHistory() {
  const p = document.getElementById('histPanel');
  p.classList.toggle('show');
  document.querySelectorAll('.mode-btn')[2].classList.toggle('active', p.classList.contains('show'));
}