/* ═══════════════════════════════════════════
   KNIGHT — ui/catalog.js
   Gestion de l'interface pour les sélecteurs de catalogues
   (Archétype, Section, Blason, Armure) avec possibilité d'ajouter
   de nouveaux éléments.
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.ui = KNIGHT.ui || {};

KNIGHT.ui.catalog = (function () {

  /* ── État ── */
  var _char = null;
  var _catalogMappings = {
    'archetype': { catalog: 'archetypes', field: 'archetype' },
    'section':   { catalog: 'sections',   field: 'section' },
    'blason':    { catalog: 'blasons',    field: 'blason' },
    'armure':    { catalog: 'armures',    field: 'warrior.nomArmure' }
  };

  /* Helper pour accéder aux champs imbriqués */
  function _getField(obj, path) {
    if (!path) return undefined;
    var parts = path.split('.');
    var current = obj;
    for (var i = 0; i < parts.length; i++) {
      if (current[parts[i]] === undefined) return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  function _setField(obj, path, value) {
    if (!path) return;
    var parts = path.split('.');
    var current = obj;
    for (var i = 0; i < parts.length - 1; i++) {
      if (current[parts[i]] === undefined) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }

  /* ── Initialisation ── */
  function init(char) {
    _char = char;
    _initSelects();
    _initAddButtons();
  }

  /* ── Remplir les sélecteurs ── */
  function _initSelects() {
    Object.keys(_catalogMappings).forEach(function (selectId) {
      var mapping = _catalogMappings[selectId];
      _fillSelect(selectId, mapping.catalog);
    });
  }

  function _fillSelect(selectId, catalogName) {
    var select = document.getElementById(selectId);
    if (!select) return;

    var catalog = _char.catalogs[catalogName];
    if (!catalog) return;

    var mapping = _catalogMappings[selectId];
    
    // Conserver la valeur actuelle
    var currentValue = select.value || _getField(_char, mapping.field);

    // Vider et ajouter l'option par défaut
    select.innerHTML = '<option value="">— Sélectionner —</option>';

    // Ajouter les options du catalogue
    catalog.items.forEach(function (item) {
      var option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      select.appendChild(option);
    });

    // Restaurer la valeur actuelle
    if (currentValue) {
      select.value = currentValue;
    }
  }

  /* ── Synchroniser les sélecteurs avec les données du personnage ── */
  function render(char) {
    _char = char;
    Object.keys(_catalogMappings).forEach(function (selectId) {
      var mapping = _catalogMappings[selectId];
      var select = document.getElementById(selectId);
      if (select) {
        select.value = _getField(char, mapping.field) || '';
      }
    });
    _initSelects(); // Re-remplir au cas où les catalogues ont changé
    
    // Si une armure est déjà sélectionnée
    var armureValue = _getField(char, 'warrior.nomArmure');
    var hasArmure = armureValue && armureValue.trim() !== '';
    
    // Afficher/masquer l'onglet Armure
    if (KNIGHT.ui.tabs && KNIGHT.ui.tabs.setArmureTabVisible) {
      KNIGHT.ui.tabs.setArmureTabVisible(hasArmure);
    }
    
    // Appliquer les données de l'armure si sélectionnée
    if (hasArmure && KNIGHT.data && KNIGHT.data.armorData) {
      KNIGHT.data.armorData.applyToCharacter(char, armureValue);
    }
  }

  /* ── Collecter les données des sélecteurs ── */
  function collect(char) {
    Object.keys(_catalogMappings).forEach(function (selectId) {
      var mapping = _catalogMappings[selectId];
      var select = document.getElementById(selectId);
      if (select) {
        _setField(char, mapping.field, select.value);
      }
    });
  }

  /* ── Gestion des boutons d'ajout ── */
  function _initAddButtons() {
    Object.keys(_catalogMappings).forEach(function (selectId) {
      var btnId = 'btn-add-' + selectId;
      var btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', (function (selectId, catalogName) {
          return function () {
            _promptNewItem(selectId, catalogName);
          };
        }(selectId, _catalogMappings[selectId].catalog)));
      }
    });
  }

  function _promptNewItem(selectId, catalogName) {
    var newItem = prompt('Nouveau ' + catalogName + ':', '');
    if (!newItem || newItem.trim() === '') return;

    newItem = newItem.trim();

    // Ajouter au catalogue
    var catalog = _char.catalogs[catalogName];
    if (catalog && catalog.addItem(newItem)) {
      // Re-remplir le sélecteur
      _fillSelect(selectId, catalogName);

      // Sélectionner le nouvel élément
      var select = document.getElementById(selectId);
      if (select) {
        select.value = newItem;
        // Mettre à jour le personnage
        _setField(_char, _catalogMappings[selectId].field, newItem);
      }
    } else {
      alert('Cet élément existe déjà ou est invalide.');
    }
  }

  /* ── Gestion des changements de sélection ── */
  function _initSelectChangeHandlers() {
    Object.keys(_catalogMappings).forEach(function (selectId) {
      var mapping = _catalogMappings[selectId];
      var select = document.getElementById(selectId);
      if (select) {
        select.addEventListener('change', function () {
          if (_char) {
            _setField(_char, mapping.field, this.value);
            
            // Si c'est le sélecteur d'armure
            if (selectId === 'armure') {
              // Afficher/masquer l'onglet Armure
              var hasArmure = this.value && this.value.trim() !== '';
              if (KNIGHT.ui.tabs && KNIGHT.ui.tabs.setArmureTabVisible) {
                KNIGHT.ui.tabs.setArmureTabVisible(hasArmure);
              }
              
              // Appliquer les données de l'armure si sélectionnée
              if (hasArmure && KNIGHT.data && KNIGHT.data.armorData) {
                KNIGHT.data.armorData.applyToCharacter(_char, this.value);
                // Mettre à jour l'interface
                if (typeof KNIGHT.app !== 'undefined' && KNIGHT.app.renderAll) {
                  KNIGHT.app.renderAll();
                }
              }
            }
          }
        });
      }
    });
  }

  // Initialiser les gestionnaires de changement
  _initSelectChangeHandlers();

  /* ── API publique ── */
  return {
    init:    init,
    render:  render,
    collect: collect
  };

}());
