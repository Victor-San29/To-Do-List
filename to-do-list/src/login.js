function validarLogin(evento) {
    evento.preventDefault();

    const email = document.querySelector('#login-email').value;
    const senha = document.querySelector('#login-senha').value;

    if (email === 'admin@email.com' && senha === '123456') {
        window.location.href = 'index.html';
        return false;
    }

    alert('E-mail ou senha incorretos.');
    return false;
}

function cadastrarUsuario(evento) {
    evento.preventDefault();
    alert('Cadastro de demonstração enviado. Os dados não ficam salvos.');
    evento.target.reset();
    return false;
}
