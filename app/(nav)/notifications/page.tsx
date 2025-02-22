import NotsPage from "@/components/notifications/main-nots";

export const metadata = {
    title: "Notificações | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default function Notifications() {
    return (
        <div className="flex flex-col gap-4 items-center relative mb-16 px-5 pt-16">
            <NotsPage />
        </div>
    );
}
