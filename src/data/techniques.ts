import { TechniqueCategory, TechniqueDefinition } from '../types/propaganda';

export const TECHNIQUE_LABELS: TechniqueCategory[] = [
  'Loaded Language',
  'Name Calling or Labeling',
  'Repetition',
  'Doubt',
  'Exaggeration or Minimisation',
  'Appeal to Fear / Prejudices',
  'Flag-Waving',
  'Causal Oversimplification',
  'Slogans',
  'Appeal to Authority',
  'Black-and-White Fallacy',
  'Thought-terminating Cliche',
  'Whataboutism',
  'Bandwagon',
];

export const TECHNIQUE_DEFINITIONS: Record<TechniqueCategory, TechniqueDefinition> = {
  'Loaded Language': {
    id: 'loaded-language',
    name: 'Loaded Language',
    formalNameSemEval: 'Loaded Language',
    definition:
      'Using words and phrases with strong emotional connotations (positive or negative) to influence an audience and provoke an uncritical reaction.',
    linguisticMarkers: [
      'disastrous',
      'corrupt',
      'tyranny',
      'bloodbath',
      'monstrous',
      'heroic',
      'savage',
      'betrayal',
    ],
    examples: [
      {
        quote: 'These corrupt politicians are destroying our sacred democracy with their reckless schemes.',
        rationale: 'The sentence employs heavily evocative vocabulary ("corrupt", "destroying", "reckless schemes") to induce strong resentment without presenting evidence.',
        evidence: 'corrupt politicians, reckless schemes',
      },
      {
        quote: 'A monstrous tragedy engineered by treasonous bureaucrats.',
        rationale: 'Uses hyperbolic affective terms to frame administrative actions as moral villainy.',
        evidence: 'monstrous tragedy, treasonous bureaucrats',
      },
    ],
    relatedTechniques: ['Name Calling or Labeling', 'Exaggeration or Minimisation', 'Appeal to Fear / Prejudices'],
  },

  'Name Calling or Labeling': {
    id: 'name-calling',
    name: 'Name Calling or Labeling',
    formalNameSemEval: 'Name Calling, Labeling',
    definition:
      'Labeling the object of the propaganda campaign as something that the target audience fears, hates, loathes, or finds undesirable (or alternatively, glorifying an ally).',
    linguisticMarkers: ['puppets', 'traitors', 'extremists', 'clowns', 'radicals', 'sellouts', 'sheep'],
    examples: [
      {
        quote: 'The spineless puppets in parliament have surrendered to foreign interests.',
        rationale: 'Assigns a derogatory label ("spineless puppets") to discredit members of parliament as subservient tools rather than legitimate legislators.',
        evidence: 'spineless puppets',
      },
    ],
    relatedTechniques: ['Loaded Language', 'Doubt'],
  },

  'Repetition': {
    id: 'repetition',
    name: 'Repetition',
    formalNameSemEval: 'Repetition',
    definition:
      'Repeating the exact same message, phrase, or claim multiple times across or within a text so that the audience accepts it as established truth through sheer familiarity.',
    linguisticMarkers: ['repeated key phrases', 'refrains', 'cyclical assertions'],
    examples: [
      {
        quote: 'It was a total failure. A complete failure. An absolute failure from start to finish.',
        rationale: 'The assertion of failure is mechanically restated across contiguous clauses to ingrain the sentiment.',
        evidence: 'total failure ... complete failure ... absolute failure',
      },
    ],
    relatedTechniques: ['Slogans', 'Loaded Language'],
  },

  'Doubt': {
    id: 'doubt',
    name: 'Doubt',
    formalNameSemEval: 'Doubt',
    definition:
      'Questioning the credibility, integrity, or motives of a person, institution, or established consensus without providing substantiated counter-evidence.',
    linguisticMarkers: [
      'so-called',
      'can we really believe',
      'conveniently',
      'who really stands behind',
      'questionable motives',
    ],
    examples: [
      {
        quote: 'Can we really trust these "official" findings when government grants fund every single researcher?',
        rationale: 'Insinuates corruption and unreliability through rhetorical questioning and scare quotes rather than empirical rebuttal.',
        evidence: 'Can we really trust ... "official" findings',
      },
    ],
    relatedTechniques: ['Name Calling or Labeling', 'Whataboutism'],
  },

  'Exaggeration or Minimisation': {
    id: 'exaggeration-minimisation',
    name: 'Exaggeration or Minimisation',
    formalNameSemEval: 'Exaggeration, Minimisation',
    definition:
      'Either representing something in an excessive, overblown manner (hyperbole) or making it seem trivial and unimportant to manipulate perceptions of severity.',
    linguisticMarkers: [
      'worst crisis in human history',
      'completely annihilated',
      'merely a minor glitch',
      'nothing to worry about',
      'unprecedented devastation',
    ],
    examples: [
      {
        quote: 'This single amendment will plunge humanity into irreversible darkness.',
        rationale: 'Dramatically magnifies the consequences of a legislative amendment far beyond realistic impact.',
        evidence: 'plunge humanity into irreversible darkness',
      },
    ],
    relatedTechniques: ['Appeal to Fear / Prejudices', 'Loaded Language', 'Causal Oversimplification'],
  },

  'Appeal to Fear / Prejudices': {
    id: 'appeal-to-fear',
    name: 'Appeal to Fear / Prejudices',
    formalNameSemEval: 'Appeal to Fear-Prejudice',
    definition:
      'Seeking to build support by instilling anxiety, alarm, or panic regarding alternatives, or by exploiting existing racial, economic, or social prejudices.',
    linguisticMarkers: [
      'if we do not act now',
      'they are coming for your',
      'total collapse',
      'loss of your way of life',
      'existential threat',
    ],
    examples: [
      {
        quote: 'If you do not vote against this measure, your neighborhoods will be overrun and your savings wiped out overnight.',
        rationale: 'Evokes panic over immediate existential ruin and loss of personal safety to dictate voter behavior.',
        evidence: 'neighborhoods will be overrun and your savings wiped out overnight',
      },
    ],
    relatedTechniques: ['Flag-Waving', 'Exaggeration or Minimisation', 'Black-and-White Fallacy'],
  },

  'Flag-Waving': {
    id: 'flag-waving',
    name: 'Flag-Waving',
    formalNameSemEval: 'Flag-Waving',
    definition:
      'Playing on strong nationalistic, patriotic, or collective identity pride to justify an action, policy, or perspective as the only loyal course of action.',
    linguisticMarkers: [
      'true patriots',
      'defend our heritage',
      'for the honor of our nation',
      'the soul of our country',
      'un-American',
    ],
    examples: [
      {
        quote: 'Every true patriot who loves this sacred land has a duty to reject this foreign interference.',
        rationale: 'Conditions patriotic loyalty upon adhering to a specific stance, casting dissenters as unpatriotic.',
        evidence: 'Every true patriot who loves this sacred land',
      },
    ],
    relatedTechniques: ['Bandwagon', 'Appeal to Fear / Prejudices', 'Name Calling or Labeling'],
  },

  'Causal Oversimplification': {
    id: 'causal-oversimplification',
    name: 'Causal Oversimplification',
    formalNameSemEval: 'Causal Oversimplification',
    definition:
      'Assuming a single, simple cause for a complex multi-factor event, or declaring that an event was caused strictly by a convenient scapegoat.',
    linguisticMarkers: [
      'the only reason is',
      'is entirely due to',
      'this one decision caused',
      'responsible for all our problems',
    ],
    examples: [
      {
        quote: 'The entire economic downtown is solely caused by the recent trade policy.',
        rationale: 'Reduces macroeconomic volatility involving global supply chains and inflation to a solitary policy choice.',
        evidence: 'solely caused by the recent trade policy',
      },
    ],
    relatedTechniques: ['Black-and-White Fallacy', 'Exaggeration or Minimisation'],
  },

  'Slogans': {
    id: 'slogans',
    name: 'Slogans',
    formalNameSemEval: 'Slogans',
    definition:
      'A brief, striking, and memorable motto or catchphrase used in campaigns to bypass deeper logical evaluation through quick recognition.',
    linguisticMarkers: [
      'catchy mottos',
      'rhyming political mantras',
      'imperative rallying calls',
    ],
    examples: [
      {
        quote: 'Forward Together, Strength in Unity!',
        rationale: 'A formulaic political catchphrase packaged to evoke solidarity without articulating actual policy substance.',
        evidence: 'Forward Together, Strength in Unity!',
      },
    ],
    relatedTechniques: ['Repetition', 'Thought-terminating Cliche'],
  },

  'Appeal to Authority': {
    id: 'appeal-to-authority',
    name: 'Appeal to Authority',
    formalNameSemEval: 'Appeal to Authority',
    definition:
      'Stating that a claim must be true simply because an authority or prominent figure asserted it, especially when the figure lacks expertise in the relevant field or their remarks are decontextualized.',
    linguisticMarkers: [
      'leading authorities agree',
      'as stated by the renowned',
      'top experts confirm without doubt',
    ],
    examples: [
      {
        quote: 'Even world-renowned actors and celebrities agree that this economic treaty is dangerous.',
        rationale: 'Relies on the prestige of non-expert figures to substantiate complex economic arguments.',
        evidence: 'world-renowned actors and celebrities agree',
      },
    ],
    relatedTechniques: ['Bandwagon', 'Doubt'],
  },

  'Black-and-White Fallacy': {
    id: 'black-and-white-fallacy',
    name: 'Black-and-White Fallacy',
    formalNameSemEval: 'Black-and-White Fallacy',
    definition:
      'Presenting only two extreme mutually exclusive alternatives as the sole choices, deliberately concealing middle ground or alternative solutions (False Dilemma).',
    linguisticMarkers: [
      'either ... or',
      'you are either with us or against us',
      'no other choice',
      'the only alternative is ruin',
    ],
    examples: [
      {
        quote: 'You either support this defense bill or you want our soldiers to be defenseless on the battlefield.',
        rationale: 'Forces an artificial binary choice between supporting legislation and desiring harm to military personnel.',
        evidence: 'either support this defense bill or you want our soldiers to be defenseless',
      },
    ],
    relatedTechniques: ['Causal Oversimplification', 'Appeal to Fear / Prejudices'],
  },

  'Thought-terminating Cliche': {
    id: 'thought-terminating-cliche',
    name: 'Thought-terminating Cliche',
    formalNameSemEval: 'Thought-terminating Cliché',
    definition:
      'A trite phrase, idiom, or folk wisdom used to abruptly end debate, quell cognitive dissonance, and dismiss critical analysis without justification.',
    linguisticMarkers: [
      'it is what it is',
      'rules are rules',
      'everything happens for a reason',
      'that is just how the world works',
      'only time will tell',
    ],
    examples: [
      {
        quote: 'There is no point questioning the leadership because it is what it is.',
        rationale: 'Employs a tired idiom to shut down inquiries into administrative choices.',
        evidence: 'because it is what it is',
      },
    ],
    relatedTechniques: ['Slogans', 'Black-and-White Fallacy'],
  },

  'Whataboutism': {
    id: 'whataboutism',
    name: 'Whataboutism',
    formalNameSemEval: 'Whataboutism, Straw Men, Red Herring',
    definition:
      'Deflecting attention away from an accusation or uncomfortable fact by counter-accusing an opponent of equal or worse hypocrisy (Tu quoque, red herring, or straw man diversion).',
    linguisticMarkers: [
      'what about when',
      'why is nobody talking about what they did',
      'how can you criticize us when they',
    ],
    examples: [
      {
        quote: 'Why are critics complaining about our spending deficit when the other party doubled the national debt ten years ago?',
        rationale: 'Evades defending current fiscal policy by directing scrutiny toward historical opposition conduct.',
        evidence: 'Why are critics complaining about our spending deficit when the other party doubled',
      },
    ],
    relatedTechniques: ['Doubt', 'Name Calling or Labeling'],
  },

  'Bandwagon': {
    id: 'bandwagon',
    name: 'Bandwagon',
    formalNameSemEval: 'Bandwagon, Reductio ad Hitlerum',
    definition:
      'Attempting to convince the audience to join an initiative or accept an opinion because "everyone is doing it" or it is overwhelmingly popular.',
    linguisticMarkers: [
      'millions of citizens are already',
      'the consensus of the people',
      'do not be left behind',
      'everyone knows that',
    ],
    examples: [
      {
        quote: 'Tens of millions of sensible citizens have already embraced this movement; do not remain isolated on the wrong side of history.',
        rationale: 'Urges compliance based on crowd numbers and social conformity pressures rather than evidential merit.',
        evidence: 'Tens of millions of sensible citizens have already embraced this movement',
      },
    ],
    relatedTechniques: ['Appeal to Authority', 'Flag-Waving'],
  },
};
