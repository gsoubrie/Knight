/* ═══════════════════════════════════════════
   KNIGHT — app.js
   Point d'entrée : init, wiring global,
   héroïsme, motivations, contacts, quicklist,
   modale de chargement, notifications.
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};

KNIGHT.app = (function () {

  /* ── Personnage courant ── */
  var _char = new KNIGHT.models.Character();

  /* ── Mode édition/jeu ── */
  var _isEditMode = true;

  function _getUrlParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function _setEditMode(enabled) {
    _isEditMode = enabled;
    _applyEditMode();
    _updateModeButton();
    // Ajouter/supprimer la classe mode-play sur le body pour le CSS
    document.body.classList.toggle('mode-play', !enabled);
  }

  function _toggleEditMode() {
    var newMode = !_isEditMode;
    _setEditMode(newMode);
    // Mettre à jour l'URL sans recharger
    var urlParams = new URLSearchParams(window.location.search);
    urlParams.set('mode', newMode ? 'edit' : 'play');
    window.history.replaceState({}, '', '?' + urlParams.toString());
    // Notification
    _showNotif('✓', newMode ? 'Mode Édition activé' : 'Mode Jeu activé');
  }

  function _applyEditMode() {
    var fields = document.querySelectorAll('input, textarea, select');
    fields.forEach(function (field) {
      field.readOnly = !_isEditMode;
    });
    // Désactiver aussi les boutons d'édition (tous les btn-add, btn-del, etc.)
    var editButtons = document.querySelectorAll('.btn-save, .btn-load, .btn-add, .motivation-del, [id^="btn-add-"], [id*="-del"], [id*="-remove"]');
    editButtons.forEach(function (btn) {
      btn.style.display = _isEditMode ? '' : 'none';
    });
  }

  function _updateModeButton() {
    var modeBtn = document.getElementById('btn-toggle-mode');
    if (modeBtn) {
      modeBtn.textContent = _isEditMode ? '🎮 Mode Jeu' : '✏️ Mode Édition';
      modeBtn.title = _isEditMode ? 'Passer en mode jeu (lecture seule)' : 'Passer en mode édition';
    }
  }

  /* ════════════════════════════════════════
     HÉROÏSME
  ════════════════════════════════════════ */

  function _initHeroisme() {
    for (var i = 1; i <= 6; i++) {
      (function (n) {
        var dot = document.getElementById('h' + n);
        if (dot) dot.addEventListener('click', function () { _toggleHeroisme(n); });
      }(i));
    }
    _renderHeroisme();
  }

  function _toggleHeroisme(n) {
    _char.heroisme = (_char.heroisme === n) ? n - 1 : n;
    _renderHeroisme();
  }

  function _renderHeroisme() {
    for (var i = 1; i <= 6; i++) {
      var dot = document.getElementById('h' + i);
      if (dot) dot.classList.toggle('active', i <= _char.heroisme);
    }
  }

  /* ════════════════════════════════════════
     MOTIVATIONS
  ════════════════════════════════════════ */

  function _renderMotivations() {
    var list = document.getElementById('motivations-list');
    if (!list) return;
    list.innerHTML = '';

    _char.motivations.forEach(function (m, i) {
      var div = document.createElement('div');
      div.className = 'motivation-item';

      var badge = document.createElement('span');
      badge.className = 'motivation-type ' + (m.type === 'major' ? 'major' : 'minor');
      badge.textContent = m.type === 'major' ? 'Majeure' : 'Mineure';

      var ta = document.createElement('textarea');
      ta.className = 'motivation-text';
      ta.rows = 2;
      ta.placeholder = 'Description de la motivation…';
      ta.value = m.texte || '';
      ta.addEventListener('input', (function (idx) {
        return function (e) { _char.motivations[idx].texte = e.target.value; };
      }(i)));

      var del = document.createElement('button');
      del.className = 'motivation-del';
      del.textContent = '×';
      del.title = 'Supprimer';
      del.addEventListener('click', (function (idx) {
        return function () {
          _char.removeMotivation(idx);
          _renderMotivations();
        };
      }(i)));

      div.appendChild(badge);
      div.appendChild(ta);
      div.appendChild(del);
      list.appendChild(div);
    });
  }

  function _initMotivations() {
    var btnMajor = document.getElementById('btn-add-major');
    var btnMinor = document.getElementById('btn-add-minor');
    if (btnMajor) btnMajor.addEventListener('click', function () {
      _char.addMotivation('major');
      _renderMotivations();
    });
    if (btnMinor) btnMinor.addEventListener('click', function () {
      _char.addMotivation('minor');
      _renderMotivations();
    });
  }

  /* ════════════════════════════════════════
     CONTACTS
  ════════════════════════════════════════ */

  function _renderContacts() {
    var list = document.getElementById('contacts-list');
    if (!list) return;
    list.innerHTML = '';

    _char.contacts.forEach(function (c, i) {
      var div = document.createElement('div');
      div.className = 'contact-item';

      var nomInp = _makeInput('text', c.nom, 'Nom du contact', function (v) {
        _char.contacts[i].nom = v;
      });
      var niveauInp = _makeInput('number', c.niveau, '1-5', function (v) {
        _char.contacts[i].niveau = parseInt(v) || 1;
      });
      niveauInp.min = 1; niveauInp.max = 5;

      var infoInp = _makeInput('text', c.info, 'Rôle, lieu…', function (v) {
        _char.contacts[i].info = v;
      });

      var del = document.createElement('button');
      del.className = 'contact-del';
      del.textContent = '×';
      del.title = 'Supprimer';
      del.addEventListener('click', (function (idx) {
        return function () {
          _char.removeContact(idx);
          _renderContacts();
        };
      }(i)));

      // Labels
      var nomWrap    = _fieldWrap('Nom', nomInp);
      var niveauWrap = _fieldWrap('Niv.', niveauInp);
      var infoWrap   = _fieldWrap('Info', infoInp);

      div.appendChild(nomWrap);
      div.appendChild(niveauWrap);
      div.appendChild(infoWrap);
      div.appendChild(del);
      list.appendChild(div);
    });
  }

  function _initContacts() {
    var btn = document.getElementById('btn-add-contact');
    if (btn) btn.addEventListener('click', function () {
      _char.addContact();
      _renderContacts();
    });
  }

  /* ════════════════════════════════════════
     QUICKLIST
  ════════════════════════════════════════ */

  function _renderQuicklist() {
    var ul = document.getElementById('quicklist');
    if (!ul) return;
    ul.innerHTML = '';

    _char.quicklist.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'quicklist-item';

      var check = document.createElement('div');
      check.className = 'quicklist-check' + (item.checked ? ' checked' : '');
      check.textContent = item.checked ? '✓' : '';
      check.addEventListener('click', (function (it) {
        return function () {
          it.checked = !it.checked;
          _renderQuicklist();
        };
      }(item)));

      var text = document.createElement('input');
      text.type = 'text';
      text.className = 'quicklist-text' + (item.checked ? ' done' : '');
      text.value = item.text;
      text.placeholder = 'Note, PNJ, objectif…';
      text.addEventListener('input', (function (it) {
        return function (e) { it.text = e.target.value; };
      }(item)));

      var tag = document.createElement('span');
      tag.className = 'quicklist-tag tag-' + item.tag;
      tag.textContent = item.tag;

      var del = document.createElement('button');
      del.className = 'quicklist-del';
      del.textContent = '×';
      del.addEventListener('click', (function (id) {
        return function () {
          _char.removeQuicklistItem(id);
          _renderQuicklist();
        };
      }(item.id)));

      li.appendChild(check);
      li.appendChild(text);
      li.appendChild(tag);
      li.appendChild(del);
      ul.appendChild(li);
    });
  }

  function _initQuicklist() {
    var btn = document.getElementById('btn-add-ql');
    var inp = document.getElementById('ql-add-text');
    var sel = document.getElementById('ql-add-tag');

    function _doAdd() {
      var text = inp ? inp.value.trim() : '';
      var tag  = sel ? sel.value : 'info';
      _char.addQuicklistItem(text, tag);
      if (inp) inp.value = '';
      _renderQuicklist();
    }

    if (btn) btn.addEventListener('click', _doAdd);
    if (inp) inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') _doAdd();
    });
  }

  /* ════════════════════════════════════════
     DIVERS SCALAIRES
  ════════════════════════════════════════ */

  function _initScalaires() {
    var map = {
      'nom':          function (v) { _char.nom = v; _updateHeaderName(); },
      'voeu':         function (v) { _char.voeu = v; },
      'px':           function (v) { _char.px = parseInt(v) || 0; },
      'pg-armure':    function (v) { _char.pgArmure = parseInt(v) || 0; },
      'px-depenses':  function (v) { _char.pxDepenses = parseInt(v) || 0; },
      'defense':      function (v) { _char.derived.defense = parseInt(v) || 0; },
      'reaction':     function (v) { _char.derived.reaction = parseInt(v) || 0; },
      'initiative':   function (v) { _char.derived.initiative = parseInt(v) || 0; },
      'avantages':    function (v) { _char.avantages = v; },
      'inconvenients': function (v) { _char.inconvenients = v; },
      'equipement':   function (v) { _char.equipement = v; },
      'histoire':     function (v) { _char.histoire = v; },
      'notes':        function (v) { _char.notes = v; }
    };

    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { map[id](this.value); });
    });
    
    // Gestion des champs de l'onglet Armure
    if (_char.warrior) {
      var wMap = {
        'w-pa-max':    function (v) { _char.warrior.paMax = parseInt(v) || 0; },
        'w-pe-max':    function (v) { _char.warrior.peMax = parseInt(v) || 0; },
        'w-cdf-max':   function (v) { _char.warrior.cdfMax = parseInt(v) || 0; },
        'armure-nom':  function (v) { _char.warrior.nomArmure = v; },
        'armure-gen':  function (v) { _char.warrior.generation = v; },
        'armure-capacite': function (v) { _char.warrior.capacite = v; }
      };
      Object.keys(wMap).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', function () { wMap[id](this.value); });
      });
    }
  }

  function _syncScalaires() {
    var map = {
      'nom': _char.nom, 'voeu': _char.voeu,
      'px': _char.px, 'pg-armure': _char.pgArmure,
      'px-depenses': _char.pxDepenses,
      'defense': _char.derived.defense, 'reaction': _char.derived.reaction,
      'initiative': _char.derived.initiative,
      'avantages': _char.avantages, 'inconvenients': _char.inconvenients,
      'equipement': _char.equipement, 'histoire': _char.histoire, 'notes': _char.notes
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = map[id] !== undefined ? map[id] : '';
    });
    
    // Synchroniser les champs de l'onglet Armure
    if (_char.warrior) {
      // Champs inputs
      var wMap = {
        'w-pa-max': _char.warrior.paMax,
        'w-pe-max': _char.warrior.peMax,
        'w-cdf-max': _char.warrior.cdfMax,
        'armure-nom': _char.warrior.nomArmure,
        'armure-gen': _char.warrior.generation,
        'armure-capacite': _char.warrior.capacite
      };
      Object.keys(wMap).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = wMap[id] !== undefined ? wMap[id] : '';
      });
      
      // Titre (span)
      var titleEl = document.getElementById('armure-title');
      if (titleEl) {
        titleEl.textContent = _char.warrior.nomArmure || 'Warrior';
      }
      
      // Synchroniser les slots max
      var slotMap = {
        'slot-max-tete': _char.warrior.slots.tete.max,
        'slot-max-torse': _char.warrior.slots.torse.max,
        'slot-max-bras-g': _char.warrior.slots['bras-g'].max,
        'slot-max-bras-d': _char.warrior.slots['bras-d'].max,
        'slot-max-jambe-g': _char.warrior.slots['jambe-g'].max,
        'slot-max-jambe-d': _char.warrior.slots['jambe-d'].max
      };
      Object.keys(slotMap).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = slotMap[id] !== undefined ? slotMap[id] : '';
      });
    }
    
    _updateHeaderName();
  }

  function _updateHeaderName() {
    var el = document.getElementById('header-char-name');
    if (el) el.textContent = _char.nom || 'Nouveau Chevalier';
  }

  /* ════════════════════════════════════════
     SAUVEGARDE / CHARGEMENT
  ════════════════════════════════════════ */

  function _collectAll() {
    KNIGHT.ui.aspects.collect();
    KNIGHT.ui.gauges.collect(_char);
    KNIGHT.ui.arsenal.collect(_char);
    KNIGHT.ui.catalog.collect(_char);
  }

  function _save() {
    _collectAll();
    KNIGHT.storage.save(_char);
    _showNotif('✓', 'Fichier sauvegardé');
  }

  function _openLoadModal() {
    var modal = document.getElementById('load-modal');
    if (modal) modal.classList.add('open');

    // Vider et afficher un spinner
    var list = document.getElementById('load-char-list');
    if (list) {
      list.innerHTML = '<div class="load-list-loading">Chargement…</div>';
    }
    var manual = document.getElementById('load-manual-section');
    if (manual) manual.style.display = 'none';

    // Récupérer l'index
    KNIGHT.storage.fetchIndex(function (err, entries) {
      if (!list) return;
      if (err || entries.length === 0) {
        list.innerHTML = '<div class="load-list-empty">Aucun personnage trouvé dans <code>saves/index.json</code>.<br>Utilise le chargement manuel ci-dessous.</div>';
        if (manual) manual.style.display = 'block';
        return;
      }
      list.innerHTML = '';
      entries.forEach(function (entry) {
        var item = document.createElement('div');
        item.className = 'load-char-item';

        var nameEl = document.createElement('span');
        nameEl.className = 'load-char-name';
        nameEl.textContent = entry.name;

        var fileEl = document.createElement('span');
        fileEl.className = 'load-char-file';
        fileEl.textContent = entry.file;

        var btn = document.createElement('button');
        btn.className = 'btn btn-load btn-sm';
        btn.textContent = 'Charger';
        btn.addEventListener('click', function () {
          btn.textContent = '…';
          btn.disabled = true;
          KNIGHT.storage.fetchCharacter(entry.file, _char, function (err) {
            if (err) {
              _showNotif('⚠', 'Erreur : ' + err.message);
              btn.textContent = 'Charger';
              btn.disabled = false;
              return;
            }
            _renderAll();
            _closeLoadModal();
            _showNotif('✓', entry.name + ' chargé');
          });
        });

        item.appendChild(nameEl);
        item.appendChild(fileEl);
        item.appendChild(btn);
        list.appendChild(item);
      });

      if (manual) manual.style.display = 'block';
    });
  }

  function _closeLoadModal() {
    var modal = document.getElementById('load-modal');
    if (modal) modal.classList.remove('open');
  }

  function _doLoad() {
    var ta = document.getElementById('load-textarea');
    if (!ta) return;
    try {
      KNIGHT.storage.load(ta.value, _char);
      _renderAll();
      _closeLoadModal();
      _showNotif('✓', 'Personnage chargé');
    } catch (e) {
      _showNotif('⚠', e.message || 'Erreur de chargement');
    }
  }

  function _renderAll() {
    _syncScalaires();
    KNIGHT.ui.aspects.render(_char);
    KNIGHT.ui.gauges.render(_char);
    KNIGHT.ui.arsenal.render(_char);
    KNIGHT.ui.ledger.render(_char);
    KNIGHT.ui.armor.render(_char);
    KNIGHT.ui.catalog.render(_char);
    _renderHeroisme();
    _renderMotivations();
    _renderContacts();
    _renderQuicklist();
  }

  /* ════════════════════════════════════════
     NOTIFICATION
  ════════════════════════════════════════ */

  var _notifTimer = null;

  function _showNotif(icon, text) {
    var el    = document.getElementById('notif');
    var iconEl = document.getElementById('notif-icon');
    var textEl = document.getElementById('notif-text');
    if (!el) return;
    if (iconEl) iconEl.textContent = icon;
    if (textEl) textEl.textContent = text;
    el.classList.add('show');
    if (_notifTimer) clearTimeout(_notifTimer);
    _notifTimer = setTimeout(function () { el.classList.remove('show'); }, 2800);
  }

  /* ════════════════════════════════════════
     INIT GLOBAL
  ════════════════════════════════════════ */

  function init() {
    // Modules UI
    KNIGHT.ui.tabs.init();
    KNIGHT.ui.aspects.render(_char);
    KNIGHT.ui.gauges.init(_char);
    KNIGHT.ui.arsenal.init(_char);
    KNIGHT.ui.ledger.init(_char);
    KNIGHT.ui.armor.init(_char);
    KNIGHT.ui.catalog.init(_char);

    // App-level
    _initHeroisme();
    _initMotivations();
    _initContacts();
    _initQuicklist();
    _initScalaires();

    // Header
    _updateHeaderName();

    // Boutons sauvegarde
    var btnSave = document.getElementById('btn-save');
    var btnLoad = document.getElementById('btn-load');
    var btnLoadConfirm = document.getElementById('btn-load-confirm');
    var btnLoadCancel  = document.getElementById('btn-load-cancel');

    if (btnSave)        btnSave.addEventListener('click', _save);
    if (btnLoad)        btnLoad.addEventListener('click', _openLoadModal);
    if (btnLoadConfirm) btnLoadConfirm.addEventListener('click', _doLoad);
    if (btnLoadCancel)  btnLoadCancel.addEventListener('click', _closeLoadModal);

    // Fermer modal sur overlay click
    var modal = document.getElementById('load-modal');
    if (modal) modal.addEventListener('click', function (e) {
      if (e.target === modal) _closeLoadModal();
    });

    // Bouton bascule mode édition/jeu
    var btnToggleMode = document.getElementById('btn-toggle-mode');
    if (btnToggleMode) {
      btnToggleMode.addEventListener('click', _toggleEditMode);
    }
  }

  return {
    init:      init,
    save:      _save,
    showNotif: _showNotif,
    getChar:   function () { return _char; },
    renderAll: _renderAll,
    _setEditMode: _setEditMode
  };

}());

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', function () {
  // Init UI d'abord
  KNIGHT.app.init();

  // Détecter le mode dans l'URL (edit ou play)
  var urlParams = new URLSearchParams(window.location.search);
  var modeParam = urlParams.get('mode');
  if (modeParam === 'play') {
    KNIGHT.app._setEditMode(false);
  } else {
    // Par défaut : mode édition
    KNIGHT.app._setEditMode(true);
  }

  // Vérifier si un id est présent dans l'URL (ex: ?id=gregoire)
  var idParam = urlParams.get('id');
  if (idParam) {
    KNIGHT.storage.loadFromUrlParam(
      idParam,
      KNIGHT.app.getChar(),
      function (err) {
        if (err) {
          KNIGHT.app.showNotif('⚠', 'Erreur : ' + err.message);
          return;
        }
        // Succès : re-render tout
        KNIGHT.app.renderAll();
        KNIGHT.app.showNotif('✓', 'Personnage chargé depuis l\'URL');
      }
    );
    return; // On a tenté le chargement par URL, on sort
  }

  // Puis tentative de chargement automatique depuis save.json (ancien comportement)
  if (typeof KNIGHT.storage.autoLoad === 'function') {
    KNIGHT.storage.autoLoad(
      KNIGHT.app.getChar(),
      function () {
        KNIGHT.app.renderAll();
        KNIGHT.app.showNotif('✓', 'Personnage chargé');
      },
      function () {
        // Pas de save.json : nouveau personnage, rien à faire
      }
    );
  }
});
