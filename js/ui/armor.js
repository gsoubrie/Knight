/* ═══════════════════════════════════════════
   KNIGHT — ui/armor.js
   Silhouette SVG interactive du Warrior
   Zones cliquables avec slots visuels
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.ui = KNIGHT.ui || {};

KNIGHT.ui.armor = (function () {

  var _char  = null;

  /* Configuration des zones */
  var ZONES = [
    { id: 'tete',    label: 'Tête',       slots: 7,  color: '#4A9EFF' },
    { id: 'torse',   label: 'Torse',      slots: 12, color: '#FF4500' },
    { id: 'bras-g',  label: 'Bras G',     slots: 10, color: '#C9A84C' },
    { id: 'bras-d',  label: 'Bras D',     slots: 10, color: '#C9A84C' },
    { id: 'jambe-g', label: 'Jambe G',    slots: 7,  color: '#3DFF8F' },
    { id: 'jambe-d', label: 'Jambe D',    slots: 7,  color: '#3DFF8F' }
  ];

  var _selectedZone = null;

  /* ════════════════════════════════════════
     SVG SILHOUETTE
  ════════════════════════════════════════ */

  function _buildSVG() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 300 520');
    svg.setAttribute('class', 'armor-svg');

    /* ── Définitions (filtres glow) ── */
    var defs = _svgEl('defs');
    var filter = _svgEl('filter');
    filter.setAttribute('id', 'glow');
    var feBlur = _svgEl('feGaussianBlur');
    feBlur.setAttribute('stdDeviation', '3');
    feBlur.setAttribute('result', 'coloredBlur');
    var feMerge = _svgEl('feMerge');
    var feMIn  = _svgEl('feMergeNode'); feMIn.setAttribute('in', 'coloredBlur');
    var feMIn2 = _svgEl('feMergeNode'); feMIn2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMIn); feMerge.appendChild(feMIn2);
    filter.appendChild(feBlur); filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    /* ── Fond ── */
    var bg = _svgEl('rect');
    bg.setAttribute('width', '300'); bg.setAttribute('height', '520');
    bg.setAttribute('fill', '#0A0A0F'); bg.setAttribute('rx', '6');
    svg.appendChild(bg);

    /* ── Zones de l'armure ── */
    _appendZone(svg, 'tete',    _pathTete(),    'Tête',   '#4A9EFF', 150, 58);
    _appendZone(svg, 'torse',   _pathTorse(),   'Torse',  '#FF4500', 150, 190);
    _appendZone(svg, 'bras-g',  _pathBrasG(),   'Bras G', '#C9A84C', 58,  195);
    _appendZone(svg, 'bras-d',  _pathBrasD(),   'Bras D', '#C9A84C', 242, 195);
    _appendZone(svg, 'jambe-g', _pathJambeG(),  'Jambe G','#3DFF8F', 105, 380);
    _appendZone(svg, 'jambe-d', _pathJambeD(),  'Jambe D','#3DFF8F', 195, 380);

    /* ── Lignes de circuit déco ── */
    _appendCircuitLines(svg);

    return svg;
  }

  function _appendZone(svg, id, pathD, label, color, labelX, labelY) {
    var g = _svgEl('g');
    g.setAttribute('class', 'armor-zone-g');
    g.setAttribute('data-zone', id);
    g.style.cursor = 'pointer';

    // Ombre colorée
    var shadow = _svgEl('path');
    shadow.setAttribute('d', pathD);
    shadow.setAttribute('fill', color);
    shadow.setAttribute('opacity', '0.08');
    shadow.setAttribute('transform', 'translate(2,3)');

    // Corps principal
    var path = _svgEl('path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', '#16161F');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('opacity', '0.85');
    path.setAttribute('class', 'zone-path');
    path.setAttribute('data-zone', id);
    path.setAttribute('data-color', color);

    // Hover overlay
    var overlay = _svgEl('path');
    overlay.setAttribute('d', pathD);
    overlay.setAttribute('fill', color);
    overlay.setAttribute('opacity', '0');
    overlay.setAttribute('class', 'zone-overlay');
    overlay.setAttribute('data-zone', id);

    g.appendChild(shadow);
    g.appendChild(path);
    g.appendChild(overlay);

    // Label
    var text = _svgEl('text');
    text.setAttribute('x', labelX);
    text.setAttribute('y', labelY);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', color);
    text.setAttribute('font-size', '9');
    text.setAttribute('font-family', 'Orbitron, sans-serif');
    text.setAttribute('font-weight', '700');
    text.setAttribute('letter-spacing', '1');
    text.setAttribute('pointer-events', 'none');
    text.textContent = label.toUpperCase();
    g.appendChild(text);

    g.addEventListener('mouseenter', function () { _onHover(id, true); });
    g.addEventListener('mouseleave', function () { _onHover(id, false); });
    g.addEventListener('click',      function () { _onZoneClick(id); });

    svg.appendChild(g);
  }

  function _onHover(id, on) {
    var overlay = document.querySelector('.zone-overlay[data-zone="' + id + '"]');
    if (overlay) overlay.setAttribute('opacity', on ? '0.12' : '0');
  }

  /* ════════════════════════════════════════
     PATHS SVG DES ZONES
  ════════════════════════════════════════ */

  function _pathTete() {
    // Casque Warrior — hexagone arrondi + visière
    return 'M 150 10 ' +
           'L 190 30 L 205 55 L 205 85 L 190 100 ' +
           'L 170 108 L 165 115 L 150 118 L 135 115 L 130 108 ' +
           'L 110 100 L 95 85 L 95 55 L 110 30 Z ' +
           'M 120 70 L 130 62 L 150 60 L 170 62 L 180 70 L 175 80 L 150 84 L 125 80 Z';
  }

  function _pathTorse() {
    // Torse large avec épaulières
    return 'M 90 128 L 75 135 L 68 155 L 68 175 ' +
           'L 78 185 L 82 230 L 85 270 L 88 300 ' +
           'L 110 308 L 150 312 L 190 308 L 212 300 ' +
           'L 215 270 L 218 230 L 222 185 ' +
           'L 232 175 L 232 155 L 225 135 L 210 128 ' +
           'L 190 122 L 170 120 L 150 119 L 130 120 L 110 122 Z';
  }

  function _pathBrasG() {
    // Bras gauche (notre gauche = gauche du perso)
    return 'M 65 132 L 45 142 L 35 160 L 30 185 ' +
           'L 28 210 L 30 240 L 35 268 ' +
           'L 38 290 L 42 315 L 45 335 ' +
           'L 52 345 L 60 348 L 68 345 ' +
           'L 72 330 L 70 305 L 68 278 ' +
           'L 66 250 L 65 220 L 66 195 ' +
           'L 68 172 L 72 152 L 75 138 Z';
  }

  function _pathBrasD() {
    // Bras droit
    return 'M 235 132 L 255 142 L 265 160 L 270 185 ' +
           'L 272 210 L 270 240 L 265 268 ' +
           'L 262 290 L 258 315 L 255 335 ' +
           'L 248 345 L 240 348 L 232 345 ' +
           'L 228 330 L 230 305 L 232 278 ' +
           'L 234 250 L 235 220 L 234 195 ' +
           'L 232 172 L 228 152 L 225 138 Z';
  }

  function _pathJambeG() {
    // Jambe gauche
    return 'M 108 315 L 88 320 L 84 345 ' +
           'L 82 375 L 82 405 L 84 430 ' +
           'L 86 455 L 88 478 L 92 498 ' +
           'L 100 508 L 112 510 L 122 506 ' +
           'L 128 492 L 128 468 L 126 440 ' +
           'L 124 412 L 122 382 L 120 355 ' +
           'L 118 330 L 115 318 Z';
  }

  function _pathJambeD() {
    // Jambe droite
    return 'M 192 315 L 212 320 L 216 345 ' +
           'L 218 375 L 218 405 L 216 430 ' +
           'L 214 455 L 212 478 L 208 498 ' +
           'L 200 508 L 188 510 L 178 506 ' +
           'L 172 492 L 172 468 L 174 440 ' +
           'L 176 412 L 178 382 L 180 355 ' +
           'L 182 330 L 185 318 Z';
  }

  function _appendCircuitLines(svg) {
    var lines = [
      'M 150 118 L 150 120',
      'M 88 300 L 88 315',
      'M 212 300 L 212 315',
      'M 68 345 L 68 348',
      'M 232 345 L 232 348'
    ];
    lines.forEach(function (d) {
      var l = _svgEl('path');
      l.setAttribute('d', d);
      l.setAttribute('stroke', '#2A2A3E');
      l.setAttribute('stroke-width', '2');
      l.setAttribute('fill', 'none');
      l.setAttribute('pointer-events', 'none');
      svg.appendChild(l);
    });
  }

  /* ════════════════════════════════════════
     SÉLECTION DE ZONE → PANNEAU DÉTAIL
  ════════════════════════════════════════ */

  function _onZoneClick(id) {
    // Désélectionner l'ancienne
    if (_selectedZone) {
      var oldPath = document.querySelector('.zone-path[data-zone="' + _selectedZone + '"]');
      if (oldPath) {
        oldPath.setAttribute('stroke-width', '1.5');
        oldPath.setAttribute('filter', '');
      }
    }

    _selectedZone = (_selectedZone === id) ? null : id;

    if (_selectedZone) {
      var newPath = document.querySelector('.zone-path[data-zone="' + _selectedZone + '"]');
      if (newPath) {
        newPath.setAttribute('stroke-width', '3');
        newPath.setAttribute('filter', 'url(#glow)');
      }
    }

    _renderDetail(_selectedZone);
  }

  /* ════════════════════════════════════════
     PANNEAU DÉTAIL (slots + modules)
  ════════════════════════════════════════ */

  function _getZoneData(id) {
    for (var i = 0; i < ZONES.length; i++) {
      if (ZONES[i].id === id) return ZONES[i];
    }
    return null;
  }

  function _getSlotData(id) {
    // Mapping zone SVG → warrior slots
    var map = {
      'tete':    'tete',
      'torse':   'tronc',
      'bras-g':  'bras',
      'bras-d':  'bras',
      'jambe-g': 'jambes',
      'jambe-d': 'jambes'
    };
    var key = map[id];
    return _char && key ? _char.warrior.slots[key] : null;
  }

  function _renderDetail(id) {
    var panel = document.getElementById('armor-detail-panel');
    if (!panel) return;

    if (!id) {
      panel.innerHTML = '<div class="armor-detail-placeholder">Clique sur une zone pour voir les détails</div>';
      return;
    }

    var zoneConf = _getZoneData(id);
    var slotData = _getSlotData(id);
    if (!zoneConf) return;

    var maxSlots = zoneConf.slots;
    var usedSlots = slotData ? slotData.used : 0;
    var notes = slotData ? (slotData['notes_' + id] || slotData.notes || '') : '';

    var html =
      '<div class="armor-detail-header" style="border-color:' + zoneConf.color + ';color:' + zoneConf.color + '">' +
        zoneConf.label.toUpperCase() + ' — ' + usedSlots + ' / ' + maxSlots + ' slots' +
      '</div>' +

      '<div class="armor-slots-visual">' +
        _buildSlotsHTML(id, maxSlots, usedSlots, zoneConf.color) +
      '</div>' +

      '<div class="armor-detail-section">' +
        '<label>Modules installés</label>' +
        '<textarea class="armor-modules-ta" data-zone="' + id + '" placeholder="Liste des modules dans cette zone…">' +
          _escHtml(notes) +
        '</textarea>' +
      '</div>';

    panel.innerHTML = html;

    // Bindings
    var slotsWrap = panel.querySelector('.armor-slots-visual');
    if (slotsWrap) {
      slotsWrap.querySelectorAll('.armor-slot-dot').forEach(function (dot) {
        dot.addEventListener('click', function () {
          var idx  = parseInt(this.getAttribute('data-idx'));
          var zKey = _slotKey(id);
          if (_char && _char.warrior.slots[zKey]) {
            var s = _char.warrior.slots[zKey];
            s.used = (s.used === idx + 1) ? idx : idx + 1;
            _renderDetail(id);
            _updateZoneLabel(id);
          }
        });
      });
    }

    var ta = panel.querySelector('.armor-modules-ta');
    if (ta) {
      ta.addEventListener('input', function () {
        var zKey = _slotKey(id);
        if (_char && _char.warrior.slots[zKey]) {
          _char.warrior.slots[zKey]['notes_' + id] = this.value;
        }
      });
    }
  }

  function _buildSlotsHTML(zoneId, max, used, color) {
    var html = '';
    for (var i = 0; i < max; i++) {
      var isUsed = i < used;
      html += '<div class="armor-slot-dot' + (isUsed ? ' used' : '') + '" ' +
              'data-zone="' + zoneId + '" data-idx="' + i + '" ' +
              'style="' + (isUsed ? 'background:' + color + ';border-color:' + color + ';box-shadow:0 0 6px ' + color + '66' : '') + '"' +
              ' title="Slot ' + (i + 1) + '"></div>';
    }
    return html;
  }

  function _updateZoneLabel(id) {
    // Met à jour le texte du label sur le SVG
    var zoneConf = _getZoneData(id);
    var slotData = _getSlotData(id);
    if (!zoneConf || !slotData) return;
    // Re-render detail
    _renderDetail(id);
  }

  function _slotKey(id) {
    var map = { 'tete': 'tete', 'torse': 'tronc', 'bras-g': 'bras', 'bras-d': 'bras', 'jambe-g': 'jambes', 'jambe-d': 'jambes' };
    return map[id] || id;
  }

  /* ════════════════════════════════════════
     LÉGENDE SLOTS
  ════════════════════════════════════════ */

  function _buildLegend() {
    var div = document.createElement('div');
    div.className = 'armor-legend';

    ZONES.forEach(function (z) {
      var slotData = _getSlotDataByKey(_slotKey(z.id));
      var used = slotData ? slotData.used : 0;
      // Pour bras-g/bras-d et jambes on lit des sous-clés si dispo
      if (_char && _char.warrior.slots[_slotKey(z.id)]) {
        used = _char.warrior.slots[_slotKey(z.id)]['notes_' + z.id + '_used'] ||
               _char.warrior.slots[_slotKey(z.id)].used || 0;
      }

      var item = document.createElement('div');
      item.className = 'armor-legend-item';
      item.style.cursor = 'pointer';
      item.setAttribute('data-zone', z.id);
      item.innerHTML =
        '<span class="armor-legend-dot" style="background:' + z.color + ';box-shadow:0 0 5px ' + z.color + '66"></span>' +
        '<span class="armor-legend-label" style="color:' + z.color + '">' + z.label + '</span>' +
        '<span class="armor-legend-slots">' + z.slots + ' slots</span>';

      item.addEventListener('click', function () {
        _onZoneClick(z.id);
      });

      div.appendChild(item);
    });

    return div;
  }

  function _getSlotDataByKey(key) {
    return _char && _char.warrior.slots[key] ? _char.warrior.slots[key] : null;
  }

  /* ════════════════════════════════════════
     RENDER / INIT
  ════════════════════════════════════════ */

  function render(char) {
    _char = char;
    _renderDetail(null);
  }

  function init(char) {
    _char = char;

    var svgContainer = document.getElementById('armor-svg-container');
    if (svgContainer) {
      svgContainer.innerHTML = '';
      svgContainer.appendChild(_buildSVG());
    }

    var legendContainer = document.getElementById('armor-legend-container');
    if (legendContainer) {
      legendContainer.innerHTML = '';
      legendContainer.appendChild(_buildLegend());
    }

    _renderDetail(null);
  }

  /* ── Helpers ── */
  function _svgEl(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }
  function _escHtml(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return {
    init:   init,
    render: render
  };

}());
