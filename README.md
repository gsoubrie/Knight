# KNIGHT — Fiche de personnage

## Workflow sauvegarde

### Structure
```
knight/
└── saves/
    ├── index.json        ← liste des personnages
    ├── gregoire.json     ← sauvegarde personnage 1
    └── autre.json        ← sauvegarde personnage 2
```

### Sauvegarder un personnage
1. Remplis la fiche
2. Clique **Sauvegarder** → télécharge `<nom>.json`
3. Copie le fichier dans `saves/`
4. Ajoute-le dans `saves/index.json` si c'est un nouveau personnage :
```json
[
  { "file": "gregoire.json", "name": "Grégoire" },
  { "file": "nouveau.json",  "name": "Nom affiché" }
]
```
5. `git add saves/ && git commit -m "save" && git push`

### Charger un personnage
1. `git pull` (sur une autre machine)
2. Lance un serveur local : `python -m http.server 8080`
3. Ouvre `http://localhost:8080`
4. Clique **Charger** → sélectionne le personnage dans la liste

### Note
Le chargement automatique nécessite un serveur HTTP local (`python -m http.server`).
Le navigateur ne peut pas lire les fichiers locaux directement (`file://`).
