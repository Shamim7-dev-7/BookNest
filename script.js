
const STORAGE_KEYS = {
  customBooks: "booknest-custom-books",
  favorites: "booknest-favorites",
  deletedStarterBooks: "booknest-deleted-starter-books"
};

const starterBooks = [
  {
    id: "starter-atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Personal Growth",
    cover: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    readingLink: "https://openlibrary.org/search?q=Atomic+Habits+James+Clear",
    description: "A practical guide to building good habits, breaking bad ones, and making small improvements over time."
  },
  {
    id: "starter-the-alchemist",
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    cover: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
    readingLink: "https://openlibrary.org/search?q=The+Alchemist+Paulo+Coelho",
    description: "A philosophical novel about following your dreams, discovering purpose, and learning from life's journey."
  },
  {
    id: "starter-brief-history",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    cover: "https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg",
    readingLink: "https://openlibrary.org/search?q=A+Brief+History+of+Time+Stephen+Hawking",
    description: "An introduction to major questions about the universe, time, black holes, and the origins of the cosmos."
  },
  {
    id: "starter-clean-code",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    cover: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
    readingLink: "https://openlibrary.org/search?q=Clean+Code+Robert+C+Martin",
    description: "A guide to writing readable, maintainable software and improving programming practices."
  },
  {
    id: "starter-rich-dad",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    category: "Personal Growth",
    cover: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg",
    readingLink: "https://openlibrary.org/search?q=Rich+Dad+Poor+Dad+Robert+Kiyosaki",
    description: "A popular personal finance book discussing financial education, assets, and different attitudes toward money."
  },
  {
    id: "starter-pride-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Fiction",
    cover: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    readingLink: "https://www.gutenberg.org/ebooks/1342",
    description: "A classic novel exploring relationships, social expectations, first impressions, and personal growth."
  },
  {
    id: "starter-selfish-gene",
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    category: "Science",
    cover: "https://covers.openlibrary.org/b/isbn/9780198788607-L.jpg",
    readingLink: "https://openlibrary.org/search?q=The+Selfish+Gene+Richard+Dawkins",
    description: "A book about evolution that explains natural selection through the perspective of genes."
  },
  {
    id: "starter-javascript-good-parts",
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    category: "Technology",
    cover: "https://covers.openlibrary.org/b/isbn/9780596517748-L.jpg",
    readingLink: "https://openlibrary.org/search?q=JavaScript+The+Good+Parts+Douglas+Crockford",
    description: "An introduction to useful JavaScript language features and techniques for writing more reliable code."
  }
];

let customBooks = readStorage(STORAGE_KEYS.customBooks, []);
let favorites = readStorage(STORAGE_KEYS.favorites, []);
let deletedStarterBooks = readStorage(STORAGE_KEYS.deletedStarterBooks, []);
let activeCategory = "All Books";
let searchTerm = "";

const bookGrid = document.getElementById("bookGrid");
const bookCount = document.getElementById("bookCount");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const categoryFilters = document.getElementById("categoryFilters");
const emptyState = document.getElementById("emptyState");
const resetFilters = document.getElementById("resetFilters");
const addBookSection = document.getElementById("addBookSection");
const bookForm = document.getElementById("bookForm");
const formMessage = document.getElementById("formMessage");
const openAddBook = document.getElementById("openAddBook");
const closeAddBook = document.getElementById("closeAddBook");
const cancelAddBook = document.getElementById("cancelAddBook");

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function getAllBooks() {
  const availableStarterBooks = starterBooks.filter(
    book => !deletedStarterBooks.includes(book.id)
  );

  return [...availableStarterBooks, ...customBooks];
}

function normalizeReadingLink(book) {
  const suppliedLink = typeof book.readingLink === "string"
    ? book.readingLink.trim()
    : "";

  if (isValidWebUrl(suppliedLink)) {
    return suppliedLink;
  }

  return `https://openlibrary.org/search?q=${encodeURIComponent(
    `${book.title} ${book.author}`
  )}`;
}

