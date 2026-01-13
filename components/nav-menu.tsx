import { Menu, Button, Text } from "@mantine/core";
import { Settings, LogOut } from "lucide-react";
import { TbUserFilled } from "react-icons/tb";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Avatar from "@/components/ui/Avatar";

export default function NavMenu({
    username,
    name,
    avatarUrl,
}: {
    username: string | null;
    name: string | null;
    avatarUrl: string | null;
}) {
    const pathname = usePathname();
    const [opened, setOpened] = useState(false);

    return (
        <Menu opened={opened} onChange={setOpened} shadow="md" width={200}>
            <Menu.Target>
                <button>
                    <div
                        data-active={
                            pathname === "/me" || pathname === `${username}`
                        }
                        className={`
                                flex basis-0 cursor-pointer
                                flex-row items-center gap-2
                                py-3 pl-4
                                data-[active=true]:text-main-500
                                hover:text-main-500
                                transition-all duration-200 ease-in-out
                            `}
                    >
                        {avatarUrl ? (
                            <>
                                <div className="flex flex-col items-end justify-center">
                                    <span className="text-xs font-semibold">
                                        {name}
                                    </span>
                                    <span className="text-[10px] font-light">
                                        {`@${username}`}
                                    </span>
                                </div>
                                <Avatar
                                    size={36}
                                    src={avatarUrl}
                                    isIcon={true}
                                />
                            </>
                        ) : (
                            <TbUserFilled className="size-6" />
                        )}
                    </div>
                </button>
            </Menu.Target>

            <Menu.Dropdown className={`
                    !rounded-xl
                    !backdrop-blur-xl !bg-shark-950/70
                `}>
                <Menu.Item leftSection={<Settings size={14} />}>
                    Configurações
                </Menu.Item>

                <Menu.Item color="red" leftSection={<LogOut size={14} />}>
                    Sair
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
