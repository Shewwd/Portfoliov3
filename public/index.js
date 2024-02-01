/* --------- On Load --------- */
window.onload = function() {
    fetch("https://us-central1-portfolio-51d79.cloudfunctions.net/api/get-token").then(response => response.json()).then(data => {
        localStorage.setItem('token', data.token);
    });
};

/* --------- Nav --------- */
function scrollToSection(section, mobile) {
    const targetElement = document.getElementById(`${section}-card`);
    const headerHeight = 80;
    const targetPosition = targetElement.offsetTop - headerHeight;

    if(mobile)
        document.getElementById('mobile-nav-list').classList.toggle('shown');

    window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
    });
}

function handleNavExpand(){
    const navListRef = document.getElementById('mobile-nav-list');
    navListRef.classList.toggle('shown');
}

/* --------- SlideShow --------- */

let snakeGameCurrentSlide = 1;
let snakeGameSlideCount = 3;

let gymProjectCurrentSlide = 1;
let gymProjectSlideCount = 4;

function changeSlide(slideName, incrament){
    let currentSlide;
    let nextSlide;

    if(slideName === "snake-game"){
        currentSlide = document.getElementById(`snake-game-image-${snakeGameCurrentSlide}`);

        const nextSlideIndex = incrament === -1 && snakeGameCurrentSlide === 1 ? snakeGameSlideCount : incrament === 1 && snakeGameCurrentSlide === snakeGameSlideCount ? 1 : snakeGameCurrentSlide + incrament;
        nextSlide = document.getElementById(`snake-game-image-${nextSlideIndex}`);

        currentSlide.className = "hidden";
        nextSlide.className = "shown";

        snakeGameCurrentSlide = nextSlideIndex;
    }else if(slideName === "gym-project") {
        currentSlide = document.getElementById(`gym-project-image-${gymProjectCurrentSlide}`);

        const nextSlideIndex = incrament === -1 && gymProjectCurrentSlide === 1 ? gymProjectSlideCount : incrament === 1 && gymProjectCurrentSlide === gymProjectSlideCount ? 1 : gymProjectCurrentSlide + incrament;
        nextSlide = document.getElementById(`gym-project-image-${nextSlideIndex}`);

        currentSlide.className = "hidden";
        nextSlide.className = "shown";

        gymProjectCurrentSlide = nextSlideIndex;
    }
}

/* --------- ReCaptcha --------- */

function onloadCallback(){

    const maxAttempts = 10;
    let attempt = 0
    while(localStorage.getItem('token') === null && attempt < maxAttempts){

        setTimeout( () => {}, 500);
        attempt++;
    }

    if(localStorage.getItem('token') === null){
        console.log("Error retrieving contact form");
        return;
    }
    
    fetch("https://us-central1-portfolio-51d79.cloudfunctions.net/api/api-key", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }    
    }).then(response => response.json()).then(data => {
        grecaptcha.render('recaptcha_element', {
            'sitekey' : data.googleSiteApiKey,
            'callback' : completeCallback,
        });
    });
}

function completeCallback(){
    document.getElementById('contact-captcha').className = "captcha hidden";
    document.getElementById('contact-form').className = "contact-form shown";
}

/* --------- Contact Submit --------- */
const emailRegex = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nameRef = document.getElementById('contact-name');
    const emailRef = document.getElementById('contact-email');
    const messageRef = document.getElementById('contact-message');

    const name = nameRef.value.trim();
    const email = emailRef.value.trim();
    const message = messageRef.value.trim();

    let errorMessage = "";

    if(!emailRegex.test(email)){
        emailRef.className = "invalid-input";
        errorMessage += 'Invalid Email';
    }else{
        emailRef.className = "";
    }

    if(name.length <= 0){
        nameRef.className = "invalid-input";
        errorMessage += errorMessage.length > 0 ? ', Empty Name' : 'Empty Name';
    } else {
        nameRef.className = "";
    }

    if(message.length <= 0){
        messageRef.className = "invalid-input";
        errorMessage += errorMessage.length > 0 ? ', Empty Message' : 'Empty Message';
    } else {
        messageRef.className = "";
    }

    if(errorMessage.length > 0){
        alert(errorMessage);
        return;
    }

    document.getElementById('contact-form-submit').disabled = true;
    nameRef.disabled = true;
    emailRef.disabled = true;
    messageRef.disabled = true;

    fetch("https://us-central1-portfolio-51d79.cloudfunctions.net/api/send-email", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            name: name,
            email: email,
            message: message,
        }),
    }).then(response => response.json()).then(data => {
        alert('Email Sent Successfully!');
    }).catch((error) => {
        alert('Error Sending Email');
    });
});