import React from 'react';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from './redux/store';

export default function Layout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
