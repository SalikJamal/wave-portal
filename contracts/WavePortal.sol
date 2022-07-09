// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "hardhat/console.sol";


contract WavePortal {

    uint totalWaves;
    uint private seed;
    Wave[] waves;
    mapping(address => uint) lastWavedAt;
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
        require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "You just waved! Please 30 seconds");

        totalWaves++;
        console.log("%s waved w/ message %s", msg.sender, _message);
        waves.push(Wave(msg.sender, _message, block.timestamp));
        lastWavedAt[msg.sender] += block.timestamp;

        seed = (block.timestamp + block.difficulty) % 100;
        console.log("Random # generated: %d", seed);

        if(seed < 50) {
            console.log("%s won!", msg.sender);
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

    // function addressExists(address _address) private view returns(bool) {

    //     for(uint i = 0;  i < wavers.length; i++) {
    //         if(wavers[i] == _address) return true;
    //     }

    //     return false;

    // }

    // function getMostWaves() public view returns(address, uint) {

    //     address maxWaverAddress;
    //     uint maxWaves = 0;

    //     for(uint i = 0; i < wavers.length; i++) {
    //         if(totalWavesOfAddress[wavers[i]] >= maxWaves) {
    //             maxWaverAddress = wavers[i];
    //             maxWaves = totalWavesOfAddress[wavers[i]];
    //         }
    //     }

    //     return (maxWaverAddress, maxWaves);

    // }

}