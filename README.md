# 🃏 Jogo do Burro — Multiplayer via Bluetooth

Aplicativo mobile multiplayer do jogo de cartas **Burro**, desenvolvido para funcionar entre dispositivos móveis utilizando **Bluetooth**, sem necessidade de conexão com a internet durante a partida.

---

## 🎓 Curso

**Curso:** Informática para Internet — Ensino Médio Integrado  
**Instituição:** Senac  
**Turma:** 3ª A EMI Informática para Internet

Aplicativo mobile em Vue 3, Ionic e Capacitor. O jogo funciona offline e permite criar ou entrar em partidas com 2 a 6 jogadores.

## Executar no navegador

```bash
npm install
npm run dev
```

Para testar a partida simulada:

1. Informe seu nome e crie uma sala.
2. Clique em **Simular jogador próximo**.
3. Aceite a Ana.
4. Comece a partida.
5. Envie uma carta. A Ana pensa por alguns instantes, devolve uma carta automaticamente e sua vez retorna.
6. Depois de três trocas, a partida termina e é salva no histórico.

O modo simulado existe apenas no navegador. Ele não chama APIs Bluetooth nativas.

## Android Studio

O projeto Android está em `android/`.

```bash
npm run build
npx cap sync android
npx cap open android
```

Para gerar o APK debug:

```bash
cd android
gradlew.bat assembleDebug
```

APK gerado em `android/app/build/outputs/apk/debug/app-debug.apk`.

Teste o Bluetooth em dois celulares físicos, com Bluetooth ligado. O emulador não é adequado para validar BLE.

## Bluetooth real

O app usa `@capgo/capacitor-bluetooth-low-energy`, pois a partida precisa que um celular atue como periférico/anfitrião e os demais como centrais. O anfitrião anuncia o serviço GATT `7b8b4f70-6d2d-4c43-9c4f-0a6e4f6f1000`; os jogadores escaneiam, conectam e enviam solicitações de entrada.

As mensagens usam JSON versionado e são validadas antes de alterar o estado:

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
```

No Android 12+, o manifesto solicita `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT` e `BLUETOOTH_ADVERTISE`. Em versões antigas, também são declaradas as permissões Bluetooth legadas e localização.

## Regras adotadas

- Cada jogador recebe quatro cartas.
- O objetivo é formar quatro cartas do mesmo valor.
- A carta escolhida é enviada ao próximo jogador na ordem da sala.
- O anfitrião valida a entrada e inicia a partida com pelo menos dois jogadores.
- A mão de cada jogador é enviada apenas para sua conexão BLE.
- A partida é encerrada quando um jogador completa o objetivo; a demonstração web usa três trocas para facilitar a apresentação.
- O resultado registra vencedor, penalizado, participantes, ordem, rodadas, datas e motivo.

## Persistência e testes

O histórico é salvo localmente e permanece depois de fechar e abrir o app. A interface permite abrir detalhes, excluir uma partida e limpar tudo com confirmação. O plugin `@capacitor-community/sqlite` está instalado para a persistência SQLite nativa; a implementação atual usa `localStorage`, que atende ao funcionamento web/offline.

```bash
npm test
npm run build
```

## Estrutura

- `src/App.vue`: telas e fluxo da partida.
- `src/game/game.ts`: tipos e regras do jogo.
- `src/game/game.test.ts`: testes automatizados.
- `src/bluetooth/ble.ts`: permissões, advertising, scan, GATT e mensagens.
- `android/`: projeto nativo para Android Studio.
