/**----------------------------------------------------------------**/

let cicleCounter1 = 1;
let cicleCounter2 = 0;
let totalImageCounter = 0;
let currentImage = null;
let imageToSendBack = null;
const imagesArray = [];
const btnNextEl = document.querySelector(".btn-next");
const imageScrollerEl = document.querySelector(".image-scroller");
const authorTextEl = document.querySelector(".image-author");

const COLUMN_GAP = 80;
const IMAGE_WIDTH = 110;
const MAIN_IMAGE_WIDTH = 172;
const MAIN_IMAGE_SHADOW = 4;
const BASE_URL = "https://picsum.photos/v2/list?page=1&limit=20";

// Randomize Picsum URL page number

const randomizeURL = (url) => {
  let randomPageNum = Math.floor(Math.random() * 21);

  return url.replace(/page=1/i, `page=${randomPageNum}`);
};

// Set image URL size to 800

const normalizeImageURL = (url, width, height = width) => {
  let urlArr = url.split("/");

  urlArr.splice(-2, 2, width, height);
  return urlArr.join("/");
};

/**----------------------------------------------------------------**/

const createImage = (imageFromJson, index) => {
  const newImageEl = document.createElement("img");
  newImageEl.src = normalizeImageURL(imageFromJson.download_url, 172, 308);
  newImageEl.classList.add("image");
  newImageEl.dataset.author = imageFromJson.author;
  newImageEl.dataset.index = index;

  return newImageEl;
};

const setImageActive = () => {
  let newInsetInline = null;
  const activeImageEl = imageScrollerEl.querySelector(".image.active");

  if (activeImageEl) {
    activeImageEl.classList.remove("active");
  }

  imagesArray[currentImage].classList.add("active");
  authorTextEl.textContent = imagesArray[currentImage].dataset.author;

  let halfScreen = `50% - ${MAIN_IMAGE_WIDTH / 2}px`;
  
  if (totalImageCounter < imagesArray.length) {
    newInsetInline = `${(IMAGE_WIDTH + COLUMN_GAP) * totalImageCounter}px`;
  } else {
    newInsetInline = `${((IMAGE_WIDTH + COLUMN_GAP) * totalImageCounter) + ((IMAGE_WIDTH / 2 + MAIN_IMAGE_SHADOW) * cicleCounter2)}px`;
  }
  
  totalImageCounter += 1;
  imageScrollerEl.style.insetInlineStart = `calc((${halfScreen}) - (${newInsetInline}))`;
};

/**----------------------------------------------------------------**/

const fetchImages = (async () => {
  console.log(randomizeURL(BASE_URL))
  const remoteImages = await fetch(randomizeURL(BASE_URL));
  const imageList = await remoteImages.json();

  imageList.forEach((image, index) => {
    const newImageEl = createImage(image, index);
    imagesArray.push(newImageEl);
    imageScrollerEl.appendChild(newImageEl);
  });

  currentImage = 0;
  imageToSendBack = currentImage - 4;
  setImageActive();

  /**----------------------------------------------------------------**/

  const searchParam = Number.parseInt(
    new URL(document.location).searchParams.get("index")
  );

  if (searchParam && searchParam > 0 && searchParam <= imagesArray.length) {
    currentImage = searchParam - 1;
    setImageActive();
  }

  /**----------------------------------------------------------------**/

  btnNextEl.addEventListener("click", () => {
    if (currentImage === imagesArray.length - 1) {
      currentImage = -1;
      cicleCounter2 += 1;
    }
    
    if (imageToSendBack === imagesArray.length - 1) {
      imageToSendBack = -1;
      cicleCounter1 += 1;
    }

    currentImage += 1;
    imageToSendBack += 1;
    setImageActive();

    if (imageToSendBack >= 0) {
      let newInset =
        ((IMAGE_WIDTH + COLUMN_GAP) * imagesArray.length +
          (IMAGE_WIDTH / 2 + MAIN_IMAGE_SHADOW)) *
        cicleCounter1;
      imagesArray[
        imageToSendBack
      ].style.transform = `translateX(${newInset}px)`;
    }
  });
})();
