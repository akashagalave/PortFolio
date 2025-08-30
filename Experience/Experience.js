document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("menu");
    const navbar = document.querySelector("header .navbar");
    const scrollTopButton = document.getElementById("scroll-top");
  
    // Toggle navbar on hamburger menu click
    menu.addEventListener("click", () => {
      menu.classList.toggle("fa-times");
      navbar.classList.toggle("nav-toggle");
    });
  
    // Hide navbar on link click
    document.querySelectorAll("header .navbar a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("fa-times");
        navbar.classList.remove("nav-toggle");
      });
    });
  
    // Scroll to top button functionality
    window.addEventListener("scroll", () => {
      if (window.scrollY > 60) {
        scrollTopButton.classList.add("active");
      } else {
        scrollTopButton.classList.remove("active");
      }
    });
  
    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  
    // Disable right-click context menu
    document.body.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  });
  