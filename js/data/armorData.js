/* ======================================================================
   KNIGHT — data/armorData.js
   Donnees completes des armures officielles Knight V1
   Avec descriptions detaillees des capacites depuis knight-jdr-systeme.fr
   ====================================================================== */

'use strict';

var KNIGHT = KNIGHT || {};
KNIGHT.data = KNIGHT.data || {};

KNIGHT.data.armorData = {

  // ======================================================================
  // LIVRE DE BASE
  // ======================================================================

  'Barbarian': {
    nom: 'Barbarian',
    generation: '2',
    capacites: 'Mode Goliath',
    paMax: 60, peMax: 60, cdfMax: 12,
    slots: { tete: 5, 'bras-g': 5, 'bras-d': 5, torse: 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Force', 'Endurance', 'Hargne', 'Combat'],
    source: 'Livre de Base',
    description: 'Derniere-nee de l\'esprit de Merlin, la meta-armure Barbarian est un monstre de combat. Grace aux nanomachines, elle peut augmenter sa taille et sa densite musculaire.',
    descriptionCapacites: {
      'Mode Goliath': {
        description: 'La meta-armure peut augmenter sa masse musculaire et sa taille jusqu\'a 6 metres.',
        effet: '+1 metre par 2 PE depenses (max 6m). Par metre: +1 reussite Force/Endurance, +1D6 degats/violence au contact, +1 CdF. Defense -1, Reaction -2 par metre. A 6m+, attaques anti-vehicule.',
        energie: '2 PE par metre',
        activation: 'Action de deplacement',
        duree: '1 minute'
      }
    }
  },

  'Bard': {
    nom: 'Bard',
    generation: '2',
    capacites: 'Mode Changeling',
    paMax: 40, peMax: 80, cdfMax: 12,
    slots: { tete: 5, 'bras-g': 5, 'bras-d': 5, torse: 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Deplacement', 'Aura', 'Parole', 'Dexterite'],
    source: 'Livre de Base',
    description: 'Armure d\'infiltration avec nanomachines pour changer d\'apparence. Modulateur de voix et diffuseur de pheromones.',
    descriptionCapacites: {
      'Mode Changeling': {
        description: 'Transforme la meta-armure en n\'importe quelle creature/personne/objet.',
        effet: 'Transformation personnelle (6 PE) ou etendue (8 PE). Creation de faux-etres (3 PE chacun, max 4). Test pour percer: Machine DF6 ou Perception DF3.',
        energie: '6/8/3 PE',
        activation: '1 tour',
        duree: 'Scene/phase/heure'
      }
    }
  },

  'Paladin': {
    nom: 'Paladin',
    generation: '1',
    capacites: 'Champ de Force Shrine, Mode Watchtower',
    paMax: 120, peMax: 20, cdfMax: 8,
    slots: { tete: 7, 'bras-g': 7, 'bras-d': 7, torse: 10, 'jambe-g': 7, 'jambe-d': 7 },
    overdrives: ['Force', 'Endurance', 'Tir', 'Perception'],
    source: 'Livre de Base',
    description: 'Armure enorme, 2x plus grosse qu\'une Warrior. Generateur de champ de force. Lente et lourde.',
    note: 'LENTE ET LOURDE: Ne peut pas utiliser module de course/deplacement silencieux/saut. Tests Discretion/Deplacement +1 niveau de difficulte.',
    descriptionCapacites: {
      'Champ de Force Shrine': {
        description: 'Dome bleu de 6m de diametre. +6 CdF a l\'interieur.',
        effet: 'Ennemis doivent avoir Force 5 ou Chair 10 pour entrer. Alliees/munitions peuvent sortir. Plusieurs Shrine ne se chevauchent pas.',
        energie: '1 PE (2 PE a distance)',
        activation: 'Aucune',
        duree: '1 tour'
      },
      'Mode Watchtower': {
        description: 'Modules de stabilisation sur les jambes pour tirer plus rapidement.',
        effet: 'Ne peut plus se deplacer. Reaction /2. +1 action de combat (tir seulement) des le tour suivant. Chaque tir supplementaire coute 1 PE.',
        energie: '2 PE (+1 PE par tir)',
        activation: 'Action de deplacement',
        duree: 'Jusqu\'a desactivation'
      }
    }
  },

  'Priest': {
    nom: 'Priest',
    generation: '1',
    capacites: 'Mode nanoC, Mode Mechanic',
    paMax: 70, peMax: 60, cdfMax: 10,
    slots: { tete: 5, 'bras-g': 5, 'bras-d': 5, torse: 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Force', 'Endurance', 'Savoir', 'Technique'],
    source: 'Livre de Base',
    description: 'Armure axee sur la reparation et le soutien technique. Seule avec Wizard a posseder le reacteur Infinity.',
    descriptionCapacites: {
      'Mode nanoC': {
        description: 'Creation de formes geometriques, objets detailles ou objets mechaniques/electroniques en nanomachines.',
        effet: 'Forme simple (3m3 max) avec test Technique (difficulte MJ). Objet detaille (2m3 max). Objet mecanique (1m3 max). Duree 1 minute (10 tours), +2 PE/minute supplementaire.',
        energie: '3 PE (forme base) / 6 PE (objet detaille) / 9 PE (objet mecanique)',
        activation: 'Action de deplacement, action de combat ou 1 tour',
        duree: '1 minute ou 10 tours en phase de conflit'
      },
      'Mode Mechanic': {
        description: 'Reparation par diffusion de nanoC au contact ou a distance.',
        variants: {
          'Contact': {
            description: 'Reparation au contact avec outils du dos.',
            effet: 'Recupere 3D6+6 PA sur equipement/vehicule/meta-armure.',
            energie: '4 PE',
            activation: 'Action de deplacement',
            duree: 'Instantee'
          },
          'Distance': {
            description: 'Reparation a portee longue maximum.',
            effet: 'Recupere 2D6+6 PA sur equipement/vehicule/meta-armure allie.',
            energie: '6 PE',
            activation: 'Action de deplacement',
            duree: 'Instantee'
          }
        }
      }
    },
    evolutions: {
      '150': 'Les creations nanoC durent 1h (+2 PE/heure supplementaire).',
      '200': 'Mode Mechanic: +1D6+6 aux reparations (toutes distances).',
      '250': 'Mode nanoC peut creer vehicules: moto steed, stalion, maraudeur II ou vector leger (9 PE, 1h, contact requis).'
    }
  },

  'Ranger': {
    nom: 'Ranger',
    generation: '1',
    capacites: 'Vision, Fusil de precision polymorphe polycalibre Longbow',
    paMax: 50, peMax: 70, cdfMax: 12,
    slots: { tete: 4, 'bras-g': 4, 'bras-d': 4, torse: 6, 'jambe-g': 4, 'jambe-d': 4 },
    overdrives: ['Deplacement', 'Tir', 'Discretion', 'Dexterite'],
    source: 'Livre de Base',
    description: 'Armure legere specialisee dans le reprage et le tir de precision. Blindage reduit a 3cm.',
    note: 'Fusil Longbow compte dans limite des armes du rack. Peut recevoir 2 ameliorations max (comme armes lourdes). Peut etre foldable.',
    descriptionCapacites: {
      'Vision': {
        description: 'Permet de voir des choses normalement invisibles (gaz, vent, maladies, respiration, creatures microscopiques, ondes radio, Anatheme, pensees, etc.).',
        effet: 'Test base Perception (difficulte 2-9 au choix MJ). Peut detecter creatures invisibles ou Rogue en mode Ghost.',
        energie: '5 a 10 PE',
        activation: 'Action de deplacement en phase de conflit ou 6 secondes hors conflit',
        duree: '6 secondes'
      },
      'Fusil de precision polymorphe polycalibre Longbow': {
        description: 'Fusil anti-materiel modifiable en taille et calibre. Canaux a plasma et reacteur Infinity integres.',
        effet: 'Choix des degats/violence par tir. Jusqu\'a 3 effets distincts par liste par tir. Max 6D6 degats (3D6+1D6-6D6) et 7D6 violence (1D6+1D6-6D6) en base. 9D6 degats max avec 150 PG, 14D6 avec 250 PG.',
        energie: 'Variable selon effets',
        activation: 'Aucune pour changement',
        duree: 'Par tir',
        note: 'Le Longbow peut etre foldable. Ne peut pas avoir plus de 2 ameliorations. Changement de calibre gratuit entre chaque tir.'
      }
    }
  },

  'Rogue': {
    nom: 'Rogue',
    generation: '2',
    capacites: 'Mode Ghost',
    paMax: 50, peMax: 70, cdfMax: 12,
    slots: { tete: 5, 'bras-g': 5, 'bras-d': 5, torse: 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Deplacement', 'Combat', 'Discretion', 'Dexterite'],
    source: 'Livre de Base',
    description: 'Armure furtive specialisee dans l\'infiltration et l\'assassinat. Module Ghost pour invisibilite.',
    note: 'Reducteurs de son sur articulations, gants et bottes. Sensible aux mouvements brusques et lumieres intenses.',
    descriptionCapacites: {
      'Mode Ghost': {
        description: 'Invisibilite totale a l\'oeil nu et reduction sonore extreme.',
        effet: 'Invisible sauf pour aspect Machine exceptionnelle majeure. +3 reussites automatiques aux tests de discretion. PNJ avec vision alternative ou ouie surdeveloppee: +3 Machine ou +2 reussites pour detection. Desactivee par attaque de combat/tir (sauf armes silencieuses ou combat sans effet lumiere). Bonus de Discretion (overdrives inclus) a l\'attaque silencieuse (1ere attaque/tour). A 250 PG: maintient invisibilite pour 3 PE/attaque.',
        energie: '2 PE (1 tour conflit) / 6 PE (1 minute hors conflit)',
        activation: 'Aucune',
        duree: '1 tour ou 1 minute',
        note: 'Ne peut pas desactiver et reactiver le meme tour. Armes en main deviennent invisibles (sauf effet lumiere).'
      }
    },
    evolutions: {
      '150': 'Mode Ghost dure 6 tours (conflit) ou 15 min (hors conflit) pour 6 PE.',
      '200': 'Seuls aspect Machine exceptionnelle majeure peuvent detecter. +3 reussites automatiques contre eux.',
      '250': 'Mode Ghost ne se desactive pas lors des attaques. 3 PE/attaque pour rester invisible.'
    }
  },

  'Warmaster': {
    nom: 'Warmaster',
    generation: '1',
    capacites: 'Mode Warlord, Mode Falcon',
    paMax: 90, peMax: 50, cdfMax: 8,
    slots: { tete: 5, 'bras-g': 5, 'bras-d': 5, torse: 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Force', 'Endurance', 'Aura', 'Sang-froid'],
    source: 'Livre de Base',
    description: 'Armure de commandement pour les senechaux. Systemes RA et IA Sword-Bearer pour gestion tactique.',
    descriptionCapacites: {
      'Mode Warlord': {
        description: 'Amelioration a distance des meta-armures allies via impulsions (courants de nanomachines).',
        effet: 'Portee lointaine, pas besoin de ligne de vue. Peut cibler soi-meme (+50% energie). Prolongement possible (50% energie, min 1 PE).',
        energie: 'Variable selon impulsion',
        activation: 'Action de deplacement',
        duree: 'Variable',
        variants: {
          'Impulsion d\'action': {
            description: 'Un allie obtient une action de combat ou deplacement supplementaire.',
            effet: '+1 action pour un allie.',
            energie: '4 PE (+10 PE pour soi-meme)',
            duree: '1 tour'
          },
          'Impulsion d\'esquive': {
            description: 'Ameliore defense et reaction des allies.',
            effet: '+2 defense et reaction pour un ou plusieurs allies.',
            energie: '3 PE par allie (+2 PE/tour pour maintien)',
            duree: '1 tour (prolongable)'
          },
          'Impulsion de force': {
            description: 'Ameliore le champ de force des allies.',
            effet: '+2 CdF pour une ou plusieurs meta-armures.',
            energie: '2 PE par allie (+1 PE/tour pour maintien)',
            duree: '1 tour (prolongable)'
          },
          'Impulsion de guerre': {
            description: 'Ameliore les degats et violence des allies.',
            effet: '+1D6 degats et violence pour un ou plusieurs allies.',
            energie: '1 PE par allie (+1 PE/tour pour maintien)',
            duree: '1 tour (prolongable)'
          },
          'Impulsion d\'energie': {
            description: 'Transfert d\'energie vers un allie.',
            effet: '1-5 PE transfere a un allie.',
            energie: '1-5 PE (selon montant)',
            duree: 'Instantee'
          }
        }
      },
      'Mode Falcon': {
        description: 'Analyseur de dernieres generation pour detecter faiblesses et forces des ennemis.',
        effet: 'Decouvre (au choix, 6 PE): tous les aspects, reaction/defense, aspects exceptionnels, points faibles, armes, scores bouclier/armure/sante, ou toutes les capacites d\'un PNJ. Ou tactiques d\'un type de creature, ou prochaine action de chaque creature a portee moyenne.',
        energie: '6 PE',
        activation: 'Action de deplacement',
        duree: 'Instantee'
      }
    },
    evolutions: {
      '150': 'Gain du reacteur Infinity (+10 PE).',
      '200': 'Acces a toutes les impulsions.',
      '250': 'Mode Falcon: activation gratuite (3 PE) et sans action. +10 PE supplementaires.'
    }
  },

  'Warrior': {
    nom: 'Warrior',
    generation: '1',
    capacites: 'Type',
    paMax: 100, peMax: 40, cdfMax: 8,
    slots: { tete: 7, 'bras-g': 10, 'bras-d': 10, torse: 12, 'jambe-g': 7, 'jambe-d': 7 },
    overdrives: ['Deplacement', 'Combat', 'Tir', 'Dexterite'],
    source: 'Livre de Base',
    description: ' Premiere meta-armure de Merlin. Polyvalente avec 5 types interchangeables.',
    descriptionCapacites: {
      'Type': {
        description: '5 types offrant 1 OD dans les 3 caracteristiques d\'un aspect.',
        effet: 'Un seul type actif a la fois. 150 PG: activation gratuite. 200 PG: tous les types. 250 PG: 2 OD par caracteristique.',
        energie: '1 PE/tour ou 6 PE/scene',
        activation: 'Action de deplacement',
        duree: '1 tour ou scene',
        types: {
          'Soldier': { aspect: 'Chair', caracs: ['Force', 'Endurance', 'Hargne'] },
          'Hunter': { aspect: 'Bete', caracs: ['Hargne', 'Combat', 'Instinct'] },
          'Scholar': { aspect: 'Machine', caracs: ['Savoir', 'Technique', 'Tir'] },
          'Herald': { aspect: 'Dame', caracs: ['Aura', 'Parole', 'Sang-froid'] },
          'Scout': { aspect: 'Masque', caracs: ['Deplacement', 'Discretion', 'Perception'] }
        }
      }
    }
  },

  'Wizard': {
    nom: 'Wizard',
    generation: '3',
    capacites: 'Mode Borealis, Mode Oriflamme',
    paMax: 40, peMax: 80, cdfMax: 14,
    slots: { tete: 5, 'bras-g': 5, 'bras-d': 5, torse: 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Combat', 'Instinct', 'Aura', 'Sang-froid'],
    source: 'Livre de Base',
    description: 'Armure de lumiere contre l\'Anatheme. Canaux a plasma et reacteur Infinity.',
    descriptionCapacites: {
      'Mode Borealis': {
        description: 'Volutes de plasma lumineux efficace contre l\'Anatheme.',
        effet: '3 variantes: Support (anti-Anatheme sur armes, 6 PE +2/allie), Offensif (4D6+12 degats, 2 PE), Utilitaire (manipulation plasma, 6 PE).',
        energie: '6/2/6 PE',
        activation: '1 tour',
        duree: 'Phase/scene',
        variantes: {
          Support: { cout: '6 PE (+2/allie)', portree: 'Courte', effet: 'Anti-Anatheme sur armes' },
          Offensif: { cout: '2 PE', portree: 'Courte', degats: '4D6+12', effets: ['Anti-Anatheme', 'Degats continus 3'] },
          Utilitaire: { cout: '6 PE', portree: 'Courte', effet: 'Manipulation plasma pour outils' }
        }
      },
      'Mode Oriflamme': {
        description: 'Vague de plasma et poudre de magnesium contre l\'Anatheme.',
        effet: 'Degats automatiques aux creatures de l\'Anatheme a portee courte. Moitie des degats a portee moyenne. Pas de test necessaire.',
        energie: '12 PE',
        activation: 'Action de deplacement',
        duree: 'Instantee',
        degats: '6D6+6',
        violence: '6D6+12',
        portree: 'Courte (a 250 PG: Moyenne)',
        effets: ['Anti-Anatheme', 'Lumiere 2']
      }
    }
  },

  // ======================================================================
  // SUPPLEMENT 2038
  // ======================================================================

  'Monk': {
    nom: 'Monk',
    generation: '3',
    capacites: 'Mode Cea, Mode Zen',
    paMax: 60, peMax: 50, cdfMax: 14,
    slots: { tete: 7, 'bras-g': 8, 'bras-d': 8, torse: 10, 'jambe-g': 6, 'jambe-d': 6 },
    overdrives: ['Combat', 'Tir', 'Hargne', 'Sang-froid'],
    source: 'Supplement 2038',
    description: 'Armure axee sur le combat rapproche et la meditation. Utilise l\'energie alpha via le materiau Cea. Perte d\'espoir: -1 point par utilisation du mode Cea (recuperables via Mode Zen).',
    descriptionCapacites: {
      'Mode Cea': {
        description: 'Propulsion d\'energie alpha depuis les gantelets en 3 types: vague, salve ou rayon.',
        effet: 'Utilisation avec Tir (portee courte+) ou Combat (contact). Un seul gantelet requis. Style ambidextre possible. Perte de 1 esperance par utilisation.',
        energie: '3 PE par utilisation',
        activation: 'Action de combat',
        duree: 'Instantee',
        esperance: '1 (recuperable via Mode Zen)',
        variantes: {
          'Vague d\'energie': {
            description: 'Mouvement ample et brusque du bras pour une vague diffuse.',
            degats: '3D6 (9)',
            violence: '3D6 (9)',
            portree: 'Courte (<=15m)',
            effets: ['Parasitage 2', 'Dispersion 3', 'Destructeur', 'Choc 2']
          },
          'Salve d\'energie': {
            description: 'Mouvement rapide du bras vers l\'avant pour des projectiles explosifs.',
            degats: '3D6 (9)',
            violence: '3D6 (9)',
            portree: 'Moyenne (<=50m)',
            effets: ['Ultraviolence', 'Meurtrier', 'Dispersion 3', 'Parasitage 1']
          },
          'Rayon d\'energie': {
            description: 'Mouvement lent du bras tendu pour un rayon concentre.',
            degats: '4D6 (12) +1D6/tour sur meme cible (cumulables)',
            violence: '2D6 (6)',
            portree: 'Moyenne (<=50m)',
            effets: ['Parasitage 1', 'Perce armure 40 (-> Ignore armure a 250 PG)']
          }
        }
      },
      'Mode Zen': {
        description: 'Meditation pour nettoyer l\'esprit du desespoir cause par le mode Cea.',
        effet: 'Recupere la moitie des points d\'espoir perdus (arrondi superieur) +1 par reussite supplementaire (max: total perdu). Test base Hargne combo Sang-Froid difficulte ardu (5).',
        energie: 'Aucune',
        activation: 'Aucune',
        duree: '1 heure',
        conditions: 'Juste apres une phase de conflit, durant la scene suivante'
      }
    },
    evolutions: {
      '150': 'Mode Cea: +2D6 degats/violence pour chaque type de propulsion.',
      '200': 'Mode Zen: recuperation des points d\'espoir perdus lors de n\'importe quelle phase de conflit de la mission en cours.',
      '250': 'Mode Cea: Vague -> Parasitage 4, Salve -> Dispersion 6, Rayon -> Ignore armure. +2D6 degats/violence.'
    }
  },

  'Psion': {
    nom: 'Psion',
    generation: '3',
    capacites: 'Mode Puppet Master, Mode Discord, Mode Windtalker',
    paMax: 50, peMax: 60, cdfMax: 14,
    slots: { tete: 7, 'bras-g': 10, 'bras-d': 10, torse: 12, 'jambe-g': 7, 'jambe-d': 7 },
    overdrives: ['Instinct', 'Savoir', 'Perception', 'Sang-froid'],
    source: 'Supplement 2038',
    description: 'Armure specialisee dans le controle mental des creatures de l\'Anatheme via le flux.',
    note: 'Recolte de flux: 2 points au debut d\'une phase de conflit +1/tour. +2/Hostile, +3/Salopard, +4/Patron tue. Max 10 flux/scene hors conflit. Flux non utilise = perdu. Fonctionne uniquement contre creatures de l\'Anatheme et desespers.',
    descriptionCapacites: {
      'Mode Puppet Master': {
        description: 'Controle mental des creatures de l\'Anatheme ou desesperes via le flux.',
        effet: 'Donne un ordre simple (1-3 mots) a une creature de type Hostile a portee moyenne. La cible doit etre un PNJ. Execution a son tour avec toutes ses actions. Ordre le plus simple/rapide. Maintien possible. Prolongement: meme ordre, +1 flux.',
        coutFlux: '1 (ordre) / +1 (creature supplementaire) / +1 (prolongement)',
        energie: '2 PE (ordre) / +3 PE (creature supplementaire) / +1 PE (prolongement)',
        activation: 'Action de deplacement',
        duree: '1 tour (conflit) / 10 secondes (scene)'
      },
      'Mode Discord': {
        description: 'Perturbation du flux pour semer l\'anarchie parmi les ennemis.',
        effet: 'Toutes les creatures de l\'Anatheme de type Hostile a portee moyenne: -2D a chaque action, -2 reaction, -2 defense. Bonus ne se cumulent pas.',
        coutFlux: '1 (1 tour) / 3 (scene ou phase)',
        energie: '2 PE/tour (1 tour) / 6 PE (scene)',
        activation: 'Action de deplacement',
        duree: '1 tour ou scene/phase'
      },
      'Mode Windtalker': {
        description: 'Lecture du flux pour comprendre tactiques et actions ennemies.',
        effet: 'Prise de connaissance des tactiques d\'un type de creature. Annonce de la prochaine action de chaque creature de l\'Anatheme a portee moyenne.',
        coutFlux: '2',
        energie: '4 PE',
        activation: 'Action de deplacement',
        duree: 'Instantee'
      }
    },
    evolutions: {
      '150': 'Mode Puppet Master fonctionne contre les Salopards. Test base Aura vs 1/2 Machine ou Bete (MJ). Cout: 2 flux (1ere creature) +2/creature supplementaire.',
      '200': 'Mode Discord fonctionne contre les Salopards. Test base Aura vs 1/2 Machine ou Bete. Malus: -3D aux actions, -3 defense/reaction.',
      '250': 'Mode Puppet Master fonctionne contre les bandes. Test base Aura vs 1/2 Machine ou Bete de la bande. Le score de debordement actuel est inflige a tous les autres ennemis presents.'
    }
  },

  'Sorcerer': {
    nom: 'Sorcerer',
    generation: '4',
    capacites: 'Mode Morph',
    paMax: 60, peMax: 80, cdfMax: 14,
    slots: { tete: 7, 'bras-g': 8, 'bras-d': 8, torse: 10, 'jambe-g': 6, 'jambe-d': 6 },
    overdrives: ['Endurance', 'Instinct', 'Sang-froid', 'Dexterite'],
    source: 'Supplement 2038',
    description: 'Armure de 4e generation en nanomachines polymorphes. L\'esprit du chevalier est transfere dans l\'armure. Pas de PS. Pas de besoins primaires (manger, dormir, boire).',
    note: 'Sensible aux IEM (parasitage 4 minimum). Energie deficitante: pas de recharge passive. Peut siphonner l\'energie des allies. Prototype: modules +5/10/15 PG (standard/avance/rare).',
    descriptionCapacites: {
      'Mode Morph': {
        description: 'Activation du mode de combat avec 3 capacites simultanees parmi 6.',
        effet: 'Changement de configuration = nouvelle activation. Perte de 1 esperance par activation (sans reduction possible).',
        energie: '10 PE',
        activation: 'Aucune',
        duree: 'Une scene ou une phase de conflit',
        esperance: '1',
        variantes: {
          'Vol en nuee': {
            description: 'Vol en nuée de nanomachines.',
            effet: 'Effets du module de vol niveau 1 (ou 2 a 150 PG). Pas d\'utilisation d\'autres modules/armes.',
            activation: '1 action deplacement. Desactivation: gratuite.'
          },
          'Phase': {
            description: 'Passage au travers de la matiere.',
            effet: 'Effets du module de phase niveau 1 (ou 2 a 150 PG). Doit depenser l\'energie du module.',
            activation: '1 action deplacement. Desactivation: gratuite.'
          },
          'Etirement': {
            description: 'Etirement des membres.',
            effet: 'Portee des attaques de contact = portee courte (moyenne a 150 PG). Bonus +3 reussites automatiques pour immobiliser.',
            conditions: 'Cible de taille humaine ou plus petite'
          },
          'Corps de metal': {
            description: 'Corps metallique.',
            effet: '+2 CdF (total 16, +4 a 150 PG).'
          },
          'Corps fluide': {
            description: 'Mouvement constant des nanomachines.',
            effet: '+2 defense et +2 reaction (+3 chacun a 150 PG).'
          },
          'Polymorphie de guerre': {
            description: 'Generation de modules de combat.',
            effet: 'Par tour: 1 module gratuit parmi griffes de combat, lame de bras, canon de bras (niveau 1 ou 2 a 150 PG). Peut generer sur chaque main.'
          }
        }
      }
    },
    evolutions: {
      '150': 'Vol en nuee: niveau 2. Phase: niveau 2. Etirement: portee moyenne. Corps de metal: +4 CdF. Corps fluide: +3 defense/reaction. Polymorphie: modules niveau 2.',
      '250': 'Tous les effets du Mode Morph simultanement avec une seule activation.'
    }
  },

  // ======================================================================
  // CODEX V1.5
  // ======================================================================

  'Druid': {
    nom: 'Druid',
    generation: '3',
    capacites: 'Mode Companion',
    paMax: 50, peMax: 80, cdfMax: 12,
    slots: { tete: 5, 'bras-g': 5, 'bras-d': 5, torse: 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Combat', 'Instinct', 'Tir', 'Technique'],
    source: 'Codex v1.5',
    description: 'Armure connectee a la nature avec generation de compagnons robotiques (Lion, Wolf, Crow).',
    note: 'Seul un type de compagnon a la fois. Distance max: portee longue. Desactivation gratuite. Compagnon agit a son initiative.',
    descriptionCapacites: {
      'Mode Companion': {
        description: 'Generation de compagnons robotiques depuis le gantelet droit.',
        effet: 'Un seul type a la fois. Duree: scene/phase de conflit. Prolongement: 50% energie.',
        energie: '16 PE / 8 PE (prolongement)',
        activation: '1 tour (conflit) ou 6 secondes (hors conflit)',
        duree: 'Une scene ou une phase de conflit',
        variants: {
          'Lion': {
            description: 'Compagnon de combat humanoide robotique (2.5m).',
            details: 'Profil PNJ type Salopard. 60 PG pour equipement (modules standards uniquement). Slots: 8 8 8 10 8 8. PA: 60, Defense: 4, Reaction: 4, Initiative: 2. Aspects: Chair 7 (mineur), Bete 6 (mineur), Machine 7 (mineur), Dame 4, Masque 4, CdF: 10. Arme: Coups.',
            sensibilite: 'Double des effets des IEM.',
            note: 'Ne peut pas recevoir d\'overdrives, modules utilitaires/tactiques, ou armes de l\'arsenal (sauf via modules comme tourelles).'
          },
          'Wolf': {
            description: 'Trois petites unites robotiques (1.5m) avec visages de loups.',
            details: 'Profil PNJ simplifie. PE partages. PA: 20, Defense: 4, Reaction: 4, Initiative: 2, CdF: 4. Aspects: Chair 2, Bete 4, Machine 4, Dame 2, Masque 4. Arme: Coups.',
            support: {
              'Labor': { effet: '+1D par compagnon pour actions de port/levage. 150kg par compagnon.', cout: '1 PE/tour' },
              'Medic': { effet: '+1D par compagnon pour actions medicales. +2 PS/allie soigne par compagnon.', cout: '1 PE/tour' },
              'Tech': { effet: '+1D par compagnon pour reparations/analyses. +3 PA repares par compagnon.', cout: '2 PE/tour' },
              'Fighter': { effet: '+1D par compagnon pour attaques de contact. Effet barrage(1) par compagnon. 1D6 degats par compagnon.', cout: '2 PE/tour' },
              'Recon': { effet: '+1D par compagnon pour observation/vigilance/fouille. Perception directe via un compagnon.', cout: '1 PE/tour' }
            },
            note: 'A 200 PG: choix de 2 configurations qui donnent +1D supplementaire (max 3D/compaigne).'
          },
          'Crow': {
            description: 'Nuée de 30 unites robotiques volantes.',
            details: 'Profil bande PNJ. Cohesion: 50, Defense: 2, Reaction: 2, Initiative: 1, CdF: 2, Débordement: 2. Aspects: Chair 6, Bete 4, Machine 4, Dame 0, Masque 6. Module: Vol niveau 3. Attaque tous les ennemis d\'un type choisit.',
            note: 'Degats font perdre de la cohésion comme de la violence. A chaque evolution: +50 cohesion, +2 debordement, +2 CdF.'
          }
        }
      }
    },
    evolutions: {
      '0': 'Pas d\'evolution pour l\'armure elle-meme. Les compagnons evoluent a 100, 200, 300, 400, 500 PG.'
    }
  },

  // ======================================================================
  // ATLAS
  // ======================================================================

  'Shaman': {
    nom: 'Shaman',
    generation: '3',
    capacites: 'Mode Totem, Mode Ascension, Impregnation',
    paMax: 60, peMax: 80, cdfMax: 10,
    slots: { tete: 5, 'bras-g': 5, 'bras-d': 5, torse: 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Savoir', 'Technique', 'Sang-froid', 'Hargne'],
    source: 'Atlas',
    description: 'Armure spirituelle avec IA autonome nommee. Materialisation de l\'IA en corps physiques.',
    note: 'Les deux modes s\'excluent mutuellement. L\'IA peut subir l\'impregnation.',
    descriptionCapacites: {
      'Mode Totem': {
        description: 'Materialisation de l\'IA en 1-2 corps grossierement detailles.',
        effet: 'Jusqu\'a 2 totems a portee courte. Destruction automatique par toute attaque qui le cible. Ajoute une characteristic (sans OD) par totem a un test du chevalier. Characteristiques differentes a chaque fois.',
        energie: '3 PE par totem (+1 PE/tour ou +6 secondes pour prolonger)',
        activation: 'Aucune',
        duree: '1 tour (conflit) ou 6 secondes',
        limitations: 'Doivent rester a portee moyenne. Pas d\'initiative propre. Sensibles aux chocs violents.'
      },
      'Mode Ascension': {
        description: 'Materialisation de l\'IA en une replique exacte de l\'armure.',
        effet: 'Replique avec memes modules, valeurs, aspects, caracteristiques mais sans armes. Meme nombre de nods. PA a 0 = destruction. Reparable avant 0 PA. Agit independamment. Obeit aux ordres si justifies (peut refuser).',
        energie: '10-50 PE (min 10, max 50, soustrait du total du chevalier)',
        activation: '1 tour (conflit) ou 6 secondes',
        duree: 'Une scene ou une phase de conflit (prolongable en conservant meme valeur PE)',
        limitations: 'Sensible a l\'impregnation. Pas de limite de portee.'
      },
      'Impregnation': {
        description: 'Risque de liaison permanente de l\'IA a son corps.',
        effet: 'Points d\'impregnation: Mode Totem = 1 point, Mode Ascension = 3 points. Test de Sang-Froid combo Technique (ou Hargne combo Technique) a la fin de chaque deployment. Difficulte = nombre de points cumules. Echecs: effets aleatoires (traumas). 10 echecs: imprégnation irreversible, changement d\'IA, perte de 3D6 esperance.',
        note: 'Points remises a 0 a chaque debut de mission ou intermission. Le MJ peut reduire les points si le chevalier prend soin de son IA.'
      }
    },
    evolutions: {
      '150': '3 totems maximum simultanement.',
      '200': 'Mode Ascension activable hors de l\'armure (apparence au choix: combinaison Guardian ou meta-armure).',
      '250': 'Totems: agissent independamment, sans limite de portee, plus finement materialises. cout: 10 PE pour scene/phase.'
    }
  },

  'Warlock': {
    nom: 'Warlock',
    generation: '3',
    capacites: 'Mode Forward, Mode Record, Mode Rewind, Contrecoups',
    paMax: 60, peMax: 60, cdfMax: 8,
    slots: { tete: 5, 'bras-g': 8, 'bras-d': 8, torse: 8, 'jambe-g': 5, 'jambe-d': 5 },
    overdrives: ['Combat', 'Deplacement', 'Dexterite', 'Instinct'],
    source: 'Atlas',
    description: 'Armure temporelle en element alpha. Manipulation du temps sur elle-meme uniquement. L\'environnement ne subit aucun changement.',
    note: 'Contrecoups: Defaillance temporelle (armes limitees) et Paradoxe temporel (test de Sang-Froid ou Hargne).',
    descriptionCapacites: {
      'Mode Forward': {
        description: 'Acceleration temporelle pour se deplacer plus rapidement.',
        effet: 'Augmentation des portées de déplacement d\'un niveau (contact->courte, courte->moyenne, moyenne->longue). Max: portee longue. Ne s\'applique pas aux deplacements en vehicule, OD Deplacement 1/3, ou module de teleportation.',
        energie: '3 PE par niveau d\'augmentation',
        activation: 'Aucune',
        duree: '6 secondes ou 1 tour (conflit)'
      },
      'Mode Record': {
        description: 'Enregistrement et reproduction d\'une attaque.',
        effet: 'Enregistre la prochaine attaque (arme ou module) du tour actuel. Au tour suivant: reproduction exacte (memes jets, degats, violence, portree, effets) par un double temporel. Une seule attaque enregistree par tour. Energie pour effets speciaux non depensee de nouveau. Munitions non depensees de nouveau. Peut changer de cible.',
        energie: '12 PE (enregistrement), 0 PE (reproduction)',
        activation: 'Aucune',
        duree: 'L\'attaque enregistree doit etre reproduite au tour suivant, sinon perdue'
      },
      'Mode Rewind': {
        description: 'Retour temporel de 6 secondes pour la Warlock et son equipement.',
        effet: 'Retour a l\'etat et position d\'il y a 6 secondes (ou tour precedent). Recupere: PA, PS, annule blessure grave, recuperation munitions de modules, nods utilises. NE recupere PAS: esperance, energie, armes cassees, equipement autre que modules/munitions/nods. L\'environnement reste inchange.',
        energie: '15 PE (12 PE a 150 PG)',
        activation: 'Aucune (mais doit etre active a son tour)',
        duree: 'Instantee',
        limitations: '1 utilisation par tour. Doit attendre 6 secondes entre chaque Rewind.'
      },
      'Contrecoups': {
        description: 'Effets secondaires de la manipulation temporelle.',
        details: {
          'Defaillance temporelle': {
            description: 'Dysfonctionnement des armes complexes.',
            effet: 'Interdiction des armes a projectiles ou trop evoluees. Armes de contact limitees a 5 effets maximum (hors prestige/Forge/Knight JDR Systeme).'
          },
          'Paradoxe temporel': {
            description: 'Instabilite temporelle. Test base Sang-Froid ou Hargne (sans OD) a chaque utilisation d\'une capacite en scene/phase.',
            effet: 'Difficulte = nombre d\'utilisations dans la scene/phase. Echec: lancer 2D6 sur tableau des paradoxes.',
            tableau: {
              '1-1': 'Dechirure: Blessure grave aleatoire automatique.',
              '1-2, 2-1, 2-2': 'Incident: 4D6 degats directs sur la sante. Rewind ne peut annuler.',
              '1-3, 2-3, 3-1, 3-2': 'Disparition: Disparait de la scene, revient a la fin.',
              '1-4, 2-4, 3-4, 4-1, 4-2, 4-3': 'Fragmentation: 1D6 tours de perte de memoire/identite.',
              '1-5, 2-5, 3-5, 4-4, 4-5, 5-1, 5-2, 5-3, 5-4': 'Siphon: -6D6 PE.',
              '1-6, 2-6, 3-6, 4-6, 5-5, 5-6, 6-1, 6-2, 6-3': 'Sursaut: 1D6 tours de sauts temporels. -2 reussites a tous les tests.',
              '5-5, 5-6, 6-4, 6-5': 'Desorientation: -1D6 esperance.',
              '6-6': 'Desagregation: 3D6 degats sur PA (sans CdF). Rewind ne peut annuler.'
            }
          }
        }
      }
    },
    evolutions: {
      '150': 'Mode Rewind: -3 PE. Mode Record: -3 PE.',
      '200': 'Mode Rewind peut etre active juste apres une action d\'un autre PJ/PNJ (meme si la Warlock devrait etre incapable d\'agir ou morte). Ignore les effets persistants (domination, controle, isolement). Doit attendre 6 secondes et fin du tour.',
      '250': 'Peut relancer le jet du tableau des paradoxes et choisir entre les deux resultats.'
    }
  }
};

// ======================================================================
// FONCTIONS
// ======================================================================

// Fonction pour appliquer les donnes d'une armure au personnage
KNIGHT.data.armorData.applyToCharacter = function(char, armorName) {
  var armor = this[armorName];
  if (!armor) return false;

  // Mettre a jour le nom de l'armure
  char.warrior.nomArmure = armor.nom;

  // Mettre a jour la generation
  char.warrior.generation = armor.generation + ' generation';

  // Mettre a jour les stats
  char.warrior.paMax = armor.paMax;
  char.warrior.peMax = armor.peMax;
  char.warrior.cdfMax = armor.cdfMax;

  // Mettre a jour les slots max
  if (armor.slots) {
    char.warrior.slots.tete.max = armor.slots.tete;
    char.warrior.slots.torse.max = armor.slots.torse;
    char.warrior.slots['bras-g'].max = armor.slots['bras-g'];
    char.warrior.slots['bras-d'].max = armor.slots['bras-d'];
    char.warrior.slots['jambe-g'].max = armor.slots['jambe-g'];
    char.warrior.slots['jambe-d'].max = armor.slots['jambe-d'];
  }

  // Mettre a jour les capacites (texte simple)
  char.warrior.capacite = armor.capacites;

  // Stocker les descriptions completes pour affichage
  char.warrior.capaciteDescriptions = armor.descriptionCapacites || {};
  char.warrior.description = armor.description || '';
  char.warrior.source = armor.source || '';
  char.warrior.note = armor.note || '';

  // Mettre a jour les overdrives (tableau pour traitement interne)
  char.warrior.activeTypes = armor.overdrives ? armor.overdrives.slice() : [];

  return true;
};
