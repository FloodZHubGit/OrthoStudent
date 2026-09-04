/* ============================================================
   Lanceur d'electron-builder pour l'appel depuis l'application
   ------------------------------------------------------------
   L'application fabrique un exécutable en exécutant le CLI
   d'electron-builder. Elle n'a pas de `node` garanti sous la main :
   elle relance donc son propre binaire Electron en mode Node
   (ELECTRON_RUN_AS_NODE), ce qui est le moyen habituel.

   Sauf qu'electron-builder lit ses arguments avec yargs, et que
   `hideBin()` de yargs contient cette heuristique :

       si on tourne sous Electron ET que process.defaultApp est absent,
       alors c'est une application empaquetée : les arguments
       commencent à l'indice 1, pas 2.

   Or Electron en mode Node coche la première condition sans cocher
   la seconde. yargs garde donc un cran de trop et se plaint d'un
   « Unknown argument: …/cli.js ».

   Ce lanceur rétablit simplement le drapeau que l'heuristique
   attend, puis passe la main. Il ne fait rien d'autre — et surtout
   pas de traitement des arguments, qui restent ceux de la ligne de
   commande.
   ============================================================ */
'use strict';

process.defaultApp = true;
require('electron-builder/cli.js');
