const capitalizePathname = (pathname: string): string => {
  const path = pathname.split('/').pop();
  if (!path) {
    return '';
  }
  return path.charAt(0).toUpperCase() + path.slice(1);
};

export default capitalizePathname; 