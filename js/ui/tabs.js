/* ═══════════════════════════════════════════
   KNIGHT — ui/tabs.js
   Gestion de la navigation par onglets
   (onglets principaux + sous-onglets arsenal)
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.ui = KNIGHT.ui || {};

KNIGHT.ui.tabs = (function () {

  var _currentTab    = 'carac';
  var _currentSubTab = 'armes';

  // ── Onglets principaux ──

  function _switchTab(id) {
    document.querySelectorAll('.tab-page').forEach(function (el) {
      el.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(function (el) {
      el.classList.remove('active');
    });

    var page = document.getElementById('page-' + id);
    var tab  = document.getElementById('tab-'  + id);
    if (page) page.classList.add('active');
    if (tab)  tab.classList.add('active');
    _currentTab = id;
  }

  // ── Sous-onglets Arsenal ──

  var _subIds = ['armes', 'modules', 'ia'];

  function _switchSubTab(id) {
    _subIds.forEach(function (s) {
      var panel = document.getElementById('sub-' + s);
      var btn   = document.getElementById('subtab-' + s);
      if (panel) panel.style.display = (s === id) ? 'block' : 'none';
      if (btn)   btn.classList.toggle('active', s === id);
    });
    _currentSubTab = id;
  }

  // ── Visibilité onglet Armure ──

  function _setArmureTabVisible(visible) {
    var tab = document.getElementById('tab-armure');
    var page = document.getElementById('page-armure');
    if (tab) tab.style.display = visible ? '' : 'none';
    if (page) page.style.display = visible ? '' : 'none';
    
    // Si l'onglet Armure est masqué et qu'il est actuellement sélectionné,
    // basculer vers un autre onglet
    if (!visible && _currentTab === 'armure') {
      _switchTab('carac');
    }
  }

  // ── Init ──

  function init() {
    // Onglets principaux
    ['carac', 'combat', 'arsenal', 'armure', 'reste'].forEach(function (id) {
      var tab = document.getElementById('tab-' + id);
      if (tab) {
        tab.addEventListener('click', function () { _switchTab(id); });
      }
    });

    // Sous-onglets
    _subIds.forEach(function (id) {
      var btn = document.getElementById('subtab-' + id);
      if (btn) {
        btn.addEventListener('click', function () { _switchSubTab(id); });
      }
    });

    // État initial
    _switchTab('carac');
    _switchSubTab('armes');
    
    // Masquer l'onglet Armure par défaut (sera affiché si armure sélectionnée)
    _setArmureTabVisible(false);
  }

  return {
    init:          init,
    switchTab:     _switchTab,
    switchSubTab:  _switchSubTab,
    currentTab:    function () { return _currentTab; },
    currentSubTab: function () { return _currentSubTab; },
    setArmureTabVisible: _setArmureTabVisible
  };

}());
