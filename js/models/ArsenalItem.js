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
  this.pgCout  = 0;    // coût en Points de Gloire
  this.image   = '';   // base64
  this.contact = { degats: '', violence: '', portee: 'Contact', energie: '', effets: '' };
  this.tir     = { degats: '', violence: '', portee: '',        energie: '', effets: '' };
};

KNIGHT.models.Weapon.prototype = Object.create(KNIGHT.models.ArsenalItem.prototype);
KNIGHT.models.Weapon.prototype.constructor = KNIGHT.models.Weapon;

KNIGHT.models.Weapon.prototype.serialize = function () {
  var base    = KNIGHT.models.ArsenalItem.prototype.serialize.call(this);
  base.pgCout  = this.pgCout;
  base.image   = this.image;
  base.contact = JSON.parse(JSON.stringify(this.contact));
  base.tir     = JSON.parse(JSON.stringify(this.tir));
  return base;
};

KNIGHT.models.Weapon.prototype.deserialize = function (data) {
  if (!data) return;
  KNIGHT.models.ArsenalItem.prototype.deserialize.call(this, data);
  this.pgCout  = data.pgCout  || 0;
  this.image   = data.image   || '';
  // Compat ancienne version (champs plats)
  if (data.contact) {
    this.contact = {
      degats:   data.contact.degats   || '',
      violence: data.contact.violence || '',
      portee:   data.contact.portee   || 'Contact',
      energie:  data.contact.energie  || '',
      effets:   data.contact.effets   || ''
    };
  } else {
    this.contact = {
      degats: data.degats || '', violence: data.violence || '',
      portee: 'Contact',         energie: data.energie  || '',
      effets: data.effets  || ''
    };
  }
  if (data.tir) {
    this.tir = {
      degats:   data.tir.degats   || '',
      violence: data.tir.violence || '',
      portee:   data.tir.portee   || '',
      energie:  data.tir.energie  || '',
      effets:   data.tir.effets   || ''
    };
  } else {
    this.tir = { degats: '', violence: '', portee: '', energie: '', effets: '' };
  }
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
