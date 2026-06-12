/* ═══════════════════════════════════════════
   KNIGHT — models/Ledger.js
   Journal de dépenses/gains pour PES et PG.
   Chaque entrée : { id, date, desc, amount }
   amount > 0 = gain, amount < 0 = dépense
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.models = KNIGHT.models || {};

/**
 * @constructor
 * @param {string} id    - 'pes' ou 'pg'
 * @param {string} label - libellé affiché
 * @param {number} base  - valeur de départ
 */
KNIGHT.models.Ledger = function (id, label, base) {
  this.id      = id;
  this.label   = label;
  this.base    = base || 0;   // valeur initiale (avant toutes entrées)
  this.entries = [];
};

KNIGHT.models.Ledger.prototype = {
  constructor: KNIGHT.models.Ledger,

  /** Ajoute une entrée */
  add: function (desc, amount) {
    this.entries.push({
      id:     'e_' + Date.now() + '_' + Math.floor(Math.random() * 9999),
      date:   new Date().toLocaleDateString('fr-FR'),
      desc:   desc   || '',
      amount: amount || 0
    });
  },

  /** Supprime une entrée par id */
  remove: function (entryId) {
    this.entries = this.entries.filter(function (e) {
      return e.id !== entryId;
    });
  },

  /** Total des gains */
  totalGains: function () {
    return this.entries.reduce(function (acc, e) {
      return acc + (e.amount > 0 ? e.amount : 0);
    }, 0);
  },

  /** Total des dépenses (valeur positive) */
  totalDepenses: function () {
    return this.entries.reduce(function (acc, e) {
      return acc + (e.amount < 0 ? Math.abs(e.amount) : 0);
    }, 0);
  },

  /** Solde courant = base + somme de toutes les entrées */
  solde: function () {
    var sum = this.entries.reduce(function (acc, e) {
      return acc + e.amount;
    }, 0);
    return this.base + sum;
  },

  /** Entrées triées du plus récent au plus ancien */
  sorted: function () {
    return this.entries.slice().reverse();
  },

  serialize: function () {
    return {
      id:      this.id,
      label:   this.label,
      base:    this.base,
      entries: this.entries.slice()
    };
  },

  deserialize: function (data) {
    if (!data) return;
    this.base    = data.base    !== undefined ? data.base : this.base;
    this.entries = data.entries ? data.entries.slice() : [];
  }
};
