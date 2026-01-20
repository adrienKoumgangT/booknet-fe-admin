import * as React from "react";
import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Autocomplete,
    CircularProgress
} from "@mui/material";
import type { BookSimpleType } from "../../book/types/book.type.ts";
import { BookService } from "../../book/services/book.service.ts";


export default function AddBookDialog({ open, onClose, onAdd, existingBookIds }: {
    open: boolean;
    onClose: () => void;
    onAdd: (book: BookSimpleType) => void;
    existingBookIds: string[];
}) {
    const [options, setOptions] = useState<BookSimpleType[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookSimpleType | null>(null);

    // Debounce search logic could be added here, currently triggers on every keystroke
    const handleInputChange = async (_: any, value: string) => {
        if (value.length < 2) {
            setOptions([]);
            return;
        }
        setLoading(true);
        try {
            const data = await BookService.getBooks(0, 100, value).then((res) => res.data);
            const results = data.content;
            setOptions(results.filter(b => !existingBookIds.includes(b.idBook)));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (selectedBook) {
            onAdd(selectedBook);
            onClose();
            setSelectedBook(null);
            setOptions([]);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Book to Author</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                <Autocomplete
                    options={options}
                    loading={loading}
                    getOptionLabel={(option) => option.title}
                    onInputChange={handleInputChange}
                    onChange={(_, value) => setSelectedBook(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Book"
                            placeholder="Type book title..."
                            fullWidth
                            variant="outlined"
                            slotProps={{
                                input: {
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                },
                            }}
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={!selectedBook} variant="contained">Add</Button>
            </DialogActions>
        </Dialog>
    );
}
