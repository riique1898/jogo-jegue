import { Capacitor } from '@capacitor/core'
import { BluetoothLowEnergy } from '@capgo/capacitor-bluetooth-low-energy'

export const JEGUE_SERVICE = '7b8b4f70-6d2d-4c43-9c4f-0a6e4f6f1000'
export const JEGUE_CHARACTERISTIC = '7b8b4f71-6d2d-4c43-9c4f-0a6e4f6f1000'
export type MessageType = 'SOLICITACAO_ENTRADA'|'JOGADOR_ENTROU'|'PARTIDA_INICIADA'|'JOGADA'|'TROCA_REALIZADA'|'JOGADOR_COMPLETOU'|'PARTIDA_FINALIZADA'|'JOGADOR_DESCONECTADO'|'RECONEXAO'
export type BluetoothMessage = { version: 1; type: MessageType; messageId: string; senderId: string; timestamp: number; payload: Record<string, unknown> }
export type DiscoveredRoom = { deviceId: string; name: string; rssi?: number }

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const toBytes = (message: BluetoothMessage) => Array.from(encoder.encode(JSON.stringify(message)))
const fromBytes = (bytes: number[]): BluetoothMessage | null => { try { const value = JSON.parse(decoder.decode(new Uint8Array(bytes))); return validateMessage(value) ? value : null } catch { return null } }
export function validateMessage(value: unknown): value is BluetoothMessage {
  if (!value || typeof value !== 'object') return false
  const m = value as Record<string, unknown>
  return m.version === 1 && typeof m.type === 'string' && typeof m.messageId === 'string' && typeof m.senderId === 'string' && typeof m.timestamp === 'number' && !!m.payload && typeof m.payload === 'object'
}
function message(senderId: string, type: MessageType, payload: Record<string, unknown>): BluetoothMessage { return { version: 1, type, messageId: crypto.randomUUID(), senderId, timestamp: Date.now(), payload } }
async function ensurePermissions() {
  if (Capacitor.getPlatform() === 'web') return
  await BluetoothLowEnergy.requestPermissions()
  const { enabled } = await BluetoothLowEnergy.isEnabled()
  if (!enabled) await BluetoothLowEnergy.openBluetoothSettings()
}
export async function initializeBluetooth(mode: 'central'|'peripheral' = 'central') { if (Capacitor.getPlatform() === 'web') return; await ensurePermissions(); await BluetoothLowEnergy.initialize({ mode }) }
export async function startHost(name: string) {
  await initializeBluetooth('peripheral')
  await BluetoothLowEnergy.addGattService({ service: JEGUE_SERVICE, characteristics: [{ uuid: JEGUE_CHARACTERISTIC, properties: { read: true, notify: true, write: true, writeWithoutResponse: true, broadcast: false, indicate: false, authenticatedSignedWrites: false, extendedProperties: false }, value: [0] }] })
  await BluetoothLowEnergy.startAdvertising({ name: `JEGUE-${name}`, services: [JEGUE_SERVICE], includeName: true })
}
export async function stopHost() { if (Capacitor.getPlatform() === 'web') return; await BluetoothLowEnergy.stopAdvertising().catch(() => undefined) }
export async function scanRooms(onRoom: (room: DiscoveredRoom) => void, onDisconnected?: (deviceId: string) => void) {
  await initializeBluetooth('central')
  await BluetoothLowEnergy.addListener('deviceScanned', event => { if ((event.device.serviceUuids ?? []).some(uuid => uuid.toLowerCase().includes(JEGUE_SERVICE.slice(0, 8)))) onRoom({ deviceId: event.device.deviceId, name: event.device.name ?? 'Sala Jegue', rssi: event.device.rssi }) })
  if (onDisconnected) await BluetoothLowEnergy.addListener('deviceDisconnected', event => onDisconnected(event.deviceId))
  await BluetoothLowEnergy.startScan({ services: [JEGUE_SERVICE], timeout: 10000 })
}
export async function connectToRoom(deviceId: string, senderId: string, onMessage: (message: BluetoothMessage) => void, onDisconnected?: () => void, name = 'Jogador') {
  await BluetoothLowEnergy.connect({ deviceId }); await BluetoothLowEnergy.discoverServices({ deviceId }); await BluetoothLowEnergy.startCharacteristicNotifications({ deviceId, service: JEGUE_SERVICE, characteristic: JEGUE_CHARACTERISTIC })
  await BluetoothLowEnergy.addListener('characteristicChanged', event => { if (event.deviceId === deviceId) { const parsed = fromBytes(event.value); if (parsed) onMessage(parsed) } })
  if (onDisconnected) await BluetoothLowEnergy.addListener('deviceDisconnected', event => { if (event.deviceId === deviceId) onDisconnected() })
  await sendMessage(deviceId, senderId, 'SOLICITACAO_ENTRADA', { name })
}
export async function sendMessage(deviceId: string, senderId: string, type: MessageType, payload: Record<string, unknown>) { if (Capacitor.getPlatform() === 'web') return; await BluetoothLowEnergy.writeCharacteristic({ deviceId, service: JEGUE_SERVICE, characteristic: JEGUE_CHARACTERISTIC, value: toBytes(message(senderId, type, payload)), type: 'withResponse' }) }
export async function notifyPlayers(senderId: string, type: MessageType, payload: Record<string, unknown>, deviceId?: string) { if (Capacitor.getPlatform() === 'web') return; await BluetoothLowEnergy.notifyGattCharacteristicChanged({ service: JEGUE_SERVICE, characteristic: JEGUE_CHARACTERISTIC, value: toBytes(message(senderId, type, payload)), deviceId }) }
export async function listenAsHost(onMessage: (message: BluetoothMessage, deviceId: string) => void, onDisconnected: (deviceId: string) => void) { await BluetoothLowEnergy.addListener('gattCharacteristicWriteRequest', event => { const parsed = fromBytes(event.value); if (parsed) onMessage(parsed, event.deviceId) }); await BluetoothLowEnergy.addListener('centralDisconnected', event => onDisconnected(event.deviceId)) }
