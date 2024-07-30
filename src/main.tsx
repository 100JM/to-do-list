import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';

import App from './App.tsx'
import './index.css'
import store from './store/store.tsx';

if(window.Kakao) {
  window.Kakao.init(import.meta.env.VITE_KAKAO_MAP_API_KEY);
  console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
