(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const counter = document.getElementById("counter");
  const progressBar = document.getElementById("progressBar");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const fsBtn = document.getElementById("fs");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;

  const courseTag = document.body.dataset.course || "Non-Degree";

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({ attrs: { "stroke-width": 2.2 } });
  }

  const prepareBars = () => {
    document.querySelectorAll(".bar-fill[data-width]").forEach((el) => {
      const w = el.getAttribute("data-width");
      el.style.setProperty("--w", `${w}%`);
      el.classList.remove("is-on");
    });
  };

  const animateSlide = (slide) => {
    slide.querySelectorAll(".bar-fill[data-width]").forEach((el) => {
      el.classList.remove("is-on");
      void el.offsetWidth;
      if (!reduceMotion) {
        requestAnimationFrame(() => el.classList.add("is-on"));
      } else {
        el.classList.add("is-on");
      }
    });

    slide.querySelectorAll(".quality-bar").forEach((el) => {
      el.classList.remove("is-on");
      void el.offsetWidth;
      requestAnimationFrame(() => el.classList.add("is-on"));
    });

    slide.querySelectorAll("[data-count]").forEach((el) => {
      if (reduceMotion) {
        el.textContent = el.dataset.count;
        return;
      }
      const raw = el.dataset.count;
      const isPct = raw.includes("%");
      const target = parseFloat(raw);
      if (Number.isNaN(target)) return;
      const decimals = raw.includes(".") ? (raw.split(".")[1].replace("%", "").length) : 0;
      const start = performance.now();
      const dur = 700;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = target * eased;
        el.textContent = isPct
          ? `${val.toFixed(decimals)}%`
          : (decimals ? val.toFixed(decimals) : String(Math.round(val)));
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = raw;
      };
      requestAnimationFrame(tick);
    });
  };

  const render = () => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    counter.textContent = `${index + 1} / ${slides.length}`;
    progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
    document.title = `${slides[index].dataset.title || "Slide"} · ${courseTag}`;
    animateSlide(slides[index]);
  };

  const go = (delta) => {
    index = Math.max(0, Math.min(slides.length - 1, index + delta));
    render();
  };

  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));

  document.addEventListener("keydown", (e) => {
    if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) {
      e.preventDefault();
      go(1);
    } else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Home") {
      index = 0;
      render();
    } else if (e.key === "End") {
      index = slides.length - 1;
      render();
    } else if (e.key.toLowerCase() === "f") {
      toggleFs();
    }
  });

  let touchX = null;
  document.addEventListener("touchstart", (e) => {
    touchX = e.changedTouches[0].screenX;
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].screenX - touchX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });

  const toggleFs = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        document.body.classList.add("is-fs");
      } else {
        await document.exitFullscreen();
        document.body.classList.remove("is-fs");
      }
    } catch (_) {
      document.body.classList.toggle("is-fs");
    }
  };
  fsBtn.addEventListener("click", toggleFs);
  document.addEventListener("fullscreenchange", () => {
    document.body.classList.toggle("is-fs", Boolean(document.fullscreenElement));
  });

  prepareBars();
  render();
})();
