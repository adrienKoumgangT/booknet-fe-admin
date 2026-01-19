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
import SourceDialog from "./components/SourceDialog.tsx";
import type { SourceCreateRequest, SourceType } from "./types/source.type.ts";
import { SourceService } from "./services/source.service.ts";
import { SourceRouting } from "./routes/source.route.ts";


function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <Stack direction="row" spacing={2}>
            <Typography component="div" sx={{ width: 140 }} color="text.secondary">{label}</Typography>
            <Typography component="div" sx={{ flex: 1 }}>{value}</Typography>
        </Stack>
    );
}


export default function SourcePage() {
    const { idSource } = useParams();
    const [row, setRow] = useState<SourceType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);

    const load = useCallback(async () => {
        if(!idSource) return;
        setLoading(true); setError(null);
        try {
            const data = await SourceService.getSource(idSource).then((res) => res.data);
            setRow(data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? "Failed to load");
        } finally {
            setLoading(false);
        }
    }, [idSource]);

    useEffect(() => { load(); }, [load]);

    const doDelete = async () => {
        if (!row) return;
        if (!confirm(`Delete source "${row.name}"?`)) return;
        await SourceService.deleteSource(row.idSource || '');
        window.history.back();
    };

    if (loading) return (
        <Box>
            <Header
                past={ [{label: "Sources", url: SourceRouting.pathSources()}] }
                current={ "Source" }
            />

            <Box>
                <Typography>Loading…</Typography>
            </Box>
        </Box>
    );
    if (error) return (
        <Box>
            <Header
                past={ [{label: "Sources", url: SourceRouting.pathSources()}] }
                current={ "Source" }
            />

            <Box>
                <Typography color="error">{error}</Typography>
            </Box>
        </Box>
    );
    if (!row) return (
        <Box>
            <Header
                past={ [{label: "Sources", url: SourceRouting.pathSources()}] }
                current={ "Source" }
            />

            <Box>
                <Typography>Not found</Typography>
            </Box>
        </Box>
    );

    return (
        <Box>
            <Header
                past={ [{label: "Sources", url: SourceRouting.pathSources()}] }
                current={ "Source" }
            />

            <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
                        Back
                    </Button>
                    <Typography variant="h5" sx={{ flex: 1 }}>Source</Typography>
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
                            <Row label="ID" value={row.idSource} />
                            <Row label="Name" value={row.name} />
                            <Row label="Description" value={row.description || "—"} />
                        </Stack>
                    </CardContent>
                </Card>

                <SourceDialog
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    initial={row}
                    onSave={async (payload: SourceCreateRequest) => {
                        await SourceService.putSource(row.idSource || '', payload);
                        await load();
                    }}
                />
            </Box>
        </Box>
    );
}
