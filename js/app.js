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
      'archetype':    function (v) { _char.archetype = v; },
      'section':      function (v) { _char.section = v; },
      'blason':       function (v) { _char.blason = v; },
      'voeu':         function (v) { _char.voeu = v; },
      'pg':           function (v) { _char.pg = parseInt(v) || 0; },
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
  }

  function _syncScalaires() {
    var map = {
      'nom': _char.nom, 'archetype': _char.archetype, 'section': _char.section,
      'blason': _char.blason, 'voeu': _char.voeu,
      'pg': _char.pg, 'px': _char.px, 'pg-armure': _char.pgArmure,
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
  }

  function _save() {
    _collectAll();
    KNIGHT.storage.save(_char);
    _showNotif('✓', 'Fichier sauvegardé');
  }

  function _openLoadModal() {
    var modal = document.getElementById('load-modal');
    if (modal) modal.classList.add('open');
    var ta = document.getElementById('load-textarea');
    if (ta) ta.value = '';
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
  }

  return {
    init:      init,
    save:      _save,
    showNotif: _showNotif
  };

}());

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', function () {
  KNIGHT.app.init();
});
