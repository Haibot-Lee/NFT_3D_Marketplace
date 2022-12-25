# Project env
NodeJS v16 and above

# prepare env
    cd backend
    npm install

# compile contracts 
#### After compile, we will get the abi info in artifacts
    npx hardhat compile

# deploy contracts
#### default network is Mumbai
    npx hardhat run scripts/deploy.js --network <network_name>

# add contracts info. to web
    mkdir ../src/contracts
    cp artifacts/contracts/MarketPlace.sol/MarketPlace.json ../src/contracts/MarketPlace.json
    cp artifacts/contracts/NFT.sol/NFT.json ../src/contracts/NFT.json