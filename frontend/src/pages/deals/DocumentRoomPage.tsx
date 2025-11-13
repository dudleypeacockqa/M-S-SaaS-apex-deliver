import { DataRoom } from './DataRoom'

/**
 * Legacy route wrapper so `/deals/:dealId/documents` mirrors the modern
 * document workspace experience powered by DataRoom.
 */
export const DocumentRoomPage: React.FC = () => <DataRoom />
