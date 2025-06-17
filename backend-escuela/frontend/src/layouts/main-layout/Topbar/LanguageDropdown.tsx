import { ReactElement, useState } from 'react';
import {
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';

import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks';
import IconifyIcon from '@/components/base/IconifyIcon';

interface Language {
  title: string;
  icon: string;
}

const languages: Language[] = [
  {
    title: 'English',
    icon: 'flagpack:gb-nir',
  },
  {
    title: 'Spanish',
    icon: 'flagpack:es',
  },
  {
    title: 'French',
    icon: 'flagpack:fr',
  },
  {
    title: 'German',
    icon: 'flagpack:de',
  },
];

const LanguageDropdown = (): ReactElement => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'LanguageDropdown',
  });

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    popupState.close();
  };

  return (
    <>
      <Button
        color="inherit"
        id="language-dropdown-button"
        aria-controls={popupState.isOpen ? 'language-dropdown-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={popupState.isOpen ? 'true' : undefined}
        {...bindTrigger(popupState)}
        sx={{
          gap: 1.25,
          px: 1.25,
          py: 0.75,
          bgcolor: 'inherit',
        }}
      >
        <IconifyIcon icon={selectedLanguage.icon} width={24} height={24} />
        <Typography variant="body1" component="p" display={{ xs: 'none', sm: 'block' }}>
          {selectedLanguage.title}
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <IconifyIcon
            icon="ion:caret-down-outline"
            width={24}
            height={24}
            color="text.primary"
          />
        </Box>
      </Button>
      <Menu
        id="language-dropdown-menu"
        {...bindMenu(popupState)}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          mt: 2,
        }}
      >
        {languages.map((language: Language, index: number) => (
          <MenuItem key={index} onClick={() => handleLanguageChange(language)}>
            <ListItemIcon>
              <IconifyIcon icon={language.icon} width={24} height={24} />
            </ListItemIcon>
            <Typography variant="body1" component="p">
              {language.title}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageDropdown; 