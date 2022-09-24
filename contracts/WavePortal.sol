// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "hardhat/console.sol";


contract WavePortal {

    uint totalWaves;
    uint private seed;
    Wave[] waves;
    mapping(address => uint) public lastWavedAt;
    struct Wave {
        address waver;
        string message;
        uint timestamp;
    }

    event NewWave(address indexed _from, uint timestamp, string message);

    constructor() payable {
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {

        require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp, "You just waved! Please wait 15 mins");

        totalWaves++;
        waves.push(Wave(msg.sender, _message, block.timestamp));
        lastWavedAt[msg.sender] = block.timestamp;

        seed = (block.timestamp + block.difficulty) % 100;

        if(seed < 50) {
            uint prizeAmount = 0.0001 ether;
            require(prizeAmount < address(this).balance, "Trying to withdraw more money than the contract has");
            (bool success, ) = (msg.sender).call{ value: prizeAmount }("");
            require(success, "Failed to withdraw money from the contract");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
        
    }

    function getTotalWaves() public view returns (uint) {
        return totalWaves;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

}