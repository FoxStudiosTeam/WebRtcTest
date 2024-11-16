### Документация по проекту RoomService

Версия апи: v1

Пример формирования адреса: 

```http
GET http://localhost:8080/api/v1/rooms/all
```

Где: <br>
`localhost:8080` -  адрес сервера <br>
`/api/v1` - версия апи <br>
`rooms` - название сервиса <br>
`/all` - эндпоинт

### Создание комнаты `room-service`
```http
POST http://localhost:8080/api/v1/rooms/create
```

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
	"operatorUid": "test"
}'
```



### Получение комнат
```http
GET http://localhost:8080/api/v1/rooms/all
```

```
curl --request GET \
  --url http://localhost:8080/api/v1/rooms/all \
  --header 'User-Agent: insomnia/10.1.1'
```
