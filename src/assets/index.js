// Icon and image imports
import carIcon1 from './images/vehicles/car1.svg';
import carIcon2 from './images/vehicles/car2.svg';
import carIcon3 from './images/vehicles/car3.svg';
import carIcon4 from './images/vehicles/car4.svg';
import carIcon5 from './images/vehicles/car5.svg';
import carIcon6 from './images/vehicles/car6.svg';

// Icon imports
import plusIcon from './images/icons/plus.svg';
import minusIcon from './images/icons/minus.svg';
import searchIcon from './images/icons/search.svg';
import chevronRightIcon from './images/icons/chevron-right.svg';
import chevronLeftIcon from './images/icons/chevron-left.svg';
import chevronDownIcon from './images/icons/chevron-down.svg';
import chevronUpIcon from './images/icons/chevron-up.svg';
import targetIcon from './images/icons/target.svg';
import logoutIcon from './images/icons/log-out.svg';
import userIcon from './images/icons/user.svg';

// Logo and background imports
import logo from './images/logo.svg';
import darkBackground from './images/backgrounds/dark-bg.svg';
import lightBackground from './images/backgrounds/light-bg.svg';

// Helper function to get vehicle images by ID
export const getVehicleImageById = (id) => {
  const images = {
    1: carIcon1,
    2: carIcon2,
    3: carIcon3,
    4: carIcon4,
    5: carIcon5,
    6: carIcon6,
  };
  return images[id] || carIcon1; // Default to carIcon1 if ID not found
};

// Helper function to get random vehicle image
export const getRandomVehicleImage = () => {
  const images = [carIcon1, carIcon2, carIcon3, carIcon4, carIcon5, carIcon6];
  return images[Math.floor(Math.random() * images.length)];
};

// Export all icons for easy access
export const Icons = {
  plus: plusIcon,
  minus: minusIcon,
  search: searchIcon,
  chevronRight: chevronRightIcon,
  chevronLeft: chevronLeftIcon,
  chevronDown: chevronDownIcon,
  chevronUp: chevronUpIcon,
  target: targetIcon,
  logout: logoutIcon,
  user: userIcon,
};

// Export backgrounds and logos
export const Backgrounds = {
  dark: darkBackground,
  light: lightBackground,
};

export const Logo = logo;

// Default export for all assets
const Assets = {
  vehicles: {
    car1: carIcon1,
    car2: carIcon2,
    car3: carIcon3,
    car4: carIcon4,
    car5: carIcon5,
    car6: carIcon6,
    getById: getVehicleImageById,
    getRandom: getRandomVehicleImage,
  },
  icons: Icons,
  backgrounds: Backgrounds,
  logo: Logo,
};

export default Assets;
