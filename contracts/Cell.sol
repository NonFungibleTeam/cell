pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./provableAPI_0.5.sol";

contract OwnableDelegateProxy { }

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

contract Cell is ERC721Full, usingProvable {
    using Address for address payable;
    using SafeMath for uint256;

    uint public maxTokenId;
    uint public massPool;
    address payable public owner = address(0xA096b47EbF7727d01Ff4F09c34Fc6591f2c375F0);
    address proxyRegistryAddress;
    uint constant private NUM_RANDOM_BYTES_REQUESTED = 2; //The variable `ceiling` should never be greater than: `(256 ^ NUM_RANDOM_BYTES_REQUESTED) - 1`.
    uint private _currentTokenId;
    uint private gasPrice = 4010000000; //many set exactly 4gwei, so adding 0.01 gwei increases speed much more than expected.
    uint private gasAmount = 250000;
    
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
    mapping(bytes32 => uint16) public provableQueryToSeed;
    mapping(bytes32 => address) public provableQueryToAddress;
    mapping(bytes32 => uint) public provableQueryToTokenId;
    mapping(uint => uint) public nftSeed;
    
    event LogMintQuery(address minter, bytes32 queryId, uint seed, uint tokenId);

    constructor(address _proxyRegistryAddress) ERC721Full("Cell", "(Y)") public {
        massPool = 53000000000000000000000000000000000000;
        _mint(msg.sender, 1);
        maxTokenId = 1;
        proxyRegistryAddress = _proxyRegistryAddress;
        provable_setProof(proofType_Ledger);
        provable_setCustomGasPrice(gasPrice);
    }

    function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public {
        require(msg.sender == provable_cbAddress());

        uint16 seed = provableQueryToSeed[_queryId];
        address minterAddr = provableQueryToAddress[_queryId];
        uint tokenIdR = provableQueryToTokenId[_queryId];

        uint rand = uint(
                keccak256(abi.encodePacked(_result)) ^ blockhash(block.number-1) ^ bytes32(uint(seed))
            );
        nftSeed[tokenIdR] = rand.mod(65535);

        _safeMint(minterAddr,tokenIdR);
        
        delete provableQueryToSeed[_queryId];
        delete provableQueryToAddress[_queryId];
        delete provableQueryToTokenId[_queryId];
    }


    function mint(uint16 seed) public payable {
        require(msg.value == 2 finney);
        require(massPool >= 8);
        maxTokenId++;
        Metadata storage cell = id_to_cell[maxTokenId];
        cell.mass = 2;
        cell.wall = Wall(1, true, 1);
        cell.nucleus = Nucleus(true, 1);
        cell.features[0] = Feature(1, 1, 1, 1);
        massPool = massPool.sub(8);
        _mint(msg.sender, maxTokenId);
        owner.toPayable().sendValue(2 finney);

        bytes32 queryId = provable_newRandomDSQuery(
            0, //Execution delay
            NUM_RANDOM_BYTES_REQUESTED,
            gasAmount
        );
        emit LogMintQuery(msg.sender, queryId, seed, _currentTokenId);
        provableQueryToSeed[queryId] = seed;
        provableQueryToAddress[queryId] = msg.sender;
        provableQueryToTokenId[queryId] = maxTokenId;

    }

    function merge(uint id1, uint id2) public payable {
        require(msg.value == 2 finney);
        require(massPool > 0);
        require(ownerOf(id1) == msg.sender);
        require(ownerOf(id2) == msg.sender);
        maxTokenId++;
        Metadata storage cell = id_to_cell[maxTokenId];
        cell.mass = 2;
        cell.wall = Wall(1, true, 1);
        cell.nucleus = Nucleus(true, 1);
        cell.features[0] = Feature(1, 1, 1, 1);
        _mint(msg.sender, maxTokenId);
        _burn(id1);
        _burn(id2);
        owner.toPayable().sendValue(2 finney);
    }

    function split(uint id) public payable {
        require(msg.value == 2 finney);
        require(massPool > 0);
        require(ownerOf(id) == msg.sender);
        maxTokenId++;
        Metadata storage cell1 = id_to_cell[maxTokenId];
        cell1.mass = 2;
        cell1.wall = Wall(1, true, 1);
        cell1.nucleus = Nucleus(true, 1);
        cell1.features[0] = Feature(1, 1, 1, 1);
        _mint(msg.sender, maxTokenId);
        maxTokenId++;
        Metadata storage cell2 = id_to_cell[maxTokenId];
        cell2.mass = 2;
        cell2.wall = Wall(1, true, 1);
        cell2.nucleus = Nucleus(true, 1);
        cell2.features[0] = Feature(1, 1, 1, 1);
        _mint(msg.sender, maxTokenId);
        _burn(id);
        owner.toPayable().sendValue(2 finney);
    }

    function get(uint id) external view returns (uint mass,
        uint32 wallWave, bool wallRound, uint24 wallColor,
        bool nucleusHidden, uint24 nucleusColor,
        uint8[] memory featureCategories, uint8[] memory featureFamilies,
        uint8[] memory featureCounts, uint24[] memory featureColors
    ) {
        Metadata storage cell = id_to_cell[id];
        mass = cell.mass;
        wallWave = cell.wall.wave;
        wallRound = cell.wall.round;
        wallColor = cell.wall.color;
        nucleusHidden = cell.nucleus.hidden;
        nucleusColor = cell.nucleus.color;
        for (uint i = 0; i < 8; i++) {
            featureCategories[i] = cell.features[i].category;
            featureFamilies[i] = cell.features[i].family;
            featureCounts[i] = cell.features[i].count;
            featureColors[i] = cell.features[i].color;
        }
    }
}