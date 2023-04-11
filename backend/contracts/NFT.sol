// Miss. LU Si for the original contribution. Reference:
// LU, S. (2022). Blockchain System for NFT Application. Retrieved from https://fyp.comp.hkbu.edu.hk/fyp/sys/prd/std/arch_get_file.php?file=6513&sub=4333

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;
    mapping(uint256 => string) _tokenURIs;

    address contractAddress;

    constructor(address marketplaceAddress) ERC1155(""){
        contractAddress = marketplaceAddress;
        _tokenIds.increment();
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function mint(string memory ipfsToken) public {
        //Get the current token id, and then increment it.
        uint256 newId = _tokenIds.current();
        _tokenIds.increment();

        //Create one token of token newId, and assign it to msg.sender.
        _mint(msg.sender, newId, 1, "");
        //Set the ipfsToken for the token newId.
        _tokenURIs[newId] = ipfsToken;
        //Grants or revokes permission to the marketplaceAddress to transfer the caller’s tokens.
        setApprovalForAll(contractAddress, true);
    }

    function getNumber() public view returns (uint256){
        return _tokenIds.current();
    }

    function setApproval() public {
        setApprovalForAll(contractAddress, true);
    }

}
