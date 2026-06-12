/* ═══════════════════════════════════════════
   KNIGHT — storage.js
   Sauvegarde / chargement JSON dans un .txt
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};

KNIGHT.storage = (function () {

  var HEADER = '=== KNIGHT CHARACTER SAVE v2 ===';

  /* ── Sauvegarder ── */

  function save(char) {
    var data    = char.serialize();
    var json    = JSON.stringify(data, null, 2);
    var content = HEADER + '\n' + json;

    var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    var nom  = (char.nom || 'chevalier').replace(/\s+/g, '_').toLowerCase();
    var name = 'knight_' + nom + '.txt';

    var url = URL.createObjectURL(blob);
    var a   = document.createElement('a');
    a.href     = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ── Charger ── */

  function load(text, char) {
    if (!text || !text.trim()) {
      throw new Error('Fichier vide');
    }

    var content = text.trim();

    // Supprimer le header si présent
    if (content.indexOf(HEADER) === 0) {
      content = content.slice(HEADER.length).trim();
    }

    var data;
    try {
      data = JSON.parse(content);
    } catch (e) {
      throw new Error('Format invalide — ce fichier ne semble pas être une sauvegarde Knight valide.');
    }

    char.deserialize(data);
  }

  return {
    save: save,
    load: load
  };

}());
