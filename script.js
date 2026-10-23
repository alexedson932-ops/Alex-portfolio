// Display the current year in the footer (if the footer exists).
const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Image preview modal works on both the homepage and project detail pages.
const galleryImages = document.querySelectorAll(
    ".gallery-image, .details-gallery-image"
);
const imageModal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const closeModal = document.getElementById("close-modal");

function closeImageModal() {
    if (!imageModal) return;
    imageModal.classList.remove("active");
    imageModal.setAttribute("aria-hidden", "true");
    if (modalImage) modalImage.src = "";
    document.body.style.overflow = "";
}

if (imageModal && modalImage && closeModal) {
    galleryImages.forEach((image) => {
        image.addEventListener("click", () => {
            modalImage.src = image.currentSrc || image.src;
            modalImage.alt = image.alt || "Expanded project screenshot";
            imageModal.classList.add("active");
            imageModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            closeModal.focus();
        });
    });

    closeModal.addEventListener("click", closeImageModal);

    imageModal.addEventListener("click", (event) => {
        if (event.target === imageModal) closeImageModal();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && imageModal.classList.contains("active")) {
            closeImageModal();
        }
    });
}
