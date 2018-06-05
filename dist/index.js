"use strict";
// DEFINING THE BASE URLs
var startUrl = "https://";
var baseUrl = ".wikipedia.org";
var setSearchUrl = "/w/api.php?action=query&list=search&srprop=snippet&format=json&formatversion=latest&origin=*&continue=sroffset%7C%7C";
var sroffset; // Use this value to continue paging (returned by query)
var url;
// DEFINING THE MAX NUMBER OF ARTICLE ON THE PAGE
var maxNumberOfArticle = 10;
// GRAB REFERENCES TO ALL THE DOM ELEMENTS WE'LL NEED TO MANIPULATE
var searchTerm = document.querySelector("#search-input-text");
var searchTermContainer = document.querySelector("#search-input-text-container");
var searchForm = document.querySelector("#search-form");
var submitBtn = document.querySelector("#search-submit-button");
var clearInputTextButton = document.querySelector("#clear-input-text-button");
var selectedLang = document.querySelector("#lang-selector");
var articles = document.querySelector("#articles");
var pager = document.querySelector("#pager");
var prevButton = document.querySelector("#prevButton");
var nextButton = document.querySelector("#nextButton");
// EVENT LISTENERS TO CONTROL THE FUNCTIONALITY
searchForm.addEventListener("submit", submitSearch);
searchTerm.addEventListener("keyup", toggleClearInputTextButton);
searchTerm.addEventListener("focus", searchTermFocus);
searchTerm.addEventListener("blur", searchTermBlur);
clearInputTextButton.addEventListener("click", clearInputText);
prevButton.addEventListener("click", previousPage);
nextButton.addEventListener("click", nextPage);
// DEFINING THE FUNCTIONS FOR FETCH() TO MAKE THE REQUEST TO THE API
function validateResponse(response) {
    if (!response.ok) {
        throw Error(response.status.text);
    }
    return response;
}
function getResponseAsJSON(response) {
    return response.json();
}
function workWithResult(result) {
    displayResults(result);
    console.log("call displayResult");
}
function logError(error) {
    console.log(error);
}
function fetchJSON(pathToResource) {
    fetch(pathToResource)
        .then(validateResponse)
        .then(getResponseAsJSON)
        .then(workWithResult)
        .catch(logError);
}
// DISPLAY THE RESULTS
function displayResults(data) {
    while (articles.firstChild) {
        articles.removeChild(articles.firstChild);
    }
    if (data.query.search.length !== 0) {
        var responseArticles = data.query.search;
        if (responseArticles.length === maxNumberOfArticle) {
            pager.classList.remove("hidden");
            nextButton.classList.remove("hidden");
        }
        for (var i = 0; i < responseArticles.length; i++) {
            var articleBox = document.createElement("div");
            var article = document.createElement("a");
            var title = document.createElement("h3");
            var desc = document.createElement("p");
            var currentArticle = responseArticles[i];
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
    }
    else {
        var para = document.createElement("p");
        para.textContent = "Sorry, no results returned :(";
        para.classList.add("no-result", "text-center");
        articles.appendChild(para);
        nextButton.classList.add("hidden");
    }
}
// FETCH DATA
function fetchResults(e) {
    // Use preventDefault() to stop the form submitting
    e.preventDefault();
    // Assemble the full url
    url = startUrl + selectedLang.value + baseUrl + setSearchUrl + "&srlimit=" + maxNumberOfArticle + "&sroffset=" + sroffset + "&srsearch=" + searchTerm.value;
    fetchJSON(url);
}
// START THE SEARCH
function submitSearch(e) {
    sroffset = 0;
    if (!prevButton.classList.contains("hidden")) {
        prevButton.classList.add("hidden");
    }
    fetchResults(e);
}
// ADD FUNCTIONALITY TO THE PAGER
function nextPage(e) {
    sroffset += maxNumberOfArticle;
    fetchResults(e);
    prevButton.classList.remove("hidden");
}
function previousPage(e) {
    sroffset -= maxNumberOfArticle;
    fetchResults(e);
    if (sroffset === 0) {
        prevButton.classList.add("hidden");
    }
}
// SHOW OR HIDE THE "CLEAR INPUT TEXT" BUTTON
function toggleClearInputTextButton() {
    if (searchTerm.value != "") {
        clearInputTextButton.classList.remove("hidden");
    }
    else {
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
