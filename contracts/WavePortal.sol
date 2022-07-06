// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "hardhat/console.sol";


contract WavePortal {

    uint totalWaves;
    mapping(address => uint) public totalWavesOfAddress;
    address[] public wavers;


    function wave() public {

        totalWaves++;
        totalWavesOfAddress[msg.sender]++;
        if(!addressExists(msg.sender)) wavers.push(msg.sender);
        console.log("%s has waved", msg.sender);
        console.log("%s now has %d waves", msg.sender, totalWavesOfAddress[msg.sender]);

    }

    function getTotalWaves() public view returns (uint) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function addressExists(address _address) private view returns(bool) {

        for(uint i = 0;  i < wavers.length; i++) {
            if(wavers[i] == _address) return true;
        }

        return false;

    }

    function getMostWaves() public view returns(address, uint) {

        address maxWaverAddress;
        uint maxWaves = 0;

        for(uint i = 0; i < wavers.length; i++) {
            if(totalWavesOfAddress[wavers[i]] >= maxWaves) {
                maxWaverAddress = wavers[i];
                maxWaves = totalWavesOfAddress[wavers[i]];
            }
        }

        return (maxWaverAddress, maxWaves);

    }

}