import { Provider } from "react-redux";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { store } from './store';
import { AppRouter } from "./router/AppRouter";
import './assets/css/index.css';

export function App() {
  return (
    // Envolvemos a la app con el provider
    <Provider store={store}>
      <BrowserRouter>
      {/* <HashRouter> */}
        <AppRouter />
      </BrowserRouter>
      {/* </HashRouter> */}
    </Provider>
  );
}