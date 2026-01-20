import * as React from "react";
import { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
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
    useMediaQuery,
    Autocomplete
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {SourceService} from "../../modules/source/services/source.service.ts";
import type {SourceType} from "../../modules/source/types/source.type.ts";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Generic Interface
interface GenericUploadDialogProps {
    open: boolean;
    onClose: () => void;
    onUploaded?: () => void;

    // Configuration Props
    title?: string;
    sourceLabel?: string;
    accept?: string; // e.g., ".csv,text/csv"

    // Logic Props
    onUpload: (source: string, form: FormData) => Promise<any>;
}

export default function GenericUploadDialog(
    {
        open,
        onClose,
        onUploaded,
        title = "Upload File",
        sourceLabel = "Source",
        accept = ".csv,text/csv,.json,.jsonl,text/json,text/jsonl",
        onUpload
    }: GenericUploadDialogProps
) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // State is now generic array T[]
    const [sources, setSources] = useState<SourceType[]>([]);
    const [loadingSources, setLoadingSources] = useState(false);

    // Selected source is type T or null
    const [selectedSource, setSelectedSource] = useState<SourceType | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        // Reset state on open
        setSelectedSource(null);
        setFile(null);
        setError(null);
        setBusy(false);

        // Fetch sources using the passed prop
        (async () => {
            try {
                setLoadingSources(true);
                const data = await SourceService.getSources().then((res) => res.data);
                setSources(data);
            } catch (e: any) {
                setError(e?.message || "Failed to load sources");
            } finally {
                setLoadingSources(false);
            }
        })();
    }, [open]);

    const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
    };

    const submit = async () => {
        if (!selectedSource || !file) {
            setError(`Please select a ${sourceLabel.toLowerCase()} and choose a file.`);
            return;
        }
        try {
            setBusy(true);
            setError(null);

            // Delegate the actual upload logic to the parent
            const form = new FormData();
            form.append("file", file);
            await onUpload(selectedSource.idSource, form);

            onClose();
            onUploaded?.();
        } catch (e: any) {
            // Handle Axios errors or standard JS errors genericallly
            const msg = e?.response?.data?.message ?? e?.message ?? "Upload failed";
            setError(msg);
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
            fullScreen={fullScreen}
            slots={{ transition: Transition }}
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        borderRadius: { xs: 0, sm: 3 },
                        overflow: "hidden",
                        border: 1,
                        borderColor: "divider",
                    },
                },
            }}
        >
            <Stack direction="row" alignItems="center" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }} spacing={1.5}>
                <Avatar sx={{ width: 36, height: 36 }}>
                    <UploadFileOutlinedIcon fontSize="small" />
                </Avatar>
                <DialogTitle sx={{ p: 0, flexGrow: 1, fontWeight: 700 }}>{title}</DialogTitle>
                <Tooltip title="Close">
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Tooltip>
            </Stack>

            <DialogContent sx={{ pt: 2 }}>
                <Stack spacing={2}>
                    <Autocomplete
                        options={sources}
                        getOptionLabel={(source) => source.name}
                        value={selectedSource}
                        onChange={(_, v) => setSelectedSource(v)}
                        loading={loadingSources}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={sourceLabel}
                                placeholder={`Select ${sourceLabel.toLowerCase()}`}
                            />
                        )}
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                        <input
                            id="generic-file-input"
                            type="file"
                            accept={accept}
                            style={{ display: "none" }}
                            onChange={onPickFile}
                        />
                        <label htmlFor="generic-file-input">
                            <Button component="span" variant="outlined">
                                Choose File
                            </Button>
                        </label>
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Selected file"
                                value={file?.name ?? ""}
                                placeholder="No file chosen"
                                fullWidth
                                size="small"
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                    },
                                }}
                            />
                        </Box>
                    </Stack>

                    {error && (
                        <Box sx={{ color: "error.main", fontSize: 14 }}>{error}</Box>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 2, pb: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={submit}
                    variant="contained"
                    disabled={busy || !selectedSource || !file}
                    startIcon={busy ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
}
