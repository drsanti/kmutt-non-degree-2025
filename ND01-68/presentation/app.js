(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const counter = document.getElementById("counter");
  const progressBar = document.getElementById("progressBar");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const fsBtn = document.getElementById("fs");
  let index = 0;

  const render = () => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    counter.textContent = `${index + 1} / ${slides.length}`;
    progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
    document.title = `${slides[index].dataset.title || "Slide"} · Non-Degree IIoT`;
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

  render();
})();
