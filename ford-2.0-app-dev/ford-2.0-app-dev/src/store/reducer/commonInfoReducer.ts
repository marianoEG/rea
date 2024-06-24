import { Screens } from '../../navigation/Screens';

interface CommonInfoState {
  currentScreen?: Screens
}

const defaultState: CommonInfoState = {
  currentScreen: undefined
};

export type CommonInfoAction = { type: "set-current-screen", payload: { screen?: Screens } };

export function commonInfoReducer(state: CommonInfoState | undefined = defaultState, action: CommonInfoAction): CommonInfoState {
  switch (action.type) {
    case "set-current-screen":
      return {
        ...state,
        currentScreen: action.payload.screen
      };
    default:
      return state;
  }
}