/* ═══════════════════════════════════════════
   KNIGHT — ui/gauges.js
   Rendu et interactions des jauges
   PS / PES / PA / CDF / PE
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.ui = KNIGHT.ui || {};

KNIGHT.ui.gauges = (function () {

  var _char = null;

  var GAUGE_IDS = ['ps', 'pes', 'pa', 'cdf', 'pe'];

  // ── Mise à jour visuelle ──

  function _update(name) {
    var cur = parseFloat(document.getElementById(name + '-current').value) || 0;
    var max = parseFloat(document.getElementById(name + '-max').value)     || 1;
    var pct = Math.max(0, Math.min(100, (cur / max) * 100));
    var fill = document.getElementById('gauge-' + name + '-fill');
    if (fill) fill.style.width = pct + '%';

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

  // ── Lecture depuis le modèle → DOM ──

  function render(char) {
    _char = char;
    GAUGE_IDS.forEach(function (name) {
      var g = char.gauges[name];
      if (!g) return;
      var curEl = document.getElementById(name + '-current');
      var maxEl = document.getElementById(name + '-max');
      if (curEl) curEl.value = g.current;
      if (maxEl) maxEl.value = g.max;
      _update(name);
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
    });

    render(char);
  }

  return {
    init:    init,
    render:  render,
    collect: collect,
    update:  _update
  };

}());
