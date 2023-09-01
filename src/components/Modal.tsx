// モーダルダイアロクを出力するコンポーネント(モーダルダイアログ...画面に必要な時のみ表示するダイアログ)
// Create, Delete, Renameのもと

import { Fragment, ReactNode } from "react";
// D:ダイアログを簡単に実装できる T:アニメーションを実装
import { Dialog, Transition } from '@headlessui/react';

type ModalProps = {
    children: ReactNode, //タグの内側の要素を扱う
    onClose: () => void,
    open: boolean,
    title: string,
}

// exportしたのが、コンポーネントとして扱われる
export default function Modal(props: ModalProps) {
    const { children, onClose, open, title } = props;

    return (
        // show = trueならば表示(アニメーションしながら), as = 要素がどのコンポーネントを使用してラップされるかを指定
        // FragmentはDOMには記録されない
      <Transition show={open} as={Fragment} >
        {/* onCloseは、ダイアログの外側やescを押すと呼ばれる */}
        <Dialog onClose={() => onClose()}>
          {/* Transition.Child...実際にトランジションする要素 */}
          <Transition.Child 
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <Transition.Child 
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed flex inset-0 items-center justify-center p-4">
                <Dialog.Panel className="bg-gray-50 dark:bg-slate-600 dark:text-white p-6 rounded-md shadow-md">
                  <Dialog.Title className="mb-4">{title}</Dialog.Title>
                  {children}
                </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    )
    
}