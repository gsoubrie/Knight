/* ═══════════════════════════════════════════
   KNIGHT — ui/aspects.js
   Rendu des blocs aspect + caractéristiques
   avec niveaux NV1→NV5 cochables
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.ui = KNIGHT.ui || {};

KNIGHT.ui.aspects = (function () {

  var _char = null;

  /* ─────────────────────────────────────────
     Construction du DOM d'un aspect
  ───────────────────────────────────────── */

  function _buildBlock(aspect) {
    var block = document.createElement('div');
    block.className = 'aspect-block';
    block.id = 'aspect-' + aspect.id;

    // ── Header (nom + score aspect) ──
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
    scoreInput.type      = 'number';
    scoreInput.className = 'input-sm input-display';
    scoreInput.id        = 'asp-' + aspect.id;
    scoreInput.value     = aspect.score;
    scoreInput.min       = 0;
    scoreInput.max       = 20;
    scoreInput.addEventListener('input', function () {
      aspect.score = parseInt(this.value) || 0;
    });

    scoreWrap.appendChild(scoreLabel);
    scoreWrap.appendChild(scoreInput);
    header.appendChild(nameEl);
    header.appendChild(scoreWrap);

    // ── Corps : 3 caractéristiques ──
    var body = document.createElement('div');
    body.className = 'aspect-body';

    aspect.caras.forEach(function (cara, i) {
      var niveaux = KNIGHT.models.Aspect.getNiveaux(aspect.id, i);
      body.appendChild(_buildCara(aspect, cara, i, niveaux));
    });

    block.appendChild(header);
    block.appendChild(body);
    return block;
  }

  /* ─────────────────────────────────────────
     Construction d'une caractéristique
  ───────────────────────────────────────── */

  function _buildCara(aspect, cara, i, niveaux) {
    var wrap = document.createElement('div');
    wrap.className = 'cara-wrap';

    // Ligne score
    var scoreRow = document.createElement('div');
    scoreRow.className = 'cara-score-row';

    var nameEl = document.createElement('span');
    nameEl.className = 'cara-name';
    nameEl.textContent = cara.name;

    var scoreEl = document.createElement('input');
    scoreEl.type      = 'number';
    scoreEl.className = 'input-sm';
    scoreEl.id        = 'cara-' + aspect.id + '-' + i;
    scoreEl.value     = cara.score;
    scoreEl.min       = 0;
    scoreEl.max       = 20;
    scoreEl.title     = 'Score';
    scoreEl.addEventListener('input', function () {
      cara.score = parseInt(this.value) || 0;
    });

    var odLabel = document.createElement('span');
    odLabel.className   = 'cara-od-label';
    odLabel.textContent = 'OD';

    var odEl = document.createElement('input');
    odEl.type      = 'number';
    odEl.className = 'input-sm';
    odEl.id        = 'od-' + aspect.id + '-' + i;
    odEl.value     = cara.od;
    odEl.min       = 0;
    odEl.max       = 10;
    odEl.title     = 'Overdrive';
    odEl.addEventListener('input', function () {
      cara.od = parseInt(this.value) || 0;
    });

    scoreRow.appendChild(nameEl);
    scoreRow.appendChild(scoreEl);
    scoreRow.appendChild(odLabel);
    scoreRow.appendChild(odEl);

    // Niveaux NV1→NV5
    var nvList = document.createElement('div');
    nvList.className = 'cara-niveaux';

    niveaux.forEach(function (texte, n) {
      var nvRow = document.createElement('div');
      nvRow.className = 'nv-row';

      var checkbox = document.createElement('div');
      checkbox.className = 'nv-check' + (cara.nv[n] ? ' checked' : '');
      checkbox.textContent = cara.nv[n] ? '✓' : '';
      checkbox.addEventListener('click', (function (caraRef, idx) {
        return function () {
          caraRef.nv[idx] = !caraRef.nv[idx];
          this.classList.toggle('checked', caraRef.nv[idx]);
          this.textContent = caraRef.nv[idx] ? '✓' : '';
        };
      }(cara, n)));

      var nvLabel = document.createElement('span');
      nvLabel.className = 'nv-label';

      var nvNum = document.createElement('span');
      nvNum.className   = 'nv-num';
      nvNum.textContent = 'NV' + (n + 1);

      var nvText = document.createElement('span');
      nvText.className   = 'nv-text' + (cara.nv[n] ? ' nv-active' : '');
      nvText.textContent = texte;

      // Sync couleur texte sur check
      checkbox.addEventListener('click', function () {
        nvText.classList.toggle('nv-active', cara.nv[n]);
      });

      nvLabel.appendChild(nvNum);
      nvLabel.appendChild(nvText);
      nvRow.appendChild(checkbox);
      nvRow.appendChild(nvLabel);
      nvList.appendChild(nvRow);
    });

    wrap.appendChild(scoreRow);
    wrap.appendChild(nvList);
    return wrap;
  }

  /* ─────────────────────────────────────────
     Render
  ───────────────────────────────────────── */

  function render(char) {
    _char = char;
    var container = document.getElementById('aspects-grid');
    if (!container) return;
    container.innerHTML = '';

    char.aspects.forEach(function (aspect) {
      container.appendChild(_buildBlock(aspect));
    });
  }

  /* ─────────────────────────────────────────
     Collect (force relecture DOM → modèle)
  ───────────────────────────────────────── */

  function collect() {
    if (!_char) return;
    _char.aspects.forEach(function (aspect) {
      var aspEl = document.getElementById('asp-' + aspect.id);
      if (aspEl) aspect.score = parseInt(aspEl.value) || 0;

      aspect.caras.forEach(function (cara, i) {
        var sEl = document.getElementById('cara-' + aspect.id + '-' + i);
        var oEl = document.getElementById('od-'   + aspect.id + '-' + i);
        if (sEl) cara.score = parseInt(sEl.value) || 0;
        if (oEl) cara.od    = parseInt(oEl.value) || 0;
        // nv est mis à jour directement via les listeners click
      });
    });
  }

  return {
    render:  render,
    collect: collect
  };

}());
