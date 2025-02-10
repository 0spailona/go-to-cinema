1) Склонировать репозиторий
2) Перейти в корневую папку репозитория
3) Выполнить: docker build . -t go-to-cinema для сборки 
4) и docker run -it --rm -p PORT:80 go-to-cinema для запуска
 
 для работы QR c других хостов надо добавить -e PUBLIC_URL=http://PUBLIC_HOST:PUBLIC_PORT
 для переопределения почты админа -e ADMIN_MAIL=bbb@mail.ru
 для переопределения пароля админа -e ADMIN_PASSWORD=pass_hash\

 pass_hash можно получить вот так: 
 ```echo "<?php print password_hash('MyNewPassword', PASSWORD_DEFAULT);" | php```

5) Открыть в браузере http://localhost:PORT/ для страницы клиента
6) Открыть в браузере http://localhost:PORT/admin для страницы админа. 

7) Значения по укмолчанию 
 Логин: aaa@mail.ru
 Пароль: 111
 publicUrl: http://localhost:8000

8) База данных пустая. Для работы с сервисом её нужно заполонить данными. 
Редактирование базы данных невозможно без закрытия продажи билетов.
