---
id: bluetooth-classic
parent: bluetooth
label: Bluetooth Classique
explored: false
order: 1
---

# Bluetooth Classique

Le Bluetooth Classique sert pour le transfert de données continu (audio A2DP, SPP) ou les périphériques établissant une connexion persistante. `BluetoothAdapter` liste et connecte les appareils, `BluetoothSocket` ouvre le canal de communication.

```kotlin
class BluetoothViewModel : ViewModel() {
    private val adapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()

    val pairedDevices: StateFlow<List<BluetoothDevice>> = MutableStateFlow(
        adapter?.bondedDevices?.toList() ?: emptyList()
    )

    fun connect(device: BluetoothDevice) {
        viewModelScope.launch(Dispatchers.IO) {
            val uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB") // SPP
            val socket = device.createRfcommSocketToServiceRecord(uuid)
            try {
                adapter?.cancelDiscovery()
                socket.connect()
                val input = socket.inputStream
                val buffer = ByteArray(1024)
                val bytes = input.read(buffer)
                val message = String(buffer, 0, bytes)
                // Traiter le message
            } catch (e: IOException) {
                socket.close()
            }
        }
    }
}

@Composable
fun BluetoothScreen(viewModel: BluetoothViewModel = viewModel()) {
    val devices by viewModel.pairedDevices.collectAsStateWithLifecycle()
    LazyColumn {
        items(devices) { device ->
            ListItem(
                headlineContent = { Text(device.name ?: "Inconnu") },
                supportingContent = { Text(device.address) },
                modifier = Modifier.clickable { viewModel.connect(device) }
            )
        }
    }
}
```

## Liens
- [Bluetooth Classique](https://developer.android.com/develop/connectivity/bluetooth/connect-bluetooth-devices)
- [BluetoothSocket](https://developer.android.com/reference/android/bluetooth/BluetoothSocket)
