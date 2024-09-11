pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./safeMath.sol";
import "./escrow.sol";

contract Orderbook is SafeMath {
    struct sellOrder {
        address seller;
        uint256 Price;
        uint256 numberOfToken;
    }

    sellOrder[] public sOrders;
    ERC20 _token;

    escrow Escrow = new escrow();

    constructor(ERC20 token) {
        _token = token;
    }

    event buyOrder(address buyer, uint256 numberOfToken, uint256 atPrice);

    function sell(
        uint256 _price,
        uint256 _numberOfToken
    ) external returns (bool) {
        require(_numberOfToken > 0, "Token must be greater than zero");
        sellOrder memory sellorder;
        sellorder.seller = msg.sender;
        sellorder.Price = _price;
        sellorder.numberOfToken = _numberOfToken;

        bool flag;

        if(sOrders.length > 0) {
            for (uint i = 0; i < sOrders.length; i++) {
                if(
                    msg.sender == sOrders[i].seller &&
                    sOrders[i].Price == _price
                ) {
                    sOrders[i].numberOfToken += _numberOfToken;
                    _token.transferFrom(
                        msg.sender,
                        address(this),
                        _numberOfToken
                    );
                    _token.transfer(address(Escrow), _numberOfToken);
                    flag = true;
                    break;
                }
            }
        }
        if (flag == false) {
            sOrders.push(sellorder);
            _token.transferFrom(msg.sender, address(this), _numberOfToken);
            _token.transfer(address(Escrow), _numberOfToken);
        }
        return true;
    }

    function Buy(uint256 numberOfTokenBuy, uint256 atPrice) external payable returns (bool) {
        require(sOrders.length > 0, "Zero orders for sell");
        require(msg.value == atPrice, "msg.value != atPrice");
        bool flag = false;
        for (uint i = 0; i < sOrders.length; i++) {
            if (
                atPrice == sOrders[i].Price &&
                sOrders[i].numberOfToken >= numberOfTokenBuy
            ) {
                payable(sOrders[i].seller).transfer(atPrice);
                Escrow._transfer(_token, msg.sender, numberOfTokenBuy);
                sOrders[i].numberOfToken = sub(
                    sOrders[i].numberOfToken,
                    numberOfTokenBuy
                );
                if (sOrders[i].numberOfToken == 0) {
                    uint j = i;
                    for (j; j < sOrders.length -1; j++) {
                        sOrders[j] = sOrders[j + 1];
                        delete sOrders[j + i];
                    }
                }
                emit buyOrder(msg.sender, numberOfTokenBuy, atPrice);
                flag = true;
            } else {
                flag = false;
            }
        }
        return flag;
    }

    function getBalance(address _account) public view returns (uint256) {
        return _token.balanceOf(_account);
    }
}