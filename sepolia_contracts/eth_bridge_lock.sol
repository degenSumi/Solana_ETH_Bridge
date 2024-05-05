// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

contract SolBridge {
    event BridgeERC20(address indexed sender,  string targetAddress, uint256 amount, address indexed token);
    event BridgeETH(address indexed sender, string targetAddress, uint256 amount);
    
    address private owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Lock ERC20 tokens
    function bridgeERC20(address token, uint256 amount, string memory targetAddress) external {
        require(amount > 0, "Amount must be greater than 0");

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        emit BridgeERC20(msg.sender, targetAddress, amount, token);
    }

    // Lock native ETH
    function bridgeETH(string memory targetAddress) external payable {
        require(msg.value > 0, "Sent ETH must be greater than 0");

        emit BridgeETH(msg.sender, targetAddress, msg.value);
    }

    // Fallback function to receive ETH
    receive() external payable {
    }

    // Fallback function to receive ETH with data
    fallback() external payable {
    }

    // Owner function to withdraw ERC20 tokens accidentally sent to this contract
    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        require(token != address(0), "Invalid token address");

        IERC20(token).transfer(owner, amount);
    }

    // Owner function to withdraw ETH accidentally sent to this contract
    function withdrawETH(uint256 amount) external onlyOwner {
        payable(owner).transfer(amount);
    }

    // Owner function to change contract owner
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");

        owner = newOwner;
    }
}