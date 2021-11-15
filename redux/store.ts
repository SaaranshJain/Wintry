import { combineReducers, createStore } from 'redux';
import registerPage, { RegisterPageState } from '@/redux/registerPage/reducer';
import homePage, { HomePageState } from '@/redux/homePage/reducer';

export interface State {
    registerPage: RegisterPageState;
    homePage: HomePageState;
}

const store = createStore(
    combineReducers({
        registerPage,
        homePage,
    })
);

export default store;
