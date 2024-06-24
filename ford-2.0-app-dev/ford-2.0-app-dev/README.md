- node version 16.15.0
- npx version 8.5.5
- yarn verison 1.22.5
- lineas de comandos:
    - creación de proyecto: npx react-native init FordEvents --template react-native-template-typescript
    - instalación de navigation: 
        - yarn add @react-navigation/native @react-navigation/native-stack
        - yarn add react-native-screens react-native-safe-area-context


IMPORTANTE!!!

add to Podfile: https://www.npmjs.com/package/react-native-sha256

Para un correcto funcionamiento en IOS, se debe ejecutar la siguiente linea desde una mac:
    npx pod-install ios

Run on Specific device:
    react-native run-android --deviceId=ZY22F43ZXM

Solucion a error ViewPropTypes 

copiar en esta ruta node_modules\react-native-camera\src\RNCamera.js la sigiente importacion  
    ***import { ViewPropTypes } from 'deprecated-react-native-prop-types';***  
y comentar "ViewPropTypes" en la linea 8
