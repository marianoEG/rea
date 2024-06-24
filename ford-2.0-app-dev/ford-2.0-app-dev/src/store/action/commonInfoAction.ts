import { Screens } from '../../navigation/Screens';
import { CommonInfoAction } from '../reducer/commonInfoReducer';

export const setCurrentScreen = (screen?: Screens): CommonInfoAction => ({
  type: "set-current-screen",
  payload: { screen }
});
