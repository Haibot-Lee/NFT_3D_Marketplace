import Web3Modal from "web3modal";

const web3Modal = new Web3Modal({
    network: process.env.REACT_APP_MUMBAI_TEST_URL,
    providerOptions: {},
});

export default web3Modal;