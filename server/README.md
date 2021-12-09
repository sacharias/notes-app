### API structure
```
GET     /users
GET     /users/1
POST    /users
PUT     /users/1
DELETE  /users/1

GET     /notes
GET     /notes/1
POST    /notes
PUT     /notes/1
DELETE  /notes/1

POST    /register
POST    /login
```


## Nytt förslag
X POST /api/users/login    Auth
X POST /api/users          Registration
X GET /api/user            Get current user
X PUT /api/user            Update current user
X GET /api/profiles/:username     auth optional

GET /api/articles (query params: tag, author, limit, offset)
GET /api/articles/:id
POST /api/articles
PUT /api/articles/:id
DELETE /api/articles/:id
