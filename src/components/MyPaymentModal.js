import React from 'react';
import Modal from 'react-bootstrap4-modal';

class MyPaymentModal extends React.Component {
    
  
  show() {
    this.setState({visible: true}) 
  }
  
  hide() {
    this.setState({visible: false}) 
  }
  
  constructor(props) {
    super(props)
    this.state = {
      visible: false
      }
  }
  
  
  render() {
    return (
      <Modal visible={this.state.visible} onClickBackdrop={this.modalBackdropClicked}>
        <div className="modal-header">
          <h5 className="modal-title">Buy Tokens</h5>
        </div>
        <div className="modal-body">
            <input
                      id="amount"
                      type="number"
                      ref={(input) => { this.amount = input }}
                      className="form-control"
                      placeholder="Specify an amount"
                      required />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={()=>{this.setState({visible: false})}}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={this.props.onSend}>
            Send
          </button>
        </div>
      </Modal>
    );
  }
}

export default MyPaymentModal;


