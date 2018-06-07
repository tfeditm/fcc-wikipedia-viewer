"use strict";
// DEFINING THE PARTS OF REQUEST URL
// **************************************************** //
// Sample URL:
// https://en.wikipedia.org/w/api.php?action=query&list=search
// &srprop=snippet&format=json&formatversion=latest&origin=*
// &continue=sroffset%7C%7C&srlimit=10&sroffset=0&srsearch=honey
var protocol = "https://";
var domain = ".wikipedia.org";
var searchParameters = "/w/api.php?action=query&list=search&srprop=snippet&format=json&formatversion=latest&origin=*&continue=sroffset%7C%7C";
var sroffset; // Use this value to continue paging (returned by query)
var url;
// DEFINING THE MAX NUMBER OF ARTICLE ON THE PAGE
// **************************************************** //
// For further deployment: 
// You can insert buttons in the index.html to allow the user to choose the max number of articles.
var maxNumberOfArticle = 10;
// GRAB REFERENCES TO ALL THE DOM ELEMENTS WE'LL NEED TO MANIPULATE
// **************************************************** //
var searchTerm = document.querySelector("#search-input-text");
var searchForm = document.querySelector("#search-form");
var submitBtn = document.querySelector("#search-submit-button");
var clearInputTextButton = document.querySelector("#clear-input-text-button");
var selectedLang = document.querySelector("#lang-selector");
var articles = document.querySelector("#articles");
var pager = document.querySelector("#pager");
var prevButton = document.querySelector("#prevButton");
var nextButton = document.querySelector("#nextButton");
// EVENT LISTENERS TO CONTROL THE FUNCTIONALITY
// **************************************************** //
searchForm.addEventListener("submit", submitSearch);
searchForm.addEventListener("focusin", searchFormFocusin);
searchForm.addEventListener("focusout", searchFormFocusout);
searchTerm.addEventListener("keyup", toggleClearInputTextButton);
clearInputTextButton.addEventListener("click", clearInputText);
prevButton.addEventListener("click", previousPage);
nextButton.addEventListener("click", nextPage);
// DEFINING FUNCTIONS FOR FETCH() TO MAKE REQUEST TO THE API
// **************************************************** //
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
// DEFINING FUNCTION TO FETCH DATA
// **************************************************** //
function fetchResults(e) {
    // Use preventDefault() to stop the form submitting
    e.preventDefault();
    // Assemble the full url
    url = protocol + selectedLang.value + domain + searchParameters
        + "&srlimit=" + maxNumberOfArticle
        + "&sroffset=" + sroffset
        + "&srsearch=" + searchTerm.value;
    fetchJSON(url);
}
// DEFINING FUNCTIONS TO MANIPULATE THE DOM FOR DISPLAY THE RESULTS
// **************************************************** //
// Successful search
function displayArticles(article) {
    var link = document.createElement("a");
    var title = document.createElement("h3");
    var desc = document.createElement("p");
    link.href = protocol + selectedLang.value + domain + "/?curid=" + article.pageid;
    link.target = "_blank";
    title.textContent = article.title;
    desc.innerHTML = article.snippet;
    link.setAttribute("class", "article");
    link.appendChild(title);
    link.appendChild(desc);
    articles.appendChild(link);
}
// Unsuccessful search
function displayNoArticle() {
    var para = document.createElement("p");
    para.textContent = "Sorry, no results returned :(";
    para.classList.add("no-result", "text-center");
    articles.appendChild(para);
    nextButton.classList.add("hidden");
}
// DEFINING FUNCTION TO DISPLAY THE RESULTS
// **************************************************** //
function displayResults(data) {
    if (data.query === undefined) {
        return;
    }
    else {
        while (articles.firstChild) {
            articles.removeChild(articles.firstChild);
        }
        if (data.query.search && data.query.search.length !== 0) {
            var responseArticles = data.query.search;
            if (responseArticles.length === maxNumberOfArticle) {
                pager.classList.remove("hidden");
                nextButton.classList.remove("hidden");
            }
            responseArticles.map(displayArticles);
        }
        else {
            displayNoArticle();
        }
    }
}
// ADD FUNCTIONALITY TO THE SEARCH BUTTON (START THE SEARCH)
// **************************************************** //
function submitSearch(e) {
    sroffset = 0;
    if (!prevButton.classList.contains("hidden")) {
        prevButton.classList.add("hidden");
    }
    fetchResults(e);
}
// ADD FUNCTIONALITY TO THE PAGER
// **************************************************** //
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
// **************************************************** //
function toggleClearInputTextButton() {
    if (searchTerm.value != "") {
        clearInputTextButton.classList.remove("hidden");
    }
    else {
        clearInputTextButton.classList.add("hidden");
    }
}
// CLEAR THE TEXT OF INPUT FIELD
// **************************************************** //
function clearInputText() {
    searchTerm.value = "";
    searchTerm.focus();
    clearInputTextButton.classList.add("hidden");
}
// ADD AND REMOVE THE HOVER STYLE OF INPUT-CONTAINER
// **************************************************** //
var ToggleHoverStyle = /** @class */ (function () {
    function ToggleHoverStyle(toggle, event) {
        this.toggle = toggle;
        this.event = event;
        var f = this.event.target;
        if (f && (f.nodeName === "SELECT" || (f.nodeName === "INPUT" && f.type !== "submit"))) {
            f.parentElement.classList.toggle("input-container-hover");
        }
    }
    return ToggleHoverStyle;
}());
function searchFormFocusin(event) {
    new ToggleHoverStyle("add", event);
}
function searchFormFocusout(event) {
    new ToggleHoverStyle("remove", event);
}
