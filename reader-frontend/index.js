const articlesContainer = document.querySelector(".article-container");

async function displayArticles() {
  const articleResponse = await fetch("http://localhost:5000/articles");
  const articles = await articleResponse.json();
  articles.forEach(async (article) => {
    console.log(article._id);

    // get comments for the article
    // add the article and comments to the container div
    const articleContent = document.createElement("div");

    const articleHTML = `
      <h3>${article.title}</h3>
        <p>${article.content}</p>
        <p>By ${article.author.username}</p>
        <h4>Comments</h4>
    `;

    const commentResponse = await fetch(
      `http://localhost:5000/articles/${article._id}/comments`
    );
    const comments = await commentResponse.json();
    console.log(comments);

    const commentsHTML =
      comments.length > 0
        ? comments
            .map((comment) => `<p>${comment.author} - ${comment.message}</p>`)
            .join("")
        : "This article does not have any comments yet";

    // show comment form for article
    const commentForm = `
    <h4>Leave a comment<h4>
    <form action="http://localhost:5000/articles/${article._id}/comments/new" method="post">
      <label for="username">Username</label><br/>
      <input type="text" name="username" required/><br/>
      <label for="message">Your message</label><br/>
      <textarea type="textarea" name="message" required></textarea><br/>
      <button type="submit">Comment</button>
    </form>
    <hr/>
    `;

    articleContent.insertAdjacentHTML("beforeend", articleHTML);
    articleContent.insertAdjacentHTML("beforeend", commentsHTML);
    articleContent.insertAdjacentHTML("beforeend", commentForm);
    articlesContainer.insertAdjacentElement("beforeend", articleContent);
  });
}

displayArticles();
