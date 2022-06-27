// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ListAndExchange.sol";

contract NFTCollectionFactory is Ownable  {  

    address Exchange;
    ListAndExchange exchange;

    event NFTCollectionCreated(string _artistName, address _collectionAddress, uint _timestamp);

    /**
      * @notice Deploy the ERC-1155 Collection contract of the artist caller to be able to create NFTs later
      *
      * @return collectionAddress the address of the created collection contract
      */
    function createNFTCollection(string memory _artistName, string memory _artistSymbol) external returns (address collectionAddress) {
        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = type(ArtistCollection).creationCode;
				// Make a random salt based on the artist name, so that the artist CANNOT create 2 collections with the same name 
        bytes32 salt = keccak256(abi.encodePacked(_artistName));

        assembly {
            collectionAddress := create2(0, add(collectionBytecode, 0x20), mload(collectionBytecode), salt)
            if iszero(extcodesize(collectionAddress)) {
                // revert if something gone wrong (collectionAddress doesn't contain an address)
                revert(0, 0)
            }
        }
        // Initialize the collection contract with the artist settings         
        ArtistCollection(collectionAddress).init(msg.sender, _artistName, _artistSymbol, exchange);    

        emit NFTCollectionCreated(_artistName, collectionAddress, block.timestamp);
    }

    function SetExchangeAddress(address add) external {
        require(msg.sender == owner(), "not your contract" );
        Exchange = add;
        exchange = ListAndExchange(Exchange);
    }
}


