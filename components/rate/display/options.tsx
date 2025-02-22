import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
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
                    fixed right-20
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

// export default function Options({
//     user,
//     id,
//     rating_id,
//     owner_id,
//     className,
// }: {
//     user?: User;
//     id: string;
//     rating_id: string;
//     owner_id: string;
//     className?: string;
// }) {
//     async function handleLike({
//         rating_id,
//         owner_id,
//     }: {
//         rating_id: string;
//         owner_id: string;
//     }) {
//         const supabase = createClient();

//         const {
//             data: { user },
//         } = await supabase.auth.getUser();

//         if (!user) {
//             console.error("User not logged in");
//             return;
//         }

//         const { data, error } = await supabase
//             .from("likes")
//             .select("*")
//             .eq("user_id", user.id)
//             .eq("rating_id", rating_id);

//         if (error) {
//             console.error(error);
//             return;
//         }

//         if (data.length) {
//             await supabase
//                 .from("likes")
//                 .delete()
//                 .eq("user_id", user.id)
//                 .eq("rating_id", rating_id);

//             await supabase
//                 .from("notifications")
//                 .delete()
//                 .eq("user_id", owner_id)
//                 .eq("sender_id", user.id)
//                 .eq("rating_id", rating_id);

//             // setLiked(false);
//         } else {
//             await supabase.from("likes").insert([
//                 {
//                     user_id: user.id,
//                     user_profile: user.id,
//                     rating_id: rating_id,
//                 },
//             ]);

//             await supabase.from("notifications").insert([
//                 {
//                     user_id: owner_id,
//                     sender_id: user.id,
//                     rating_id: rating_id,
//                 },
//             ]);

//             // setLiked(true);
//         }
//     }

//     return (
//         <Menu
//             shadow="md"
//             width={200}
//             position="bottom-end"
//             classNames={{
//                 dropdown: "!bg-bunker-800 !border-bunker-700 !rounded-xl",
//                 item: "!hover:bg-bunker-700 transition-all duration-200",
//                 label: "text-white",
//             }}
//         >
//             <Menu.Target>
//                 <button className="flex items-center justify-center size-6 absolute top-5 right-5">
//                     <TbDotsVertical />
//                 </button>
//             </Menu.Target>

//             <Menu.Dropdown>
//                 {/* <Menu.Label>Application</Menu.Label> */}
//                 <Menu.Item>Editar</Menu.Item>
//                 <Menu.Item>Compartilhar</Menu.Item>
//                 <Menu.Item>Ver autor</Menu.Item>
//                 <Menu.Item>Search</Menu.Item>
//             </Menu.Dropdown>
//         </Menu>
//         // <button
//         //     onClick={() => handleLike({rating_id, owner_id})}
//         //     className={`
//         //         flex items-center justify-center z-50 cursor-pointer
//         //         transition-all duration-200 ease-in-out
//         //         ${size === "sm" ? "h-6 w-6" : "size-6"}
//         //         ${className}
//         //     `}
//         // >
//         //     <Icon type="heart" className={`
//         //             transition-all duration-200 ease-in-out
//         //             ${liked ? "text-red-500" : "text-gray-500"}
//         //         `} />
//         // </button>
//     );
// }
