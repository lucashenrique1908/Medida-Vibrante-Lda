promoCards.forEach((card) => {
  const features = card.querySelectorAll(".feature");

  if (!features.length) {
    return;
  }

  let index = 0;

  features.forEach((feature, featureIndex) => {
    feature.classList.toggle("active", featureIndex === 0);
  });

  setInterval(() => {
    features[index].classList.remove("active");

    index = (index + 1) % features.length;

    features[index].classList.add("active");
  }, 2000);
});
// Refatoração: acessibilidade, modularização, performance
document.querySelectorAll(".promo-card").forEach((card) => {
  const features = card.querySelectorAll(".feature");
  if (!features.length) return;
  let index = 0;
  features.forEach((feature, featureIndex) => {
    feature.classList.toggle("active", featureIndex === 0);
    feature.setAttribute('tabindex', '0'); // acessibilidade: foco por teclado
  });
  setInterval(() => {
    features[index].classList.remove("active");
    index = (index + 1) % features.length;
    features[index].classList.add("active");
  }, 2000);
});
// Sugestão: adicionar botão fixo de WhatsApp para conversão
