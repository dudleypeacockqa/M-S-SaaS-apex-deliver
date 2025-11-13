import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { DocumentRoomPage } from './DocumentRoomPage'

const dataRoomSpy = vi.fn()

vi.mock('./DataRoom', () => ({
  DataRoom: (props: unknown) => {
    dataRoomSpy(props)
    return <div data-testid="data-room-proxy">data room placeholder</div>
  },
}))

describe('DocumentRoomPage', () => {
  beforeEach(() => {
    dataRoomSpy.mockClear()
  })

  it('renders the modern DataRoom experience directly', () => {
    render(<DocumentRoomPage />)

    expect(screen.getByTestId('data-room-proxy')).toBeInTheDocument()
    expect(dataRoomSpy).toHaveBeenCalledTimes(1)
  })
  it('supports repeated mounts without leaking state', () => {
    const { rerender } = render(<DocumentRoomPage />)

    rerender(<DocumentRoomPage />)

    expect(screen.getByTestId('data-room-proxy')).toBeInTheDocument()
    expect(dataRoomSpy).toHaveBeenCalledTimes(2)
  })
})
