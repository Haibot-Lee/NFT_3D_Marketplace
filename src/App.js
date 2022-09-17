import React, {useState, useContext, useEffect} from 'react';

import './App.css';
import Home from './Pages/Home';
import Menu from './Menu.tsx'

import {ThemeProvider, useTheme, createTheme} from '@mui/material/styles';


export default function App() {

    const [mode, setMode] = useState(localStorage.getItem('themeMode') ? localStorage.getItem('themeMode') : 'dark');

    const getDesignTokens = (mode) => ({
        palette: {mode},
    });
    const darkModeTheme = createTheme(getDesignTokens(mode));

    return (
        <div className="App">
            <ThemeProvider theme={darkModeTheme}>
                <Menu/>
                <Home/>
            </ThemeProvider>
        </div>
    );
}
