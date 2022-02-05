# s0-prof1-be

Запуск:

- Режим **development** (с hot reload): `npm run dev`

- Режим **production**: `npm run start`

Примечания:

1. для работы приложения в режиме `production` необходимо в корневой директории проекта создать конфигурационный файл `.env`, указав в нём переменные окружения в соответствии со следующим синтаксисом: на каждой новой строке - `NAME=VALUE`, где `NAME` - это имя переменной, а `VALUE` - её значение

2. поскольку в приложении реализована авторизация, перед запуском приложения в режиме `production` в конфигурационном файле `.env` в переменной `JWT_SECRET` укажите секретный ключ, который будет использован для создания подписи выдаваемого приложением токена доступа, отличный от секретного ключа в режиме `development`

3. Вы можете создать криптостойкий псевдослучайный `JWT_SECRET` для режима `production`, выполнив:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

Пример файла .ENV

```
PORT=3000
NODE_ENV=production
JWT_SECRET=381250dfc37b1946ed3b4f0fc211c4ae4307f254a3798c90a309bf5d4367e08d
ADMIN_EMAIL=admin@admin.ru
ADMIN_PASSWORD=Se!cretPwd@
```

**Эндпоинты**

Логин

`POST localhost:3005/signin`

Создать пользователя (доступно после аутентификации)

`POST localhost:3005/signup`

Получить пользователей

`GET http://localhost:3005/users`

**Running MongoDB as a Docker Container**

Если вы хотите сохранить данные на своем локальном компьютере, вы можете смонтировать том, используя аргумент -v.

```
docker run --rm --name mongodb -d -p 27017:27017 -v YOUR_LOCAL_DIR:/data/db mongo
```
https://www.mongodb.com/compatibility/docker