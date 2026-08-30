# Classement mondial — backend Cloudflare Worker

Petite API sans serveur à gérer, sur le plan gratuit de Cloudflare, qui stocke les
scores publiés depuis le jeu et sert le top N.

- `POST /submit` : enregistre le score d'une carrière terminée.
- `GET /leaderboard?limit=50` : renvoie les meilleurs scores.

Aucun compte joueur, aucune authentification — juste une validation de plausibilité
des valeurs reçues et une limite d'une soumission par minute et par IP.

## Déploiement (à faire une seule fois, depuis ton compte Cloudflare)

1. Installer l'outil en ligne de commande Cloudflare et se connecter :
   ```bash
   npm install -g wrangler
   wrangler login
   ```
   (ouvre une page dans le navigateur pour créer/connecter un compte Cloudflare gratuit — pas besoin de carte bancaire pour ce plan)

2. Créer la base de données D1 :
   ```bash
   cd worker
   wrangler d1 create coupdepedale
   ```
   La commande affiche un bloc avec un `database_id` — colle cette valeur dans
   `wrangler.toml`, à la place de `REPLACE_AFTER_WRANGLER_D1_CREATE`.

3. Créer les tables :
   ```bash
   wrangler d1 execute coupdepedale --remote --file=./schema.sql
   ```

4. Déployer le Worker :
   ```bash
   wrangler deploy
   ```
   La commande affiche l'URL publique du Worker, du type :
   `https://coupdepedale-api.<ton-sous-domaine>.workers.dev`

5. Dans `index.html`, remplacer la valeur de la constante `LEADERBOARD_API_URL`
   (recherche `REPLACE_WITH_WORKER_URL`) par cette URL. Tant que cette constante
   n'est pas une URL valide, le classement reste entièrement masqué dans le jeu
   (bouton "Publier au classement" et écran "Classement mondial" absents) — aucun
   risque d'afficher une fonctionnalité cassée en attendant le déploiement.

## Optionnel : URL avec ton propre domaine

Par défaut l'étape 4 donne une URL en `*.workers.dev`, qui fonctionne très bien
telle quelle. Pour avoir une URL du type `api.lecoupdepedale.com` à la place, il
faut faire pointer les *nameservers* du domaine (acheté chez OVH) vers Cloudflare
— gratuit, tu restes propriétaire du domaine chez OVH, seule la gestion DNS
change de prestataire. Cette étape est indépendante du reste et peut se faire
plus tard sans rien changer au code.

## Maintenance

- Pas de serveur à surveiller ni à mettre à jour.
- Pour voir le contenu de la base : `wrangler d1 execute coupdepedale --remote --command="SELECT * FROM leaderboard ORDER BY score DESC LIMIT 20;"`
- Pour modérer/supprimer une entrée : `wrangler d1 execute coupdepedale --remote --command="DELETE FROM leaderboard WHERE id = <id>;"`
