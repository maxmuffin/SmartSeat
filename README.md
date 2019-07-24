# SmartSeat App
App for iOS and Android for SmartSeat tool @unibo
<div style="text-align:center">
  <img src="SmartSeatApp/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png" width="120">
</div>

Smart Seat è un cuscino che riconosce la postura corretta. Ciò è possibile in quanto all’interno del cuscino sono presenti celle di carico integrate che rilevano la pressione che l’utente assume su di esso quando è seduto. Il sistema è connesso wireless con un server che si occupa della memorizzazione e dell’elaborazione dei dati rilevati dai sensori, nonchè di estrapolare lo stato della postura attraverso un algoritmo di Machine Learning.
L’utente può monitorare lo stato della propria postura in real-time attraverso un applicazione mobile direttamente dal proprio smartphone.

Smart Seat riconosce **3 stati**:
- Postura corretta
- Postura scorretta
- Non seduto

L’applicazione, oltre a segnalare all’utente lo stato attuale del cuscino, fornisce una cronologia giornaliera delle posture assunte tramite grafici a linee e torta.

Inoltre è presente un ulteriore grafico a linee in cui viene visualizzata una stima settimanale, raggruppata per giorni, dei minuti totali giornalieri trascorsi in ciascuno degli stati elencati sopra.

#### Screen app
<div style="text-align:center">
  <img src="SmartSeatApp/images/ScreenApp1.png" width="350">
  <img src="SmartSeatApp/images/ScreenApp2.png" width="350" >
</div>

#### Run on Android

```console
 react-native run-android
```
#### Run on iOS

```console
 react-native run-ios
```
