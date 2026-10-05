/* ═══════════════════════════════════════════
   KNIGHT — app.js
   Point d'entrée : init, wiring global,
   héroïsme, motivations, contacts, quicklist,
   modale de chargement, notifications.
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};

// Fonction utilitaire pour échapper le HTML
function _escapeHtml(text) {
  if (text === null || text === undefined) return '';
  var div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

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
    
    // Appliquer la transformation après un petit délai pour laisser le temps au DOM de se mettre à jour
    setTimeout(function() {
      _transformFieldsToLabels(!enabled);
    }, 50);
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
    // IDs des champs de combat à garder éditables même en mode Jeu
    var combatFieldIds = ['ps-current', 'ps-max', 'pa-current', 'pa-max', 'pe-current', 'pe-max', 'cdf-current', 'cdf-max', 'defense', 'reaction', 'initiative', 'gauge-modify-delta', 'gauge-modify-reason'];
    
    var fields = document.querySelectorAll('input, textarea, select');
    fields.forEach(function (field) {
      if (field.tagName === 'SELECT') {
        field.disabled = !_isEditMode;
      } else {
        // Les champs de combat restent toujours éditables
        var isCombatField = combatFieldIds.indexOf(field.id) !== -1 || 
                           field.classList.contains('gauge-current') || 
                           field.classList.contains('gauge-max') ||
                           field.id === 'gauge-modify-delta' ||
                           field.id === 'gauge-modify-reason';
        field.readOnly = !_isEditMode && !isCombatField;
      }
    });
    // Désactiver aussi les boutons d'édition (tous les btn-add, btn-del, etc.)
    var editButtons = document.querySelectorAll('.btn-save, .btn-load, .btn-add, .motivation-del, .voeu-del, .ai-del, .contact-del, .quicklist-del, [id^="btn-add-"], [id*="-del"], [id*="-remove"]');
    editButtons.forEach(function (btn) {
      // Ne pas cacher le bouton du journal des jauges en mode Jeu
      if (btn.id !== 'btn-gauge-journal') {
        btn.style.display = _isEditMode ? '' : 'none';
      }
    });
    
    // Désactiver les dots d'héroïsme dans Général en mode Jeu (ils restent modifiables dans Combat)
    var heroismMiniDots = document.querySelectorAll('.heroism-dot-mini');
    heroismMiniDots.forEach(function(dot) {
      dot.style.pointerEvents = _isEditMode ? '' : 'none';
      dot.style.opacity = _isEditMode ? '' : '0.5';
    });
    
    // Transformer les champs en affichage label en mode lecture seule
    _transformFieldsToLabels(!_isEditMode);
  }

  function _transformFieldsToLabels(readOnlyMode) {
    // Sélectionner tous les conteneurs de champs avec select
    var fieldContainers = document.querySelectorAll('.field');
    fieldContainers.forEach(function(container) {
      var select = container.querySelector('select');
      if (select) {
        // Trouver la valeur sélectionnée
        var selectedIndex = select.selectedIndex;
        var selectedText = selectedIndex >= 0 ? select.options[selectedIndex].text : (select.options[0]?.text || '');
        
        // Créer ou mettre à jour un span pour afficher la valeur
        var displaySpan = container.querySelector('.field-display-value');
        if (!displaySpan) {
          displaySpan = document.createElement('span');
          displaySpan.className = 'field-display-value';
          // Insérer avant le select dans le même conteneur parent
          var selectParent = select.parentElement;
          if (selectParent) {
            selectParent.insertBefore(displaySpan, select);
          } else {
            container.insertBefore(displaySpan, select);
          }
        }
        
        // Mettre à jour la valeur affichée
        displaySpan.textContent = selectedText && !selectedText.includes('Sélectionner') ? selectedText : '...';
        
        // Afficher/masquer le span et le select
        if (readOnlyMode) {
          select.style.display = 'none';
          displaySpan.style.display = 'inline-block';
        } else {
          select.style.display = '';
          displaySpan.style.display = 'none';
        }
      }
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
        
        // Ajouter les clics sur les mini-dots
        var miniDot = document.getElementById('h' + n + '-mini');
        if (miniDot) miniDot.addEventListener('click', function () { _toggleHeroisme(n); });
      }(i));
    }
    _renderHeroisme();
  }

  function _toggleHeroisme(n) {
    if (_char.gauges.heroisme) {
      var newValue = (_char.gauges.heroisme.current === n) ? n - 1 : n;
      _char.gauges.heroisme.current = newValue;
      // Synchroniser l'ancienne propriété pour la compatibilité
      _char.heroisme = newValue;
    }
    _renderHeroisme();
  }

  function _renderHeroisme() {
    var heroismeValue = _char.gauges.heroisme ? _char.gauges.heroisme.current : (_char.heroisme || 0);
    
    for (var i = 1; i <= 6; i++) {
      var dot = document.getElementById('h' + i);
      if (dot) dot.classList.toggle('active', i <= heroismeValue);
      
      // Synchroniser les mini-dots
      var miniDot = document.getElementById('h' + i + '-mini');
      if (miniDot) miniDot.classList.toggle('active', i <= heroismeValue);
    }
    
    // Mettre à jour l'affichage numérique
    var displayEl = document.getElementById('heroisme-display');
    if (displayEl) {
      displayEl.textContent = heroismeValue + ' pts';
    }
    
    // Mettre à jour le hidden input pour le mode lecture seule
    var hiddenEl = document.getElementById('heroisme-value');
    if (hiddenEl) {
      hiddenEl.value = heroismeValue;
    }
  }

  /* ════════════════════════════════════════
     MOTIVATIONS
  ════════════════════════════════════════ */

  function _renderMotivations() {
    var list = document.getElementById('motivations-list');
    if (!list) return;
    list.innerHTML = '';

    // Trier : majeures en premier, puis mineures
    var sorted = _char.motivations.slice().sort(function(a, b) {
      if (a.type === 'major' && b.type !== 'major') return -1;
      if (a.type !== 'major' && b.type === 'major') return 1;
      return 0;
    });

    sorted.forEach(function (m, i) {
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
        return function (e) { 
          var originalIdx = _char.motivations.indexOf(m);
          if (originalIdx !== -1) _char.motivations[originalIdx].texte = e.target.value; 
        };
      }(i)));

      var del = document.createElement('button');
      del.className = 'motivation-del';
      del.textContent = '×';
      del.title = 'Supprimer';
      del.addEventListener('click', (function (motivation) {
        return function () {
          var idx = _char.motivations.indexOf(motivation);
          if (idx !== -1) {
            _char.removeMotivation(idx);
            _renderMotivations();
          }
        };
      }(m)));

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
     VŒUX
  ════════════════════════════════════════ */

  function _renderVoeux() {
    var list = document.getElementById('voeux-list');
    if (!list) return;
    list.innerHTML = '';

    _char.voeux.forEach(function (v, i) {
      var div = document.createElement('div');
      div.className = 'voeu-item';

      var ta = document.createElement('textarea');
      ta.className = 'voeu-text';
      ta.rows = 2;
      ta.placeholder = 'Description du vœu…';
      ta.value = v.texte || '';
      ta.addEventListener('input', (function (idx) {
        return function (e) { _char.voeux[idx].texte = e.target.value; };
      }(i)));

      var del = document.createElement('button');
      del.className = 'voeu-del';
      del.textContent = '×';
      del.title = 'Supprimer';
      del.addEventListener('click', (function (idx) {
        return function () {
          _char.removeVoeu(idx);
          _renderVoeux();
        };
      }(i)));

      div.appendChild(ta);
      div.appendChild(del);
      list.appendChild(div);
    });
  }

  function _initVoeux() {
    var btn = document.getElementById('btn-add-voeu');
    if (btn) btn.addEventListener('click', function () {
      _char.addVoeu();
      _renderVoeux();
    });
  }

  /* ════════════════════════════════════════
     AVANTAGES / INCONVÉNIENTS
  ════════════════════════════════════════ */

  function _renderAvantagesInconvenients() {
    var list = document.getElementById('avantage-inconvenient-list');
    if (!list) return;
    list.innerHTML = '';

    // Trier : avantages en premier, puis inconvénients
    var sorted = _char.avantagesInconvenients.slice().sort(function(a, b) {
      if (a.type === 'avantage' && b.type !== 'avantage') return -1;
      if (a.type !== 'avantage' && b.type === 'avantage') return 1;
      return 0;
    });

    sorted.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'avantage-inconvenient-item';

      var badge = document.createElement('span');
      badge.className = 'ai-type ' + item.type;
      badge.textContent = item.type === 'avantage' ? 'Avantage' : 'Inconvénient';

      var ta = document.createElement('textarea');
      ta.className = 'ai-text';
      ta.rows = 2;
      ta.placeholder = 'Description…';
      ta.value = item.texte || '';
      ta.addEventListener('input', (function (ai) {
        return function (e) { ai.texte = e.target.value; };
      }(item)));

      var del = document.createElement('button');
      del.className = 'ai-del';
      del.textContent = '×';
      del.title = 'Supprimer';
      del.addEventListener('click', (function (ai) {
        return function () {
          var idx = _char.avantagesInconvenients.indexOf(ai);
          if (idx !== -1) {
            _char.removeAvantageInconvenient(idx);
            _renderAvantagesInconvenients();
          }
        };
      }(item)));

      div.appendChild(badge);
      div.appendChild(ta);
      div.appendChild(del);
      list.appendChild(div);
    });
  }

  function _initAvantagesInconvenients() {
    var btnAvantage = document.getElementById('btn-add-avantage');
    var btnInconvenient = document.getElementById('btn-add-inconvenient');
    
    if (btnAvantage) btnAvantage.addEventListener('click', function () {
      _char.addAvantageInconvenient('avantage');
      _renderAvantagesInconvenients();
    });
    
    if (btnInconvenient) btnInconvenient.addEventListener('click', function () {
      _char.addAvantageInconvenient('inconvenient');
      _renderAvantagesInconvenients();
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
      'px':           function (v) { _char.px = parseInt(v) || 0; },
      'pg-armure':    function (v) { _char.pgArmure = parseInt(v) || 0; },
      'pg-depenses':  function (v) { _char.pgDepenses = parseInt(v) || 0; },
      'px-depenses':  function (v) { _char.pxDepenses = parseInt(v) || 0; },
      'heroisme-base': function (v) { 
        if (_char.ledgerHeroisme) { 
          _char.ledgerHeroisme.base = parseInt(v) || 0; 
          KNIGHT.ui.ledger.render(_char); 
        } 
      },
      'xp-base':      function (v) { 
        if (_char.ledgerXp) { 
          _char.ledgerXp.base = parseInt(v) || 0; 
          KNIGHT.ui.ledger.render(_char); 
        } 
      },
      'defense':      function (v) { _char.derived.defense = parseInt(v) || 0; _updateDerivedDisplay(); },
      'reaction':     function (v) { _char.derived.reaction = parseInt(v) || 0; _updateDerivedDisplay(); },
      'initiative':   function (v) { _char.derived.initiative = parseInt(v) || 0; _updateDerivedDisplay(); },
      'defense-input':    function (v) { _char.derived.defense = parseInt(v) || 0; _updateDerivedDisplay(); },
      'reaction-input':   function (v) { _char.derived.reaction = parseInt(v) || 0; _updateDerivedDisplay(); },
      'initiative-input': function (v) { _char.derived.initiative = parseInt(v) || 0; _updateDerivedDisplay(); },
      'equipement':   function (v) { _char.equipement = v; },
      'histoire':     function (v) { _char.histoire = v; },
      'notes':        function (v) { _char.notes = v; },
      'armure':       function (v) { 
        if (_char.warrior) { 
          _char.warrior.nomArmure = v; 
        } 
      }
    };

    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () { 
          map[id](this.value); 
          _syncDisplayValues();
        });
      }
    });
    
    // Gestion des champs de l'onglet Armure
    if (_char.warrior) {
      var wMap = {
        'w-pa-max':    function (v) { _char.warrior.paMax = parseInt(v) || 0; },
        'w-pe-max':    function (v) { _char.warrior.peMax = parseInt(v) || 0; },
        'w-cdf-max':   function (v) { _char.warrior.cdfMax = parseInt(v) || 0; },
        'armure-nom':  function (v) { 
          _char.warrior.nomArmure = v; 
          // Synchroniser le champ armure dans l'onglet Caractéristiques
          var armureField = document.getElementById('armure');
          if (armureField) armureField.value = v;
        },
        'armure-gen':  function (v) { _char.warrior.generation = v; },
        'armure-capacite': function (v) { _char.warrior.capacite = v; },
      };
      Object.keys(wMap).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', function () { wMap[id](this.value); });
      });
    }
  }

  function _syncScalaires() {
    var map = {
      'nom': _char.nom,
      'px': _char.px, 'pg-armure': _char.pgArmure,
      'pg-depenses': _char.pgDepenses || 0,
      'px-depenses': _char.pxDepenses,
      'heroisme-base': _char.ledgerHeroisme ? _char.ledgerHeroisme.base : 6,
      'xp-base': _char.ledgerXp ? _char.ledgerXp.base : 0,
      'defense': _char.derived.defense, 'reaction': _char.derived.reaction,
      'initiative': _char.derived.initiative,
      'equipement': _char.equipement, 'histoire': _char.histoire, 'notes': _char.notes,
      'armure': _char.warrior ? _char.warrior.nomArmure : 'Warrior'
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = map[id] !== undefined ? map[id] : '';
    });
    
    // Synchroniser les champs de l'onglet Armure
    if (_char.warrior) {
      var wMap = {
        'w-pa-max': _char.warrior.paMax,
        'w-pe-max': _char.warrior.peMax,
        'w-cdf-max': _char.warrior.cdfMax,
        'armure-nom': _char.warrior.nomArmure,
        'armure-gen': _char.warrior.generation
      };
      Object.keys(wMap).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = wMap[id] !== undefined ? wMap[id] : '';
      });
      
      // Afficher les overdrives dans l'onglet Armure
      var overdrivesContainer = document.getElementById('armure-overdrives-container');
      if (overdrivesContainer && _char.warrior && _char.warrior.activeTypes) {
        if (_char.warrior.activeTypes.length > 0) {
          var odHtml = '<div class="overdrives-badge">' + _char.warrior.activeTypes.map(function(od) {
            return '<span class="od-tag">' + _escapeHtml(od) + '</span>';
          }).join('') + '</div>';
          overdrivesContainer.innerHTML = odHtml;
          var odTitleEl = document.getElementById('armure-overdrives-title');
          if (odTitleEl) {
            odTitleEl.innerHTML = ' <span class="od-separator">|</span> ' + _char.warrior.activeTypes.map(_escapeHtml).join(', ');
          }
        } else {
          overdrivesContainer.innerHTML = '<div style="color:var(--text-faint);">Aucun overdrive</div>';
          var odTitleEl = document.getElementById('armure-overdrives-title');
          if (odTitleEl) odTitleEl.innerHTML = '';
        }
      }
      
      // Afficher les overdrives dans l'onglet Caractéristiques
      var overdrivesQuickContainer = document.getElementById('armor-overdrives-quick');
      if (overdrivesQuickContainer) {
        if (_char.warrior && _char.warrior.activeTypes && _char.warrior.activeTypes.length > 0) {
          var odQuickHtml = '<div class="overdrives-badge">' + _char.warrior.activeTypes.map(function(od) {
            return '<span class="od-tag">' + _escapeHtml(od) + '</span>';
          }).join('') + '</div>';
          overdrivesQuickContainer.innerHTML = odQuickHtml;
        } else {
          overdrivesQuickContainer.innerHTML = '<div style="color:var(--text-faint);">Aucune armure ou aucun overdrive actif</div>';
        }
      }

      // Afficher les capacités
      var capacitesContainer = document.getElementById('armure-capacites-container');
      if (capacitesContainer) {
        if (_char.warrior && _char.warrior.capaciteDescriptions && Object.keys(_char.warrior.capaciteDescriptions).length > 0) {
          var html = '';
          try {
            Object.keys(_char.warrior.capaciteDescriptions).forEach(function(capaciteName) {
              var capData = _char.warrior.capaciteDescriptions[capaciteName];
              if (!capData || typeof capData !== 'object') return;
              html += '<div class="capacite-item">';
              html += '<div class="capacite-header">' + (capaciteName || 'Capacité') + '</div>';
              if (capData.description) {
                html += '<div class="capacite-description">' + _escapeHtml(capData.description) + '</div>';
              }
              if (capData.effet) {
                html += '<div class="capacite-section"><strong>Effet:</strong> ' + _escapeHtml(capData.effet) + '</div>';
              }
              if (capData.energie) {
                html += '<div class="capacite-section"><strong>Énergie:</strong> ' + _escapeHtml(capData.energie) + '</div>';
              }
              if (capData.activation) {
                html += '<div class="capacite-section"><strong>Activation:</strong> ' + _escapeHtml(capData.activation) + '</div>';
              }
              if (capData.duree) {
                html += '<div class="capacite-section"><strong>Durée:</strong> ' + _escapeHtml(capData.duree) + '</div>';
              }
              if (capData.variantes && typeof capData.variantes === 'object') {
                html += '<div class="capacite-variantes">';
                Object.keys(capData.variantes).forEach(function(variantName) {
                  var variant = capData.variantes[variantName];
                  if (!variant || typeof variant !== 'object') return;
                  html += '<div class="capacite-variant">';
                  html += '<div class="variant-header">' + _escapeHtml(variantName) + '</div>';
                  if (variant.description) {
                    html += '<div class="variant-description">' + _escapeHtml(variant.description) + '</div>';
                  }
                  if (variant.effet) {
                    html += '<div class="variant-section"><strong>Effet:</strong> ' + _escapeHtml(variant.effet) + '</div>';
                  }
                  if (variant.degats) {
                    html += '<div class="variant-section"><strong>Dégâts:</strong> ' + _escapeHtml(variant.degats) + '</div>';
                  }
                  if (variant.violence) {
                    html += '<div class="variant-section"><strong>Violence:</strong> ' + _escapeHtml(variant.violence) + '</div>';
                  }
                  if (variant.portree) {
                    html += '<div class="variant-section"><strong>Portée:</strong> ' + _escapeHtml(variant.portree) + '</div>';
                  }
                  if (variant.effets && Array.isArray(variant.effets) && variant.effets.length > 0) {
                    html += '<div class="variant-section"><strong>Effets:</strong> ' + _escapeHtml(variant.effets.join(', ')) + '</div>';
                  }
                  html += '</div>';
                });
                html += '</div>';
              }
              if (capData.types && typeof capData.types === 'object') {
                html += '<div class="capacite-types">';
                Object.keys(capData.types).forEach(function(typeName) {
                  var type = capData.types[typeName];
                  if (!type || typeof type !== 'object') return;
                  html += '<div class="capacite-type">';
                  html += '<div class="type-header">' + _escapeHtml(typeName) + ' (' + _escapeHtml(type.aspect || '') + ')</div>';
                  if (Array.isArray(type.caracs)) {
                    html += '<div class="type-caracs">' + _escapeHtml(type.caracs.join(', ')) + '</div>';
                  }
                  html += '</div>';
                });
                html += '</div>';
              }
              html += '</div>';
            });
            capacitesContainer.innerHTML = html;
          } catch (e) {
            console.error('Erreur lors de l\'affichage des capacités:', e);
            capacitesContainer.innerHTML = '<div style="color:red;">Erreur d\'affichage</div>';
          }
        } else if (_char.warrior && _char.warrior.capacite) {
          var capacites = _char.warrior.capacite.split(/[;,]/).map(function(c) { return c.trim(); }).filter(function(c) { return c; });
          capacitesContainer.innerHTML = capacites.map(function(capacite) {
            return '<div class="capacite-item">' + _escapeHtml(capacite) + '</div>';
          }).join('');
        } else {
          capacitesContainer.innerHTML = '<div style="color:var(--text-faint);">Aucune capacité</div>';
        }
      }
      
      var titleEl = document.getElementById('armure-title');
      if (titleEl) {
        titleEl.textContent = _char.warrior.nomArmure || 'Warrior';
      }
      
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
    
    // Synchroniser les affichages des valeurs dans l'onglet Général
    _syncDisplayValues();
    _updateHeaderName();
    _updateDerivedDisplay();
  }

  function _syncDisplayValues() {
    // PES
    var pesCurrentEl = document.getElementById('pes-current');
    var pesMaxEl = document.getElementById('pes-max');
    var pesCurrentDisplay = document.getElementById('pes-current-display');
    var pesMaxDisplay = document.getElementById('pes-max-display');
    
    if (pesCurrentEl && pesCurrentDisplay) {
      pesCurrentDisplay.textContent = pesCurrentEl.value;
    }
    if (pesMaxEl && pesMaxDisplay) {
      pesMaxDisplay.textContent = pesMaxEl.value;
    }
    
    // PX
    var pxEl = document.getElementById('px');
    var pxDepensesEl = document.getElementById('px-depenses');
    var pxDisplay = document.getElementById('px-display');
    var pxDepensesDisplay = document.getElementById('px-depenses-display');
    
    if (pxEl && pxDisplay) {
      pxDisplay.textContent = pxEl.value;
    }
    if (pxDepensesEl && pxDepensesDisplay) {
      pxDepensesDisplay.textContent = pxDepensesEl.value;
    }
    
    // PG
    var pgArmureEl = document.getElementById('pg-armure');
    var pgDepensesEl2 = document.getElementById('pg-depenses');
    var pgArmureDisplay = document.getElementById('pg-armure-display');
    var pgDepensesDisplay2 = document.getElementById('pg-depenses-display');
    
    if (pgArmureEl && pgArmureDisplay) {
      pgArmureDisplay.textContent = pgArmureEl.value;
    }
    if (pgDepensesEl2 && pgDepensesDisplay2) {
      pgDepensesDisplay2.textContent = pgDepensesEl2.value;
    }
    
    // Héroïsme - synchroniser l'affichage dans Général
    var heroismeDisplayEl = document.getElementById('heroisme-display');
    var heroismeValueEl = document.getElementById('heroisme-value');
    if (heroismeValueEl && heroismeDisplayEl) {
      heroismeDisplayEl.textContent = heroismeValueEl.value + ' pts';
    }
    
    // Jauges rapides (PS, PA, PE)
    var psCurrentEl = document.getElementById('ps-current');
    var psMaxEl = document.getElementById('ps-max');
    var psQuickCurrent = document.getElementById('ps-quick-current');
    var psQuickMax = document.getElementById('ps-quick-max');
    var psQuickFill = document.getElementById('gauge-ps-quick-fill');
    if (psCurrentEl && psQuickCurrent) psQuickCurrent.textContent = psCurrentEl.value;
    if (psMaxEl && psQuickMax) psQuickMax.textContent = psMaxEl.value;
    if (psCurrentEl && psMaxEl && psQuickFill) {
      var psPct = Math.max(0, Math.min(100, (parseFloat(psCurrentEl.value) / parseFloat(psMaxEl.value)) * 100));
      psQuickFill.style.width = psPct + '%';
    }
    
    var paCurrentEl = document.getElementById('pa-current');
    var paMaxEl = document.getElementById('pa-max');
    var paQuickCurrent = document.getElementById('pa-quick-current');
    var paQuickMax = document.getElementById('pa-quick-max');
    var paQuickFill = document.getElementById('gauge-pa-quick-fill');
    if (paCurrentEl && paQuickCurrent) paQuickCurrent.textContent = paCurrentEl.value;
    if (paMaxEl && paQuickMax) paQuickMax.textContent = paMaxEl.value;
    if (paCurrentEl && paMaxEl && paQuickFill) {
      var paPct = Math.max(0, Math.min(100, (parseFloat(paCurrentEl.value) / parseFloat(paMaxEl.value)) * 100));
      paQuickFill.style.width = paPct + '%';
    }
    
    var peCurrentEl = document.getElementById('pe-current');
    var peMaxEl = document.getElementById('pe-max');
    var peQuickCurrent = document.getElementById('pe-quick-current');
    var peQuickMax = document.getElementById('pe-quick-max');
    var peQuickFill = document.getElementById('gauge-pe-quick-fill');
    if (peCurrentEl && peQuickCurrent) peQuickCurrent.textContent = peCurrentEl.value;
    if (peMaxEl && peQuickMax) peQuickMax.textContent = peMaxEl.value;
    if (peCurrentEl && peMaxEl && peQuickFill) {
      var pePct = Math.max(0, Math.min(100, (parseFloat(peCurrentEl.value) / parseFloat(peMaxEl.value)) * 100));
      peQuickFill.style.width = pePct + '%';
    }
  }

  function _initQuickGauges() {
    // Ajouter des listeners sur les inputs de jauges pour mettre à jour les affichages rapides
    var gaugeIds = ['ps', 'pa', 'pe'];
    gaugeIds.forEach(function(id) {
      var currentEl = document.getElementById(id + '-current');
      var maxEl = document.getElementById(id + '-max');
      if (currentEl) {
        currentEl.addEventListener('input', _syncDisplayValues);
      }
      if (maxEl) {
        maxEl.addEventListener('input', _syncDisplayValues);
      }
    });
  }

  function _updateDerivedDisplay() {
    var defenseInput = document.getElementById('defense');
    var reactionInput = document.getElementById('reaction');
    var initiativeInput = document.getElementById('initiative');
    var defenseDisplay = document.getElementById('defense-display');
    var reactionDisplay = document.getElementById('reaction-display');
    var initiativeDisplay = document.getElementById('initiative-display');
    
    if (defenseInput && defenseDisplay) {
      defenseDisplay.textContent = defenseInput.value;
    }
    if (reactionInput && reactionDisplay) {
      reactionDisplay.textContent = reactionInput.value;
    }
    if (initiativeInput && initiativeDisplay) {
      initiativeDisplay.textContent = initiativeInput.value;
    }
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
    _renderVoeux();
    _renderAvantagesInconvenients();
    _renderContacts();
    _renderQuicklist();
    // Appliquer la transformation des champs si on est en mode lecture seule
    if (!_isEditMode) {
      _transformFieldsToLabels(true);
    }
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
    _initVoeux();
    _initAvantagesInconvenients();
    _initContacts();
    _initQuicklist();
    _initScalaires();
    _initQuickGauges();

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
    syncScalaires: _syncScalaires,
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
        // Passer en mode Jeu quand un JSON est chargé depuis l'URL
        KNIGHT.app._setEditMode(false);
        // Mettre à jour l'URL pour refléter le mode Jeu
        var urlParams = new URLSearchParams(window.location.search);
        urlParams.set('mode', 'play');
        window.history.replaceState({}, '', '?' + urlParams.toString());
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
