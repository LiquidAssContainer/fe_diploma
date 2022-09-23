import './style.sass';

import cn from 'classnames';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as SecondClassIcon } from 'assets/icons/second_class.svg';
import { ReactComponent as ThirdClassIcon } from 'assets/icons/third_class.svg';
import { ReactComponent as FourthClassIcon } from 'assets/icons/fourth_class.svg';
import { ReactComponent as FirstClassIcon } from 'assets/icons/first_class.svg';
import { ReactComponent as ClockIcon } from 'assets/icons/clock.svg';
import { ReactComponent as TrainIcon } from 'assets/icons/train.svg';
import { ReactComponent as ArrowIcon } from 'assets/icons/arrow.svg';
import { ReactComponent as ArrowInRectangleLarge } from 'assets/icons/arrow_in_rectangle_large.svg';

import { Header } from 'components/Header';
import { Button } from 'components/Button';
import { PlaceSelection } from './PlaceSelection';
import { TripPoint } from 'components/Ticket';
import { NextStepButton } from 'components/OrderPage/OrderPage';
import { TicketDirection, TripCities } from 'components/Ticket/Ticket';

import { setNextStep } from 'reducers/stepper';
import {
  changeSelectedRailcarType,
  changeTicketsAmount,
  getSeatsDetailAsync,
} from 'reducers/seats';

const railcarTypes = [
  { name: 'fourth', label: 'Сидячий', Icon: FourthClassIcon },
  { name: 'third', label: 'Плацкарт', Icon: ThirdClassIcon },
  { name: 'second', label: 'Купе', Icon: SecondClassIcon },
  { name: 'first', label: 'Люкс', Icon: FirstClassIcon },
];

export const ChoosePlaces = ({
  match: {
    params: { id },
  },
}) => {
  const dispatch = useDispatch();
  const { tripInfo, seatsInfo, selectedAmount } = useSelector(
    (state) => state.seats,
  );

  const handleNextStepClick = () => {
    if (selectedAmount > 0) {
      dispatch(setNextStep());
    }
  };

  useEffect(() => {
    if (!seatsInfo) {
      dispatch(getSeatsDetailAsync(id));
    }
  }, []);

  return (
    <>
      <Header size="s" className="uppercase">
        Выбор мест
      </Header>
      <div className="places__block_list">
        <ChoosePlacesBlock
          {...tripInfo}
          seatsInfo={seatsInfo}
          direction="forward"
        />
        {/* <ChoosePlacesBlock direction="return" /> */}
      </div>
      <NextStepButton onClick={handleNextStepClick}>Далее</NextStepButton>
    </>
  );
};

const ChoosePlacesBlock = ({
  direction,
  time,
  from,
  to,
  train = { name: 'поровозик' },
  price_info,
  available_seats_info,
  duration = 0,
  seatsInfo,
}) => {
  const dispatch = useDispatch();

  const { selectedRailcarClass } = useSelector((state) => state.seats);

  const onRailcarTypeChange = (type) => {
    dispatch(changeSelectedRailcarType(type));
  };

  return (
    <div className="places__block">
      <div
        className={cn('places__change-train', {
          'places__change-train_return': direction === 'return',
        })}
      >
        <ArrowInRectangleLarge
          className={cn('arrow-in-rectangle__large', {
            arrow_left: direction === 'return',
          })}
        />
        <Button size="l" style="transparent-dark">
          Выбрать другой поезд
        </Button>
      </div>
      <div className="places__ticket-info">
        <div className="places__ticket-info_train-info">
          <div className="train-info__train-icon_wrapper">
            <TrainIcon className="train-info__train-icon" />
          </div>
          <div className="train-info__trip">
            <Header className="train-info__trip_header" size="xs">
              {train.name}
            </Header>
            <TripCities from={from} to={to} />
          </div>
        </div>
        <TicketDirection
          duration={duration}
          direction={direction}
          from={from}
          to={to}
        />
        <div className="places__ticket-info_time">
          <div className="icon__wrapper">
            <ClockIcon className="clock__icon" />
          </div>
          <div className="time__text">
            <div className="time__row">9 часов</div>
            <div className="time__row">42 минуты</div>
          </div>
        </div>
      </div>
      <div className="places__ticket-amount">
        <Header className="places__header" size="s">
          Количество билетов
        </Header>
        <TicketAmountForm />
      </div>
      <div className="places__railcar-type">
        <Header className="places__header" size="s">
          Тип вагона
        </Header>
        <ul className="railcar-type__buttons">
          {railcarTypes.map((item) => (
            <RailcarTypeButton
              disabled={!seatsInfo || !seatsInfo[item.name]}
              isSelected={selectedRailcarClass === item.name}
              onClick={onRailcarTypeChange}
              {...item}
            />
          ))}
        </ul>
      </div>
      {selectedRailcarClass && (
        <PlaceSelection railcarClass={selectedRailcarClass} />
      )}
    </div>
  );
};

const TicketAmountForm = () => {
  const dispatch = useDispatch();

  const {
    passengersAmount: { adult, child, baby },
  } = useSelector((state) => state.seats);

  const onInputChange = (type, number) => {
    dispatch(changeTicketsAmount({ type, number }));
  };

  return (
    <form className="ticket-amount__form">
      <TicketAmountBlock
        name="adult"
        label="Взрослых"
        value={adult.amount}
        onInputChange={onInputChange}
        {...adult}
      />
      <TicketAmountBlock
        name="child"
        label="Детских"
        value={child.amount}
        onInputChange={onInputChange}
        {...child}
      />
      <TicketAmountBlock
        name="baby"
        label="Детских «без места»"
        value={baby.amount}
        onInputChange={onInputChange}
        {...baby}
      />
    </form>
  );
};

const TicketAmountBlock = ({ name, limit, amount, ...props }) => {
  return (
    <div className="ticket-amount__block">
      <TicketAmountInput name={name} max={limit} {...props} />
      <div className="ticket-amount__block_description">
        {(() => {
          switch (name) {
            case 'adult':
              return `Можно добавить еще ${limit - amount} пассажиров`;
            case 'child':
              return `Можно добавить еще ${
                limit - amount
              } детей до 10 лет. Свое место в вагоне, как у взрослых, но дешевле 
                в среднем на 50-65%`;
            case 'baby':
              return `Можно добавить еще ${limit - amount} детей без места`;
          }
        })()}
      </div>
    </div>
  );
};

const TicketAmountInput = ({ label, max, name, onInputChange, ...props }) => {
  const handleInputChange = ({ target: { value } }) => {
    onInputChange(name, value);
  };

  return (
    <label className="ticket-amount__input_label">
      <div className="ticket-amount__input_text">{label} — </div>
      <input
        className="ticket-amount__input"
        name={name}
        min={0}
        max={max}
        type="number"
        placeholder="0"
        onChange={handleInputChange}
        {...props}
      />
    </label>
  );
};

const RailcarTypeButton = ({
  Icon,
  label,
  onClick,
  isSelected,
  disabled,
  name,
}) => {
  const handleClick = () => {
    onClick(name);
  };

  return (
    <button
      disabled={disabled}
      className={cn('railcar-type__button', { selected: isSelected })}
      onClick={handleClick}
      type="button"
    >
      <div className="railcar-type__icon_wrapper">
        <Icon className="railcar-type__icon" />
      </div>
      <div className="railcar-type__title">{label}</div>
    </button>
  );
};
