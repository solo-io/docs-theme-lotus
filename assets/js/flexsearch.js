// This imports params passed in via `js.Build` in hugo
// This will essentially make a partial cache but just for this single file
import * as params from "@params";
// Parse params
const flexsearchSiteParams = JSON.parse(params.siteParamsFlexsearch), // .Site.Params.flexsearch
  siteVersion = params.siteParamsVersion, // .Site.Params.version
  versionSubversionMap = JSON.parse(params.versionSubversionMap),
  indexVersionMap = JSON.parse(params.index),
  i18nSearchNoResults = params.i18nSearchNoResults;

// Setup config
const siteFlexConfig = {
  enabled: flexsearchSiteParams.enabled ?? true,
  tokenize: flexsearchSiteParams.tokenize ?? "full",
  minLength: flexsearchSiteParams.minquerychar ?? 0,
  cache: flexsearchSiteParams.cache ?? 100,
  maxResult: flexsearchSiteParams.maxresult ?? 5,
  searchSectionsIndex: flexsearchSiteParams.searchsectionsindex ?? [],
};

/////////////////////////
// Hookup Flexsearch UI
/////////////////////////
var suggestions = document.getElementById("suggestions");
var search = document.getElementById("flexsearch");

const flexsearchContainer = document.getElementById("FlexSearchCollapse");

const hideFlexsearchBtn = document.getElementById("hideFlexsearch");

const configObject = { toggle: false };
const flexsearchContainerCollapse = new Collapse(flexsearchContainer, configObject); // initialized with no keyboard

if (search !== null) {
  document.addEventListener("keydown", inputFocus);
  flexsearchContainer.addEventListener("shown.bs.collapse", function () {
    search.focus();
  });
  // hide search collapse container by clicking outside (except top header)
  var topHeader = document.getElementById("top-header");
  document.addEventListener("click", function (elem) {
    if (!flexsearchContainer.contains(elem.target) && !topHeader.contains(elem.target))
      flexsearchContainerCollapse.hide();
  });
}

hideFlexsearchBtn.addEventListener("click", () => {
  flexsearchContainerCollapse.hide();
});

function inputFocus(e) {
  if (e.ctrlKey && e.key === "/") {
    e.preventDefault();
    flexsearchContainerCollapse.toggle();
  }
  if (e.key === "Escape") {
    search.blur();
    // suggestions.classList.add('d-none');
    flexsearchContainerCollapse.hide();
  }
}

// Clears suggestion when clicking out
document.addEventListener("click", function (event) {
  var isClickInsideElement = suggestions.contains(event.target) || flexsearchContainer.contains(event.target);
  if (!isClickInsideElement) {
    suggestions.classList.add("d-none");
    search.value = "";
  }
});

/*
Source:
- https://dev.to/shubhamprakash/trap-focus-using-javascript-6a3
*/

document.addEventListener("keydown", suggestionFocus);

function suggestionFocus(e) {
  const suggestionsHidden = suggestions.classList.contains("d-none");
  if (suggestionsHidden) return;

  const focusableSuggestions = [...suggestions.querySelectorAll("a")];
  if (focusableSuggestions.length === 0) return;

  const index = focusableSuggestions.indexOf(document.activeElement);

  if (e.key === "ArrowUp") {
    e.preventDefault();
    const nextIndex = index > 0 ? index - 1 : 0;
    focusableSuggestions[nextIndex].focus();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    const nextIndex = index + 1 < focusableSuggestions.length ? index + 1 : index;
    focusableSuggestions[nextIndex].focus();
  }
}

