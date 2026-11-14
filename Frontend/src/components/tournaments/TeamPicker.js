import { Grid } from "@mui/material";
import SelectableCard from "@/components/common/SelectableCard";

// A list of team cards. The captain clicks one team to select it.
export default function TeamPicker({
  teams,
  requiredPlayers,
  registeredIds,
  selectedTeam,
  onSelect,
}) {
  return (
    <Grid container spacing={3}>
      {teams.map((team) => {
        // reasons why a team can not be selected
        let disabledReason = "";
        if (registeredIds.includes(team._id)) {
          disabledReason = "Already registered";
        } else if (team.members.length < requiredPlayers) {
          disabledReason = `Needs at least ${requiredPlayers} players`;
        }

        return (
          <Grid key={team._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <SelectableCard
              title={team.name}
              subtitle={disabledReason || `${team.members.length} members`}
              avatarSrc={team.logo}
              selected={selectedTeam?._id === team._id}
              disabled={Boolean(disabledReason)}
              onClick={() => onSelect(team)}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
