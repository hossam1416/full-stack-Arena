import { Box, Button, TextField, Typography } from "@mui/material";

export default function PrizesEditor({ prizes, onChange }) {
  const updatePrize = (index, field, value) => {
    onChange(
      prizes.map((prize, i) =>
        i === index ? { ...prize, [field]: Number(value) } : prize,
      ),
    );
  };

  const addPrize = () => {
    onChange([...prizes, { position: prizes.length + 1, amount: 0 }]);
  };

  const removePrize = (index) => {
    onChange(prizes.filter((_, i) => i !== index));
  };

  return (
    <>
      <Typography variant="h6" fontWeight={600}>
        Prizes
      </Typography>

      {prizes.map((prize, index) => (
        <Box
          key={index}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            label="Position"
            type="number"
            value={prize.position}
            onChange={(e) => updatePrize(index, "position", e.target.value)}
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Amount"
            type="number"
            value={prize.amount}
            onChange={(e) => updatePrize(index, "amount", e.target.value)}
            inputProps={{ min: 0 }}
          />
          <Button color="error" onClick={() => removePrize(index)}>
            Remove
          </Button>
        </Box>
      ))}

      <Button variant="outlined" onClick={addPrize}>
        Add Prize
      </Button>
    </>
  );
}
