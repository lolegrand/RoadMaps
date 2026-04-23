---
id: ble
parent: bluetooth
label: BLE (Bluetooth Low Energy)
explored: false
order: 2
---

# BLE (Bluetooth Low Energy)

Le BLE est conçu pour les périphériques à faible consommation (capteurs, montres, balises). Il repose sur un modèle GATT : le périphérique expose des **Services** et des **Characteristics** que l'app lit, écrit ou observe via `notify`. La bibliothèque Nordic BLE simplifie considérablement l'API bas niveau.

```kotlin
// Avec la lib Nordic BLE (recommandée)
class BleViewModel : ViewModel() {
    private val manager = object : BleManager(context) {
        override fun getGattCallback() = object : BleManagerGattCallback() {
            override fun isRequiredServiceSupported(gatt: BluetoothGatt): Boolean {
                val service = gatt.getService(SERVICE_UUID)
                characteristic = service?.getCharacteristic(CHAR_UUID)
                return characteristic != null
            }
            override fun onDeviceDisconnected() { characteristic = null }
        }
    }

    val value = MutableStateFlow<ByteArray?>(null)

    fun connect(device: BluetoothDevice) {
        manager.connect(device)
            .retry(3, 200)
            .useAutoConnect(false)
            .enqueue()
    }

    fun readValue() {
        manager.readCharacteristic(characteristic)
            .with { _, data -> value.value = data.value }
            .enqueue()
    }
}
```

## Dépendances

```toml
# gradle/libs.versions.toml
[versions]
nordicBle = "2.9.0"

[libraries]
nordic-ble = { group = "no.nordicsemi.android", name = "ble", version.ref = "nordicBle" }
nordic-ble-ktx = { group = "no.nordicsemi.android", name = "ble-ktx", version.ref = "nordicBle" }
```

```kotlin
// build.gradle.kts (module)
dependencies {
    implementation(libs.nordic.ble)
    implementation(libs.nordic.ble.ktx) // extensions coroutines
}
```

## AndroidManifest.xml

```xml
<!-- API 31+ -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"
    android:usesPermissionFlags="neverForLocation" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

<!-- API < 31 -->
<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" android:maxSdkVersion="30" />

<uses-feature android:name="android.hardware.bluetooth_le" android:required="true" />
```

## Liens
- [BLE overview](https://developer.android.com/develop/connectivity/bluetooth/ble/ble-overview)
- [Nordic Android BLE Library](https://github.com/NordicSemiconductor/Android-BLE-Library)
- [GATT profile](https://developer.android.com/develop/connectivity/bluetooth/ble/transfer-ble-data)
