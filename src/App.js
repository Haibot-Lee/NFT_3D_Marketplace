import React, {useState, useContext, useEffect, useRef} from 'react';
import {BrowserRouter, Route, Routes, Navigate, useLocation} from "react-router-dom";
import {ThemeProvider, createTheme} from '@mui/material/styles';

import './App.css';
import Menu from './Menus/Menu'
import Navbar from './Menus/Navbar'
import Home from './Pages/Home';
import Market from './Pages/Market';
import Profile from './Pages/Profile';
import Detail from './Pages/Detail';
import Space from './Metaverse/Space';
import MktSpace from './Metaverse/MarketSpace';
import UserContext from './Components/UserContext';
import DetailContext from './Components/DetailContext'
import Toolbar from "@mui/material/Toolbar";

const useWillMount = (fn) => {
    const willMount = useRef(true);
    if (willMount.current && fn && typeof fn === 'function') {
        fn();
    }
    willMount.current = false;
}

export default function App() {
    const [userCtx, setUserCtx] = useState({});
    const [detailCtx, setDetailCtx] = useState({});

    const mergeUserCtx = (ctx) => {
        setUserCtx(prev => {
            const curr = {...prev, ...ctx};
            localStorage.setItem('userCtx', JSON.stringify(curr));
            return curr;
        });
    }
    const clearUserCtx = () => {
        setUserCtx(prev => {
            const curr = {};
            localStorage.setItem('userCtx', JSON.stringify(curr));
            return curr;
        });
    }

    const mergeDetailCtx = (ctx) => {
        setDetailCtx(prev => {
            const curr = {...prev, ...ctx};
            localStorage.setItem('detailCtx', JSON.stringify(curr));
            return curr;
        });
    }
    const clearDetailCtx = () => {
        setDetailCtx(prev => {
            const curr = {};
            localStorage.setItem('detailCtx', JSON.stringify(curr));
            return curr;
        });
    }

    useWillMount(() => {
        const ctx = JSON.parse(localStorage.getItem('userCtx'));
        if (ctx != null) setUserCtx(ctx);
        const detailCtx = JSON.parse(localStorage.getItem('detailCtx'));
        if (detailCtx != null) setDetailCtx(detailCtx);
    }, [])

    const getDesignTokens = (mode) => ({
        palette: {mode},
    });
    const darkModeTheme = createTheme(getDesignTokens('dark'));

    return (
        <div className="App">
            <UserContext.Provider value={{setContext: mergeUserCtx, clear: clearUserCtx, ...userCtx}}>
                <DetailContext.Provider value={{setContext: mergeDetailCtx, clear: clearDetailCtx, ...detailCtx}}>
                    <ThemeProvider theme={darkModeTheme}>
                        <BrowserRouter>
                            <Navbar/>
                            <Menu/>
                            <Toolbar/>
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/profile" element={<Profile/>}/>
                                <Route path="/market" element={<Market/>}/>
                                <Route path="/space" element={<Space/>}/>
                                <Route path="/mkt-space" element={<MktSpace/>}/>
                                <Route path="/detail" element={<Detail/>}/>
                            </Routes>
                        </BrowserRouter>
                    </ThemeProvider>
                </DetailContext.Provider>
            </UserContext.Provider>
        </div>
    );
}
