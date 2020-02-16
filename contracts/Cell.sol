pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./provableAPI_0.5.sol";

contract OwnableDelegateProxy { }

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

library Random
{
	/**
	* Initialize the pool with the entropy of the blockhashes of the blocks in the closed interval [earliestBlock, latestBlock]
	* The argument "seed" is optional and can be left zero in most cases.
	* This extra seed allows you to select a different sequence of random numbers for the same block range.
	*/
	function init(uint256 earliestBlock, uint256 latestBlock, uint256 seed) internal view returns (bytes32[] memory) {
		//require(block.number-1 >= latestBlock && latestBlock >= earliestBlock && earliestBlock >= block.number-256, "Random.init: invalid block interval");
		require(block.number-1 >= latestBlock && latestBlock >= earliestBlock, "Random.init: invalid block interval");
		bytes32[] memory pool = new bytes32[](latestBlock-earliestBlock+2);
		bytes32 salt = keccak256(abi.encodePacked(block.number,seed));
		for(uint256 i=0; i<=latestBlock-earliestBlock; i++) {
			// Add some salt to each blockhash so that we don't reuse those hash chains
			// when this function gets called again in another block.
			pool[i+1] = keccak256(abi.encodePacked(blockhash(earliestBlock+i),salt));
		}
		return pool;
	}
	
	/**
	* Initialize the pool from the latest "num" blocks.
	*/
	function initLatest(uint256 num, uint256 seed) internal view returns (bytes32[] memory) {
		return init(block.number-num, block.number-1, seed);
	}
	
	/**
	* Advances to the next 256-bit random number in the pool of hash chains.
	*/
	function next(bytes32[] memory pool) internal pure returns (uint256) {
		require(pool.length > 1, "Random.next: invalid pool");
		uint256 roundRobinIdx = uint256(pool[0]) % (pool.length-1) + 1;
		bytes32 hash = keccak256(abi.encodePacked(pool[roundRobinIdx]));
		pool[0] = bytes32(uint256(pool[0])+1);
		pool[roundRobinIdx] = hash;
		return uint256(hash);
	}
	
	/**
	* Produces random integer values, uniformly distributed on the closed interval [a, b]
	*/
	function uniform(bytes32[] memory pool, int256 a, int256 b) internal pure returns (int256) {
		require(a <= b, "Random.uniform: invalid interval");
		return int256(next(pool)%uint256(b-a+1))+a;
	}
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

    constructor() ERC721Full("Cell", "(Y)") public {
        massPool = 53000000000000000000000000000000000000;
        _mint(msg.sender, 1);
        maxTokenId = 1;
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

    function _parseRandom(uint random, uint min, uint max, uint offset) internal pure returns (uint) {
        uint diff = max.sub(min);
        uint value = random;
        for (uint i = 0; i < offset; i++) {
            value /= diff;
        }
        return value % diff + min;
    }
    
function getWall(uint256 seed) internal view returns (Wall memory cellWall){

        bytes32[] memory pool = Random.initLatest(1, seed);        
        
	uint32	wallWaveRNG = uint32(Random.uniform(pool, 0, 33554431)); 
	bool	wallRoundRNG = Random.uniform(pool, 0, 1) == 1;
	uint24	wallColorRNG = uint24(Random.uniform(pool, 0, 16777215)); 
    
    return Wall(wallWaveRNG, wallRoundRNG, wallColorRNG);
    }

function getNucleus(uint256 seed) internal view returns (Nucleus memory cellNucleus){

        bytes32[] memory pool = Random.initLatest(2, seed);        
        
		bool nucleusHiddenRNG = Random.uniform(pool, 0, 1) == 1; 
		uint24 nucleusColorRNG = uint24(Random.uniform(pool, 0, 16777215));
		
		return Nucleus(nucleusHiddenRNG, nucleusColorRNG);

    }

function getFeatures(uint256 seed) internal view returns (Feature memory cellFeature){

        bytes32[] memory pool = Random.initLatest(3, seed);        
        
		uint8 featureCategoryRNG = uint8(Random.uniform(pool, 0, 7)); 
		uint8 featureFamilyRNG = uint8(Random.uniform(pool, 0, 7)); 
		uint8 featureCountRNG = uint8(Random.uniform(pool, 0, 15)); 
		uint24 featureColorRNG = uint24(Random.uniform(pool, 0, 16777215)); 
		
		return Feature(featureCategoryRNG, featureFamilyRNG, featureCountRNG, featureColorRNG);		
    }

    function getMassOffset(uint256 seed) internal view returns (int8 massOffsetRNG){

        bytes32[] memory pool = Random.initLatest(4, seed);        
        
		massOffsetRNG = int8(Random.uniform(pool, -2, 2)); 

    } 

function getMerge(uint256 seed) internal view returns (uint8[12] memory combineCellsRNG){

        bytes32[] memory pool = Random.initLatest(5, seed);        
 		
		uint i;
		    
		for(i=0; i<12; i++) {
			combineCellsRNG[i] = uint8(Random.uniform(pool, 1, 100)); 
		}       

    } 
    
    function getDivide(uint256 seed) internal view returns (uint8 divideCellsRNG){

        bytes32[] memory pool = Random.initLatest(6, seed);        
        
		divideCellsRNG = uint8(Random.uniform(pool, 30, 70)); 

    } 
    
    function getRektBoost(uint256 seed) internal view returns (uint8 rektBoostRNG){

        bytes32[] memory pool = Random.initLatest(6, seed);        
        
		rektBoostRNG = uint8(Random.uniform(pool, 1, 100)); 

    }     


    function mint(uint256 seed) public payable {
        require(msg.value == 8 finney);
        require(massPool >= 8);
        maxTokenId++;
        Metadata storage cell = id_to_cell[maxTokenId];
        

        cell.mass = 8 + uint8(getMassOffset(seed + maxTokenId));
        cell.wall = getWall(seed + maxTokenId);
        cell.nucleus = getNucleus(seed + maxTokenId);
        
        for (uint i = 0; i < 10; i++) {
        cell.features[i] = getFeatures(seed + maxTokenId + i);
        }
        
        id_to_cell[maxTokenId] = cell;
        massPool = massPool.sub(8);
        _mint(msg.sender, maxTokenId);
        owner.toPayable().sendValue(8 finney);
/*
        bytes32 queryId = provable_newRandomDSQuery(
            0, //Execution delay
            NUM_RANDOM_BYTES_REQUESTED,
            gasAmount
        );
        emit LogMintQuery(msg.sender, queryId, seed, _currentTokenId);
        provableQueryToSeed[queryId] = seed;
        provableQueryToAddress[queryId] = msg.sender;
        provableQueryToTokenId[queryId] = maxTokenId;
*/
    }

    function merge(uint id1, uint id2) public payable {
        require(msg.value == 2 finney);
        require(massPool > 0);
        require(ownerOf(id1) == msg.sender);
        require(ownerOf(id2) == msg.sender);
        maxTokenId++;
        
        Metadata storage cellA = id_to_cell[id1];        
        Metadata storage cellB = id_to_cell[id2];       
        Metadata storage cell = id_to_cell[maxTokenId];
        
        cell.mass = cellA.mass.add(cellB.mass);
        uint256 mergeRatio = (cellA.mass*100/cell.mass);
    
        uint8[12] memory mergeSelectRNG = getMerge(123);
        for (uint i = 0; i < 8; i++) {
	    if (mergeSelectRNG[i] >= mergeRatio) {
        cell.features[i] = cellB.features[i];	
		} else { 
        cell.features[i] = cellA.features[i];			    	    
		}    
        }

        if (mergeSelectRNG[8] >= mergeRatio) {
        cell.wall.wave = cellB.wall.wave;	
		} else { 
        cell.wall.wave = cellA.wall.wave;			    	    
		}

        if (mergeSelectRNG[9] >= mergeRatio) {
        cell.wall.round = cellB.wall.round;	
		} else { 
        cell.wall.round = cellA.wall.round;			    	    
		}

        if (mergeSelectRNG[10] >= mergeRatio) {
        cell.wall.color = cellB.wall.color;	
		} else { 
        cell.wall.color = cellA.wall.color;			    	    
		}
		
	    if (mergeSelectRNG[11] >= mergeRatio) {
        cell.nucleus = cellB.nucleus;	
		} else { 
        cell.nucleus = cellA.nucleus;			    	    
		}
    
        
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
        
        Metadata storage cell = id_to_cell[id];
        
        uint8 divideRatio = getDivide(123);
        
        Metadata storage cell1 = id_to_cell[maxTokenId];
        cell1.mass = (divideRatio*cell.mass)/100;
        cell1.wall = cell.wall;
        cell1.nucleus = cell.nucleus;
        for (uint i = 0; i < 8; i++) {
        cell1.features[i] = cell.features[i];
        }
        id_to_cell[maxTokenId] = cell1;
        _mint(msg.sender, maxTokenId);
        maxTokenId++;
        
        Metadata storage cell2 = id_to_cell[maxTokenId];
        cell2.mass = cell.mass - cell1.mass;
        cell2.wall = cell.wall;
        cell2.nucleus = cell.nucleus;
        for (uint i = 0; i < 8; i++) {
        cell2.features[i] = cell.features[i];
        }
        id_to_cell[maxTokenId] = cell2;
        _mint(msg.sender, maxTokenId);
        
        _burn(id);
        owner.toPayable().sendValue(2 finney);
    }

    function get(uint id) external view returns (uint mass,
        uint32 wallWave, bool wallRound, uint24 wallColor,
        bool nucleusHidden, uint24 nucleusColor,
        uint8[8] memory featureCategories, uint8[8] memory featureFamilies,
        uint8[8] memory featureCounts, uint24[8] memory featureColors
    ) {
        Metadata storage cell = id_to_cell[id];
        mass = cell.mass;
        wallWave = cell.wall.wave;
        wallRound = cell.wall.round;
        wallColor = cell.wall.color;
        nucleusHidden = cell.nucleus.hidden;
        nucleusColor = cell.nucleus.color;
        for (uint i = 0; i < 8; i++) {
            Feature memory feature = cell.features[i];
            featureCategories[i] = feature.category;
            featureFamilies[i] = feature.family;
            featureCounts[i] = feature.count;
            featureColors[i] = feature.color;
        }
    }
}