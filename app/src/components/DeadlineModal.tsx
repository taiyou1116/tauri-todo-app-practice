import { useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import Deadline from "./Deadline";

type DeadlineModalProps = {
    onClose: () => void,
    onSetDeadline: (deadline: Date) => void,
    open: boolean,
}

export default function DeadlineModal(props: DeadlineModalProps) {
    const { onClose, onSetDeadline, open } = props;

    const [deadline, setDeadline] = useState<Date | null>(null);

    function handleCreate(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        if (deadline !== null) {
            onSetDeadline(deadline);
        }
        handleClose();
    }

    function handleClose(): void {
        onClose();
    }

  return (
    <Modal 
      onClose={() => handleClose()}
      open={open}
      title="Set todo deadline"
    > 
      <form className="flex flex-col gap-2" onSubmit={(e) => handleCreate(e)}>
        <Deadline 
          onChange={(d) => setDeadline(d)}
          value={deadline}
        />
        <div className="flex flex-row justify-center gap-2">
          <Button expand onClick={() => handleClose()} text="Cancel"/>
          <Button expand text="Create" type="submit" variant="primary"/>
        </div>
      </form>
    </Modal>
  )
}