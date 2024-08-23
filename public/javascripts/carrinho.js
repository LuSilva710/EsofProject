document.addEventListener("DOMContentLoaded", function() {
    let menu = document.querySelector('#menu-bars');
    let navbar = document.querySelector('.navbar');

    menu.onclick = () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    };

    let section = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('header .navbar a');

    window.onscroll = () => {
        menu.classList.remove('fa-times');
        navbar.classList.remove('active');

        section.forEach(sec => {
            let top = window.scrollY;
            let height = sec.offsetHeight;
            let offset = sec.offsetTop - 150;
            let id = sec.getAttribute('id');
    
            if (top >= offset && top < offset + height) {
                navLinks.forEach(links => {
                    if (links) { // Verifique se links não é null
                        links.classList.remove('active');
                        const activeLink = document.querySelector('header .navbar a[href*=' + id + ']');
                        if (activeLink) { // Verifique se activeLink não é null
                            activeLink.classList.add('active');
                        }
                    }
                });
            }
        });
    };
});

// function adicionarAoCarrinho(titulo) {
//     // Obtém o valor atual do campo de texto
//     var valorAtual = document.getElementById("pedidoInput").value;
  
//     // Verifica se já existem títulos no campo de texto
//     if (valorAtual) {
//       // Verifica se o título já existe no campo de texto
//       var regex = new RegExp(titulo + " \\((\\d+)\\)", "i");
//       var tituloExistente = valorAtual.match(regex);
  
//       if (tituloExistente) {
//         // Obtém a quantidade atual do título existente
//         var quantidadeAtual = parseInt(tituloExistente[1]);
  
//         // Incrementa a quantidade atual
//         quantidadeAtual++;
  
//         // Atualiza o título existente com a quantidade atualizada
//         var novoTitulo = titulo + " (" + quantidadeAtual + ")";
//         var novoValor = valorAtual.replace(regex, novoTitulo);
//         document.getElementById("pedidoInput").value = novoValor;
//       } else {
//         // Se o título não existe, adiciona o novo título ao campo de texto
//         var novoTitulo = titulo + " (1)";
//         var novoValor = valorAtual + "\n" + novoTitulo;
//         document.getElementById("pedidoInput").value = novoValor;
//       }
//     } else {
//       // Caso não haja títulos existentes, define apenas o novo título
//       document.getElementById("pedidoInput").value = titulo + " (1)";
//     }
    
//   }

// function adicionarAoCarrinho(titulo) {
//     // Exemplo de como armazenar o item no localStorage (pode ser adaptado conforme necessário)
//     let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
//     carrinho.push(titulo);
//     localStorage.setItem('carrinho', JSON.stringify(carrinho));

//     // Redireciona para a página do carrinho
//     window.location.href = '/carrinho';
// }

function adicionarAoCarrinho(titulo, preco, imagem) {
    console.log('Título:', titulo, 'Preço:', preco, 'Imagem:', imagem);
    // Cria um objeto de produto
    const produto = { titulo, preco, imagem, quantidade: 1 };

    // Obtém os produtos do localStorage ou cria um novo array
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Verifica se o produto já está no carrinho
    const index = carrinho.findIndex(item => item.titulo === titulo);
    if (index > -1) {
        // Se já estiver, incrementa a quantidade
        carrinho[index].quantidade++;
    } else {
        // Caso contrário, adiciona o novo produto
        carrinho.push(produto);
    }

    // Salva o carrinho atualizado no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Função para preencher a tabela do carrinho ao carregar a página
function preencherCarrinho() {
    const carrinho = localStorage.getItem('pedidos') || {};
    const tbody = document.querySelector('tbody');
    console.log(pedidos)
    // Limpa a tabela antes de preencher
    tbody.innerHTML = '';

    let subtotal = 0;

    // Percorre os produtos do carrinho e adiciona à tabela
    carrinho.forEach(item => {
        if (item.valor && !isNaN(item.valor)) { // Verifica se o preço é válido
            const total = item.valor * item.quantidade;
            subtotal += total;

        const tr = document.createElement('tr');
        tr.innerHTML = `
             <td>
                <div class="product">
                    <img style="width: 120px; height: 100px;" src="${item.imagem}" alt="">
                    <div class="info">
                        <div class="name">${item.nome}</div>
                        <div class="category">Categoria</div>
                    </div>
                </div>
            </td>
            <td>R$${item.valor}</td>
            <td>
                <div class="qty">
                    <button onclick="alterarQuantidade('${item.nome}', -1)"><i class='bx bx-minus'></i></button>
                    <span>${item.quantidade}</span>
                    <button onclick="alterarQuantidade('${item.nome}', 1)"><i class='bx bx-plus'></i></button>
                </div>
            </td>
            <td>R$${total.toFixed(2)}</td>
            <td>
                <button class="remove" onclick="removerDoCarrinho('${item.nome}')"><i class='bx bx-x'></i></button>
            </td>
        `;
        tbody.appendChild(tr);
        }
    });

    // Atualiza o subtotal
    document.querySelector('.info div:nth-child(1) span:nth-child(2)').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.querySelector('footer span:nth-child(2)').textContent = `R$${subtotal.toFixed(2)}`;
}

// Função para alterar a quantidade do produto
function alterarQuantidade(titulo, operacao) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const index = carrinho.findIndex(item => item.titulo === titulo);

    if (index > -1) {
        if (operacao === 1) {
            carrinho[index].quantidade++;
        } else if (operacao === -1 && carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
        } else if (operacao === -1 && carrinho[index].quantidade === 1) {
            removerDoCarrinho(titulo);
            return;
        }
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        preencherCarrinho();
    }
}

// Função para remover um produto do carrinho
function removerDoCarrinho(titulo) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho = carrinho.filter(item => item.titulo !== titulo);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    preencherCarrinho();
}

// Preenche o carrinho ao carregar a página
window.onload = preencherCarrinho;
