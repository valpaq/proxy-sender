// SPDX-License-Identifier: NONLICENSED
pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ProxySender{
    IERC20 usdt;

    constructor(address _usdt){
        usdt = IERC20(_usdt);
    }

    function resendAny(address _contractAddress, uint256 _amount, address _to) external {
        IERC20 token = IERC20(_contractAddress);
        token.transferFrom(msg.sender, address(this), _amount);
        token.transfer(_to, _amount);
    }
    
    function resendUSDT(uint256 _amount, address _to) external {
        usdt.transferFrom(msg.sender, address(this), _amount);
        usdt.transfer(_to, _amount);
    }

    function resendETH(address _to) external payable {
        payable(_to).transfer(msg.value);
    }
}
