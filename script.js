// Danh sách phim
const movies = [
  { id: "sm", title: "Spider-Man 1", genre: "Hành động", image: "sm.avif" },
  { id: "sm1", title: "Spider-Man 2", genre: "Hành động", image: "sm1.webp" },
  { id: "sl", title: "Solo Leveling", genre: "Hoạt hình", image: "sl.jpg" },
  { id: "bm", title: "Batman", genre: "Hành động", image: "bm.avif" },
  { id: "j", title: "Joker", genre: "Hành động", image: "j.webp" },
  { id: "saclo", title: "Sạc-lô", genre: "Tâm lý, Hài", image: "saclo.webp" },
  { id: "a", title: "An-na-beo", genre: "Tâm lý, Kinh dị", image: "a.jpg" },
  { id: "m", title: "Marsupilami", genre: "Hoạt hình", image: "m.jpg" },
  { id: "bbb", title: "BoBoioy Galaxy", genre: "Hoạt hình", image: "bbb.jpg" },
];

// Danh sách tài khoản và trạng thái đăng nhập
let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let favorites = JSON.parse(localStorage.getItem("favorites")) || {};

// Lấy nút đăng nhập/đăng xuất
const authButton = document.querySelector(".user-actions button");

// Cập nhật giao diện nút đăng nhập/đăng xuất
function updateAuthButton() {
  if (authButton) {
    if (currentUser) {
      authButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Đăng xuất';
      authButton.className = "logout-btn";
    } else {
      authButton.innerHTML = '<i class="fas fa-user"></i> Đăng nhập';
      authButton.className = "login-btn";
    }
  }
}

// Hàm kiểm tra trạng thái yêu thích
function isFavorite(movieId) {
  if (!currentUser || !favorites[currentUser.username]) return false;
  return favorites[currentUser.username].some((movie) => movie.id === movieId);
}

