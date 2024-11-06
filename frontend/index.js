import { backend } from "declarations/backend";

let quill;

document.addEventListener('DOMContentLoaded', async () => {
    initQuill();
    setupEventListeners();
    await loadPosts();
});

function initQuill() {
    quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Write your post content...',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });
}

function setupEventListeners() {
    const newPostBtn = document.getElementById('newPostBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const postForm = document.getElementById('postForm');
    const modal = document.getElementById('newPostForm');

    newPostBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        postForm.reset();
        quill.setContents([]);
    });

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loader = document.getElementById('loader');
        loader.classList.remove('hidden');

        try {
            const title = document.getElementById('title').value;
            const author = document.getElementById('author').value;
            const content = quill.root.innerHTML;

            await backend.createPost(title, content, author);
            
            modal.classList.add('hidden');
            postForm.reset();
            quill.setContents([]);
            await loadPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            loader.classList.add('hidden');
        }
    });
}

async function loadPosts() {
    const loader = document.getElementById('loader');
    const postsContainer = document.getElementById('posts');
    
    loader.classList.remove('hidden');
    postsContainer.innerHTML = '';

    try {
        const posts = await backend.getPosts();
        
        posts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'post';
            
            const date = new Date(Number(post.timestamp));
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            article.innerHTML = `
                <h2>${post.title}</h2>
                <div class="post-meta">
                    <span class="author">By ${post.author}</span>
                    <span class="date">${formattedDate}</span>
                </div>
                <div class="post-content">${post.content}</div>
            `;
            
            postsContainer.appendChild(article);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
    } finally {
        loader.classList.add('hidden');
    }
}
