import { DefaultTheme } from "react-native-paper";

// let customFonts = {
//   'Rubik-Regular': require('./assets/fonts/Rubik-Regular.ttf'),
//   'Rubik-Black': require('./assets/fonts/Rubik-Black.ttf'),
//   'Rubik-Light': require('./assets/fonts/Rubik-Light.ttf'),
//   'Rubik-LightItalic': require('./assets/fonts/Rubik-LightItalic.ttf'),
// }

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primaryDark: "#00002A",
    primary: "#000852",
    accent: "#1700F3",
    warn: "#F44336",
    background: "#F7F6FB",
    primaryDarkText: "#ffffff", // when background is primaryDark
    primaryText: "#ffffff", // when background is primary
    accentText: "#ffffff", // when background is accent
    warnText: "#ffffff", // when background is accent
    backgroundText: "#000", // color for text with background color
    textDark: "#000000",
    textLight: "#ffffff",
    darkGrey: "#4f4f4f",
    lightGrey: "#DCDCDC",
    drawerBackgroud: "#fff",
    drawerTintColor: "#008cba",
    drawerColor: "#000852",
    disable: "#A3A3A3",
    transparent: "#00000000",
    //appBackground: '#F5F7F8',
    appBackground: '#EFF2F7',
    success: '#4CAF50'
  },
};
