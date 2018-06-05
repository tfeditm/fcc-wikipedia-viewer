
// DEFINING THE BASE URLs
let startUrl = "https://";
let baseUrl = ".wikipedia.org";
let setSearchUrl =
  "/w/api.php?action=query&list=search&srprop=snippet&format=json&formatversion=latest&origin=*&continue=sroffset%7C%7C";
let sroffset:number; // Use this value to continue paging (returned by query)
let url:any;

// DEFINING THE MAX NUMBER OF ARTICLE ON THE PAGE
let maxNumberOfArticle:number = 10;

// GRAB REFERENCES TO ALL THE DOM ELEMENTS WE'LL NEED TO MANIPULATE
let searchTerm:any = document.querySelector("#search-input-text");
let searchTermContainer:any = document.querySelector("#search-input-text-container");
let searchForm:any = document.querySelector("#search-form");
let submitBtn:any = document.querySelector("#search-submit-button");
let clearInputTextButton:any = document.querySelector("#clear-input-text-button");
let selectedLang:any = document.querySelector("#lang-selector");
let articles:any = document.querySelector("#articles");
let pager: any = document.querySelector("#pager");
let prevButton:any = document.querySelector("#prevButton");
let nextButton:any = document.querySelector("#nextButton");


// EVENT LISTENERS TO CONTROL THE FUNCTIONALITY
searchForm.addEventListener("submit", submitSearch);
searchTerm.addEventListener("keyup", toggleClearInputTextButton);
searchTerm.addEventListener("focus", searchTermFocus);
searchTerm.addEventListener("blur", searchTermBlur);
clearInputTextButton.addEventListener("click", clearInputText);
prevButton.addEventListener("click", previousPage);
nextButton.addEventListener("click", nextPage);

// DEFINING THE FUNCTIONS FOR FETCH() TO MAKE THE REQUEST TO THE API
function validateResponse(response: any) {
  if (!response.ok) {
    throw Error(response.status.text);
  }
  return response;
}

function getResponseAsJSON(response: any) {
  return response.json();
}

function workWithResult(result: any) {
  displayResults(result);
  console.log("call displayResult");
}

function logError(error: any) {
  console.log(error);
}

function fetchJSON(pathToResource: any) {
  fetch(pathToResource)
    .then(validateResponse)
    .then(getResponseAsJSON)
    .then(workWithResult)
    .catch(logError);
}

// DISPLAY THE RESULTS
function displayResults(data: any) {

  while (articles.firstChild) {
    articles.removeChild(articles.firstChild);
  }

  if (data.query.search.length !== 0) {
    let responseArticles = data.query.search;

    if (responseArticles.length === maxNumberOfArticle) {
      pager.classList.remove("hidden");
      nextButton.classList.remove("hidden");
    }

    for (let i = 0; i < responseArticles.length; i++) {
      let articleBox = document.createElement("div");
      let article = document.createElement("a");
      let title = document.createElement("h3");
      let desc = document.createElement("p");

      let currentArticle = responseArticles[i];

      article.href = startUrl + selectedLang.value + baseUrl + "/?curid=" + currentArticle.pageid;
      article.target = "_blank";
      title.textContent = currentArticle.title;
      desc.innerHTML = currentArticle.snippet;

      articleBox.setAttribute("class", "article");

      article.appendChild(title);
      article.appendChild(desc);
      articleBox.appendChild(article);
      articles.appendChild(articleBox);
    }

  } else {
    let para = document.createElement("p");
    para.textContent = "Sorry, no results returned :(";
    para.classList.add("no-result", "text-center");
    articles.appendChild(para);
    nextButton.classList.add("hidden");
  }
}


// FETCH DATA
function fetchResults(e: any) {
  // Use preventDefault() to stop the form submitting
  e.preventDefault();

  // Assemble the full url
  url = startUrl + selectedLang.value + baseUrl + setSearchUrl + "&srlimit=" + maxNumberOfArticle + "&sroffset=" + sroffset + "&srsearch=" + searchTerm.value;

  fetchJSON(url);
}

// START THE SEARCH
function submitSearch(e: any) {
  sroffset = 0;
  if(!prevButton.classList.contains("hidden")) {
    prevButton.classList.add("hidden");
  }
  fetchResults(e);
}

// ADD FUNCTIONALITY TO THE PAGER
function nextPage(e:any) {
  sroffset += maxNumberOfArticle;
  fetchResults(e);
  prevButton.classList.remove("hidden");
}

function previousPage(e:any) {
  sroffset -= maxNumberOfArticle;
  fetchResults(e);
  if(sroffset === 0) {
    prevButton.classList.add("hidden");
  }
}

// SHOW OR HIDE THE "CLEAR INPUT TEXT" BUTTON
function toggleClearInputTextButton() {
  if(searchTerm.value != "") {
    clearInputTextButton.classList.remove("hidden");
  } else {
    clearInputTextButton.classList.add("hidden");
  }
}

// CLEAR THE TEXT OF INPUT FIELD
function clearInputText() {
  searchTerm.value = "";
  searchTerm.focus();
  clearInputTextButton.classList.add("hidden");
}

// ADD AND REMOVE HOVER STYLE ON SEARCH-INPUT-TEXT-CONTAINER
function searchTermFocus() {
  searchTermContainer.classList.add("input-container-hover");
}

function searchTermBlur() {
  searchTermContainer.classList.remove("input-container-hover");
}

