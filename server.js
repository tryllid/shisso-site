const express = require('express');
const { marked } = require('marked');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('.'));

// Function to read and convert markdown to HTML
async function convertMarkdownToHtml(filePath) {
    try {
        const markdown = await fs.readFile(filePath, 'utf-8');
        return marked(markdown);
    } catch (error) {
        console.error('Error reading markdown file:', error);
        return '<h1>Error loading content</h1>';
    }
}

// Route for blog posts
app.get('/blog/:post', async (req, res) => {
    const postPath = path.join(__dirname, 'blog', `${req.params.post}.md`);
    const html = await convertMarkdownToHtml(postPath);
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Blog Post</title>
            <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
            <header>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/faq">FAQ</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <article class="blog-post">
                    ${html}
                </article>
            </main>
            <footer>
                <p>&copy; 2024 My Website. All rights reserved.</p>
            </footer>
        </body>
        </html>
    `);
});

// Route for static pages (about, faq)
app.get('/:page', async (req, res) => {
    const pagePath = path.join(__dirname, 'pages', `${req.params.page}.md`);
    const html = await convertMarkdownToHtml(pagePath);
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${req.params.page.charAt(0).toUpperCase() + req.params.page.slice(1)}</title>
            <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
            <header>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/faq">FAQ</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <article class="page-content">
                    ${html}
                </article>
            </main>
            <footer>
                <p>&copy; 2024 My Website. All rights reserved.</p>
            </footer>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 