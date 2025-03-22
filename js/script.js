const resultDiv = document.getElementById('result');
const historyDiv = document.getElementById('history');

let historySet = new Set();

document.getElementById('generateBtn').addEventListener('click', function () {
  const min = parseFloat(document.getElementById('minValue').value);
  const max = parseFloat(document.getElementById('maxValue').value);
  const step = parseFloat(document.getElementById('stepValue').value);
  const decimalPlaces = parseInt(document.getElementById('decimalPlaces').value);
  const outputCount = parseInt(document.getElementById('outputCount').value);
  const excludeValues = document.getElementById('excludeValues').value
    .split(',')
    .map(v => parseFloat(v.trim()))
    .filter(v => !isNaN(v));
  const parity = document.getElementById('parityFilter').value;
  const noDuplicate = document.getElementById('noDuplicate').checked;

  if (isNaN(min) || isNaN(max) || isNaN(step) || step <= 0 || min > max || isNaN(decimalPlaces) || isNaN(outputCount)) {
    resultDiv.textContent = '入力値に誤りがあります';
    return;
  }

  const values = [];

  for (let v = min; v <= max + 1e-8; v += step) {
    let rounded = parseFloat(v.toFixed(decimalPlaces));

    // 除外リストに入ってるを判定
    if (excludeValues.includes(rounded)) continue;

    // 偶数・奇数フィルター
    if (parity === 'even' && rounded % 2 !== 0) continue;
    if (parity === 'odd' && rounded % 2 !== 1 && Math.floor(rounded) % 2 !== 1) continue;

    // 重複禁止モードではすでに出たものは除外
    if (noDuplicate && historySet.has(rounded)) continue;

    values.push(rounded);
  }

  if (values.length === 0) {
    resultDiv.textContent = '条件に一致する数値がありません';
    return;
  }

  const selected = [];
  for (let i = 0; i < outputCount; i++) {
    if (values.length === 0) break;
    const index = Math.floor(Math.random() * values.length);
    const val = values[index];
    selected.push(val);

    historySet.add(val);

    if (noDuplicate) {
      values.splice(index, 1); // 値を削除
    }
  }

  resultDiv.textContent = `出力: ${selected.map(v => v.toFixed(decimalPlaces)).join(', ')}`;
  historyDiv.textContent = `${Array.from(historySet).map(v => v.toFixed(decimalPlaces)).join(', ')}`;

});
