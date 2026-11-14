import { TextField } from "@mui/material";

// the fields shared by "create team" and "team settings".
// children = extra fields placed under the name (the create page puts the game select there)
export default function TeamFormFields({ formData, onChange, children }) {
  return (
    <>
      <TextField
        label="Team Name"
        name="name"
        value={formData.name}
        onChange={onChange}
        fullWidth
        required
      />

      {children}

      <TextField
        label="Team Description"
        name="description"
        value={formData.description}
        onChange={onChange}
        multiline
        minRows={4}
        inputProps={{ maxLength: 300 }}
        helperText={`${formData.description.length}/300`}
        fullWidth
      />
      <TextField
        label="Team Logo URL"
        name="logo"
        value={formData.logo}
        onChange={onChange}
        placeholder="https://example.com/team-logo.png"
        fullWidth
      />
      <TextField
        label="Team Banner URL"
        name="banner"
        value={formData.banner}
        onChange={onChange}
        placeholder="https://example.com/team-banner.png"
        fullWidth
      />
    </>
  );
}
