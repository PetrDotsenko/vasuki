// Ждём полной загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  // Players Carousel
  const carousel = document.querySelector(".carousel");
  const prevButton = document.querySelector(".players .prev");
  const nextButton = document.querySelector(".players .next");
  const currentIndexIndicator = document.querySelector(
    ".players .current-index"
  );
  const totalCountIndicator = document.querySelector(".players .total-count");
  const items = carousel.querySelectorAll(".carousel-item");
  const totalItems = items.length;
  let itemsToShow = window.innerWidth <= 1024 ? 1 : 3;
  let currentIndex = 0;

  totalCountIndicator.textContent = totalItems;

  // Clone items for seamless looping
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    carousel.appendChild(clone);
  });

  // Update the current index indicator
  function updateIndicator() {
    const displayIndex = (currentIndex % totalItems) + 1;
    currentIndexIndicator.textContent = displayIndex;
  }

  // Move carousel forward
  function moveCarousel() {
    currentIndex++;
    const offset = -currentIndex * (100 / itemsToShow);
    carousel.style.transform = `translateX(${offset}%)`;
    if (currentIndex >= totalItems) {
      setTimeout(() => {
        carousel.style.transition = "none";
        currentIndex = 0;
        carousel.style.transform = `translateX(0%)`;
        setTimeout(() => {
          carousel.style.transition = "transform 1s ease";
        }, 50);
      }, 1000);
    }
    updateIndicator();
  }

  // Event listeners for navigation buttons
  prevButton.addEventListener("click", () => {
    currentIndex--;
    if (currentIndex < 0) currentIndex = totalItems - 1;
    const offset = -currentIndex * (100 / itemsToShow);
    carousel.style.transform = `translateX(${offset}%)`;
    updateIndicator();
  });

  nextButton.addEventListener("click", moveCarousel);

  // Auto-advance carousel every 4 seconds
  setInterval(moveCarousel, 4000);

  // Handle window resize for responsive itemsToShow
  window.addEventListener("resize", () => {
    itemsToShow = window.innerWidth <= 1024 ? 1 : 3;
    currentIndex = 0;
    carousel.style.transform = `translateX(0%)`;
    updateIndicator();
  });

  // Toggle <br> visibility in buttons for mobile
  function toggleBrVisibility() {
    const isMobile = window.innerWidth < 1024;
    document.querySelectorAll(".buttons button").forEach((button) => {
      button.classList.toggle("hide-br", isMobile);
    });
  }

  // Mobile description text adjustment
  function adjustDescriptionText() {
    const description = document.querySelector(".description");
    if (description && window.innerWidth < 1024) {
      description.innerHTML =
        "Оплатите взнос на телеграммы<br> для организации Международного васюкинского турнира по шахматам";
    }
  }

  // About section text layout adjustment
  function updateLectureText() {
    const aboutLectureSection = document.querySelector("#support");
    const originalHTML = aboutLectureSection.innerHTML;
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    function adjustText(e) {
      if (e.matches) {
        const aboutLectureTextOriginal = aboutLectureSection.querySelector(
          ".about-lecture__text"
        );
        const aboutLectureTextFirst = document.createElement("p");
        aboutLectureTextFirst.className = "about-lecture__text second-font";
        aboutLectureTextFirst.innerHTML =
          "Чтобы поддержать<br> Международный васюкинский турнир";

        const aboutLectureTextSecond = document.createElement("p");
        aboutLectureTextSecond.className = "about-lecture__text second-font";
        aboutLectureTextSecond.innerHTML =
          'посетите лекцию на тему: <br><span class="red-text">«Плодотворная дебютная идея»</span>';

        aboutLectureSection.replaceChild(
          aboutLectureTextFirst,
          aboutLectureTextOriginal
        );
        const aboutLectureImage = aboutLectureSection.querySelector("img");
        aboutLectureSection.insertBefore(
          aboutLectureTextSecond,
          aboutLectureImage.nextSibling
        );
      } else {
        aboutLectureSection.innerHTML = originalHTML;
      }
    }

    mobileQuery.addEventListener("change", adjustText);
    adjustText(mobileQuery);
  }

  // Contact info line break adjustment
  function addLineBreak() {
    const paragraph = document.querySelector(".contact-info");
    const text = paragraph.textContent;
    if (window.innerWidth < 1024) {
      paragraph.innerHTML = text.replace(" в ", "<br>в ");
    } else {
      paragraph.innerHTML = text.replace("<br>в ", " в ");
    }
  }

  // Event title text adjustment
  function updateEventTitle() {
    const eventTitle = document.querySelector(".event-title");
    const isMobile = window.innerWidth < 1024;
    eventTitle.innerHTML = isMobile
      ? 'И СЕАНС <span class="red-text second-font">ОДНОВРЕМЕННОЙ ИГРЫ В ШАХМАТЫ НА 160 ДОСКАХ</span> ГРОССМЕЙСТЕРА<br> О. БЕНДЕРА'
      : 'И СЕАНС <span class="red-text second-font">ОДНОВРЕМЕННОЙ ИГРЫ<br> В ШАХМАТЫ НА 160 ДОСКАХ</span><br> ГРОССМЕЙСТЕРА О. БЕНДЕРА';
  }

  // Transformation stages carousel for mobile
  function initTransformationCarousel() {
    const container = document.querySelector(".transformation-stages");
    const grid = container.querySelector(".stages-grid");
    const controls = container.querySelector(".stages-carousel-controls");
    let subtitle = container.querySelector(".subtitle");

    if (!grid || !controls) return;

    // Debounce function to limit resize event frequency
    function debounce(fn, ms) {
      let timer;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, ms);
      };
    }

    function updateCarousel() {
      const isMobile = window.innerWidth <= 1024;
      const items = Array.from(container.querySelectorAll(".stage-item"));

      // Clear previous slides and pagination
      grid.querySelectorAll(".slide").forEach((n) => n.remove());
      container.querySelectorAll(".pagination").forEach((n) => n.remove());

      if (isMobile) {
        // Adjust title for mobile
        const h2 = container.querySelector(".second-font");
        if (h2) {
          h2.innerHTML = "ЭТАПЫ<br>ПРЕОБРАЖЕНИЯ<br>ВАСЮКОВ";
          if (!subtitle) {
            subtitle = document.createElement("span");
            subtitle.className = "subtitle";
          }
          container.insertBefore(subtitle, h2.nextSibling);
        }

        // Group items into slides
        const groups = [[0, 1], [2], [3, 4], [5], [6]];
        const slides = groups.map((idxs, i) => {
          const slide = document.createElement("div");
          slide.className = "slide";
          if (i === 0) slide.classList.add("active");
          idxs.forEach((idx) => slide.appendChild(items[idx].cloneNode(true)));
          grid.appendChild(slide);
          return slide;
        });

        // Create pagination
        const pagination = document.createElement("div");
        pagination.className = "pagination";
        slides.forEach((_, i) => {
          const dot = document.createElement("div");
          dot.className = "pagination-dot";
          if (i === 0) dot.classList.add("active");
          dot.addEventListener("click", () => activate(i));
          pagination.appendChild(dot);
        });

        // Insert pagination between prev and next buttons
        const prevBtn = controls.querySelector(".prev");
        const nextBtn = controls.querySelector(".next");
        controls.append(prevBtn, pagination, nextBtn);

        // Carousel logic
        let current = 0;
        function activate(idx) {
          if (idx < 0 || idx >= slides.length) return;
          slides.forEach((s, i) => s.classList.toggle("active", i === idx));
          pagination
            .querySelectorAll(".pagination-dot")
            .forEach((d, i) => d.classList.toggle("active", i === idx));
          current = idx;
          prevBtn.disabled = current === 0;
          nextBtn.disabled = current === slides.length - 1;
        }

        prevBtn.onclick = () => activate(current - 1);
        nextBtn.onclick = () => activate(current + 1);
        activate(0);
        controls.style.display = "flex";
      } else {
        controls.style.display = "none";
        grid.innerHTML = "";
        items.forEach((it) => grid.appendChild(it.cloneNode(true)));
      }
    }

    updateCarousel();
    window.addEventListener("resize", debounce(updateCarousel, 200));
  }

  // Transformation stages subtitle and image adjustment
  function updateTransformationLayout() {
    const subtitle = document.querySelector(".transformation-stages .subtitle");
    const stageImage = document.querySelector(".stage-image");
    const section = document.querySelector(".transformation-stages");
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      subtitle.innerHTML = "Будущие источники обогащения васюкинцев";
      if (stageImage && subtitle.nextElementSibling !== stageImage) {
        subtitle.insertAdjacentElement("afterend", stageImage);
      }
    } else {
      subtitle.innerHTML = "Будущие источники <br> обогащения васюкинцев";
      if (stageImage && stageImage.parentNode !== section) {
        section.appendChild(stageImage);
      }
    }
  }

  // Players carousel navigation controls adjustment
  function adjustPlayersControls() {
    const sections = document.querySelectorAll("section.players");
    sections.forEach((section) => {
      const controls = section.querySelector(".carousel-controls");
      const container = section.querySelector(".carousel-container");
      const placeholder =
        section.querySelector(".controls-placeholder") ||
        document.createElement("div");
      placeholder.className = "controls-placeholder";
      if (!section.contains(placeholder)) {
        controls.parentNode.insertBefore(placeholder, controls);
      }

      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        if (controls.parentNode !== container) {
          container.appendChild(controls);
        }
      } else {
        if (controls.parentNode !== placeholder.parentNode) {
          placeholder.parentNode.insertBefore(
            controls,
            placeholder.nextSibling
          );
        }
      }
    });
  }

  // Footer text adjustment
  function updateFooterText() {
    const footers = document.querySelectorAll("footer.footer p");
    footers.forEach((p) => {
      if (!p._originalHTML) {
        p._originalHTML = p.innerHTML.trim();
        p._mobileHTML = [
          "Все персонажи, события и цитаты являются вымышленными",
          "и не принадлежат создателям сайта.",
          "С подробностями можно познакомиться",
          "в главе XXXIV романа Ильи Ильфа",
          "и Евгения Петрова «Двенадцать стульев».",
        ].join("<br>");
      }
      const isMobile = window.innerWidth < 1024;
      p.innerHTML = isMobile ? p._mobileHTML : p._originalHTML;
    });
  }

  // Initialize all functions on DOMContentLoaded
  updateIndicator();
  toggleBrVisibility();
  adjustDescriptionText();
  updateLectureText();
  addLineBreak();
  updateEventTitle();
  initTransformationCarousel();
  updateTransformationLayout();
  adjustPlayersControls();
  updateFooterText();

  // Handle resize events
  window.addEventListener("resize", () => {
    toggleBrVisibility();
    addLineBreak();
    updateEventTitle();
    updateTransformationLayout();
    adjustPlayersControls();
    updateFooterText();
  });
});
