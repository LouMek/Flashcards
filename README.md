# Flashcards
Dans le cadre de notre BUT Informatique, nous avons eu pour projet de créer une API RESTful de gestion de flashcards pour réviser.

Afin de voir les différentes routes existantes, vous pouvez vous référer à la notice (notice.md)

## Lancement du projet

### Installation

Le package-lock.json étant dans le répértoire, vous pouvez utiliser la commande `npm install`, afin d'installer toutes les dépendances.
Sinon, voici les packages nécessaires

Pour que le projet fonctionne correctement, il faut installer certains modules de Node, comme Nodemon avec `npm install nodemon`, Express avec `npm install express` et Zod avec `npm install zod`.

Il faut ensuite installer des modules Drizzle. Pour cela, il faut tout d'abord lancer la commande `npm install drizzle-orm @libsql/client dotenv`, puis la commande `npm install -D drizzle-kit` pour installer les packages correctement.

Puis, il faut installer Bcrypt afin de pouvoir hacher les mots de passe avec la commande `npm install bcrypt`, puis installer JsonWebToken pour la gestion des tokens grâce à la commande `npm install jsonwebtoken`.

### Variables d'environnements.

Vous devez créer un fichier .env contenant un JWT_SECRET ainsi que la localisation de la base de donnée. Voici un exemple que vous pouvez repprendre:
DB_FILE=file:local.db
JWT_SECRET=909b531ee075dd6f3f9b3762

### Seeding Database

Pour créer la base de données, il faut lancer la commande `npm run db:push`.

Pour insérer des données dans la base, on peut lancer la commande `node src/db/seed.js` qui ajoutera les données présentes dans le fichier.

### Lancement serveur

Pour lancer le serveur, il suffit de rentrer la commande `npm run dev` dans un terminal. On peut cliquer sur le lien dans le terminal afin d'y accéder depuis un navigateur.

Pour créer la base de données, il faut lancer la commande `npm run db:push`. Vous pouvez obtenir une interface web avec la commande `npm run db:studio`.

## Auteurs

- [Baptiste AUBIGNAT](https://github.com/Mona-94)
- [Louisa MEKHELEF](https://github.com/LouMek)
