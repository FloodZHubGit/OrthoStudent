# Ortho Planning mobile

Application autonome de l'emploi du temps des L1, L2 et L3 d'orthoptie de l'UPJV.

## Fonctionnement

- l'étudiant choisit L1, L2 ou L3 au premier lancement ;
- l'application découvre automatiquement le groupe CELCAT de l'année universitaire en cours ;
- les séances téléchargées sont conservées dans la mémoire de l'app ;
- l'emploi du temps reste consultable hors ligne ;
- **Actualiser** remplace le cache local par la version CELCAT la plus récente ;
- le bouton rond `L1`/`L2`/`L3` permet de changer de promotion.

## Tester dans un navigateur

```powershell
npm install
npm run build
npm run web
```

Ouvrir ensuite <http://localhost:4173>. Le serveur inclus relaie uniquement les deux routes publiques CELCAT nécessaires à l'application.

## Créer l'APK Android

Pré-requis : Node 22+, Java 21 et le SDK Android (Android Studio est la méthode la plus simple).

```powershell
npm install
npm run apk
```

Le fichier partageable est créé dans `releases/OrthoPlanning.apk`. Une personne peut l'installer sur Android après avoir autorisé l'installation d'applications provenant de son navigateur ou de son gestionnaire de fichiers.

Après une modification de l'interface, relancer seulement `npm run apk`.

## iPhone et autres appareils

Le projet est également une application web installable. Héberger `npm run build` avec `node server.mjs`, ouvrir l'adresse dans Safari puis choisir **Partager > Sur l'écran d'accueil**.

Pour une vraie application iOS, sur un Mac :

```bash
npm install @capacitor/ios
npx cap add ios
npm run cap:sync
npx cap open ios
```

La signature et la distribution iPhone passent ensuite par Xcode et un compte Apple Developer.
