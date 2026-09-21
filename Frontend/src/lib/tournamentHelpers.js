export const STATUS_COLORS = { open: "success", in_progress: "warning" };

export const formatStatus = (status) => status.replace("_", " ").toUpperCase();

export const getPrizePool = (tournament) =>
  tournament.prizes?.reduce((total, prize) => total + prize.amount, 0) || 0;

export const getRegistrationState = (tournament) => {
  const deadlinePassed = new Date() > new Date(tournament.registrationDeadline);

  if (tournament.status !== "open" || deadlinePassed) {
    return { open: false, label: "Registration Closed" };
  }
  if (tournament.registrationCount >= tournament.maxTeams) {
    return { open: false, label: "Registration Full" };
  }
  return { open: true, label: "Register Your Team" };
};
