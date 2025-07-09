export type HyligotchiId = 'oracle' | 'shapeshifter' | 'wind-whisperer' | 'terraformer';

export interface Answer {
  id: string;
  label: string;
  points: Record<HyligotchiId, number>;
}

export interface Question {
  id: string;
  prompt: string;
  icon: string;
  answers: Answer[];
}

export interface QuizResult {
  archetype: HyligotchiId;
  score: number;
}

export interface Hyligotchi {
  id: HyligotchiId;
  name: string;
  description: string;
  image: string;
  color: string;
}

export type QuizState = 'idle' | 'in-progress' | 'completed';