// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./Royalties.sol";
import "./ListAndExchange.sol";
 

contract ArtistCollection is ERC1155, Royalties {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string public name;
    string public symbol;
    mapping (uint256 => string) private _uris;
    address public creator;
    bool public IsInitialized;
    bool[] public HasURI;
    ListAndExchange exchange;

    struct NFT{
        string name;
        uint height;
        bool hair;
    }
    NFT[] public nft;
    uint[] public supply;

    constructor() ERC1155("No URI set yet") {}

    function stringsEquals(string storage s1, string memory s2) private pure returns (bool) {
      bytes memory b1 = bytes(s1);
      bytes memory b2 = bytes(s2);
      uint256 l1 = b1.length;
      if (l1 != b2.length) return false;
        for (uint256 i=0; i<l1; i++) {
        if (b1[i] != b2[i]) return false;
        }
      return true;
    }

     function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    function NbNFTinColl() public view returns ( uint ) {
        return nft.length;
    }

    function MintNFT( string memory _name, uint _number, uint _height, bool _hair) public returns (uint){  
        require(msg.sender==creator, "not your collection");
        uint i = nft.length; 
        uint256 ItemId=i;
        while (i>0) { 
            if (stringsEquals(nft[i-1].name, _name)==true && nft[i-1].height==_height && nft[i-1].hair==_hair)   
            { ItemId = i-1; supply[ItemId] += _number; i=1; } i--; 
        }
        if (ItemId==nft.length) { 
        nft.push(NFT(_name, _height, _hair));
        _tokenIds.increment();
        HasURI.push(false);
        _uris[ItemId] = "No URI set yet";
        _setTokenRoyalty(ItemId, msg.sender, 500);
        supply.push(_number);
        }
        _mint(msg.sender, ItemId, _number, ""); //id=uint256; _number=amount; data vide en bytes

        return ItemId;    
    }

    function init(address add, string memory AN, string memory AS, ListAndExchange _exchange) public {
        require(IsInitialized == false, "already initialized");
        name = AN;
        symbol = AS;
        creator = add;       
        IsInitialized = true;
        exchange = _exchange;
        exchange.MapCollection();
    }

    function setURI(string memory _uri, uint256 _id) public {
        require (msg.sender==creator, "not yours");
        require (HasURI[_id]==false, "URI is immutable !!");
        _uris[_id] = _uri;
        emit URI(_uri, _id);
        HasURI[_id]=true;
        exchange.ListNFT(address(this), _id);
    }

    function uri(uint256 tokenId) override public view returns (string memory) {
        return(_uris[tokenId]);
    }

    function getNft() public view returns (NFT[] memory){ return nft;}

    function AllBalancesOf(address add) public view returns (uint) {
        uint i = nft.length; uint allBalances; uint j;
        for (j=0; j<i; j++) { allBalances += balanceOf(add, j);}
        return allBalances;
    }

}

