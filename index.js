async function getImages() {
	for (let i = 129800; i < 129810; i++) {
		let response = await fetch(
			`https://api.artic.edu/api/v1/artworks/${i}`
		);
		if (response.ok) {
			let image = await response.json();
			generateImagesCard(image);
		}
	}
}

async function generateImagesCard(image) {
	let data = image.data;

	let card = document.createElement("a");
	card.className = "card";
	let image_link =
		"https://www.artic.edu/iiif/2/" +
		data.image_id +
		"/full/843,/0/default.jpg";
	card.insertAdjacentHTML(
		"afterbegin",
		`
        <img src="${image_link}" alt="">
        <p class="title">${data.title}</p>
        <p class="description">${data.short_description ?? "Нет описания"}</p>
    `
	);
	card.href = `image.html?image_id=${data.id}`;

	let cards = document.getElementById("cards");
	cards.append(card);
}

getImages();
