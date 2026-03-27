(() => {
  const opSymbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
  const opNames   = { add: 'plus', subtract: 'minus', multiply: 'times', divide: 'divided by' };

  let selectedOp = null;

  // --- Op card selection ---
  document.querySelectorAll('.op-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.op-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedOp = card.dataset.op;
      document.getElementById('opDisplay').textContent = card.dataset.sym;
    });
  });

  // --- Calculate button ---
  document.getElementById('calcBtn').addEventListener('click', calculate);

  // --- Enter key on inputs ---
  document.querySelectorAll('.num-input').forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
  });

  const y = new Date().getFullYear();
  document.querySelector("#year").textContent = y === 2026 ? y : `2026-${y}`;

  async function calculate() {
    const a  = document.getElementById('numberA').value.trim();
    const b  = document.getElementById('numberB').value.trim();
    const btn     = document.getElementById('calcBtn');
    const btnText = document.getElementById('btnText');
    const area    = document.getElementById('resultArea');

    // Client-side validation
    if (a === '' || b === '' || !selectedOp) {
      showError(area, 'Fill in both numbers and pick an operation.');
      return;
    }

    // Loading state
    btn.classList.add('loading');
    btnText.textContent = 'Computing…';
    area.innerHTML = '';

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numberA: parseFloat(a),
          numberB: parseFloat(b),
          operation: selectedOp
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        showError(area, data.error || 'Server error.');
      } else {
        showResult(area, data);
      }

    } catch (err) {
      showError(area, 'Network error. Is the server running?');
    } finally {
      btn.classList.remove('loading');
      btnText.textContent = 'Calculate';
    }
  }

  function formatNumber(n) {
    // Show as integer if whole, else up to 8 decimal places trimmed
    if (Number.isInteger(n)) return n.toString();
    return parseFloat(n.toFixed(8)).toString();
  }

  function showResult(area, data) {
    const { numberA, numberB, operation, result } = data;
    const sym  = opSymbols[operation] || '?';
    const name = opNames[operation]   || '';

    area.innerHTML = `
      <div class="result-box success-box">
        <div class="result-equation">
          ${formatNumber(numberA)} ${sym} ${formatNumber(numberB)} =
        </div>
        <div class="result-value">${formatNumber(result)}</div>
      </div>`;
  }

  function showError(area, msg) {
    area.innerHTML = `
      <div class="result-box error-box">
        <span class="error-icon">⚠</span>
        <span class="error-msg">${escapeHtml(msg)}</span>
      </div>`;
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();
