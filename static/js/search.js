window.onload = function () {
  if (!document.body.contains(document.getElementById("searchModal"))) {
    return;
  }

  const lang = document.documentElement.lang;
  const searchInput = document.getElementById("searchInput");
  const searchModal = document.getElementById("searchModal");
  const searchButton = document.getElementById("search-button");
  const clearSearchButton = document.getElementById("clear-search");
  const resultsContainer = document.getElementById("results-container");
  const results = document.getElementById("results");
  // Get all spans holding the translated strings, even if they are only used on one language.
  const zeroResultsSpan = document.getElementById("zero_results");
  const oneResultsSpan = document.getElementById("one_results");
  const twoResultsSpan = document.getElementById("two_results");
  const fewResultsSpan = document.getElementById("few_results");
  const manyResultsSpan = document.getElementById("many_results");

  // Static mapping of keys to spans.
  const resultSpans = {
    zero_results: zeroResultsSpan,
    one_results: oneResultsSpan,
    two_results: twoResultsSpan,
    few_results: fewResultsSpan,
    many_results: manyResultsSpan,
  };

  // Replace $SHORTCUT in search icon title with actual OS-specific shortcut.
  function getShortcut() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) {
      return "Cmd + K";
    } else {
      return "Ctrl + K";
    }
  }

  function setAttributes(element, attributeNames) {
    const shortcut = getShortcut();
    attributeNames.forEach((attributeName) => {
      let attributeValue = element.getAttribute(attributeName);
      if (attributeValue) {
        attributeValue = attributeValue.replace("$SHORTCUT", shortcut);
        element.setAttribute(attributeName, attributeValue);
      }
    });
  }
  setAttributes(searchButton, ["title", "aria-label"]);

  // Make search button keyboard accessible.
  searchButton.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      searchButton.click();
    }
  });

  let lastFocusedElement;
  function openSearchModal() {
    lastFocusedElement = document.activeElement;
    loadSearchIndex();
    searchModal.style.display = "block";
    searchInput.focus();
  }

  function closeModal() {
    searchModal.style.display = "none";
    clearSearch();
    if (lastFocusedElement && document.body.contains(lastFocusedElement)) {
      lastFocusedElement.focus();
    }
  }

  function toggleModalVisibility() {
    const isModalOpen = searchModal.style.display === "block";
    if (isModalOpen) {
      closeModal();
    } else {
      openSearchModal();
    }
  }

  // Function to remove 'selected' class from all divs except the one passed.
  function clearSelected(exceptDiv = null) {
    const divs = results.querySelectorAll("#results > div");
    divs.forEach((div) => {
      if (div !== exceptDiv) {
        div.setAttribute("aria-selected", "false");
      }
    });
  }

  function updateSelection(div) {
    if (div.getAttribute("aria-selected") !== "true") {
      clearSelected(div);
      div.setAttribute("aria-selected", "true");
    }
    searchInput.setAttribute("aria-activedescendant", div.id);
  }

  function clearSearch() {
    searchInput.value = "";
    results.innerHTML = "";
    resultsContainer.style.display = "none";
    searchInput.removeAttribute("aria-activedescendant");
    clearSearchButton.style.display = "none";
  }

  // Close modal when clicking/tapping outside.
  function handleModalInteraction(event) {
    if (event.target === searchModal) {
      closeModal();
    }
    event.stopPropagation(); // Prevents tapping through the modal.
  }
  searchModal.addEventListener("click", handleModalInteraction);
  searchModal.addEventListener("touchend", handleModalInteraction, {
    passive: true,
  });

  // Close modal when pressing escape.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  clearSearchButton.addEventListener("click", function () {
    clearSearch();
    searchInput.focus();
  });
  clearSearchButton.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      clearSearch();
      searchInput.focus();
      event.preventDefault();
    }
  });

  // The index loads on mouseover/tap.
  // Clicking/tapping the search button opens the modal.
  searchButton.addEventListener("mouseover", loadSearchIndex);
  searchButton.addEventListener("click", openSearchModal);
  searchButton.addEventListener("touchstart", openSearchModal, {
    passive: true,
  });

  let searchIndexPromise = null;
  function loadSearchIndex() {
    if (!searchIndexPromise) {
      // Check if the search index is already loaded in the window object
      if (window.searchIndex) {
        // If the index is pre-loaded, use it directly.
        searchIndexPromise = Promise.resolve(
          elasticlunr.Index.load(window.searchIndex),
        );
      } else {
        // If the index is not pre-loaded, fetch it from the JSON file.
        const language = document.documentElement
          .getAttribute("lang")
          .substring(0, 2);
        let basePath = document
          .querySelector("meta[name='base']")
          .getAttribute("content");
        if (basePath.endsWith("/")) {
          basePath = basePath.slice(0, -1);
        }

        searchIndexPromise = fetch(
          basePath + "/search_index." + language + ".json",
        )
          .then((response) => response.json())
          .then((json) => elasticlunr.Index.load(json));
      }
    }
  }

  function getByteByBinary(binaryCode) {
    // Binary system, starts with `0b` in ES6
    // Octal number system, starts with `0` in ES5 and starts with `0o` in ES6
    // Hexadecimal, starts with `0x` in both ES5 and ES6
    var byteLengthDatas = [0, 1, 2, 3, 4];
    var len = byteLengthDatas[Math.ceil(binaryCode.length / 8)];
    return len;
  }

  function getByteByHex(hexCode) {
    return getByteByBinary(parseInt(hexCode, 16).toString(2));
  }

  function substringByByte(str, maxLength) {
    let result = "";
    let flag = false;
    let len = 0;
    let length = 0;
    let length2 = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.codePointAt(i).toString(16);
      if (code.length > 4) {
        i++;
        if (i + 1 < str.length) {
          flag = str.codePointAt(i + 1).toString(16) === "200d";
        }
      }
      if (flag) {
        len += getByteByHex(code);
        if (i == str.length - 1) {
          length += len;
          if (length <= maxLength) {
            result += str.substr(length2, i - length2 + 1);
          } else {
            break;
          }
        }
      } else {
        if (len != 0) {
          length += len;
          length += getByteByHex(code);
          if (length <= maxLength) {
            result += str.substr(length2, i - length2 + 1);
            length2 = i + 1;
          } else {
            break;
          }
          len = 0;
          continue;
        }
        length += getByteByHex(code);
        if (length <= maxLength) {
          if (code.length <= 4) {
            result += str[i];
          } else {
            result += str[i - 1] + str[i];
          }
          length2 = i + 1;
        } else {
          break;
        }
      }
    }
    return result;
  }

  function generateSnippet(text, searchTerms) {
    const BASE_SCORE = 2;
    const FIRST_WORD_SCORE = 8;
    const HIGHLIGHT_SCORE = 40;
    const PRE_MATCH_CONTEXT_WORDS = 4;
    const SNIPPET_LENGTH = 150;
    const WINDOW_SIZE = 30;

    const stemmedTerms = searchTerms.map(function (term) {
      return elasticlunr.stemmer(term.toLowerCase());
    });

    let totalLength = 0;
    const tokenScores = [];
    const sentences = text.toLowerCase().split(". ");

    for (const sentence of sentences) {
      const words = sentence.split(/[\s\n]/);
      let isFirstWord = true;

      for (const word of words) {
        if (word.length > 0) {
          let score = isFirstWord ? FIRST_WORD_SCORE : BASE_SCORE;
          for (const stemmedTerm of stemmedTerms) {
            if (elasticlunr.stemmer(word).startsWith(stemmedTerm)) {
              score = HIGHLIGHT_SCORE;
            }
          }
          tokenScores.push([word, score, totalLength]);
          isFirstWord = false;
        }
        totalLength += word.length + 1;
      }
      totalLength += 1;
    }

    if (tokenScores.length === 0) {
      return text.length > SNIPPET_LENGTH
        ? text.substring(0, SNIPPET_LENGTH) + "…"
        : text;
    }

    const scores = [];
    let windowScore = 0;

    for (var i = 0; i < Math.min(tokenScores.length, WINDOW_SIZE); i++) {
      windowScore += tokenScores[i][1];
    }
    scores.push(windowScore);

    // Slide the window and update the score.
    for (var i = 1; i <= tokenScores.length - WINDOW_SIZE; i++) {
      windowScore -= tokenScores[i - 1][1];
      windowScore += tokenScores[i + WINDOW_SIZE - 1][1];
      scores.push(windowScore);
    }

    let maxScoreIndex = 0;
    let maxScore = 0;
    for (var i = scores.length - 1; i >= 0; i--) {
      if (maxScore < scores[i]) {
        maxScore = scores[i];
        maxScoreIndex = i;
      }
    }

    const snippet = [];
    // From my testing, the context is more clear if we start a few words back.
    let start = adjustStartPos(
      text,
      tokenScores[maxScoreIndex][2],
      PRE_MATCH_CONTEXT_WORDS,
    );

    function adjustStartPos(text, matchStartIndex, numWordsBack) {
      let spaceCount = 0;
      let index = matchStartIndex - 1;
      while (index >= 0 && spaceCount < numWordsBack) {
        if (text[index] === " " && text[index - 1] !== ".") {
          spaceCount++;
        } else if (text[index] === "." && text[index + 1] === " ") {
          // Stop if the match is at the start of a sentence.
          break;
        }
        index--;
      }
      return spaceCount === numWordsBack ? index + 1 : matchStartIndex;
    }
    const re = /^[\x00-\xff]+$/; // Regular expression for ASCII check.
    for (
      var i = maxScoreIndex;
      i < maxScoreIndex + WINDOW_SIZE && i < tokenScores.length;
      i++
    ) {
      const wordData = tokenScores[i];
      if (start < wordData[2]) {
        snippet.push(text.substring(start, wordData[2]));
        start = wordData[2];
      }

      if (wordData[1] === HIGHLIGHT_SCORE) {
        snippet.push("<b>");
      }
      const end = wordData[2] + wordData[0].length;
      // Handle non-ASCII characters.
      if (!re.test(wordData[0]) && wordData[0].length >= 12) {
        const strBefore = text.substring(wordData[2], end);
        const strAfter = substringByByte(strBefore, 12);
        snippet.push(strAfter);
      } else {
        snippet.push(text.substring(wordData[2], end));
      }

      if (wordData[1] === HIGHLIGHT_SCORE) {
        snippet.push("</b>");
      }
      start = end;
    }

    snippet.push("…");
    const joinedSnippet = snippet.join("");
    let truncatedSnippet = joinedSnippet;
    if (joinedSnippet.replace(/<[^>]+>/g, "").length > SNIPPET_LENGTH) {
      truncatedSnippet = joinedSnippet.substring(0, SNIPPET_LENGTH) + "…";
    }

    return truncatedSnippet;
  }

  // Handle input in the search box.
  searchInput.addEventListener(
    "input",
    async function () {
      const inputValue = this.value;
      const searchTerm = inputValue.trim();
      const searchIndex = await searchIndexPromise;
      results.innerHTML = "";

      // Use the raw input so the "clear" button appears even if there's only spaces.
      clearSearchButton.style.display = inputValue.length > 0
        ? "block"
        : "none";
      resultsContainer.style.display = searchTerm.length > 0 ? "block" : "none";

      // Perform the search and store the results.
      const searchResults = searchIndex.search(searchTerm, {
        bool: "OR",
        fields: {
          title: { boost: 3 },
          body: { boost: 2 },
          description: { boost: 1 },
          path: { boost: 1 },
        },
      });

      // Update the number of results.
      updateResultText(searchResults.length);

      // Display the results.
      let resultIdCounter = 0; // Counter to generate unique IDs.
      searchResults.forEach(function (result) {
        if (result.doc.title || result.doc.path || result.doc.id) {
          const resultDiv = document.createElement("div");
          resultDiv.setAttribute("role", "option");
          resultDiv.id = "result-" + resultIdCounter++;
          resultDiv.innerHTML = "<a href><span></span><span></span></a>";
          const linkElement = resultDiv.querySelector("a");
          const titleElement = resultDiv.querySelector("span:first-child");
          const snippetElement = resultDiv.querySelector("span:nth-child(2)");

          // Determine the text for the title.
          titleElement.textContent = result.doc.title || result.doc.path ||
            result.doc.id;

          // Determine if the body or description is available for the snippet.
          let snippetText = result.doc.body
            ? generateSnippet(result.doc.body, searchTerm.split(/\s+/))
            : result.doc.description
            ? result.doc.description
            : "";
          snippetElement.innerHTML = snippetText;

          // Create the hyperlink.
          let href = result.ref;
          if (result.doc.body) {
            // Include text fragment if body is available.
            const encodedSearchTerm = encodeURIComponent(searchTerm);
            href += `#:~:text=${encodedSearchTerm}`;
          }
          linkElement.href = href;

          results.appendChild(resultDiv);
        }
      });

      searchInput.setAttribute(
        "aria-expanded",
        resultIdCounter > 0 ? "true" : "false",
      );

      if (results.firstChild) {
        updateSelection(results.firstChild);
      }

      results.addEventListener("mouseover", function (event) {
        if (event.target.closest('div[role="option"]')) {
          updateSelection(event.target.closest('div[role="option"]'));
        }
      });

      results.addEventListener("click", function (event) {
        const clickedElement = event.target.closest("a");
        if (clickedElement) {
          const clickedHref = clickedElement.getAttribute("href");
          const currentPageUrl = window.location.href;

          // Normalise URLs by removing the text fragment and trailing slash.
          const normalizeUrl = (url) => url.split("#")[0].replace(/\/$/, "");

          // Check if the clicked link matches the current page.
          // If using Ctrl+click or Cmd+click, don't close the modal.
          if (
            normalizeUrl(clickedHref) === normalizeUrl(currentPageUrl) &&
            !event.ctrlKey && !event.metaKey
          ) {
            closeModal();
          }
        }
      });

      // Add touch events to the results.
      setupTouchEvents();
    },
    true,
  );

  function updateResultText(count) {
    // Determine the correct pluralization key based on count and language.
    const pluralizationKey = getPluralizationKey(count, lang);

    // Hide all result text spans.
    Object.values(resultSpans).forEach((span) => {
      if (span) span.style.display = "none";
    });

    // Show the relevant result text span, replacing $NUMBER with the actual count.
    const activeSpan = resultSpans[pluralizationKey];
    if (activeSpan) {
      activeSpan.style.display = "inline";

      // FIX: Store original template on first use
      if (!activeSpan.dataset.template) {
        activeSpan.dataset.template = activeSpan.textContent;
      }

      // Always replace from the original template
      activeSpan.textContent = activeSpan.dataset.template.replace(
        "$NUMBER",
        count.toString(),
      );
    }
  }

  function getPluralizationKey(count, lang) {
    let key = "";
    const slavicLangs = ["uk", "be", "bs", "hr", "ru", "sr"];

    // Common cases: zero, one.
    if (count === 0) {
      key = "zero_results";
    } else if (count === 1) {
      key = "one_results";
    } else {
      // Arabic.
      if (lang === "ar") {
        let modulo = count % 100;
        if (count === 2) {
          key = "two_results";
        } else if (modulo >= 3 && modulo <= 10) {
          key = "few_results";
        } else {
          key = "many_results";
        }
      } else if (slavicLangs.includes(lang)) {
        // Slavic languages.
        let modulo10 = count % 10;
        let modulo100 = count % 100;
        if (modulo10 === 1 && modulo100 !== 11) {
          key = "one_results";
        } else if (
          modulo10 >= 2 &&
          modulo10 <= 4 &&
          !(modulo100 >= 12 && modulo100 <= 14)
        ) {
          key = "few_results";
        } else {
          key = "many_results";
        }
      } else {
        key = "many_results"; // Default plural.
      }
    }

    return key;
  }

  function setupTouchEvents() {
    const resultDivs = document.querySelectorAll("#results > div");
    resultDivs.forEach((div) => {
      // Remove existing listener to avoid duplicates.
      div.removeEventListener("touchstart", handleTouchStart);
      div.addEventListener("touchstart", handleTouchStart, { passive: true });
    });
  }

  function handleTouchStart() {
    updateSelection(this);
  }

  // Handle keyboard navigation.
  document.addEventListener("keydown", function (event) {
    // Add handling for the modal open/close shortcut.
    const isMac = navigator.userAgent.toLowerCase().includes("mac");
    const MODAL_SHORTCUT_KEY = "k";
    const modalShortcutModifier = isMac ? event.metaKey : event.ctrlKey;

    if (event.key === MODAL_SHORTCUT_KEY && modalShortcutModifier) {
      event.preventDefault();
      toggleModalVisibility();
      return;
    }

    const activeElement = document.activeElement;
    if (
      event.key === "Tab" &&
      (activeElement === searchInput || activeElement === clearSearchButton)
    ) {
      event.preventDefault();
      const nextFocusableElement = activeElement === searchInput
        ? clearSearchButton
        : searchInput;
      nextFocusableElement.focus();
      return;
    }

    function updateResultSelection(newIndex, divsArray) {
      updateSelection(divsArray[newIndex]);
      divsArray[newIndex].scrollIntoView({ block: "nearest", inline: "start" });
    }

    const resultDivs = results.querySelectorAll("#results > div");
    if (resultDivs.length === 0) return;

    const divsArray = Array.from(resultDivs);
    let activeDiv = results.querySelector('[aria-selected="true"]');
    let activeDivIndex = divsArray.indexOf(activeDiv);

    if (
      ["ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(
        event.key,
      )
    ) {
      event.preventDefault();
      let newIndex = activeDivIndex;

      switch (event.key) {
        case "ArrowUp":
          newIndex = Math.max(activeDivIndex - 1, 0);
          break;
        case "ArrowDown":
          newIndex = Math.min(activeDivIndex + 1, divsArray.length - 1);
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = divsArray.length - 1;
          break;
        case "PageUp":
          newIndex = Math.max(activeDivIndex - 3, 0);
          break;
        case "PageDown":
          newIndex = Math.min(activeDivIndex + 3, divsArray.length - 1);
          break;
      }

      if (newIndex !== activeDivIndex) {
        updateResultSelection(newIndex, divsArray);
      }
    }

    if (event.key === "Enter" && activeDiv) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const anchorTag = activeDiv.querySelector("a");
      if (anchorTag) {
        window.location.href = anchorTag.getAttribute("href");
      }
      closeModal(); // Necessary when linking to the current page.
    }
  });
};
