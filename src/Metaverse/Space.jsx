import React, {useContext, useEffect, useState} from 'react';

import sky from './assets/bg.jpeg'
import gallery from './assets/space.glb'
import 'aframe';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import MyModel from './MyModel'
import UserContext from "../Components/UserContext";
import web3Modal from "../Components/Web3Config";
import {ethers} from "ethers";
import MarketContract from "../contracts/MarketPlace.json";
import NftContract from "../contracts/NFT.json";

const posList = [
    {x: -21, y: -1, z: 4.3, ry: 90},
    {x: -21, y: -1, z: -1.8, ry: 90},
    {x: -21, y: -1, z: -7.2, ry: 90},
    {x: 20, y: -1, z: 4.3, ry: -90},
    {x: 20, y: -1, z: -1.8, ry: -90},
    {x: 20, y: -1, z: -7.2, ry: -90},
]
export default function Space(props) {
    const userCtx = useContext(UserContext);
    const [myNftList, setMyNftList] = useState([]);

    async function getMyTokens(address) {
        var res = await window.mktContract.getMyTokens(address);
        setMyNftList(res);
        console.log("My Token" + JSON.stringify(res))
    }

    async function init() {
        if (!window?.ethereum?.isConnected()) {
            alert("Please follow the guideline and install Metamask first!");
            return;
        }

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
    }

    useEffect(() => {
        if (window?.ethereum?.isConnected()) init();
    }, [])

    useEffect(() => {
        getMyTokens(userCtx.address);
        console.log("Update My Space");
    }, [userCtx])

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
            <a-entity id="gallery" position="0 -1 8" rotation="0 90 0"></a-entity>

            {posList.map((pos, idx) => (
                <MyModel token={myNftList[idx] ? myNftList[idx]['uri'] : ''} x={pos.x} y={pos.y} z={pos.z}
                         ry={pos.ry} scale={pos.scale}/>
            ))}

            <a-camera>
                <a-cursor/>
            </a-camera>
        </a-scene>
    );
}
