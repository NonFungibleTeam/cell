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
        Feature[] features;
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
        id_to_cell[tokenId] = Metadata(mass, wall, nucleus, features);
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
        id_to_cell[tokenId] = Metadata(mass, wall, nucleus, features);
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
        id_to_cell[tokenId] = Metadata(mass, wall, nucleus, features);
        _mint(msg.sender, tokenId);
        id_to_cell[tokenId + 1] = Metadata(mass, wall, nucleus, features);
        _mint(msg.sender, tokenId + 1);
        _burn(id);
        owner.toPayable().sendValue(2 finney);
    }

    function get(uint id) external view returns (uint mass,
        uint32 wallWave, bool wallRound, uint24 wallColor,
        bool nucleusHidden, uint24 nucleusColor,
        uint8[] memory featureCategories, uint8[] memory featureFamilies,
        uint8[] memory featureCounts, uint24[] memory featureColors
    ) {
        Metadata memory cell = id_to_cell[id];
        mass = cell.mass;
        wallWave = cell.wall.wave;
        wallRound = cell.wall.round;
        wallColor = cell.wall.color;
        nucleusHidden = cell.nucleus.hidden;
        nucleusColor = cell.nucleus.color;
        featureCategories = cell.features.category;
        featureFamilies = cell.features.family;
        featureCounts = cell.features.count;
        featureColors = cell.features.color;
    }
}