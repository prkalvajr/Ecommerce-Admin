"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

export const StoreModal = () => {
    const storeModal = useStoreModal();

    return (
    <Modal title="Create store"
        description="test desc"
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}>
        Future Create Store Form
    </Modal>
    );
}