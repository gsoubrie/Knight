/* ═══════════════════════════════════════════
   KNIGHT — storage.js
   Sauvegarde  → télécharge saves/<nom>.json
   Chargement  → lit saves/index.json
                 puis saves/<fichier>.json
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};

KNIGHT.storage = (function () {

  var SAVES_DIR   = 'saves/';
  var INDEX_FILE  = 'saves/index.json';

  /* ════════════════════════════════════════
     SAVE — télécharge saves/<nom>.json
  ════════════════════════════════════════ */

  function save(char) {
    var data = char.serialize();
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json;charset=utf-8' });

    var nom  = (char.nom || 'chevalier').replace(/\s+/g, '_').toLowerCase();
    var name = nom + '.json';

    var url = URL.createObjectURL(blob);
    var a   = document.createElement('a');
    a.href     = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return name;
  }

  /* ════════════════════════════════════════
     LOAD FROM TEXT (modale fallback)
  ════════════════════════════════════════ */

  function load(text, char) {
    if (!text || !text.trim()) throw new Error('Fichier vide');
    var data;
    try { data = JSON.parse(text.trim()); }
    catch (e) { throw new Error('JSON invalide'); }
    char.deserialize(data);
  }

  /* ════════════════════════════════════════
     FETCH INDEX — lit saves/index.json
     callback(err, [ { file, name } ])
  ════════════════════════════════════════ */

  function fetchIndex(callback) {
    fetch(INDEX_FILE + '?_=' + Date.now())
      .then(function (r) {
        if (!r.ok) throw new Error('index.json introuvable');
        return r.json();
      })
      .then(function (list) {
        // list peut être tableau de strings ou d'objets { file, name }
        var normalized = list.map(function (item) {
          if (typeof item === 'string') {
            // Dériver un nom lisible depuis le nom de fichier
            var label = item.replace(/\.json$/i, '').replace(/_/g, ' ');
            label = label.charAt(0).toUpperCase() + label.slice(1);
            return { file: item, name: label };
          }
          return item; // déjà { file, name }
        });
        callback(null, normalized);
      })
      .catch(function (e) { callback(e, []); });
  }

  /* ════════════════════════════════════════
     FETCH CHARACTER — lit saves/<file>
     callback(err, char)
  ════════════════════════════════════════ */

  function fetchCharacter(file, char, callback) {
    fetch(SAVES_DIR + file + '?_=' + Date.now())
      .then(function (r) {
        if (!r.ok) throw new Error('Fichier introuvable : ' + file);
        return r.json();
      })
      .then(function (data) {
        char.deserialize(data);
        callback(null);
      })
      .catch(function (e) { callback(e); });
  }

  return {
    save:           save,
    load:           load,
    fetchIndex:     fetchIndex,
    fetchCharacter: fetchCharacter
  };

}());
