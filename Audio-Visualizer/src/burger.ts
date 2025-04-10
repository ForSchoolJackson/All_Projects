//make the burger work
const makeBurger = () => {
    const burgerIcon = document.querySelector('#burger');
    const navbarMenu = document.querySelector('#nav-links');

    burgerIcon.addEventListener('click', () => {
        navbarMenu.classList.toggle('is-active');
    })

   // console.log("is it working")

}


export { makeBurger };