function isValidWebUrl(value) {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch {
    return false;
  }
}

function getVisibleBooks() {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return getAllBooks().filter(book => {
    const matchesCategory =
      activeCategory === "All Books" || book.category === activeCategory;

    const matchesSearch =
      !normalizedSearch ||
      String(book.title || "").toLowerCase().includes(normalizedSearch) ||
      String(book.author || "").toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function createBookCard(book) {
  const card = createElement("article", "book-card");
  const readingLink = normalizeReadingLink(book);

  const link = createElement("a", "book-open-link");
  link.href = readingLink;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute(
    "aria-label",
    `Open online reading page for ${book.title} by ${book.author}`
  );

  const coverWrap = createElement("div", "book-cover-wrap");
  const cover = document.createElement("img");

  cover.className = "book-cover";
  cover.src = book.cover || "";
  cover.alt = `Cover of ${book.title}`;
  cover.loading = "lazy";

  const placeholder = createElement(
    "div",
    "cover-placeholder",
    book.title
  );

  placeholder.hidden = true;

  cover.addEventListener("error", () => {
    cover.hidden = true;
    placeholder.hidden = false;
  });

  if (!book.cover) {
    cover.hidden = true;
    placeholder.hidden = false;
  }

  coverWrap.append(cover, placeholder);

  const info = createElement("div", "book-info");
  const category = createElement("span", "book-category", book.category);
  const title = createElement("h3", "book-title", book.title);
  const author = createElement("p", "book-author", `By ${book.author}`);

  info.append(category, title, author);

  if (book.description) {
    const description = createElement(
      "p",
      "book-description",
      book.description
    );
    info.append(description);
  }

  link.append(coverWrap, info);

  const actions = createElement("div", "book-actions");
  const readLabel = createElement("span", "read-label", "Read online ↗");

  const actionButtons = createElement("div", "book-action-buttons");

  const favoriteButton = createElement(
    "button",
    `icon-btn favorite-btn${favorites.includes(book.id) ? " is-favorite" : ""}`,
    favorites.includes(book.id) ? "♥" : "♡"
  );

  favoriteButton.type = "button";
  favoriteButton.title = favorites.includes(book.id)
    ? "Remove from favorites"
    : "Add to favorites";
  favoriteButton.setAttribute(
    "aria-label",
    favoriteButton.title
  );
  favoriteButton.setAttribute(
    "aria-pressed",
    String(favorites.includes(book.id))
  );

  favoriteButton.addEventListener("click", () => {
    toggleFavorite(book.id);
  });

  const deleteButton = createElement("button", "icon-btn delete-btn", "×");
  deleteButton.type = "button";
  deleteButton.title = "Delete book";
  deleteButton.setAttribute("aria-label", `Delete ${book.title}`);

  deleteButton.addEventListener("click", () => {
    deleteBook(book);
  });

  actionButtons.append(favoriteButton, deleteButton);
  actions.append(readLabel, actionButtons);
  card.append(link, actions);

  return card;
}

function renderBooks() {
  const visibleBooks = getVisibleBooks();
  bookGrid.replaceChildren();

  visibleBooks.forEach(book => {
    bookGrid.append(createBookCard(book));
  });

  bookCount.textContent = String(getAllBooks().length);
  emptyState.hidden = visibleBooks.length !== 0;
  bookGrid.hidden = visibleBooks.length === 0;
  clearSearch.hidden = searchTerm.length === 0;
}

function toggleFavorite(bookId) {
  const previousFavorites = [...favorites];

  if (favorites.includes(bookId)) {
    favorites = favorites.filter(id => id !== bookId);
  } else {
    favorites.push(bookId);
  }

  if (!saveStorage(STORAGE_KEYS.favorites, favorites)) {
    favorites = previousFavorites;
    window.alert("Your favorites could not be saved in this browser.");
    return;
  }

  renderBooks();
}

function deleteBook(book) {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${book.title}" from your library?`
  );

  if (!confirmed) {
    return;
  }

  const previousCustomBooks = [...customBooks];
  const previousDeletedBooks = [...deletedStarterBooks];
  const previousFavorites = [...favorites];

  if (book.id.startsWith("starter-")) {
    deletedStarterBooks.push(book.id);
  } else {
    customBooks = customBooks.filter(item => item.id !== book.id);
  }

  favorites = favorites.filter(id => id !== book.id);

  const savedBooks = saveStorage(STORAGE_KEYS.customBooks, customBooks);
  const savedDeleted = saveStorage(
    STORAGE_KEYS.deletedStarterBooks,
    deletedStarterBooks
  );
  const savedFavorites = saveStorage(STORAGE_KEYS.favorites, favorites);

  if (!savedBooks || !savedDeleted || !savedFavorites) {
    customBooks = previousCustomBooks;
    deletedStarterBooks = previousDeletedBooks;
    favorites = previousFavorites;

    saveStorage(STORAGE_KEYS.customBooks, customBooks);
    saveStorage(STORAGE_KEYS.deletedStarterBooks, deletedStarterBooks);
    saveStorage(STORAGE_KEYS.favorites, favorites);

    window.alert("The book could not be deleted. Please check your browser storage.");
    return;
  }

  renderBooks();
}

function showAddBookForm() {
  addBookSection.hidden = false;
  formMessage.textContent = "";
  formMessage.className = "form-message";
  addBookSection.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("bookTitle").focus({ preventScroll: true });
}

function hideAddBookForm() {
  addBookSection.hidden = true;
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

openAddBook.addEventListener("click", showAddBookForm);
closeAddBook.addEventListener("click", hideAddBookForm);
cancelAddBook.addEventListener("click", hideAddBookForm);

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderBooks();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  renderBooks();
  searchInput.focus();
});

categoryFilters.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (!button) {
    return;
  }

  activeCategory = button.dataset.category;

  categoryFilters.querySelectorAll("[data-category]").forEach(categoryButton => {
    const isActive = categoryButton.dataset.category === activeCategory;
    categoryButton.classList.toggle("active", isActive);
    categoryButton.setAttribute("aria-pressed", String(isActive));
  });

  renderBooks();
});

