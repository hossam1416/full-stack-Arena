import { Button, Stack } from "@mui/material";
import StarsIcon from "@mui/icons-material/Stars";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ActionRow from "@/components/common/ActionRow";
import MemberInfo from "@/components/teams/MemberInfo";

export default function RosterList({ team, onRemove, onTransfer }) {
  return (
    <Stack spacing={2}>
      {team.members?.map((member) => {
        const isCaptain = member._id === team.captain?._id;

        return (
          <ActionRow
            key={member._id}
            // the captain can not remove himself
            actions={
              !isCaptain && (
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<StarsIcon />}
                    onClick={() => onTransfer(member)}
                  >
                    Transfer Captaincy
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<PersonRemoveIcon />}
                    onClick={() => onRemove(member)}
                  >
                    Remove
                  </Button>
                </Stack>
              )
            }
          >
            <MemberInfo member={member} isCaptain={isCaptain} />
          </ActionRow>
        );
      })}
    </Stack>
  );
}
