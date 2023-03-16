// LU Si for the original contribution

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

    function mint(string memory uri) public {
        uint256 newId = _tokenIds.current();
        _mint(msg.sender, newId, 1, "");
        _setTokenURI(newId, uri);
        _tokenIds.increment();
        setApprovalForAll(contractAddress, true);
    }

    function getNumber() public view returns (uint256){
        return _tokenIds.current();
    }

    function setApproval() public {
        setApprovalForAll(contractAddress, true);
    }

}
