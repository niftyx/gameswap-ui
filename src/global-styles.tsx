import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    
    

    @-moz-keyframes spin { 
      100% { 
        -moz-transform: rotate(-360deg); 
      } 
    }
    @-webkit-keyframes spin { 
      100% {
        -webkit-transform: rotate(-360deg); 
      } 
    }
    @keyframes spin { 
      100% { 
        -webkit-transform: rotate(-360deg); 
        transform:rotate(-360deg); 
      } 
    }
  }
`;

export default GlobalStyle;
