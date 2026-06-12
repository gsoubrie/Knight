/* ═══════════════════════════════════════════
   KNIGHT — ui/ledger.js
   Journal des dépenses/gains PES et PG
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.ui = KNIGHT.ui || {};

KNIGHT.ui.ledger = (function () {

  var _char = null;

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */

  function _renderLedger(ledger) {
    var prefix = ledger.id;

    // Résumé
    var soldeEl   = document.getElementById(prefix + '-solde');
    var gainsEl   = document.getElementById(prefix + '-gains');
    var depensesEl = document.getElementById(prefix + '-depenses');

    if (soldeEl)    soldeEl.textContent   = ledger.solde();
    if (gainsEl)    gainsEl.textContent   = '+' + ledger.totalGains();
    if (depensesEl) depensesEl.textContent = '−' + ledger.totalDepenses();

    // Base
    var baseEl = document.getElementById(prefix + '-base');
    if (baseEl) baseEl.value = ledger.base;

    // Liste des entrées
    var list = document.getElementById(prefix + '-entries');
    if (!list) return;

    var entries = ledger.sorted();
    if (entries.length === 0) {
      list.innerHTML = '<div class="ledger-empty">Aucune entrée pour l\'instant</div>';
      return;
    }

    list.innerHTML = '';
    entries.forEach(function (entry) {
      var isCredit = entry.amount >= 0;
      var row = document.createElement('div');
      row.className = 'ledger-entry';

      var descEl = document.createElement('span');
      descEl.className = 'ledger-entry-desc';
      descEl.textContent = entry.desc || '—';

      var dateEl = document.createElement('span');
      dateEl.className = 'ledger-entry-date';
      dateEl.textContent = entry.date;

      var amtEl = document.createElement('span');
      amtEl.className = 'ledger-entry-amount ' + (isCredit ? 'credit' : 'debit');
      amtEl.textContent = (isCredit ? '+' : '') + entry.amount;

      var delBtn = document.createElement('button');
      delBtn.className   = 'ledger-entry-del';
      delBtn.textContent = '×';
      delBtn.title       = 'Supprimer';
      delBtn.addEventListener('click', (function (l, eid) {
        return function () {
          l.remove(eid);
          _renderLedger(l);
        };
      }(ledger, entry.id)));

      row.appendChild(descEl);
      row.appendChild(dateEl);
      row.appendChild(amtEl);
      row.appendChild(delBtn);
      list.appendChild(row);
    });
  }

  function render(char) {
    _char = char;
    _renderLedger(char.ledgerPes);
    _renderLedger(char.ledgerPg);
  }

  /* ════════════════════════════════════════
     AJOUT D'ENTRÉE
  ════════════════════════════════════════ */

  function _addEntry(ledger, prefix) {
    var descEl   = document.getElementById(prefix + '-add-desc');
    var amountEl = document.getElementById(prefix + '-add-amount');
    var typeEl   = document.getElementById(prefix + '-add-type');

    var desc   = descEl   ? descEl.value.trim()           : '';
    var amount = amountEl ? parseInt(amountEl.value) || 0  : 0;
    var type   = typeEl   ? typeEl.value                  : 'debit';

    if (amount === 0) return;
    if (type === 'debit' && amount > 0) amount = -amount;
    if (type === 'credit' && amount < 0) amount = Math.abs(amount);

    ledger.add(desc || (type === 'credit' ? 'Gain' : 'Dépense'), amount);

    if (descEl)   descEl.value   = '';
    if (amountEl) amountEl.value = '';

    _renderLedger(ledger);
  }

  /* ════════════════════════════════════════
     INIT
  ════════════════════════════════════════ */

  function _initLedger(ledger) {
    var prefix = ledger.id;

    // Base
    var baseEl = document.getElementById(prefix + '-base');
    if (baseEl) {
      baseEl.addEventListener('input', function () {
        ledger.base = parseInt(this.value) || 0;
        _renderLedger(ledger);
      });
    }

    // Bouton crédit
    var creditBtn = document.getElementById(prefix + '-btn-credit');
    if (creditBtn) {
      creditBtn.addEventListener('click', function () {
        var typeEl = document.getElementById(prefix + '-add-type');
        if (typeEl) typeEl.value = 'credit';
        _addEntry(ledger, prefix);
      });
    }

    // Bouton débit
    var debitBtn = document.getElementById(prefix + '-btn-debit');
    if (debitBtn) {
      debitBtn.addEventListener('click', function () {
        var typeEl = document.getElementById(prefix + '-add-type');
        if (typeEl) typeEl.value = 'debit';
        _addEntry(ledger, prefix);
      });
    }

    // Enter sur le champ montant
    var amountEl = document.getElementById(prefix + '-add-amount');
    if (amountEl) {
      amountEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var typeEl = document.getElementById(prefix + '-add-type');
          var type   = typeEl ? typeEl.value : 'debit';
          var amt    = parseInt(this.value) || 0;
          if (type === 'debit' && amt > 0) {
            var debitBtn2 = document.getElementById(prefix + '-btn-debit');
            if (debitBtn2) debitBtn2.click();
          } else {
            var creditBtn2 = document.getElementById(prefix + '-btn-credit');
            if (creditBtn2) creditBtn2.click();
          }
        }
      });
    }
  }

  function init(char) {
    _char = char;
    _initLedger(char.ledgerPes);
    _initLedger(char.ledgerPg);
    render(char);
  }

  return {
    init:   init,
    render: render
  };

}());
