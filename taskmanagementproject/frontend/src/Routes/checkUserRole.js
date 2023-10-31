const checkUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user?.role;
  
    if (userRole === 'admin') {
      // console.log('admin');
      return 'admin';
    } else if (userRole === 'user') {
      // console.log('user');
      return 'user';
    } else {
      // console.log('unknown')
      return 'unknown';
    }
  };
  
  export default checkUserRole;