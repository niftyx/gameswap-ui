import {Theme} from '@material-ui/core/styles/createMuiTheme'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    custom: {
      appHeaderHeight: React.CSSProperties['height']
      appHeaderItemHeight: React.CSSProperties['height']
      header: {
        navItem: {
          fontSize: React.CSSProperties['fontSize']
          lineHeight: React.CSSProperties['lineHeight']
          fontWeight: React.CSSProperties['fontWeight']
        }
      }
    }
    colors: {
      border: {
        primary: string
      }
      icon: {
        active: string
        disabled: string
      }
      link: {
        default: string
      }
      background: {
        primary: string
        secondary: string
        third: string
      }
      text: {
        default: string
      }
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderHeight: React.CSSProperties['height']
      appHeaderItemHeight: React.CSSProperties['height']
      header: {
        navItem: {
          fontSize: React.CSSProperties['fontSize']
          lineHeight: React.CSSProperties['lineHeight']
          fontWeight: React.CSSProperties['fontWeight']
        }
      }
    }
    colors: {
      border: {
        primary: string
      }
      icon: {
        active: string
        disabled: string
      }
      link: {
        default: string
      }
      background: {
        primary: string
        secondary: string
        third: string
      }
      text: {
        default: string
      }
    }
  }
}

export enum THEME {
  White = "WHITE",
  Black = "BLACK",
}

export interface ISettings {
  theme: THEME;
  responsiveFontSizes: boolean;
}
