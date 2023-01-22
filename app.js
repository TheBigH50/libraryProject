console.log("Hello World!");

let inputForm = document.getElementById("inputForm");
let titleInput = document.getElementById("title");
let authorInput = document.getElementById("author");
let pageCount = document.getElementById("pageCount");
let checkBox = document.getElementById("checkBox");
let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");
let addBook = document.getElementById("addBook");
let bookTableSection = document.getElementById("bookTableSection");
let bookTable = document.getElementById("bookTable");
let btCaption = document.getElementById("btCaption");
let tableRows = document.getElementsByTagName("tr");
let library = [];

addBook.addEventListener("click", bindAndStore);

class Book {
  constructor(title, author, pages, read, start, end) {
    this.title = title.value;
    this.author = author.value;
    this.pages = pages.value;
    this.read = read.checked;
    this.start = start.value;
    this.end = end.value;
  }
  beenRead() {}
}

function createBook(title, author, pages, read, start, end) {
  return new Book(title, author, pages, read, start, end);
}

function renderPersonalLibrary(book) {

  
    let tempR = document.createElement("tr");
    let tempD1 = document.createElement("td");
    let tempD2 = document.createElement("td");
    let tempD3 = document.createElement("td");
    let tempD4 = document.createElement("td");
    let tempStart = Date.parse(book.start);
    let tempEnd = Date.parse(book.end);
    console.log(tempStart);

    tempD1.textContent = `${book.title}, ${book.author}`;
    tempD2.textContent = `${book.pages} Pages`;
    tempD4.textContent = `It took you ${tempStart} days to read ${book.title}. You averaged ${tempEnd} pages read a day.`;

    if (book.read) {
      tempD3.textContent = `\u2705`;
    } else {
      tempD3.textContent = `\u274C`;
    }

    bookTable.appendChild(tempR);
    tempR.appendChild(tempD1);
    tempR.appendChild(tempD2);
    tempR.appendChild(tempD3);
    tempR.appendChild(tempD4);    
  
}

function bindAndStore() {
  //event.preventDefault();
  let newBook = createBook(
    titleInput,
    authorInput,
    pageCount,
    checkBox,
    startDate,
    endDate
  );

  library.push(newBook);
  console.log(library);  
  renderPersonalLibrary(newBook);
}
