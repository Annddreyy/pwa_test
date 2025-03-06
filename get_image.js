async function setImage() {
    let params = new URLSearchParams(document.location.search);
    let value = params.get('image_id');

    let response = await fetch(`https://api.artic.edu/api/v1/artworks/${value}`)
    if (response.ok) {
        let image = await response.json();
        let data = image.data;

        let header = document.getElementById('header');
        let title = document.getElementById('card_title');
        let imageCard = document.getElementById('card_image');
        let description = document.getElementById('card_description');

        header.append(data.title);
        title.innerHTML = data.title;
        imageCard.src = 'https://www.artic.edu/iiif/2/' + data.image_id + '/full/843,/0/default.jpg';
        description.innerHTML = data.description ?? 'Нет описания';
    }
}

setImage();
