import './style.sass'

import { Features } from './Features';
import { Reviews } from './Reviews';
import { Header } from '../Header';
import { SearchTicketsForm } from '../SearchTicketsForm';

export const MainPage = () => {
  return (
    <>
      <section className="hero">
        <Header />
        <div className="hero_content">
          <div className="hero_content_text">
            Вся жизнь — <span className="text_accent">путешествие!</span>
          </div>
          <SearchTicketsForm />
        </div>
      </section>
      <section className="about" id="about">
        <h3 className="header_size_l about__header">О нас</h3>
        <div className="about__content">
          <p>
            Мы рады видеть вас! Мы рботаем для Вас с 2003 года. 14 лет мы
            наблюдаем, как с каждым днем все больше людей заказывают жд билеты
            через интернет.
          </p>

          <p>
            Сегодня можно заказать железнодорожные билеты онлайн всего в 2
            клика, но стоит ли это делать? Мы расскажем о преимуществах заказа
            через интернет.
          </p>

          <p className="text_accent">
            Покупать жд билеты дешево можно за 90 суток до отправления поезда.
            Благодаря динамическому ценообразованию цена на билеты в это время
            самая низкая.
          </p>
        </div>
      </section>
      <Features />
      <Reviews />
    </>
  );
};