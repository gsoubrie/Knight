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

  // Caractéristiques : tableau de 3 objets { name, score, od, nv }
  // caraNames peut être un tableau de strings OU d'objets { name, niveaux }
  this.caras = caraNames.map(function (item) {
    var name = (typeof item === 'string') ? item : item.name;
    return {
      name:  name,
      score: 1,
      od:    0,
      nv:    [false, false, false, false, false]  // NV1→NV5 cochés
    };
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
        return { name: c.name, score: c.score, od: c.od, nv: c.nv.slice() };
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
          self.caras[i].nv    = saved.nv    || [false, false, false, false, false];
        }
      });
    }
  }
};

/**
 * Définitions des 5 aspects — 1ère édition Knight
 * Chaque cara a 5 niveaux avec effets à cocher.
 */
KNIGHT.models.Aspect.DEFINITIONS = [
  {
    id: 'chair', label: 'Chair',
    caras: [
      { name: 'Déplacement', niveaux: [
        'Dépl. portée courte gratuit',
        'Ignore petits obstacles',
        'Dépl. portée moyenne gratuit',
        'Ignore grands obstacles',
        'Ignore dgts chute <50m'
      ]},
      { name: 'Force', niveaux: [
        '+3 dégâts / 500kg',
        '+6 dégâts / 2t',
        '+9 dégâts / 10t',
        '+12 dégâts / 30t',
        '+15 dégâts / 80t'
      ]},
      { name: 'Endurance', niveaux: [
        'Ignore choc 1',
        '—',
        '+6 PS',
        'Ignore choc 2',
        'Endu au débordement'
      ]}
    ]
  },
  {
    id: 'bete', label: 'Bête',
    caras: [
      { name: 'Hargne', niveaux: [
        '—',
        '—',
        'Agit quand même à 0 PS',
        'Pas de blessure grave à 0 PS',
        'Ignore capacité Anathème'
      ]},
      { name: 'Combat', niveaux: [
        '—',
        'Au contact, +2 réaction',
        'Akimbo, 1 seul de malus',
        'Ambidexte, 1 seul de malus',
        'Bande aussi touchée'
      ]},
      { name: 'Instinct', niveaux: [
        '—',
        'Lance 2 fois initiative',
        '+3 à initiative',
        'Ignore attaque surprise',
        'Ignore embuscade'
      ]}
    ]
  },
  {
    id: 'machine', label: 'Machine',
    caras: [
      { name: 'Tir', niveaux: [
        '—',
        'Ignore 1er malus de portée',
        'Akimbo, 1 seul de malus',
        'Ambidexte, 1 seul de malus',
        'Bande aussi touchée'
      ]},
      { name: 'Savoir', niveaux: [
        'Accès base d\'infos',
        'Accès aux infos locales',
        '+1D6 aux soins donnés',
        'Accès toutes bases de données',
        'Ignore échec critique'
      ]},
      { name: 'Technique', niveaux: [
        'Connexion machine au contact',
        'Connaît toutes machines ?',
        'Connexion à portée lointaine',
        'Réparation d\'urgence : 6 PA',
        'Programmes instantanés'
      ]}
    ]
  },
  {
    id: 'dame', label: 'Dame',
    caras: [
      { name: 'Aura', niveaux: [
        '—',
        'Ciblé en dernier par humains',
        'Crée 2 nouveaux contacts',
        'Attire l\'attention 1 tour',
        'Ajoute Aura à la défense'
      ]},
      { name: 'Parole', niveaux: [
        'Parler maintient en vie',
        '+1D6 PES 1 fois par allié',
        'Imite voix déjà entendue',
        'Hypnotise les humains',
        '+2D6 PES 1 fois par allié'
      ]},
      { name: 'Sang-Froid', niveaux: [
        '—',
        'Ignore malus lié au stress',
        'Relance test d\'espoir raté',
        'Ignore capacité peur',
        'Ignore capacité domination'
      ]}
    ]
  },
  {
    id: 'masque', label: 'Masque',
    caras: [
      { name: 'Discrétion', niveaux: [
        '—',
        '+Discr aux dgts sans OD',
        'Marche en silence',
        'Invisible si immobile',
        '+Discr aux dgts avec OD'
      ]},
      { name: 'Dextérité', niveaux: [
        '—',
        '—',
        'Jamais désarmé',
        'Ignore lourd',
        'Réaction = score défense'
      ]},
      { name: 'Perception', niveaux: [
        'Zoom ×400',
        'Zoom audio',
        'Zoom olfactif',
        'Infos précises via RA',
        'Sonar'
      ]}
    ]
  }
];

/** Fabrique : crée les 5 aspects par défaut */
KNIGHT.models.Aspect.createAll = function () {
  return KNIGHT.models.Aspect.DEFINITIONS.map(function (def) {
    return new KNIGHT.models.Aspect(def.id, def.label, def.caras);
  });
};

/**
 * Récupère les niveaux d'une cara par id d'aspect et index de cara
 */
KNIGHT.models.Aspect.getNiveaux = function (aspectId, caraIndex) {
  for (var i = 0; i < KNIGHT.models.Aspect.DEFINITIONS.length; i++) {
    var def = KNIGHT.models.Aspect.DEFINITIONS[i];
    if (def.id === aspectId && def.caras[caraIndex]) {
      return def.caras[caraIndex].niveaux || [];
    }
  }
  return [];
};
