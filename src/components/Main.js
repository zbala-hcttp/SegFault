import React, { Component } from 'react';
import Identicon from 'identicon.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class Main extends Component {

  render() {
    return (
      <div>
      
        <div className="container-fluid mt-5">
        
          <div className="row">
          
            <main role="main" className="col ml-5 mr-5">
            
              <div className="content mr-auto ml-auto">
                <p>&nbsp;</p>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const content = this.postContent.value
                    this.props.createPost(content)
                  }}>
                  <div className="form-group mr-sm-2">
                    <textarea
                      id="postContent"
                      type="text"
                      ref={(input) => { this.postContent = input }}
                      className="form-control"
                      placeholder="What is your question?"
                      required />
                  </div>
                  <div className="col text-center">
                    <button 
						type="submit" 
						className="btn btn-primary btn-default btn-block" 
						style={{ width: '190px', borderRadius: '15px', fontSize: '14px', backgroundColor: '#1E82C7' }}>
                      ADD QUESTION
                    </button>
                  </div>
                  
                </form>
                <p>&nbsp;</p>
                
                { this.props.posts.map((post, key) => {
                  return(
                    <div className="card mb-4" key={key} >
                      <div className="card-header">
                        <img
                          className='mr-2'
                          width='30'
                          height='30'
                          src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                        />
                        <small className="text-muted">{post.author}</small>
                      </div>
                      <ul id="postList" className="list-group list-group-flush">
                        <li className="list-group-item">
                          <p>Q: {post.content}</p>
                         
                          {post.replies.map((p,k)=>{ return(<div className="card mb-4" key={k}>
                          
                          <div className="card-header">
                            <img
                              className='mr-2'
                              width='30'
                              height='30'
                              src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                            />
                            <small className="text-muted">{p.author}</small>
                          </div>
                          <ul id="postList" className="list-group list-group-flush">
                            <li className="list-group-item">
                          {p.content}
                          </li>
                          
                           <li key={key} className="list-group-item py-2">
                          <small className="float mt-1 text-muted">
                            Votes: {window.web3.utils.fromWei(p.tipAmount.toString(), 'Ether')} ETH
                          </small>
                  
                          <button
                            className="btn btn-link btn-sm float-right pt-0"
                            name={p.id}
                            onClick={(event) => {
                              let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                              console.log(event.target.name, tipAmount)
                              this.props.tipReply(event.target.name, tipAmount)
                            }}
                          >
                            UPVOTE
                          </button>
              
                        </li>
                          </ul>
                          
                          </div>) })}
                          
                        </li>
                        <li key={key} className="list-group-item py-2">
                          <small className="float mt-1 text-muted">
                            Votes: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                          </small>
                  
                          <button
                            className="btn btn-link btn-sm float-right pt-0"
                            name={post.id}
                            onClick={(event) => {
                              let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                              console.log(event.target.name, tipAmount)
                              this.props.tipPost(event.target.name, tipAmount)
                            }}
                          >
                            UPVOTE
                          </button>
                                  <button
                            className="btn btn-link btn-sm float-right pt-0"
                            name={post.id}
                            onClick={(event) => {
                              this.props.openReplyModal(event.target.name)
                            }}
                          >
                            REPLY
                          </button>
                        </li>
                      </ul>
                    </div>
                    
   
                    
             
                    
                  )
                })}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
