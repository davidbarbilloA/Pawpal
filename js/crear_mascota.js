document.addEventListener('DOMContentLoaded', () => {
    class PhotoHandler {
        constructor(inputId, countId, errorId, previewGridId) {
            this.photosInput = document.getElementById(inputId);
            this.photoCountSpan = document.getElementById(countId);
            this.photoError = document.getElementById(errorId);
            this.previewGrid = document.getElementById(previewGridId);

            this.photosInput.addEventListener('change', () => this.updatePreview());
        }

        validatePhotos() {
            const count = this.photosInput.files.length;
            if (count < 1 || count > 10) {
                this.photoError.textContent = `Debes subir entre 1 y 10 fotos. Actualmente tienes ${count}.`;
                this.photoError.style.display = 'block';
                return false;
            }
            this.photoError.style.display = 'none';
            return true;
        }

        updatePreview() {
            const files = this.photosInput.files;
            const count = files.length;
            this.photoCountSpan.textContent = `(${count}/10)`;
            this.previewGrid.innerHTML = '';

            if (count < 1 || count > 10) {
                this.photoError.textContent = `Número de fotos inválido (${count}). Mínimo 1, Máximo 10.`;
                this.photoError.style.display = 'block';
            } else {
                this.photoError.style.display = 'none';
            }

            if (count > 0) {
                Array.from(files).slice(0, 10).forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const imgContainer = document.createElement('div');
                        imgContainer.classList.add('photo-placeholder');
                        if (index === 0) imgContainer.classList.add('main-photo-placeholder');
                        imgContainer.style.backgroundImage = `url(${e.target.result})`;
                        this.previewGrid.appendChild(imgContainer);
                    };
                    reader.readAsDataURL(file);
                });
            } else {
                this.previewGrid.innerHTML = `
                    <div class="photo-placeholder main-photo-placeholder">
                        <span class="placeholder-text">Foto Principal</span>
                    </div>`;
            }
        }

        getFileCount() {
            return this.photosInput.files.length;
        }
    }

    class StepManager {
        constructor(formId, stepSelector, indicatorSelector) {
            this.form = document.getElementById(formId);
            this.formSteps = document.querySelectorAll(stepSelector);
            this.stepIndicators = document.querySelectorAll(indicatorSelector);
            this.currentStep = 1;
        }

        showStep(step) {
            this.formSteps.forEach(s => s.classList.remove('active'));
            this.stepIndicators.forEach(i => i.classList.remove('active'));

            const currentSection = document.querySelector(`.form-step[data-step="${step}"]`);
            const currentIndicator = document.querySelector(`.step-indicator .step[data-step="${step}"]`);
            
            if (currentSection && currentIndicator) {
                currentSection.classList.add('active');
                currentIndicator.classList.add('active');
                this.currentStep = step;
            }

            if (step === 5) {
                this.generateSummary();
            }
        }

        generateSummary() {
            const summaryDiv = document.getElementById('profile-summary');
            const formData = new FormData(this.form);
            let summaryHTML = '<h3>Datos Básicos:</h3><ul>';

            for (let [key, value] of formData.entries()) {
                if (key !== 'fotos' && value.trim()) {
                    let keyText = key.replace(/_/g, ' ').toUpperCase();
                    summaryHTML += `<li><strong>${keyText}:</strong> ${value}</li>`;
                }
            }

            const fileCount = document.getElementById('pet-photos').files.length;
            summaryHTML += `</ul><br><h3>Fotos:</h3><p>${fileCount} foto(s) subida(s) correctamente.</p>`;
            summaryDiv.innerHTML = summaryHTML;
        }
    }

    class FormValidator {
        constructor(photoHandler) {
            this.photoHandler = photoHandler;
        }

        validateStep(step) {
            if (step === 1) {
                const name = document.getElementById('pet-name').value.trim();
                const species = document.getElementById('species').value;
                const breed = document.getElementById('breed').value.trim();

                if (!name || !species || !breed) {
                    alert('Por favor, rellena el Nombre, Especie y Raza (campos obligatorios).');
                    return false;
                }
                return true;
            }

            if (step === 2) {
                return this.photoHandler.validatePhotos();
            }

            return true;
        }
    }

    class PetFormApp {
        constructor() {
            this.photoHandler = new PhotoHandler('pet-photos', 'photo-count', 'photo-error', 'photo-preview-grid');
            this.stepManager = new StepManager('pet-creation-form', '.form-step', '.step-indicator .step');
            this.validator = new FormValidator(this.photoHandler);

            this.initButtons();
            this.initSubmit();
            this.stepManager.showStep(1);
        }

        initButtons() {
            document.querySelectorAll('.btn-next').forEach(button => {
                button.addEventListener('click', () => {
                    const nextStep = parseInt(button.dataset.nextStep);
                    if (this.validator.validateStep(this.stepManager.currentStep)) {
                        this.stepManager.showStep(nextStep);
                    }
                });
            });

            document.querySelectorAll('.btn-prev').forEach(button => {
                button.addEventListener('click', () => {
                    const prevStep = parseInt(button.dataset.prevStep);
                    this.stepManager.showStep(prevStep);
                });
            });
        }

        initSubmit() {
            this.stepManager.form.addEventListener('submit', (event) => {
                event.preventDefault();

                if (!this.validator.validateStep(2)) {
                    alert('Por favor, corrige la cantidad de fotos antes de enviar.');
                    this.stepManager.showStep(2);
                    return;
                }

                alert('Enviando datos... (Se debería implementar la lógica de Fetch/API aquí)');
                // Aquí iría tu llamada fetch o API real
                // Ejemplo: fetch('/api/mascotas', { method: 'POST', body: new FormData(this.stepManager.form) });
                // window.location.href = 'mis_mascotas.html';
            });
        }
    }

    // Inicialización global
    new PetFormApp();
});
