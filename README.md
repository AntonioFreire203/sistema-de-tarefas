# Estrutura do projeto

## Arquitetura do Projeto



## Comandos Para Rodar o Projeto

1-npm init -y

2-npm install express body-parser jsonwebtoken bcryptjs uuid swagger-ui-express fs-extra

3-npm install --save-dev nodemon


## Casos de Uso do Projeto 

![casos de uso](/pics/caso-de-uso-2.png)


## Entendo a Estrutura do Projeto 


Sim, a gravação e leitura dos arquivos JSON são feitas nos modelos (arquivos na pasta models/), mas são controladas e acionadas pelos controladores (arquivos na pasta controllers/). Essa separação segue o padrão MVC (Model-View-Controller), onde:

    Modelos (models/): Contêm a lógica para acessar e manipular os dados nos arquivos JSON (leitura e escrita).

    Controladores (controllers/): Chamam as funções dos modelos e decidem como manipular os dados com base nas requisições HTTP.
    
    Rotas (routes/): Definem os endpoints e conectam as requisições HTTP aos controladores.