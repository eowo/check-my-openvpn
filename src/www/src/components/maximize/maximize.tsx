import * as React from "react";
import { Button } from "./maximize.style";

interface Props {
  onChange: (maximize: boolean) => void;
}

export function Maximize({ onChange }: Props) {
  const [maximize, setMaximize] = React.useState(false);

  function handleStatusChange(state: boolean) {
    setMaximize(state);
    onChange(state);
  }

  return (
    <Button onClick={() => handleStatusChange(!maximize)}>
      {maximize ? "▽" : "🗖"}
    </Button>
  );
}
