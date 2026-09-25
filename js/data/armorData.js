/* ═══════════════════════════════════════════
   KNIGHT — data/armorData.js
   Données des armures officielles Knight V1
   Basé sur https://knight-jdr-systeme.fr/fr/armour/
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.data = KNIGHT.data || {};

KNIGHT.data.armorData = {
  // Livre de Base
  'Barbarian': {
    nom: 'Barbarian',
    capacites: 'Mode Goliath',
    paMax: 60,
    peMax: 60,
    cdfMax: 12,
    slots: { tete: 5, torse: 5, 'bras-g': 5, 'bras-d': 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Force', 'Endurance', 'Hargne', 'Combat'],
    source: 'Livre de Base'
  },
  'Bard': {
    nom: 'Bard',
    capacites: 'Mode Changeling',
    paMax: 40,
    peMax: 80,
    cdfMax: 12,
    slots: { tete: 5, torse: 5, 'bras-g': 5, 'bras-d': 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Déplacement', 'Aura', 'Parole', 'Dextérité'],
    source: 'Livre de Base'
  },
  'Paladin': {
    nom: 'Paladin',
    capacites: 'Champ de Force Shrine, Mode Watchtower',
    paMax: 120,
    peMax: 20,
    cdfMax: 8,
    slots: { tete: 7, torse: 7, 'bras-g': 7, 'bras-d': 10, 'jambe-g': 7, 'jambe-d': 7 },
    overdrives: ['Force', 'Endurance', 'Tir', 'Perception'],
    source: 'Livre de Base'
  },
  'Priest': {
    nom: 'Priest',
    capacites: 'Mode nanoC, Mode Mechanic',
    paMax: 70,
    peMax: 60,
    cdfMax: 10,
    slots: { tete: 5, torse: 5, 'bras-g': 5, 'bras-d': 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Force', 'Endurance', 'Savoir', 'Technique'],
    source: 'Livre de Base'
  },
  'Ranger': {
    nom: 'Ranger',
    capacites: 'Vision, Fusil de précision polymorphe polycalibre Longbow',
    paMax: 50,
    peMax: 70,
    cdfMax: 12,
    slots: { tete: 4, torse: 4, 'bras-g': 4, 'bras-d': 6, 'jambe-g': 4, 'jambe-d': 4 },
    overdrives: ['Déplacement', 'Tir', 'Discrétion', 'Dextérité'],
    source: 'Livre de Base'
  },
  'Rogue': {
    nom: 'Rogue',
    capacites: 'Mode Ghost',
    paMax: 50,
    peMax: 70,
    cdfMax: 12,
    slots: { tete: 5, torse: 5, 'bras-g': 5, 'bras-d': 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Déplacement', 'Combat', 'Discrétion', 'Dextérité'],
    source: 'Livre de Base'
  },
  'Warmaster': {
    nom: 'Warmaster',
    capacites: 'Mode Warlord, Mode Falcon',
    paMax: 90,
    peMax: 50,
    cdfMax: 8,
    slots: { tete: 5, torse: 5, 'bras-g': 5, 'bras-d': 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Force', 'Endurance', 'Aura', 'Sang-froid'],
    source: 'Livre de Base'
  },
  'Warrior': {
    nom: 'Warrior',
    capacites: 'Type',
    paMax: 100,
    peMax: 40,
    cdfMax: 8,
    slots: { tete: 7, torse: 10, 'bras-g': 10, 'bras-d': 12, 'jambe-g': 7, 'jambe-d': 7 },
    overdrives: ['Déplacement', 'Combat', 'Tir', 'Dextérité'],
    source: 'Livre de Base'
  },
  'Wizard': {
    nom: 'Wizard',
    capacites: 'Mode Borealis, Mode Oriflamme',
    paMax: 40,
    peMax: 80,
    cdfMax: 14,
    slots: { tete: 5, torse: 5, 'bras-g': 5, 'bras-d': 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Combat', 'Instinct', 'Aura', 'Sang-froid'],
    source: 'Livre de Base'
  },
  
  // Supplément 2038
  'Monk': {
    nom: 'Monk',
    capacites: 'Mode Céa, Mode Zen',
    paMax: 60,
    peMax: 50,
    cdfMax: 14,
    slots: { tete: 7, torse: 8, 'bras-g': 8, 'bras-d': 10, 'jambe-g': 6, 'jambe-d': 6 },
    overdrives: ['Combat', 'Tir', 'Hargne', 'Sang-froid'],
    source: 'Supplément 2038'
  },
  'Psion': {
    nom: 'Psion',
    capacites: 'Mode Puppet Master, Mode Discord, Mode Windtalker',
    paMax: 50,
    peMax: 60,
    cdfMax: 14,
    slots: { tete: 7, torse: 10, 'bras-g': 10, 'bras-d': 12, 'jambe-g': 7, 'jambe-d': 7 },
    overdrives: ['Instinct', 'Savoir', 'Perception', 'Sang-froid'],
    source: 'Supplément 2038'
  },
  'Sorcerer': {
    nom: 'Sorcerer',
    capacites: 'Mode Morph',
    paMax: 60,
    peMax: 80,
    cdfMax: 14,
    slots: { tete: 7, torse: 8, 'bras-g': 8, 'bras-d': 10, 'jambe-g': 6, 'jambe-d': 6 },
    overdrives: ['Instinct', 'Dextérité', 'Endurance', 'Sang-froid'],
    source: 'Supplément 2038'
  },
  
  // Codex v1.5
  'Druid': {
    nom: 'Druid',
    capacites: 'Mode Companion',
    paMax: 50,
    peMax: 80,
    cdfMax: 12,
    slots: { tete: 5, torse: 5, 'bras-g': 5, 'bras-d': 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Combat', 'Instinct', 'Tir', 'Technique'],
    source: 'Codex v1.5'
  },
  
  // Atlas
  'Shaman': {
    nom: 'Shaman',
    capacites: 'Mode Totem, Mode Ascension, Imprégnation',
    paMax: 60,
    peMax: 80,
    cdfMax: 10,
    slots: { tete: 5, torse: 5, 'bras-g': 5, 'bras-d': 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Savoir', 'Technique', 'Sang-froid', 'Hargne'],
    source: 'Atlas'
  },
  'Warlock': {
    nom: 'Warlock',
    capacites: 'Mode Forward, Mode Record, Mode Rewind, Contrecoups',
    paMax: 60,
    peMax: 60,
    cdfMax: 8,
    slots: { tete: 5, torse: 8, 'bras-g': 8, 'bras-d': 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Combat', 'Déplacement', 'Dextérité', 'Instinct'],
    source: 'Atlas'
  }
};

// Fonction pour appliquer les données d'une armure au personnage
KNIGHT.data.armorData.applyToCharacter = function(char, armorName) {
  var armor = this[armorName];
  if (!armor) return false;
  
  // Mettre à jour le nom de l'armure
  char.warrior.nomArmure = armor.nom;
  
  // Mettre à jour les stats
  char.warrior.paMax = armor.paMax;
  char.warrior.peMax = armor.peMax;
  char.warrior.cdfMax = armor.cdfMax;
  
  // Mettre à jour les slots max
  if (armor.slots) {
    char.warrior.slots.tete.max = armor.slots.tete;
    char.warrior.slots.torse.max = armor.slots.torse;
    char.warrior.slots['bras-g'].max = armor.slots['bras-g'];
    char.warrior.slots['bras-d'].max = armor.slots['bras-d'];
    char.warrior.slots['jambe-g'].max = armor.slots['jambe-g'];
    char.warrior.slots['jambe-d'].max = armor.slots['jambe-d'];
  }
  
  // Mettre à jour les capacités
  char.warrior.capacite = armor.capacites;
  
  // Mettre à jour les overdrives
  char.warrior.activeTypes = armor.overdrives ? armor.overdrives.slice() : [];
  
  // Mettre à jour pgArmure (Points de Gloire de l'armure)
  // Note: pgArmure semble être un champ séparé, on peut le mettre à jour si besoin
  // char.pgArmure = ... (à définir selon les règles)
  
  return true;
};
