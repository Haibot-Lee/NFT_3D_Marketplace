# Project env
NodeJS v16 and above

# prepare env
    npm install

# compile contracts 
#### After compile, we will get the abi info in artifacts
    npx hardhat compile

# deploy contracts
#### default network is Mumbai
    npx hardhat run scripts/deploy.js --network <network_name>