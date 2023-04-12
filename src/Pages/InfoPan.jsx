import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";
import React from "react";
import {useTheme} from "@mui/material/styles";

export default function InfoPan() {
    const theme = useTheme();

    async function addNetwork() {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainName: 'Polygon Testnet',
                    rpcUrls: ['https://polygon-mumbai.g.alchemy.com/v2/L8tYmA2PaCBL7CVlu0qHwhvuxlAHrKYz'],
                    chainId: '0x13881',
                    nativeCurrency: {
                        "name": "MATIC",
                        "symbol": "MATIC",
                        "decimals": 18
                    },
                    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
                },
            ],
        }).then((result) => {
            alert('Polygon Testnet is added to MetaMask!');
        }).catch((error) => {
            if (error.code === 4902) {
                alert('This chain is added to MetaMask already!');
            } else {
                alert('Failed to add this new network to MetaMask!' + error);
            }
        });

    }

    return (
        <>
            <Typography align={"left"} variant="h6" fontWeight="bold" color={theme.palette.warning.main}>
                Get Started:
            </Typography>
            <Typography sx={{pb: 1}} align={"left"} variant="body1" fontWeight="bold"
                        color={theme.palette.success.dark}>
                # You are recommended to Chrome browser to use this website.
            </Typography>
            <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                1. Prepare you own wallet, and connect to the website. Get Metamask extension for your chrome
                browser&nbsp;
                <a type="button" target='_blank'
                   href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">HERE</a>.
            </Typography>
            <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                2. Add a test network to your wallet. Please refer to the information below.
                Then connect to the website. Or click&nbsp;
                <a type="button" href="#" onClick={() => addNetwork()}>HERE</a>.
            </Typography>
            <Box sx={{m: 1, p: 1, border: 1, borderColor: 'white'}}>
                <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                    Network name: Polygon Testnet
                </Typography>
                <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                    New RPC URL: <br/>https://polygon-mumbai.g.alchemy.com/v2/L8tYmA2PaCBL7CVlu0qHwhvuxlAHrKYz
                </Typography>
                <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                    Chain ID: 80001
                </Typography>
                <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                    Currency Symbol: MATIC
                </Typography>
                <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                    Block Explorer URL: <br/>https://mumbai.polygonscan.com/
                </Typography>
            </Box>
            <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                3. Get MATIC for your wallet from &nbsp;
                <a type="button" target='_blank' href="https://mumbaifaucet.com/">HERE</a>
                &nbsp; to make transactions.
            </Typography>
        </>
    )
}