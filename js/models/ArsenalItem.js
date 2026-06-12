/* ═══════════════════════════════════════════
   KNIGHT — models/ArsenalItem.js
   Classe de base pour les éléments d'arsenal,
   étendue par Weapon et Module.
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.models = KNIGHT.models || {};

/* ─────────────────────────────────────────
   ArsenalItem — classe de base
───────────────────────────────────────── */
KNIGHT.models.ArsenalItem = function (type) {
  this.type  = type || 'item';
  this.id    = 'item_' + Date.now() + '_' + Math.floor(Math.random() * 9999);
  this.nom   = '';
};

KNIGHT.models.ArsenalItem.prototype = {
  constructor: KNIGHT.models.ArsenalItem,

  serialize: function () {
    return { type: this.type, id: this.id, nom: this.nom };
  },

  deserialize: function (data) {
    if (!data) return;
    this.id  = data.id  || this.id;
    this.nom = data.nom || '';
  }
};

/* ─────────────────────────────────────────
   Weapon — extends ArsenalItem
───────────────────────────────────────── */
KNIGHT.models.Weapon = function () {
  KNIGHT.models.ArsenalItem.call(this, 'weapon');
  this.degats   = '';
  this.violence = '';
  this.portee   = '';
  this.energie  = '';
  this.effets   = '';
};

KNIGHT.models.Weapon.prototype = Object.create(KNIGHT.models.ArsenalItem.prototype);
KNIGHT.models.Weapon.prototype.constructor = KNIGHT.models.Weapon;

KNIGHT.models.Weapon.prototype.serialize = function () {
  var base = KNIGHT.models.ArsenalItem.prototype.serialize.call(this);
  base.degats   = this.degats;
  base.violence = this.violence;
  base.portee   = this.portee;
  base.energie  = this.energie;
  base.effets   = this.effets;
  return base;
};

KNIGHT.models.Weapon.prototype.deserialize = function (data) {
  if (!data) return;
  KNIGHT.models.ArsenalItem.prototype.deserialize.call(this, data);
  this.degats   = data.degats   || '';
  this.violence = data.violence || '';
  this.portee   = data.portee   || '';
  this.energie  = data.energie  || '';
  this.effets   = data.effets   || '';
};

/** Fabrique depuis objet brut */
KNIGHT.models.Weapon.fromData = function (data) {
  var w = new KNIGHT.models.Weapon();
  w.deserialize(data);
  return w;
};

/* ─────────────────────────────────────────
   Module — extends ArsenalItem
───────────────────────────────────────── */
KNIGHT.models.Module = function () {
  KNIGHT.models.ArsenalItem.call(this, 'module');
  this.zone       = '';   // Tête / Tronc / Bras / Jambes
  this.activation = '';
  this.duree      = '';
  this.energie    = '';
  this.effets     = '';
};

KNIGHT.models.Module.prototype = Object.create(KNIGHT.models.ArsenalItem.prototype);
KNIGHT.models.Module.prototype.constructor = KNIGHT.models.Module;

KNIGHT.models.Module.prototype.serialize = function () {
  var base = KNIGHT.models.ArsenalItem.prototype.serialize.call(this);
  base.zone       = this.zone;
  base.activation = this.activation;
  base.duree      = this.duree;
  base.energie    = this.energie;
  base.effets     = this.effets;
  return base;
};

KNIGHT.models.Module.prototype.deserialize = function (data) {
  if (!data) return;
  KNIGHT.models.ArsenalItem.prototype.deserialize.call(this, data);
  this.zone       = data.zone       || '';
  this.activation = data.activation || '';
  this.duree      = data.duree      || '';
  this.energie    = data.energie    || '';
  this.effets     = data.effets     || '';
};

KNIGHT.models.Module.fromData = function (data) {
  var m = new KNIGHT.models.Module();
  m.deserialize(data);
  return m;
};
