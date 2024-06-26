$(document).ready(function() {
  
/********************* FILTRAGEM ************************/
  $('.filter-button').on('click', function() {
    const category = $(this).data('category');

    if (category === 'all') {
      $('.sub-item').show();
    } else {
      $('.sub-item').hide();
      $(`.${category}`).show();
    }
  });


/********************* EXPANDIR/CONTRAIR DIV ************************/
  $(".toggle-button").click(function(e) {
    e.preventDefault();
    const content = $(this).siblings(".conteudo_expandido");
    content.slideToggle();
    const buttonText = $(this).text();
    $(this).text(buttonText === "Ver mais..." ? "Ver menos..." : "Ver mais...");
  });


/*********************  LINKS ANCORA ************************/
// Manipular o clique nos links da classe "scroll-link"
$('.scroll-link').click(function(e) {
  e.preventDefault();

  // Remover a classe 'show-menu' do elemento <body>
  $('body').removeClass('show-menu');

  // Obter o ID da seção alvo com base no atributo "data-section" do link
  var targetSectionId = $(this).data('section');

  // Atraso de 0.22 segundos antes de rolar suavemente para a seção alvo
  setTimeout(function() {
    $('#' + targetSectionId).get(0).scrollIntoView({
      behavior: 'smooth'
    });
  }, 400);
});

/*********************  BOTAO PARA VOLTAR AO INICIO ************************/
$('#top-link').on('click', function(e) {
  e.preventDefault();

  // Scroll suave para o topo da página usando jQuery
  $('html, body, .content').animate({ scrollTop: 0 }, 'slow');
});


/*********************  LOGICA PARA ENVIO DE MENSAGENS ************************/
// Captura o evento de submit do formulário
$("form").submit(function(event) {
  // Evita o comportamento padrão de enviar o formulário
  event.preventDefault();

  // Verifica se o campo "remetente" está preenchido com um email válido
  var remetenteValue = $("#remetente").val().trim();
  if (!isValidEmail(remetenteValue)) {
    // Mostra uma mensagem de erro na div "resultado"
    $("#resultado").html("<div class='div_alerta'><div class='icon-div div_alerta botao_erro'><i class='fa-solid fa-circle-xmark'></i><div class='middle-content'><span>Por favor, insira um email válido no campo E-Mail.</span></div> <i class='btn fa-solid fa-xmark d-block' id='limparErros'></i></div></div>");
    return; // Impede o envio do formulário
  }

  // Remover a classe d-none para mostrar o loader e esconder o resultado
  $(".loader").removeClass("d-none");
  $("#resultado").addClass("d-none");

  // Faz a requisição AJAX para processa_envio.php
  $.ajax({
    type: "POST",
    url: "processa_envio.php",
    data: $(this).serialize(), // Serializa os dados do formulário
    success: function(response) {
      // Atualiza a div "resultado" com a resposta do servidor
      $("#resultado").html(response);

      // Verifica se a div com a classe 'botao_sucesso' existe na resposta do servidor
      if ($("#resultado .botao_sucesso").length) {
        // Limpar o conteúdo do formulário apenas se der "sucesso"
        $("form")[0].reset();
      }

      // Adicionar a classe d-none para esconder o loader após a resposta e mostrar o resultado
      $(".loader").addClass("d-none");
      $("#resultado").removeClass("d-none");

      setTimeout(function() {
        var divAlerta = document.querySelector(".div_alerta");
        if (divAlerta) {
          divAlerta.remove();
        }
      }, 6000); // 6000 milissegundos = 6 segundos
    }
  });
});

// Função para validar o formato do email usando uma expressão regular
function isValidEmail(email) {
  var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
}


$("#open-button").on("click", function() {
  var iconElement = $(this).find("i.menu-button");
  if (iconElement.hasClass("fa-bars")) {
    // Se a classe for "fa-bars", altere para "fa-x"
    iconElement.removeClass("fa-bars").addClass("fa-x");
  } else {
    // Se a classe não for "fa-bars" (ou seja, é "fa-x"), altere para "fa-bars"
    iconElement.removeClass("fa-x").addClass("fa-bars");
  }
});


// testando se o campo está preenchido para remover a mensagem de erro
  $("#meuFormulario").submit(function (event) {
  event.preventDefault();

  const campos = [
    { nome: "remetente", placeholder: "E-Mail" },
    { nome: "nome", placeholder: "Nome" },
    { nome: "assunto", placeholder: "Assunto do e-mail" },
    { nome: "mensagem", placeholder: "Mensagem" }
  ];

  campos.forEach(function (campoInfo) {
    const campo = $(`[name="${campoInfo.nome}"]`);
    const erroSpan = $(`#erro-${campoInfo.nome}`);
    const formGroup = campo.closest(".form-control"); // Encontra o elemento pai com a classe form-group

    if (campo.val().trim() === "") {
      erroSpan.removeClass("d-none");
      formGroup.addClass("has-error"); // Adiciona a classe de erro
    } else {
      erroSpan.addClass("d-none");
      formGroup.removeClass("has-error"); // Remove a classe de erro
    }
  });

  const errosVisiveis = $(".campo-erro:not(.d-none)");
  if (errosVisiveis.length === 0) {
    // Todos os campos foram preenchidos corretamente, você pode prosseguir com o envio do formulário.
    // Exemplo: $("#meuFormulario").unbind("submit").submit();
  }
  });


$(document).on("click", "#limparErros", function () {
  $(".campo-erro").addClass("d-none"); // Adiciona a classe d-none a todos os spans de erro
  $(".form-control").removeClass("has-error"); // Remove a classe has-error de todos os elementos com a classe form-control
  $(".icon-div.botao_campo_vazio").remove(); // Remove a div com a classe "icon-div botao_campo_vazio"
});


$(document).on("click", ".icon-div i", function () {
  $(".div_alerta").remove();
});


/*********************  ROLAR CONTEÚDO DE PROJETOS ************************/
  var container = $(".container-projetos");
  var isDragging = false;
  var startX, scrollLeft;

  container.on("mousedown", function(e) {
    isDragging = true;
    startX = e.pageX - container.offset().left;
    scrollLeft = container.scrollLeft();
  });

  $(document).on("mouseup", function() {
    isDragging = false;
  });

  $(document).on("mouseleave", function() {
    isDragging = false;
  });

  $(document).on("mousemove", function(e) {
    if (!isDragging) return;
    e.preventDefault();
    var x = e.pageX - container.offset().left;
    var walk = (x - startX) * 3; // Ajuste esse valor para controlar a velocidade da rolagem
    container.scrollLeft(scrollLeft - walk);
  });

  var container = $(".container-projetos");
  var scrollForwardButton = $("#scrollForward");
  var scrollBackwardButton = $("#scrollBackward");

  scrollForwardButton.on("click", function() {
    container.animate({
      scrollLeft: "+=500"
    }, 400); // Ajuste a duração da animação conforme necessário
  });

  scrollBackwardButton.on("click", function() {
    container.animate({
      scrollLeft: "-=500"
    }, 400); // Ajuste a duração da animação conforme necessário
  });



});
/********************* MENU ************************/

// Função para adicionar ou remover uma classe do elemento
function toggleClass(elem, className) {
  if (elem.classList.contains(className)) {
    elem.classList.remove(className);
  } else {
    elem.classList.add(className);
  }
}

// Função para abrir ou fechar o menu
function toggleMenu() {
  const bodyEl = document.body;
  const content = document.querySelector('.content-wrap');
  const isOpen = bodyEl.classList.contains('show-menu');

  toggleClass(bodyEl, 'show-menu');
  toggleClass(content, 'show-menu');
}

// Inicialização após o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
  const openBtn = document.getElementById('open-button');
  const closeBtn = document.getElementById('close-button');
  const content = document.querySelector('.content-wrap');

  if (openBtn) {
    openBtn.addEventListener('click', toggleMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', toggleMenu);
  }
});

// Função para mudar a class do botão ao fechar o menu
function changeMenuIcon(iconClass) {
  const menuIcon = document.getElementById('menu-icon');
  menuIcon.classList.remove('fa-x');
  menuIcon.classList.add(iconClass);
}
