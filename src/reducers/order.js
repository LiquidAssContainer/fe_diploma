import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { apiService } from 'services/apiService';

// const defaultRailcarList = { first: [], second: [], third: [], fourth: [] };

const initialState = {
  passengerForms: [],
  payment: { personalData: '', method: null },
};

export const getSeatsDetailAsync = createAsyncThunk(
  'search/fetchSeatsDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.routes.seatsDetail(id);
      return await response.json();
    } catch (e) {
      return rejectWithValue('Что-то пошло не так :(');
    }
  },
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setTripInfo: (state, { payload: { from, to, ...info } }) => {
      state.tripInfo = { ...info, from, to };
    },
    changeSelectedRailcarType: (state, { payload }) => {
      state.selectedRailcarClass = payload;
    },
    changeRailcarSelection: (state, { payload: { id, railcarClass } }) => {
      const list = current(state.seatsInfo[railcarClass]);

      const railcarIndex = list.findIndex(({ coach: { _id } }) => id === _id);
      const railcar = list[railcarIndex];
      const { isSelected } = railcar.coach;

      state.seatsInfo[railcarClass][railcarIndex].coach.isSelected =
        !isSelected;
    },
    changeFeatureSelection: (state, { payload: { id, feature, value } }) => {
      const railcar = state.selectedFeatures[id];
      if (!railcar) {
        state.selectedFeatures[id] = {};
      }
      state.selectedFeatures[id][feature] = value;
    },
    changePrice: (state, { payload }) => {
      // const { amount: adultAmount } = state.passengersAmount.adult;
      // const { amount: childAmount } = state.passengersAmount.child;

      // const isChildPrice = state.selectedSeats.length > adultAmount;
      // const priceDiff = isChildPrice ? payload / 2 : payload;
      // state.totalPrice = state.totalPrice + priceDiff;

      state.totalPrice = state.totalPrice + payload;
    },
    changeTicketsAmount: (state, { payload: { type, number } }) => {
      const limit = state.passengersAmount[type].limit;

      switch (type) {
        case 'adult':
          if (number <= limit) {
            state.passengersAmount.adult.amount = number;
            state.passengersAmount.child.limit = number * 2;
            state.passengersAmount.baby.limit = number;
          }
        case 'child':
        case 'baby':
          if (number <= limit) {
            state.passengersAmount[type].amount = number;
          }
      }
      for (const type of ['child', 'baby']) {
        const { amount, limit } = state.passengersAmount[type];
        if (amount > limit) {
          state.passengersAmount[type].amount = limit;
        }
      }

      const { adult, child } = current(state.passengersAmount);
      state.selectedAmount = Number(adult.amount) + Number(child.amount);
    },
    changeSeatSelection: (
      state,
      { payload: { placeNumber, railcarId, railcarClass, value, priceDiff } },
    ) => {
      const list = current(state.seatsInfo[railcarClass]);

      const railcarIndex = list.findIndex(
        ({ coach: { _id } }) => railcarId === _id,
      );

      if (value) {
        state.selectedSeats.push({ id: railcarId, number: placeNumber });
      } else {
        const selectedSeatIndex = state.selectedSeats.findIndex(
          ({ id, number }) => id === railcarId && number === placeNumber,
        );
        state.selectedSeats.splice(selectedSeatIndex, 1);
      }

      const seatIndex = placeNumber - 1;
      // ужас
      state.seatsInfo[railcarClass][railcarIndex].seats[seatIndex].isSelected =
        value;
    },
  },
  extraReducers: {
    [getSeatsDetailAsync.fulfilled]: (state, { payload }) => {
      state.seatsInfo = payload.reduce((acc, { coach, seats }) => {
        const type = coach.class_type;
        let isSelected = false;
        if (!acc[type]) {
          acc[type] = [];
          isSelected = true;
        }
        acc[type].push({ coach: { isSelected, ...coach }, seats });
        return acc;
      }, {});
    },
  },
});

export const { setTripInfo } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
