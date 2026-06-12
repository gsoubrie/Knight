/* ═══════════════════════════════════════════
   KNIGHT — models/Character.js
   Objet personnage principal.
   Agrège tous les sous-modèles.
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.models = KNIGHT.models || {};

KNIGHT.models.Character = function () {
  // ── Identité ──
  this.nom       = '';
  this.archetype = '';
  this.section   = '';
  this.blason    = '';
  this.voeu      = '';

  // ── Aspects ──
  this.aspects = KNIGHT.models.Aspect.createAll();

  // ── Jauges ──
  this.gauges = {
    ps:  { current: 10, max: 46 },
    pes: { current: 50, max: 50 },
    pa:  { current: 100, max: 100 },
    cdf: { current: 8,  max: 8  },
    pe:  { current: 40, max: 40 }
  };

  // ── Valeurs dérivées ──
  this.derived = {
    defense:    0,
    reaction:   0,
    initiative: 0
  };

  // ── Héroïsme ──
  this.heroisme = 6;

  // ── Points ──
  this.pg = 0;
  this.px = 0;
  this.pgArmure   = 60;
  this.pxDepenses = 0;

  // ── Warrior ──
  this.warrior = {
    nomArmure:      '',
    generation:     '1ère génération',
    capacite:       '',
    paMax:          100,
    peMax:          40,
    cdfMax:         8,
    activeTypes:    [],
    typesNotes:     '',
    slots: {
      tete:   { max: 2, used: 0, notes: '' },
      tronc:  { max: 4, used: 0, notes: '' },
      bras:   { max: 2, used: 0, notes: '' },
      jambes: { max: 2, used: 0, notes: '' }
    }
  };

  // ── Arsenal ──
  this.weapons = [];
  this.modules = [];

  // ── IA ──
  this.ia = {
    modele:      '',
    surnom:      '',
    personnalite: '',
    specialite:  '',
    notes:       ''
  };

  // ── Ledgers ──
  this.ledgerPes = new KNIGHT.models.Ledger('pes', "Points d'Espoir", 50);
  this.ledgerPg  = new KNIGHT.models.Ledger('pg',  'Points de Gloire', 0);

  // ── Divers ──
  this.motivations = [];   // { type: 'major'|'minor', texte: '' }
  this.contacts    = [];   // { nom, niveau, info }
  this.equipement  = '';
  this.histoire    = '';
  this.notes       = '';

  // ── Liste rapide ──
  this.quicklist   = [];   // { id, text, tag, checked }

  // ── Avantages / Inconvénients ──
  this.avantages    = '';
  this.inconvenients = '';
};

KNIGHT.models.Character.prototype = {
  constructor: KNIGHT.models.Character,

  /* ── Helpers ── */

  getAspect: function (id) {
    for (var i = 0; i < this.aspects.length; i++) {
      if (this.aspects[i].id === id) return this.aspects[i];
    }
    return null;
  },

  addWeapon: function () {
    var w = new KNIGHT.models.Weapon();
    this.weapons.push(w);
    return w;
  },

  removeWeapon: function (weaponId) {
    this.weapons = this.weapons.filter(function (w) { return w.id !== weaponId; });
  },

  addModule: function () {
    var m = new KNIGHT.models.Module();
    this.modules.push(m);
    return m;
  },

  removeModule: function (moduleId) {
    this.modules = this.modules.filter(function (m) { return m.id !== moduleId; });
  },

  addMotivation: function (type) {
    this.motivations.push({ type: type, texte: '' });
  },

  removeMotivation: function (index) {
    this.motivations.splice(index, 1);
  },

  addContact: function () {
    this.contacts.push({ nom: '', niveau: 1, info: '' });
  },

  removeContact: function (index) {
    this.contacts.splice(index, 1);
  },

  addQuicklistItem: function (text, tag) {
    this.quicklist.push({
      id:      'ql_' + Date.now() + '_' + Math.floor(Math.random() * 9999),
      text:    text || '',
      tag:     tag  || 'info',
      checked: false
    });
  },

  removeQuicklistItem: function (itemId) {
    this.quicklist = this.quicklist.filter(function (q) { return q.id !== itemId; });
  },

  /* ── Sérialisation ── */

  serialize: function () {
    var data = {
      nom:        this.nom,
      archetype:  this.archetype,
      section:    this.section,
      blason:     this.blason,
      voeu:       this.voeu,
      aspects:    this.aspects.map(function (a) { return a.serialize(); }),
      gauges:     JSON.parse(JSON.stringify(this.gauges)),
      derived:    JSON.parse(JSON.stringify(this.derived)),
      heroisme:   this.heroisme,
      pg:         this.pg,
      px:         this.px,
      pgArmure:   this.pgArmure,
      pxDepenses: this.pxDepenses,
      warrior:    JSON.parse(JSON.stringify(this.warrior)),
      weapons:    this.weapons.map(function (w) { return w.serialize(); }),
      modules:    this.modules.map(function (m) { return m.serialize(); }),
      ia:         JSON.parse(JSON.stringify(this.ia)),
      ledgerPes:  this.ledgerPes.serialize(),
      ledgerPg:   this.ledgerPg.serialize(),
      motivations:  JSON.parse(JSON.stringify(this.motivations)),
      contacts:     JSON.parse(JSON.stringify(this.contacts)),
      equipement:   this.equipement,
      histoire:     this.histoire,
      notes:        this.notes,
      quicklist:    JSON.parse(JSON.stringify(this.quicklist)),
      avantages:    this.avantages,
      inconvenients: this.inconvenients
    };
    return data;
  },

  deserialize: function (data) {
    if (!data) return;
    var self = this;

    // Scalaires
    var scalaires = ['nom','archetype','section','blason','voeu',
                     'heroisme','pg','px','pgArmure','pxDepenses',
                     'equipement','histoire','notes','avantages','inconvenients'];
    scalaires.forEach(function (k) {
      if (data[k] !== undefined) self[k] = data[k];
    });

    // Aspects
    if (data.aspects) {
      data.aspects.forEach(function (saved) {
        var aspect = self.getAspect(saved.id);
        if (aspect) aspect.deserialize(saved);
      });
    }

    // Gauges
    if (data.gauges) {
      Object.keys(data.gauges).forEach(function (k) {
        if (self.gauges[k]) {
          self.gauges[k].current = data.gauges[k].current;
          self.gauges[k].max     = data.gauges[k].max;
        }
      });
    }

    // Derived
    if (data.derived) {
      Object.keys(data.derived).forEach(function (k) {
        if (self.derived[k] !== undefined) self.derived[k] = data.derived[k];
      });
    }

    // Warrior
    if (data.warrior) {
      Object.keys(data.warrior).forEach(function (k) {
        if (self.warrior[k] !== undefined) self.warrior[k] = data.warrior[k];
      });
    }

    // Arsenal
    if (data.weapons) {
      self.weapons = data.weapons.map(function (w) { return KNIGHT.models.Weapon.fromData(w); });
    }
    if (data.modules) {
      self.modules = data.modules.map(function (m) { return KNIGHT.models.Module.fromData(m); });
    }

    // IA
    if (data.ia) {
      Object.keys(data.ia).forEach(function (k) {
        if (self.ia[k] !== undefined) self.ia[k] = data.ia[k];
      });
    }

    // Ledgers
    if (data.ledgerPes) self.ledgerPes.deserialize(data.ledgerPes);
    if (data.ledgerPg)  self.ledgerPg.deserialize(data.ledgerPg);

    // Tableaux
    if (data.motivations) self.motivations = data.motivations.slice();
    if (data.contacts)    self.contacts    = data.contacts.slice();
    if (data.quicklist)   self.quicklist   = data.quicklist.slice();
  }
};
