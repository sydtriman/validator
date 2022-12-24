const linkCategory = document.getElementById("linkCategory");
const accordions = document.querySelectorAll('.accordion-banner');
const hTabBanners = document.querySelectorAll('.h-tab-banner');

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM has loaded");
})

accordions.forEach(accordion => {
    console.log('accordion', accordion);
    accordion.addEventListener('click', (event) => {
        console.log('accordian event listener triggered');
        console.log('event', event);
        console.log('eventtarget', event.target);
        console.log('currenttarget  ', event.currentTarget);

        const accordionContent = event.currentTarget.nextElementSibling;
        const currentMode = accordionContent.style.display;
        console.log('currentMode', currentMode);
        accordionContent.classList.toggle("accordion-open");

    })
})

hTabBanners.forEach(tab => {
    tab.addEventListener('click', (event) => {
        const id = event.currentTarget.id
        const tabID = document.getElementById('id');
    })
})
