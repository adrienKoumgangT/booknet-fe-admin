import Avatar from "@mui/material/Avatar";
import type {NotificationAuthor} from "../types/notificationAuthor.ts";


export default function NotificationAvatar(props: {author: NotificationAuthor}) {
    return (
        <Avatar
            key={props.author.idUser}
            alt={props.author.name}
            src={props.author.imageUrl}
            sx={{ width: 36, height: 36 }}
        />
    );
}
