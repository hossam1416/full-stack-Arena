// calculate the next power of 2 greater than or equal to teamCount
export const getBracketSize = (teamCount) => {
  let bracketSize = 1;
  while (bracketSize < teamCount) {
    bracketSize *= 2;
  }
  return bracketSize;
};
// calculate the number of byes needed to fill the bracket
export const getByeCount = (teamCount, bracketSize) => {
  return bracketSize - teamCount;
};
// shuffle an array using the Fisher-Yates algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    // destructuring assignment to swap elements
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
};
// create the first round matches, including byes if necessary
export const createFirstRoundMatches = (teams) => {
  const bracketSize = getBracketSize(teams.length);
  const byeCount = getByeCount(teams.length, bracketSize);
  const shuffledTeams = shuffleArray(teams);
  //  take the first byeCount teams as byes and the rest as playing teams
  const byeTeams = shuffledTeams.slice(0, byeCount);
  const playingTeams = shuffledTeams.slice(byeCount);

  const matches = [];
  // loop for each bye team and create a match with null as the opponent
  for (const team of byeTeams) {
    matches.push({ teamA: team, teamB: null });
  }
  // loop through the playing teams in pairs and create matches
  for (let i = 0; i < playingTeams.length; i += 2) {
    matches.push({ teamA: playingTeams[i], teamB: playingTeams[i + 1] });
  }

  return { bracketSize, byeCount, matches };
};
// create the next round matches based on the previous round matches
export const createNextRoundMatches = (previousRoundMatches) => {
  const nextRoundMatches = [];
  for (let i = 0; i < previousRoundMatches.length; i += 2) {
    nextRoundMatches.push({
      // we don't know the winners yet, so we set teamA and teamB to null
      teamA: null,
      teamB: null,
    });
  }

  return nextRoundMatches;
};
// create all rounds of the bracket based on the first round matches
export const createBracketRounds = (firstRoundMatches) => {
  const rounds = [firstRoundMatches];
  let currentRound = firstRoundMatches;

  while (currentRound.length > 1) {
    const nextRound = createNextRoundMatches(currentRound);
    rounds.push(nextRound);
    currentRound = nextRound;
  }

  return rounds;
};
