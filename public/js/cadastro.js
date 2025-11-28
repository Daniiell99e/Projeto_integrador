
// Mostra senha

const input = document.getElementById("input-password")
const toggle = document.querySelector(".icons")

toggle.addEventListener('click' , () => {
    if (input.type === "password") {
        input.type = "text"
        toggle.src = "/logos/icons/eye-off.svg" 
    } else {
        input.type = "password"
        toggle.src = "/logos/icons/eye.svg"
    }




 })

 const inputConfirm = document.getElementById("input-confirm-password")
 const toggleConfirm = document.querySelectorAll(".icons")[1]

    toggleConfirm.addEventListener('click' , () => {
        if (inputConfirm.type === "password") {
            inputConfirm.type = "text"
            toggleConfirm.src = "/logos/icons/eye-off.svg" 
        } else {
            inputConfirm.type = "password"
            toggleConfirm.src = "/logos/icons/eye.svg"
        }   




    })

document.addEventListener('DOMContentLoaded', () => {

    
    const formCadastro = document.getElementById('form-cadastro');
    const formVerification = document.getElementById('form-verification');
    const stepSignup = document.getElementById('step-signup');
    const stepVerification = document.getElementById('step-verification');
    const feedbackMessage = document.getElementById('feedback-message');
    const emailDisplay = document.getElementById('email-display');

    const nameInput = document.getElementById('name');
    const userNameInput = document.getElementById('user_name');
    const emailInput = document.getElementById('input-email');
    const passwordInput = document.getElementById('input-password');
    const confirmPassInput = document.getElementById('input-confirm-password');
    const codeInput = document.getElementById('code');

    const API_BASE_URL = 'http://localhost:3333'; 

    const showMessage = (msg, type = 'error') => {
        feedbackMessage.textContent = msg;
        feedbackMessage.style.display = 'block';
        feedbackMessage.style.color = type === 'error' ? 'red' : 'green';
    };

    const clearMessage = () => {
        feedbackMessage.style.display = 'none';
    };

    const isValidEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    };

    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash'); // Olho fechado
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye'); // Olho aberto
            }
        });
    });

    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessage();

        if (!isValidEmail(emailInput.value)) {
            showMessage('Por favor, insira um endereço de e-mail válido.');
            return;
        }

        if (passwordInput.value !== confirmPassInput.value) {
            showMessage('As senhas não conferem.');
            return;
        }

        const btnCadastrar = document.getElementById('btn-cadastrar');
        btnCadastrar.disabled = true;
        btnCadastrar.textContent = 'Enviando...';

        const payload = {
            name: nameInput.value,
            user_name: userNameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/createuserverify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Código enviado para seu e-mail!', 'success');
                emailDisplay.textContent = emailInput.value;
                stepSignup.classList.add('hidden');
                stepVerification.classList.remove('hidden');
            } else {
                showMessage(data.error || data.message || 'Erro ao cadastrar.');
            }

        } catch (error) {
            console.error(error);
            showMessage('Erro de conexão com o servidor.');
        } finally {
            btnCadastrar.disabled = false;
            btnCadastrar.textContent = 'Cadastrar';
        }
    });

    formVerification.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessage();

        const btnVerificar = document.getElementById('btn-verificar');
        btnVerificar.disabled = true;
        btnVerificar.textContent = 'Verificando...';

        const payload = {
            email: emailInput.value,
            code: codeInput.value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/createuserverifycode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Conta verificada com sucesso! Faça login.');
                window.location.href = '../index.html';
            } else {
                showMessage(data.error || data.message || 'Código inválido.');
            }

        } catch (error) {
            console.error(error);
            showMessage('Erro ao verificar código.');
        } finally {
            btnVerificar.disabled = false;
            btnVerificar.textContent = 'Verificar Código';
        }
    });
});