import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Select,
  InputBase,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import AddMemberModal from '../../Modal/AddmemberModal';
import EditMemberModal from '../../Modal/EditMemberModal';
import axios from 'axios';
import { toast } from 'react-toastify';
const API = import.meta.env.VITE_API_URL;

const MemberTableMobile = () => {
  const [data, setData] = React.useState([]);
  const [filterStatus, setFilterStatus] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState(null);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API}/members/all-members`, {
        withCredentials: true,
      });
      setData(
        res.data.members.map((m) => ({
          ...m,
          id: m._id,
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

  };

  React.useEffect(() => {
    fetchMembers();
  }, []);

  const handleMarkAsPaid = async (id) => {
    try {
      const res = await axios.put(
        `${API}/${id}/pay`,
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
                lastPaidDate: dayjs(res.data.lastPaidDate).format('DD-MM-YYYY'),
              }
            : m
        )
      );
    } catch (error) {
    const errormessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Failed to mark member';

    toast.error(errormessage);
  }

  };

  const handleUndo = async (id) => {
    try {
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
                  ? dayjs(res.data.lastPaidDate).format('DD-MM-YYYY')
                  : '',
              }
            : m
        )
      );
    } catch (error) {
    const errormessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Failed to undo member';

    toast.error(errormessage);
  }

  };

  const handleDelete = async (id) => {
    try {
      await axios.delete( `${API}/members/${id}`, {
        withCredentials: true,
      });
      setData((prev) => prev.filter((m) => m._id !== id));
    }catch (error) {
    const errormessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Failed to delete member';

    toast.error(errormessage);
  }

  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedMember(null);
    setEditModalOpen(false);
  };

  const handleUpdateMember = async (updatedData) => {
    try {
      const res = await axios.put(
        `${API}/${updatedData.id}`,
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
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to update member';
      toast.error(errMsg);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchMembers();
  };

  const filteredRows = data
    .filter((m) => (filterStatus === 'All' ? true : m.status === filterStatus))
    .filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Box p={2}>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <Typography color="white">Filter by Status:</Typography>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            size="small"
            sx={{ backgroundColor: '#b8aeae', minWidth: 120 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Unpaid">Unpaid</MenuItem>
          </Select>

          <Box
            display="flex"
            backgroundColor="#b8aeae"
            borderRadius="3px"
            px={1}
            alignItems="center"
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search by name or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="button">
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={handleOpenModal}
          sx={{
            backgroundColor: '#2196f3',
            color: 'white',
            textTransform: 'none',
            fontWeight: 'bold',
            mt: { xs: 1, sm: 0 },
            whiteSpace: 'nowrap',
          }}
        >
          + Add Member
        </Button>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        {filteredRows.map((row) => (
          <Card key={row._id} sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
            <CardContent>
              <Typography fontWeight="bold">{row.name}</Typography>
              <Typography variant="body2">📞 {row.phone}</Typography>
              <Typography variant="body2">
                💰 Status:{' '}
                {row.status === 'Paid' ? (
                  <DoneIcon fontSize="small" sx={{ color: 'green' }} />
                ) : (
                  <ClearIcon fontSize="small" sx={{ color: 'red' }} />
                )}{' '}
                {row.status}
              </Typography>
              <Typography variant="body2">
                📅 Last Paid: {row.lastPaidDate || 'N/A'}
              </Typography>
              <Typography variant="body2">
                ❌ Unpaid For: {row.unpaidFor} month(s)
              </Typography>

              <Divider sx={{ my: 1, backgroundColor: '#555' }} />

              <Box display="flex" gap={1} flexWrap="wrap">
                {row.status === 'Unpaid' ? (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleMarkAsPaid(row.id)}
                    startIcon={<CurrencyRupeeIcon />}
                    sx={{ backgroundColor: '#4caf50', color: '#fff' }}
                  >
                    Mark as Paid
                  </Button>
                ) : (
                  <Button
                    size="small"
                    onClick={() => handleUndo(row.id)}
                    startIcon={<UndoIcon />}
                    sx={{ color: 'white' }}
                  >
                    Undo
                  </Button>
                )}

                <Button
                  size="small"
                  onClick={() => handleDelete(row.id)}
                  startIcon={<DeleteForeverIcon />}
                  sx={{ color: 'white' }}
                >
                  Delete
                </Button>

                <Button
                  size="small"
                  onClick={() => handleEditMember(row)}
                  startIcon={<EditIcon />}
                  sx={{ color: '#2196f3' }}
                >
                  Edit
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Add Member Modal */}
      <AddMemberModal open={isModalOpen} handleClose={handleCloseModal} />

      {/* Edit Member Modal */}
      <EditMemberModal
        open={editModalOpen}
        handleClose={handleCloseEditModal}
        member={selectedMember}
        onUpdate={handleUpdateMember}
      />
    </Box>
  );
};

export default MemberTableMobile;
