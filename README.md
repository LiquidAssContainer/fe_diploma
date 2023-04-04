[![Build status](https://ci.appveyor.com/api/projects/status/du89x7cf1iemqvgj?svg=true)](https://ci.appveyor.com/project/LiquidAssContainer/fe-diploma)

# Frontend Diploma

[GitHub Pages](https://liquidasscontainer.github.io/fe-diploma)

Итоговый диплом по курсу FE в Нетологии.

## Вкратце о работе

Диплом написан на React + Redux Toolkit. Стили написаны с использованием Sass, местами используются его возможности вроде переменных или миксинов, но не везде. Свёрстано и стилизовано преимущественно по макету, могут быть незначительные отличия. Адаптивный дизайн в макете отсутствует, но некоторые компоненты делались адаптивными. Проверялось на ПК в Google Chrome, на остальных устройствах почти не тестировалось (например, на старых версиях iOS могут неправильно работать флексы).

Изначально не была продумана нормальная архитектура приложения, поэтому в итоге структура немного хаотичная, к концу работы было сложнее добавлять оставшийся функционал, а многие моменты в целом можно было написать лучше. Однако, не считая некоторых багов, приложение позволяет оформить покупку билетов от начала до конца, отправляя конечные данные на сервер и получая положительный ответ.

## Backend

Прилагаемое к диплому API ужасно недоделанное, некоторые приходящие данные противоречат логике на макете, логике фронта и сами себе. Некоторые задуманные (судя по макету) вещи тоже отсутствуют. Как следствие, некоторые фичи на фронте тоже могут быть нереализованы/недоделаны или могут не работать из-за сырого бекенда.

Например, бекенд не отдаёт даты начала/конца поездки у направлений, отдаёт неадекватное время отбытия/прибытия, не позволяет полноценно реализовать добавление обратного билета, сортировка билетов по стоимости выдаёт ошибку и т. д.

## Некоторые дополнительно реализованные фичи

- При выборе мест в вагоне, если среди пассажиров есть и взрослые, и дети, появляется попап для уточнения типа билета.
- В деталях поездки указана стоимость выбранных услуг.
- При добавлении новой формы пассажира появляется инпут с выбором места в вагоне. В макете это не подразумевалось, поэтому пришлось ближе к концу наслаивать на уже написанную логику, а не иметь такой возможности было бы странно.
- Добавил кнопку «Назад», чтобы была возможность вернуться к предыдущему шагу.
- Наличие query-параметров с выбранными городами и фильтрами, отдельный URL для выбранного направления.

## Некоторые использованные библиотеки

- `date-fns` для упрощения работы с датами;
- `react-hook-form` для упрощения работы с формами;
- `react-day-picker` для выбора даты;
- `react-responsive-carousel` для карусели с отзывами на главной странице;
- `rc-slider` для инпута с диапазоном.
