// Listを作るダイアログを表示するコンポーネントを作成

// exportされたコンポーネントは、タグとして使用できる
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";

type CreateListModalProps = {
    onClose: () => void,
    onCreate: (name: string) => void,
    open: boolean,
}

export default function CreateListModal(props: CreateListModalProps) {
    const { onClose, onCreate, open } = props;

    const [listName, setListName] = useState('');

    // 新しいListの作成
    function handleCreate(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        if (listName.length > 0) {
            onCreate(listName);
            handleClose();
        }
    }

    function handleClose(): void {
        setListName('');
        onClose();
    }

    return (
      <Modal
        open={open}
        onClose={() => handleClose()}
        title="Create n new to-do list"
        // childrenはReactNode型(Modalタグの内側を要素として取る)
      >
        <form className="flex flex-col gap-2" onSubmit={(e) => handleCreate(e)}>
          <Input 
            onChange={(v: string) => setListName(v)}
            placeholder="List name"
            value={listName}
          />
          <div className="flex flex-row justify-center gap-2">
            <Button expand onClick={() => handleClose()} text="Cancel"/>
            <Button expand text="Create" type="submit" variant="primary"/>
          </div>
        </form>
      </Modal>
    )
}