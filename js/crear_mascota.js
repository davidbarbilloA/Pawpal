document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pet-creation-form');
    const stepIndicators = document.querySelectorAll('.step-indicator .step');
    const formSteps = document.querySelectorAll('.form-step');
    const photosInput = document.getElementById('pet-photos');
    const photoCountSpan = document.getElementById('photo-count');
    const photoError = document.getElementById('photo-error');
    let currentStep = 1;

    // --- FUNCIÓN PARA MOVER ENTRE PASOS ---
    function showStep(step) {
        // Oculta todos los pasos y desactiva todos los indicadores
        formSteps.forEach(section => {
            section.classList.remove('active');
        });
        stepIndicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // Muestra el paso actual
        const currentSection = document.querySelector(`.form-step[data-step="${step}"]`);
        const currentIndicator = document.querySelector(`.step-indicator .step[data-step="${step}"]`);
        
        if (currentSection) {
            currentSection.classList.add('active');
            currentIndicator.classList.add('active');
            currentStep = step;
        }

        // Si es el paso de confirmación, genera el resumen
        if (step === 5) {
            generateSummary();
        }
    }

    // --- MANEJO DE BOTONES "Siguiente" y "Anterior" ---
    document.querySelectorAll('.btn-next').forEach(button => {
        button.addEventListener('click', () => {
            const nextStep = parseInt(button.dataset.nextStep);
            if (validateStep(currentStep)) {
                showStep(nextStep);
            }
        });
    });

    document.querySelectorAll('.btn-prev').forEach(button => {
        button.addEventListener('click', () => {
            const prevStep = parseInt(button.dataset.prevStep);
            showStep(prevStep);
        });
    });

    // --- TAREA CLAVE: VALIDACIÓN DE CAMPOS Y PASOS ---
    function validateStep(step) {
        if (step === 1) {
            // Validar campos obligatorios (Nombre, Especie, Raza)
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
            // Validar de 1 a 10 fotos
            const fileCount = photosInput.files.length;
            if (fileCount < 1 || fileCount > 10) {
                photoError.textContent = `Debes subir entre 1 y 10 fotos. Actualmente tienes ${fileCount}.`;
                photoError.style.display = 'block';
                return false;
            }
            photoError.style.display = 'none';
            return true;
        }
        
        // Los pasos 3 y 4 son opcionales para avanzar.
        return true;
    }

    // --- TAREA CLAVE: FUNCIONALIDAD DE FOTOS ---
    photosInput.addEventListener('change', () => {
        const files = photosInput.files;
        const fileCount = files.length;
        const previewGrid = document.getElementById('photo-preview-grid');
        
        // 1. Contador visual (X/10)
        photoCountSpan.textContent = `(${fileCount}/10)`;
        
        // 2. Validación en tiempo real (oculta/muestra error)
        if (fileCount < 1 || fileCount > 10) {
            photoError.textContent = `Número de fotos inválido (${fileCount}). Mínimo 1, Máximo 10.`;
            photoError.style.display = 'block';
        } else {
            photoError.style.display = 'none';
        }

        // 3. Renderizar vista previa (Placeholder y Grid)
        previewGrid.innerHTML = ''; // Limpiar previsualizaciones anteriores

        if (fileCount > 0) {
            Array.from(files).slice(0, 10).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('photo-placeholder');
                    if (index === 0) {
                        imgContainer.classList.add('main-photo-placeholder');
                    }
                    imgContainer.style.backgroundImage = `url(${e.target.result})`;
                    
                    previewGrid.appendChild(imgContainer);
                };
                reader.readAsDataURL(file);
            });
        } else {
            // Placeholder si no hay fotos
            previewGrid.innerHTML = `<div class="photo-placeholder main-photo-placeholder">
                                         <span class="placeholder-text">Foto Principal</span>
                                     </div>`;
        }
    });

    // --- GENERAR RESUMEN PARA PASO 5 ---
    function generateSummary() {
        const summaryDiv = document.getElementById('profile-summary');
        const formData = new FormData(form);
        let summaryHTML = '<h3>Datos Básicos:</h3><ul>';

        // Recorre los datos del formulario (excepto las fotos)
        for (let [key, value] of formData.entries()) {
            // Excluye fotos y valores vacíos para un resumen limpio
            if (key !== 'fotos' && value.trim()) {
                let keyText = key.replace(/_/g, ' ').toUpperCase();
                summaryHTML += `<li><strong>${keyText}:</strong> ${value}</li>`;
            }
        }
        
        summaryHTML += '</ul>';
        
        // Añade el conteo de fotos
        const fileCount = photosInput.files.length;
        summaryHTML += `<br><h3>Fotos:</h3><p>${fileCount} foto(s) subida(s) correctamente.</p>`;

        summaryDiv.innerHTML = summaryHTML;
    }


    // --- MANEJO FINAL DEL ENVÍO DEL FORMULARIO ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // 1. Validar el paso de fotos antes de enviar
        if (!validateStep(2)) {
             alert('Por favor, corrige la cantidad de fotos antes de enviar.');
             showStep(2);
             return;
        }
        
        alert('Enviando datos... (Se debería implementar la lógica de Fetch/API aquí)');

        // Aquí iría el código para enviar 'new FormData(form)' a tu servidor o API.
        // Después de un envío exitoso, normalmente redirigirías al usuario.
        // window.location.href = 'mis_mascotas.html'; 
    });
    
    // Inicia en el primer paso al cargar la página
    showStep(1);
});