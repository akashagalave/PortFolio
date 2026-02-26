document.addEventListener("DOMContentLoaded", function () {
    // Toggle Navbar
    document.getElementById("menu").addEventListener("click", function () {
        this.classList.toggle("fa-times");
        document.querySelector(".navbar").classList.toggle("nav-toggle");
    });

    // Scroll and Load Events
    window.addEventListener("scroll", function () {
        document.getElementById("menu").classList.remove("fa-times");
        document.querySelector(".navbar").classList.remove("nav-toggle");

        document.getElementById("scroll-top").classList.toggle("active", window.scrollY > 60);

        // Scroll Spy
        document.querySelectorAll("section").forEach(section => {
            let height = section.offsetHeight;
            let offset = section.offsetTop - 200;
            let top = window.scrollY;
            let id = section.getAttribute("id");

            if (top > offset && top < offset + height) {
                document.querySelectorAll(".navbar ul li a").forEach(link => link.classList.remove("active"));
                document.querySelector(`.navbar ul li a[href="#${id}"]`)?.classList.add("active");
            }
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
        });
    });

    // EmailJS Form Submission
    emailjs.init("IbH8VxSgYZ6gu5rZK");
    
    document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault();
        
        emailjs.sendForm("service_pzw65ci", "template_paj1t9p", this)
            .then(function (response) {
                console.log("SUCCESS!", response.status, response.text);
                alert("Form Submitted Successfully!");
                document.getElementById("contact-form").reset();
            }, function (error) {
                console.log("FAILED...", error);
                alert("Form Submission Failed! Try Again.");
            });
    });
    
    // Page Visibility Change Event
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Akash Agalave";
            document.getElementById("favicon").setAttribute("href", "assets/images/favicon.png");
        } else {
            document.title = "Come Back To Portfolio";
            document.getElementById("favicon").setAttribute("href", "assets/images/favhand.png");
        }
    });

    // Typed.js Effect
    new Typed(".typing-text", {
        strings: ["Data Scientist", "Machine Learning Engineer", "AI Engineer"],
        loop: true,
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 500,
    });

    // Tilt.js Effect
    VanillaTilt.init(document.querySelectorAll(".tilt"), { max: 15 });

    // Scroll Reveal Animations
    const srtop = ScrollReveal({
        origin: "top",
        distance: "80px",
        duration: 1000,
        reset: true
    });

    srtop.reveal(".home .content h3", { delay: 200 });
    srtop.reveal(".home .content p", { delay: 200 });
    srtop.reveal(".home .content .btn", { delay: 200 });
    srtop.reveal(".home .image", { delay: 400 });
    srtop.reveal(".home .linkedin", { delay: 600 });
    srtop.reveal(".home .github", { delay: 800 });
    srtop.reveal(".home .twitter", { delay: 1000 });
    srtop.reveal(".home .telegram", { delay: 600 });
    srtop.reveal(".home .instagram", { delay: 800 });
    srtop.reveal(".home .dev", { delay: 1000 });
    srtop.reveal(".about .content h3", { delay: 200 });
    srtop.reveal(".about .content .tag", { delay: 200 });
    srtop.reveal(".about .content p", { delay: 200 });
    srtop.reveal(".about .content .box-container", { delay: 200 });
    srtop.reveal(".about .content .resumebtn", { delay: 200 });
    srtop.reveal(".education .box", { interval: 200 });
    srtop.reveal(".experience .timeline", { delay: 400 });
    srtop.reveal(".experience .timeline .container", { interval: 400 });
    srtop.reveal(".contact .container", { delay: 400 });
    srtop.reveal(".contact .container .form-group", { delay: 400 });
});