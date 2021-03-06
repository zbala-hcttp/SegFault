pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name;
    uint public postCount = 0;
    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        int replyTo;
        string content;
        uint tipAmount;
        address payable author;
    }

    event PostCreated(
        uint id,
        int replyTo,
        string content,
        uint tipAmount,
        address payable author
    );

    event PostTipped(
        uint id,
		int replyTo,
        string content,
        uint tipAmount,
        address payable author
    );

    constructor() public {
        name = "SegFault Social Network";
    }
    function replyToPost(string memory _content, int id) public {
        // Require valid content
        require(bytes(_content).length > 0);
        // Increment the post count
        postCount ++;
        // Create the post
        posts[postCount] = Post(postCount, id, _content, 0, msg.sender);
        // Trigger event
        emit PostCreated(postCount, id, _content, 0, msg.sender);
    }
    function createPost(string memory _content) public {
        // Require valid content
        require(bytes(_content).length > 0);
        // Increment the post count
        postCount ++;
        // Create the post
        posts[postCount] = Post(postCount, -1, _content, 0, msg.sender);
        // Trigger event
        emit PostCreated(postCount, -1, _content, 0, msg.sender);
    }

    function tipPost(uint _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= postCount);
        // Fetch the post
        Post memory _post = posts[_id];
        // Fetch the author
        address payable _author = _post.author;
        // Pay the author by sending them Ether
        address(_author).transfer(msg.value);
        // Incremet the tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        // Update the post
        posts[_id] = _post;
        // Trigger an event
        emit PostTipped(postCount, _post.replyTo, _post.content, _post.tipAmount, _author);
    }
}
