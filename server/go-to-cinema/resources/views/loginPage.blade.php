<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href={{asset("/image/favicon.ico")}}>
    <title>Авторизация | ИдёмВКино</title>

    <!-- Styles -->
    <link rel="stylesheet" type="text/css" href={{asset("/css/login/normalize.css")}}>
    <link rel="stylesheet" type="text/css" href={{asset("/css/login/styles.css")}}>
    <!-- Fonts -->
    <link
        href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext,latin-ext"
        rel="stylesheet">

</head>
<body>
    <header class="page-header">
        <h1 class="page-header__title">Идём<span>в</span>кино</h1>
        <span class="page-header__subtitle">Администраторррская</span>
    </header>
    <main>
        <section class="login">
            <header class="login__header">
                <h2 class="login__title">Авторизация</h2>
            </header>
            <div class="login__wrapper">
                <form class="login__form" action="/authorization.php" method="POST" accept-charset="utf-8">
                    <label class="login__label" for="email">
                        E-mail
                        <input class="login__input" type="email" placeholder="example@domain.xyz" name="email"
                               id="email" required>
                    </label>
                    <label class="login__label" for="pwd">
                        Пароль
                        <input class="login__input" type="password" placeholder="" name="password" id="pwd" required>
                    </label>
                    <div class="text-center">
                        <input value="Авторизоваться" type="submit" class="login__button">
                    </div>
                </form>
            </div>
        </section>
    </main>
</body>
</html>
