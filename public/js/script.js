let ticking = false;

window.addEventListener("scroll", function () {
  if (!ticking) {
    window.requestAnimationFrame(function () {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});

function handleScroll() {
  const targets = [
    {
      image: document.querySelector(".third-left .zoom-image"),
      section: document.querySelector(".third-left"),
    },
    {
      image: document.querySelector(".fourth-right .zoom-image"),
      section: document.querySelector(".fourth-right"),
    },
    {
      image: document.querySelector(".fourth-right-about .zoom-image"),
      section: document.querySelector(".fourth-right-about"),
    },
    {
      image: document.querySelector(".landingLeftBottom .zoom-image"),
      section: document.querySelector(".landingLeftBottom"),
    },
  ];

  targets.forEach(({ image, section }) => {
    if (!image || !section) return;

    const sectionTop = section.getBoundingClientRect().top;
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;

    if (sectionTop <= windowHeight && sectionTop + sectionHeight >= 0) {
      const visibleRatio = 1 - Math.max(0, sectionTop) / windowHeight;
      const scale = 1.1 - visibleRatio * 0.1; // from 1.5 to 1.0
      image.style.transform = `scale(${scale})`;
    }
  });
}

const categories = {
  Men: [
    "Topwear",
    "Bottomwear",
    "Casual Shoes",
    "Accessories",
    "Ethnic Wear",
    "Formal Wear",
    "Sunglasses",
    "Watches",
    "Sports Shoes",
  ],
  Women: [
    "Tops",
    "Bottoms",
    "Dresses",
    "Jumpsuits",
    "Sarees",
    "Sports Shoes",
    "Accessories",
    "Ethnic Wear",
    "Handbags",
    "Kurtis",
    "Sandals",
    "Kurta Sets",
    "Jewelery",
  ],
  Kids: ["Boys Clothing", "Girls Clothing", "Footwear", "Accessories"],
};

const sectionSelect = document.getElementById("sectionSelect");
const categorySelect = document.getElementById("categorySelect");

if (sectionSelect && categorySelect) {
  sectionSelect.addEventListener("change", () => {
    const selectedSection = sectionSelect.value;
    categorySelect.innerHTML = '<option value="">Select Category</option>';

    if (selectedSection && categories[selectedSection]) {
      categories[selectedSection].forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    }
  });
}

const revealTargets = document.querySelectorAll(".reveal-on-scroll");

if (revealTargets.length > 0 && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}