/*
Source:
- https://github.com/nextapps-de/flexsearch#index-documents-field-search
- https://raw.githack.com/nextapps-de/flexsearch/master/demo/autocomplete.html
*/
(function () {
  /////////////////////////
  // Create Index
  /////////////////////////
  var indexSectionMap = {};
  function getIndex(section) {
    if (!indexSectionMap[section]) {
      indexSectionMap[section] = new FlexSearch.Document({
        // charset: "latin:default",
        tokenize: siteFlexConfig.tokenize,
        minlength: siteFlexConfig.minLength,
        cache: siteFlexConfig.cache,
        optimize: siteFlexConfig.optimize,
        document: {
          id: "id",
          store: ["href", "title", "description", "content"],
          index: ["title", "description", "keywords", "content"],
        },
      });
    }
    return indexSectionMap[section];
  }

  /////////////////////////
  // Index ID Gen
  /////////////////////////

  /* `versionSubversionMap` is generated via hugo inside flexsearch.html and passed into here */

  function getIndexIdOfCurrentPage() {
    const urlParts = window.location.pathname.replace(/^\//, "").split("/");
    // There doesn't seem to be a perfect way to detect "Section" via JS, but
    // this should work by finding any cases where something in url exists in search index key
    const curSection = urlParts.find((part) => !!versionSubversionMap[part]) || siteVersion || "main";
    const curSubversion = urlParts.find((part) => !!versionSubversionMap[curSection]?.includes(part)) || "";
    return curSection + "-" + curSubversion;
  }

  /////////////////////////
  // Populate Index
  /////////////////////////

  /* `indexVersionMap` is generated via hugo inside flexsearch.html and passed into here */

  const currentPageIndexId = getIndexIdOfCurrentPage();
  const indexEntriesForCurrentVersion = indexVersionMap[currentPageIndexId] ?? [];
  for (const doc of indexEntriesForCurrentVersion) {
    getIndex(currentPageIndexId).add(doc);
  }

  /////////////////////////
  // Search Logic
  /////////////////////////
  search.addEventListener("input", find_results, true);

  function find_results() {
    var searchQuery = this.value;

    suggestions.innerHTML = "";
    suggestions.classList.remove("d-none");

    // inform user of search query minimum character requirement
    const minlength = siteFlexConfig.minLength;
    if (searchQuery.length < minlength) {
      const minCharMessage = document.createElement("div");
      minCharMessage.innerHTML = `Please type at least <strong>${minlength}</strong> characters`;
      minCharMessage.classList.add("suggestion__no-results");
      suggestions.appendChild(minCharMessage);
      return;
    }

    var index = getIndex(getIndexIdOfCurrentPage());
    var results = index.search(searchQuery, { limit: siteFlexConfig.maxResult, enrich: true });
    show_results(results, searchQuery);
  }

  function show_results(results, searchQuery) {
    // flatten results since index.search() returns results for each indexed field
    const flatResults = new Map(); // keyed by href to dedupe results
    for (const result of results.flatMap((r) => r.result)) {
      if (flatResults.has(result.doc.href)) continue;
      flatResults.set(result.doc.href, result.doc);
    }

    suggestions.innerHTML = "";
    suggestions.classList.remove("d-none");

    // inform user that no results were found
    if (flatResults.size === 0 && searchQuery) {
      const noResultsMessage = document.createElement("div");
      noResultsMessage.innerHTML = `${i18nSearchNoResults} "<strong>${searchQuery}</strong>"`;
      noResultsMessage.classList.add("suggestion__no-results");
      suggestions.appendChild(noResultsMessage);
      return;
    }

    // construct a list of suggestions
    for (const [href, doc] of flatResults) {
      suggestions.appendChild(createSuggestion(doc, href, searchQuery));
      if (suggestions.childElementCount == siteFlexConfig.maxResult) break;
    }
  }

  function createSuggestion(doc, href, searchQuery) {
    const queryWords = searchQuery.trim().split(" ");
    const entry = document.createElement("div");

    const a = document.createElement("a");
    a.href = href;
    entry.appendChild(a);

    const title = document.createElement("span");
    title.textContent = doc.title;
    title.classList.add("suggestion__title");
    a.appendChild(title);

    const description = document.createElement("span");
    description.innerHTML = getSuggestionDescription(doc, queryWords);
    description.classList.add("suggestion__description");
    a.appendChild(description);

    return entry;
  }

  function getSuggestionDescription(doc, queryWords) {
    // For the description, we should do the following:
    // - If the `doc` description contains all search terms, show that (and highlight them all in that message)
    // - otherwise try to find them in body, and highlight setence fragment of first instance when found
    // - else if none found in body (perhaps word only in title/keywords, or regex didn't find it), fallback to description (and highlight any that are found)
    let desc = doc.description;
    if (stringContainsAllFuzzyWords(doc.description, queryWords)) {
      desc = highlightFuzzyWordsInString(doc.description, queryWords);
    } else {
      // Find indiviudal segments that contain the search terms
      const matchedSegments = queryWords
        .map((queryWord) => {
          const match = doc.content.match(new RegExp(`(\\W?)(\\w*${queryWord}\\w*)(\\W?)`, "i"));
          if (match) {
            try {
              let string = "";
              const { [0]: fullmatch, [1]: pre, index } = match;
              let preSegment = "";
              let preChunk = 20; // check this many characters before the word
              if (index > 0) {
                // -2 and extra `pre` at end are need for sentence detection to properly work, and should be removed after if test don't catch them
                preSegment = doc.content.substring(index - preChunk - 2, index).replace(/\s/g, " ") + pre;
                if (preSegment.indexOf(". ") > -1) {
                  preSegment = preSegment.split(". ")[1];
                } else {
                  // remove extra 2 we added in front to confirm there was a sentence end right before
                  preSegment = preSegment.substring(2);
                  // we want words before the matched word - ignore the earliest one though, since it will likely not be a full word.
                  preSegment = preSegment.split(" ").slice(1).join(" ");
                  // show an ellipsis since we didn't detect a sentence ending
                  preSegment = "…" + preSegment.trimStart();
                }
                // remove the ending space we added to let sentence end detection work
                if (pre) preSegment = preSegment.replace(new RegExp(pre + "$"), "");
              }
              string += preSegment;
              string += fullmatch;

              const indexAfter = index + fullmatch.length;
              let suffChunk = 40 + (preChunk - preSegment.length); // check this many characters after the word
              // we want words after the matched word - ignore the last one though, since it will likely not be a full word.
              string += doc.content
                .substring(indexAfter, indexAfter + suffChunk)
                .split(" ")
                .slice(0, -1)
                .join(" ");
              string = string.trimEnd() + "…";

              return string;
            } catch (e) {}
          }
          return null;
        })
        .filter((s) => !!s);

      // See if one of the returned segments contains all search terms, and if so return only that one with all words highlighted in it
      const singleSegmentIfOneExists = matchedSegments.find((segment) =>
        stringContainsAllFuzzyWords(segment, queryWords)
      );
      if (!matchedSegments.length) {
        desc = highlightFuzzyWordsInString(doc.description, queryWords);
      } else if (singleSegmentIfOneExists) {
        desc = highlightFuzzyWordsInString(singleSegmentIfOneExists, queryWords);
      } else {
        desc = matchedSegments.map((str) => highlightFuzzyWordsInString(str, queryWords)).join("<hr />");
      }
    }
    return desc;
  }

  function stringContainsAllFuzzyWords(string, words) {
    const clean = (str) => str.toLowerCase().replace("/", "");
    string = clean(string);
    return words.every((w) => string.includes(clean(w)));
  }

  function highlightFuzzyWordsInString(string, words) {
    words.forEach((queryWord) => {
      const match = string.match(new RegExp(`(\\W?)(\\w*${queryWord}\\w*)(\\W?)`, "i"));
      if (match) {
        const { [0]: fullmatch, [1]: pre, [2]: word, [3]: suff, index } = match;
        string =
          string.substring(0, index) + `${pre}<b>${word}</b>${suff}` + string.substring(index + fullmatch.length);
      }
    });
    return string;
  }
})();