// Hàm thêm/xóa phim yêu thích
function toggleFavorite(movieId, movieTitle, movieImage) {
  if (!currentUser) return { success: false, added: false };

  if (!favorites[currentUser.username]) {
    favorites[currentUser.username] = [];
  }

  const userFavorites = favorites[currentUser.username];
  const movieIndex = userFavorites.findIndex((movie) => movie.id === movieId);

  if (movieIndex === -1) {
    userFavorites.push({ id: movieId, title: movieTitle, image: movieImage });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    return { success: true, added: true };
  } else {
    userFavorites.splice(movieIndex, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    return { success: true, added: false };
  }
}

// Hàm cập nhật giao diện nút yêu thích
function updateFavoriteButton(button, movieId) {
  if (isFavorite(movieId)) {
    button.innerHTML = '<i class="fas fa-star"></i> Xóa khỏi yêu thích';
    button.classList.add("added");
  } else {
    button.innerHTML = '<i class="far fa-star"></i> Thêm vào yêu thích';
    button.classList.remove("added");
  }
}

// Hàm hiển thị danh sách phim yêu thích
function displayFavorites() {
  const favoritesContainer = document.getElementById("favoritesContainer");
  if (!favoritesContainer) return;

  favorites = JSON.parse(localStorage.getItem("favorites")) || {};
  currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

  favoritesContainer.innerHTML = "";

  if (!currentUser) {
    favoritesContainer.innerHTML = `
      <div class="login-required-message">
        <p>Vui lòng <a href="#" id="showLoginFromFavorites">đăng nhập</a> để xem danh sách phim yêu thích</p>
      </div>
    `;
    return;
  }

  const userFavorites = favorites[currentUser.username] || [];

  if (userFavorites.length === 0) {
    favoritesContainer.innerHTML = `
      <div class="no-favorites">
        Bạn chưa có phim yêu thích nào. Hãy thêm phim từ trang chi tiết phim!
      </div>
    `;
    return;
  }

  const gridContainer = document.createElement("div");
  gridContainer.className = "movie-grid";

  userFavorites.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.className = "movie-item";
    movieElement.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}">
      <div class="movie-overlay">
        <h3>${movie.title}</h3>
        <button class="play-btn" onclick="window.location.href='movie-details.html'">
          <i class="fas fa-play"></i>
        </button>
      </div>
    `;
    gridContainer.appendChild(movieElement);
  });

  favoritesContainer.appendChild(gridContainer);
}

// Hàm tìm kiếm phim
function searchMovies(query) {
  if (!query.trim()) return [];
  const lowerCaseQuery = query.toLowerCase();
  return movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(lowerCaseQuery) ||
      movie.genre.toLowerCase().includes(lowerCaseQuery)
  );
}

// Hàm hiển thị kết quả tìm kiếm
function displaySearchResults(results) {
  let resultsContainer = document.querySelector(".search-results-container");
  if (!resultsContainer) {
    resultsContainer = document.createElement("div");
    resultsContainer.className = "search-results-container";
    document.querySelector(".search-bar").appendChild(resultsContainer);
  }

  resultsContainer.innerHTML = "";
  if (results.length === 0) {
    resultsContainer.style.display = "none";
    return;
  }

  resultsContainer.style.display = "block";
  const resultsList = document.createElement("ul");
  resultsList.className = "search-results-list";

  results.forEach((movie) => {
    const item = document.createElement("li");
    item.className = "search-result-item";
    item.innerHTML = `
      <img src="${movie.image || "https://via.placeholder.com/50x75"}" alt="${
      movie.title
    }">
      <div class="search-result-info">
        <h4>${movie.title}</h4>
        <span>${movie.genre}</span>
      </div>
    `;

    // Thêm sự kiện click để chuyển hướng đến trang chi tiết phim
    item.addEventListener("click", function () {
      window.location.href = `movie-details.html?movie=${movie.id}`;
    });

    resultsList.appendChild(item);
  });

  resultsContainer.appendChild(resultsList);
}

// Hàm tính điểm trung bình từ các đánh giá
function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce(
    (total, review) => total + parseInt(review.rating),
    0
  );
  return (sum / reviews.length).toFixed(1);
}

// Hiển thị danh sách đánh giá
function displayReviews(movieId) {
  const reviewsContainer = document.getElementById("reviewsContainer");
  const averageRatingElement = document.getElementById("averageRating");
  const reviews = JSON.parse(localStorage.getItem("movieReviews")) || {};

  if (!reviewsContainer) return;

  reviewsContainer.innerHTML = "";
  if (!reviews[movieId] || reviews[movieId].length === 0) {
    reviewsContainer.innerHTML =
      '<div class="no-reviews">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá phim này!</div>';
    if (averageRatingElement) averageRatingElement.textContent = "0";
    return;
  }

  const averageRating = calculateAverageRating(reviews[movieId]);
  if (averageRatingElement) averageRatingElement.textContent = averageRating;

  reviews[movieId].forEach((review) => {
    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";
    reviewItem.innerHTML = `
      <div class="review-header">
        <span class="review-user">${review.user}</span>
        <span class="review-date">${review.date}</span>
      </div>
      <div class="review-rating">
        ${'<i class="fas fa-star"></i>'.repeat(
          review.rating
        )}${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
      </div>
      <div class="review-content">${review.comment}</div>
    `;
    reviewsContainer.appendChild(reviewItem);
  });
}

// Tạo modal đăng nhập/đăng ký
const createModal = (type) => {
  const modal = document.createElement("div");
  modal.className = `${type}-modal`;
  modal.innerHTML = `
    <div class="${type}-content">
      <span class="close-btn">&times;</span>
      <h2>${type === "login" ? "Đăng nhập" : "Đăng ký"}</h2>
      <form id="${type}Form">
        <input type="text" name="username" placeholder="Tên đăng nhập" required>
        <input type="password" name="password" placeholder="Mật khẩu" required>
        ${
          type === "register"
            ? '<input type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" required>'
            : ""
        }
        <button type="submit">${
          type === "login" ? "Đăng nhập" : "Đăng ký"
        }</button>
        <div class="register-link">
          ${
            type === "login"
              ? 'Chưa có tài khoản? <a id="showRegister">Đăng ký ngay</a>'
              : 'Đã có tài khoản? <a id="showLogin">Đăng nhập ngay</a>'
          }
        </div>
      </form>
      <div id="${type}Error" class="error-message"></div>
    </div>
  `;
  return modal;
};

const loginModal = createModal("login");
const registerModal = createModal("register");
document.body.append(loginModal, registerModal);

// Đóng modal
const closeModal = (modal) => {
  modal.style.display = "none";
  document.getElementById(
    `${modal.className.replace("-modal", "")}Error`
  ).textContent = "";
};

// Xử lý sự kiện khi DOM đã tải xong
document.addEventListener("DOMContentLoaded", function () {
  // Cập nhật nút đăng nhập/đăng xuất
  updateAuthButton();

  // Xử lý tìm kiếm
  const searchInput = document.querySelector(".search-bar input");
  const searchButton = document.querySelector(".search-bar button");

  searchInput?.addEventListener("input", function () {
    displaySearchResults(searchMovies(this.value));
  });

  searchButton?.addEventListener("click", function () {
    displaySearchResults(searchMovies(searchInput.value));
  });

  // Đóng kết quả tìm kiếm khi click ra ngoài
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-bar")) {
      const resultsContainer = document.querySelector(
        ".search-results-container"
      );
      if (resultsContainer) resultsContainer.style.display = "none";
    }
  });

  // Xử lý trang yêu thích
  if (document.querySelector(".favorites-section")) {
    displayFavorites();
  }

  // Xử lý trang chi tiết phim
  if (document.querySelector(".movie-details-container")) {
    const movieId = document.getElementById("movieId")?.value || "";
    const movieTitle = "";
    const movieImage = "";
    const reviews = JSON.parse(localStorage.getItem("movieReviews")) || {};

    displayReviews(movieId);

    // Xử lý nút yêu thích
    const favBtn = document.getElementById("addToFavoritesBtn");
    if (favBtn) {
      updateFavoriteButton(favBtn, movieId);

      favBtn.addEventListener("click", function (e) {
        e.preventDefault();
        currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

        if (!currentUser) {
          loginModal.style.display = "flex";
          return;
        }

        const result = toggleFavorite(movieId, movieTitle, movieImage);
        if (result.success) {
          updateFavoriteButton(favBtn, movieId);
        }
      });
    }

    // Xử lý đánh giá sao
    const stars = document.querySelectorAll(".stars i");
    stars.forEach((star) => {
      star.addEventListener("click", function () {
        const rating = parseInt(this.getAttribute("data-rating"));
        document.getElementById("ratingValue").value = rating;

        stars.forEach((s, index) => {
          if (index < rating) {
            s.classList.remove("far");
            s.classList.add("fas");
          } else {
            s.classList.remove("fas");
            s.classList.add("far");
          }
        });
      });
    });

    // Xử lý gửi đánh giá
    const reviewForm = document.getElementById("reviewForm");
    if (reviewForm) {
      reviewForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const currentUser =
          JSON.parse(localStorage.getItem("currentUser")) || null;

        if (!currentUser) {
          loginModal.style.display = "flex";
          return;
        }

        const formData = new FormData(this);
        const rating = formData.get("rating");
        const comment = formData.get("comment");

        if (rating === "0") {
          alert("Vui lòng chọn số sao đánh giá!");
          return;
        }

        if (!reviews[movieId]) reviews[movieId] = [];

        const newReview = {
          user: currentUser.username,
          rating: rating,
          comment: comment,
          date: new Date().toLocaleDateString(),
        };

        reviews[movieId].unshift(newReview);
        localStorage.setItem("movieReviews", JSON.stringify(reviews));

        displayReviews(movieId);
        this.reset();
        stars.forEach((star) => {
          star.classList.remove("fas");
          star.classList.add("far");
        });
        document.getElementById("ratingValue").value = "0";
      });
    }
  }

  // Xử lý click vào thể loại
  document.querySelectorAll(".category-list a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 100,
          behavior: "smooth",
        });
      }
    });
  });

  // Xử lý click vào nút đăng nhập từ trang favorite
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "showLoginFromFavorites") {
      e.preventDefault();
      loginModal.style.display = "flex";
    }
  });
});

// Xử lý click nút đăng nhập/đăng xuất
authButton?.addEventListener("click", function () {
  if (currentUser) {
    // Đăng xuất
    currentUser = null;
    localStorage.removeItem("currentUser");
    updateAuthButton();
    alert("Đã đăng xuất thành công!");

    if (document.querySelector(".favorites-section")) {
      displayFavorites();
    }
  } else {
    // Mở modal đăng nhập
    loginModal.style.display = "flex";
  }
});

// Xử lý sự kiện đóng modal
[loginModal, registerModal].forEach((modal) => {
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.classList.contains("close-btn")) {
      closeModal(modal);
    }
  });
});

// Chuyển đổi giữa các modal
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "showRegister") {
    e.preventDefault();
    closeModal(loginModal);
    registerModal.style.display = "flex";
  }

  if (e.target && e.target.id === "showLogin") {
    e.preventDefault();
    closeModal(registerModal);
    loginModal.style.display = "flex";
  }
});

// Xử lý đăng ký
document
  .getElementById("registerForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPass = formData.get("confirmPassword");
    const errorElement = document.getElementById("registerError");

    errorElement.textContent = "";

    if (password !== confirmPass) {
      errorElement.textContent = "Mật khẩu không trùng khớp!";
      return;
    }

    if (accounts.some((acc) => acc.username === username)) {
      errorElement.textContent = "Tên đăng nhập đã tồn tại!";
      return;
    }

    accounts.push({ username, password });
    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert("✅ Đăng ký thành công!");
    closeModal(registerModal);
    this.reset();
  });

// Xử lý đăng nhập
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const username = formData.get("username");
  const password = formData.get("password");
  const errorElement = document.getElementById("loginError");

  errorElement.textContent = "";

  const account = accounts.find((acc) => acc.username === username);

  if (!account) {
    errorElement.textContent = "Tài khoản không tồn tại!";
    return;
  }

  if (account.password !== password) {
    errorElement.textContent = "Mật khẩu không chính xác!";
    return;
  }

  currentUser = { username };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  alert(`✅ Đăng nhập thành công! Xin chào ${username}`);
  closeModal(loginModal);
  this.reset();
  updateAuthButton();

  if (document.querySelector(".favorites-section")) {
    displayFavorites();
  }
});
// Xử lý tham số URL để hiển thị đúng phim
function getMovieFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("movie");
  return movies.find((movie) => movie.id === movieId) || movies[0]; // Mặc định trả về phim đầu tiên nếu không tìm thấy
}
// Hàm hiển thị danh sách phim yêu thích (cập nhật)
function displayFavorites() {
  const favoritesContainer = document.getElementById("favoritesContainer");
  if (!favoritesContainer) return;

  favorites = JSON.parse(localStorage.getItem("favorites")) || {};
  currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

  favoritesContainer.innerHTML = "";

  if (!currentUser) {
    favoritesContainer.innerHTML = `
      <div class="login-required-message">
        <p>Vui lòng <a href="#" id="showLoginFromFavorites">đăng nhập</a> để xem danh sách phim yêu thích</p>
      </div>
    `;
    return;
  }

  const userFavorites = favorites[currentUser.username] || [];

  if (userFavorites.length === 0) {
    favoritesContainer.innerHTML = `
      <div class="no-favorites">
        <i class="far fa-star fa-3x"></i>
        <h3>Bạn chưa có phim yêu thích nào</h3>
        <p>Hãy thêm phim từ trang chi tiết phim!</p>
      </div>
    `;
    return;
  }

  const gridContainer = document.createElement("div");
  gridContainer.className = "movie-grid";

  userFavorites.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.className = "movie-item";
    movieElement.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}">
      <div class="movie-overlay">
        <h3>${movie.title}</h3>
        <div class="movie-actions">
          <button class="play-btn" onclick="window.location.href='movie=${movie.id}'">
            <i class="fas fa-play"></i>
          </button>
          <button class="remove-btn" data-movie-id="${movie.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    gridContainer.appendChild(movieElement);
  });

  favoritesContainer.appendChild(gridContainer);

  // Thêm sự kiện click cho các nút xóa
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const movieId = this.getAttribute("data-movie-id");
      removeFavorite(movieId);
    });
  });
}

// Hàm xóa phim khỏi danh sách yêu thích
function removeFavorite(movieId) {
  if (!currentUser || !favorites[currentUser.username]) return;

  const userFavorites = favorites[currentUser.username];
  const movieIndex = userFavorites.findIndex((movie) => movie.id === movieId);

  if (movieIndex !== -1) {
    userFavorites.splice(movieIndex, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites(); // Cập nhật lại giao diện
    alert("Đã xóa phim khỏi danh sách yêu thích");
  }
}

// Thêm sự kiện khi DOM tải xong
document.addEventListener("DOMContentLoaded", function () {
  // ... (phần code hiện tại)

  // Thêm sự kiện click cho nút xóa
  document.addEventListener("click", function (e) {
    if (e.target && e.target.closest(".remove-btn")) {
      const btn = e.target.closest(".remove-btn");
      const movieId = btn.getAttribute("data-movie-id");
      removeFavorite(movieId);
    }
  });
});
