# Project env

NodeJS v16 and above\
Prepare your own .env file as the .env.template

# Reset the smart contracts on Mumbai test-net, you can just run

    sh ./backend/setEnv.sh

# Or you can run commands step by step

## 1. prepare env

    cd backend
    npm install

## 2. compile contracts

#### After compile, we will get the abi info in artifacts

    npx hardhat compile

## 3. deploy contracts

#### default network is Mumbai

    npx hardhat run scripts/deploy.js --network <network_name>

## 4. add contracts info. to web

    mkdir ../src/contracts
    cp artifacts/contracts/MarketPlace.sol/MarketPlace.json ../src/contracts/MarketPlace.json
    cp artifacts/contracts/NFT.sol/NFT.json ../src/contracts/NFT.json