document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // --- Custom Cursor with gsap.quickTo ---
  const cursor = document.getElementById("cursor");
  const interactiveElements = document.querySelectorAll("a, button");

  // Setting initial cursor state
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });

  // Create fast, performant tween setters for x and y
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
  });


  // --- Preloader Logic ---
  let count = 0;
  const counterElement = document.querySelector(".preloader-counter");
  const preloader = document.getElementById("preloader");
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  
  // Initially hide hero elements to let preloader timeline reveal them
  gsap.set([heroTitle, heroSubtitle], { opacity: 0, y: 50 });

  const updateCounter = () => {
    if (count < 100) {
      let increment = Math.floor(Math.random() * 5) + 1;
      if (count > 50) increment += 3;
      if (count > 80) increment += 5;
      
      count += increment;
      if (count > 100) count = 100;
      counterElement.innerText = count;
      
      setTimeout(updateCounter, Math.floor(Math.random() * 30) + 20);
    } else {
      // Preloader Timeline
      const tl = gsap.timeline();
      tl.to(preloader, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
        delay: 0.4,
        onComplete: () => {
          preloader.style.display = "none";
          ScrollTrigger.refresh();
        }
      })
      .to([heroSubtitle, heroTitle], {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      }, "-=0.5"); // overlap with preloader exit
    }
  };
  
  updateCounter();


  // --- Hero Parallax & Pin Reveal (The GSAP Curtain Effect) ---
  // By pinning the hero section and setting pinSpacing: false,
  // the next section will scroll up and overlap it, creating the authentic mask reveal!
  gsap.to(".hero-bg", {
    yPercent: 20, // subtle parallax
    scale: 1.05,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      pin: ".hero",
      pinSpacing: false // Crucial: lets the intro-section scroll over it
    }
  });


  // --- Scroll Reveals with ScrollTrigger.batch ---
  // We use batching so multiple items appearing at the same time stagger beautifully
  gsap.set(".reveal", { y: 60, opacity: 0, autoAlpha: 0 }); // autoAlpha controls visibility and opacity

  ScrollTrigger.batch(".reveal", {
    interval: 0.1, // delay between batches
    batchMax: 3,   // max elements per batch
    onEnter: (elements) => {
      gsap.to(elements, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        overwrite: true
      });
    },
    start: "top 85%" // trigger when element is 85% down the viewport
  });
});
