const publishContainer = document.querySelector(".publish-container");
const loginForm = document.querySelector(".loginForm");
const articleContainer = document.querySelector(".article-container");
const loginContainer = document.querySelector(".login-container");
const newArticleForm = document.querySelector(".new-article-form");
let token = localStorage.getItem("token");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;
  const body = {};
  body.username = username;
  body.password = password;
  const response = await fetch(
    "https://sheltered-peak-99436.herokuapp.com/log-in",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const status = await response.status;
  if (status === 200) {
    token = await response.text();
    localStorage.setItem("token", token);
    loginContainer.style.display = "none";
    displayArticles(token);
    articleContainer.style.display = "block";
  }
});

newArticleForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = newArticleForm.title.value;
  const content = newArticleForm.content.value;
  const body = {};
  body.title = title;
  body.content = content;
  const response = await fetch(
    "https://sheltered-peak-99436.herokuapp.com/articles/new",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(body),
    }
  );
  const status = await response.status;

  if (status === 200) {
    displayArticles(token);
    newArticleForm.reset();
  }
});

async function displayArticles(token) {
  publishContainer.innerHTML = "";
  const articleResponse = await fetch(
    "https://sheltered-peak-99436.herokuapp.com/articles/all",
    {
      headers: {
        "auth-token": token,
      },
    }
  );
  const articles = await articleResponse.json();
  articles.forEach((article) => {
    const articleContent = document.createElement("div");
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete Article";
    deleteButton.addEventListener("click", async () => {
      const response = await fetch(
        `https://sheltered-peak-99436.herokuapp.com/articles/${article._id}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      const status = await response.status;
      if (status === 204) {
        displayArticles(token);
      }
    });

    const publishButton = document.createElement("button");
    const body = {};
    body.publish = !article.published;
    publishButton.innerText = article.published
      ? "Unpublish Article"
      : "Publish Article";
    publishButton.addEventListener("click", async () => {
      const response = await fetch(
        `https://sheltered-peak-99436.herokuapp.com/articles/${article._id}/publish`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(body),
        }
      );

      const status = await response.status;
      if (status === 200) {
        displayArticles(token);
      }
    });

    const editContainerHTML = `<div id="${article.id}" style="display:none;">
    <h2>Edit Article</h2>
      <form class="edit-article-form">
        <label for="title">Title</label><br />
        <input type="text" name="title" value="${article.title}"required  minlength="1"/><br />
        <label for="content">Content</label><br />
        <textarea type="text" name="content" value="${article.content}" required  minlength="1"></textarea><br />
        <button type="submit">Make Changes</button>
      </form>
      </div>`;

    const articleHTML = `
      <h3>${article.title}</h3>
        <p>${article.content}</p>
        <p>By ${article.author.username}</p>
    `;

    articleContent.insertAdjacentHTML("beforeend", articleHTML);
    articleContent.insertAdjacentElement("beforeend", deleteButton);
    articleContent.insertAdjacentElement("beforeend", publishButton);
    articleContent.insertAdjacentHTML("beforeend", editContainerHTML);

    const editButton = document.createElement("button");
    editButton.innerText = "Edit Article";

    editButton.addEventListener("click", async () => {
      articleContent.querySelector(`#${article.id}`).style.display = "block";
    });

    articleContent.insertAdjacentElement("beforeend", editButton);

    const editForm = articleContent
      .querySelector(`#${article.id}`)
      .querySelector("form");

    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formBody = {};
      formBody.title = editForm.title.value;
      formBody.content = editForm.content.value;
      const response = await fetch(
        `https://sheltered-peak-99436.herokuapp.com/articles/${article._id}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(formBody),
        }
      );
      const status = await response.status;
      if (status === 200) {
        articleContent.querySelector(`#${article.id}`).style.display = "none";
      }
      editForm.reset();
      displayArticles(token);
    });

    publishContainer.insertAdjacentElement("beforeend", articleContent);
  });
}
