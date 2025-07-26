import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useMediaQuery,
  Box,
  Stack,
  Button,
  Drawer,
  IconButton,
  CircularProgress
} from '@mui/material';
import Logo from '../assets/images/logo.png';
import MenuIcon from '@mui/icons-material/Menu';  // Added MenuIcon import
import ProfileModal from '../Modal/ProfileModal.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
const API = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery('(max-width:900px)');
  const navigate = useNavigate();
  const { logout, isLoggedIn } = useAuth();

  const [openProfileModal, setOpenProfileModal] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/auth/logout`, // Corrected URL template string
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Corrected Bearer token syntax
          },
        }
      );

      logout();
      toast.success('Logged out successfully.');
      navigate('/');

    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate('/user');
    } else {
      navigate('/');
    }
  };

  const guestNavItems = [
    { text: 'Home', link: '/' },
    { text: 'Login', link: '/login' },
  ];

  const loggedInNavItems = [
    { text: 'Home', link: '/user' },
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'Profile', action: () => setOpenProfileModal(true) },
    { text: 'Logout', action: handleLogout },
  ];

  const renderNavButtons = (mobile = false) => {
    const items = isLoggedIn ? loggedInNavItems : guestNavItems;

    return items.map((item) =>
      item.link ? (
        <Button
          key={item.text}
          component={Link}
          to={item.link}
          onClick={() => mobile && setOpenDrawer(false)}
          variant="text"
          sx={{
            color: '#aaa',
            fontSize: '15px',
            justifyContent: mobile ? 'flex-start' : 'center',
            '&:hover': { color: '#d32f2f' },
          }}
        >
          {item.text}
        </Button>
      ) : item.text === 'Logout' && loading ? (
        <Button
          key={item.text}
          disabled
          variant="text"
          sx={{
            color: '#aaa',
            fontSize: '15px',
            justifyContent: mobile ? 'flex-start' : 'center',
          }}
        >
          <CircularProgress size={20} sx={{ color: '#fff' }} />
        </Button>
      ) : (
        <Button
          key={item.text}
          onClick={() => {
            item.action();
            if (mobile) setOpenDrawer(false);
          }}
          variant="text"
          sx={{
            color: '#aaa',
            fontSize: '15px',
            justifyContent: mobile ? 'flex-start' : 'center',
            '&:hover': { color: '#d32f2f' },
          }}
        >
          {item.text}
        </Button>
      )
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: '#000',
        px: { xs: 2, sm: 4 },
        py: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="space-between"
        spacing={{ xs: 1, sm: 0 }}
      >
        <Box onClick={handleLogoClick} sx={{ cursor: 'pointer' }}>
          <img
            src={Logo}
            alt="logo"
            style={{
              width: '48px',
              height: '48px',
              transition: 'transform 0.3s ease-in-out',
              filter: 'brightness(0.7)',
              objectFit: 'cover',
              borderRadius: '20%',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = 'scale(1.1)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = 'scale(1)')
            }
          />
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
          alignItems="center"
        >
          {isMobile && (
            <IconButton
              onClick={() => setOpenDrawer(true)}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                color: '#fff',
                zIndex: 1200,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Drawer for mobile */}
          <Drawer
            anchor="left"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
          >
            <Box
              sx={{
                width: 250,
                p: 3,
                background: '#121212',
                height: '100%',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {renderNavButtons(true)}
            </Box>
          </Drawer>

          {/* Buttons in desktop nav */}
          {!isMobile && renderNavButtons(false)}
        </Stack>
      </Stack>

      {/* Modals */}
      <ProfileModal
        open={openProfileModal}
        handleClose={() => setOpenProfileModal(false)}
      />
    </Box>
  );
};

export default Navbar;


//ICON CODE

//import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   useMediaQuery,
//   Box,
//   Stack,
//   Button,
//   IconButton,
//   CircularProgress
// } from '@mui/material';
// import Logo from '../assets/images/logo.png';
// import HomeIcon from '@mui/icons-material/Home';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PersonIcon from '@mui/icons-material/Person';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// // import LoginIcon from '@mui/icons-material/Login';
// import ProfileModal from '../Modal/ProfileModal.jsx';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useAuth } from '../context/AuthContext.jsx';
// const API = import.meta.env.VITE_API_URL;

// const Navbar = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { logout, isLoggedIn } = useAuth();

//   const [openProfileModal, setOpenProfileModal] = useState(false);

//   const handleLogout = async () => {
//     try {
//       setLoading(true);
//       await axios.post(`${API}/auth/logout`, {}, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Send token from localStorage
//         },
//       });

//       logout();
//       toast.success('Logged out successfully.');
//       navigate('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     } finally {
//       setLoading(false); // stop loading
//     }
//   };

//   const handleLogoClick = () => {
//     if (isLoggedIn) {
//       navigate('/user');
//     } else {
//       navigate('/');
//     }
//   };

//   const guestNavItems = [
//     { icon: <HomeIcon />, link: '/' },
//     { icon: <PersonIcon />, link: '/login' },
//   ];

//   const loggedInNavItems = [
//     { icon: <HomeIcon />, link: '/user' },
//     // { icon: <DashboardIcon />, link: '/dashboard' },
//     { icon: <PersonIcon />, action: () => setOpenProfileModal(true) },
//     { icon: <ExitToAppIcon />, action: handleLogout },
//   ];

//   const renderNavButtons = () => {
//     const items = isLoggedIn ? loggedInNavItems : guestNavItems;

//     return items.map((item) =>
//       item.link ? (
//         <IconButton
//           key={item.link}
//           component={Link}
//           to={item.link}
//           sx={{
//             color: '#aaa',
//             fontSize: '24px',
//             '&:hover': { color: '#d32f2f' },
//           }}
//         >
//           {item.icon}
//         </IconButton>
//       ) : item.text === 'Logout' && loading ? (
//         <IconButton
//           key={item.text}
//           disabled
//           sx={{
//             color: '#aaa',
//             fontSize: '24px',
//           }}
//         >
//           <CircularProgress size={20} sx={{ color: '#fff' }} />
//         </IconButton>
//       ) : (
//         <IconButton
//           key={item.text}
//           onClick={() => {
//             item.action();
//           }}
//           sx={{
//             color: '#aaa',
//             fontSize: '24px',
//             '&:hover': { color: '#d32f2f' },
//           }}
//         >
//           {item.icon}
//         </IconButton>
//       )
//     );
//   };

//   return (
//     <Box
//       sx={{
//         backgroundColor: '#000',
//         px: { xs: 2, sm: 4 },
//         py: 2,
//         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//         position: 'sticky',
//         top: 0,
//         zIndex: 1000,
//       }}
//     >
//       <Stack
//         direction="row"
//         alignItems="center"
//         justifyContent="space-between"
//         spacing={2}
//       >
//         <Box onClick={handleLogoClick} sx={{ cursor: 'pointer' }}>
//           <img
//             src={Logo}
//             alt="logo"
//             style={{
//               width: '48px',
//               height: '48px',
//               transition: 'transform 0.3s ease-in-out',
//               filter: 'brightness(0.7)',
//               objectFit: 'cover',
//               borderRadius: '20%',
//             }}
//             onMouseOver={(e) =>
//               (e.currentTarget.style.transform = 'scale(1.1)')
//             }
//             onMouseOut={(e) =>
//               (e.currentTarget.style.transform = 'scale(1)')
//             }
//           />
//         </Box>

//         <Stack direction="row" spacing={2} alignItems="center">
//           {renderNavButtons()}
//         </Stack>
//       </Stack>

//       {/* Modals */}
//       <ProfileModal
//         open={openProfileModal}
//         handleClose={() => setOpenProfileModal(false)}
//       />
//     </Box>
//   );
// };

// export default Navbar;

