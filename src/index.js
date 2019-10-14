let quoteList;
let quoteForm;

function renderQuote(quote){
    quoteList.insertAdjacentHTML("beforeend", `
    <li class='quote-card' data-quote-id="${quote.id}">
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </li>
    `)
}

function renderQuotes(array){
    array.forEach(renderQuote)
}

function fetchQuotes(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(quotes => renderQuotes(quotes))
}

function addLike(button){
    const quoteCard = button.closest("li.quote-card");
    const quoteId = quoteCard.dataset.quoteId
    const quoteCounter = quoteCard.querySelector("span")
    const likeObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quoteId: parseInt(quoteId)
        })
    };
    fetch("http://localhost:3000/likes", likeObj)
    .then(() => quoteCounter.innerText = parseInt(quoteCounter.innerText) + 1)
}

function deleteQuote(button){
    const quoteCard = button.closest("li.quote-card");
    const quoteId = quoteCard.dataset.quoteId;
    fetch(`http://localhost:3000/quotes/${quoteId}`, {method: "DELETE"})
    .then(() => quoteCard.remove())
}

function addEventListenerToQuoteList(){
    quoteList.addEventListener("click", event => {
        switch (event.target.className) {
            case "btn-success":
                addLike(event.target)
                break;
            
            case "btn-danger":
                deleteQuote(event.target)
                break;
        }
    })
}

function addNewQuote(submit){
    submit.preventDefault();
    const form = submit.target;

    const quoteBody = {
        quote: form.quote.value,
        author: form.author.value
    };

    const quoteObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(quoteBody)
    };

    fetch("http://localhost:3000/quotes", quoteObj)
    .then(resp => resp.json())
    .then(quote => renderQuote(quote));
}

function addEventListenerToForm(){
    quoteForm.addEventListener("submit", event => addNewQuote(event))
}

document.addEventListener("DOMContentLoaded", () => {
   quoteList = document.querySelector("ul#quote-list");
   quoteForm = document.querySelector("form#new-quote-form");
    fetchQuotes();
    addEventListenerToQuoteList();
    addEventListenerToForm();
})
