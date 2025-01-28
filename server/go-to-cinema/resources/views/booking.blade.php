<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/svg+xml" href={{asset("/image/favicon.svg")}}/>
    <title>ИдёмВКино</title>

    <!-- Styles -->
    <link rel="stylesheet" type="text/css" href={{asset("/css/booking/normalize.css")}}>
    <link rel="stylesheet" type="text/css" href={{asset("/css/booking/styles.css")}}>
    <!-- Fonts -->
    <link
        href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext,latin-ext"
        rel="stylesheet">

</head>
<body>
<header class="page-header">
    <h1 class="page-header__title">Идём<span>в</span>кино</h1>
</header>

<main>
    <section class="ticket">

        <header class="tichet__check">
            <h2 class="ticket__check-title">Электронный билет</h2>
        </header>

        <div class="ticket__info-wrapper">
            <p class="ticket__info">На фильм: <span class="ticket__details ticket__title">{{$title}}</span></p>
            <p class="ticket__info">Места: <span class="ticket__details ticket__chairs">{{$places}}</span></p>
            <p class="ticket__info">В зале: <span class="ticket__details ticket__hall">{{$hallName}}</span></p>
            <p class="ticket__info">Начало сеанса: <span class="ticket__details ticket__start">{{$startTime}}</span></p>

            <img class="ticket__info-qr" src="{{asset("getQR/" . $bookingId)}}" alt="Упс! Здесь должен быть ваш QR.">

            <p class="ticket__hint">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
            <p class="ticket__hint">Приятного просмотра!</p>
        </div>
    </section>
</main>
</body>
</html>
