import { Edit } from "@mui/icons-material";
import { Container, Stack, Divider, IconButton, DialogContent, Button, DialogActions, Dialog, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";

export default function Classes() {
    const [dialogMode, setDialogMode] = useState("add");
    const [open, setOpen] = useState(false);
    const [selectedClasse, setSelectedClasse] = useState({
        idCl: "",
        niveau: ""
    });
    const [classes, setClasses] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/classes")
            .then((response) => response.json())
            .then((data) => setClasses(data))
            .catch((error) => console.log(error));
    }, []);

    const addClasse = (classe) => {
        delete classe.idCl;
        fetch("http://localhost:8080/classes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(classe)
        })
            .then((response) => response.json())
            .then((data) => setClasses((prevState) => [...prevState, data]))
            .catch((error) => console.log(error));
    };

    const updateClasse = (classe) => {
        fetch(`http://localhost:8080/classes/${classe.idCl}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(classe)
        })
            .then((response) => response.json())
            .then((data) => setClasses((prevState) => prevState.map((row) => (row.idCl === data.idCl ? data : row))))
            .catch((error) => console.log(error));
    };

    const deleteClasse = (idCl) => {
        fetch(`http://localhost:8080/classes/${idCl}`, {
            method: "DELETE"
        })
            .then(() => setClasses((prevState) => prevState.filter((row) => row.idCl !== idCl)))
            .catch((error) => console.log(error));
    };

    const handleEditClick = (selectedRow) => {
        setDialogMode("edit");
        setSelectedClasse(selectedRow);
        setOpen(true);
    };

    const handleAddClick = () => {
        setDialogMode("add");
        setSelectedClasse({ idCl: "", niveau: "" });
        setOpen(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedClasse((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDeleteClick = (idCl) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette classe?")) {
            deleteClasse(idCl);
        }
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleSaveClick = () => {
        if (dialogMode === "add") {
            addClasse(selectedClasse);
        } else {
            updateClasse(selectedClasse);
        }
        setOpen(false);
    };

    const columns = [
        { field: "idCl", headerName: "ID", flex: 0.1 },
        { field: "niveau", headerName: "Niveau", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            renderCell: (params) => {
                return(
                    <div>
                        <IconButton onClick={() => handleEditClick(params.row)}>
                            <Edit color="warning" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(params.row.idCl)}>
                            <GridDeleteIcon color="error" />
                        </IconButton>
                    </div> 
                )
            },
        }
    ];

    return (
        <Container>
            <Divider style={{ marginBottom: 20, marginTop: 20 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Classes
                </Typography>
            </Divider>
            <Stack>
                <Dialog open={open} onClose={handleDialogClose}>
                    <DialogTitle>
                        {dialogMode === "add" ? "Ajouter une classe" : "Modifier une classe"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Remplissez les champs suivants pour {dialogMode === "add" ? "ajouter" : "modifier"} une classe.
                        </DialogContentText>
                        <TextField margin="dense" name="niveau" label="Niveau" type="text" fullWidth value={selectedClasse.niveau} onChange={handleInputChange} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Annuler</Button>
                        <Button onClick={handleSaveClick} color="success">Sauvgarder</Button>
                    </DialogActions>
                </Dialog>
                <DataGrid
                    rows={classes}
                    columns={columns}
                    autoHeight={true}
                    getRowId={(row) => row.idCl}
                />
                <Button style={{marginBottom: 20, marginTop: 20}} color="success" variant="contained" onClick={() => handleAddClick()}>
                    Ajouter
                </Button>
            </Stack>
        </Container>
    );
}
