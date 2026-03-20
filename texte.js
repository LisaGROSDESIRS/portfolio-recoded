 document.addEventListener("DOMContentLoaded", (event) => {

    //text

  gsap.registerPlugin(SplitText)

  document.fonts.ready.then(() => {
  gsap.set(".center-primary", { opacity: 1 });

let split =  SplitText.create(".center-primary",{
    type: "words"
});

gsap.from(split.words, {
    y: 100,
    autoAlpha: 0,
    stagger: 0.15,
    rotation: "random(-40, 40)",
    duration: 0.7,
    ease : "back",
})

 });

});