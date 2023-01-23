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
document.addEventListener("readystatechange", getLibrary);

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
  let daysToRead = calcDays(tempEnd, tempStart);
  let pagesPerDay = Math.round(book.pages / daysToRead);
  let currentDate = Date.now();
  let formattedStart = formatDate(tempStart, currentDate);
  console.log(currentDate);
  console.log(book.start, tempStart);

  tempD1.textContent = `${book.title}, ${book.author}`;
  tempD2.textContent = `${book.pages} Pages`;

  if (book.read) {
    tempD3.textContent = `\u2705`;
    tempD4.textContent = `It took you ${daysToRead} days to read ${book.title}. You averaged ${pagesPerDay} pages read a day.`;
  } else {
    tempD3.textContent = `\u274C`;
    tempD4.textContent = `You started reading this book on ${formattedStart}, keep at it!`;
  }

  bookTable.appendChild(tempR);
  tempR.appendChild(tempD1);
  tempR.appendChild(tempD2);
  tempR.appendChild(tempD3);
  tempR.appendChild(tempD4);
}

function bindAndStore(event) {
  event.preventDefault();
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
  storeLibrary();
}

function formatDate(dateString, adjustment) {
  let exactDate = calcAdjustment(dateString, adjustment);
  let date = new Date(exactDate);

  let options = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  let formatted = date.toLocaleString("en-US", options);
  return formatted;
}

function calcDays(utc1, utc2) {
  let oneDay = 86400000;

  let daysDiff = Math.floor((utc1 - utc2) / oneDay);

  return daysDiff;
}

function calcAdjustment(utc1, utc2) {
  let oneDay = 86400000;
  let diff = utc2 - utc1;
  let days = Math.floor(diff / oneDay);
  let left = diff - days * oneDay;
  return utc1 + left;
}

function storeLibrary() {
  window.localStorage.removeItem("library");
  let jsonObj = JSON.stringify(library);
  localStorage.setItem("library", jsonObj);
}

function getLibrary() {
  let jsonObj = window.localStorage.getItem("library");
  let parsed = JSON.parse(jsonObj);
  parsed.forEach((a) => {
    library.push(a);
    renderPersonalLibrary(a);
  });
}
