async function main() {
    const marketplace = await ethers.getContractFactory("MarketPlace");
    const marketplace_deploy = await marketplace.deploy();
    console.log("Contract(MarketPlace) deployed to address:", marketplace_deploy.address);

    const nft = await ethers.getContractFactory("NFT");
    const nft_deploy = await nft.deploy(marketplace_deploy.address);
    console.log("Contract(NFT) deployed to address:", nft_deploy.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
