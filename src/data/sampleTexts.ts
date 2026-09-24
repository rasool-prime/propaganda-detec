export interface SampleText {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
}

export const SAMPLE_TEXTS: SampleText[] = [
  {
    id: 'editorial-polemic',
    title: 'Political Op-Ed: The Looming Crisis',
    category: 'High Rhetorical Intensity',
    description: 'Demonstrates Loaded Language, Name Calling, Appeal to Fear, and Black-and-White Fallacy.',
    text: `The catastrophic decisions enacted by corrupt bureaucrats in the capital have pushed our beloved homeland to the brink of utter ruin. These spineless puppets have surrendered our heritage to greedy globalist elites who care nothing for the working family.

If we do not rise up and reject this disastrous treaty today, our neighborhoods will be overrun and our lifetime savings will be wiped out overnight. You are either with the hardworking patriots of this country, or you are standing with the enemy.

The entire collapse of the manufacturing sector is solely caused by this treacherous administration. Tens of millions of sensible citizens have already joined our resistance movement. Do not be left behind on the wrong side of history.`,
  },
  {
    id: 'campaign-speech',
    title: 'Campaign Rally: A Call to Duty',
    category: 'Patriotic & Populist Appeals',
    description: 'Demonstrates Flag-Waving, Slogans, Bandwagon, and Thought-terminating Cliche.',
    text: `Every true patriot who loves this sacred land knows in their heart that our civilization is under siege. We are fighting for the very soul of our nation.

Forward Together, Strength in Unity! That is our battle cry. Millions of families across every province are proudly rallying behind our banner. Even renowned leaders and cultural icons confirm that our agenda is the only path forward.

Critics question our methodology, but why are they whining about our procedural steps when their own party ran massive deficits and destroyed public services a decade ago? There is no point debating the inevitable because rules are rules, and it is what it is.`,
  },
  {
    id: 'scientific-neutral',
    title: 'Scientific Brief: Climate Observation',
    category: 'Neutral Baseline (Control)',
    description: 'Non-propagandistic control text to test low likelihood and lack of manipulative rhetorical spans.',
    text: `The National Meteorological Agency recorded a 0.4 degree Celsius rise in average sea surface temperatures across the equatorial Pacific during the past quarter. Data collected from autonomous oceanic buoys and orbital satellite infrared sensors indicate consistent atmospheric pressure variations.

Hydrological models suggest that precipitation levels in coastal estuaries will fluctuate within standard seasonal intervals. Agricultural planners recommend regular monitoring of soil moisture gradients to optimize irrigation schedules without assuming extreme disruption. Continued interdisciplinary research will provide updated seasonal projections next month.`,
  },
];
