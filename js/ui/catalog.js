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
    'armure':    { catalog: 'armures',    field: 'armure' }
  };

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
    var currentValue = select.value || _char[mapping.field];

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
        select.value = char[mapping.field] || '';
      }
    });
    _initSelects(); // Re-remplir au cas où les catalogues ont changé
  }

  /* ── Collecter les données des sélecteurs ── */
  function collect(char) {
    Object.keys(_catalogMappings).forEach(function (selectId) {
      var mapping = _catalogMappings[selectId];
      var select = document.getElementById(selectId);
      if (select) {
        char[mapping.field] = select.value;
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
        _char[_catalogMappings[selectId].field] = newItem;
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
            _char[mapping.field] = this.value;
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
