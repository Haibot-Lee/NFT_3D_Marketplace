cp .env env.tmp
npm install
npx hardhat compile
echo -e `npx hardhat run scripts/deploy.js` >> env.tmp
mv env.tmp ../.env

mkdir ../src/contracts
cp artifacts/contracts/MarketPlace.sol/MarketPlace.json ../src/contracts/MarketPlace.json
cp artifacts/contracts/NFT.sol/NFT.json ../src/contracts/NFT.json
