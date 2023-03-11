import React, {Suspense, useContext, useEffect, useState} from 'react';

import sky from './assets/bg.jpeg'
import gallery from './assets/gallery.glb'
import 'aframe';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import Model from './Model'
import UserContext from "../Components/UserContext";
import web3Modal from "../Components/Web3Config";
import {ethers} from "ethers";
import MarketContract from "../contracts/MarketPlace.json";
import NftContract from "../contracts/NFT.json";

const posList = [
    {x: -21, y: 0, z: -3.7, ry: 90},
    {x: -21, y: 0, z: -9.8, ry: 90},
    {x: -21, y: 0, z: -15.2, ry: 90},
    {x: 20, y: 0, z: -3.7, ry: -90},
    {x: 20, y: 0, z: -9.8, ry: -90},
    {x: 20, y: 0, z: -15.2, ry: -90},
]
export default function MarketSpace(props) {
    const userCtx = useContext(UserContext);
    const [myNftList, setMyNftList] = useState([]);


    async function getMyTokens(address) {
        var res = await window.mktContract.getMyTokens(address);
        setMyNftList(res);
        console.log("My Token" + JSON.stringify(res))
    }

    async function init() {
        // // connect wallet
        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        // sign contract
        const signer = provider.getSigner();
        console.log("Signer: " + signer);

        // get address
        const addr = await signer.getAddress();
        console.log("Address: " + addr);

        // get balance
        const bal = await provider.getBalance(addr);
        console.log("Balance: " + ethers.utils.formatEther(bal));

        userCtx.setContext({
            address: addr,
            balance: ethers.utils.formatEther(bal),
        })

        // init contract
        // market
        const mktContract = new ethers.Contract(process.env.REACT_APP_MARKETPLACE, MarketContract.abi, signer);
        console.log(mktContract);
        window.mktContract = mktContract;

        // nft
        const nftContract = new ethers.Contract(process.env.REACT_APP_NFT, NftContract.abi, signer);
        console.log(nftContract);
        window.nftContract = nftContract;

        console.log("Finished initialized");

        getMyTokens(addr);
    }

    useEffect(() => {
        init();
    }, [])

    const loader = new GLTFLoader();
    loader.load(gallery, (d) => {
        const entity = document.getElementById("gallery");
        entity.object3D.add(d.scene);
    });

    return (
        <a-scene>
            <a-assets>
                <img id="sky" src={sky}/>
            </a-assets>
            <a-sky color="#FFFFFF"
                   material={"src: #sky"}
                   rotation="0 0 0"/>
            <a-entity id="gallery" position="0 0 0" rotation="0 90 0" scale="2.5 2.5 2.5"></a-entity>

            {posList.map((pos, idx) => (
                <Model token={myNftList[idx] ? myNftList[idx]['uri'] : null} x={pos.x} y={pos.y} z={pos.z} ry={pos.ry}/>
            ))}

            <a-camera>
                <a-cursor/>
            </a-camera>
        </a-scene>
    );
}
