import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Card, CardHeader, CardContent, Stack, Typography,
    IconButton, Tooltip, Button
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Header from "../../components/layout/navbar/Header.tsx";
import { SourceService } from "./services/source.service.ts";
import { type SourceType } from "./types/source.type.ts";
import { SourceRouting } from "./routes/source.route.ts";
import SourceDialog from "./components/SourceDialog.tsx";


export default function SourcesPage() {
    const navigate = useNavigate();

    const [rows, setRows] = React.useState<SourceType[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editRow, setEditRow] = React.useState<SourceType | null>(null);

    const load = React.useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const data = await SourceService.getSources().then((res) => res.data);
            setRows(data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? "Failed to load sources");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => { load(); }, [load]);

    const columns = React.useMemo<GridColDef<SourceType>[]>(() => [
        { field: "idSource", headerName: "ID", minWidth: 180, flex: 1 },
        { field: "name", headerName: "Name", minWidth: 160, flex: 1,
            renderCell: (p) => <Tooltip title={p.value ?? ""}><span>{p.value}</span></Tooltip>,
        },
        { field: "description", headerName: "Description", minWidth: 220, flex: 1.4,
            renderCell: (p) => (
                <Tooltip title={p.value ?? ""}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {p.value}
          </span>
                </Tooltip>
            ),
        },
        {
            field: "actions", headerName: "Actions", width: 160, sortable: false, filterable: false,
            renderCell: (p) => (
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Open details">
                        <IconButton size="small" onClick={() => window.location.assign(`/sources/${p.row.idSource}`)}>
                            <OpenInNewIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => { setEditRow(p.row); setDialogOpen(true); }}>
                            <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={async () => {
                                if (!confirm(`Delete source "${p.row.name}"?`)) return;
                                await SourceService.deleteSource(p.row.idSource || '');
                                load();
                            }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ], [load]);

    return (
        <Box>
            <Header past={ [] } current={ "Sources" } />

            <Box>
                <Card>
                    <CardHeader
                        title="Sources"
                        action={
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => { setEditRow(null); setDialogOpen(true); }}
                            >
                                Add Source
                            </Button>
                        }
                    />
                    <CardContent>
                        <div style={{ height: 560, width: "100%" }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                getRowId={(r) => r.idSource || ''}
                                loading={loading}
                                hideFooter
                                disableRowSelectionOnClick
                                onRowDoubleClick={(p) => navigate(SourceRouting.pathSource(p.row.idSource))}
                            />
                        </div>
                        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                    </CardContent>
                </Card>

                {/* Add/Edit dialog */}
                <SourceDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    initial={editRow ?? undefined}
                    onSave={async (payload) => {
                        if (editRow) await SourceService.putSource(editRow.idSource || '', payload);
                        else await SourceService.postSource(payload);
                        await load();
                    }}
                />
            </Box>
        </Box>
    );
}