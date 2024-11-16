### Документация по проекту RoomService

Версия апи: v1

---
Пример формирования адреса:

```http
GET http://localhost:8080/api/v1/rooms/all
```

Где: <br>
`localhost:8080` - адрес сервера <br>
`/api/v1` - версия апи <br>
`rooms` - название сервиса <br>
`/all` - эндпоинт

---

### Создание комнаты `room-service`

```http
POST http://localhost:8080/api/v1/rooms/create
```

### Запрос:

```curl
curl --request POST \
  --url http://localhost:8080/api/v1/rooms/create \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/10.1.1' \
  --data '{
	"uuid": null,
	"name": "test",
	"physicalAddress":"test",
	"state":"NEW",
	"clientUid":"test",
	"operatorUid": null
}'
```

где: <br>

| Параметр        | Значение                                                             |
|-----------------|----------------------------------------------------------------------|
| uuid            | null                                                                 |
| name            | имя комнаты                                                          |
| physicalAddress | адрес комнаты (физический)                                           |
| state           | состояние комнаты (NEW, TRANSFERING, FULL, CLOSED)                   |
| clientUid       | уникальный идентификатор клиента который инициирует создание комнаты |
| operatorUid     | null                                                                 |

### Ответ:

#### Комната создана:

```json
{
  "uuid": "ba1435c6-7020-48ad-9fb3-259599eef89f",
  "name": "test",
  "physicalAddress": "test",
  "state": "NEW",
  "clientUid": "test",
  "operatorUid": "test"
}
```

```http
Status Code = 200 OK
```

---

### Получение комнат

```http
GET http://localhost:8080/api/v1/rooms/all
```

```
curl --request GET \
  --url http://localhost:8080/api/v1/rooms/all \
  --header 'User-Agent: insomnia/10.1.1'
```

---

### Получение комнаты

```http
GET http://localhost:8080/api/v1/rooms/get/<uid>
```

```
curl --request GET \
  --url http://localhost:8080/api/v1/rooms/get/<uid> \
  --header 'User-Agent: insomnia/10.1.1'
```
| Параметр | Значение                                             |
|----------|------------------------------------------------------|
| uid      | уникальный идентификатор комнаты которую нужно найти |
### Ответ:
#### Нашел комнату:
```json
{
	"uuid": "fb9c0398-1ba7-4b3f-a99f-eb53d4ed6c43",
	"name": "test",
	"physicalAddress": "test",
	"state": "NEW",
	"clientUid": "test",
	"operatorUid": "test"
}
```

```http
Status Code = 200 OK
```
#### Не нашел комнату:
```json
{
    "message": "не найдено"
}
```
```http
Status Code = 200 OK
```
---

### Удаление комнаты

```http
DELETE http://localhost:8080/api/v1/rooms/delete/<uid>
```

### Запрос:

```curl
curl --request DELETE \
  --url http://localhost:8080/api/v1/rooms/delete/<uid> \
  --header 'User-Agent: insomnia/10.1.1'
```

| Параметр | Значение                                               |
|----------|--------------------------------------------------------|
| uid      | уникальный идентификатор комнаты которую нужно удалить |

### Ответ:

#### Удалось удалить:

```json
{
  "message": "true"
}
```

```http
Status Code = 200 OK
```

#### Такой комнаты нет:

```json
{
  "message": "false"
}
```

```http
Status Code = 202 Accepted
```

---

### Обновление комнаты

```http
http://localhost:8080/api/v1/rooms/update/<uid>
```

### Запрос:

```curl
curl --request PUT \
  --url http://localhost:8080/api/v1/rooms/update/<uid> \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/10.1.1' \
  --data '{
	"name": "test",
	"physicalAddress": "test",
	"state": "NEW",
	"clientUid": "01",
	"operatorUid": null
}'
```

| Параметр | Значение                                                                    |
|----------|-----------------------------------------------------------------------------|
| uid      | уникальный идентификатор комнаты которую нужно обновить                     |
| name            | имя комнаты                                                                 |
| physicalAddress | адрес комнаты (физический)                                                  |
| state           | состояние комнаты (NEW, TRANSFERING, FULL, CLOSED)                          |
| clientUid       | уникальный идентификатор клиента который инициирует создание комнаты        |
| operatorUid     | уникальный идентификатор клиента (оператора) который подключается к комнате |

### Ответ:
```json
{
	"uuid": "fb9c0398-1ba7-4b3f-a99f-eb53d4ed6c43",
	"name": "test",
	"physicalAddress": "test",
	"state": "NEW",
	"clientUid": "01",
	"operatorUid": null
}
```

```http
Status Code = 200 OK
```