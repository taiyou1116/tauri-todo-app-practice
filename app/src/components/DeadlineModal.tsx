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

    function isDeadlineInPast(date: Date | null): boolean {
      if (date === null) return false;

      const now = new Date();
      return date < now;
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
          {isDeadlineInPast(deadline) ? (
            <span className="border flex focus:outline-none font-medium justify-center px-3 py-1 rounded-md shadow-sm text-red-500">
              You can't set that time
            </span>
          ) : (
            <Button expand text="Set" type="submit" variant="primary"/>
          )}
        </div>
      </form>
    </Modal>
  )
}