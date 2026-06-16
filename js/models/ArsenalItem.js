/* ═══════════════════════════════════════════
   KNIGHT — models/ArsenalItem.js
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.models = KNIGHT.models || {};

/* ── ArsenalItem base ── */
KNIGHT.models.ArsenalItem = function (type) {
  this.type  = type || 'item';
  this.id    = 'item_' + Date.now() + '_' + Math.floor(Math.random() * 9999);
  this.nom   = '';
  this.image = '';   // base64 dataURL
};

KNIGHT.models.ArsenalItem.prototype = {
  constructor: KNIGHT.models.ArsenalItem,

  serialize: function () {
    return { type: this.type, id: this.id, nom: this.nom, image: this.image };
  },

  deserialize: function (data) {
    if (!data) return;
    this.id    = data.id    || this.id;
    this.nom   = data.nom   || '';
    this.image = data.image || '';
  }
};

/* ── Weapon ── */
KNIGHT.models.Weapon = function () {
  KNIGHT.models.ArsenalItem.call(this, 'weapon');
  this.degats   = '';
  this.violence = '';
  this.portee   = '';
  this.energie  = '';
  this.effets   = '';
  this.image    = '';   // base64
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
  base.image    = this.image;
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
  this.image    = data.image    || '';
};

KNIGHT.models.Weapon.fromData = function (data) {
  var w = new KNIGHT.models.Weapon();
  w.deserialize(data);
  return w;
};

/* ── Module ── */
KNIGHT.models.Module = function () {
  KNIGHT.models.ArsenalItem.call(this, 'module');
  this.zone       = '';   // 'tete' | 'torse' | 'bras-g' | 'bras-d' | 'jambe-g' | 'jambe-d'
  this.slotCost   = 1;   // nombre de slots consommés
  this.activation = '';
  this.duree      = '';
  this.energie    = '';
  this.effets     = '';
  this.image      = '';  // base64
};

KNIGHT.models.Module.prototype = Object.create(KNIGHT.models.ArsenalItem.prototype);
KNIGHT.models.Module.prototype.constructor = KNIGHT.models.Module;

KNIGHT.models.Module.prototype.serialize = function () {
  var base = KNIGHT.models.ArsenalItem.prototype.serialize.call(this);
  base.zone       = this.zone;
  base.slotCost   = this.slotCost;
  base.activation = this.activation;
  base.duree      = this.duree;
  base.energie    = this.energie;
  base.effets     = this.effets;
  base.image      = this.image;
  return base;
};

KNIGHT.models.Module.prototype.deserialize = function (data) {
  if (!data) return;
  KNIGHT.models.ArsenalItem.prototype.deserialize.call(this, data);
  this.zone       = data.zone       || '';
  this.slotCost   = data.slotCost   !== undefined ? data.slotCost : 1;
  this.activation = data.activation || '';
  this.duree      = data.duree      || '';
  this.energie    = data.energie    || '';
  this.effets     = data.effets     || '';
  this.image      = data.image      || '';
};

KNIGHT.models.Module.fromData = function (data) {
  var m = new KNIGHT.models.Module();
  m.deserialize(data);
  return m;
};
