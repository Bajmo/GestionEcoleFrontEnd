import { Edit } from "@mui/icons-material";
import { Container, Stack, Divider, IconButton, DialogContent, Button, DialogActions, Dialog, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";

export default function Salles() {
    const [dialogMode, setDialogMode] = useState("add");
    const [open, setOpen] = useState(false);
    const [selectedSalle, setSelectedSalle] = useState({
        numero: "",
        libelle: "",
        cours: "",
    });
    const [salles, setSalles] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/salles")
            .then((response) => response.json())
            .then((data) => setSalles(data))
            .catch((error) => console.log(error));
    }, []);

    const addSalle = (salle) => {
        console.log(salle);
        fetch("http://localhost:8080/salles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(salle)
        })
            .then((response) => response.json())
            .then((data) => setSalles((prevState) => [...prevState, data]))
            .catch((error) => console.log(error));
    };

    const updateSalle = (salle) => {
        console.log(salle);
        fetch(`http://localhost:8080/salles/${salle.numero}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(salle)
        })
            .then((response) => response.json())
            .then((data) => setSalles((prevState) => prevState.map((row) => (row.numero === data.numero ? data : row))))
            .catch((error) => console.log(error));
    };

    const deleteSalle = (numero) => {
        fetch(`http://localhost:8080/salles/${numero}`, {
            method: "DELETE"
        })
            .then(() => setSalles((prevState) => prevState.filter((row) => row.numero !== numero)))
            .catch((error) => console.log(error));
    };

    const handleEditClick = (selectedRow) => {
        setDialogMode("edit");
        setSelectedSalle(selectedRow);
        setOpen(true);
    };

    const handleAddClick = () => {
        setDialogMode("add");
        setSelectedSalle({ numero: "", niveau: "" });
        setOpen(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedSalle((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDeleteClick = (numero) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce salle?")) {
            deleteSalle(numero);
        }
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleSaveClick = () => {
        if (dialogMode === "add") {
            addSalle(selectedSalle);
        } else {
            updateSalle(selectedSalle);
        }
        setOpen(false);
    };

    const columns = [
        { field: "numero", headerName: "Numéro", flex: 0.2 },
        { field: "libelle", headerName: "Libellé", flex: 1 },
        { field: "cours", headerName: "Cours", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            renderCell: (params) => {
                return(
                    <div>   
                        <IconButton onClick={() => handleEditClick(params.row)}>
                            <Edit color="warning" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(params.row.numero)}>
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
                    Salles
                </Typography>
            </Divider>
            <Stack>
                <Dialog open={open} onClose={handleDialogClose}>
                    <DialogTitle>
                        {dialogMode === "add" ? "Ajouter un salle" : "Modifier une salle"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Remplissez les champs suivants pour {dialogMode === "add" ? "ajouter" : "modifier"} une salle.
                        </DialogContentText>
                        <TextField margin="dense" name="libelle" label="Libellé" type="text" fullWidth value={selectedSalle.libelle} onChange={handleInputChange} />
                        <TextField margin="dense" name="cours" label="Cours" type="text" fullWidth value={selectedSalle.cours} onChange={handleInputChange} />
                    </DialogContent>
                    <DialogActions> 
                        <Button onClick={handleDialogClose}>Annuler</Button>
                        <Button onClick={handleSaveClick} color="success">Sauvgarder</Button>
                    </DialogActions>
                </Dialog>
                <DataGrid
                    rows={salles}
                    columns={columns}
                    autoHeight={true}
                    getRowId={(row) => row.numero}
                />
                <Button style={{marginBottom: 20, marginTop: 20}} color="success" variant="contained" onClick={() => handleAddClick()}>
                    Ajouter
                </Button>
            </Stack>
        </Container>
    );
}
