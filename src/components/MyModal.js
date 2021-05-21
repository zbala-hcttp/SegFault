import React from 'react';
import Modal from 'react-bootstrap4-modal';

class MyModal extends React.Component {
    
  
  show(id) {
    this.id = id
    this.setState({visible: true}) 
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
          <h5 className="modal-title">Reply to Post</h5>
        </div>
        <div className="modal-body">
            <textarea
                      id="replyContent"
                      type="text"
                      ref={(input) => { this.replyContent = input }}
                      className="form-control"
                      placeholder="Send a reply..."
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

export default MyModal;


