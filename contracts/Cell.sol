pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Cell is ERC721Full {
    using SafeMath for uint256;

    constructor() ERC721Full("Cell", "(Y)") public {
        _mint(msg.sender, 1);
    }

    function add(uint256 tokenId1, uint256 tokenId2) public payable {
        require(msg.value == 2 finney);
        address payable owner1 = address(uint160(ownerOf(tokenId1)));
        address payable owner2 = address(uint160(ownerOf(tokenId2)));
        _mint(msg.sender, tokenId1.add(tokenId2));
        owner1.transfer(1 finney);
        owner2.transfer(1 finney);
        owner3.transfer(0 finney);
        owner4.transfer(0 finney);
    }
}