//GSAP

       document.addEventListener("DOMContentLoaded", (event) => {

        // SCROLL

  gsap.registerPlugin(ScrollTrigger,ScrollSmoother)
   // create the smooth scroller FIRST!
  let smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 2,
    smoothTouch:0.1,
    effects: true,
  });
 });


 
