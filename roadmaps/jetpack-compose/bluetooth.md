---
id: bluetooth
parent: connectivite
label: Bluetooth & BLE
explored: false
order: 1
---

# Bluetooth & BLE

Android propose deux modes Bluetooth : le **Bluetooth Classique** (audio, SPP, profils A2DP) et le **BLE** (Bluetooth Low Energy) pour les capteurs, wearables et IoT. Depuis Android 12 (API 31), les permissions ont été séparées : `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, `BLUETOOTH_ADVERTISE`.

```kotlin
// Vérification des permissions requises (API 31+)
val bluetoothPermissions = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
    arrayOf(
        Manifest.permission.BLUETOOTH_SCAN,
        Manifest.permission.BLUETOOTH_CONNECT
    )
} else {
    arrayOf(
        Manifest.permission.BLUETOOTH,
        Manifest.permission.BLUETOOTH_ADMIN,
        Manifest.permission.ACCESS_FINE_LOCATION
    )
}
```

## Liens
- [Bluetooth overview](https://developer.android.com/develop/connectivity/bluetooth)
- [Permissions Bluetooth](https://developer.android.com/develop/connectivity/bluetooth/bt-permissions)
