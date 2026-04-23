---
id: connectivite
parent: jetpack-compose
label: Connectivité
explored: false
order: 6
---

# Connectivité

Android expose plusieurs protocoles de communication sans fil. Le **Bluetooth** (classique et BLE) est le plus courant pour les périphériques physiques. La gestion des permissions est un point critique depuis Android 12 : les permissions Bluetooth ont été fractionnées et doivent être demandées au runtime.

```kotlin
// Demande de permissions au runtime (API 31+)
val launcher = rememberLauncherForActivityResult(
    ActivityResultContracts.RequestMultiplePermissions()
) { permissions ->
    val granted = permissions.all { it.value }
    if (granted) startBluetoothScan()
}

LaunchedEffect(Unit) {
    launcher.launch(arrayOf(
        Manifest.permission.BLUETOOTH_SCAN,
        Manifest.permission.BLUETOOTH_CONNECT
    ))
}
```

## Liens
- [Connectivity overview](https://developer.android.com/develop/connectivity)
- [Permissions Bluetooth Android 12+](https://developer.android.com/develop/connectivity/bluetooth/bt-permissions)
