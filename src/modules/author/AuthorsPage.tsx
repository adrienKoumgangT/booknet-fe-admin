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
import Header from "../../components/layout/navbar/Header.tsx";
import GenericUploadDialog from "../../components/upload/GenericUploadDialog.tsx";
import type { AuthorSimpleType } from "./types/author.type.ts";
import { AuthorService } from "./services/author.service.ts";
import AuthorDialog from "./components/AuthorDialog.tsx";
import {AuthorRouting} from "./routes/author.route.ts";


export default function AuthorsPage() {
    const navigate = useNavigate();

    // DataGrid uses zero-based page index
    const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
        page: 0,
        pageSize: 25,
    });

    const [rows, setRows] = React.useState<AuthorSimpleType[]>([]);
    const [rowCount, setRowCount] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogUploadOpen, setDialogUploadOpen] = React.useState(false);
    const [editRow, setEditRow] = React.useState<AuthorSimpleType | null>(null);

    const load = React.useCallback(async (page: number, pageSize: number) => {
        setLoading(true); setError(null);
        try {
            const data = await AuthorService.getAuthors(page, pageSize)
                .then((res) => res.data);
            setPaginationModel({page: data?.currentPage, pageSize: data?.pageSize});
            setRows(data?.content || []);
            setRowCount(data?.content.length);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? "Failed to load authors");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        load(paginationModel.page, paginationModel.pageSize);
    }, [load, paginationModel.page, paginationModel.pageSize]);

    const columns = React.useMemo<GridColDef<AuthorSimpleType>[]>(() => [
        { field: "idAuthor", headerName: "ID", minWidth: 180, flex: 1 },
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
        { field: "imageUrl", headerName: "Image Url", minWidth: 220, flex: 1.4,
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
                        <IconButton size="small" onClick={() => window.location.assign(`/authors/${p.row.idAuthor}`)}>
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
                                if (!confirm(`Delete Author "${p.row.name}"?`)) return;
                                await AuthorService.deleteAuthor(p.row.idAuthor || '');
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
            <Header past={[]} current={"Authors"}/>

            <Box>
                <Card>
                    <CardHeader
                        title="Authors"
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
                                    Add Author
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
                                getRowId={(r) => r.idAuthor || ''}
                                loading={loading}
                                rowCount={rowCount}
                                paginationMode="server"
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                pageSizeOptions={[10, 25, 50, 100]}
                                disableRowSelectionOnClick
                                onRowDoubleClick={(p) => navigate(AuthorRouting.pathAuthor(p.row.idAuthor))}
                            />
                        </div>
                        {error && <Typography color="error" sx={{mt: 1}}>{error}</Typography>}
                    </CardContent>
                </Card>

                {/* Add/Edit dialog */}
                <AuthorDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    initial={editRow ?? undefined}
                    onSave={async (payload) => {
                        if (editRow) await AuthorService.putAuthor(editRow.idAuthor || '', payload);
                        else await AuthorService.postAuthor(payload);
                        await load(paginationModel.page, paginationModel.pageSize);
                    }}
                />

                <GenericUploadDialog
                    open={dialogUploadOpen}
                    onClose={() => setDialogUploadOpen(false)}
                    onUpload={AuthorService.uploadAuthor}
                    onUploaded={() => {load(paginationModel.page, paginationModel.pageSize);}}
                />
            </Box>
        </Box>
    );
}
