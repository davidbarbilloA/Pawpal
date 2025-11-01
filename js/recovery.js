// recovery.js

// Variables globales
let userIdentifier = '';
let verificationCode = '';
let timerInterval = null;
let timeRemaining = 300; // 5 minutos en segundos

// Elementos del DOM
const codeInputs = document.querySelectorAll('.code-input');

// ============================================
// PASO 1: SOLICITAR CÓDIGO
// ============================================
document.getElementById('requestForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const identifier = document.getElementById('identifier').value.trim();
  const btnRequest = document.getElementById('btnRequest');
  const message = document.getElementById('message1');

  if (!identifier) {
    showMessage(message, 'Por favor ingresa tu correo o teléfono', 'error');
    return;
  }

  btnRequest.disabled = true;
  btnRequest.innerHTML = 'Enviando...<span class="loading"></span>';

  // Simulación de envío de código (aquí conectarías con tu backend)
  // En producción: await fetch('/api/recovery/send-code', { method: 'POST', body: JSON.stringify({ identifier }) })
  setTimeout(() => {
    // Generar código aleatorio de 6 dígitos
    verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    userIdentifier = identifier;
    
    console.log('Código generado:', verificationCode); // Para pruebas - ELIMINAR EN PRODUCCIÓN
    
    showMessage(message, 'Código enviado exitosamente. Revisa tu correo o mensajes.', 'success');
    
    setTimeout(() => {
      goToStep2();
    }, 1500);
    
    btnRequest.disabled = false;
    btnRequest.textContent = 'Enviar código';
  }, 2000);
});

// ============================================
// PASO 2: VERIFICAR CÓDIGO
// ============================================

// Manejo de inputs de código
codeInputs.forEach((input, index) => {
  input.addEventListener('input', function(e) {
    const value = e.target.value;
    
    // Solo permitir números
    if (!/^\d*$/.test(value)) {
      e.target.value = '';
      return;
    }

    // Mover al siguiente input
    if (value.length === 1 && index < codeInputs.length - 1) {
      codeInputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', function(e) {
    // Retroceder con backspace
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      codeInputs[index - 1].focus();
    }
  });

  // Permitir pegar código completo
  input.addEventListener('paste', function(e) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      pastedData.split('').forEach((digit, i) => {
        if (codeInputs[i]) {
          codeInputs[i].value = digit;
        }
      });
      codeInputs[5].focus();
    }
  });
});

// Verificar código
document.getElementById('verifyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
  const btnVerify = document.getElementById('btnVerify');
  const message = document.getElementById('message2');

  if (enteredCode.length !== 6) {
    showMessage(message, 'Por favor ingresa los 6 dígitos del código', 'error');
    return;
  }

  btnVerify.disabled = true;
  btnVerify.innerHTML = 'Verificando...<span class="loading"></span>';

  // Simulación de verificación (aquí conectarías con tu backend)
  // En producción: await fetch('/api/recovery/verify-code', { method: 'POST', body: JSON.stringify({ code: enteredCode }) })
  setTimeout(() => {
    if (enteredCode === verificationCode) {
      showMessage(message, '¡Código verificado correctamente!', 'success');
      
      setTimeout(() => {
        goToStep3();
      }, 1000);
    } else {
      showMessage(message, 'Código incorrecto. Por favor intenta de nuevo.', 'error');
      codeInputs.forEach(input => input.value = '');
      codeInputs[0].focus();
    }
    
    btnVerify.disabled = false;
    btnVerify.textContent = 'Verificar código';
  }, 1500);
});

// Reenviar código
document.getElementById('resendCode').addEventListener('click', function(e) {
  e.preventDefault();
  
  const message = document.getElementById('message2');
  
  // Generar nuevo código
  verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Nuevo código:', verificationCode); // Para pruebas - ELIMINAR EN PRODUCCIÓN
  
  showMessage(message, 'Código reenviado exitosamente', 'success');
  
  // Reiniciar inputs y timer
  codeInputs.forEach(input => input.value = '');
  codeInputs[0].focus();
  document.getElementById('btnVerify').disabled = false;
  clearInterval(timerInterval);
  startTimer();
});

// Volver al paso 1
document.getElementById('backToStep1').addEventListener('click', function(e) {
  e.preventDefault();
  clearInterval(timerInterval);
  document.getElementById('step2').classList.add('step-hidden');
  document.getElementById('step1').classList.remove('step-hidden');
  document.getElementById('identifier').focus();
});

// ============================================
// PASO 3: CAMBIAR CONTRASEÑA
// ============================================
document.getElementById('resetForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const btnReset = document.getElementById('btnReset');
  const message = document.getElementById('message3');

  // Validar contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  
  if (!passwordRegex.test(newPassword)) {
    showMessage(message, 'La contraseña no cumple con los requisitos de seguridad', 'error');
    return;
  }

  if (newPassword !== confirmPassword) {
    showMessage(message, 'Las contraseñas no coinciden', 'error');
    return;
  }

  btnReset.disabled = true;
  btnReset.innerHTML = 'Cambiando contraseña...<span class="loading"></span>';

  // Simulación de cambio de contraseña (aquí conectarías con tu backend)
  // En producción: await fetch('/api/recovery/reset-password', { method: 'POST', body: JSON.stringify({ password: newPassword }) })
  setTimeout(() => {
    showMessage(message, '¡Contraseña cambiada exitosamente!', 'success');
    
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    
    btnReset.disabled = false;
    btnReset.textContent = 'Cambiar contraseña';
  }, 2000);
});

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function goToStep2() {
  document.getElementById('step1').classList.add('step-hidden');
  document.getElementById('step2').classList.remove('step-hidden');
  document.getElementById('sentTo').textContent = maskIdentifier(userIdentifier);
  codeInputs[0].focus();
  startTimer();
}

function goToStep3() {
  clearInterval(timerInterval);
  document.getElementById('step2').classList.add('step-hidden');
  document.getElementById('step3').classList.remove('step-hidden');
  document.getElementById('newPassword').focus();
}

function maskIdentifier(identifier) {
  if (identifier.includes('@')) {
    // Enmascarar email
    const parts = identifier.split('@');
    const masked = parts[0].substring(0, 2) + '***' + '@' + parts[1];
    return masked;
  } else {
    // Enmascarar teléfono
    return identifier.substring(0, 4) + '***' + identifier.substring(identifier.length - 2);
  }
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = 'message ' + type;
  
  setTimeout(() => {
    element.className = 'message';
  }, 5000);
}

function startTimer() {
  timeRemaining = 300; // 5 minutos
  const timerElement = document.getElementById('timer');
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    timerElement.innerHTML = `Código válido por: <strong>${minutes}:${seconds.toString().padStart(2, '0')}</strong>`;
    
    if (timeRemaining <= 60) {
      timerElement.classList.add('expired');
    }
    
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerElement.innerHTML = '<strong>Código expirado</strong>';
      document.getElementById('btnVerify').disabled = true;
    }
  }, 1000);
}