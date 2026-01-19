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
import { GenreService } from "./services/genre.service.ts";
import type { GenreCreateRequest, GenreType } from "./types/genre.type.ts";
import { GenreRouting } from "./routes/genre.route.ts";
import GenreDialog from "./components/GenreDialog.tsx";


function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <Stack direction="row" spacing={2}>
            <Typography component="div" sx={{ width: 140 }} color="text.secondary">{label}</Typography>
            <Typography component="div" sx={{ flex: 1 }}>{value}</Typography>
        </Stack>
    );
}


export default function GenrePage() {
    const { idGenre } = useParams();
    const [row, setRow] = useState<GenreType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);

    const load = useCallback(async () => {
        if(!idGenre) return;
        setLoading(true); setError(null);
        try {
            const data = await GenreService.getGenre(idGenre).then((res) => res.data);
            setRow(data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? "Failed to load");
        } finally {
            setLoading(false);
        }
    }, [idGenre]);

    useEffect(() => { load(); }, [load]);

    const doDelete = async () => {
        if (!row) return;
        if (!confirm(`Delete genre "${row.name}"?`)) return;
        await GenreService.deleteGenre(row.idGenre || '');
        window.history.back();
    };

    if (loading) return (
        <Box>
            <Header
                past={ [{label: "Genres", url: GenreRouting.pathGenres()}] }
                current={ "Genre" }
            />

            <Box>
                <Typography>Loading…</Typography>
            </Box>
        </Box>
    );
    if (error) return (
        <Box>
            <Header
                past={ [{label: "Genres", url: GenreRouting.pathGenres()}] }
                current={ "Genre" }
            />

            <Box>
                <Typography color="error">{error}</Typography>
            </Box>
        </Box>
    );
    if (!row) return (
        <Box>
            <Header
                past={ [{label: "Genres", url: GenreRouting.pathGenres()}] }
                current={ "Genre" }
            />

            <Box>
                <Typography>Not found</Typography>
            </Box>
        </Box>
    );

    return (
        <Box>
            <Header
                past={ [{label: "Genres", url: GenreRouting.pathGenres()}] }
                current={ "Genre" }
            />

            <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
                        Back
                    </Button>
                    <Typography variant="h5" sx={{ flex: 1 }}>Genre</Typography>
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
                            <Row label="ID" value={row.idGenre} />
                            <Row label="Name" value={row.name} />
                        </Stack>
                    </CardContent>
                </Card>

                <GenreDialog
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    initial={row}
                    onSave={async (payload: GenreCreateRequest) => {
                        await GenreService.putGenre(row.idGenre || '', payload);
                        await load();
                    }}
                />
            </Box>
        </Box>
    );
}
