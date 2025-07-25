import React from 'react';
import {
  Box,
  MenuItem,
  Select,
  Typography,
  Button,
  IconButton,
  keyframes,
  InputBase,
  CircularProgress
} from '@mui/material';
import { DataGrid ,GridOverlay } from '@mui/x-data-grid';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import AddMemberModal from '../../Modal/AddmemberModal';
import EditMemberModal from '../../Modal/EditMemberModal';
import axios from 'axios';
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
const API = import.meta.env.VITE_API_URL;



const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MemberTableDesktop = () => {
  const [data, setData] = React.useState([]);
  const [filterStatus, setFilterStatus] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

const [editModalOpen, setEditModalOpen] = React.useState(false);
const [selectedMember, setSelectedMember] = React.useState(null);

const [loading, setLoading] = React.useState(false);
const [loadingId, setLoadingId] = React.useState(null);
const [loadingType, setLoadingType] = React.useState('');



const handleEditMember = (member) => {
  setSelectedMember(member);
  setEditModalOpen(true);
};

const handleCloseEditModal = () => {
  setEditModalOpen(false);
  setSelectedMember(null);
};
const CustomNoRowsOverlay = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#aaa',
    }}
  >
    <Typography variant="h6" fontWeight="bold">No Members Found</Typography>
    <Typography variant="body2">Click “+ Add Member” to get started</Typography>
  </Box>
);



 const fetchMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/members/all-members`, {
        withCredentials: true,
      });
     setData(
  res.data.members.map((m) => ({
    ...m,
    id: m._id,
    lastPaidDate:  dayjs(m.lastPaidDate).format('DD MMMM YYYY')
  }))
);
toast.info(res.data.message);
    } catch (error) {
      const errormessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Failed to get members';
      
          toast.error(errormessage);
    }
    finally {
    setLoading(false);
  }
  };

React.useEffect(() => {
  fetchMembers();
}, []);



  const handleFilterChange = (e) => setFilterStatus(e.target.value);

  const filteredRows = data
    .filter((member) =>
      filterStatus === 'All' ? true : member.status === filterStatus
    )
    .filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );


const markAsPaid = async (id) => {
  try {
     setLoadingId(id);
    setLoadingType('pay');
    const res = await axios.put(
      `${API}/members/${id}/pay`,
      {},
      { withCredentials: true }
    );
    setData((prev) =>
      prev.map((m) =>
        m._id === id
          ? {
              ...m,
              status: 'Paid',
              unpaidFor: 0,
              lastPaidDate: dayjs(res.data.lastPaidDate).format('DD MMM YYYY'),
            }
          : m
      )
    );

  } catch (error) {
   const errormessage =
         error.response?.data?.error ||
         error.response?.data?.message ||
         'Failed to update payment status';
   
       toast.error(errormessage);
    
  }
    finally {
    setLoadingId(null);
    setLoadingType('');
  }
};


  const handleUndoMarkAsPaid = async (id) => {
  try {
      setLoadingId(id);
    setLoadingType('undo');
    const res = await axios.put(
      `${API}/members/${id}/undo`,
      {},
      { withCredentials: true }
    );

    setData((prev) =>
      prev.map((m) =>
        m._id === id
          ? {
              ...m,
              status: 'Unpaid',
              unpaidFor: res.data.unpaidFor,
              lastPaidDate: res.data.lastPaidDate
                ? dayjs(res.data.lastPaidDate).format('DD MMM YYYY')
                : '',
            }
          : m
      )
    );
  } catch (error) {
   const errormessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Failed to Undo member';

    toast.error(errormessage);
  }
  finally {
    setLoadingId(null);
    setLoadingType('');
  }
};


 const handleDeleteMember = async (id) => {
  try {
 setLoadingId(id);
    setLoadingType('delete');
    await axios.delete(`${API}/members/${id}`, {
      withCredentials: true,
    });

    setData((prev) => prev.filter((member) => member.id !== id)); 
  } 
  catch (error) {
   const errormessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Failed to delete member';

    toast.error(errormessage);
  }
   finally {
    setLoadingId(null);
    setLoadingType('');}
  }

const handleUpdateMember = async (updatedData) => {
  try {
    setLoading(true)
    const res = await axios.put(
      `${API}/members/${updatedData.id}`,
      updatedData,
      { withCredentials: true }
    );

    setData((prev) =>
      prev.map((m) =>
        m.id === updatedData.id ? { ...m, ...updatedData } : m
      )
    );
    toast.success('Member updated successfully!');
    handleCloseEditModal();
  } catch (error) {
    const errormessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
         'Failed to update member';
    
        toast.error(errormessage);
  }
  finally {
    setLoading(false);
  }
};



  const handleOpenModal = () => setIsModalOpen(true);
 const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchMembers();
  };


  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell',
      sortable: false,
    },
    { field: 'phone', headerName: 'Contact Details', flex: 1,sortable: false, },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      sortable: false,
      renderCell: ({ row: { status } }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          py="5px"
          px="10px"
          fontWeight="bold"
          color="#fff"
          sx={{
            backgroundColor: status === 'Paid' ? '' : '#8B0000',
          }}
        >
          {status === 'Paid' ? (
            <DoneIcon sx={{ mr: 1 }} />
          ) : (
            <ClearIcon sx={{ mr: 1 }} />
          )}
          {status}
        </Box>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
         {row.status === 'Unpaid' ? (
  <Button
    variant="contained"
    size="small"
    onClick={() => markAsPaid(row.id)}
    startIcon={
      loadingId === row.id && loadingType === 'pay' ? (
        <CircularProgress size={18} sx={{ color: 'white' }} />
      ) : (
        <CurrencyRupeeIcon />
      )
    }
    sx={{
      backgroundColor: '#4caf50',
      color: '#fff',
      textTransform: 'none',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: '#388e3c',
      },
    }}
  >
    {loadingId === row.id && loadingType === 'pay' ? 'Processing' : 'Mark as Paid'}
  </Button>
) : (
  <Button
    size="small"
    onClick={() => handleUndoMarkAsPaid(row.id)}
    startIcon={
      loadingId === row.id && loadingType === 'undo' ? (
        <CircularProgress size={18} sx={{ color: 'white' }} />
      ) : (
        <UndoIcon />
      )
    }
    sx={{
      color: 'white',
      textTransform: 'none',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: '#8B0000',
      },
    }}
  >
    {loadingId === row.id && loadingType === 'undo' ? 'Reverting' : 'Undo'}
  </Button>
)}

        </Box>
      ),
    },
    { field: 'lastPaidDate', headerName: 'Last Paid', flex: 1,sortable: false, },
    { field: 'unpaidFor', headerName: 'Unpaid (Months)', flex: 1,sortable: false, },
    {
      field: 'delete',
      headerName: 'Delete Member',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
       <Button
  onClick={() => handleDeleteMember(row.id)}
  sx={{
    '&:hover': {
      backgroundColor: '#8B0000',
      color: 'white',
    },
  }}
>
  {loadingId === row.id && loadingType === 'delete' ? (
    <CircularProgress size={18} sx={{ color: 'white' }} />
  ) : (
    <DeleteForeverIcon />
  )}
</Button>

      ),
    },
        {
  field: 'edit',
  headerName: 'Edit Member',
  flex: 1,
  sortable: false,
  renderCell: ({ row }) => (
    <Button
      onClick={() => handleEditMember(row)}
      sx={{
        color: '#2196f3',
        fontWeight: 'bold',
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#8B0000',
        },
      }}
    >
      <EditIcon/>
    </Button>
  ),
},
  ];

  return (
    <Box
      sx={{
        width: '100%',
        height: '75vh',
        padding: 7,
        animation: `${fadeIn} 0.3s ease-out`,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        mb={2}
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1" fontWeight={500} color="white">
            Filter by Status:
          </Typography>
          <Select
            value={filterStatus}
            onChange={handleFilterChange}
            size="small"
            sx={{
              backgroundColor: '#b8aeae',
              color: 'black',
              borderRadius: 1,
              fontWeight: 500,
              minWidth: 120,
              '& .MuiSelect-icon': { color: 'black' },
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Unpaid">Unpaid</MenuItem>
          </Select>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
          <Box
            display="flex"
            backgroundColor="#b8aeae"
            borderRadius="3px"
            px={1}
            alignItems="center"
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              type="text"
              placeholder="Search by name or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="button">
              <SearchIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            onClick={handleOpenModal}
            sx={{
              backgroundColor: '#2196f3',
              color: 'white',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
            }}
          >
            + Add Member
          </Button>
        </Box>
      </Box>

      {loading ? (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="400px"
  >
    <CircularProgress sx={{ color: 'white' }} size={40} />
  </Box>
) :(<DataGrid
        rows={filteredRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        disableColumnResize
        disableSelectionOnClick
        disableColumnMenu
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        sx={{
          height: '500px',
          background: 'linear-gradient(to right, #000000, #1a1a1a)',
          color: 'white',
          border: 'none',
          fontSize: '14px',
          borderRadius: '20px',
          '& .MuiDataGrid-cell': { border: 'none' },
          '& .name-column--cell': { color: 'red' },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#787474',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#2c2c2c',
            transform: 'scale(1.01)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            transition: 'all 250ms cubic-bezier(0.2, 0.8, 0.25, 1)',
            zIndex: 1,
            cursor: 'pointer',
            borderRadius: '10px',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: '#1a1a1a',
            color: 'white',
          },
          '& .MuiDataGrid-footerContainer': {

            color: 'white',
            background: 'linear-gradient(to right, #000000, #1a1a1a)',
            border: 'none',
          },
                    '& .MuiDataGrid-row.Mui-selected:hover': {
            backgroundColor: '#1a1a1a',
            border:'none'
          },         
           '& .MuiTablePagination-root': {
            color: 'white',
          },
          '& .MuiSvgIcon-root': {
            color: 'white',
            fill: 'white',
          },


        }}
      />
      )}

      {/* Modal */}
      <AddMemberModal
        open={isModalOpen}
        handleClose={handleCloseModal}
      />
      <EditMemberModal
        loading={loading}
  open={editModalOpen}
  handleClose={handleCloseEditModal}
  member={selectedMember}
  onUpdate={handleUpdateMember}
/>

    </Box>
  );
};

export default MemberTableDesktop;
