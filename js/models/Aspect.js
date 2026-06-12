/* ═══════════════════════════════════════════
   KNIGHT — models/Aspect.js
   Représente un aspect (Chair, Bête, etc.)
   et ses 3 caractéristiques avec overdrives.
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.models = KNIGHT.models || {};

/**
 * @constructor
 * @param {string} id       - identifiant unique ('chair', 'bete', etc.)
 * @param {string} label    - nom affiché ('Chair', 'Bête', etc.)
 * @param {Array}  caraNames - noms des 3 caractéristiques
 */
KNIGHT.models.Aspect = function (id, label, caraNames) {
  this.id    = id;
  this.label = label;
  this.score = 2;           // score de l'aspect

  // Caractéristiques : tableau de 3 objets { name, score, od }
  this.caras = caraNames.map(function (name) {
    return { name: name, score: 1, od: 0 };
  });
};

KNIGHT.models.Aspect.prototype = {
  constructor: KNIGHT.models.Aspect,

  /** Score total d'une cara (score + od) */
  caraTotal: function (index) {
    var c = this.caras[index];
    return (c.score || 0) + (c.od || 0);
  },

  /** Plus haute caractéristique (score seul, sans OD) — pour PS/PES */
  highestCaraScore: function () {
    var max = 0;
    this.caras.forEach(function (c) {
      if (c.score > max) max = c.score;
    });
    return max;
  },

  /** Plus haute caractéristique (score + OD) — pour défense/réaction/initiative */
  highestCaraTotal: function () {
    var max = 0;
    this.caras.forEach(function (c) {
      var t = (c.score || 0) + (c.od || 0);
      if (t > max) max = t;
    });
    return max;
  },

  /** Sérialisation vers objet plat */
  serialize: function () {
    return {
      id:    this.id,
      score: this.score,
      caras: this.caras.map(function (c) {
        return { name: c.name, score: c.score, od: c.od };
      })
    };
  },

  /** Chargement depuis objet plat */
  deserialize: function (data) {
    if (!data) return;
    this.score = data.score || 2;
    if (data.caras) {
      var self = this;
      data.caras.forEach(function (saved, i) {
        if (self.caras[i]) {
          self.caras[i].score = saved.score || 1;
          self.caras[i].od    = saved.od    || 0;
        }
      });
    }
  }
};

/** Définitions des 5 aspects du jeu */
KNIGHT.models.Aspect.DEFINITIONS = [
  { id: 'chair',   label: 'Chair',   caras: ['Force', 'Endurance', 'Déplacement'] },
  { id: 'bete',    label: 'Bête',    caras: ['Combat', 'Instinct', 'Tir']         },
  { id: 'machine', label: 'Machine', caras: ['Pilotage', 'Discrétion', 'Technique'] },
  { id: 'dame',    label: 'Dame',    caras: ['Persuasion', 'Empathie', 'Éloquence'] },
  { id: 'masque',  label: 'Masque',  caras: ['Tromperie', 'Intimidation', 'Sang-froid'] }
];

/** Fabrique : crée les 5 aspects par défaut */
KNIGHT.models.Aspect.createAll = function () {
  return KNIGHT.models.Aspect.DEFINITIONS.map(function (def) {
    return new KNIGHT.models.Aspect(def.id, def.label, def.caras);
  });
};
