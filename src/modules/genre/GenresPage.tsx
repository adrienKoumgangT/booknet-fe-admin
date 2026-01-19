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
import RefreshIcon from "@mui/icons-material/Refresh";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import type { GridPaginationModel } from "@mui/x-data-grid-pro";
import GenericUploadDialog from "../../components/upload/GenericUploadDialog.tsx";
import Header from "../../components/layout/navbar/Header.tsx";
import GenreDialog from "./components/GenreDialog.tsx";
import { GenreService } from "./services/genre.service.ts";
import type { GenreType } from "./types/genre.type.ts";
import { GenreRouting } from "./routes/genre.route.ts";


export default function GenresPage() {
    const navigate = useNavigate();

    // DataGrid uses zero-based page index
    const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
        page: 0,
        pageSize: 25,
    });

    const [rows, setRows] = React.useState<GenreType[]>([]);
    const [rowCount, setRowCount] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogUploadOpen, setDialogUploadOpen] = React.useState(false);
    const [editRow, setEditRow] = React.useState<GenreType | null>(null);

    const load = React.useCallback(async (page: number, pageSize: number) => {
        setLoading(true); setError(null);
        try {
            const data = await GenreService.getGenres(page, pageSize)
                .then((res) => res.data);
            setPaginationModel({page: data?.currentPage, pageSize: data?.pageSize});
            setRows(data?.content || []);
            setRowCount(data?.content.length);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? "Failed to load genres");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        load(paginationModel.page, paginationModel.pageSize);
        }, [load, paginationModel.page, paginationModel.pageSize]);

    const columns = React.useMemo<GridColDef<GenreType>[]>(() => [
        { field: "idGenre", headerName: "ID", minWidth: 180, flex: 1 },
        { field: "name", headerName: "Name", minWidth: 160, flex: 1,
            renderCell: (p) => <Tooltip title={p.value ?? ""}><span>{p.value}</span></Tooltip>,
        },
        {
            field: "actions", headerName: "Actions", width: 160, sortable: false, filterable: false,
            renderCell: (p) => (
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Open details">
                        <IconButton size="small" onClick={() => window.location.assign(`/genres/${p.row.idGenre}`)}>
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
                                if (!confirm(`Delete Genre "${p.row.name}"?`)) return;
                                await GenreService.deleteGenre(p.row.idGenre || '');
                                load(paginationModel.page, paginationModel.pageSize);
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
            <Header past={[]} current={"Genres"}/>

            <Box>
                <Card>
                    <CardHeader
                        title="Genres"
                        action={
                            <Stack direction="row" spacing={1}>
                                <Button
                                    startIcon={<RefreshIcon />}
                                    onClick={() => load(paginationModel.page, paginationModel.pageSize)}
                                >
                                    Refresh
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<UploadFileOutlinedIcon />}
                                    onClick={() => setDialogUploadOpen(true)}
                                >
                                    Upload File
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon/>}
                                    onClick={() => {
                                        setEditRow(null);
                                        setDialogOpen(true);
                                    }}
                                >
                                    Add Genre
                                </Button>
                            </Stack>
                        }
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Total: {rowCount.toLocaleString()}
                        </Typography>
                        <div style={{height: 640, width: "100%"}}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                getRowId={(r) => r.idGenre || ''}
                                loading={loading}
                                rowCount={rowCount}
                                paginationMode="server"
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                pageSizeOptions={[10, 25, 50, 100]}
                                disableRowSelectionOnClick
                                onRowDoubleClick={(p) => navigate(GenreRouting.pathGenre(p.row.idGenre))}
                            />
                        </div>
                        {error && <Typography color="error" sx={{mt: 1}}>{error}</Typography>}
                    </CardContent>
                </Card>

                {/* Add/Edit dialog */}
                <GenreDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    initial={editRow ?? undefined}
                    onSave={async (payload) => {
                        if (editRow) await GenreService.putGenre(editRow.idGenre || '', payload);
                        else await GenreService.postGenre(payload);
                        await load(paginationModel.page, paginationModel.pageSize);
                    }}
                />

                <GenericUploadDialog
                    open={dialogUploadOpen}
                    onClose={() => setDialogUploadOpen(false)}
                    onUpload={GenreService.uploadGenre}
                    onUploaded={() => {load(paginationModel.page, paginationModel.pageSize);}}
                />
            </Box>
        </Box>
    );
}