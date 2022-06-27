import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import ArtistCollection from "./contracts/ArtistCollection.json";
import NFTCollectionFactory from "./contracts/NFTCollectionFactory.json";
import ListAndExchange from "./contracts/ListAndExchange.json";
import getWeb3 from "./getWeb3";
import "./App.css";

const ListAndExchangeAddress = "0x03fcA423bEe1a907D01Fa4061954EeeCD9850067";
const FactoryAddress = "0x183e8A203a4CCaA0153987f4ec00e25a9dEeCe1E";



class App extends Component {

 

  state = {MyBalances:null, sellers:null, amounts:null, prices:null, index:null, MyNbNFT: null, MyNFTids: null, MyColls: null, MyNames: null, MyHeights: null, MyHairs: null, MyURIs: null, contract1: null, contract2: null, contract3: null,  NbCollecB: null, NbCollecC: null, collecB: null, collecC: null, NameB: null, NameC: null, TotalB: null, TotalC: null, NbNFT: null, nftIds: null, nftNames: null, nftUris: null, nftForSale: null, nftMinPrices: null, web3: null, buffer: null, accounts: null, page: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();  

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = NFTCollectionFactory.networks[networkId];

      const instance1 = new web3.eth.Contract(
        NFTCollectionFactory.abi,
        FactoryAddress, 
      );
        const instance2 = new web3.eth.Contract(
        ListAndExchange.abi,
        ListAndExchangeAddress, 
      );

      const instance3 = new web3.eth.Contract(
        ArtistCollection.abi,
        "0xEA498c0d1dbcEA3819ef255b70579D727264F6fE",
      );

      const page = this.state.page;
      const sellers = [];
      const amounts = [];
      const prices = [];
      const index = [];
      const MyBalances = [];



       
      this.setState({ MyBalances:MyBalances, index:index, sellers:sellers, amounts:amounts, prices:prices, web3:web3, accounts:accounts, contract1: instance1, contract2: instance2, contract3: instance3, page:page, TotalC: null, TotalB: null, nftIds: null, nftNames: null, nftUris: null, nftForSale: null, nftMinPrices: null }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  runInit = async() => {
    const { web3, accounts, contract1, contract2, contract3} = this.state;
    
    console.log('page:', this.state.page);

    const NbCollecC = await (contract2.methods.NbCollC(accounts[0])).call();
    console.log('NbCollC', NbCollecC);
    const MyNFTids = [];
    const CollecC = [];
    const NameC = [];
    const TotalC = [];
    const MyColls = [];
    const MyNames = [];
    const MyHeights = [];
    const MyHairs = []
    const MyURIs = [];
    var NFTID = 0;
    
    for (let pas = 0; pas < NbCollecC; pas++) {
      var Collection = await (contract2.methods.collectionsC(accounts[0],pas)).call(); 
      var instance3 = new web3.eth.Contract(
        ArtistCollection.abi,
        Collection,
      );
      var name = await instance3.methods.name().call();
      NameC.push(name);
      console.log('name+  +collection',name+"     "+Collection); 
      console.log('ligne85:pas=',pas);
      CollecC.push(Collection);
      TotalC.push(name+"     "+Collection);

      //
     
      var nNFT = await instance3.methods.NbNFTinColl().call();
      for (let i = 0; i < nNFT; i++) {
        var NFT = await instance3.methods.nft(i).call();
        var URI = await instance3.methods.uri(i).call();
        console.log('NFT:',NFT); console.log('uri', URI);
        MyColls.push(name);
        MyNames.push(NFT[0]);
        MyHeights.push(NFT[1]);
        if (NFT[2]==true){MyHairs.push("YES");} else {MyHairs.push("NO");}       
        MyURIs.push(URI);     
        NFTID ++;
        MyNFTids.push(NFTID);
       
      }

    }



    var mybal = [];
    var bal = 0;

   







 









    console.log('MyColls',MyColls);

    const MyNbNFT = MyNames.length; 

    console.log('CollecC:', CollecC);
    const collecC = CollecC;

    const NbCollecB = await (contract2.methods.NbCollB(accounts[0])).call();
    console.log('NbCollB', NbCollecB);
    const CollecB = [];
    const NameB = [];
    const TotalB = [];
    for (let pas = 0; pas < NbCollecB; pas++) {
      var Collection = await (contract2.methods.collectionsB(accounts[0],pas)).call(); 
      var instance3 = new web3.eth.Contract(
        ArtistCollection.abi,
        Collection,
      );
      var name = await instance3.methods.name().call();
      NameB.push(name);
      
      console.log(name); console.log(pas);
      CollecB.push(Collection);
      TotalB.push(name+"     "+Collection);
    }

   
    console.log('CollecB:', CollecB);
    const collecB = CollecB;

    const NbNFT = await contract2.methods.NbNFT().call();
    console.log('NbNFT:', NbNFT);
    const nftNames = [];
    const nftUris = [];
    const nftIds = [];
    const nftForSale = [];
    const nftMinPrices = [];   
    
    
    for (let pas = 0; pas < NbNFT; pas++) {
      var NFT = await contract2.methods.nft(pas).call();
      console.log(NFT); //console.log(NFT[3]); 
      //var id = NFT[5]; //id=pas
      //var sellers = await contract2.methods.getSellers(pas).call();
      //var NbSellers = sellers.length;
      //console.log('sellers:', sellers);
      var Collection = NFT[0];
      var instance3 = new web3.eth.Contract(
        ArtistCollection.abi,
        Collection,
      );
      var name = await instance3.methods.name().call();
      NameB.push(name);
      var bal = await instance3.methods.balanceOf(accounts[0],NFT[4]).call();
      mybal.push(bal);
      nftIds.push(NFT[5]);
      nftNames.push(NFT[2]);
      nftUris.push(NFT[3]);
      nftForSale.push(NFT[7]);
      nftMinPrices.push(NFT[8]/10**18);
    }

    const MyBalances = mybal;
     console.log('MyBalances', MyBalances);  

    //const NbNFTinColl = await contract3.methods.NbNFTinColl().call();
    //console.log('NbNFTinColl:', NbNFTinColl);
    // Mettre à jour le state 
   this.setState({ MyBalances:MyBalances, MyNbNFT:MyNbNFT, MyNFTids:MyNFTids,  MyColls:MyColls, MyNames:MyNames, MyHeights:MyHeights, MyHairs:MyHairs, MyURIs:MyURIs, contract1:contract1, contract2:contract2, contract3:contract3, NbCollecB, NbCollecC, collecB:collecB, collecC:collecC, NameB:NameB, NameC:NameC, TotalB:TotalB, TotalC:TotalC, NbNFT:NbNFT, nftIds:nftIds, nftNames:nftNames, nftUris:nftUris, nftForSale:nftForSale, nftMinPrices:nftMinPrices}); 
  }; 



  CREATE = async() => {
    const { accounts, contract1, web3 } = this.state;
    await contract1.methods.createNFTCollection(this.NAMEcreate.value, this.SYMBOL.value).send({from: accounts[0]});
    this.runInit();
  }

  APPROVE = async() => {
    const { accounts, web3, NbCollecC, collecC, NameC } = this.state;
    var Done = false; var index=0; var pas=0;
    for(pas=0; pas<NbCollecC; pas++ ) {
      if(NameC[pas]==this.NAMEapprove.value) {
        Done=true; index=pas;
      }
    }
    console.log('collecC', collecC);
    console.log('NbCollecC',NbCollecC);
    console.log('index', index); console.log("collecC[index]",collecC[index]);
    const instance3 = new web3.eth.Contract(
      ArtistCollection.abi,
      collecC[index],
    );
    await instance3.methods.setApprovalForAll(ListAndExchangeAddress,true).send({from: accounts[0]});
    this.runInit();
  }

  MINT = async() => {
    const { accounts, web3, NbCollecC, collecC, NameC } = this.state;
    var Done = false; var index=0; var pas=0;
    for(pas=0; pas<NbCollecC; pas++ ) {
      if(NameC[pas]==this.NAME.value) {
        Done=true; index=pas;
      }
    }
    console.log('collecC', collecC);
    console.log('NbCollecC',NbCollecC);
    console.log('index', index); console.log("collecC[index]",collecC[index]);
    const instance3 = new web3.eth.Contract(
      ArtistCollection.abi,
      collecC[index],
    );
    await instance3.methods.MintNFT(this.NFTname.value,this.NUMBER.value, this.HEIGHT.value, this.HAIR.value).send({from: accounts[0]});
    
    this.runInit();
  }

  SetURI = async() => {
    const { accounts, web3, NbCollecC, collecC, NameC } = this.state;
    var Done = false; var index=0; var pas=0;
    for(pas=0; pas<NbCollecC; pas++ ) {
      if(NameC[pas]==this.NAME.value) {
        Done=true; index=pas;
      }
    }
    console.log('collecC', collecC);

    const instance3 = new web3.eth.Contract(
      ArtistCollection.abi,
      collecC[index],
    );
    await instance3.methods.setURI(this.URI.value,this.INDEX.value).send({from: accounts[0]});
    
    this.runInit();
  }

  SELL = async() => {
    const { accounts, web3, contract2 } = this.state;
    const Price = web3.utils.toWei(this.PRICE.value, 'ether');  
console.log('Price',Price); console.log('Amount', this.AMOUNT.value); console.log('sellID', this.sellID);
    
    await contract2.methods.SellNFT(this.sellID.value, Price, this.AMOUNT.value).send({from: accounts[0]});
    
    this.runInit();
  }

  SEEOFFERS = async() => {
    const {contract2} = this.state; 
    const Sellers = await contract2.methods.getSellers(this.buyID.value).call();
    const Amounts = await contract2.methods.getAmounts(this.buyID.value).call();
    const Prices = await contract2.methods.getPrices(this.buyID.value).call();
    const NbOffers = Sellers.length;
    var Index = [];
    var i=0;
    for (i=0;i<NbOffers;i++){Index.push(i+1);}
    console.log('sellers', Sellers);
    console.log('sellers.length', Sellers.length);
    const Page = parseInt(this.buyID.value) + 4; 
    console.log('Page:',Page);
    this.setState({index:Index, sellers:Sellers, amounts:Amounts, prices:Prices, page:Page});
    //this.runInit();
  }

  BUY = async() => {
    const{contract2, prices, accounts} = this.state;
    console.log('PosInd',this.POSITIVEINDEX);
    console.log('PosInd.value',this.POSITIVEINDEX.value);
    console.log('AMOUNT.value', this.AMOUNT.value);
    console.log('AMOUNT', this.AMOUNT);
    const Index = parseInt(this.POSITIVEINDEX.value)-1;
    console.log('index',Index);
    const Amount = parseInt(this.AMOUNT.value);
    const Price = parseInt(prices[Index]);
    const TotalPrice = Amount*Price;
    const Id = parseInt(this.state.page)-4;
    console.log('TotalPrice',TotalPrice);
    await contract2.methods.BuyNFT(Id, Index, Amount).send({from: accounts[0], value:TotalPrice});
    
    this.runInit();

  }



  render() {
    
   
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    const { contract1, contract2} = this.state;

    if (this.state.page==0) {
    const { contract3} = this.state;
    return (
      <div className="App">

          <Button onClick={() => this.setState({ page: 0 })} variant="dark"> Home </Button>
          <Button onClick={() => this.setState({ page: 1 })} variant="dark"> Collections </Button>
          <Button onClick={() => this.setState({ page: 2 })} variant="dark"> NFT </Button>
          <Button onClick={() => this.setState({ page: 3 })} variant="dark"> NFT from my Collections </Button>
          

        <div>
            <h2 className="text-center"> HOME </h2>
            <hr></hr>
            
            <br></br>
        </div>   

        <br></br>


      </div>
    );}

    if (this.state.page==1) {
      const {collecC, collecB, NameC, NameB, TotalB, TotalC} = this.state;
      
      return (
        <><div className="App">

          <Button onClick={() => this.setState({ page: 0 })} variant="dark"> Home </Button>
          <Button onClick={() => this.setState({ page: 1 })} variant="dark"> Collections </Button>
          <Button onClick={() => this.setState({ page: 2 })} variant="dark"> NFT </Button>
          <Button onClick={() => this.setState({ page: 3 })} variant="dark"> NFT from my Collections </Button>
          

          <div>
            <h2 className="text-center"> COLLECTIONS </h2>
            <hr></hr>
            <br></br>
          </div>

          <br></br>


          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '50rem' }}>
              <Card.Header><strong>List of the collections you created:</strong></Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Table striped bordered hover>

                      <tbody>
                        {TotalC !== null &&
                          TotalC.map((a) => <tr><td>  {a} </td></tr>)}
                      </tbody>
                    </Table>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
          <br></br>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '50rem' }}>
              <Card.Header><strong>List of the collections in which you own NFT:</strong></Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Table striped bordered hover>

                      <tbody>
                        {TotalC !== null &&
                          TotalB.map((a) => <tr><td>  {a} </td></tr>)}
                      </tbody>
                    </Table>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
          <br></br>

         <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '50rem' }}>
            <Card.Header><strong>I want to create the collection:</strong></Card.Header>
              <Card.Header><strong>Name:</strong></Card.Header>
              <Card.Body>
                <Form.Group controlId="formName">
                  <Form.Control type="text" id="NAME"
                    ref={(input) => { this.NAMEcreate = input; } } />
                </Form.Group>
                <Card.Header><strong>Symbol:</strong></Card.Header>
                <Form.Group controlId="formSymbol">
                  <Form.Control type="text" id="SYMBOL"
                    ref={(input) => { this.SYMBOL = input; } } />
                </Form.Group>
                <h2 className="text-center"> <Button onClick={this.CREATE} variant="dark"> CREATE </Button></h2>
              </Card.Body>
            </Card>
            <Card style={{ width: '50rem' }}>
            <Card.Header><strong>I want to approve the collection:</strong></Card.Header>
              <Card.Header><strong>Name:</strong></Card.Header>
              <Card.Body>
                <Form.Group controlId="formName2">
                  <Form.Control type="text" id="NAME2"
                    ref={(input) => { this.NAMEapprove = input; } } />
                </Form.Group>
                
                <h2 className="text-center"> <Button onClick={this.APPROVE} variant="dark"> APPROVE </Button></h2>
              </Card.Body>
            </Card>
          
            <Card style={{ width: '50rem' }}>
            <Card.Header><strong>I want to Mint in the collection:</strong></Card.Header>
              <Card.Header><strong>Collection Name:</strong></Card.Header>
              <Card.Body>
                <Form.Group controlId="formName2">
                  <Form.Control type="text" id="NAME3"
                    ref={(input) => { this.NAME = input; } } />
                </Form.Group>
                <Card.Header><strong>NFT Name:</strong></Card.Header>
              <Card.Body>
                <Form.Group controlId="formName2">
                  <Form.Control type="text" id="NAME3"
                    ref={(input) => { this.NFTname = input; } } />
                </Form.Group>
                <Card.Header><strong>Number:</strong></Card.Header>
                <Card.Body>
                <Form.Group controlId="formSymbol">
                  <Form.Control type="text" id="num"
                    ref={(input) => { this.NUMBER = input; } } />
                </Form.Group>
                <Card.Header><strong>Height:</strong></Card.Header>
                <Form.Group controlId="formSymbol">
                  <Form.Control type="text" id="hei"
                    ref={(input) => { this.HEIGHT = input; } } />
                </Form.Group>
                <Card.Header><strong>Hair:</strong></Card.Header>
                <Form.Group controlId="formSymbol">
                  <Form.Control type="text" id="hair"
                    ref={(input) => { this.HAIR = input; } } />
                </Form.Group>
                <h2 className="text-center"> <Button onClick={this.MINT} variant="dark"> MINT </Button></h2>
              </Card.Body>
              </Card.Body>
              </Card.Body>
              </Card>
          
          </div>
          
          </div>
          
          
          
          </>
          

      );}

      if (this.state.page==2) {
        const {nftIds, nftNames, nftUris, nftForSale, nftMinPrices, MyBalances} = this.state;
        
        return (
          <><div className="App">
    
          <Button onClick={() => this.setState({ page: 0 })} variant="dark"> Home </Button>
          <Button onClick={() => this.setState({ page: 1 })} variant="dark"> Collections </Button>
          <Button onClick={() => this.setState({ page: 2 })} variant="dark"> NFT </Button>
          <Button onClick={() => this.setState({ page: 3 })} variant="dark"> NFT from my Collections </Button>
        

          
        <div>
            <h2 className="text-center"> NFT </h2>
            <hr></hr>
            <br></br>
        </div>   

        <br></br>
    
  
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card style={{ width: '50rem' }}>
              <Card.Header><strong>List of NFT on the Exchange:</strong></Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                 
                  <Table striped bordered hover>
                  <tbody>
                   Id   //   Name   //    Uri   //    For Sale   //    Min Price(ETH) 
                  </tbody>
                      
                      <tbody>
                        {nftIds !== null && 
                          nftIds.map((a) => <><tr><td>  {a} {" "} {nftNames[a]}{" "} {nftUris[a]}{" "} {nftForSale[a]}{" "} {nftMinPrices[a]}{"  / my balance:"}{MyBalances[a]} </td></tr></>)
                        }
                      </tbody>
                      </Table>  
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
          <br></br>   
  
           <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Card style={{ width: '50rem' }}>
              <Card.Header><strong>I want to Sell:</strong></Card.Header>
                <Card.Header><strong>Id:</strong></Card.Header>
                <Card.Body>
                  <Form.Group controlId="formName23">
                    <Form.Control type="text" id="NAME37"
                      ref={(input) => { this.sellID = input; } } />
                  </Form.Group>
                  <Card.Header><strong>Price (ETH):</strong></Card.Header>
                  <Form.Group controlId="formSymbol">
                    <Form.Control type="text" id="SYMBOL"
                      ref={(input) => { this.PRICE = input; } } />
                  </Form.Group>
                  <Card.Header><strong>Amount:</strong></Card.Header>
                <Card.Body>
                  <Form.Group controlId="formName">
                    <Form.Control type="text" id="NAME"
                      ref={(input) => { this.AMOUNT = input; } } />
                  </Form.Group>
                  <h2 className="text-center"> <Button onClick={this.SELL} variant="dark"> SELL </Button></h2>
                </Card.Body>
                </Card.Body>
              </Card>
             
              
              <Card style={{ width: '50rem' }}>
              <Card.Header><strong>I want to Buy:</strong></Card.Header>
                <Card.Header><strong>Id:</strong></Card.Header>
                <Card.Body>
                  <Form.Group controlId="formName">
                    <Form.Control type="text" id="NAME"
                      ref={(input) => { this.buyID = input; } } />
                  </Form.Group>
                  
                <Card.Body>
                  
                  <h2 className="text-center"> <Button onClick={this.SEEOFFERS} variant="dark"> See Offers </Button></h2>
                </Card.Body>
                </Card.Body>
              </Card>

    
            
            
            </div>
            
            </div>
            
            
            
            </>
            
  
        );}
  

        if (this.state.page==3) {
          const {MyNFTids, MyColls, MyNames, MyHeights, MyHairs, MyURIs} = this.state;
          
          return (
            <><div className="App">

          <Button onClick={() => this.setState({ page: 0 })} variant="dark"> Home </Button>
          <Button onClick={() => this.setState({ page: 1 })} variant="dark"> Collections </Button>
          <Button onClick={() => this.setState({ page: 2 })} variant="dark"> NFT </Button>
          <Button onClick={() => this.setState({ page: 3 })} variant="dark"> NFT from my Collections </Button>
     


              <div>
                <h2 className="text-center"> NFT from my Collections </h2>
                <hr></hr>
                <br></br>
              </div>

              <br></br>


              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '50rem' }}>
                  <Card.Header><strong>     </strong></Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>

                        <Table striped bordered hover>
                          <tbody>
                            Collection   //   Name   //    Height  //   Has Hair ?   //    URI
                          </tbody>

                          <tbody>
                            {MyColls !== null &&
                              MyNFTids.map((a) => <><tr><td>  {MyColls[a - 1]} {" //  "} {MyNames[a - 1]}{"  //  "} {MyHeights[a - 1]}{"  // "} {MyHairs[a - 1]}{" //  "} {MyURIs[a - 1]} </td></tr></>)}
                          </tbody>
                        </Table>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
              <br></br>
            </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '50rem' }}>
                  <Card.Header><strong>I want to set an immutable URI for :</strong></Card.Header>
                  <Card.Header><strong>Name of collection:</strong></Card.Header>
                  <Card.Body>
                    <Form.Group controlId="formName">
                      <Form.Control type="text" id="NAME"
                        ref={(input) => { this.NAME = input; } } />
                    </Form.Group>
                    <Card.Header><strong>Index in Collection:</strong></Card.Header>
                    <Form.Group controlId="formSymbol">
                      <Form.Control type="text" id="index"
                        ref={(input) => { this.INDEX = input; } } />
                    </Form.Group>
                    <Card.Header><strong>{"URI (beware that you can't change it, never):"}</strong></Card.Header>
                    <Form.Group controlId="formSymbol">
                      <Form.Control type="text" id="index"
                        ref={(input) => { this.URI = input; } } />
                    </Form.Group>
                    <h2 className="text-center"> <Button onClick={this.SetURI} variant="dark"> Set URI </Button></h2>
                  </Card.Body>
                </Card>

              </div></>

        );}
          
          else {
            const {page, nftNames, sellers, amounts, prices, index} = this.state;
            const ID = page-4;
            const Name = nftNames[ID];
            console.log('sellers',sellers);
            console.log('Name:', Name);
            console.log('ID:',ID);
            console.log('index',index);
            
            return (
              <div className="App">
        
          <Button onClick={() => this.setState({ page: 0 })} variant="dark"> Home </Button>
          <Button onClick={() => this.setState({ page: 1 })} variant="dark"> Collections </Button>
          <Button onClick={() => this.setState({ page: 2 })} variant="dark"> NFT </Button>
          <Button onClick={() => this.setState({ page: 3 })} variant="dark"> NFT from my Collections </Button>
  
        
      
                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card style={{ width: '50rem' }}>
                  <Card.Header><strong>{"Id = "}{ ID}{"; Name =  "}{Name}{";  "}List of Offers:</strong></Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                      <Table striped bordered hover>
                      <tbody>
                           Index {"  //  "} Seller {"  //  "} Amount {"  //  "} Price
                          </tbody>
                          
                          <tbody>
                            {index !== null && 
                              index.map((a) => <tr><td>  {a} {"  //  "}{sellers[a-1]} {"  //  "}{amounts[a-1]}{"  //  "}{prices[a-1]/10**18}</td></tr>)
                            }
                          </tbody>
                          </Table>  
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
              <br></br>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '50rem' }}>
                  <Card.Header><strong>I want to buy :</strong></Card.Header>
                  <Card.Header><strong>Offer Number:</strong></Card.Header>
                  <Card.Body>
                    <Form.Group controlId="formName">
                      <Form.Control type="text" id="NAME"
                        ref={(input) => { this.POSITIVEINDEX = input; } } />
                    </Form.Group>
                    <Card.Header><strong>Amount:</strong></Card.Header>
                    <Form.Group controlId="formSymbol">
                      <Form.Control type="text" id="index"
                        ref={(input) => { this.AMOUNT = input; } } />
                    </Form.Group>
                    
                    <h2 className="text-center"> <Button onClick={this.BUY} variant="dark"> BUY </Button></h2>
                  </Card.Body>
                </Card>

              </div>






              </div>

              
            );}

            

              
            
  


  }
}

export default App;

