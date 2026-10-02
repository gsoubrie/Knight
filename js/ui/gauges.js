/* ═══════════════════════════════════════════
   KNIGHT — ui/gauges.js
   Rendu et interactions des jauges
   PS / PES / PA / CDF / PE
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.ui = KNIGHT.ui || {};

// Fonction utilitaire pour échapper le HTML
function _escapeHtml(text) {
  if (text === null || text === undefined) return '';
  var div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

KNIGHT.ui.gauges = (function () {

  var _char = null;

  var GAUGE_IDS = ['ps', 'pes', 'pa', 'cdf', 'pe'];

  // ── Mise à jour visuelle ──

  function _update(name) {
    var curEl = document.getElementById(name + '-current');
    var maxEl = document.getElementById(name + '-max');
    var cur = (curEl && curEl.value) ? parseFloat(curEl.value) || 0 : 0;
    var max = (maxEl && maxEl.value) ? parseFloat(maxEl.value) || 1 : 1;
    var pct = Math.max(0, Math.min(100, (cur / max) * 100));
    var fill = document.getElementById('gauge-' + name + '-fill');
    if (fill) fill.style.width = pct + '%';
    
    // Mettre à jour les affichages des valeurs
    var curDisplay = document.getElementById(name + '-current-display');
    var maxDisplay = document.getElementById(name + '-max-display');
    if (curDisplay) curDisplay.textContent = Math.floor(cur);
    if (maxDisplay) maxDisplay.textContent = Math.floor(max);

    // Sync modèle
    if (_char && _char.gauges[name]) {
      _char.gauges[name].current = cur;
      _char.gauges[name].max     = max;
    }
  }

  // ── Clic sur la barre ──

  function _handleClick(e, name) {
    var track = e.currentTarget;
    var rect  = track.getBoundingClientRect();
    var pct   = (e.clientX - rect.left) / rect.width;
    var max   = parseFloat(document.getElementById(name + '-max').value) || 1;
    var val   = Math.round(pct * max);
    document.getElementById(name + '-current').value = val;
    _update(name);
  }

  // ── Modal de modification de jauge ──

  var _currentGaugeModal = null;

  function _openGaugeModal(gaugeId, type, defaultDelta) {
    _currentGaugeModal = { gaugeId: gaugeId, type: type };
    
    var modal = document.getElementById('gauge-modify-modal');
    if (!modal) return;
    
    var deltaEl = document.getElementById('gauge-modify-delta');
    var reasonEl = document.getElementById('gauge-modify-reason');
    var titleEl = document.querySelector('#gauge-modify-modal .modal-title');
    
    // Mettre à jour le titre avec le nom de la jauge
    var gaugeLabels = { ps: 'PS', pa: 'PA', pe: 'PE', cdf: 'CDF', pes: 'PES' };
    var gaugeLabel = gaugeLabels[gaugeId] || gaugeId;
    var actionLabel = defaultDelta > 0 ? 'Ajouter' : 'Retirer';
    if (titleEl) {
      titleEl.textContent = actionLabel + ' des ' + gaugeLabel;
    }
    
    if (deltaEl) {
      deltaEl.value = defaultDelta;
      // Mettre le focus sur le champ delta
      deltaEl.focus();
      deltaEl.select();
    }
    if (reasonEl) reasonEl.value = '';
    
    modal.classList.add('open');
    
    // Empêcher le scroll du body quand la modal est ouverte
    document.body.style.overflow = 'hidden';
  }

  function _closeGaugeModal() {
    var modal = document.getElementById('gauge-modify-modal');
    if (modal) modal.classList.remove('open');
    _currentGaugeModal = null;
    
    // Rétablir le scroll du body
    document.body.style.overflow = '';
  }

  function _applyGaugeModal() {
    if (!_currentGaugeModal || !_char) return;
    
    var gaugeId = _currentGaugeModal.gaugeId;
    var type = _currentGaugeModal.type;
    
    var deltaEl = document.getElementById('gauge-modify-delta');
    var reasonEl = document.getElementById('gauge-modify-reason');
    
    if (!deltaEl) return;
    
    var delta = parseInt(deltaEl.value) || 0;
    var reason = reasonEl ? reasonEl.value.trim() : '';
    
    if (delta === 0) {
      _closeGaugeModal();
      return;
    }
    
    // Appliquer la modification
    var currentEl = document.getElementById(gaugeId + '-' + type);
    var maxEl = document.getElementById(gaugeId + '-max');
    
    if (!currentEl) return;
    
    var oldValue = parseInt(currentEl.value) || 0;
    var maxValue = maxEl ? parseInt(maxEl.value) || Infinity : Infinity;
    var newValue = Math.max(0, Math.min(maxValue, oldValue + delta));
    
    // Mettre à jour l'input
    currentEl.value = newValue;
    
    // Mettre à jour l'affichage
    var displayEl = document.getElementById(gaugeId + '-' + type + '-display');
    if (displayEl) {
      displayEl.textContent = newValue;
    }
    
    // Ajouter un log avec la nouvelle valeur
    if (_char.addGaugeLog) {
      _char.addGaugeLog(gaugeId, type, oldValue, newValue, reason);
      
      // Rafraîchir le journal s'il est actuellement ouvert
      if (_journalVisible) {
        _renderJournal();
      }
    }
    
    // Mettre à jour la jauge visuelle
    _update(gaugeId);
    
    // Synchroniser le modèle
    if (_char.gauges[gaugeId]) {
      _char.gauges[gaugeId][type] = newValue;
    }
    
    _closeGaugeModal();
  }

  // ── Journal des modifications ──

  var _journalVisible = false;

  function _toggleJournal() {
    _journalVisible = !_journalVisible;
    var journalList = document.getElementById('gauge-journal-list');
    var journalBtn = document.getElementById('btn-gauge-journal');
    
    if (!_char || !journalList) return;
    
    if (_journalVisible) {
      _renderJournal();
      journalBtn.textContent = '📖 Masquer le journal';
    } else {
      journalList.innerHTML = '';
      journalBtn.textContent = '📖 Voir le journal';
    }
  }

  function _renderJournal() {
    var journalList = document.getElementById('gauge-journal-list');
    if (!journalList || !_char || !_char.gaugeLogs) return;
    
    var html = '<div class="journal-table">';
    
    _char.gaugeLogs.slice().reverse().forEach(function(log) {
      var gaugeLabels = { ps: 'PS', pa: 'PA', pe: 'PE', cdf: 'CDF', pes: 'PES' };
      var gaugeLabel = gaugeLabels[log.gaugeId] || log.gaugeId;
      var changeText = (log.delta > 0 ? '+' : '') + log.delta;
      var changeClass = log.delta > 0 ? 'journal-plus' : log.delta < 0 ? 'journal-minus' : '';
      
      html += '<div class="journal-row">';
      html += '<span class="journal-col">' + _escapeHtml(log.timestamp) + '</span>';
      html += '<span class="journal-col">' + _escapeHtml(gaugeLabel) + '</span>';
      html += '<span class="journal-col ' + changeClass + '">' + _escapeHtml(changeText) + '</span>';
      html += '<span class="journal-col">' + _escapeHtml(log.newValue) + '</span>';
      html += '<span class="journal-col">' + _escapeHtml(log.reason) + '</span>';
      html += '</div>';
    });
    
    html += '</div>';
    journalList.innerHTML = html;
  }

  // ── Lecture depuis le modèle → DOM ──

  function render(char) {
    _char = char;
    GAUGE_IDS.forEach(function (name) {
      var g = char.gauges[name];
      if (!g) return;
      var curEl = document.getElementById(name + '-current');
      var maxEl = document.getElementById(name + '-max');
      var curDisplayEl = document.getElementById(name + '-current-display');
      var maxDisplayEl = document.getElementById(name + '-max-display');
      if (curEl) curEl.value = g.current;
      if (maxEl) maxEl.value = g.max;
      if (curDisplayEl) curDisplayEl.textContent = g.current;
      if (maxDisplayEl) maxDisplayEl.textContent = g.max;
      if (curEl || maxEl) _update(name);
    });
  }

  // ── Écriture DOM → modèle ──

  function collect(char) {
    GAUGE_IDS.forEach(function (name) {
      if (!char.gauges[name]) return;
      var curEl = document.getElementById(name + '-current');
      var maxEl = document.getElementById(name + '-max');
      if (curEl) char.gauges[name].current = parseFloat(curEl.value) || 0;
      if (maxEl) char.gauges[name].max     = parseFloat(maxEl.value) || 0;
    });
  }

  // ── Init ──

  function init(char) {
    _char = char;

    GAUGE_IDS.forEach(function (name) {
      var curEl   = document.getElementById(name + '-current');
      var maxEl   = document.getElementById(name + '-max');
      var trackEl = document.getElementById('gauge-' + name + '-track');

      if (curEl) curEl.addEventListener('input', function () { _update(name); });
      if (maxEl) maxEl.addEventListener('input', function () { _update(name); });
      if (trackEl) {
        trackEl.addEventListener('click', function (e) { _handleClick(e, name); });
      }
      
      // Boutons + et - pour current
      var plusBtn = document.querySelector('.btn-gauge-plus[data-gauge="' + name + '"][data-type="current"]');
      var minusBtn = document.querySelector('.btn-gauge-minus[data-gauge="' + name + '"][data-type="current"]');
      
      if (plusBtn) {
        plusBtn.addEventListener('click', function() {
          _openGaugeModal(name, 'current', 1);
        });
      }
      if (minusBtn) {
        minusBtn.addEventListener('click', function() {
          _openGaugeModal(name, 'current', -1);
        });
      }
    });

    // Bouton journal
    var journalBtn = document.getElementById('btn-gauge-journal');
    if (journalBtn) {
      journalBtn.addEventListener('click', _toggleJournal);
    }
    
    // Modal de modification
    var modifyConfirmBtn = document.getElementById('gauge-modify-confirm');
    var modifyCancelBtn = document.getElementById('gauge-modify-cancel');
    var modal = document.getElementById('gauge-modify-modal');
    
    if (modifyConfirmBtn) {
      modifyConfirmBtn.addEventListener('click', _applyGaugeModal);
    }
    if (modifyCancelBtn) {
      modifyCancelBtn.addEventListener('click', _closeGaugeModal);
    }
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) _closeGaugeModal();
      });
      
      // Gestion de la touche Échap pour fermer la modal
      modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') _closeGaugeModal();
      });
    }
    
    // Gestion de la touche Entrée dans le champ delta
    var deltaEl = document.getElementById('gauge-modify-delta');
    if (deltaEl) {
      deltaEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') _applyGaugeModal();
      });
    }

    render(char);
  }

  return {
    init:    init,
    render:  render,
    collect: collect,
    update:  _update
  };

}());
