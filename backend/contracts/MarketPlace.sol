// LU Si for the original contribution

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MarketPlace {
    using SafeMath for uint256;

    uint256 private itemId = 0;
    uint256 private recordId = 0;
    uint256 private tradeId = 0;
    address payable platformOwner;
    uint256 private restValue = 0;

    struct TradeItem {
        uint256 _itemId;
        uint256 _tokenId;
        uint256 initialSupply;
        uint256 publicSupply;
        address token;
        address creator;
        uint256 price;
        string uri;
        uint256 royaltyAmount;
    }

    struct Trade {
        uint256 _tradeId;
        uint256 _tokenId;
        address poster;
        address token;
        uint256 price;
        uint256 amount;
        string uri;
        bool auction;
    }

    struct History {
        uint256 _recordId;
        uint256 _tokenId;
        address seller;
        address buyer;
        uint256 price;
        uint256 amount;
        string time;
        string des;
    }

    struct Auction {
        uint256 _tradeId;
        address beneficiary;
        uint256 auctionStart;
        uint256 biddingTime;
        address highestBidder;
        uint256 highestBid;
        bool ended;
    }

    mapping(uint256 => TradeItem) public TradeItems;
    mapping(uint256 => Trade) public trades;
    mapping(uint256 => History) public history;
    mapping(uint256 => Auction) public auctions;


    constructor () {
        platformOwner = payable(msg.sender);
    }

    function getAllTokens() public view returns (Trade[] memory) {
        uint itemCount = tradeId;
        uint unsoldItemCount = 0;
        for (uint256 i = 0; i < itemCount; i++) {
            if (trades[i + 1].amount > 0) {
                unsoldItemCount += 1;
            }
        }

        Trade[] memory res = new Trade[](unsoldItemCount);
        uint256 counter = 0;
        for (uint256 i = 0; i < itemCount; i++) {
            if (trades[i + 1].amount > 0) {
                res[counter] = trades[i + 1];
                counter++;
            }
        }

        return res;
    }

    function getSellingTokens(address sender) public view returns (Trade[] memory) {
        uint itemCount = tradeId;
        uint Count = 0;
        for (uint256 i = 0; i < itemCount; i++) {
            if (trades[i + 1].poster == sender) {
                Count += 1;
            }
        }

        Trade[] memory res = new Trade[](Count);
        uint256 counter = 0;
        for (uint256 i = 0; i < itemCount; i++) {
            if (trades[i + 1].poster == sender) {
                res[counter] = trades[i + 1];
                counter++;
            }
        }

        return res;
    }

    function changePrice(uint256 _tradeId, uint256 _price, string memory time) public {
        //Check if the token owner is changing the price
        Trade memory trade = trades[_tradeId];
        require(msg.sender == trade.poster, "Not the owner");

        //Update the price of trade record
        trades[_tradeId].price = _price;
        recordId += 1;
        history[recordId] = History({
        _recordId : recordId,
        _tokenId : trade._tokenId,
        seller : trade.poster,
        buyer : address(0),
        price : _price,
        amount : trade.amount,
        time : time,
        des : "Change price"
        });
    }

    function getMyTokens(address sender) public view returns (TradeItem[] memory){
        uint256 totalItemCount = itemId;
        uint itemCount = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            uint256 balance = IERC1155(TradeItems[i + 1].token).balanceOf(sender, i + 1);
            if (balance > 0) {
                itemCount += 1;

            }
        }

        TradeItem[] memory result = new TradeItem[](itemCount);

        uint256 resultIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            uint256 balance = IERC1155(TradeItems[i + 1].token).balanceOf(sender, i + 1);
            if (balance > 0) {
                result[resultIndex] = TradeItems[i + 1];
                resultIndex++;

            }
        }
        return result;
    }

    function fetchItemsCreated(address sender) public view returns (TradeItem[] memory) {
        uint totalItemCount = itemId;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (TradeItems[i + 1].creator == sender)
            {
                itemCount += 1;
            }
        }

        TradeItem[] memory items = new TradeItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (TradeItems[i + 1].creator == sender)
            {
                items[currentIndex] = TradeItems[i + 1];
                currentIndex += 1;
            }
        }

        return items;
    }

    function getNumber() public view returns (uint256){
        return itemId;
    }

    function listToken(address token, uint256 _tokenId, string memory uri, string memory time, uint256 royalty) public returns (uint256){
        if (royalty > 100) {
            royalty = 100;
        } else if (royalty < 0) {
            royalty = 0;
        }
        //Create a new item in this marketplace
        itemId += 1;
        TradeItems[itemId] = TradeItem({
        _itemId : itemId,
        _tokenId : _tokenId,
        initialSupply : 1,
        publicSupply : 0,
        token : token,
        creator : msg.sender,
        price : 0,
        uri : uri,
        royaltyAmount : royalty
        });

        //Update transactions on this token
        recordId += 1;
        history[recordId] = History({
        _recordId : recordId,
        _tokenId : itemId,
        seller : msg.sender,
        buyer : address(0),
        price : 0,
        amount : 1,
        time : time,
        des : "Created"
        });

        return itemId;
    }

    function getHistory(uint256 id) public view returns (History[] memory){
        uint itemCount = recordId;
        uint count = 0;
        for (uint256 i = 0; i < itemCount; i++) {
            if (history[i + 1]._tokenId == id) {
                count += 1;
            }
        }

        History[] memory res = new History[](count);
        uint256 counter = 0;
        for (uint256 i = 0; i < itemCount; i++) {
            if (history[i + 1]._tokenId == id) {
                res[counter] = history[i + 1];
                counter++;
            }
        }
        return res;
    }

    function getAuction(uint256 id) public view returns (Auction memory){
        return auctions[id];
    }

    function publicToAll(uint256 _itemId, uint256 _price, bool _auction, uint256 _bidEndTime) public {
        TradeItem memory token = TradeItems[_itemId];
        //Check if the token is published by the msg.sender
        uint256 itemCnt = IERC1155(TradeItems[_itemId].token).balanceOf(msg.sender, _itemId);
        require(itemCnt == 1, "No such token, or publish to marketplace already");

        //Add one record of trade
        tradeId += 1;
        trades[tradeId] = Trade({
        _tradeId : tradeId,
        _tokenId : token._tokenId,
        poster : msg.sender,
        token : token.token,
        price : _price,
        amount : 1,
        uri : token.uri,
        auction : _auction
        });

        //If the trade type is auction, add one record of auction
        if (_auction == true) {
            auctions[tradeId] = Auction({
            _tradeId : tradeId,
            beneficiary : msg.sender,
            auctionStart : block.timestamp,
            biddingTime : _bidEndTime,
            highestBidder : address(0),
            highestBid : 0,
            ended : false
            });
        }

        //Transfers current token from msg.sender to this marketplace.
        IERC1155(token.token).safeTransferFrom(msg.sender, address(this), token._tokenId, 1, "");
    }


    function buy(uint256 _tradeId, string memory time) public payable {
        //Check if buyer is seller. User cannot buy their own NFT.
        Trade memory trade = trades[_tradeId];
        require(trade.poster != msg.sender, "Seller not to be buyer");

        //Transfers current token from this marketplace to msg.sender.
        IERC1155(trade.token).safeTransferFrom(address(this), msg.sender, trade._tokenId, 1, "");

        uint totalItemCount = itemId;
        for (uint i = 0; i < totalItemCount; i++) {
            if (TradeItems[i + 1]._tokenId == trade._tokenId) {
                uint royalty = mulDiv(msg.value, TradeItems[i + 1].royaltyAmount, 100);
                //Transfer currency to NFT creator (royalties payment).
                payable(TradeItems[i + 1].creator).transfer(royalty);
                //Transfer currency to seller/trade.poster.
                payable(trade.poster).transfer(msg.value - royalty);
                break;
            }
        }

        //Update transactions on this token
        recordId += 1;
        history[recordId] = History({
        _recordId : recordId,
        _tokenId : trade._tokenId,
        seller : trade.poster,
        buyer : msg.sender,
        price : trade.price,
        amount : 1,
        time : time,
        des : "Buy"
        });

        //Remove the trade item from the marketplace
        trades[_tradeId].amount = trades[_tradeId].amount - 1;
        if (trades[_tradeId].amount == 0) {
            trades[_tradeId].poster = address(0);
        }

    }

    function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function bid(uint256 _tradeId, uint256 _now, string memory time, uint256 _price) public payable {
        //Check if the auction is ended, and the price is higher than the highest bid.
        Auction memory auction = auctions[_tradeId];
        require(_now <= auction.biddingTime, "over time");
        require(_price > auction.highestBid, "Not enough price");

        //Update transactions on this token.
        Trade memory trade = trades[_tradeId];
        recordId += 1;
        history[recordId] = History({
        _recordId : recordId,
        _tokenId : trade._tokenId,
        seller : msg.sender,
        buyer : address(0),
        price : _price,
        amount : 1,
        time : time,
        des : "Bid"
        });
        trades[_tradeId].price = _price;

        //Update the highest bidder and highest bid price.
        auctions[_tradeId].highestBidder = msg.sender;
        auctions[_tradeId].highestBid = _price;
    }

    function auctionEnd(uint256 _tradeId, string memory _time) public payable {
        Auction memory auction = auctions[_tradeId];
        Trade memory trade = trades[_tradeId];
        require(msg.sender == auction.highestBidder, "correct highestBidder");
        require(msg.value == auction.highestBid, "Not correct price");

        //Transfers current token from this marketplace to msg.sender.
        IERC1155(trade.token).safeTransferFrom(address(this), auction.highestBidder, trade._tokenId, 1, "");
        uint totalItemCount = itemId;
        for (uint i = 0; i < totalItemCount; i++) {
            if (TradeItems[i + 1]._tokenId == trade._tokenId) {
                uint royalty = mulDiv(msg.value, TradeItems[i + 1].royaltyAmount, 100);
                //Transfer currency to NFT creator (royalties payment).
                payable(TradeItems[i + 1].creator).transfer(royalty);
                //Transfer currency to seller/trade.poster.
                payable(auction.beneficiary).transfer(msg.value - royalty);
                break;
            }
        }

        //Update transactions on this token.
        recordId += 1;
        history[recordId] = History({
        _recordId : recordId,
        _tokenId : trade._tokenId,
        seller : trade.poster,
        buyer : auction.highestBidder,
        price : trade.price,
        amount : 1,
        time : _time,
        des : "Auction"
        });
        auctions[_tradeId].ended = true;

        //Remove the trade item from the marketplace
        trades[_tradeId].amount = 0;
        trades[_tradeId].poster = address(0);
    }

    function refund(uint256 _tradeId, string memory _time) public {
        Trade memory trade = trades[_tradeId];
        //Transfers current token from this marketplace to trade.poster.
        IERC1155(trade.token).safeTransferFrom(address(this), trade.poster, trade._tokenId, 1, "");

        //Update transactions on this token.
        recordId += 1;
        history[recordId] = History({
        _recordId : recordId,
        _tokenId : trade._tokenId,
        seller : address(0),
        buyer : msg.sender,
        price : trade.price,
        amount : 1,
        time : _time,
        des : "End auction and refund"
        });
        auctions[_tradeId].ended = true;

        //Remove the trade item from the marketplace
        trades[_tradeId].amount = 0;
        trades[_tradeId].poster = address(0);
    }

    function pay() public payable {}

    function mulDiv(uint x, uint y, uint z) public pure returns (uint){
        return (x.mul(y)).div(z);
    }

}
