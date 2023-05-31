class Livro {
  //class é uma palavra reservada em js para class, o tipo da variavel
  constructor(titulo, ano, paginas, autores, descricao, status) {
    //propriedade  - variavel
    this.titulo = titulo;
    this.ano = ano;
    this.paginas = paginas;
    this.autores = autores;
    this.descricao = descricao;
    this.status = status;
  }
}
function montartabela(Lista) {
 
  let auxHtml = ""; //variavel pra ajudar a montar a tela
  for (let i = 0; i < Lista.length; i++) {
    console.log(Lista[i].status)

    auxHtml += `<tr>
                   <td><strong>${Lista[i].titulo}</strong></td>
                   <td>${Lista[i].autores}</td>
                   <td>${Lista[i].paginas}</td>
           
                   <td>
                   <select  id="book-status" rel="${i}" class="form-select">
                   <option  disabled value="">Selecione...</option>
                   <option ${Lista[i].status==="Na Fila"? "selected": ""} value="Na fila">Na fila</option>
                   <option ${Lista[i].status==="Lendo"? "selected": ""} value="Lendo">Lendo</option>
                   <option ${Lista[i].status==="Concluído"? "selected": ""} value="Concluído">Concluído</option>
                   <option ${Lista[i].status==="Pausado"? "selected": ""} value="Pausado">Pausado</option>
                   </select>
        
                   </td>
                   <td>
                   <a href="#" class="btn showDetails" rel="${i}">
                   <img src="assets/details.png"  rel="${i}"/>
                   </td>
                   <td>
                   <a href="#" class="btn deleteBtn" rel="${i}">
                   <img src="assets/delete.png"  rel="${i}"/>
                   </td>
                   </tr>'`;
  }
  return auxHtml;
}
function validar(valor) {
  if (!isNaN(valor) && valor != "") {
    // o usuario tem que inserir um numero para ser verdadeira e ativar a função
    return true;
  } else {
    return false;
  }
}

auxPosicao = "";
biblioteca = []; // array listaprodutos
// adiciona o produto na classe Livro ( codigo, descricao,quantidade, valor)

const storedData = localStorage.getItem("biblioteca");
if (storedData) biblioteca = JSON.parse(storedData);

//localStorage.setItem('biblioteca', "")

$(document).ready(() => {
  //$chama a jquerry e => substitui a function
  $("#tabela").html(montartabela(biblioteca));

  $("#btnSalvar").click(() => {
    $(".hide").addClass("visible");

    let query = $("#searchbar").val();

    if (query) {
      $("#myModal").modal("toggle");
      $("#modal-footer").addClass("visible");
    } else {
      alert("Escreva alguma coisa!");
    }
    let URL = "https://www.googleapis.com/books/v1/volumes?q=" + query;
    $.ajax({
      url: URL.toString(),
      dataType: "json",
      success: function ({ items }) {
        console.log("titulo: ", items[0].volumeInfo.title);
        console.log("Ano de Publicação: ", items[0].volumeInfo.publishedDate);
        console.log("autor(es): ", items[0].volumeInfo.authors.join(", "));
        console.log("Nº de Páginas: ", items[0].volumeInfo.pageCount);

        // console.log("descrição: ",items[0].volumeInfo.description)
        if (items.length > 0) {
          let titulo = items[0].volumeInfo.title;
          let ano = items[0].volumeInfo.publishedDate;
          let paginas = items[0].volumeInfo.pageCount;
          let autores = items[0].volumeInfo.authors.join(", ");
          let descricao = items[0].volumeInfo.description;
          let status = "";
          $("#modal-title").html(titulo);
          $("#book-authors").html(autores);
          $("#book-year").html(ano);
          $("#book-pages").html(paginas);
          $("#book-description").html(descricao);
          let novoLivro = new Livro(
            titulo,
            ano,
            paginas,
            autores,
            descricao,
            status
          );

          $("#btnAddLivro").click(() => {
            if (auxPosicao == "") {
              biblioteca.push(novoLivro);
            } else {
              biblioteca[auxPosicao] = novoLivro;
              auxPosicao = "";
            }
            $("#myModal").modal("toggle");
            localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
            window.location.reload();
          });

          //document.getElementById ('tabela').innerHTML = montartabela(biblioteca);
          $("#tabela").html(montartabela(biblioteca));
          $("input").val(""); //limpa os dados apos inseridos no campo
        }
      }, //end ajax success function
    }); //end ajax call
  });
  $("#tabela").on("change", ".form-select", (evento) => {
    auxPosicao = evento.target.getAttribute("rel");

    console.log(auxPosicao);

    biblioteca[auxPosicao].status = evento.target.value;
    console.log(biblioteca[auxPosicao].status);

    localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
  });
  console.log(biblioteca);
  $("#tabela").on("click", ".deleteBtn", (e) => {
    const index = e.target.getAttribute("rel");
    if (confirm(`${biblioteca[index]?.titulo} será excuído. Tem certeza? `)) {
      biblioteca.splice(index, 1);
      $("#tabela").html(montartabela(biblioteca));
      localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
    }
  });
  $("#btnJson").on("click", () => {
    const lista = JSON.stringify(biblioteca);
    alert(lista);
  });

  $(".showDetails").on("click", (e) => {
    auxPosicao = e.target.getAttribute("rel");
    $("#modal-title").html(biblioteca[auxPosicao]?.titulo);
    $("#book-authors").html(biblioteca[auxPosicao]?.autores);
    $("#book-year").html(biblioteca[auxPosicao]?.ano);
    $("#book-pages").html(biblioteca[auxPosicao]?.paginas);
    $("#book-description").html(biblioteca[auxPosicao]?.descricao);
    $("#myModal").modal("toggle");
    $(".hide").addClass("visually-hidden");
  });

  $(document).on("click", "#cust_btn", function () {
    $("#myModal").modal("toggle");
    window.location.reload();
  });
});

