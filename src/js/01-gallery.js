// import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// Add imports above this line
import { galleryItems } from './gallery-items';
// Change code below this line
console.log(galleryItems);

const createGalleryMarkup = items =>
  items
    .map(
      ({ original, description, preview }) => `
      <li class="gallery__item">
        <a class="gallery__link" href="${original}">
          <img class="gallery__image" src="${preview}" alt="${description}" />
        </a>
      </li>`
    )
    .join('');

const gallery = document.querySelector('ul.gallery');

if (gallery) {
  gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(galleryItems));

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
} else {
  console.error('Gallery not found');
}
