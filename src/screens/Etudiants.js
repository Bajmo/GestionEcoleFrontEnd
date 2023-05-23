import { Edit } from "@mui/icons-material";
import { Container, Stack, Divider, IconButton, DialogContent, Button, DialogActions, Dialog, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";

export default function Etudiants() {
    const [dialogMode, setDialogMode] = useState("add");
    const [open, setOpen] = useState(false);
    const [selectedEtudiant, setSelectedEtudiant] = useState({
        idE: "",
        nom: "",
        classe: "",
    });
    const [etudiants, setEtudiants] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/etudiants")
            .then((response) => response.json())
            .then((data) => setEtudiants(data))
            .catch((error) => console.log(error));
    }, []);

    const addEtudiant = (etudiant) => {
        console.log(etudiant);
        fetch("http://localhost:8080/etudiants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(etudiant)
        })
            .then((response) => response.json())
            .then((data) => setEtudiants((prevState) => [...prevState, data]))
            .catch((error) => console.log(error));
    };

    const updateEtudiant = (etudiant) => {
        console.log(etudiant);
        fetch(`http://localhost:8080/etudiants/${etudiant.idE}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(etudiant)
        })
            .then((response) => response.json())
            .then((data) => setEtudiants((prevState) => prevState.map((row) => (row.idE === data.idE ? data : row))))
            .catch((error) => console.log(error));
    };

    const deleteEtudiant = (idE) => {
        fetch(`http://localhost:8080/etudiants/${idE}`, {
            method: "DELETE"
        })
            .then(() => setEtudiants((prevState) => prevState.filter((row) => row.idE !== idE)))
            .catch((error) => console.log(error));
    };

    const handleEditClick = (selectedRow) => {
        setDialogMode("edit");
        setSelectedEtudiant(selectedRow);
        setOpen(true);
    };

    const handleAddClick = () => {
        setDialogMode("add");
        setSelectedEtudiant({ idE: "", niveau: "" });
        setOpen(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedEtudiant((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDeleteClick = (idE) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce etudiant?")) {
            deleteEtudiant(idE);
        }
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleSaveClick = () => {
        if (dialogMode === "add") {
            addEtudiant(selectedEtudiant);
        } else {
            updateEtudiant(selectedEtudiant);
        }
        setOpen(false);
    };

    const columns = [
        { field: "idE", headerName: "ID", flex: 0.1 },
        { field: "nom", headerName: "Nom", flex: 1 },
        { field: "classe", headerName: "Classe", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            renderCell: (params) => {
                return(
                    <div>
                        <IconButton onClick={() => handleEditClick(params.row)}>
                            <Edit color="warning" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(params.row.idE)}>
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
                    Étudiants
                </Typography>
            </Divider>
            <Stack>
                <Dialog open={open} onClose={handleDialogClose}>
                    <DialogTitle>
                        {dialogMode === "add" ? "Ajouter un etudiant" : "Modifier un etudiant"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Remplissez les champs suivants pour {dialogMode === "add" ? "ajouter" : "modifier"} un etudiant.
                        </DialogContentText>
                        <TextField margin="dense" name="nom" label="Nom" type="text" fullWidth value={selectedEtudiant.nom} onChange={handleInputChange} />
                        <TextField margin="dense" name="classe" label="Classe" type="text" fullWidth value={selectedEtudiant.classe} onChange={handleInputChange} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Annuler</Button>
                        <Button onClick={handleSaveClick} color="success">Sauvgarder</Button>
                    </DialogActions>
                </Dialog>
                <DataGrid
                    rows={etudiants}
                    columns={columns}
                    autoHeight={true}
                    getRowId={(row) => row.idE}
                />
                <Button style={{marginBottom: 20, marginTop: 20}} color="success" variant="contained" onClick={() => handleAddClick()}>
                    Ajouter
                </Button>
            </Stack>
        </Container>
    );
}
