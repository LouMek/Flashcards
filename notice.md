# Notice API Flashcards

## Route Authentification
Aucun droit n'est nécessaire pour la route d'authentification.

### Création de compte
- **Méthode HTTP et chemin** : `POST /auth/register`
- **Rôle fonctionnel** : Permet de créer un compte utilisateur afin d'utiliser l'API.
#### Body
Exemple de création de compte:
```json
{
  "email": "Clement.catel@flashcards.fr",
  "firstName": "Clement",
  "lastName": "Catel",
  "password": "password123"
}
```


### Connexion
- **Méthode HTTP et chemin** : `POST /auth/login`
- **Rôle fonctionnel** : Permet de se connecter à un compte utilisateur afin d'utiliser l'API.
#### Body
Exemple de connexion à un compte:
```json
{
  "email": "Clement.catel@flashcards.fr",
  "password": "password123"
}
```
De là, nous pouvons récupérer notre Token, valable pendant 24h.


## Gestion du token
Afin d'utiliser le token, dans l'onglet thunderclient, nous pouvont mettre le token dans la zone de texte située dans l'onglet "Auth" → "Bearer"


## Les collections
Pour les collections, il est primordial d'être connecté à l'API à l'aide d'un token.

### Créer une collection
- **Méthode HTTP et chemin** : `POST /collections`
- **Authentification** : Authentifié
- **Rôle fonctionnel** : Permet de créer une collection
#### Body
```json
{
    "title": "Titre de la collection",
    "description": "Description de la collection",
    "isPublic": true 
}
```

### Voir les collections
- **Méthode HTTP et chemin** : `GET /collections`
- **Authentification** : Authentifié - Si la collection est privée, seul le créateur et l'administrateur peuvent voir la collection, sinon tous les utilisateurs peuvent.
- **Rôle fonctionnel** : Permet de voir ses propres collections ou bien une collection dont le titre à été passé en paramètre de la requête si celle-ci est publique
#### Paramètres de requête
Le titre de la collection que l'on cherche (facultatif)

### Voir une collection
- **Méthode HTTP et chemin** : `GET /collections/:CollectionId`
- **Authentification** :  Authentifié - Si la collection est privée, seul le créateur et l'administrateur peuvent voir la collection, sinon tous les utilisateurs peuvent.
- **Rôle fonctionnel** : Permet de voir une collection grâce à son ID si celle-ci est publique ou appartient à l'utilisateur
#### Paramètres de route
L'ID de la collection que l'on shouhaite voir

### Supprimer une collection
- **Méthode HTTP et chemin** : `DELETE /collections/:CollectionId`
- **Authentification** : Authentifié - Seul le créateur et l'administrateur peuvent supprimer une collection.
- **Rôle fonctionnel** : Permet de supprimer une collection grâce à son ID si l'utilisateur en est le propriétaire
#### Paramètres de route
L'ID de la collection que l'on souhaite supprimer

### Modifier une collection
- **Méthode HTTP et chemin** : `PUT /collections/:CollectionId`
- **Authentification** : Authentifié - Seul le créateur peut modifier
- **Rôle fonctionnel** : Permet de modifier une collection grâce à son ID si l'utilisateur en est le propriétaire
#### Paramètres de route
L'ID de la collection
#### Body
```json
{
    "title": "Nouveau titre de la collection",
    "description": "Nouvelle description de la collection",
    "isPublic": false
}
```

## Voir les flashcards
Pour les flashcards, il est primordial d'être connecté à l'API à l'aide d'un token.

### Créer une flashcard (à partir d'une collection)
- **Méthode HTTP et chemin** : `POST /flashcards/:CollectionId`
- **Authentification** : Authentifié
- **Rôle fonctionnel** : Permet de créer une flashcard à partir d'une collection
#### Body
```json
{
    "frontText": "Anglais",
    "backText": "English"
    "frontURL": "www.UrlFront.fr" (optionnel)
    "backURL": "www.UrlBack.fr" (optionnel)
}

```

### Voir les flashcards (à partir d'une collection)
- **Méthode HTTP et chemin** : `POST /flashcards/collection/:CollectionId`
- **Authentification** : Authentifié - Si la collection est privée, seul le créateur et l'administrateur peuvent voir les flashcards, sinon tous les utilisateurs peuvent.
- **Rôle fonctionnel** : Permet de voir les flashcards à partir d'une collection donnée
#### Paramètres de route
L'ID de la collection

### Voir une flashcard (à partir d'une collection)
- **Méthode HTTP et chemin** : `POST /flashcards/:flashcardId`
- **Authentification** : Authentifié - Si la collection est privée, seul le créateur et l'administrateur peuvent voir la flashcard, sinon tous les utilisateurs peuvent.
- **Rôle fonctionnel** : Permet de voir une flashcard à partir d'une collection donnée
#### Paramètres de route
L'ID de la flashcard

### Supprimer une flashcard
- **Méthode HTTP et chemin** : `DELETE /flashcards/:FlashcardId`
- **Authentification** : Authentifié - Seul le créateur et l'administrateur peuvent supprimer une flashcard.
- **Rôle fonctionnel** : Permet de supprimer une flashcard grâce à son ID si l'utilisateur en est le propriétaire
#### Paramètres de route
L'ID de la flashcard que l'on souhaite supprimer

### Modifier une flashcard
- **Méthode HTTP et chemin** : `PUT /flashcards/:FlashcardId`
- **Authentification** : Authentifié - Seul le créateur peut modifier une flashcard.
- **Rôle fonctionnel** : Permet de modifier une flashcard grâce à son ID si l'utilisateur en est le propriétaire
#### Paramètres de route
L'ID de la flashcard que l'on souhaite modifier
```json
{
    "frontText": "Espagnol",
    "backText": "Spanish"
}
```








