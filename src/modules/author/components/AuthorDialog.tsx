import * as React from "react";
import { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    CircularProgress,
    useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Slide from "@mui/material/Slide";
import { type TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import SourceIcon from "@mui/icons-material/Source";
import type { AuthorCreateRequest, AuthorType } from "../types/author.type.ts";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface FormState {
    name: string;
    description?: string;
    imageUrl?: string;
    books?: string[]; // Explicitly setting this as a string array
}

interface AuthorDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (payload: AuthorCreateRequest) => Promise<void> | void;
    initial?: Partial<AuthorType>; // if present -> edit
}

export default function AuthorDialog(
    {
        open,
        onClose,
        onSave,
        initial,
    }: AuthorDialogProps
) {
    const theme = useTheme();
    const full = useMediaQuery(theme.breakpoints.down("sm"));
    const [busy, setBusy] = useState(false);
    const [form, setForm] = useState<FormState>({ name: "", description: "", imageUrl: "", books: [] });
    const [errors, setErrors] = useState<{ name?: string }>({});

    useEffect(() => {
        if (open) {
            setForm({
                name: initial?.name ?? "",
                description: initial?.description ?? "",
                imageUrl: initial?.imageUrl ?? "",
                books: initial?.books?.map(b => b.idBook) ?? [],
            });
            setBusy(false);
            setErrors({});
        }
    }, [open, initial]);

    const validate = () => {
        const next: { name?: string } = {};
        if (!form.name.trim()) next.name = "Name is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;
        try {
            setBusy(true);
            await onSave({
                name: form.name.trim(),
                description: form.description?.trim() ?? "",
                imageUrl: form.imageUrl?.trim() ?? "",
                books: form.books ?? []
            });
            onClose();
        } finally {
            setBusy(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            fullScreen={full}
            slots={{ transition: Transition }}
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: { border: 1, borderColor: "divider", borderRadius: { xs: 0, sm: 3 } },
                },
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
                <Avatar sx={{ width: 36, height: 36 }}><SourceIcon fontSize="small" /></Avatar>
                <DialogTitle sx={{ p: 0, flex: 1, fontWeight: 700 }}>
                    {initial?.idAuthor ? "Edit Author" : "Add Author"}
                </DialogTitle>
                <Tooltip title="Close"><IconButton onClick={onClose}><CloseIcon /></IconButton></Tooltip>
            </Stack>

            <DialogContent sx={{ pt: 2 }}>
                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Description"
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        multiline
                        minRows={3}
                        slotProps={{ input: { inputProps: { maxLength: 1000 } } }}
                    />
                    <TextField
                        label="Image Url"
                        value={form.imageUrl}
                        onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 2, pb: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={submit}
                    disabled={busy}
                    startIcon={busy ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
