# Notice API Flashcards

## Endpoints

### Voir les collections

- **Méthode HTTP et chemin** : `GET /collections`
- **Authentification** : Authentifié
- **Rôle fonctionnel** : Permet de voir ses propres collections ou bien une colelction dont le titre à été passé en paramètre de la requête si celle-ci est publique

#### Paramètres de route

Aucun

#### Paramètres de requête

Le titre de la collection que l'on cherche (facultatif)

#### Body

Aucun

### Créer une collection

- **Méthode HTTP et chemin** : `POST /collections`
- **Authentification** : Authentifié
- **Rôle fonctionnel** : Permet de créer une collection

#### Paramètres de route

Aucun

#### Paramètres de requête

Aucun

#### Body

```json
{
    "title": "Titre de la collection",
    "description": "Description de la collection",
    "isPublic": 1
}
```

### Supprimer une collection

- **Méthode HTTP et chemin** : `DELETE /collections:id`
- **Authentification** : Authentifié
- **Rôle fonctionnel** : Permet de supprimer une collection grâce à son ID si l'utilisateur en est le propriétaire

#### Paramètres de route

L'ID de la collection que l'on souhaite supprimer

#### Paramètres de requête

Aucun

#### Body

Aucun

### Voir une collection

- **Méthode HTTP et chemin** : `GET /collections:id`
- **Authentification** : Authentifié
- **Rôle fonctionnel** : Permet de voir une collection grâce à son ID si celle-ci est publique ou appartient à l'utilisateur

#### Paramètres de route

L'ID de la collection que l'on shouhaite voir

#### Paramètres de requête

Aucun

#### Body

Aucun

### Modifier une collection

- **Méthode HTTP et chemin** : `PUT /collections:id`
- **Authentification** : Authentifié
- **Rôle fonctionnel** : Permet de modifier une collection grâce à son ID si l'utilisateur en est le propriétaire

#### Paramètres de route

L'ID de la collection

#### Paramètres de requête

Aucun

#### Body

```json
{
    "title": "Nouveau titre de la collection",
    "description": "Nouvelle description de la collection",
    "isPublic": 0
}
```