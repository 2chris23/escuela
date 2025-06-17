import { useState } from 'react';
import {
  Collapse,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
}
from '@mui/material';

import IconifyIcon from '@/components/base/IconifyIcon';
import { NavItem } from '@/data/nav-items';

interface NavButtonProps {
  navItem: NavItem;
  Link: typeof Link;
}

const NavButton = ({ navItem, Link }: NavButtonProps) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleOpen = () => setOpen(!open);

  if (navItem.collapsible) {
    return (
      <>
        <ListItem
          disablePadding
          sx={{
            display: 'block',
            my: 0.5,
          }}
        >
          <ListItemButton
            onClick={handleOpen}
            sx={{
              minHeight: 48,
              borderRadius: 2.5,
              justifyContent: navItem.collapsible ? 'initial' : 'center',
              px: 2.5,
              bgcolor: navItem.active ? theme.palette.grey[100] : 'transparent',
              color: 'text.primary',
              opacity: navItem.active ? 1 : 0.75,
              '&:hover': {
                bgcolor: theme.palette.grey[100],
                opacity: 1,
              },
            }}
          >
            {navItem.icon && (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: navItem.collapsible ? 1.5 : 'auto',
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                <IconifyIcon icon={navItem.icon} width={24} />
              </ListItemIcon>
            )}
            <ListItemText
              primary={navItem.title}
              sx={{
                opacity: navItem.collapsible ? 1 : 0,
                color: 'inherit',
              }}
            />
            {navItem.collapsible && (
              <IconifyIcon
                icon={open ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'}
                width={16}
              />
            )}
          </ListItemButton>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {navItem.sublist?.map((item: NavItem, index: number) => (
              <NavButton navItem={item} key={index} Link={Link} />
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItem
      disablePadding
      sx={{
        display: 'block',
        my: 0.5,
      }}
    >
      <ListItemButton
        LinkComponent={Link}
        href={navItem.path}
        sx={{
          minHeight: 48,
          borderRadius: 2.5,
          justifyContent: navItem.collapsible ? 'initial' : 'center',
          px: 2.5,
          bgcolor: navItem.active ? theme.palette.grey[100] : 'transparent',
          color: 'text.primary',
          opacity: navItem.active ? 1 : 0.75,
          '&:hover': {
            bgcolor: theme.palette.grey[100],
            opacity: 1,
          },
        }}
      >
        {navItem.icon && (
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: navItem.collapsible ? 1.5 : 'auto',
              justifyContent: 'center',
              color: 'inherit',
            }}
          >
            <IconifyIcon icon={navItem.icon} width={24} />
          </ListItemIcon>
        )}
        <ListItemText
          primary={navItem.title}
          sx={{
            opacity: navItem.collapsible ? 1 : 0,
            color: 'inherit',
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default NavButton; 