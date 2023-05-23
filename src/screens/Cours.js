import { Edit } from "@mui/icons-material";
import { Container, Stack, Divider, IconButton, DialogContent, Button, DialogActions, Dialog, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";

export default function Cours() {
    const [dialogMode, setDialogMode] = useState("add");
    const [open, setOpen] = useState(false);
    const [selectedCours, setSelectedCours] = useState({
        idCo: "",
        titre: "",
        cours: "",
    });
    const [cours, setCours] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/cours")
            .then((response) => response.json())
            .then((data) => setCours(data))
            .catch((error) => console.log(error));
    }, []);

    const addCours = (cours) => {
        console.log(cours);
        fetch("http://localhost:8080/cours", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cours)
        })
            .then((response) => response.json())
            .then((data) => setCours((prevState) => [...prevState, data]))
            .catch((error) => console.log(error));
    };

    const updateCours = (cours) => {
        console.log(cours);
        fetch(`http://localhost:8080/cours/${cours.idCo}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cours)
        })
            .then((response) => response.json())
            .then((data) => setCours((prevState) => prevState.map((row) => (row.idCo === data.idCo ? data : row))))
            .catch((error) => console.log(error));
    };

    const deleteCours = (idCo) => {
        fetch(`http://localhost:8080/cours/${idCo}`, {
            method: "DELETE"
        })
            .then(() => setCours((prevState) => prevState.filter((row) => row.idCo !== idCo)))
            .catch((error) => console.log(error));
    };

    const handleEditClick = (selectedRow) => {
        setDialogMode("edit");
        setSelectedCours(selectedRow);
        setOpen(true);
    };

    const handleAddClick = () => {
        setDialogMode("add");
        setSelectedCours({ idCo: "", niveau: "" });
        setOpen(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedCours((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDeleteClick = (idCo) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours?")) {
            deleteCours(idCo);
        }
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleSaveClick = () => {
        if (dialogMode === "add") {
            addCours(selectedCours);
        } else {
            updateCours(selectedCours);
        }
        setOpen(false);
    };

    const columns = [
        { field: "idCo", headerName: "ID", flex: 0.1  },
        { field: "titre", headerName: "Titre", flex: 1  },
        { field: "cours", headerName: "Cours", flex: 1  },
        {
            field: "actions",
            headerName: "Actions",
            renderCell: (params) => {
                return(
                    <div>
                        <IconButton onClick={() => handleEditClick(params.row)}>
                            <Edit color="warning" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(params.row.idCo)}>
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
                    Cours
                </Typography>
            </Divider>
            <Stack>
                <Dialog open={open} onClose={handleDialogClose}>
                    <DialogTitle>
                        {dialogMode === "add" ? "Ajouter un cours" : "Modifier un cours"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Remplissez les champs suivants pour {dialogMode === "add" ? "ajouter" : "modifier"} un cours.
                        </DialogContentText>
                        <TextField margin="dense" name="titre" label="Titre" type="text" fullWidth value={selectedCours.titre} onChange={handleInputChange} />
                        <TextField margin="dense" name="classe" label="Classe" type="text" fullWidth value={selectedCours.classe} onChange={handleInputChange} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Annuler</Button>
                        <Button onClick={handleSaveClick} color="success">Sauvgarder</Button>
                    </DialogActions>
                </Dialog>
                <DataGrid
                    rows={cours}
                    columns={columns}
                    autoHeight={true}
                    getRowId={(row) => row.idCo}
                />
                <Button style={{marginBottom: 20, marginTop: 20}} color="success" variant="contained" onClick={() => handleAddClick()}>
                    Ajouter
                </Button>
            </Stack>
        </Container>
    );
}
