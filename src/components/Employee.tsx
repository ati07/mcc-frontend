import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from 'react-toastify';
import { Backdrop, CircularProgress, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// const rows = [
// [
//     { id: 1, email: "atiurrahman.ansari@gmail.com", firstName: "Jon"},
//     { id: 2, email: "atiurrahman.ansari@gmail.com", firstName: "Cersei" },
//     { id: 3, email: "atiurrahman.ansari@gmail.com", firstName: "Jaime"},
//     { id: 4, email: "atiurrahman.ansari@gmail.com", firstName: "Arya" },
//     { id: 5, email: "atiurrahman.ansari@gmail.com", firstName: "Daenerys" },
//     { id: 6, email: "atiurrahman.ansari@gmail.com", firstName: "Atiur",},
//     { id: 7, email: "atiurrahman.ansari@gmail.com", firstName: "Ferrara"},
//     { id: 8, email: "atiurrahman.ansari@gmail.com", firstName: "Rossini"},
//     { id: 9, email: "atiurrahman.ansari@gmail.com", firstName: "Harvey" },
//   ]
// ];

export default function Employees({
  baseUrl,
  handleCheckboxChange,
  refetch,
  setName,
  setEmail,
  setOpen,
  setId
}: any) {
  const [rows, setEmployees] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    const response = await axios.get(baseUrl + "/employees", {
      headers: {
        Authorization:
          "Basic " + JSON.parse(localStorage.getItem("user") as any).token,
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) {
      setEmployees(
        response.data.result.map((i: any) => {
          return { id: i.sno, ...i };
        })
      );
      // toast.success("Employee created successfully!")
      setLoading(false);
    }else{
      window.location.href = "/";
      setLoading(false);
      toast.error("Please Login again!")
    }
  };




  let onChangeCheckbox = (ids: any) => {
    const selectedIDs = new Set(ids);
    const selectedRowData = rows.filter((row) => selectedIDs.has(row.id));
    // console.log(selectedRowData);
    handleCheckboxChange(selectedRowData);
  };


  const deleteUser = React.useCallback(
    (id: GridRowId) => async() => {
      setLoading(true);
        const response = await axios.delete(baseUrl + "/employees"+`/${id}`, {
          headers: {
            Authorization:
              "Basic " + JSON.parse(localStorage.getItem("user") as any).token,
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          fetchEmployees()
          toast.success("Employee deleted successfully!")
          setLoading(false);
        }
    },
    [],
  );
  const edit = React.useCallback((id: GridRowId) => () => {
    const singleRow: any = rows.filter((r: any) => r._id === id)[0]
    console.log("singleRow",rows, singleRow,id);
    setOpen(true)
    setName(singleRow.name)
    setEmail(singleRow.email)
    setId(id)
}, [rows])

  const columns: GridColDef<(typeof rows)[number]>[] = [
    // { field: "id", headerName: "S.No", width: 90 },
    { field: "name",headerName: "Name",flex: 0.4,width: 150,editable: false},
    { field: "email",headerName: "Email",flex: 0.4,sortable: false,width: 250},
    { field: 'actions',flex: 0.2,headerName: 'Actions',type: 'actions',
      // cellClassName: 'super-app-theme--cell',
      headerClassName: 'data-header',
      getActions: (params: any) => [
          <GridActionsCellItem
              icon={<Tooltip title="Edit"><EditIcon sx={{ fontSize: '10px' }} /></Tooltip>}
              label="Edit"
              onClick={edit(params.row._id)}
          // showInMenu
          />,
          <GridActionsCellItem
              icon={<Tooltip title="Delete"><DeleteIcon sx={{ fontSize: '10px' }} /></Tooltip>}
              label="Delete"
              onClick={deleteUser(params.row._id)}  
          />
      ]
  }
  ];

  React.useEffect(() => {
    if (localStorage.getItem("user")) {
      // Fetch employees
      fetchEmployees();
    }
  }, [refetch]);
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={onChangeCheckbox}
      />
    </Box>
  );
}
