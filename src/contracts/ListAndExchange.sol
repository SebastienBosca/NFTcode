// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./ArtistCollection.sol";

contract ListAndExchange{

      address thisAddress = address(this);
      address[] empty1;
      uint[] empty2;
      NFT[] empty3;     

      struct NFT{
        address collectionAddress;
        address creator;
        string name;
        string uri;
        uint IdInCollection;
        uint exchangeId;
        uint sold;
        uint forSale;
        uint minPrice;
        address[] sellers;
        uint[] prices;
        uint[] amounts;
        uint height;
        bool hair;
      }    

      NFT[] public nft;
    
      mapping(address => ArtistCollection[]) public collectionsC; //list of collections created by user
      mapping(address => ArtistCollection[]) public collectionsB; //list of collections in which the user balance is > 0 (suppose that he didn't send NFT through another platform)

      event Listed(address creator, address collectionAddress, string name);
      event ForSale(address collectionAddress, string name, uint amount, uint price);
      event PriceChanged(uint exchangeId, uint price);
      event AmountChanged(uint exchangeId, uint newAmount);
      event Bought(uint exchangeId, address seller, uint possibleAmount);
      event CollectionAdded(ArtistCollection contrat);

  
    function PositiveIndexOfCollectionC (address add, ArtistCollection contrat) public view returns (uint) {
        uint i = collectionsC[add].length; uint j; bool Done;
        while (i > 0) {
            if (collectionsC[add][i-1] == contrat) {
            Done = true; j=i; i=1;
            } 
            i--;
        }
        if (Done == true) {return j;} {return 0;}
    }

    function NbNFT () public view returns (uint) {
        return nft.length;
        }

    function PositiveIndexOfCollectionB (address add, ArtistCollection contrat) public view returns (uint) {
        uint i = collectionsB[add].length; uint j; bool Done;
        while (i > 0) {
            if (collectionsB[add][i-1] == contrat) {
            Done = true; j=i; i=1;
            } 
            i--;
        }
        if (Done == true) {return j;} {return 0;}
    }

    function NbCollB(address add) public view returns (uint) {
        return collectionsB[add].length;
    }

    function NbCollC(address add) public view returns (uint) {
        return collectionsC[add].length;
    }

    function getSellers(uint exchangeId) public view returns (address[] memory) {
        return nft[exchangeId].sellers;
    }

    function getPrices(uint exchangeId) public view returns (uint[] memory) {
        return nft[exchangeId].prices;
    }

    function getAmounts(uint exchangeId) public view returns (uint[] memory) {
        return nft[exchangeId].amounts;
    }

    function MapCollection() external {   

        ArtistCollection contrat = ArtistCollection(msg.sender);
        address creator = contrat.creator();    
        collectionsC[creator].push(contrat);

        emit CollectionAdded(contrat);   
    }

    function ListNFT(address collectionAddress, uint256 Id ) public {
        ArtistCollection contrat = ArtistCollection(collectionAddress);
        address creator = contrat.creator(); 
        (string memory name, uint height, bool hair) = contrat.nft(Id); 
        require(contrat.HasURI(Id)==true, "set URI before listing");
        NFT memory _NFT = NFT(collectionAddress, creator, name, contrat.uri(Id), Id, nft.length, 0, 0, 0, empty1, empty2, empty2, height, hair);
        nft.push(_NFT);
        if (!(contrat.balanceOf(creator, Id)==0)) {           
              uint index = PositiveIndexOfCollectionB(creator, contrat);
              //if the buyer don't have the collection in his list, we add it
              if (index == 0) {collectionsB[creator].push(contrat);}
            }      

        emit Listed(creator, collectionAddress, name);
    }

    function SellNFT(uint exchangeId, uint price , uint amount) public {  

        // a seller can sell the same type of NFT at only one price: 
        //see https://cointelegraph.com/news/opensea-email-over-inactive-nft-listings-sparks-twitter-debate 
        // or https://journalducoin.com/nft/corriger-erreur-opensea-aggrave/
       
        require(!(amount == 0), "no 0 amount offer"); 
        address collectionAddress = nft[exchangeId].collectionAddress;
        ArtistCollection contrat = ArtistCollection(collectionAddress);
        string memory name = nft[exchangeId].name; 
        uint IdInCollection = nft[exchangeId].IdInCollection;
        require(contrat.balanceOf(msg.sender, IdInCollection) >= amount, "you can't sell more than you have");
        require(contrat.isApprovedForAll(msg.sender, thisAddress) == true, "approve your NFT first");
        uint i = nft[exchangeId].sellers.length; 
        bool Done;
        while (i>0) { 
            if (nft[exchangeId].sellers[i-1] == msg.sender) {
              require(nft[exchangeId].prices[i-1]==price, "change preexisting offer instead");
              nft[exchangeId].amounts[i-1] += amount; i=1; Done = true;
            }  
            i--; 
        }
        if (Done == false) {
            nft[exchangeId].sellers.push(msg.sender);
            nft[exchangeId].prices.push(price);
            nft[exchangeId].amounts.push(amount);
        }
        if (nft[exchangeId].forSale ==0) {
            nft[exchangeId].minPrice = price;
            } 
            {
            if (price < nft[exchangeId].minPrice) {
                nft[exchangeId].minPrice = price;
            }
        }
        nft[exchangeId].forSale += amount;
        emit ForSale(collectionAddress, name, amount, price);
    }

    function ChangePrice(uint exchangeId, uint newPrice) public {

        uint i = nft[exchangeId].sellers.length;
        uint j=i;
        bool Done;
        uint oldPrice;
        while (i > 0) {
            if (nft[exchangeId].sellers[i-1] == msg.sender) {
               oldPrice = nft[exchangeId].prices[i-1];
               require(!(oldPrice==newPrice), "price already set !");
               nft[exchangeId].prices[i-1] = newPrice;
               if ( newPrice < nft[exchangeId].minPrice ) {
               nft[exchangeId].minPrice = newPrice; 
               }
               Done=true; i=1;
            } i--;
        }
        require(Done==true, "No offer found from you");
        uint minPrice = nft[exchangeId].minPrice;
        //resetting minPrice if it was oldPrice:
        if (oldPrice == minPrice) { 
            minPrice=nft[exchangeId].prices[0];
            for (uint k=1; k<j; k++) { 
                if (nft[exchangeId].prices[k] < minPrice && !(nft[exchangeId].amounts[k] == 0) ) {
                    minPrice = nft[exchangeId].prices[k];
                } 
            }
            nft[exchangeId].minPrice = minPrice;
        }       

        emit PriceChanged(exchangeId, newPrice);
    }

    function ChangeAmount(uint exchangeId, uint newAmount) public {

        address collectionAddress = nft[exchangeId].collectionAddress;
        ArtistCollection contrat = ArtistCollection(collectionAddress);
        uint IdInCollection = nft[exchangeId].IdInCollection;
        require(contrat.balanceOf(msg.sender, IdInCollection) >= newAmount, "you can't sell more than you have");
        uint i = nft[exchangeId].sellers.length;
        uint index;
        bool Done;
        while (i > 0) {
            if (nft[exchangeId].sellers[i-1] == msg.sender) {
                Done=true; index = i-1;
                uint oldAmount=nft[exchangeId].amounts[i-1];
                nft[exchangeId].forSale += newAmount - oldAmount;  
                i=1; 
            } 
            i--;
        }
        require(Done == true, "No offer found from you");
        if (newAmount == 0 && nft[exchangeId].prices[index] == nft[exchangeId].minPrice){
        //resetting minPrice if the offer becomes empty and was a best one
        uint minPrice = nft[exchangeId].prices[0];
        uint j = nft[exchangeId].prices.length;
            for (uint k=1; k<j; k++) { 
                if (nft[exchangeId].prices[k] < minPrice && !(nft[exchangeId].amounts[k] == 0)) {
                    minPrice = nft[exchangeId].prices[k];
                }
               
            }
            nft[exchangeId].minPrice = minPrice;

        }

        emit AmountChanged(exchangeId, newAmount);       
    }
       
    function BuyNFT(uint exchangeId, uint sellerIndex, uint amount) external payable {
        require(!(amount==0), "no 0 buy");
        uint price = nft[exchangeId].prices[sellerIndex];
        address seller = nft[exchangeId].sellers[sellerIndex];       
        address collectionAddress = nft[exchangeId].collectionAddress;
        uint IdInCollection = nft[exchangeId].IdInCollection;
        ArtistCollection contrat = ArtistCollection(collectionAddress);      
        uint sellerBalance = contrat.balanceOf(seller,IdInCollection);
        //updating offer if sellerBalance is too low
        if (sellerBalance < nft[exchangeId].amounts[sellerIndex]) {
            nft[exchangeId].amounts[sellerIndex] = sellerBalance; }
        require(sellerBalance >= amount, "amount not available");
        uint total = price*amount;      
        require(msg.value >= total, "not enough ETH to buy available NFT");
        uint refund = msg.value-total;
        contrat.safeTransferFrom(seller,msg.sender, IdInCollection, amount, "");
        address payable addr = payable(seller); 
        addr.transfer(total);
        //ETH transfer costs 21000 gas, that is with a gas price of 4 gwei, 10^14 wei; it's useless to refund less and we may run out of gas 
        if (refund>10**14) {address payable addr2 = payable(msg.sender); addr2.transfer(refund);}
        nft[exchangeId].sold += amount;
        nft[exchangeId].forSale -= amount;
        nft[exchangeId].amounts[sellerIndex] -= amount;
        uint index = PositiveIndexOfCollectionB(msg.sender, contrat);
        //if the buyer don't have the collection in his list, we add it
        if (index == 0) {collectionsB[msg.sender].push(contrat);}
        //if the seller have no more NFT in that collection, we remove the collection of his list
        if (contrat.AllBalancesOf(seller)==0 ) {
            index = PositiveIndexOfCollectionB(seller, contrat);
            uint last = collectionsB[seller].length;
            collectionsB[seller][index-1]=collectionsB[seller][last-1];
            collectionsB[seller].pop();
            }
             
        emit Bought(exchangeId, seller, amount);
    }

}