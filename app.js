console.log("Hello World!");

let modalPlacement = document.getElementById("modalHere");
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
let bookSVG = 

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
    this.imgURL = "./assets/book.svg";
    this.imgH = "200";
    this.imgW = "200";
  }
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
  let tempD5 = document.createElement("td");
  let thumbnail = document.createElement("img");
  let tempStart = Date.parse(book.start);
  let tempEnd = Date.parse(book.end);
  console.log("tempEnd:", tempEnd);
  let daysToRead = calcDays(tempEnd, tempStart);
  let pagesPerDay = Math.round(book.pages / daysToRead);
  let currentDate = Date.now();
  let formattedStart = formatDate(tempStart, currentDate);
  console.log(currentDate);
  console.log(book.start, tempStart);
  
    thumbnail.src = `${book.imgURL}`;
    thumbnail.alt = `${book.title} cover art`;
    thumbnail.height = "25";
    thumbnail.width = "25";
  
  tempR.setAttribute("imgURL", `${book.imgURL}`);
  tempR.setAttribute("imgALT", `${book.title} cover art`);
  tempR.setAttribute("imgH", `${book.imgH}`);
  tempR.setAttribute("imgW", `${book.imgW}`);

  console.log("pass the img?", tempR.getAttribute("imgURL"));
  tempR.id = `${book.title}`;
  console.log(tempR.id);

  tempR.addEventListener("click", updateModal);

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
  tempR.appendChild(tempD5);
  tempR.appendChild(tempD1);
  tempR.appendChild(tempD2);
  tempR.appendChild(tempD3);
  tempR.appendChild(tempD4);
  tempD5.appendChild(thumbnail);

  /* if (book.imgH == 25 && book.imgW == 25) {
    thumbnail.src = `${book.imgURL}`;
    thumbnail.alt = `${book.title} cover art`;
    thumbnail.height = book.imgH;
    thumbnail.width = book.imgW;
    tempD5.appendChild(thumbnail);
    } else {
      thumbnail = book.imgURL;
  tempD5.appendChild(thumbnail);
    }; */
  
}

// This code is responsible for binding an event to the submit button and storing the data in the library. The bindAndStore() function takes the input data from the form and creates a new book object, which is then pushed to the library array. The renderPersonalLibrary() function is then called to render the new book object. Finally, the storeLibrary() function is called to store the library array in the localStorage.

async function bindAndStore(event) {
  event.preventDefault();
  let newBook = createBook(
    titleInput,
    authorInput,
    pageCount,
    checkBox,
    startDate,
    endDate
  );
  fetchAndSetBookCover(newBook.title, newBook.imgURL);
  library.push(newBook);
  console.log(library);
  renderPersonalLibrary(newBook);
  //storeLibrary();
}

// This code is responsible for formatting a date string, calculating the difference between two dates, and calculating an adjustment for a date. The formatDate() function takes a date string and an adjustment, calculates the adjusted date, and formats it for display. The calcDays() function calculates the difference between two dates. The calcAdjustment() function calculates the adjustment for a date to account for timezone difference vs UTC.

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

/* The storeLibrary function first removes the existing "library" item from local storage (if it exists),
then stringifies the library object and stores it as the new "library" item in local storage. */
function storeLibrary() {
  window.localStorage.removeItem("library");
  let jsonObj = JSON.stringify(library);
  localStorage.setItem("library", jsonObj);
}

/* The getLibrary function retrieves the "library" item from local storage, parses it back into an object, and adds each element to the library array. The function then calls the renderPersonalLibrary function for each element in the parsed object. */
function getLibrary() {
  let jsonObj = window.localStorage.getItem("library");
  let parsed = JSON.parse(jsonObj);
  parsed.forEach((a) => {
    library.push(a);
    renderPersonalLibrary(a);
  });
}

/* The updateModal function creates and adds an update modal element to the modalPlacement element in the DOM. The modal contains a form with a date input and buttons to "Finished Reading" and "X" (to close the modal). When the "Finished Reading" button is clicked, the modal updates the end date and the read status of the corresponding book in the library array. The function then calls storeLibrary to update the "library" item in local storage, calls getLibrary to retrieve and display the updated library, and removes the modal. */
function updateModal(event) {
  let updateModalBack = document.createElement("div");
  let updateModalCard = document.createElement("div");
  let modalForm = document.createElement("form");
  let modalInputLabel = document.createElement("label");
  let modalInput = document.createElement("input");
  let updateBtn = document.createElement("button");
  let close = document.createElement("button");
  let img = document.createElement("img");
  let tempID = event.target.parentElement.id;
  console.log("TEMPID HERE: ", tempID);

  img.src = event.target.parentElement.getAttribute("imgURL");
  img.alt = event.target.parentElement.getAttribute("imgALT");  
  img.height = event.target.parentElement.getAttribute("imgH");
  img.width = event.target.parentElement.getAttribute("imgW");
  
  modalInput.type = "date";
  modalInput.name = "modalInput";
  modalInput.id = "modalInput";
  modalInputLabel.for = "modalInput";
  modalInputLabel.textContent = "Date Finished";
  updateBtn.textContent = "Finished Reading";
   

  close.textContent = "X";
  close.addEventListener("click", () => {
    updateModalBack.remove();
  });

  updateBtn.addEventListener("click", () => {
    library.forEach((a) => {
      console.log(a.title);
      if (a.title == tempID) {
        a.end = modalInput.valueAsDate;
        a.read = true;
        console.log("endDateOfA:", a.endDate);
      }
    });
    bookTable.remove();
    storeLibrary();
    getLibrary();
    updateModal.remove();
  });

  updateModalBack.id = "updateModalBack";
  updateModalCard.id = "updateModalCard";

  modalPlacement.appendChild(updateModalBack);
  updateModalBack.appendChild(updateModalCard);
  updateModalCard.appendChild(modalForm);
  modalForm.appendChild(modalInputLabel);
  modalForm.appendChild(modalInput);
  modalForm.appendChild(updateBtn);
  updateModalCard.appendChild(close);
  updateModalCard.appendChild(img);
}

async function fetchImage(url) {
  const img = new Image();
  return new Promise((res, rej) => {
    img.onload = () => res(img);
    img.onerror = (e) => rej(e);
    img.src = url;
  });
}

async function fetchAndSetBookCover(title, img) {
  let tempID = 0;
  await fetch(`https://openlibrary.org/search.json?q=title:${title}&limit=1`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(data.docs[0].cover_i);
      tempID = data.docs[0].cover_i;
    })
    .catch((err) => console.error(err));

  img = await fetchImage(`https://covers.openlibrary.org/b/id/${tempID}-M.jpg`);

  console.log("img: ", img);
  library.forEach((a) => {
    if (title == a.title && img.src.includes("")) {
      a.imgURL = img.src;
      a.imgH = img.height;
      a.imgW = img.width;
    }
  });
  storeLibrary();
}

