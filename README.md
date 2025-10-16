# Cahier des charges – Application Web de Quiz Musical
## 1. Contexte et objectif

Application web destinée à un événement annuel (usage ponctuel).
Capacité maximale : 100 joueurs simultanés.
Objectif : permettre l’organisation d’un quiz musical interactif en ligne, accessible simplement via une URL.

## 2. Public cible
Participants à l’événement (grand public).
Administrateur/animateur de l’événement (accès au backoffice).

## 3. Fonctionnalités principales
### 3.1. Accès joueurs

- Connexion via une URL publique.
- Pas de création de compte.
- Choix libre d’un pseudo (contrôle d’unicité recommandé pour éviter les doublons).
- Salle d’attente visible avant le lancement du quiz.
- Déroulement du quiz :
  - Réception des questions en temps réel.
  - Affichage du timer associé à chaque question.
  - Si question musical lancer la musique automatiquement a l'affichage de la question.
  - Champ unique pour entrer la réponse (texte libre).
  - Passage automatique à la question suivante à la fin du timer (pas de saut possible par le joueur). 

### 3.2. Backoffice (administrateur)
- Accès protégé par un mot de passe défini dans les variables d’environnement.
- Gestion des quiz :
  - Création, modification, suppression d’un quiz.
  - Ajout de questions au quiz :
    - Type texte (énoncé simple).
    - Type musical (upload d’un fichier audio ou intégration d’un flux).
    - Définition du temps de réponse (ex. 20s, 30s).
  - Gestion de la partie en direct :
    - Accès à la salle d’attente (liste des joueurs connectés).
    - Bouton « Lancer le quiz » → déclenchement simultané chez tous les joueurs.
    - Défilement automatique des questions selon le temps imparti.

## 4. Contraintes techniques
- Scalabilité limitée : optimisé pour 100 joueurs max.
- Diffusion temps réel : utilisation de WebSockets (ou équivalent) pour synchroniser le lancement et l’affichage des questions.
- Pas de persistance complexe des utilisateurs (pseudo seulement, pas de comptes).
- Hébergement prévu sur un serveur web standard (Docker recommandé pour simplifier le déploiement).
- Gestion sécurisée du mot de passe backoffice via variables d’environnement.
- Audio : support du format MP3.

## 5. Sécurité
- Pas de stockage de données sensibles (uniquement pseudos et réponses).
- Validation et nettoyage des entrées utilisateurs (anti-injection, XSS).

## 6. Performances
- Chargement rapide de l’interface (application légère).
- Optimisation du streaming audio pour éviter les décalages.
- Timer strict côté serveur pour garantir la synchro entre joueurs.

## 7. UX/UI
- Interface joueur :
  - Page simple, adaptée en priorité aux ordinateurs (téléphone et tablette si le temps).
  - Salle d’attente avec message « En attente du lancement du quiz ».
  - Affichage clair du chrono pendant les questions.
- Interface administrateur :
  - Dashboard minimaliste.
  - Création intuitive des quiz et questions.
  - Contrôle centralisé du lancement.

## 8. Évolutions possibles (hors périmètre initial)
- Système de scores et classement en direct.
- Thématisation (branding de l’événement, je peux te fournir des assets de l'association).

## 9. Livrables attendus
- Application web prête à déployer (Docker)


# INSTALATION 

## BACKEND

Ajouter .env 

``` cd backend ``` 

```npm i ``` 

```docker compose build ```

```docker compose up -d ``` 

```node server.js```

## FRONTEND 

Ajouter .env 

```cd backend``` 

```npm i ``` 

```npm run dev```

