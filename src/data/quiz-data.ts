import type { Question, Hyligotchi } from '@/types/quiz';

export const questions: Question[] = [
  {
    id: 'q1',
    prompt: "You're on Mars and you find a mysterious, ancient book. You deduct it must have come from aliens. You:",
    icon: '📚',
    answers: [
      {
        id: 'q1a',
        label: "Study it. You're fascinated by aliens and want to learn everything you can about them.",
        points: { oracle: 1, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q1b',
        label: "Use it to your advantage. This is a fascinating discovery, others are bound to also be interested.",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q1c',
        label: "Start daydreaming about how you're about to become bffs with the aliens.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 1, terraformer: 0 }
      },
      {
        id: 'q1d',
        label: "Immediately tell all of basecamp, this is big news and everyone should know.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 1 }
      }
    ]
  },
  {
    id: 'q2',
    prompt: "You have a free day on Mars. What's your ideal way to spend the afternoon?",
    icon: '🪐',
    answers: [
      {
        id: 'q2a',
        label: "Studying the alien language.",
        points: { oracle: 1, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q2b',
        label: "Breaking the record for galactic football.",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q2c',
        label: "Talking to back to people on Earth, there's lots of people you miss.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 1, terraformer: 0 }
      },
      {
        id: 'q2d',
        label: "You're out exploring, there's so much to do on Mars!",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 1 }
      }
    ]
  },
  {
    id: 'q3',
    prompt: "You're experiencing a water shortage on Mars. You:",
    icon: '💧',
    answers: [
      {
        id: 'q3a',
        label: "Immediately start figuring out rations. Someone has got to take charge.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 1 }
      },
      {
        id: 'q3b',
        label: "Research the problem and try to solve it.",
        points: { oracle: 1, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q3c',
        label: "Check in on everyone to make sure they're ok.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 1, terraformer: 0 }
      },
      {
        id: 'q3d',
        label: "Use whatever means necessary to get water.",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      }
    ]
  },
  {
    id: 'q4',
    prompt: "Your rover breaks down halfway through a supply mission. What do you do?",
    icon: '🚗',
    answers: [
      {
        id: 'q4a',
        label: "Haul the gear and walk the rest of the way, no one gets left behind.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 1 }
      },
      {
        id: 'q4b',
        label: "Disassemble the rover to study and rebuild it better.",
        points: { oracle: 1, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q4c',
        label: "Call for help and wait, safety and teamwork come first.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 1, terraformer: 0 }
      },
      {
        id: 'q4d',
        label: "Use the parts to create a one-person sled. The show must go on even if you have to go solo!",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      }
    ]
  },
  {
    id: 'q5',
    prompt: "You're invited to design the Mars colony's flag. What's your design philosophy?",
    icon: '🚩',
    answers: [
      {
        id: 'q5a',
        label: "Something bold and iconic that captures the spirit of humanity.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 1 }
      },
      {
        id: 'q5b',
        label: "Something symbolic and geometrically precise, filled with layers of meaning.",
        points: { oracle: 1, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q5c',
        label: "A design that includes every crew member's ideas.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 1, terraformer: 0 }
      },
      {
        id: 'q5d',
        label: "You don't really care, but you hope you can get your initials in there.",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      }
    ]
  },
  {
    id: 'q6',
    prompt: "You're alone in the bio-dome when an unknown plant begins to grow rapidly. You:",
    icon: '🌱',
    answers: [
      {
        id: 'q6a',
        label: "Grab your tools and examine it ASAP in person.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 1 }
      },
      {
        id: 'q6b',
        label: "Document and test samples carefully in the lab.",
        points: { oracle: 1, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q6c',
        label: "Alert the team and recommend a shared observation shift.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 1, terraformer: 0 }
      },
      {
        id: 'q6d',
        label: "Don't tell anyone yet. If it's valuable, it might be your breakthrough.",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      }
    ]
  },
  {
    id: 'q7',
    prompt: "Your mission to Mars will last 10 years. What would you most like to be remembered for when you get back to Earth?",
    icon: '🌍',
    answers: [
      {
        id: 'q7a',
        label: "Your knowledge and wisdom. You mastered alien languages and are responsible for key new Mars-proof inventions.",
        points: { oracle: 1, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q7b',
        label: "The impact you made on the lives of those around you.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 1, terraformer: 0 }
      },
      {
        id: 'q7c',
        label: "Your heroism and adventures: you wrote the map and have the scars to prove it.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 1 }
      },
      {
        id: 'q7d',
        label: "Your political influence: you ran Mars.",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      }
    ]
  }
];

export const hyligotchis: Record<string, Hyligotchi> = {
  oracle: {
    id: 'oracle',
    name: 'Oracle Hyligotchi',
    description: 'A wise and curious soul who seeks knowledge in the mysteries of the universe.',
    image: '/public/hyligotchis/oracle.png',
    color: '#1e3a8a' // Navy blue
  },
  shapeshifter: {
    id: 'shapeshifter',
    name: 'Shapeshifter Hyligotchi',
    description: 'A clever strategist who adapts to any situation and sees opportunity everywhere.',
    image: '/public/hyligotchis/shapeshifter.png',
    color: '#16a34a' // Green
  },
  'wind-whisperer': {
    id: 'wind-whisperer',
    name: 'Wind Whisperer Hyligotchi',
    description: 'A compassionate friend who brings people together and nurtures community.',
    image: '/public/hyligotchis/wind-whisperer.png',
    color: '#eab308' // Yellow
  },
  terraformer: {
    id: 'terraformer',
    name: 'Terraformer Hyligotchi',
    description: 'A bold leader who shapes new worlds through courage and determination.',
    image: '/public/hyligotchis/terraformer.png',
    color: '#ec4899' // Pink
  }
};