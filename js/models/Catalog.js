/* ═══════════════════════════════════════════
   KNIGHT — models/Catalog.js
   Gestion des catalogues (listes de référence) pour Archétypes, Sections, Blasons, Armures.
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.models = KNIGHT.models || {};

KNIGHT.models.Catalog = function (name, defaultItems) {
  this.name = name;
  this.items = defaultItems || [];
};

KNIGHT.models.Catalog.prototype = {
  constructor: KNIGHT.models.Catalog,

  addItem: function (label) {
    if (!label || label.trim() === '') return false;
    label = label.trim();
    // Éviter les doublons
    if (this.items.indexOf(label) >= 0) return false;
    this.items.push(label);
    return true;
  },

  removeItem: function (label) {
    var index = this.items.indexOf(label);
    if (index >= 0) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  },

  serialize: function () {
    return {
      name: this.name,
      items: this.items.slice()
    };
  },

  deserialize: function (data) {
    if (!data) return;
    this.name = data.name || this.name;
    this.items = data.items || this.items.slice();
  }
};

// Catalogues par défaut
KNIGHT.models.Catalog.createDefaultCatalogs = function () {
  return {
    archetypes: new KNIGHT.models.Catalog('Archétypes', [
      'Soldat', 'Rebut', 'Citoyen', 'Noble', 'Clerc', 'Technicien', 'Pilote', 'Éclaireur'
    ]),
    sections: new KNIGHT.models.Catalog('Sections', [
      'Table Ronde', 'Gardiens', 'Croisés', 'Vanguarde', 'Ombre', 'Logistique'
    ]),
    blasons: new KNIGHT.models.Catalog('Blasons', [
      'Lion', 'Aigle', 'Dragon', 'Épée', 'Bouclier', 'Rose', 'Loup', 'Fleur de Lys', 'Griffon', 'Phénix'
    ]),
    armures: new KNIGHT.models.Catalog('Armures', [
      'Fenrir', 'Durandal', 'Excalibur', 'Joyeuse', 'Hauteclaire', 'Cortana',
      'Morglay', 'Flamberge', 'Haudegonde', 'Balise'
    ])
  };
};
