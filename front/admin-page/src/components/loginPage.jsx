import {Helmet} from "react-helmet";

export default function LoginPage() {


    return (<>
            <Helmet>
                <title>Авторизация | ИдёмВКино</title>
            </Helmet>
            <main>
                <section className="login">
                    <header className="login__header">
                        <h2 className="login__title">Авторизация</h2>
                    </header>
                    <div className="login__wrapper">
                        <form className="login__form">
                            <label className="login__label" htmlFor="email">
                                E-mail
                                <input className="login__input" type="email" placeholder="example@domain.xyz"
                                       name="email"
                                       required/>
                            </label>
                            <label className="login__label" htmlFor="pwd">
                                Пароль
                                <input className="login__input" type="password" placeholder="" name="password"
                                       required/>
                            </label>
                            <div className="text-center">
                                <button className="login__button">Авторизоваться</button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}