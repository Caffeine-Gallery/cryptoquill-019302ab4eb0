import Int "mo:base/Int";
import Text "mo:base/Text";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";

actor {
    // Post type definition
    public type Post = {
        title: Text;
        content: Text;
        author: Text;
        timestamp: Int;
    };

    // Stable variable to store posts
    private stable var posts : [Post] = [];
    
    // Create a new post
    public shared func createPost(title: Text, content: Text, author: Text) : async () {
        let newPost : Post = {
            title = title;
            content = content;
            author = author;
            timestamp = Time.now();
        };
        
        let buffer = Buffer.fromArray<Post>(posts);
        buffer.add(newPost);
        posts := Buffer.toArray(buffer);
    };

    // Get all posts sorted by timestamp (newest first)
    public query func getPosts() : async [Post] {
        Array.sort<Post>(posts, func(a, b) {
            if (a.timestamp > b.timestamp) { #less }
            else if (a.timestamp < b.timestamp) { #greater }
            else { #equal }
        })
    };
}
