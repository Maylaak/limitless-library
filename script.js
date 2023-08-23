document.addEventListener("DOMContentLoaded", function() {
    const userMessageInput = document.getElementById("user-message");
    const sendButton = document.getElementById("send-button");
    const messageHistory = document.getElementById("message-history");

    function displayPastMessages() {
        const messages = JSON.parse(localStorage.getItem("messages")) || [];
        messageHistory.innerHTML = messages.map(message => `<div class="message">${message}</div>`).join("");
    }

    function saveAndDisplayMessage(message) {
        const messages = JSON.parse(localStorage.getItem("messages")) || [];
        messages.push(message);
        localStorage.setItem("messages", JSON.stringify(messages));
        displayPastMessages();
    }

    async function fetchBookInfo(bookName) {
        try {
            const response = await fetch(`https://openlibrary.org/search.json?q=${bookName}`);
            const responseData = await response.json();
            const book = responseData.docs[0];
            if (book) {
                const title = book.title;
                const author = book.author_name ? book.author_name[0] : "Unknown Author";
                const year = book.first_publish_year ? book.first_publish_year : "Unknown Year";
                const ebookLink = book.ebook_count_i > 0 ? `<a href="https://openlibrary.org${book.key}/ebooks">${book.ebook_count_i} Ebook(s)</a>` : "No Ebook Available";
                return `Title: ${title}<br>Author: ${author}<br>Year: ${year}<br>${ebookLink}`;
            } else {
                return "Book not found.";
            }
        } catch (error) {
            return "An error occurred while fetching book information.";
        }
    }

    sendButton.addEventListener("click", async function() {
        const userMessage = userMessageInput.value;
        if (userMessage) {
            saveAndDisplayMessage(`You: ${userMessage}`);
            const bookInfo = await fetchBookInfo(userMessage);
            saveAndDisplayMessage(`Bot: ${bookInfo}`);
            userMessageInput.value = "";
        }
    });

    displayPastMessages();
});

