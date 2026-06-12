/* ═══════════════════════════════════════════
   KNIGHT — ui/aspects.js
   Rendu des blocs aspect + caractéristiques
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.ui = KNIGHT.ui || {};

KNIGHT.ui.aspects = (function () {

  var _char = null;

  // ── Construction du DOM d'un aspect ──

  function _buildBlock(aspect) {
    var block = document.createElement('div');
    block.className = 'aspect-block';
    block.id = 'aspect-' + aspect.id;

    // Header
    var header = document.createElement('div');
    header.className = 'aspect-header';
    header.setAttribute('data-aspect', aspect.id);

    var nameEl = document.createElement('span');
    nameEl.className = 'aspect-name';
    nameEl.setAttribute('data-aspect', aspect.id);
    nameEl.textContent = aspect.label;

    var scoreWrap = document.createElement('div');
    scoreWrap.className = 'aspect-score-wrap';

    var scoreLabel = document.createElement('span');
    scoreLabel.className = 'aspect-score-label';
    scoreLabel.textContent = 'Aspect';

    var scoreInput = document.createElement('input');
    scoreInput.type = 'number';
    scoreInput.className = 'input-sm input-display';
    scoreInput.id = 'asp-' + aspect.id;
    scoreInput.value = aspect.score;
    scoreInput.min = 0;
    scoreInput.max = 20;
    scoreInput.addEventListener('input', function () {
      aspect.score = parseInt(this.value) || 0;
    });

    scoreWrap.appendChild(scoreLabel);
    scoreWrap.appendChild(scoreInput);
    header.appendChild(nameEl);
    header.appendChild(scoreWrap);

    // Col headers
    var colHeaders = document.createElement('div');
    colHeaders.className = 'aspect-col-headers';
    colHeaders.innerHTML = '<span>Caractéristique</span><span>Score</span><span title="Overdrive">OD</span>';

    // Caras
    var carasDiv = document.createElement('div');
    carasDiv.className = 'aspect-caras';

    aspect.caras.forEach(function (cara, i) {
      var row = document.createElement('div');
      row.className = 'cara-row';

      var nameSpan = document.createElement('span');
      nameSpan.className = 'cara-name';
      nameSpan.textContent = cara.name;

      var scoreEl = document.createElement('input');
      scoreEl.type = 'number';
      scoreEl.className = 'input-sm';
      scoreEl.id = 'cara-' + aspect.id + '-' + i;
      scoreEl.value = cara.score;
      scoreEl.min = 0;
      scoreEl.max = 20;
      scoreEl.addEventListener('input', function () {
        cara.score = parseInt(this.value) || 0;
      });

      var odEl = document.createElement('input');
      odEl.type = 'number';
      odEl.className = 'input-sm';
      odEl.id = 'od-' + aspect.id + '-' + i;
      odEl.value = cara.od;
      odEl.min = 0;
      odEl.max = 10;
      odEl.title = 'Overdrive';
      odEl.addEventListener('input', function () {
        cara.od = parseInt(this.value) || 0;
      });

      row.appendChild(nameSpan);
      row.appendChild(scoreEl);
      row.appendChild(odEl);
      carasDiv.appendChild(row);
    });

    block.appendChild(header);
    block.appendChild(colHeaders);
    block.appendChild(carasDiv);
    return block;
  }

  // ── Render tous les aspects ──

  function render(char) {
    _char = char;
    var container = document.getElementById('aspects-grid');
    if (!container) return;
    container.innerHTML = '';

    char.aspects.forEach(function (aspect, idx) {
      var block = _buildBlock(aspect);
      // Masque spécial : pleine largeur sur mobile, demi-largeur desktop
      if (aspect.id === 'masque') {
        block.style.gridColumn = 'span 1';
        block.classList.add('aspect-masque-block');
      }
      container.appendChild(block);
    });
  }

  // ── Collect (DOM → modèle déjà fait via listeners) ──
  // Les inputs bindent directement sur l'objet aspect.

  function collect() {
    // Les listeners on 'input' ont déjà mis à jour les objets.
    // Cette fonction force une relecture si besoin.
    if (!_char) return;
    _char.aspects.forEach(function (aspect) {
      var aspEl = document.getElementById('asp-' + aspect.id);
      if (aspEl) aspect.score = parseInt(aspEl.value) || 0;

      aspect.caras.forEach(function (cara, i) {
        var sEl = document.getElementById('cara-' + aspect.id + '-' + i);
        var oEl = document.getElementById('od-'   + aspect.id + '-' + i);
        if (sEl) cara.score = parseInt(sEl.value) || 0;
        if (oEl) cara.od    = parseInt(oEl.value) || 0;
      });
    });
  }

  return {
    render:  render,
    collect: collect
  };

}());
