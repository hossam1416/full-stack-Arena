import Link from "next/link";
import { Card, Grid } from "@mui/material";
import MemberInfo from "@/components/teams/MemberInfo";

// the roster on the team page: every member links to his profile
export default function MembersGrid({ team }) {
  return (
    <Grid container spacing={2}>
      {team.members?.map((member) => (
        <Grid key={member._id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            component={Link}
            href={`/players/${member._id}`}
            variant="interactive"
            sx={{ display: "block", p: 2.5, textDecoration: "none" }}
          >
            <MemberInfo
              member={member}
              isCaptain={member._id === team.captain?._id}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
