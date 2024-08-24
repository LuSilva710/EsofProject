document.addEventListener('DOMContentLoaded', function () {
    const botoesPagamento = document.querySelectorAll('.metodo-pagamento button');
    const infoCartao = document.querySelector('.info-cartao');

    botoesPagamento.forEach(botao => {
        botao.addEventListener('click', function () {
            // Remove a classe 'ativo' de todos os botões
            botoesPagamento.forEach(btn => btn.classList.remove('ativo'));

            // Adiciona a classe 'ativo' ao botão clicado
            this.classList.add('ativo');

            // Mostra ou esconde o formulário de cartão de crédito com base no botão clicado
            if (this.getAttribute('data-pagamento') === 'cartao-credito') {
                infoCartao.style.display = 'block';
            } else {
                infoCartao.style.display = 'none';
            }
        });
    });

    const botaoFinalizar = document.getElementById('botao-finalizar');
    botaoFinalizar.addEventListener('click', function () {
        alert('Compra finalizada com sucesso!');
        // Aqui você pode adicionar a lógica para processar o pagamento e salvar os dados do pedido
    });
});
