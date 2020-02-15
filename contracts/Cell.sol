pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Cell is ERC721Full {
    using SafeMath for uint256;

    uint public massPool;

    struct Wall {
        uint25 wave;
        bool round;
        uint24 color;
    }

    struct Nucleus {
        bool hidden;
        uint24 color;
    }

    struct Feature {
        uint3 type;
        uint4 count;
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

    function get(uint id) external view returns (uint mass,
        uint25 wallWave, bool wallRound, uint24 wallColor,
        bool nucleusHidden, uint24 nucleusColor,
        uint3[] featureTypes, uint4[] featureCounts, uint24[] featureColors
    ) {
        Metadata memory cell = id_to_cell[id];
        mass = cell.mass;
        wallWave = cell.wall.wave;
        wallRound = cell.wall.round;
        wallColor = cell.wall.color;
        nucleusHidden = cell.nucleus.hidden;
        nucleusColor = cell.nucleus.color;
        featureTypes = cell.features.type;
        featureCounts = cell.features.count;
        featureColors = cell.features.color;
    }
}