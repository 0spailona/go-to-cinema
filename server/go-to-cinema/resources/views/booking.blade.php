<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href={{asset("favicon.ico")}}>
    <title>ИдёмВКино</title>

    <!-- Styles -->
    <link rel="stylesheet" type="text/css" href={{asset("normalize.css")}}>
    <link rel="stylesheet" type="text/css" href={{asset("styles.css")}}>
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

            @if($error)
        <p class="ticket__details ticket__title">Что-то пошло не так</p>
            @endif
            @if(!$error)
                    <p class="ticket__info">На фильм: <span class="ticket__details ticket__title">{{$title}}</span></p>
                    <p class="ticket__info">Места: <span class="ticket__details ticket__chairs">{{$places}}</span></p>
                    <p class="ticket__info">В зале: <span class="ticket__details ticket__hall">{{$hallName}}</span></p>
                    <p class="ticket__info">Начало сеанса: <span class="ticket__details ticket__start">{{$startTime}}</span></p>

                    <a href="{{env('PUBLIC_URL') . "showBooking/" . $bookingId}}">
                        <img class="ticket__info-qr" src="{{env('PUBLIC_URL') . "getQR/" . $bookingId}}" alt="Упс! Здесь должен быть ваш QR.">
                    </a>

                    <p class="ticket__hint">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
                    <p class="ticket__hint">Приятного просмотра!</p>
            @endif

        </div>
    </section>
</main>
</body>
</html>
