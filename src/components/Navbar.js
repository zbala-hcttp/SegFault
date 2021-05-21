import React, { Component } from 'react';
import Identicon from 'identicon.js';
import logo from '../coin.png';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-2 shadow">
      <div className="container-fluid">
         <div onClick={this.props.openBuyModal} className="nav-item text-nowrap d-none d-sm-none d-sm-block" style = {{
                        cursor: "pointer"
                    }}>
            <span className="mr-2 header">Buy tokens</span>
            <img src={logo} width="30" height="30" alt="littlecoins"/>
        </div>
        <ul className="nav navbar-nav navbar-center">
            <li className="header nav-item text-nowrap d-none d-sm-none d-sm-block">
                SegFault
            </li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
        
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="buy">{this.props.account}</small>
            </small>
            { this.props.account
              ? <img
                width='30'
                className="ml-2"
                height='30'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
              />
              : <span></span>
            }
          </li>
          
        </ul>

        </div>
      </nav>
    );
  }
}

export default Navbar;
