# Taskly – Tableau de bord de suivi de projets

Un tableau de bord de gestion et de suivi de projets moderne, soigné et entièrement responsive, conçu avec **Angular** pour le **LibraryUI Challenge**.
Thèmes clair et sombre, recherche instantanée, filtrage par statut et par équipe, tri multi-colonnes, pagination dynamique, CRUD complet avec historique d'annulation (Undo), paramètres sauvegardés en local et formulaire de support.

---

## Composants LibraryUI utilisés

Les 4 composants proviennent directement de la bibliothèque [LibraryUI](https://www.libraryui.com/components/bootstrap) (section Angular) et se trouvent dans le répertoire [`src/app/libraryui`](src/app/libraryui). Chaque fichier comporte en en-tête un commentaire identifiant son composant d'origine.

| N° | Composant LibraryUI | Emplacement | Rôle et intégration dans Taskly |
|---|---------------------|-------------|----------------------------------|
| 1 | **Navbar 9** (`app-navbar-9`) | `src/app/libraryui/navbar-9` | Navigation principale supérieure, barre sombre réutilisée en **sélecteur d'équipe** dynamique, bascule mode clair / sombre et raccourci « Nouveau projet ». |
| 2 | **Table** (`app-project-table`, orig. `ship-table`) | `src/app/libraryui/project-table` | Gestion de la liste des projets sur la page **Projets** : recherche en direct, filtre par statut, tri ascendant/descendant, pagination, sélection multiple et suppression avec notification d'annulation. |
| 3 | **Settings Profile** (`app-settings-profile`) | `src/app/libraryui/settings-profile` | Page **Paramètres** complète : édition du profil, téléversement de la photo de profil, préférences de thème / langue et gestion des notifications avec persistance `localStorage`. |
| 4 | **Contact Mavix** (`app-contact-mavix`) | `src/app/libraryui/contact-mavix` | Page **Support & Assistance** : formulaire de contact interactif avec validation en temps réel des champs et retour de confirmation. |

---

## Design System & Cohérence visuelle

Tous les composants ont été harmonisés à l'aide d'un ensemble unifié de **Design Tokens CSS** définis dans [`src/styles.scss`](src/styles.scss) :
* **Palette cohérente** : Indigo / Violet moderne (`#4f46e5` en clair, `#818cf8` en sombre), teintes sémantiques pour les statuts (*Terminé*, *En cours*, *En retard*).
* **Mode sombre complet** : géré sans scintillement (script pré-chargé dans `index.html`), mémorisé dans le stockage local ou synchronisé avec les préférences de l'OS.
* **Typographie & Espacements** : police *Inter* (Google Fonts), bordures adoucies, ombres subtiles et transitions fluides.

---

## Fonctionnalités clés

1. **Tableau de bord (Dashboard)** :
   * Cartes KPI animées avec mini-courbes d'évolution (*sparklines*).
   * Graphique à barres d'activité hebdomadaire avec animations d'entrée.
   * Diagramme en anneau (*donut chart*) interactif montrant la répartition des statuts.
   * Liste des prochaines échéances urgentes avec jauges de progression colorées.
2. **Filtrage global par équipe** :
   * Cliquer sur *Design*, *Ingénierie*, *Marketing* ou *Produit* dans la barre de navigation adapte instantanément tous les indicateurs, graphiques et tableaux de l'application.
3. **Tableau interactif des projets** :
   * Recherche instantanée textuelle (nom, code, responsable).
   * Filtre par statut (*Tous*, *En cours*, *Terminé*, *En retard*).
   * Tri par colonnes (nom, début, échéance, avancement).
   * Sélection individuelle ou globale avec suppression groupée.
   * Action **Annuler** disponible via le système de notifications toast.
4. **Modale de création et d'édition** :
   * Accessible au clavier, fermeture via la touche `Échap` ou clic en dehors.
   * Validation des champs requis et cohérence des dates.
5. **Responsive design** :
   * Testé et optimisé sur mobile, tablette et écran large d'ordinateur.
   * Menu hamburger adapté sur mobile, défilement horizontal fluide des tableaux sans rupture visuelle.
6. **Accessibilité** :
   * Balisage sémantique, attributs ARIA complets, indicateurs de focus visibles et prise en compte de `prefers-reduced-motion`.

---

## Lancement en local

```bash
# 1. Cloner le dépôt
git clone <URL_DU_DEPOT>
cd libraryui

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur de développement
npm start
```

Ouvrez ensuite votre navigateur sur [http://localhost:4200](http://localhost:4200).

---

## Construction & Déploiement

### Compilation de production

```bash
npm run build
```

Les fichiers générés se trouveront dans le dossier `dist/taskly/browser`.

### Déploiement sur GitHub Pages

Le workflow GitHub Actions est prêt à l'emploi dans [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Poussez votre code sur la branche `main` de votre dépôt GitHub.
2. Dans GitHub, rendez-vous dans **Settings → Pages**.
3. Dans **Build and deployment → Source**, sélectionnez **GitHub Actions**.
4. Le déploiement se déclenche automatiquement à chaque push.

### Déploiement sur Vercel ou Render

* **Build Command** : `npm run build`
* **Output Directory** : `dist/taskly/browser`
* Le routage par ancre (`HashLocationStrategy`) est activé afin que la navigation directe et le rafraîchissement des pages fonctionnent sur tout hébergement statique.
