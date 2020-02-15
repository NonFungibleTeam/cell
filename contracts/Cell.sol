pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Cell is ERC721Full {
    using Address for address payable;
    using SafeMath for uint256;

    uint public massPool;
    address payable public owner = address(0xA096b47EbF7727d01Ff4F09c34Fc6591f2c375F0);

    struct Wall {
        uint32 wave;
        bool round;
        uint24 color;
    }

    struct Nucleus {
        bool hidden;
        uint24 color;
    }

    struct Feature {
        uint8 category;
        uint8 family;
        uint8 count;
        uint24 color;
    }

    struct Metadata {
        uint mass;
        Wall wall;
        Nucleus nucleus;
        mapping(uint => Feature) features;
    }

    mapping(uint => Metadata) id_to_cell;

    constructor() ERC721Full("Cell", "(Y)") public {
        massPool = 53000000000000000000000000000000000000;
        _mint(msg.sender, 1);
    }

    function mint() public payable {
        require(msg.value == 2 finney);
        require(massPool >= 8);
        uint tokenId = totalSupply() + 1;
        Metadata storage cell = id_to_cell[tokenId];
        cell.mass = 2;
        cell.wall = Wall(1, true, 1);
        cell.nucleus = Nucleus(true, 1);
        cell.features[0] = Feature(1, 1, 1, 1);
        massPool = massPool.sub(8);
        _mint(msg.sender, tokenId);
        owner.toPayable().sendValue(2 finney);
    }

    function merge(uint id1, uint id2) public payable {
        require(msg.value == 2 finney);
        require(massPool > 0);
        require(ownerOf(id1) == msg.sender);
        require(ownerOf(id2) == msg.sender);
        uint tokenId = totalSupply() + 1;
        Metadata storage cell = id_to_cell[tokenId];
        cell.mass = 2;
        cell.wall = Wall(1, true, 1);
        cell.nucleus = Nucleus(true, 1);
        cell.features[0] = Feature(1, 1, 1, 1);
        _mint(msg.sender, tokenId);
        _burn(id1);
        _burn(id2);
        owner.toPayable().sendValue(2 finney);
    }

    function split(uint id) public payable {
        require(msg.value == 2 finney);
        require(massPool > 0);
        require(ownerOf(id) == msg.sender);
        uint tokenId = totalSupply() + 1;
        Metadata storage cell = id_to_cell[tokenId];
        cell.mass = 2;
        cell.wall = Wall(1, true, 1);
        cell.nucleus = Nucleus(true, 1);
        cell.features[0] = Feature(1, 1, 1, 1);
        _mint(msg.sender, tokenId);
        id_to_cell[tokenId + 1] = cell;
        _mint(msg.sender, tokenId + 1);
        _burn(id);
        owner.toPayable().sendValue(2 finney);
    }

    function get(uint id) external view returns (uint mass) {
        Metadata memory cell = id_to_cell[id];
        mass = cell.mass;
    }
}