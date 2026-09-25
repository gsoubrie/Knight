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

// Catalogues par défaut basés sur Knight V1 officiel
KNIGHT.models.Catalog.createDefaultCatalogs = function () {
  return {
    archetypes: new KNIGHT.models.Catalog('Archétypes', [
      'Agent du Nodachi', 'Archétype libre', 'Artiste', 'Célébrité', 'Citoyen',
      'Combattant', 'Force de la nature', 'Génie', 'Habitant des territoires libres',
      'Hors-la-loi', 'Indépendant', 'Leader', 'Membre d\'un service secret',
      'Membre d\'une société secrète', 'Rebut', 'Religieux', 'Survivant', 'Voyageur'
    ]),
    sections: new KNIGHT.models.Catalog('Sections', [
      'Cyclope', 'Dragon', 'Gargoyle', 'Giant', 'Griffon', 'Korrigan', 'Ogre', 'Tarasque'
    ]),
    blasons: new KNIGHT.models.Catalog('Blasons', [
      'L\'aigle', 'L\'ours', 'Le cerf', 'Le cheval', 'Le corbeau', 'Le dragon',
      'Le faucon', 'Le lion', 'Le loup', 'Le sanglier', 'Le serpent', 'Le taureau'
    ]),
    armures: new KNIGHT.models.Catalog('Armures', [
      'Barbarian', 'Bard', 'Druid', 'Monk', 'Paladin', 'Priest', 'Psion',
      'Ranger', 'Rogue', 'Shaman', 'Sorcerer', 'Warlock', 'Warmaster', 'Warrior', 'Wizard'
    ])
  };
};
