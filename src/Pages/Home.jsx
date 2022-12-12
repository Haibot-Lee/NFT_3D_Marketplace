import {ethers} from "ethers";
import Web3Modal from "web3modal";
import React, {useState, useEffect} from "react";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import {Button} from '@mui/material';

// web3Modal初始化
const web3Modal = new Web3Modal({
    network: process.env.REACT_APP_MUMBAI_TEST_URL,
    providerOptions: {}, // 额外设置
});

const contractAddr = process.env.REACT_APP_MARKETPLACE;
const abi = [
    {
        inputs: [
            {
                internalType: "string",
                name: "_greeting",
                type: "string",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "greet",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_greeting",
                type: "string",
            },
        ],
        name: "setGreeting",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

export default function Home() {
    const theme = useTheme();

    // connect wallet to get address and balance
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("");
    const [ens, setEns] = useState("");
    const [msg, setMsg] = useState("");
    const [contract, setContract] = useState({});

    // 取前四个后四个（简化）
    const shortenAddr = (addr) => addr.slice(0, 4) + "..." + addr.slice(-4);

    async function init() {
        // 连接上钱包之后instance储存我们钱包相关的连接资讯
        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        // 签署协议
        const signer = provider.getSigner();
        console.log(signer);

        // 取到用户的区块域信息
        const addr = await signer.getAddress();
        console.log(addr);
        setAddress(addr); // 加到setAddress中

        // 取到用户的余额
        const bal = await provider.getBalance(addr);
        // 转换解析余额并且加到setBalance中
        setBalance(ethers.utils.formatEther(bal));
        console.log(ethers.utils.formatEther(bal));

        // 初始化合约
        const _contract = new ethers.Contract(contractAddr, abi, signer);
        setContract(_contract);
        window.contract = _contract;

        setEns(await provider.lookupAddress(addr));

    }

    async function getMessage() {
        console.log(contract);
        // 获取greet
        const _msg = await contract.greet();
        setMsg(_msg);
        console.log(_msg);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <Stack>
            <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                hello {shortenAddr(address)}, {ens}, you have {balance} Ethers.
            </Typography>
            <Button variant="contained" onClick={() => {
                init()
            }}>
                Connect wallet
            </Button>
        </Stack>
    );
}

