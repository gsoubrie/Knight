/* ═══════════════════════════════════════════
   KNIGHT — ui/arsenal.js
   Rendu armes, modules, slots armure Warrior
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.ui = KNIGHT.ui || {};

KNIGHT.ui.arsenal = (function () {

  var _char = null;

  /* ════════════════════════════════════════
     WEAPONS
  ════════════════════════════════════════ */

  function _renderWeapons() {
    var tbody = document.getElementById('weapons-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    _char.weapons.forEach(function (w) {
      var tr = document.createElement('tr');
      var fields = ['nom', 'degats', 'violence', 'portee', 'energie', 'effets'];

      fields.forEach(function (f) {
        var td  = document.createElement('td');
        var inp = document.createElement('input');
        inp.type        = 'text';
        inp.value       = w[f] || '';
        inp.placeholder = _placeholder(f);
        inp.addEventListener('input', (function (weapon, field) {
          return function (e) { weapon[field] = e.target.value; };
        }(w, f)));
        td.appendChild(inp);
        tr.appendChild(td);
      });

      var tdDel = document.createElement('td');
      var del   = document.createElement('button');
      del.className   = 'row-del';
      del.textContent = '×';
      del.title       = 'Supprimer';
      del.addEventListener('click', (function (weaponId) {
        return function () {
          _char.removeWeapon(weaponId);
          _renderWeapons();
        };
      }(w.id)));
      tdDel.appendChild(del);
      tr.appendChild(tdDel);
      tbody.appendChild(tr);
    });
  }

  function _placeholder(f) {
    var map = {
      nom: 'Nom', degats: 'Dégâts', violence: 'Violence',
      portee: 'Portée', energie: 'PE', effets: 'Effets / Tags'
    };
    return map[f] || f;
  }

  function addWeapon() {
    _char.addWeapon();
    _renderWeapons();
  }

  /* ════════════════════════════════════════
     MODULES
  ════════════════════════════════════════ */

  function _renderModules() {
    var grid = document.getElementById('modules-grid');
    if (!grid) return;
    grid.innerHTML = '';

    _char.modules.forEach(function (m) {
      var card = document.createElement('div');
      card.className = 'module-card';

      card.innerHTML =
        '<div class="field"><label>Nom</label>' +
        '<input type="text" value="' + _esc(m.nom) + '" placeholder="Nom du module"></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
        '<div class="field"><label>Zone</label>' +
        '<select>' +
        '<option value="">—</option>' +
        ['Tête','Tronc','Bras','Jambes'].map(function (z) {
          return '<option value="' + z + '"' + (m.zone === z ? ' selected' : '') + '>' + z + '</option>';
        }).join('') +
        '</select></div>' +
        '<div class="field"><label>Énergie (PE)</label>' +
        '<input type="text" value="' + _esc(m.energie) + '" placeholder="—"></div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
        '<div class="field"><label>Activation</label>' +
        '<input type="text" value="' + _esc(m.activation) + '" placeholder="Action / Libre"></div>' +
        '<div class="field"><label>Durée</label>' +
        '<input type="text" value="' + _esc(m.duree) + '" placeholder="Tours / Scène"></div>' +
        '</div>' +
        '<div class="field"><label>Effets</label>' +
        '<textarea placeholder="Description des effets…">' + _esc(m.effets) + '</textarea></div>' +
        '<button class="btn btn-danger btn-sm" style="width:100%;margin-top:4px;" data-del>Supprimer</button>';

      // Bindings
      var inputs = card.querySelectorAll('input[type="text"]');
      var fields = ['nom', 'energie', 'activation', 'duree'];
      fields.forEach(function (f, i) {
        if (inputs[i]) {
          inputs[i].addEventListener('input', (function (mod, field) {
            return function (e) { mod[field] = e.target.value; };
          }(m, f)));
        }
      });

      var sel = card.querySelector('select');
      if (sel) {
        sel.addEventListener('change', (function (mod) {
          return function (e) { mod.zone = e.target.value; };
        }(m)));
      }

      var ta = card.querySelector('textarea');
      if (ta) {
        ta.addEventListener('input', (function (mod) {
          return function (e) { mod.effets = e.target.value; };
        }(m)));
      }

      var delBtn = card.querySelector('[data-del]');
      if (delBtn) {
        delBtn.addEventListener('click', (function (moduleId) {
          return function () {
            _char.removeModule(moduleId);
            _renderModules();
          };
        }(m.id)));
      }

      grid.appendChild(card);
    });
  }

  function addModule() {
    _char.addModule();
    _renderModules();
  }

  /* ════════════════════════════════════════
     SLOTS ARMURE
  ════════════════════════════════════════ */

  var _zones = ['tete', 'tronc', 'bras', 'jambes'];

  function _renderSlots(zone) {
    var slotData = _char.warrior.slots[zone];
    if (!slotData) return;

    var container = document.getElementById('slots-' + zone);
    if (!container) return;

    container.innerHTML = '';
    for (var i = 0; i < slotData.max; i++) {
      var dot = document.createElement('div');
      dot.className = 'slot-dot' + (i < slotData.used ? ' used' : '');
      dot.setAttribute('data-zone', zone);
      dot.setAttribute('data-idx', i);
      dot.addEventListener('click', _onSlotClick);
      container.appendChild(dot);
    }
  }

  function _onSlotClick(e) {
    var zone = e.target.getAttribute('data-zone');
    var idx  = parseInt(e.target.getAttribute('data-idx'));
    var slot = _char.warrior.slots[zone];
    slot.used = (slot.used === idx + 1) ? idx : idx + 1;
    _renderSlots(zone);
  }

  function _bindSlotMax(zone) {
    var input = document.getElementById('slots-' + zone + '-max');
    if (!input) return;
    input.addEventListener('input', function () {
      _char.warrior.slots[zone].max = parseInt(this.value) || 0;
      _renderSlots(zone);
    });
  }

  function _renderAllSlots() {
    _zones.forEach(function (z) { _renderSlots(z); });
  }

  /* ════════════════════════════════════════
     TYPES WARRIOR
  ════════════════════════════════════════ */

  function _renderWarriorTypes() {
    var badges = document.querySelectorAll('#warrior-types .type-badge');
    badges.forEach(function (badge) {
      var active = _char.warrior.activeTypes.indexOf(badge.textContent) !== -1;
      badge.classList.toggle('active', active);
    });
  }

  function _bindWarriorTypes() {
    var badges = document.querySelectorAll('#warrior-types .type-badge');
    badges.forEach(function (badge) {
      badge.addEventListener('click', function () {
        this.classList.toggle('active');
        _char.warrior.activeTypes = [];
        document.querySelectorAll('#warrior-types .type-badge.active').forEach(function (b) {
          _char.warrior.activeTypes.push(b.textContent);
        });
      });
    });
  }

  /* ════════════════════════════════════════
     RENDER GLOBAL / COLLECT
  ════════════════════════════════════════ */

  function render(char) {
    _char = char;
    _renderWeapons();
    _renderModules();
    _renderAllSlots();
    _renderWarriorTypes();

    // Warrior scalaires
    _syncInput('armure-nom',        char.warrior.nomArmure);
    _syncInput('armure-gen',        char.warrior.generation);
    _syncTextarea('armure-capacite', char.warrior.capacite);
    _syncInput('w-pa-max',          char.warrior.paMax);
    _syncInput('w-pe-max',          char.warrior.peMax);
    _syncInput('w-cdf-max',         char.warrior.cdfMax);
    _syncTextarea('warrior-types-notes', char.warrior.typesNotes);

    _zones.forEach(function (z) {
      var maxEl = document.getElementById('slots-' + z + '-max');
      if (maxEl) maxEl.value = char.warrior.slots[z].max;
      var notesEl = document.getElementById('slot-notes-' + z);
      if (notesEl) notesEl.value = char.warrior.slots[z].notes || '';
    });

    // IA
    _syncInput('ia-modele', char.ia.modele);
    _syncInput('ia-surnom', char.ia.surnom);
    _syncInput('ia-perso',  char.ia.personnalite);
    _syncInput('ia-spe',    char.ia.specialite);
    _syncTextarea('ia-notes', char.ia.notes);
  }

  function collect(char) {
    // Warrior scalaires
    char.warrior.nomArmure   = _val('armure-nom')        || '';
    char.warrior.generation  = _val('armure-gen')        || '';
    char.warrior.capacite    = _val('armure-capacite')   || '';
    char.warrior.paMax       = parseFloat(_val('w-pa-max'))  || 0;
    char.warrior.peMax       = parseFloat(_val('w-pe-max'))  || 0;
    char.warrior.cdfMax      = parseFloat(_val('w-cdf-max')) || 0;
    char.warrior.typesNotes  = _val('warrior-types-notes') || '';

    _zones.forEach(function (z) {
      var notesEl = document.getElementById('slot-notes-' + z);
      if (notesEl) char.warrior.slots[z].notes = notesEl.value;
    });

    // IA
    char.ia.modele       = _val('ia-modele') || '';
    char.ia.surnom       = _val('ia-surnom') || '';
    char.ia.personnalite = _val('ia-perso')  || '';
    char.ia.specialite   = _val('ia-spe')    || '';
    char.ia.notes        = _val('ia-notes')  || '';
  }

  /* ════════════════════════════════════════
     INIT
  ════════════════════════════════════════ */

  function init(char) {
    _char = char;

    // Boutons add
    var addWeaponBtn = document.getElementById('btn-add-weapon');
    if (addWeaponBtn) addWeaponBtn.addEventListener('click', addWeapon);

    var addModuleBtn = document.getElementById('btn-add-module');
    if (addModuleBtn) addModuleBtn.addEventListener('click', addModule);

    // Slots max inputs
    _zones.forEach(function (z) { _bindSlotMax(z); });

    // Types warrior
    _bindWarriorTypes();

    // Warrior scalaires → modèle
    _bindInput('armure-nom',         function (v) { char.warrior.nomArmure  = v; });
    _bindInput('armure-gen',         function (v) { char.warrior.generation = v; });
    _bindTextarea('armure-capacite', function (v) { char.warrior.capacite   = v; });
    _bindInput('w-pa-max',           function (v) { char.warrior.paMax      = parseFloat(v) || 0; });
    _bindInput('w-pe-max',           function (v) { char.warrior.peMax      = parseFloat(v) || 0; });
    _bindInput('w-cdf-max',          function (v) { char.warrior.cdfMax     = parseFloat(v) || 0; });
    _bindTextarea('warrior-types-notes', function (v) { char.warrior.typesNotes = v; });

    // IA
    _bindInput('ia-modele', function (v) { char.ia.modele       = v; });
    _bindInput('ia-surnom', function (v) { char.ia.surnom       = v; });
    _bindInput('ia-perso',  function (v) { char.ia.personnalite = v; });
    _bindInput('ia-spe',    function (v) { char.ia.specialite   = v; });
    _bindTextarea('ia-notes', function (v) { char.ia.notes      = v; });

    render(char);

    // Armes par défaut
    if (char.weapons.length === 0) {
      char.addWeapon();
      char.addWeapon();
      char.addWeapon();
      _renderWeapons();
    }
  }

  /* ── Helpers DOM ── */

  function _val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }
  function _syncInput(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val !== undefined ? val : '';
  }
  function _syncTextarea(id, val) { _syncInput(id, val); }
  function _bindInput(id, cb) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { cb(this.value); });
  }
  function _bindTextarea(id, cb) { _bindInput(id, cb); }
  function _esc(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return {
    init:         init,
    render:       render,
    collect:      collect,
    addWeapon:    addWeapon,
    addModule:    addModule
  };

}());
