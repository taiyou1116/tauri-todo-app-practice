// Listの名前を変更するモーダルダイアログを作成

import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";

import { useState } from "react";

type RenameListModalProps = {
    onClose: () => void,
    onRename: (newName: string) => void,
    open: boolean,
}

export default function RenameListModal(props: RenameListModalProps) {
    const { onClose, onRename, open } = props;
    
    const [newName, setNewName] = useState('');

    function handleRename(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (newName.length > 0) {
            onRename(newName);
            // newNameを初期化
            handleClose();
        }
    }

    function handleClose(): void {
        setNewName('');
        onClose();
    }

    return (
      <Modal open={open} onClose={() => handleClose()} title="Rename this list?">
        <form className="flex flex-col gap-2" onSubmit={(e) => handleRename(e)}>
          <Input onChange={(v) => setNewName(v)} placeholder="List name" value={newName}/>
          <div className="flex flex-row gap-2">
            <Button expand onClick={() => handleClose()} text="Cancel" />
            {/* submitが押されたときにformのonSubmitが発火する */}
            <Button expand text="Rename" type="submit" variant="primary" />
          </div>
        </form>
      </Modal>
    )
}