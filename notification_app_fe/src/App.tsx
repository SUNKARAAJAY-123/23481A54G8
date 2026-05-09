import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  Notifications,
  Assessment,
  Settings,
  Person,
  Notifications as NotificationsIcon,
  Send,
  Search,
  FilterList,
} from '@mui/icons-material';
import { Log } from './logger';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  package: string;
  message: string;
}

interface NotificationForm {
  title: string;
  message: string;
  type: 'Email' | 'SMS' | 'Push';
  priority: 'Low' | 'Medium' | 'High';
}

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationForm>({
    title: '',
    message: '',
    type: 'Email',
    priority: 'Medium',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  // Dummy data
  useEffect(() => {
    const dummyLogs: LogEntry[] = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        level: 'info',
        package: 'component',
        message: 'Notification sent successfully',
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        level: 'warn',
        package: 'api',
        message: 'API rate limit approaching',
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        level: 'error',
        package: 'auth',
        message: 'Authentication failed',
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        level: 'debug',
        package: 'utils',
        message: 'Cache cleared',
      },
    ];
    setLogs(dummyLogs);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSendNotification = async () => {
    if (!notification.title.trim() || !notification.message.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      await Log(
        'frontend',
        notification.priority === 'High' ? 'error' : notification.priority === 'Medium' ? 'warn' : 'info',
        'component',
        `Notification: ${notification.title} - ${notification.message} (${notification.type})`
      );

      const newLog: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        level: notification.priority === 'High' ? 'error' : notification.priority === 'Medium' ? 'warn' : 'info',
        package: 'component',
        message: `Notification: ${notification.title} - ${notification.message} (${notification.type})`,
      };

      setLogs(prev => [newLog, ...prev]);
      setNotification({
        title: '',
        message: '',
        type: 'Email',
        priority: 'Medium',
      });
      setSnackbar({
        open: true,
        message: 'Notification sent successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send notification',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'all' || log.level === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: logs.length,
    success: logs.filter(log => log.level === 'info').length,
    warning: logs.filter(log => log.level === 'warn').length,
    error: logs.filter(log => log.level === 'error').length,
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          NMS
        </Typography>
      </Toolbar>
      <List>
        {[
          { text: 'Dashboard', icon: <Dashboard />, id: 'dashboard' },
          { text: 'Notifications', icon: <Notifications />, id: 'notifications' },
          { text: 'Logs', icon: <Assessment />, id: 'logs' },
          { text: 'Settings', icon: <Settings />, id: 'settings' },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={activeSection === item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: activeSection === item.id ? 'white' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ color: activeSection === item.id ? 'white' : 'inherit' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <Dashboard />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Notification Management System
            </Typography>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit">
              <Avatar sx={{ width: 32, height: 32, ml: 1 }}>
                <Person />
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />

          {activeSection === 'dashboard' && (
            <>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Dashboard Overview
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Notifications
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stats.total}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Success Logs
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ color: 'success.main' }}>
                        {stats.success}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Warning Logs
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ color: 'warning.main' }}>
                        {stats.warning}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Error Logs
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ color: 'error.main' }}>
                        {stats.error}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Send Notification
                      </Typography>
                      <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                        <TextField
                          fullWidth
                          label="Notification Title"
                          value={notification.title}
                          onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                        <TextField
                          fullWidth
                          label="Message"
                          multiline
                          rows={3}
                          value={notification.message}
                          onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
                          required
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel>Type</InputLabel>
                              <Select
                                value={notification.type}
                                label="Type"
                                onChange={(e) => setNotification(prev => ({ ...prev, type: e.target.value as any }))}
                              >
                                <MenuItem value="Email">Email</MenuItem>
                                <MenuItem value="SMS">SMS</MenuItem>
                                <MenuItem value="Push">Push</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel>Priority</InputLabel>
                              <Select
                                value={notification.priority}
                                label="Priority"
                                onChange={(e) => setNotification(prev => ({ ...prev, priority: e.target.value as any }))}
                              >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Button
                          variant="contained"
                          startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                          onClick={handleSendNotification}
                          disabled={loading}
                          sx={{ mt: 2 }}
                        >
                          {loading ? 'Sending...' : 'Send Notification'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recent Activity
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          size="small"
                          placeholder="Search logs..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                          }}
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Filter</InputLabel>
                          <Select
                            value={filterLevel}
                            label="Filter"
                            onChange={(e) => setFilterLevel(e.target.value)}
                          >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="info">Info</MenuItem>
                            <MenuItem value="warn">Warning</MenuItem>
                            <MenuItem value="error">Error</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Time</TableCell>
                              <TableCell>Level</TableCell>
                              <TableCell>Package</TableCell>
                              <TableCell>Message</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredLogs.slice(0, 5).map((log) => (
                              <TableRow key={log.id}>
                                <TableCell>
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={log.level}
                                    size="small"
                                    color={
                                      log.level === 'error' ? 'error' :
                                      log.level === 'warn' ? 'warning' : 'success'
                                    }
                                  />
                                </TableCell>
                                <TableCell>{log.package}</TableCell>
                                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {log.message}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}

          {activeSection === 'notifications' && (
            <Typography variant="h4">Notifications Section</Typography>
          )}

          {activeSection === 'logs' && (
            <Typography variant="h4">Logs Section</Typography>
          )}

          {activeSection === 'settings' && (
            <Typography variant="h4">Settings Section</Typography>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;