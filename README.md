# 🃏 Jogo do Burro — Multiplayer via Bluetooth

Aplicativo mobile multiplayer do jogo de cartas **Burro**, desenvolvido para funcionar entre dispositivos móveis utilizando **Bluetooth**, sem necessidade de conexão com a internet durante a partida.

---

## 🎓 Curso

**Curso:** Informática para Internet — Ensino Médio Integrado  
**Instituição:** Senac  
**Turma:** 3ª A EMI Informática para Internet

---

## 📚 UCs e Indicadores envolvidos

### UCs

- Desenvolvimento de aplicações para dispositivos móveis
- Codificar aplicações para dispositivos móveis
- Publicar aplicações para dispositivos móveis
- Segurança e Cyberlinguagem

### Indicadores

- Desenvolvimento de aplicações mobile utilizando tecnologias atuais.
- Implementação de comunicação entre dispositivos.
- Desenvolvimento de interfaces responsivas para dispositivos móveis.
- Utilização de armazenamento local.
- Implementação e testes de funcionalidades.
- Organização e versionamento de código utilizando Git e GitHub.

---

## 👥 Integrantes

| Integrante | GitHub |
|---|---|
| Henrique Schenkel Araújo | [@riique1898](https://github.com/riique1898) |

---

# 🎮 Sobre o projeto

O **Jogo do Burro** é um jogo de cartas multiplayer desenvolvido para dispositivos móveis.

O projeto tem como objetivo permitir que dois ou mais jogadores participem da mesma partida utilizando **Bluetooth**, sem depender de uma conexão com a internet.

A aplicação utiliza:

- Vue 3
- Ionic Framework
- Capacitor
- TypeScript
- Bluetooth
- Armazenamento local

A comunicação entre os dispositivos permite sincronizar as ações realizadas durante a partida.

---

# 🃏 Como o jogo funciona

O jogo precisa de no mínimo **2 jogadores**, sendo recomendado suporte para até **6 jogadores**.

Um dos jogadores atua como **anfitrião da partida**.

Cada jogador recebe **4 cartas**.

O objetivo é conseguir formar um grupo de **4 cartas do mesmo valor**.

Durante cada rodada:

1. O jogador escolhe uma carta da sua mão.
2. A carta é enviada para o próximo jogador.
3. O jogador recebe uma carta do jogador anterior.
4. O sistema atualiza as mãos dos jogadores.
5. O turno passa de acordo com a ordem definida na partida.

Quando um jogador consegue formar quatro cartas iguais, ele indica que completou seu objetivo.

A partida identifica o vencedor e o jogador penalizado conforme as regras implementadas.

A penalização pode ser representada pelas letras da palavra:

> **B U R R O**

A partida termina quando a condição de encerramento definida pelo jogo é atingida.

---

# 📱 Como jogar

## 1. Identificação

Ao abrir o aplicativo, o jogador informa seu nome.

O sistema atribui um identificador único ao jogador dentro da partida.

## 2. Criar uma partida

Um jogador pode criar uma nova partida.

Esse jogador será definido como o **anfitrião**.

## 3. Entrar em uma partida

Os outros jogadores procuram partidas disponíveis através do Bluetooth.

O jogador solicita a entrada e o anfitrião pode aceitar ou recusar.

## 4. Sala de espera

Antes de iniciar a partida, os jogadores conectados aparecem na sala de espera.

A partida pode ser iniciada quando houver pelo menos **2 jogadores**.

## 5. Início da partida

O sistema embaralha e distribui as cartas automaticamente.

Cada jogador consegue visualizar somente suas próprias cartas.

## 6. Troca de cartas

Durante seu turno, o jogador seleciona uma carta e confirma a jogada.

A carta é enviada para o próximo jogador e uma nova carta é recebida do jogador anterior.

## 7. Vitória

Quando um jogador formar quatro cartas do mesmo valor, o sistema identifica a conclusão do objetivo.

Ao finalizar a partida, o aplicativo apresenta o resultado.

---

# 📡 Comunicação Bluetooth

A comunicação entre os dispositivos é realizada através de Bluetooth.

O projeto utiliza mensagens estruturadas para representar os eventos da partida.

### Tipos de mensagens

```text
SOLICITACAO_ENTRADA
JOGADOR_ENTROU
PARTIDA_INICIADA
JOGADA
TROCA_REALIZADA
JOGADOR_COMPLETOU
PARTIDA_FINALIZADA
JOGADOR_DESCONECTADO
RECONEXAO