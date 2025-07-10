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
        label: "Put a plan in place. If you know they're here, they know you're here.",
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
        label: "Trying to build the best alien language decoder.",
        points: { oracle: 1, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q2b',
        label: "Breaking the record for galactic football.",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q2c',
        label: "Talking to people back on Earth, there's lots of people you miss.",
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
        label: "Use whatever means necessary to get water.",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q3c',
        label: "Figure out why the shortage is happening first, then solve that problem.",
        points: { oracle: 1, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q3d',
        label: "Check in on everyone to make sure they're ok.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 1, terraformer: 0 }
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
        label: "Haul the gear and walk the rest of the way.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 1 }
      },
      {
        id: 'q4b',
        label: "Disassemble the rover and build it back better.",
        points: { oracle: 1, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q4c',
        label: "Use the parts to create a one-person sled and tell the others you'll come get them, it's the fastest option!",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q4d',
        label: "Call for help and wait, safety and teamwork come first.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 1, terraformer: 0 }
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
        label: "You don't really have one and think flags are passé.",
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
        label: "Rush in to check it out.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 1 }
      },
      {
        id: 'q6b',
        label: "Run some tests on it and cross-compare them to plants on Earth.",
        points: { oracle: 1, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q6c',
        label: "Don't tell anyone yet. If it's valuable, it could be used in exchange for information.",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      },
      {
        id: 'q6d',
        label: "Alert the team and recommend a shared observation shift.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 1, terraformer: 0 }
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
        label: "Your heroism and adventures: you wrote the Mars map and have the scars to prove it.",
        points: { oracle: 0, shapeshifter: 0, 'wind-whisperer': 0, terraformer: 1 }
      },
      {
        id: 'q7d',
        label: "Your political influence: you basically ran the Mars show.",
        points: { oracle: 0, shapeshifter: 1, 'wind-whisperer': 0, terraformer: 0 }
      }
    ]
  }
];

export const hyligotchis: Record<string, Hyligotchi> = {
  oracle: {
    id: 'oracle',
    name: 'Oracle Hyligotchi',
    description: 'You were the kid in the back of class who never seemed to be paying attention. Not because you were rebellious or slow to learn, but because you were actually just bored. Naturally curious and observant, you\'re quick to pick up on new concepts. Small talk makes you want to die. You\'re happiest when you\'re learning and applying new concepts, and you have an inner creative spark that sometimes takes people by surprise.',
    image: '/public/hyligotchis/oracle.png',
    color: '#1e3a8a' // Navy blue
  },
  shapeshifter: {
    id: 'shapeshifter',
    name: 'Shapeshifter Hyligotchi',
    description: 'You were called a bossy child but look at you now. You\'re strategic and ambitious and you wear it well… You do what needs to be done to get to where you\'re going. Some people might be scared of you but that\'s their loss. You have a strong sense of direction and are often a few steps ahead which has served you well, you almost always end up on the winning team.',
    image: '/public/hyligotchis/shapeshifter.png',
    color: '#16a34a' // Green
  },
  'wind-whisperer': {
    id: 'wind-whisperer',
    name: 'Wind Whisperer Hyligotchi',
    description: 'You\'re steady and kind. Your friends say you\'re the most reliable one of the bunch. You like to make people feel safe no matter what, but this doesn\'t mean you\'re not to be taken seriously - you\'re perhaps the most resilient of them all. Others look up to you for your inner strength and consistency. You naturally end up being the arbiter in most situations, and you\'re happiest when your community is at peace.',
    image: '/public/hyligotchis/wind-whisperer.png',
    color: '#eab308' // Yellow
  },
  terraformer: {
    id: 'terraformer',
    name: 'Terraformer Hyligotchi',
    description: 'You\'re a natural born leader. Where you go, others follow. Sometimes impulsive, you\'re always quick to volunteer and step up to the plate. You get into trouble but you\'re also bold and loyal. Your friends say you\'re the unpredictable life of the party. You start messes but you\'re the first one to also clean them up. If people can\'t get in touch with you the answer is simple… you\'re on an adventure.',
    image: '/public/hyligotchis/terraformer.png',
    color: '#ec4899' // Pink
  }
};