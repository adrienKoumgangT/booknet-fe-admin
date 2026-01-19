import * as React from "react";
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Stack,
    Typography,
    Button,
    Tooltip
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "../../components/layout/navbar/Header.tsx";
import {AuthorService} from "./services/author.service.ts";
import type { AuthorCreateRequest, AuthorType } from "./types/author.type.ts";
import { AuthorRouting } from "./routes/author.route.ts";
import AuthorDialog from "./components/AuthorDialog.tsx";


function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <Stack direction="row" spacing={2}>
            <Typography component="div" sx={{ width: 140 }} color="text.secondary">{label}</Typography>
            <Typography component="div" sx={{ flex: 1 }}>{value}</Typography>
        </Stack>
    );
}


export default function AuthorPage() {
    const { idAuthor } = useParams();
    const [row, setRow] = useState<AuthorType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);

    const load = useCallback(async () => {
        if(!idAuthor) return;
        setLoading(true); setError(null);
        try {
            const data = await AuthorService.getAuthor(idAuthor).then((res) => res.data);
            setRow(data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? "Failed to load");
        } finally {
            setLoading(false);
        }
    }, [idAuthor]);

    useEffect(() => { load(); }, [load]);

    const doDelete = async () => {
        if (!row) return;
        if (!confirm(`Delete author "${row.name}"?`)) return;
        await AuthorService.deleteAuthor(row.idAuthor || '');
        window.history.back();
    };

    if (loading) return (
        <Box>
            <Header
                past={ [{label: "Authors", url: AuthorRouting.pathAuthors()}] }
                current={ "Author" }
            />

            <Box>
                <Typography>Loading…</Typography>
            </Box>
        </Box>
    );
    if (error) return (
        <Box>
            <Header
                past={ [{label: "Authors", url: AuthorRouting.pathAuthors()}] }
                current={ "Author" }
            />

            <Box>
                <Typography color="error">{error}</Typography>
            </Box>
        </Box>
    );
    if (!row) return (
        <Box>
            <Header
                past={ [{label: "Authors", url: AuthorRouting.pathAuthors()}] }
                current={ "Author" }
            />

            <Box>
                <Typography>Not found</Typography>
            </Box>
        </Box>
    );

    return (
        <Box>
            <Header
                past={ [{label: "Authors", url: AuthorRouting.pathAuthors()}] }
                current={ "Author" }
            />

            <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
                        Back
                    </Button>
                    <Typography variant="h5" sx={{ flex: 1 }}>Author</Typography>
                    <Tooltip title="Edit">
                        <Button startIcon={<EditOutlinedIcon />} onClick={() => setEditOpen(true)}>
                            Edit
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={doDelete}>
                            Delete
                        </Button>
                    </Tooltip>
                </Stack>

                <Card>
                    <CardHeader title="Details" />
                    <CardContent>
                        <Stack spacing={1.2}>
                            <Row label="ID" value={row.idAuthor} />
                            <Row label="Name" value={row.name} />
                            <Row label="Description" value={row.description || "—"} />
                            <Row label="Image Url" value={row.imageUrl || "—"} />
                        </Stack>
                    </CardContent>
                </Card>

                <AuthorDialog
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    initial={row}
                    onSave={async (payload: AuthorCreateRequest) => {
                        await AuthorService.putAuthor(row.idAuthor || '', payload);
                        await load();
                    }}
                />
            </Box>
        </Box>
    );
}
