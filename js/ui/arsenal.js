/* ═══════════════════════════════════════════
   KNIGHT — ui/arsenal.js
   Armes (avec image) + Modules (avec image,
   zone et coût en slots). Méta-armure
   déplacée dans l'onglet Armure.
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.ui = KNIGHT.ui || {};

KNIGHT.ui.arsenal = (function () {

  var _char = null;

  var ZONE_LABELS = {
    'tete':    'Tête',
    'torse':   'Torse',
    'bras-g':  'Bras Gauche',
    'bras-d':  'Bras Droit',
    'jambe-g': 'Jambe Gauche',
    'jambe-d': 'Jambe Droite'
  };

  /* ════════════════════════════════════════
     WEAPONS
  ════════════════════════════════════════ */

  function _renderWeapons() {
    var container = document.getElementById('weapons-container');
    if (!container) return;
    container.innerHTML = '';

    _char.weapons.forEach(function (w) {
      container.appendChild(_buildWeaponCard(w));
    });
  }

  function _buildWeaponCard(w) {
    var card = document.createElement('div');
    card.className = 'arsenal-card weapon-card';

    // ── Image ──
    var imgWrap = document.createElement('div');
    imgWrap.className = 'arsenal-img-wrap';

    var img = document.createElement('img');
    img.className = 'arsenal-img';
    img.src = w.image || '';
    img.style.display = w.image ? 'block' : 'none';
    img.alt = w.nom || 'Arme';

    var ph = document.createElement('div');
    ph.className = 'arsenal-img-placeholder';
    ph.textContent = '⚔';
    ph.style.display = w.image ? 'none' : 'flex';

    var imgInput = document.createElement('input');
    imgInput.type = 'file'; imgInput.accept = 'image/*'; imgInput.style.display = 'none';
    imgInput.addEventListener('change', _makeImageLoader(w, img, ph));

    var imgBtn = document.createElement('button');
    imgBtn.className = 'arsenal-img-btn'; imgBtn.title = 'Changer l\'image'; imgBtn.textContent = '📷';
    imgBtn.addEventListener('click', function () { imgInput.click(); });

    imgWrap.appendChild(img); imgWrap.appendChild(ph); imgWrap.appendChild(imgBtn); imgWrap.appendChild(imgInput);

    // ── Champs ──
    var fields = document.createElement('div');
    fields.className = 'arsenal-fields';

    // Nom + PG
    fields.appendChild(_makeRow([
      _makeField('Nom de l\'arme', _makeInp('text', w.nom, function (v) { w.nom = v; }, 'ex. Pistolet de service')),
      _makeField('Coût PG', _makeInp('number', w.pgCout, function (v) { w.pgCout = parseInt(v) || 0; }, '0'))
    ]));

    // Section Contact
    var contactTitle = document.createElement('div');
    contactTitle.className = 'weapon-mode-title';
    contactTitle.textContent = 'CONTACT';
    fields.appendChild(contactTitle);

    fields.appendChild(_makeRow([
      _makeField('Dégâts',   _makeInp('text', w.contact.degats,   function (v) { w.contact.degats   = v; }, '1D6 (3) + Force')),
      _makeField('Violence', _makeInp('text', w.contact.violence, function (v) { w.contact.violence = v; }, '1')),
      _makeField('Portée',   _makeInp('text', w.contact.portee,   function (v) { w.contact.portee   = v; }, 'Contact')),
      _makeField('Énergie',  _makeInp('text', w.contact.energie,  function (v) { w.contact.energie  = v; }, '—'))
    ]));
    fields.appendChild(_makeField('Effets (contact)',
      _makeInp('text', w.contact.effets, function (v) { w.contact.effets = v; }, 'Silencieux, Perce armure…')
    ));

    // Section Tir
    var tirTitle = document.createElement('div');
    tirTitle.className = 'weapon-mode-title weapon-mode-tir';
    tirTitle.textContent = 'TIR';
    fields.appendChild(tirTitle);

    fields.appendChild(_makeRow([
      _makeField('Dégâts',   _makeInp('text', w.tir.degats,   function (v) { w.tir.degats   = v; }, '2D6 (6) + 6')),
      _makeField('Violence', _makeInp('text', w.tir.violence, function (v) { w.tir.violence = v; }, '1D6 (3)')),
      _makeField('Portée',   _makeInp('text', w.tir.portee,   function (v) { w.tir.portee   = v; }, 'Moyenne')),
      _makeField('Énergie',  _makeInp('text', w.tir.energie,  function (v) { w.tir.energie  = v; }, '—'))
    ]));
    fields.appendChild(_makeField('Effets (tir)',
      _makeInp('text', w.tir.effets, function (v) { w.tir.effets = v; }, 'Continus 3, Dispersion…')
    ));

    // Supprimer
    var del = document.createElement('button');
    del.className = 'btn btn-danger btn-sm';
    del.style.marginTop = '10px';
    del.textContent = 'Supprimer l\'arme';
    del.addEventListener('click', (function (id) {
      return function () { _char.removeWeapon(id); _renderWeapons(); };
    }(w.id)));
    fields.appendChild(del);

    card.appendChild(imgWrap);
    card.appendChild(fields);
    return card;
  }

  function _makeImageLoader(item, imgEl, ph) {
    return function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        item.image = ev.target.result;
        imgEl.src = item.image;
        imgEl.style.display = 'block';
        ph.style.display = 'none';
      };
      reader.readAsDataURL(file);
    };
  }

  function addWeapon() {
    _char.addWeapon();
    _renderWeapons();
  }

  /* ════════════════════════════════════════
     MODULES
  ════════════════════════════════════════ */

  function _renderModules() {
    var container = document.getElementById('modules-grid');
    if (!container) return;
    container.innerHTML = '';

    _char.modules.forEach(function (m) {
      container.appendChild(_buildModuleCard(m));
    });
  }

  function _buildModuleCard(m) {
    var card = document.createElement('div');
    card.className = 'arsenal-card module-card-full';

    // Image
    var imgWrap = document.createElement('div');
    imgWrap.className = 'arsenal-img-wrap';

    var img = document.createElement('img');
    img.className = 'arsenal-img';
    img.src = m.image || '';
    img.style.display = m.image ? 'block' : 'none';
    img.alt = m.nom || 'Module';

    var imgPlaceholder = document.createElement('div');
    imgPlaceholder.className = 'arsenal-img-placeholder';
    imgPlaceholder.textContent = '🔧';
    imgPlaceholder.style.display = m.image ? 'none' : 'flex';

    var imgInput = document.createElement('input');
    imgInput.type = 'file';
    imgInput.accept = 'image/*';
    imgInput.style.display = 'none';
    imgInput.addEventListener('change', (function (mod, imgEl, ph) {
      return function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          mod.image = ev.target.result;
          imgEl.src = mod.image;
          imgEl.style.display = 'block';
          ph.style.display = 'none';
        };
        reader.readAsDataURL(file);
      };
    }(m, img, imgPlaceholder)));

    var imgBtn = document.createElement('button');
    imgBtn.className = 'arsenal-img-btn';
    imgBtn.title = 'Changer l\'image';
    imgBtn.textContent = '📷';
    imgBtn.addEventListener('click', function () { imgInput.click(); });

    imgWrap.appendChild(img);
    imgWrap.appendChild(imgPlaceholder);
    imgWrap.appendChild(imgBtn);
    imgWrap.appendChild(imgInput);

    // Champs
    var fields = document.createElement('div');
    fields.className = 'arsenal-fields';

    // Nom + Zone + Slots
    fields.appendChild(_makeRow([
      _makeField('Nom', _makeInp('text', m.nom, function(v){ m.nom = v; }, 'Nom du module')),
    ]));

    fields.appendChild(_makeRow([
      _makeField('Zone cible', _makeZoneSelect(m)),
      _makeField('Coût (slots)', _makeInp('number', m.slotCost, function(v){ m.slotCost = parseInt(v)||1; }, '1'))
    ]));

    fields.appendChild(_makeRow([
      _makeField('Activation', _makeInp('text', m.activation, function(v){ m.activation = v; }, 'Action / Libre')),
      _makeField('Durée',      _makeInp('text', m.duree,      function(v){ m.duree = v; }, 'Tours / Scène')),
      _makeField('Énergie',    _makeInp('text', m.energie,    function(v){ m.energie = v; }, 'PE'))
    ]));

    fields.appendChild(_makeField('Effets', _makeTextarea(m.effets, function(v){ m.effets = v; }, 'Description des effets…', 60)));

    var del = document.createElement('button');
    del.className = 'btn btn-danger btn-sm';
    del.style.marginTop = '8px';
    del.textContent = 'Supprimer';
    del.addEventListener('click', (function (id) {
      return function () {
        // Retirer aussi des zones armure
        _detachModuleFromAllZones(id);
        _char.removeModule(id);
        _renderModules();
        // Notifier armor.js si disponible
        if (KNIGHT.ui.armor && KNIGHT.ui.armor.refresh) KNIGHT.ui.armor.refresh();
      };
    }(m.id)));
    fields.appendChild(del);

    card.appendChild(imgWrap);
    card.appendChild(fields);
    return card;
  }

  function _detachModuleFromAllZones(moduleId) {
    var slots = _char.warrior.slots;
    Object.keys(slots).forEach(function (z) {
      slots[z].modules = slots[z].modules.filter(function (id) { return id !== moduleId; });
    });
  }

  function _makeZoneSelect(m) {
    var sel = document.createElement('select');
    var opts = [['', '— Aucune zone —']].concat(Object.keys(ZONE_LABELS).map(function(k){ return [k, ZONE_LABELS[k]]; }));
    opts.forEach(function (o) {
      var opt = document.createElement('option');
      opt.value = o[0];
      opt.textContent = o[1];
      if (m.zone === o[0]) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', function () { m.zone = this.value; });
    return sel;
  }

  function addModule() {
    _char.addModule();
    _renderModules();
  }

  /* ════════════════════════════════════════
     IA
  ════════════════════════════════════════ */

  function _initIA(char) {
    _bindInput('ia-modele', function(v){ char.ia.modele = v; });
    _bindInput('ia-surnom', function(v){ char.ia.surnom = v; });
    _bindInput('ia-perso',  function(v){ char.ia.personnalite = v; });
    _bindInput('ia-spe',    function(v){ char.ia.specialite = v; });
    _bindInput('ia-notes',  function(v){ char.ia.notes = v; });
  }

  /* ════════════════════════════════════════
     RENDER / COLLECT / INIT
  ════════════════════════════════════════ */

  function render(char) {
    _char = char;
    _renderWeapons();
    _renderModules();

    _syncInput('ia-modele', char.ia.modele);
    _syncInput('ia-surnom', char.ia.surnom);
    _syncInput('ia-perso',  char.ia.personnalite);
    _syncInput('ia-spe',    char.ia.specialite);
    _syncInput('ia-notes',  char.ia.notes);
  }

  function collect(char) {
    char.ia.modele       = _val('ia-modele') || '';
    char.ia.surnom       = _val('ia-surnom') || '';
    char.ia.personnalite = _val('ia-perso')  || '';
    char.ia.specialite   = _val('ia-spe')    || '';
    char.ia.notes        = _val('ia-notes')  || '';
  }

  function init(char) {
    _char = char;

    var addWeaponBtn = document.getElementById('btn-add-weapon');
    if (addWeaponBtn) addWeaponBtn.addEventListener('click', addWeapon);

    var addModuleBtn = document.getElementById('btn-add-module');
    if (addModuleBtn) addModuleBtn.addEventListener('click', addModule);

    _initIA(char);

    if (char.weapons.length === 0) {
      char.addWeapon();
      char.addWeapon();
      char.addWeapon();
    }

    render(char);
  }

  /* ── Expose modules list for armor.js ── */
  function getModulesForZone(zoneId) {
    if (!_char) return [];
    return _char.modules.filter(function (m) { return m.zone === zoneId; });
  }

  function getAllModules() {
    return _char ? _char.modules : [];
  }

  /* ════════════════════════════════════════
     DOM HELPERS
  ════════════════════════════════════════ */

  function _makeRow(children) {
    var row = document.createElement('div');
    row.className = 'arsenal-row';
    children.forEach(function (c) { if (c) row.appendChild(c); });
    return row;
  }

  function _makeField(labelText, input) {
    var wrap = document.createElement('div');
    wrap.className = 'field';
    wrap.style.marginBottom = '6px';
    var lbl = document.createElement('label');
    lbl.textContent = labelText;
    wrap.appendChild(lbl);
    wrap.appendChild(input);
    return wrap;
  }

  function _makeInp(type, value, onChange, placeholder) {
    var inp = document.createElement('input');
    inp.type = type;
    inp.value = value !== undefined ? value : '';
    if (placeholder) inp.placeholder = placeholder;
    inp.addEventListener('input', function () { onChange(this.value); });
    return inp;
  }

  function _makeTextarea(value, onChange, placeholder, minH) {
    var ta = document.createElement('textarea');
    ta.value = value || '';
    if (placeholder) ta.placeholder = placeholder;
    if (minH) ta.style.minHeight = minH + 'px';
    ta.addEventListener('input', function () { onChange(this.value); });
    return ta;
  }

  function _val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }
  function _syncInput(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val !== undefined ? val : '';
  }
  function _bindInput(id, cb) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { cb(this.value); });
  }

  return {
    init:              init,
    render:            render,
    collect:           collect,
    addWeapon:         addWeapon,
    addModule:         addModule,
    getModulesForZone: getModulesForZone,
    getAllModules:      getAllModules
  };

}());
