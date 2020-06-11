<h1 align="center">
    <strong>Desafio - Chat TCP</strong>
    <br />
    <br />
  <img alt="Fastfeet" title="Fastfeet" src=".github/tcp.png" width="300px" />
</h1>

## Sobre o projeto

Este projeto tem por objetivo apresentar uma implementação de um chat utilizando protocolo TCP/IP

O projeto foi desenvolvido e disponibilizado em duas partes: o servidor e o cliente.

## Para testar o projeto

Faça o clone do repositório
```bash
git clone git@github.com:valdirmendesgt/chat-challenge.git
```

### Server

Ao startar o servidor, a aplicação vai ficar aguardando novas conexões.

Ao entrar uma nova conexão, é solicitado o apelido do usuário e o mesmo é adicionado na sala geral;

Uma vez adicionado à sala, o usuário tem as funcionalidades a seguir:

|Comando                  | Descrição                                   
|-------------------------|---------------------------------------------
| texto livre             | Mensagem pública para todos os usuários - Broadcast
| /to {usuario} mensagem  | Mensagem pública para um usuário específico - Broadcast
| /p {usuario} mensagem   | Mensagem privada para um usuário específico
| /disconnect             | Disconecta o usuário do chat          
| /help                   | Exibe todos os comandos possíveis

#### Dependências
Para execução do projeto, abra a pasta **server** e instale as dependências do projeto com o comando abaixo:

```bash
yarn install
```

#### Rodando os testes unitários

```bash
yarn test
```

#### Iniciando o server

```bash
yarn start
```

### Client

Se conecta à um servidor ativo do chat na rede local, utilizando a porta padrão 4000
    
```bash
yarn install
```

#### Dependências
Para execução do projeto, abra a pasta **client** e instale as dependências do projeto com o comando abaixo:

#### Iniciando o client

```bash
yarn start
```

## :page_facing_up: Licença de uso

Esse projeto está sob a licença MIT detalhada no arquivo [LICENSE](LICENSE).