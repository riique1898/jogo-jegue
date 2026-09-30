# Jegue — jogo de cartas offline

Protótipo mobile-first em Vue 3 + TypeScript para o jogo Burro/Jegue. A interface cobre identificação, criação de sala, sala de espera, partida, resultado e histórico local.

## Executar

```bash
npm install
npm run dev
```

Para validar a produção:

```bash
npm run build
```

## Mecânica adotada

Cada jogador recebe quatro cartas e tenta formar quatro cartas de mesmo valor. Em cada rodada, seleciona uma carta e a envia ao jogador seguinte. A partida demonstrativa termina após três trocas para permitir testar rapidamente o resultado e o histórico. A ordem dos jogadores é mantida pela lista da sala, e apenas o anfitrião inicia a partida.

## Persistência e comunicação

O histórico é salvo automaticamente no `localStorage`, incluindo participantes, datas, rodadas, vencedor, penalizado e motivo do encerramento. A versão web usa uma simulação de Bluetooth: “Simular jogador próximo” cria uma solicitação para o anfitrião aceitar. Isso permite demonstrar o fluxo sem hardware.

Para a entrega Android, a camada de transporte deve ser ligada ao plugin [capacitor-community/bluetooth-le](https://github.com/capacitor-community/bluetooth-le). As mensagens previstas são `SOLICITACAO_ENTRADA`, `JOGADOR_ENTROU`, `PARTIDA_INICIADA`, `JOGADA`, `TROCA_REALIZADA`, `JOGADOR_COMPLETOU`, `PARTIDA_FINALIZADA`, `JOGADOR_DESCONECTADO` e `RECONEXAO`. A lógica de domínio está isolada em `src/game/game.ts` para receber esse transporte sem misturar regras e interface.

## Android Studio e Bluetooth real

O projeto agora contém a plataforma `android/` e pode ser aberto diretamente:

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

Também é possível gerar o APK debug com `android/gradlew.bat assembleDebug`. O APK é gerado em `android/app/build/outputs/apk/debug/app-debug.apk`.

O app usa BLE real pelo pacote `@capgo/capacitor-bluetooth-low-energy`, que suporta os papéis central e periférico. O anfitrião cria um GATT service e anuncia a sala; os demais aparelhos escaneiam, conectam e enviam solicitações de entrada. As mensagens são JSON versionadas em uma característica com validação antes de alterar o estado.

No Android 12+, são solicitadas `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT` e `BLUETOOTH_ADVERTISE`; em versões antigas, `BLUETOOTH`, `BLUETOOTH_ADMIN` e localização. O Bluetooth desligado, permissão negada e desconexão são tratados pela interface. Teste em dois aparelhos físicos com Bluetooth ligado; o emulador não é adequado para validar rádio Bluetooth.

O pacote `@capacitor-community/sqlite` já está instalado para a evolução da persistência nativa. O histórico atual usa `localStorage`, que atende à persistência local e também funciona no navegador; a migração para SQLite pode ser feita sem mudar o modelo de `GameRecord`.

## Testes

```bash
npm test
```

Os testes cobrem turno inicial, distribuição de quatro cartas e detecção de grupo de quatro valores iguais.

## Estrutura

- `src/App.vue`: telas e fluxo da demonstração.
- `src/game/game.ts`: tipos e regras independentes da UI.
- `src/style.css`: identidade visual responsiva para celular.
- `src/bluetooth/ble.ts`: permissões, advertising, scan, conexão GATT e mensagens BLE.
- `src/game/game.test.ts`: testes automatizados da lógica.
- `android/`: projeto nativo importável no Android Studio.
