/* ═══════════════════════════════════════════
   KNIGHT — ui/armor.js
   Silhouette SVG Warrior interactive.
   Slots indépendants par zone.
   Rattachement de modules depuis Arsenal.
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.ui = KNIGHT.ui || {};

KNIGHT.ui.armor = (function () {

  var _char         = null;
  var _selectedZone = null;

  var ZONES = [
    { id: 'tete',    label: 'Tête',        color: '#4A9EFF', svgLabel: { x: 150, y: 58  } },
    { id: 'torse',   label: 'Torse',       color: '#FF4500', svgLabel: { x: 150, y: 215 } },
    { id: 'bras-g',  label: 'Bras G',      color: '#C9A84C', svgLabel: { x: 52,  y: 215 } },
    { id: 'bras-d',  label: 'Bras D',      color: '#C9A84C', svgLabel: { x: 248, y: 215 } },
    { id: 'jambe-g', label: 'Jambe G',     color: '#3DFF8F', svgLabel: { x: 100, y: 400 } },
    { id: 'jambe-d', label: 'Jambe D',     color: '#3DFF8F', svgLabel: { x: 200, y: 400 } }
  ];

  /* ════════════════════════════════════════
     SVG
  ════════════════════════════════════════ */

  function _buildSVG() {
    var svg = _svgEl('svg');
    svg.setAttribute('viewBox', '0 0 300 520');
    svg.setAttribute('class', 'armor-svg');

    // Defs glow
    var defs = _svgEl('defs');
    var filter = _svgEl('filter');
    filter.setAttribute('id', 'glow');
    var feBlur = _svgEl('feGaussianBlur');
    feBlur.setAttribute('stdDeviation', '3');
    feBlur.setAttribute('result', 'coloredBlur');
    var feMerge = _svgEl('feMerge');
    [_svgEl('feMergeNode'), _svgEl('feMergeNode')].forEach(function (n, i) {
      n.setAttribute('in', i === 0 ? 'coloredBlur' : 'SourceGraphic');
      feMerge.appendChild(n);
    });
    filter.appendChild(feBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    // Fond
    var bg = _svgEl('rect');
    bg.setAttribute('width','300'); bg.setAttribute('height','520');
    bg.setAttribute('fill','#0A0A0F'); bg.setAttribute('rx','6');
    svg.appendChild(bg);

    // Zones
    var paths = {
      'tete':    _pathTete(),
      'torse':   _pathTorse(),
      'bras-g':  _pathBrasG(),
      'bras-d':  _pathBrasD(),
      'jambe-g': _pathJambeG(),
      'jambe-d': _pathJambeD()
    };

    ZONES.forEach(function (z) {
      _appendZone(svg, z, paths[z.id]);
    });

    return svg;
  }

  function _appendZone(svg, zone, pathD) {
    var g = _svgEl('g');
    g.setAttribute('class', 'armor-zone-g');
    g.setAttribute('data-zone', zone.id);
    g.style.cursor = 'pointer';

    var shadow = _svgEl('path');
    shadow.setAttribute('d', pathD);
    shadow.setAttribute('fill', zone.color);
    shadow.setAttribute('opacity', '0.06');
    shadow.setAttribute('transform', 'translate(2,3)');

    var path = _svgEl('path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', '#16161F');
    path.setAttribute('stroke', zone.color);
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('opacity', '0.85');
    path.setAttribute('class', 'zone-path');
    path.setAttribute('id', 'zone-path-' + zone.id);

    var overlay = _svgEl('path');
    overlay.setAttribute('d', pathD);
    overlay.setAttribute('fill', zone.color);
    overlay.setAttribute('opacity', '0');
    overlay.setAttribute('class', 'zone-overlay');
    overlay.setAttribute('id', 'zone-overlay-' + zone.id);

    // Badge slots utilisés
    var badge = _svgEl('text');
    badge.setAttribute('id', 'zone-badge-' + zone.id);
    badge.setAttribute('x', zone.svgLabel.x);
    badge.setAttribute('y', zone.svgLabel.y);
    badge.setAttribute('text-anchor', 'middle');
    badge.setAttribute('fill', zone.color);
    badge.setAttribute('font-size', '9');
    badge.setAttribute('font-family', 'Orbitron, sans-serif');
    badge.setAttribute('font-weight', '700');
    badge.setAttribute('pointer-events', 'none');
    badge.textContent = _slotBadgeText(zone.id);

    g.appendChild(shadow);
    g.appendChild(path);
    g.appendChild(overlay);
    g.appendChild(badge);

    g.addEventListener('mouseenter', function () {
      document.getElementById('zone-overlay-' + zone.id).setAttribute('opacity', '0.12');
    });
    g.addEventListener('mouseleave', function () {
      document.getElementById('zone-overlay-' + zone.id).setAttribute('opacity', '0');
    });
    g.addEventListener('click', function () { _onZoneClick(zone.id); });

    svg.appendChild(g);
  }

  function _slotBadgeText(zoneId) {
    if (!_char) return '';
    var s = _char.warrior.slots[zoneId];
    if (!s) return '';
    var used = _usedSlots(zoneId);
    return used + '/' + s.max;
  }

  function _usedSlots(zoneId) {
    if (!_char) return 0;
    var s = _char.warrior.slots[zoneId];
    if (!s || !s.modules) return 0;
    var total = 0;
    s.modules.forEach(function (mid) {
      var mod = _findModule(mid);
      if (mod) total += (mod.slotCost || 1);
    });
    return total;
  }

  function _findModule(id) {
    if (!_char) return null;
    for (var i = 0; i < _char.modules.length; i++) {
      if (_char.modules[i].id === id) return _char.modules[i];
    }
    return null;
  }

  function _updateBadge(zoneId) {
    var badge = document.getElementById('zone-badge-' + zoneId);
    if (badge) badge.textContent = _slotBadgeText(zoneId);
  }

  /* ════════════════════════════════════════
     PATHS SVG
  ════════════════════════════════════════ */

  function _pathTete() {
    return 'M150 10 L190 30 L205 55 L205 85 L190 100 L170 108 L165 115 L150 118 L135 115 L130 108 L110 100 L95 85 L95 55 L110 30 Z M120 70 L130 62 L150 60 L170 62 L180 70 L175 80 L150 84 L125 80 Z';
  }
  function _pathTorse() {
    return 'M90 128 L75 135 L68 155 L68 175 L78 185 L82 230 L85 270 L88 300 L110 308 L150 312 L190 308 L212 300 L215 270 L218 230 L222 185 L232 175 L232 155 L225 135 L210 128 L190 122 L170 120 L150 119 L130 120 L110 122 Z';
  }
  function _pathBrasG() {
    return 'M65 132 L45 142 L35 160 L30 185 L28 210 L30 240 L35 268 L38 290 L42 315 L45 335 L52 345 L60 348 L68 345 L72 330 L70 305 L68 278 L66 250 L65 220 L66 195 L68 172 L72 152 L75 138 Z';
  }
  function _pathBrasD() {
    return 'M235 132 L255 142 L265 160 L270 185 L272 210 L270 240 L265 268 L262 290 L258 315 L255 335 L248 345 L240 348 L232 345 L228 330 L230 305 L232 278 L234 250 L235 220 L234 195 L232 172 L228 152 L225 138 Z';
  }
  function _pathJambeG() {
    return 'M108 315 L88 320 L84 345 L82 375 L82 405 L84 430 L86 455 L88 478 L92 498 L100 508 L112 510 L122 506 L128 492 L128 468 L126 440 L124 412 L122 382 L120 355 L118 330 L115 318 Z';
  }
  function _pathJambeD() {
    return 'M192 315 L212 320 L216 345 L218 375 L218 405 L216 430 L214 455 L212 478 L208 498 L200 508 L188 510 L178 506 L172 492 L172 468 L174 440 L176 412 L178 382 L180 355 L182 330 L185 318 Z';
  }

  /* ════════════════════════════════════════
     SÉLECTION DE ZONE
  ════════════════════════════════════════ */

  function _onZoneClick(id) {
    if (_selectedZone && _selectedZone !== id) {
      var oldPath = document.getElementById('zone-path-' + _selectedZone);
      if (oldPath) { oldPath.setAttribute('stroke-width','1.5'); oldPath.removeAttribute('filter'); }
    }
    _selectedZone = (_selectedZone === id) ? null : id;
    if (_selectedZone) {
      var newPath = document.getElementById('zone-path-' + _selectedZone);
      if (newPath) { newPath.setAttribute('stroke-width','3'); newPath.setAttribute('filter','url(#glow)'); }
    }
    _renderDetail(_selectedZone);
  }

  /* ════════════════════════════════════════
     PANNEAU DÉTAIL
  ════════════════════════════════════════ */

  function _renderDetail(zoneId) {
    var panel = document.getElementById('armor-detail-panel');
    if (!panel) return;

    if (!zoneId) {
      panel.innerHTML = '<div class="armor-detail-placeholder">Clique sur une zone pour voir les détails</div>';
      return;
    }

    var zone = ZONES.filter(function(z){ return z.id === zoneId; })[0];
    var slotData = _char.warrior.slots[zoneId];
    if (!zone || !slotData) return;

    var used = _usedSlots(zoneId);
    var max  = slotData.max;

    panel.innerHTML = '';

    // Header
    var header = document.createElement('div');
    header.className = 'armor-detail-header';
    header.style.borderColor = zone.color;
    header.style.color = zone.color;
    header.textContent = zone.label.toUpperCase() + ' — ' + used + ' / ' + max + ' slots';
    panel.appendChild(header);

    // Barre de slots
    var slotsBar = document.createElement('div');
    slotsBar.className = 'armor-slots-bar';
    for (var i = 0; i < max; i++) {
      var dot = document.createElement('div');
      dot.className = 'armor-slot-dot' + (i < used ? ' used' : '');
      if (i < used) dot.style.cssText = 'background:' + zone.color + ';border-color:' + zone.color + ';box-shadow:0 0 5px ' + zone.color + '66';
      dot.title = 'Slot ' + (i+1);
      slotsBar.appendChild(dot);
    }
    panel.appendChild(slotsBar);

    // Modules installés dans cette zone
    var installedTitle = document.createElement('div');
    installedTitle.className = 'armor-section-title';
    installedTitle.textContent = 'Modules installés';
    panel.appendChild(installedTitle);

    var installedList = document.createElement('div');
    installedList.className = 'armor-installed-list';
    installedList.id = 'installed-list-' + zoneId;

    if (!slotData.modules || slotData.modules.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'armor-empty';
      empty.textContent = 'Aucun module installé';
      installedList.appendChild(empty);
    } else {
      slotData.modules.forEach(function (mid) {
        var mod = _findModule(mid);
        if (!mod) return;
        installedList.appendChild(_buildInstalledModuleRow(mod, zoneId));
      });
    }
    panel.appendChild(installedList);

    // Sélecteur pour ajouter un module
    var addTitle = document.createElement('div');
    addTitle.className = 'armor-section-title';
    addTitle.style.marginTop = '12px';
    addTitle.textContent = 'Ajouter un module';
    panel.appendChild(addTitle);

    var addRow = document.createElement('div');
    addRow.className = 'armor-add-row';

    var sel = document.createElement('select');
    sel.className = 'armor-module-select';
    var defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '— Choisir un module —';
    sel.appendChild(defaultOpt);

    // Modules compatibles (zone = cette zone) et pas encore installés ici
    var availables = _char.modules.filter(function (m) {
      return m.zone === zoneId && slotData.modules.indexOf(m.id) === -1;
    });

    availables.forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m.id;
      var slotsLeft = max - used;
      var canFit = m.slotCost <= slotsLeft;
      opt.textContent = m.nom + ' (' + m.slotCost + ' slot' + (m.slotCost > 1 ? 's' : '') + ')' + (canFit ? '' : ' — insuffisant');
      opt.disabled = !canFit;
      sel.appendChild(opt);
    });

    var addBtn = document.createElement('button');
    addBtn.className = 'btn btn-add btn-sm';
    addBtn.textContent = '+ Installer';
    addBtn.addEventListener('click', function () {
      var mid = sel.value;
      if (!mid) return;
      var mod = _findModule(mid);
      if (!mod) return;
      var newUsed = _usedSlots(zoneId) + (mod.slotCost || 1);
      if (newUsed > max) {
        alert('Pas assez de slots disponibles !');
        return;
      }
      slotData.modules.push(mid);
      _updateBadge(zoneId);
      _renderDetail(zoneId);
    });

    addRow.appendChild(sel);
    addRow.appendChild(addBtn);
    panel.appendChild(addRow);

    if (availables.length === 0) {
      var noMod = document.createElement('div');
      noMod.className = 'armor-empty';
      noMod.style.marginTop = '6px';
      noMod.textContent = 'Aucun module défini pour cette zone dans Arsenal.';
      panel.appendChild(noMod);
    }
  }

  function _buildInstalledModuleRow(mod, zoneId) {
    var row = document.createElement('div');
    row.className = 'armor-installed-row';

    var img = document.createElement('div');
    img.className = 'armor-installed-img';
    if (mod.image) {
      img.style.backgroundImage = 'url(' + mod.image + ')';
      img.style.backgroundSize = 'cover';
      img.style.backgroundPosition = 'center';
    } else {
      img.textContent = '🔧';
    }

    var info = document.createElement('div');
    info.className = 'armor-installed-info';

    var name = document.createElement('span');
    name.className = 'armor-installed-name';
    name.textContent = mod.nom || '—';

    var meta = document.createElement('span');
    meta.className = 'armor-installed-meta';
    meta.textContent = mod.slotCost + ' slot' + (mod.slotCost > 1 ? 's' : '') +
                       (mod.energie ? ' · ' + mod.energie + ' PE' : '') +
                       (mod.activation ? ' · ' + mod.activation : '');

    info.appendChild(name);
    info.appendChild(meta);

    var del = document.createElement('button');
    del.className = 'btn btn-danger btn-sm';
    del.textContent = 'Retirer';
    del.style.padding = '3px 8px';
    del.addEventListener('click', (function (mid, zid) {
      return function () {
        var s = _char.warrior.slots[zid];
        s.modules = s.modules.filter(function (id) { return id !== mid; });
        _updateBadge(zid);
        _renderDetail(zid);
      };
    }(mod.id, zoneId)));

    row.appendChild(img);
    row.appendChild(info);
    row.appendChild(del);
    return row;
  }

  /* ════════════════════════════════════════
     LÉGENDE
  ════════════════════════════════════════ */

  function _buildLegend() {
    var div = document.createElement('div');
    div.className = 'armor-legend';

    ZONES.forEach(function (z) {
      var item = document.createElement('div');
      item.className = 'armor-legend-item';
      item.style.cursor = 'pointer';

      var dot = document.createElement('span');
      dot.className = 'armor-legend-dot';
      dot.style.cssText = 'background:' + z.color + ';box-shadow:0 0 5px ' + z.color + '66';

      var label = document.createElement('span');
      label.className = 'armor-legend-label';
      label.style.color = z.color;
      label.textContent = z.label;

      var slotInfo = document.createElement('span');
      slotInfo.className = 'armor-legend-slots';
      slotInfo.id = 'legend-slots-' + z.id;
      var s = _char ? _char.warrior.slots[z.id] : null;
      slotInfo.textContent = s ? (_usedSlots(z.id) + '/' + s.max + ' slots') : '';

      item.appendChild(dot);
      item.appendChild(label);
      item.appendChild(slotInfo);
      item.addEventListener('click', function () { _onZoneClick(z.id); });
      div.appendChild(item);
    });

    return div;
  }

  /* ════════════════════════════════════════
     RENDER / INIT
  ════════════════════════════════════════ */

  function render(char) {
    _char = char;
    _renderDetail(_selectedZone);
    // Refresh badges
    ZONES.forEach(function (z) { _updateBadge(z.id); });
    // Refresh légende
    ZONES.forEach(function (z) {
      var el = document.getElementById('legend-slots-' + z.id);
      if (el) {
        var s = char.warrior.slots[z.id];
        el.textContent = s ? (_usedSlots(z.id) + '/' + s.max + ' slots') : '';
      }
    });
  }

  function refresh() {
    if (_char) render(_char);
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

    // Stats armure
    _bindInput('armure-nom',     function(v){ char.warrior.nomArmure  = v; });
    _bindInput('armure-gen',     function(v){ char.warrior.generation = v; });
    _bindInput('armure-capacite',function(v){ char.warrior.capacite   = v; });
    _bindInput('w-pa-max', function(v){ char.warrior.paMax  = parseFloat(v)||0; });
    _bindInput('w-pe-max', function(v){ char.warrior.peMax  = parseFloat(v)||0; });
    _bindInput('w-cdf-max',function(v){ char.warrior.cdfMax = parseFloat(v)||0; });

    // Slots max inputs
    ZONES.forEach(function (z) {
      var inp = document.getElementById('slot-max-' + z.id);
      if (inp) {
        inp.value = char.warrior.slots[z.id] ? char.warrior.slots[z.id].max : 0;
        inp.addEventListener('input', function () {
          if (char.warrior.slots[z.id]) {
            char.warrior.slots[z.id].max = parseInt(this.value) || 0;
            _updateBadge(z.id);
            _renderDetail(_selectedZone === z.id ? z.id : _selectedZone);
          }
        });
      }
    });

    _renderDetail(null);
  }

  /* ── helpers ── */
  function _svgEl(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }
  function _bindInput(id, cb) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { cb(this.value); });
  }

  return { init: init, render: render, refresh: refresh };

}());
