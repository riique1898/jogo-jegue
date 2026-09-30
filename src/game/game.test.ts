import { describe, expect, it } from 'vitest'
import { createGame, drawInitialHand, hasFourOfAKind, type Player } from './game'

const players: Player[] = [
  { id: 'a', name: 'Ana', isHost: true, connected: true, penalty: 0 },
  { id: 'b', name: 'Bia', isHost: false, connected: true, penalty: 0 },
]

describe('regras do Jegue', () => {
  it('inicia a partida com o anfitrião no primeiro turno', () => {
    expect(createGame(players).turnPlayerId).toBe('a')
  })
  it('distribui exatamente quatro cartas', () => {
    expect(drawInitialHand(createGame(players), 'a')).toHaveLength(4)
  })
  it('detecta quatro cartas do mesmo valor', () => {
    const hand = drawInitialHand(createGame(players), 'a').map((card) => ({ ...card, value: '7' }))
    expect(hasFourOfAKind(hand)).toBe(true)
  })
  it('recusa uma mão com valores diferentes', () => {
    expect(hasFourOfAKind(drawInitialHand(createGame(players), 'a'))).toBe(false)
  })
})
