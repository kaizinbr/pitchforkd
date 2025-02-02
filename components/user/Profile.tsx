

export default function Profile ({ user }: { user: any }) {

    return (
        <div>
            <h1>{user.username}</h1>
            <p>{user.bio}</p>
        </div>
    )
}