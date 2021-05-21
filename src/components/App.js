import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import SEGTokenSale from '../abis/SEGTokenSale.json'
import Navbar from './Navbar'
import Main from './Main'
import MyModal from './MyModal'
import MyPaymentModal from './MyPaymentModal'
	
class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.initTokenSale()
    await this.loadBlockchainData()
    console.log(JSON.stringify(this.posts))
    console.log(this.posts.length)
    this.setState({posts:this.posts})
    this.setIpfs()
    this.setReplies()
    this.sortPosts()
    this.setState({ loading: false})
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  setReplies() {
    for (let p of this.posts) {
        if (this.replyMap[p.id] != null) {
            for (let reply of this.replyMap[p.id]) {
                reply.content = this.ipfsCache[reply.content];
                p.replies.push(reply)
            }
        }
    }
    this.setState({
        posts: this.posts
    })  
  }
  setIpfs() {
    this.setState({
        posts: this.posts.map(x=>{x.content=this.ipfsCache[x.content];return x})
      })
  }

  sortPosts() {
      // Sort posts. Show highest tipped posts first
      this.setState({
        posts: this.posts.sort((a,b) => b.tipAmount - a.tipAmount )
      })
  }
  
  async initTokenSale() {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = SEGTokenSale.networks[networkId]
    if(networkData) {
        const tokenSale = new web3.eth.Contract(SEGTokenSale.abi, networkData.address)
        this.setState({ tokenSale })
    }
  }
  
  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = parseInt(await socialNetwork.methods.postCount().call())
      this.setState({ postCount })
      
      
      // Load Posts
      for (var i = postCount; i >= 1; i--) {
        const post = await socialNetwork.methods.posts(i).call()
        post.replies = []
        if (post.replyTo == -1) {
            this.posts.push(post)
        } else {
            if (this.replyMap[post.replyTo] == null) {
                this.replyMap[post.replyTo] = []
            }
            this.replyMap[post.replyTo].push(post)
        }
        
        
        this.ipfs.get('/ipfs/'+post.content).then(result => {
            this.ipfsCache[post.content] = new TextDecoder().decode(result[0].content)
        }) 
        
      }
    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }

  createPost(content) {
    this.setState({ loading: true })
    
    this.ipfs.add(Buffer.from(content)).then(result => {
        this.state.socialNetwork.methods.createPost(result[0].hash).send({ from: this.state.account }).once('receipt', (receipt) => {
          this.setState({ loading: false })
          
          // Add the newly added post to state and update
          const created = receipt.events.PostCreated.returnValues 
          created.content = content
          created.replies = []
          this.posts.unshift(created)
          this.sortPosts();
        })
    });
  }
  
  
  
  replyToPost(content, id) {
    
    this.setState({ loading: true })
    
    this.ipfs.add(Buffer.from(content)).then(result => {
        this.state.socialNetwork.methods.replyToPost(result[0].hash, id).send({ from: this.state.account }).once('receipt', (receipt) => {
          this.setState({ loading: false })
          
          // Add the newly added post to state and update
          const created = receipt.events.PostCreated.returnValues 
          created.content = content
          this.posts.find(x=>x.id==id).replies.push(created)
          this.setState({
            posts: this.posts
          })
        })
    });
  }


  tipPost(id, tipAmount) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
    .once('receipt', (receipt) => {
    
      const post = receipt.events.PostTipped.returnValues 
      this.posts.find(x=>x.id==id).tipAmount = post.tipAmount
      this.sortPosts();
    
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      tokenSale: null,
      postCount: 0,
      posts: [],
      loading: true
    }
   
 
    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
    this.posts = []
    this.ipfsCache = new Map()
    this.replies = []
    this.modal = React.createRef()
    this.modalPayment = React.createRef()
    var ipfsAPI = require('ipfs-api')
    this.replyMap = new Map()
    this.ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})
  }
 
  openReplyModal(id) {
    this.modal.current.show(id)
  }
  openBuyModal() {
  
    this.modalPayment.current.show()
  
  }
  onSend() {
    this.replyToPost(this.modal.current.replyContent.value, this.modal.current.id)
  }
  
  onBuy() {
    
    let amountTokens = this.modalPayment.current.amount.value
    this.setState({ loading: true })

    this.state.tokenSale.methods.buyTokens(amountTokens).send({ from: this.state.account, value: 100*amountTokens }).once('receipt', (receipt) => {
        this.setState({ loading: false })
        this.modalPayment.hide()
    });


  }
  
  tipReply(id, tipAmount) {
      this.setState({ loading: true })
    this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
    .once('receipt', (receipt) => {
    
      const post = receipt.events.PostTipped.returnValues 
      this.replyMap[post.replyTo].find(x=>x.id==id).tipAmount = post.tipAmount
      this.sortPosts();
    
      this.setState({ loading: false })
    })
    
    
  }
  
  render() {
    return (
      <div>
        <Navbar account={this.state.account} openBuyModal={this.openBuyModal.bind(this)}/>
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <><Main
              posts={this.state.posts}
              createPost={this.createPost}
              tipPost={this.tipPost}
              tipReply={this.tipReply.bind(this)}
              openReplyModal={this.openReplyModal.bind(this)}
            />
            <MyModal ref={this.modal}
                onSend={this.onSend.bind(this)}/>
            <MyPaymentModal ref={this.modalPayment}
                onSend={this.onBuy.bind(this)}/>
            </>
        }
      </div>
    );
  }
}

export default App;
