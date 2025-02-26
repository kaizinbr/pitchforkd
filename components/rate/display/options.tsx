import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import useScrollDirection from "@/hooks/useScrollDirection";
import Icon from "@/components/ui/Icon";
import { LoadingSm } from "@/components/tutorial/loading";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function DeleteBtn({ id }: { id: string }) {
    const supabase = createClient();
    const router = useRouter()
    const scrollDirection = useScrollDirection();

    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);

    async function handleDelete(id: string) {
        setLoading(true);   
        console.log("Deleting:", id);

        const response = await supabase.from("ratings").delete().eq("id", id);

        console.log(response);

        if (response.error) {
            console.error(response.error);
            return;
        }

        if (response.status == 204) {
            console.log("deletado com sucesso!");
            router.push('/me')
        }

        setLoading(false);
    }

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                centered
                classNames={{
                    root: "!z-[1999]",
                    overlay: "!z-[1998]",
                    inner: "!z-[1999]",
                    content: "!bg-bunker-800 !rounded-xl",
                    header: "!bg-bunker-800 !rounded-xl",
                }}
                withCloseButton={false}
            >
                {loading && (
                    <div className="left-0 right-0 top-0 bottom-0 bg-black/60 flex items-center justify-center absolute">
                        <LoadingSm />
                    </div>
                )}
                <div className="w-full flex flex-row flex-wrap items-center justify-center gap-3 font-semibold py-6">
                    <h2 className="text-xl w-full text-center">
                        Deseja excluir review?
                    </h2>
                    <button
                        className="bg-green-pastel cursor-pointer text-white rounded-xl py-2 px-6"
                        onClick={close}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-red-500 cursor-pointer text-white rounded-xl py-2 px-6"
                        onClick={() => handleDelete(id)}
                    >
                        Excluir
                    </button>
                </div>
            </Modal>
            <button
                onClick={open}
                className={`
                    p-3
                    flex justify-center items-center
                    bg-orange-safety border-2 border-orange-safety   text-white font-bold rounded-full
                    fixed right-36
                    ${scrollDirection > "down" ? "bottom-20" : "bottom-4"}
                    md:bottom-4 shadow-md cursor-pointer
                    transition-all duration-300
                `}
            >
                <Icon type="trash" className="cursor-pointer size-6" />
            </button>
        </>
    );
}