const API = "http://localhost:5000/api";

// USER REGISTRATION
document.getElementById("registerForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const userData = {
        name: document.getElementById("regName").value,
        email: document.getElementById("regEmail").value,
        password: document.getElementById("regPassword").value
    };

    try {
        const response = await fetch(`${API}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            e.target.reset();
        }

    } catch (error) {
        alert("Unable to connect to server");
    }
});


// USER LOGIN
document.getElementById("loginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const loginData = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };

    try {
        const response = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            localStorage.setItem("token", data.token);
            e.target.reset();
        }

    } catch (error) {
        alert("Unable to connect to server");
    }
});


// CREATE BLOG
document.getElementById("blogForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const blogData = {
        title: document.getElementById("blogTitle").value,
        category: document.getElementById("blogCategory").value,
        content: document.getElementById("blogContent").value
    };

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first!");
        return;
    }

    try {
        const response = await fetch(`${API}/blogs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(blogData)
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            e.target.reset();
            loadBlogs();
        }

    } catch (error) {
        alert("Unable to create blog");
    }
});


// GET ALL BLOGS
async function loadBlogs() {

    try {
        const response = await fetch(`${API}/blogs`);
        const blogs = await response.json();

        const blogList = document.getElementById("blogList");

        blogList.innerHTML = "";

        blogs.forEach(blog => {

            const card = document.createElement("div");
            card.className = "blog-card";

            const title = document.createElement("h3");
            title.textContent = blog.title;

            const category = document.createElement("p");
            category.textContent = `Category: ${blog.category}`;

            const content = document.createElement("p");
            content.textContent = blog.content;

            const author = document.createElement("small");
            author.textContent =
                `Author: ${blog.author?.name || "Unknown"}`;

            card.append(title, category, content, author);
            blogList.appendChild(card);
        });

    } catch (error) {
        console.log("Error loading blogs:", error);
    }
}

// Load blogs when page opens
loadBlogs();