import { createContext, useContext } from 'react';

export type Theme = 'navy' | 'gold' | 'blue' | 'light';

export interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'navy',
    setTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);
