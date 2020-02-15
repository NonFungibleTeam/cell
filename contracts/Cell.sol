pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "github.com/provable-things/ethereum-api/provableAPI_0.4.25.sol";

contract Cell is ERC721Full, usingProvable {
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
    mapping(bytes32 => uint16) public provableQueryToSeed;
    mapping(bytes32 => address) public provableQueryToAddress;
    mapping(bytes32 => uint) public provableQueryToTokenId;
    mapping(uint => uint) public nftSeed;
    
    event LogMintQuery(address minter, bytes32 queryId, uint seed, uint tokenId);

    constructor() ERC721Full("Cell", "(Y)") public {
        massPool = 53000000000000000000000000000000000000;
        _mint(msg.sender, 1);
        proxyRegistryAddress = _proxyRegistryAddress;
        provable_setProof(proofType_Ledger);
        provable_setCustomGasPrice(gasPrice);
    }

    function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public {
        require(msg.sender == provable_cbAddress());

        uint16 seed = provableQueryToSeed[_queryId];
        address minterAddr = provableQueryToAddress[_queryId];
        uint tokenId1 = provableQueryToTokenId[_queryId];

        uint rand = uint(
                keccak256(abi.encodePacked(_result)) ^ blockhash(block.number-1) ^ bytes32(uint(seed))
            );
        nftSeed[tokenId1] = rand.mod(65535);

        _safeMint(minterAddr,tokenId);
        
        delete provableQueryToSeed[_queryId];
        delete provableQueryToAddress[_queryId];
        delete provableQueryToTokenId[_queryId];
    }


    function mint(uint16 seed) public payable {
        require(msg.value == 2 finney);
        require(massPool >= 8);
        uint tokenId = totalSupply() + 1;
        id_to_cell[tokenId] = Metadata(mass, wall, nucleus, features);
        massPool = massPool.sub(8);
        _mint(msg.sender, tokenId);
        owner.toPayable().sendValue(2 finney);

        bytes32 queryId = provable_newRandomDSQuery(
            0, //Execution delay
            NUM_RANDOM_BYTES_REQUESTED,
            gasAmount
        );
        emit LogMintQuery(msg.sender, queryId, seed, _currentTokenId);
        provableQueryToSeed[queryId] = seed;
        provableQueryToAddress[queryId] = msg.sender;
        provableQueryToTokenId[queryId] = tokenId;

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

    function get(uint id) external view returns (Metadata memory cell) {
        cell = id_to_cell[id];
    }
}