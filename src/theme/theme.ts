import { DefaultTheme } from '@react-navigation/native';
import { extendTheme } from 'native-base';

const MAINBACKGROUNDCOLOR = 'rgb(45, 45, 45)';
const PRIMARYCOLOR = 'rgb(255,255,255)';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: PRIMARYCOLOR,
    background: MAINBACKGROUNDCOLOR,
    card: MAINBACKGROUNDCOLOR,
    text: PRIMARYCOLOR,
  },
};

const nativeBaseTheme = extendTheme({
  components: {
    Text: {
      variants: {
        noWorkouts: {
          color: PRIMARYCOLOR,
        },
        workout: {
          color: MAINBACKGROUNDCOLOR,
        },
        error: { color: 'rgb(255, 15, 63)', fontSize: 10 },
      },
    },
    Button: { defaultProps: { colorScheme: MAINBACKGROUNDCOLOR } },
    Radio: { defaultProps: { colorScheme: MAINBACKGROUNDCOLOR } },
  },
});

export const THEME = { nativeBaseTheme, navigationTheme, MAINBACKGROUNDCOLOR, PRIMARYCOLOR };
