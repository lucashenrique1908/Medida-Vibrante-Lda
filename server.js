// server.js
// Backend proxy para buscar avaliações da Zaask e expor para o frontend

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Permite CORS para qualquer domínio

// Função utilitária para normalizar um review
function normalizeReview(review) {
	return {
		nome: review?.reviewerInfo?.name || "Cliente",
		estrelas: Math.round(Number(review?.rating) || 0),
		comentario: review?.comment || "",
		data: review?.reviewDate || null,
	};
}

app.get("/api/zaask-reviews", async (req, res) => {
	const urls = [
		"https://www.zaask.pt/api/v1/profile/reviews/ivorenatocastro",
		"https://www.zaask.pt/api/v1/profile/reviews/ivorenatocastro?page=2",
	];

	try {
		// Busca as duas páginas em paralelo
		const responses = await Promise.all(urls.map((url) => axios.get(url)));
		const jsons = responses.map((r) => r.data);
		console.log("[Zaask] Respostas recebidas:", jsons.length);

		// Extrai e combina os reviews de cada página
		let allReviews = [];
		for (const json of jsons) {
			let reviewsArr = [];
			if (json && json.reviews && json.reviews.reviews) {
				// reviews pode ser objeto ou array
				if (Array.isArray(json.reviews.reviews)) {
					reviewsArr = json.reviews.reviews;
				} else if (typeof json.reviews.reviews === "object") {
					reviewsArr = Object.values(json.reviews.reviews);
				}
			} else {
				console.warn("[Zaask] Estrutura inesperada:", json);
			}
			allReviews = allReviews.concat(reviewsArr);
		}

		// Normaliza, ordena e limita
		const normalized = allReviews
			.map(normalizeReview)
			.filter((r) => r.comentario && r.estrelas > 0)
			.sort((a, b) => new Date(b.data) - new Date(a.data))
			.slice(0, 20);

		res.json(normalized);
	} catch (error) {
		console.error("[Zaask] Erro ao buscar avaliações:", error.message);
		res.status(500).json({
			error: true,
			message: "Não foi possível carregar avaliações da Zaask",
		});
	}
});

app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});

/*
========================
Como rodar o servidor:

1. Instale as dependências:
   npm install express cors axios

2. Inicie o servidor:
   node server.js

O endpoint ficará disponível em:
   http://localhost:3000/api/zaask-reviews

========================
Como consumir no frontend:

fetch('/api/zaask-reviews')
  .then(res => res.json())
  .then(data => {
    // data é um array de avaliações normalizadas
    console.log(data);
    // Renderize no seu site
  })
  .catch(err => {
    // Trate erro
    console.error(err);
  });
*/
