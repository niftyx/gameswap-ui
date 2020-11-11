import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    * {
      font-family: 'Catamaran', sans-serif;
      box-sizing: border-box;
    }
  }
`;

export default GlobalStyle;
