import { ReactElement } from 'react';
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks';
import IconifyIcon from '@/components/base/IconifyIcon';

const AccountDropdown = (): ReactElement => {
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'AccountDropdown',
  });

  return (
    <>
      <Box {...bindTrigger(popupState)} display="flex" alignItems="center" gap={1.25}>
        <Avatar
          src="https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe"
          alt="John Doe"
          sx={{
            width: 38,
            height: 38,
          }}
        />
        <Box display={{ xs: 'none', sm: 'block' }}>
          <Typography variant="subtitle2" lineHeight={1.6}>
            John Doe
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Admin
          </Typography>
        </Box>
      </Box>
      <Menu
        {...bindMenu(popupState)}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          mt: 2,
        }}
      >
        <MenuItem onClick={popupState.close}>
          <ListItemIcon>
            <IconifyIcon icon="mdi:account-outline" width={24} />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={popupState.close}>
          <ListItemIcon>
            <IconifyIcon icon="mdi:cash-outline" width={24} />
          </ListItemIcon>
          Billing
        </MenuItem>
        <MenuItem onClick={popupState.close}>
          <ListItemIcon>
            <IconifyIcon icon="mdi:cog-outline" width={24} />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={popupState.close}>
          <ListItemIcon>
            <IconifyIcon icon="mdi:logout" width={24} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountDropdown;
