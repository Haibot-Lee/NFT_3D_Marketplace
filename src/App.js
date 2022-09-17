import React, {useState, useContext, useEffect} from 'react';
import {BrowserRouter, Route, Routes, Navigate, useLocation} from "react-router-dom";
import {ThemeProvider, useTheme, createTheme} from '@mui/material/styles';

import './App.css';
import Menu from './Menu.tsx'
import Home from './Pages/Home';
import Market from './Pages/Market';
import Profile from './Pages/Profile';

export default function App() {

    const [mode, setMode] = useState(localStorage.getItem('themeMode') ? localStorage.getItem('themeMode') : 'dark');

    const getDesignTokens = (mode) => ({
        palette: {mode},
    });
    const darkModeTheme = createTheme(getDesignTokens(mode));

    return (
        <div className="App">
            <ThemeProvider theme={darkModeTheme}>
                <BrowserRouter>
                    <Menu/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/market" element={<Market/>}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
}
