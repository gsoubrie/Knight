/* ═══════════════════════════════════════════
   KNIGHT — storage.js
   Sauvegarde  → télécharge saves/<nom>.json
   Chargement  → lit saves/index.json
                 puis saves/<fichier>.json
═══════════════════════════════════════════ */

'use strict';

var KNIGHT = KNIGHT || {};

KNIGHT.storage = (function () {

  // Calculer le chemin de base depuis l'URL courante
  // Ex: /Knight/ si index.html est dans /Knight/
  var _getBasePath = function () {
    var pathname = window.location.pathname;
    var lastSlash = pathname.lastIndexOf('/');
    return pathname.substring(0, lastSlash + 1);
  };

  var BASE_PATH = _getBasePath();
  var SAVES_DIR   = BASE_PATH + 'saves/';
  var INDEX_FILE  = BASE_PATH + 'saves/index.json';

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

  /* ════════════════════════════════════════
     LOAD FROM URL PARAMETER — charge saves/<id>.json
     callback(err)
  ════════════════════════════════════════ */

  function loadFromUrlParam(id, char, callback) {
    if (!id) {
      callback(new Error('Pas de paramètre id dans l\'URL'));
      return;
    }
    var file = id.replace(/\.json$/i, '') + '.json';
    fetchCharacter(file, char, callback);
  }

  return {
    save:           save,
    load:           load,
    fetchIndex:     fetchIndex,
    fetchCharacter: fetchCharacter,
    loadFromUrlParam: loadFromUrlParam
  };

}());