resetFilters.addEventListener("click", () => {
  activeCategory = "All Books";
  searchTerm = "";
  searchInput.value = "";

  categoryFilters.querySelectorAll("[data-category]").forEach(button => {
    const isActive = button.dataset.category === "All Books";
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderBooks();
});

bookForm.addEventListener("submit", event => {
  event.preventDefault();

  const title = document.getElementById("bookTitle").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const category = document.getElementById("bookCategory").value;
  const cover = document.getElementById("bookCover").value.trim();
  const readingLink = document.getElementById("bookReadingLink").value.trim();
  const description = document.getElementById("bookDescription").value.trim();

  if (!title || !author || !category || !readingLink) {
    showFormMessage("Please complete all required fields.", "error");
    return;
  }

  if (!isValidWebUrl(readingLink)) {
    showFormMessage("Please enter a valid HTTP or HTTPS reading link.", "error");
    return;
  }

  if (cover && !isValidWebUrl(cover)) {
    showFormMessage("Please enter a valid cover image URL.", "error");
    return;
  }

  const newBook = {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    author,
    category,
    cover,
    readingLink,
    description
  };

  const previousBooks = [...customBooks];
  customBooks.push(newBook);

  if (!saveStorage(STORAGE_KEYS.customBooks, customBooks)) {
    customBooks = previousBooks;
    showFormMessage(
      "The book could not be saved. Please check your browser storage.",
      "error"
    );
    return;
  }

  bookForm.reset();
  activeCategory = "All Books";
  searchTerm = "";
  searchInput.value = "";

  categoryFilters.querySelectorAll("[data-category]").forEach(button => {
    const isActive = button.dataset.category === "All Books";
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  hideAddBookForm();
  renderBooks();

  document.getElementById("explore").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

document.getElementById("currentYear").textContent = String(
  new Date().getFullYear()
);

renderBooks();
