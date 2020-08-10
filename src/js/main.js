const menuMobile = document.querySelector(".menu-mobile");
const navMobile = document.querySelectorAll("[data-target='nav-mob'] .nav-list");
const body = document.querySelector("[data-target='toggle']");
const header = document.querySelector(".Header");

menuMobile.addEventListener("click", toogleMenu);

//** MENU */
function toogleMenu() {
	const x = document.querySelector(".Header .login a");
	x.classList.toggle("Button");
	x.classList.toggle("_is-secondary");

	menuMobile.classList.toggle("_animation");

	body.classList.toggle("_toggled");
}

//** MENU FOOTER*/

const footerMenu = document.querySelectorAll(".Footer h5");

footerMenu.forEach(function (item, count) {
	item.addEventListener("click", function (event) {
		show(event, count);
	});
});

function show(e, count) {
	var x = e.target.parentElement;
	var y = document.querySelectorAll(".Footer h5 i");

	x.querySelector("ul").classList.toggle("_ativo");
	y[count].classList.toggle("_rotate");
}

// ANIMACAO AO SCROLL
//const section = document.querySelectorAll("[data-target='scroll']");
const section = document.querySelectorAll(".js-scroll");
window.addEventListener("scroll", animacoesScroll);

function animacoesScroll() {
	section.forEach(function (item) {
		const sectionTop = item.getBoundingClientRect().top;
		const windownMetade = window.innerHeight * 0.6;
		const isSectionVisible = sectionTop - windownMetade < 0;

		if (isSectionVisible) item.classList.add("scroll");
	});
}
animacoesScroll();
